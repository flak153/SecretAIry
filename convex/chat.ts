import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";
import { api } from "./_generated/api";

// Get chat history for a user
export const getMessages = query({
  args: {
    userId: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_user_and_time", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(args.limit || 50);
    
    return messages.reverse();
  },
});

// Send a message from the user
export const sendMessage = mutation({
  args: {
    userId: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const messageId = await ctx.db.insert("messages", {
      userId: args.userId,
      role: "user",
      content: args.content,
      timestamp: new Date().toISOString(),
    });
    
    return messageId;
  },
});

// Save AI response
export const saveAIResponse = mutation({
  args: {
    userId: v.string(),
    content: v.string(),
    relatedEventIds: v.optional(v.array(v.id("events"))),
    action: v.optional(v.object({
      type: v.union(
        v.literal("create_event"),
        v.literal("update_event"),
        v.literal("delete_event"),
        v.literal("suggest_reschedule"),
        v.literal("conflict_resolution")
      ),
      status: v.union(v.literal("pending"), v.literal("completed"), v.literal("cancelled")),
      eventId: v.optional(v.id("events")),
    })),
  },
  handler: async (ctx, args) => {
    const messageId = await ctx.db.insert("messages", {
      ...args,
      role: "assistant",
      timestamp: new Date().toISOString(),
    });
    
    return messageId;
  },
});

// Process user message with AI
export const processUserMessage = action({
  args: {
    userId: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    // Save user message
    await ctx.runMutation(api.chat.sendMessage, {
      userId: args.userId,
      content: args.message,
    });
    
    // Get user's events for context
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const events = await ctx.runQuery(api.events.getEvents, {
      userId: args.userId,
      startDate: today.toISOString(),
      endDate: nextWeek.toISOString(),
    });
    
    // Simple AI response logic (to be replaced with actual AI integration)
    let aiResponse = "";
    let action = null;
    let relatedEventIds = [];
    
    const lowerMessage = args.message.toLowerCase();
    
    if (lowerMessage.includes("schedule") || lowerMessage.includes("meeting")) {
      aiResponse = "I'd be happy to help you schedule a meeting. What time works best for you, and what's the meeting about?";
      action = {
        type: "create_event" as const,
        status: "pending" as const,
      };
    } else if (lowerMessage.includes("free") || lowerMessage.includes("available")) {
      const freeSlots = findFreeSlots(events);
      aiResponse = `Based on your calendar, you have these free slots in the next few days:\n${freeSlots}`;
    } else if (lowerMessage.includes("today") || lowerMessage.includes("my day")) {
      const todayEvents = events.filter(e => 
        new Date(e.startTime).toDateString() === today.toDateString()
      );
      
      if (todayEvents.length === 0) {
        aiResponse = "You have a clear schedule today! No meetings or events scheduled.";
      } else {
        aiResponse = `Here's your schedule for today:\n\n${todayEvents.map(e => 
          `• ${new Date(e.startTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} - ${e.title} (${e.calendar})`
        ).join('\n')}`;
        relatedEventIds = todayEvents.map(e => e._id);
      }
    } else if (lowerMessage.includes("conflict")) {
      aiResponse = "I'll check for any scheduling conflicts. Let me analyze your calendar...";
    } else {
      aiResponse = "I'm here to help with your calendar. You can ask me to:\n• Show your schedule\n• Find free time\n• Schedule meetings\n• Check for conflicts\n• Move or cancel events";
    }
    
    // Save AI response
    await ctx.runMutation(api.chat.saveAIResponse, {
      userId: args.userId,
      content: aiResponse,
      relatedEventIds: relatedEventIds.length > 0 ? relatedEventIds : undefined,
      action: action,
    });
    
    return aiResponse;
  },
});

// Helper function to find free slots
function findFreeSlots(events: any[]) {
  // Simple implementation - in production, this would be more sophisticated
  const workStart = 9; // 9 AM
  const workEnd = 17; // 5 PM
  const slots: string[] = [];
  
  const today = new Date();
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
  
  // Check today and tomorrow
  [today, tomorrow].forEach(day => {
    const dayEvents = events.filter(e => 
      new Date(e.startTime).toDateString() === day.toDateString()
    );
    
    if (dayEvents.length === 0) {
      slots.push(`${day.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}: All day free (${workStart}:00 AM - ${workEnd}:00 PM)`);
    } else {
      // Find gaps between events
      const sortedEvents = dayEvents.sort((a, b) => 
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      );
      
      // Check morning slot
      const firstEvent = new Date(sortedEvents[0].startTime);
      if (firstEvent.getHours() > workStart) {
        slots.push(`${day.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}: ${workStart}:00 AM - ${firstEvent.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`);
      }
      
      // Check gaps between events
      for (let i = 0; i < sortedEvents.length - 1; i++) {
        const endTime = new Date(sortedEvents[i].endTime);
        const nextStartTime = new Date(sortedEvents[i + 1].startTime);
        
        if (nextStartTime.getTime() - endTime.getTime() > 30 * 60 * 1000) { // At least 30 min gap
          slots.push(`${day.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}: ${endTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} - ${nextStartTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`);
        }
      }
    }
  });
  
  return slots.slice(0, 5).join('\n') || "No free slots found in the immediate future.";
}
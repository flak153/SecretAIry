import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

// AI Secretary action using Claude 3 Haiku
export const processMessage = action({
  args: {
    userId: v.string(),
    message: v.string(),
    context: v.optional(v.object({
      currentTime: v.string(),
      timezone: v.string(),
      recentEvents: v.optional(v.array(v.any())),
    })),
  },
  handler: async (ctx, args) => {
    // For now, using a mock response
    // In production, you'd call Claude API here
    
    const message = args.message.toLowerCase();
    
    // Simple intent detection
    if (message.includes("schedule") || message.includes("meeting")) {
      return {
        response: "I can help you schedule that. What time works best for you?",
        action: {
          type: "schedule_event",
          status: "pending",
        },
        suggestedTimes: await findAvailableSlots(ctx, args.userId),
      };
    }
    
    if (message.includes("free") || message.includes("available")) {
      const slots = await findAvailableSlots(ctx, args.userId);
      return {
        response: `You have ${slots.length} free slots in the next few days. Would you like me to show them?`,
        availableSlots: slots,
      };
    }
    
    if (message.includes("cancel") || message.includes("reschedule")) {
      return {
        response: "Which event would you like to cancel or reschedule?",
        action: {
          type: "modify_event",
          status: "pending",
        },
      };
    }
    
    return {
      response: "I can help you manage your calendar. Try asking me to schedule a meeting, find free time, or check your upcoming events.",
    };
  },
});

// Helper to find available time slots
async function findAvailableSlots(ctx: any, userId: string) {
  // Get next 7 days of events
  const now = new Date();
  const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  
  const events = await ctx.runQuery(api.events.getEvents, {
    userId,
    startDate: now.toISOString(),
    endDate: weekFromNow.toISOString(),
  });
  
  // Find free 30-minute slots during working hours (9 AM - 5 PM)
  const slots = [];
  const workStart = 9; // 9 AM
  const workEnd = 17; // 5 PM
  
  for (let day = 0; day < 7; day++) {
    const date = new Date(now);
    date.setDate(date.getDate() + day);
    date.setHours(workStart, 0, 0, 0);
    
    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue;
    
    // Check each 30-minute slot
    for (let hour = workStart; hour < workEnd; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const slotStart = new Date(date);
        slotStart.setHours(hour, minute, 0, 0);
        const slotEnd = new Date(slotStart);
        slotEnd.setMinutes(slotEnd.getMinutes() + 30);
        
        // Check if slot conflicts with any event
        const hasConflict = events.some(event => {
          const eventStart = new Date(event.startTime);
          const eventEnd = new Date(event.endTime);
          return (slotStart < eventEnd && slotEnd > eventStart);
        });
        
        if (!hasConflict && slotStart > now) {
          slots.push({
            start: slotStart.toISOString(),
            end: slotEnd.toISOString(),
            display: `${slotStart.toLocaleDateString()} at ${slotStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
          });
        }
        
        // Limit to 10 slots for performance
        if (slots.length >= 10) return slots;
      }
    }
  }
  
  return slots;
}

// Tool definitions for Claude
export const AI_TOOLS = {
  schedule_event: {
    description: "Schedule a new calendar event",
    parameters: {
      title: "string",
      startTime: "ISO date string",
      endTime: "ISO date string",
      description: "optional string",
      location: "optional string",
    },
  },
  find_conflicts: {
    description: "Check for scheduling conflicts",
    parameters: {
      startTime: "ISO date string",
      endTime: "ISO date string",
    },
  },
  suggest_times: {
    description: "Suggest available meeting times",
    parameters: {
      duration: "number (minutes)",
      preferences: "optional object",
    },
  },
  modify_event: {
    description: "Modify or cancel an existing event",
    parameters: {
      eventId: "string",
      action: "cancel | reschedule",
      newTime: "optional ISO date string",
    },
  },
};
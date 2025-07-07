import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Get all events for a user within a date range
export const getEvents = query({
  args: {
    userId: v.string(),
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, args) => {
    const events = await ctx.db
      .query("events")
      .withIndex("by_user_and_time", (q) =>
        q
          .eq("userId", args.userId)
          .gte("startTime", args.startDate)
          .lte("startTime", args.endDate)
      )
      .collect();
    
    return events;
  },
});

// Create a new event
export const createEvent = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    startTime: v.string(),
    endTime: v.string(),
    allDay: v.boolean(),
    calendar: v.union(v.literal("work"), v.literal("personal")),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const eventId = await ctx.db.insert("events", {
      ...args,
      aiSuggested: false,
    });
    
    return eventId;
  },
});

// Update an event
export const updateEvent = mutation({
  args: {
    id: v.id("events"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    startTime: v.optional(v.string()),
    endTime: v.optional(v.string()),
    allDay: v.optional(v.boolean()),
    calendar: v.optional(v.union(v.literal("work"), v.literal("personal"))),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
    return id;
  },
});

// Delete an event
export const deleteEvent = mutation({
  args: {
    id: v.id("events"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Check for conflicts
export const checkConflicts = query({
  args: {
    userId: v.string(),
    startTime: v.string(),
    endTime: v.string(),
    excludeEventId: v.optional(v.id("events")),
  },
  handler: async (ctx, args) => {
    let conflictsQuery = ctx.db
      .query("events")
      .withIndex("by_user", (q) => q.eq("userId", args.userId));
    
    const allEvents = await conflictsQuery.collect();
    
    // Filter for actual conflicts
    const conflicts = allEvents.filter(event => {
      // Skip if it's the same event we're checking against
      if (args.excludeEventId && event._id === args.excludeEventId) {
        return false;
      }
      
      // Check if times overlap
      const eventStart = new Date(event.startTime);
      const eventEnd = new Date(event.endTime);
      const checkStart = new Date(args.startTime);
      const checkEnd = new Date(args.endTime);
      
      return (
        (checkStart >= eventStart && checkStart < eventEnd) ||
        (checkEnd > eventStart && checkEnd <= eventEnd) ||
        (checkStart <= eventStart && checkEnd >= eventEnd)
      );
    });
    
    return conflicts;
  },
});

// Sync Google Calendar events
export const syncGoogleEvents = mutation({
  args: {
    userId: v.string(),
    events: v.array(v.object({
      googleEventId: v.string(),
      title: v.string(),
      description: v.optional(v.string()),
      startTime: v.string(),
      endTime: v.string(),
      allDay: v.boolean(),
      location: v.optional(v.string()),
      attendees: v.optional(v.array(v.object({
        email: v.string(),
        name: v.optional(v.string()),
        responseStatus: v.optional(v.string()),
        self: v.optional(v.boolean()),
      }))),
    })),
  },
  handler: async (ctx, args) => {
    // Get existing Google events for this user
    const existingEvents = await ctx.db
      .query("events")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("externalCalendar"), "google"))
      .collect();
    
    const existingByGoogleId = new Map(
      existingEvents.map(e => [e.externalId, e])
    );
    
    const incomingGoogleIds = new Set(args.events.map(e => e.googleEventId));
    
    // Delete events that no longer exist in Google
    for (const existing of existingEvents) {
      if (existing.externalId && !incomingGoogleIds.has(existing.externalId)) {
        await ctx.db.delete(existing._id);
      }
    }
    
    // Insert or update events
    for (const event of args.events) {
      const existing = existingByGoogleId.get(event.googleEventId);
      
      // Categorize event
      const calendar = categorizeEvent(event);
      
      const eventData = {
        title: event.title,
        description: event.description,
        startTime: event.startTime,
        endTime: event.endTime,
        allDay: event.allDay,
        calendar,
        userId: args.userId,
        externalId: event.googleEventId,
        externalCalendar: "google" as const,
      };
      
      if (existing) {
        await ctx.db.patch(existing._id, eventData);
      } else {
        await ctx.db.insert("events", eventData);
      }
    }
    
    return { synced: args.events.length };
  },
});

// Helper function to categorize events
function categorizeEvent(event: any): "work" | "personal" {
  const title = event.title.toLowerCase();
  const description = (event.description || "").toLowerCase();
  
  // Work indicators
  const workKeywords = [
    "meeting", "standup", "review", "sync", "call", "presentation",
    "deadline", "project", "client", "team", "work", "office"
  ];
  
  // Check if any work keywords are present
  const isWork = workKeywords.some(keyword => 
    title.includes(keyword) || description.includes(keyword)
  );
  
  // Check if during work hours (9 AM - 6 PM on weekdays)
  const startDate = new Date(event.startTime);
  const hour = startDate.getHours();
  const dayOfWeek = startDate.getDay();
  const isDuringWorkHours = dayOfWeek >= 1 && dayOfWeek <= 5 && hour >= 9 && hour < 18;
  
  return isWork || isDuringWorkHours ? "work" : "personal";
}
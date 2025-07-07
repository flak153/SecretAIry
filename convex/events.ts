import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

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
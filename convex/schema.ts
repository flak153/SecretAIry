import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Tasks
  tasks: defineTable({
    text: v.string(),
    completed: v.boolean(),
    userId: v.string(),
    createdAt: v.number(),
    completedAt: v.optional(v.number()),
    order: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_completed", ["userId", "completed"])
    .index("by_user_order", ["userId", "order"]),

  // Calendar events
  events: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    startTime: v.string(), // ISO date string
    endTime: v.string(), // ISO date string
    allDay: v.boolean(),
    calendar: v.union(v.literal("work"), v.literal("personal")),
    userId: v.string(),
    location: v.optional(v.string()),
    attendees: v.optional(v.array(v.object({
      email: v.string(),
      name: v.optional(v.string()),
      responseStatus: v.optional(v.string()),
      self: v.optional(v.boolean()),
    }))),
    // For recurring events
    recurring: v.optional(v.object({
      frequency: v.union(v.literal("daily"), v.literal("weekly"), v.literal("monthly"), v.literal("yearly")),
      interval: v.number(), // every N days/weeks/months/years
      endDate: v.optional(v.string()), // when recurrence ends
      daysOfWeek: v.optional(v.array(v.number())), // for weekly: 0-6 (Sun-Sat)
    })),
    // External calendar integration
    externalId: v.optional(v.string()), // ID from Google/Outlook
    externalCalendar: v.optional(v.union(v.literal("google"), v.literal("outlook"))),
    // AI suggestions
    aiSuggested: v.optional(v.boolean()),
    aiNotes: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_time", ["userId", "startTime"])
    .index("by_external", ["externalId", "externalCalendar"]),

  // Chat messages with AI
  messages: defineTable({
    userId: v.string(),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    timestamp: v.string(),
    // For AI to reference events
    relatedEventIds: v.optional(v.array(v.id("events"))),
    // For action tracking
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
  })
    .index("by_user", ["userId"])
    .index("by_user_and_time", ["userId", "timestamp"]),

  // User preferences
  userPreferences: defineTable({
    userId: v.string(),
    workingHours: v.object({
      start: v.string(), // "09:00"
      end: v.string(),   // "17:00"
      timezone: v.string(), // "America/New_York"
    }),
    preferredMeetingDuration: v.number(), // in minutes
    bufferTime: v.number(), // minutes between meetings
    calendarSync: v.object({
      google: v.optional(v.object({
        enabled: v.boolean(),
        refreshToken: v.optional(v.string()),
        calendarId: v.optional(v.string()),
      })),
      outlook: v.optional(v.object({
        enabled: v.boolean(),
        refreshToken: v.optional(v.string()),
        calendarId: v.optional(v.string()),
      })),
    }),
    aiPreferences: v.object({
      autoReschedule: v.boolean(),
      conflictResolution: v.union(v.literal("ask"), v.literal("auto-work-priority"), v.literal("auto-personal-priority")),
      suggestOptimalTimes: v.boolean(),
    }),
    theme: v.optional(v.string()), // Skeleton theme name
  })
    .index("by_user", ["userId"]),

  // Calendar sync status
  syncStatus: defineTable({
    userId: v.string(),
    calendar: v.union(v.literal("google"), v.literal("outlook")),
    lastSync: v.string(),
    status: v.union(v.literal("syncing"), v.literal("success"), v.literal("error")),
    error: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_calendar", ["userId", "calendar"]),
});
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Simple query to get a greeting
export const getGreeting = query({
  args: {},
  handler: async (ctx) => {
    return "Hello from Convex! 👋";
  },
});

// Query with an argument
export const getPersonalizedGreeting = query({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    return `Hello ${args.name}, welcome to Convex!`;
  },
});

// Mutation to save a message
export const saveMessage = mutation({
  args: { 
    text: v.string(),
    timestamp: v.number()
  },
  handler: async (ctx, args) => {
    // In a real app, we'd save this to a table
    // For now, just return confirmation
    return {
      success: true,
      message: `Saved: "${args.text}" at ${new Date(args.timestamp).toLocaleTimeString()}`
    };
  },
});
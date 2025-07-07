import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all tasks for a user
export const getTasks = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_user_order", (q) => q.eq("userId", args.userId))
      .collect();
    
    return tasks.sort((a, b) => {
      // Completed tasks go to the bottom
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      // Otherwise sort by order
      return a.order - b.order;
    });
  },
});

// Add a new task
export const addTask = mutation({
  args: { 
    userId: v.string(),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    // Get the highest order number
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
    
    const maxOrder = tasks.reduce((max, task) => Math.max(max, task.order), 0);
    
    const taskId = await ctx.db.insert("tasks", {
      text: args.text,
      completed: false,
      userId: args.userId,
      createdAt: Date.now(),
      order: maxOrder + 1,
    });
    
    return taskId;
  },
});

// Toggle task completion
export const toggleTask = mutation({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.taskId);
    if (!task) throw new Error("Task not found");
    
    await ctx.db.patch(args.taskId, {
      completed: !task.completed,
      completedAt: !task.completed ? Date.now() : undefined,
    });
  },
});

// Delete a task
export const deleteTask = mutation({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.taskId);
  },
});

// Update task text
export const updateTask = mutation({
  args: { 
    taskId: v.id("tasks"),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.taskId, {
      text: args.text,
    });
  },
});

// Reorder tasks
export const reorderTasks = mutation({
  args: { 
    userId: v.string(),
    taskIds: v.array(v.id("tasks")),
  },
  handler: async (ctx, args) => {
    // Update order for each task
    for (let i = 0; i < args.taskIds.length; i++) {
      await ctx.db.patch(args.taskIds[i], {
        order: i + 1,
      });
    }
  },
});
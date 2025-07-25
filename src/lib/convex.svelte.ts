import { ConvexClient } from 'convex/browser';
import type { FunctionReference, FunctionReturnType, FunctionArgs } from 'convex/server';
import { PUBLIC_CONVEX_URL } from '$env/static/public';

// Initialize Convex client with error handling
if (!PUBLIC_CONVEX_URL) {
  console.error('PUBLIC_CONVEX_URL is not defined. Please check your .env file.');
}

export const convex = new ConvexClient(PUBLIC_CONVEX_URL || '');

// Simple reactive query hook for Svelte 5
export function useQuery<Query extends FunctionReference<"query">>(
  query: Query,
  args?: FunctionArgs<Query>
) {
  let value = $state<FunctionReturnType<Query> | undefined>(undefined);
  let error = $state<Error | null>(null);
  
  $effect(() => {
    // Subscribe to the query
    const unsubscribe = convex.onUpdate(query, args || {}, (newValue) => {
      if (newValue instanceof Error) {
        error = newValue;
        value = null as any;
      } else {
        value = newValue;
        error = null;
      }
    });
    
    return unsubscribe;
  });
  
  return {
    get value() { return value; },
    get error() { return error; },
    get loading() { return value === undefined && error === null; }
  };
}

// Simple mutation hook
export function useMutation<Mutation extends FunctionReference<"mutation">>(
  mutation: Mutation
) {
  return async (args: FunctionArgs<Mutation>): Promise<FunctionReturnType<Mutation>> => {
    return await convex.mutation(mutation, args);
  };
}

// Simple action hook
export function useAction<Action extends FunctionReference<"action">>(
  action: Action
) {
  return async (args: FunctionArgs<Action>): Promise<FunctionReturnType<Action>> => {
    return await convex.action(action, args);
  };
}
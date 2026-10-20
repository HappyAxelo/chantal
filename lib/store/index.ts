import { localStoreAllowed, supabaseConfigured } from "@/lib/env";
import { localStore } from "./local";
import { supabaseStore } from "./supabase";
import type { Store } from "./types";

export class StoreUnavailableError extends Error {
  constructor() {
    super("No data store is configured. Set the Supabase environment variables.");
  }
}

/**
 * Supabase when configured; otherwise the local JSON store in development.
 * In production without Supabase, forms report that submissions are
 * unavailable rather than pretending to succeed.
 */
export function getStore(): Store {
  if (supabaseConfigured) return supabaseStore;
  if (localStoreAllowed) return localStore;
  throw new StoreUnavailableError();
}

export function storeAvailable(): boolean {
  return supabaseConfigured || localStoreAllowed;
}

export * from "./types";

import type { LoggerConfig } from "@pixelic/logger";
import type {
  CacheOptions,
  CacheRequestConfig,
  NotEmptyStorageValue,
  StorageValue,
  AxiosStorage,
} from "axios-cache-interceptor";

/**
 * Options for the Mowojang Client Instance
 *
 * @example
 * ```TS
 * const options: ClientOptions = {
 *   timeout: 5000,
 *   validation: {
 *     enabled: true
 *   }
 * };
 * ```
 */
export interface ClientOptions {
  logger?: LoggerConfig;
  validation?: ValidationOptions;
  timeout?: number;
  cache?: CacheOptions;
  baseURL?: string;
  fallback?: boolean;
}

export interface AxiosOptions {
  timeout?: number;
  cache?: CacheOptions;
  fallback: boolean;
}

export interface ValidationOptions {
  enabled?: boolean;
  minimumUsernameLength?: 1 | 2;
}

/**
 * Cache helpers that proxy the internal storage from `axios-cache-interceptor`.
 *
 * WARNING: This is an API intended for very specific usecases.
 * Incorrect writes/deletes or clearing storage at the wrong time can break cache behavior or cause unexpected errors.
 *
 * @link https://github.com/Pixelicc/mowojang/blob/main/docs/custom-caching.md#internal-cache-access
 */
export type MowojangCache = readonly {
  /** Clears the entire internal cache storage. */
  readonly clear: () => Promise<void>;
  /** Sets a raw internal cache entry for a cache key. */
  readonly set: (key: string, value: NotEmptyStorageValue) => Promise<void>;
  /** Returns the raw internal cache entry for a cache key. */
  readonly get: (key: string) => Promise<StorageValue>;
  /** Deletes a raw internal cache entry by cache key. */
  readonly del: (key: string) => Promise<void>;
  /** Checks whether a cached value exists for a cache key. */
  readonly has: (key: string) => Promise<boolean>;
  /**
   * Direct reference to the internal axios-cache-interceptor storage instance.
   *
   * **DO NOT USE THIS IF YOU ARE NOT 100% SURE WHAT YOU ARE DOING.**
   *
   * @link https://axios-cache-interceptor.js.org/guide/storages
   */
  readonly _storage: AxiosStorage;
};

export interface MowojangRequestConfig {
  validation?: ValidationOptions;
  cache?: CacheRequestConfig<any, any>["cache"];
}

export type MowojangError = "INVALID_PLAYER";

export type MowojangResponse<D, E extends MowojangError | undefined> = Promise<
  | {
      data: D;
      error: null;
    }
  | {
      data: null;
      error: E extends undefined ? "UNKNOWN_ERROR" | "INVALID_INPUT" : E | "UNKNOWN_ERROR" | "INVALID_INPUT";
    }
>;

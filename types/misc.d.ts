import { CacheOptions, CacheRequestConfig } from "axios-cache-interceptor";

export type ClientOptions = {
  timeout?: number;
  cache?: CacheOptions;
};

export type AxiosOptions = {
  timeout?: number;
  cache?: CacheOptions;
};

export type MowojangRequestConfig = {
  validate?: boolean;
  cache?: CacheRequestConfig<any, any>["cache"];
};

export type MowojangError = "INVALID_PLAYER";

export type MowojangResponse<D, E extends MowojangError | undefined> = Promise<
  | {
      data: D;
      error: null;
    }
  | {
      data: null;
      error: E extends undefined ? "UNKOWN_ERROR" | "INVALID_INPUT" : E | "UNKOWN_ERROR" | "INVALID_INPUT";
    }
>;

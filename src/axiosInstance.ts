import axios from "axios";
import { AxiosCacheInstance, setupCache } from "axios-cache-interceptor";
import PackageJSON from "../package.json" with { type: "json" };
import { AxiosOptions } from "../types/index.js";

export default (options?: AxiosOptions): AxiosCacheInstance => {
  return setupCache(
    axios.create({
      timeout: options?.timeout ?? 5000,
      maxRedirects: 0,
      headers: {
        "User-Agent": `axios/${axios.VERSION} mowojang/${PackageJSON.version} (https://www.npmjs.com/package/mowojang)`,
        Accept: "application/json",
      },
    }),
    {
      methods: ["get", "post"],
      cacheTakeover: false,
      ...options?.cache,
    },
  );
};

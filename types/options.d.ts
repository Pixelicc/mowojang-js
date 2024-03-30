export interface Options {
  /**
   * Request Timeout in milliseconds
   *
   * @default 10000
   */
  timeout?: number;
  /**
   * Whether to Cache the Response and save on Network Requests.
   * This also improves Performance on duplicate Network Requests.
   *
   * @default true
   */
  cache?: boolean;
  /**
   * The time the Response will be cached for until it expires in milliseconds.
   *
   * @default 300000 (5 Minutes)
   */
  cacheTTL?: number;
  /**
   * Whether to override the currently cached Data and instead make a new Network Request.
   *
   * @default false
   */
  cacheOverride?: boolean;
}

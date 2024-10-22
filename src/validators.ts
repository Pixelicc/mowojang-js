import type { Player } from "../types/index.d.ts";
import { undashUUID } from "./utils.js";

/**
 * Validates a UUIDv4 string
 *
 */
export const validateUUID = (UUID: string): boolean => {
  if (typeof UUID !== "string") return false;
  UUID = undashUUID(UUID);
  if (UUID.length !== 32) return false;
  return /[0-9a-f]{12}4[0-9a-f]{19}/.test(UUID);
};

/**
 * Validates a Minecraft Username
 */
export const validateUsername = (username: string): boolean => {
  if (typeof username !== "string") return false;
  return /^[a-zA-Z0-9_]{1,16}$/.test(username);
};

/**
 * Validates a Minecraft Player by either validating their Username or supplied UUID
 *
 */
export const validatePlayer = (player: Player): boolean => validateUUID(player) || validateUsername(player);

export const validateArray = <T>(
  array: T[],
  validatorFunction: (item: T, ...params: any[]) => boolean,
  ...params: any[]
): boolean => {
  if (!Array.isArray(array)) return false;
  return array.every((item) => validatorFunction(item, ...params));
};

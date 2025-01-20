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
 *
 * @param minimumLength Allows you to set a custom minimum length needed to pass the validation process. This option only exists as older Minecraft Usernames were allowed to be shorter than 3 characters.
 */
export const validateUsername = (username: string, minimumLength?: 1 | 2): boolean => {
  if (typeof username !== "string") return false;
  if (minimumLength === 1) return /^[a-zA-Z0-9_]{1,16}$/.test(username);
  if (minimumLength === 2) return /^[a-zA-Z0-9_]{2,16}$/.test(username);
  return /^[a-zA-Z0-9_]{3,16}$/.test(username);
};

/**
 * Validates a Minecraft Player by either validating their Username or supplied UUID
 *
 * @param minimumUsernameLength Allows you to set a custom minimum length needed to pass the validation process. This option only exists as older Minecraft Usernames were allowed to be shorter than 3 characters.
 */
export const validatePlayer = (player: Player, minimumUsernameLength?: 1 | 2): boolean =>
  validateUUID(player) || validateUsername(player, minimumUsernameLength);

export const validateArray = <T>(
  array: T[],
  validatorFunction: (item: T, ...params: any[]) => boolean,
  ...params: any[]
): boolean => {
  if (!Array.isArray(array)) return false;
  return array.every((item) => validatorFunction(item, ...params));
};

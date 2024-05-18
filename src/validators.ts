import { Player } from "../types/index.js";
import { undashUUID } from "./formatters.js";

export const validateUUID = (UUID: string) => {
  if (typeof UUID !== "string") return false;
  UUID = undashUUID(UUID);
  if (UUID.length !== 32) return false;
  return /[0-9a-f]{12}4[0-9a-f]{19}/.test(UUID);
};

export const validateUsername = (username: string) => {
  if (typeof username !== "string") return false;
  return /^[a-zA-Z0-9_]{1,16}$/.test(username);
};

export const validatePlayer = (player: Player) => validateUUID(player) || validateUsername(player);

export const validateArray = <T>(
  array: T[],
  validatorFunction: (item: T, ...params: any[]) => boolean,
  ...params: any[]
) => {
  if (!Array.isArray(array)) return false;
  return array.every((item) => validatorFunction(item, ...params));
};

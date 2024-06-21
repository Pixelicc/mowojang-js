import client from "./client.js";
import { dashUUID, undashUUID } from "./utils.js";
import { validatePlayer, validateUUID, validateUsername } from "./validators.js";
import { buildStorage, buildMemoryStorage } from "axios-cache-interceptor";

export const Client = client;

export const validate = {
  player: validatePlayer,
  uuid: validateUUID,
  username: validateUsername,
};

export const utils = {
  dashUUID,
  undashUUID,
};

export const cache = {
  buildStorage,
  buildMemoryStorage,
};

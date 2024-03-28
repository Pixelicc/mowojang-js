import axios from "axios";
import PackageJSON from "../package.json" assert { type: "json" };
import { Player, Options, Responses } from "../types/index.js";
import { dashUUID, undashUUID } from "./formatters.js";
import { validateUUID, validateUsername, validatePlayer, validateArray } from "./validators.js";

const axiosInstance = axios.create({
  baseURL: "https://mowojang.matdoes.dev/",
  timeout: 10000,
  maxRedirects: 0,
  headers: {
    "User-Agent": `axios/${axios.VERSION} mowojang/${PackageJSON.version}`,
    Accept: "application/json",
  },
});

const getUUID = async (username: string, options?: Options) => {
  if (validateUsername(username)) {
    return await axiosInstance
      .get(`/${username}`, { timeout: options?.timeout })
      .then((res) => {
        return res.data.id as Responses.Player["id"];
      })
      .catch((err) => {
        if (err?.response?.status === 404) {
          throw new Error("[Mowojang] Player not Found");
        }
        throw new Error("[Mowojang] Unknown Error: " + String(err));
      });
  } else {
    throw new Error("[Mowojang] Invalid Username");
  }
};

const getUsername = async (UUID: string, options?: Options) => {
  if (validateUUID(UUID)) {
    return await axiosInstance
      .get(`/${UUID}`, { timeout: options?.timeout })
      .then((res) => {
        return res.data.name as Responses.Player["name"];
      })
      .catch((err) => {
        if (err?.response?.status === 404) {
          throw new Error("[Mowojang] Player not Found");
        }
        throw new Error("[Mowojang] Unknown Error: " + String(err));
      });
  } else {
    throw new Error("[Mowojang] Invalid UUID");
  }
};

const getPlayer = async (player: Player, options?: Options) => {
  if (validatePlayer(player)) {
    return await axiosInstance
      .get(`/${player}`, { timeout: options?.timeout })
      .then((res) => {
        return res.data as Responses.Player;
      })
      .catch((err) => {
        if (err?.response?.status === 404) {
          throw new Error("[Mowojang] Player not Found");
        }
        throw new Error("[Mowojang] Unknown Error: " + String(err));
      });
  } else {
    throw new Error("[Mowojang] Invalid UUID or Username");
  }
};

const getPlayers = async (players: Player[], options?: Options) => {
  if (validateArray(players, validatePlayer)) {
    return await axiosInstance
      .post("/", players, { timeout: options?.timeout })
      .then((res) => {
        return res.data as Responses.Player[];
      })
      .catch((err) => {
        if (err?.response?.status === 404) {
          throw new Error("[Mowojang] Player not Found");
        }
        throw new Error("[Mowojang] Unknown Error: " + String(err));
      });
  } else {
    throw new Error("[Mowojang] Invalid Array of UUIDs or Usernames");
  }
};

/**
 * @param player The normal Mojang-API only allows queries by UUID so keep in mind that passing a Username here will result in an additional request to convert it to its UUID
 */
const getPlayerSession = async (player: Player, options?: Options) => {
  if (validatePlayer(player)) {
    return await axiosInstance
      .get(`/session/minecraft/profile/${validateUUID(player) ? player : await getUUID(player)}`, { timeout: options?.timeout })
      .then((res) => {
        return res.data as Responses.PlayerSession;
      })
      .catch((err) => {
        if (err?.response?.status === 404) {
          throw new Error("[Mowojang] Player not Found");
        }
        throw new Error("[Mowojang] Unknown Error: " + String(err));
      });
  } else {
    throw new Error("[Mowojang] Invalid UUID or Username");
  }
};

export default {
  getUUID,
  getUsername,
  getPlayer,
  getPlayers,
  getPlayerSession,
  validateUUID,
  validateUsername,
  validatePlayer,
  dashUUID,
  undashUUID,
};

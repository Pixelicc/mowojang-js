import axios from "axios";
import { setupCache } from "axios-cache-interceptor";
import PackageJSON from "../package.json" assert { type: "json" };
import { Player, Options, MowojangPlayer, MowojangPlayerSession, MowojangPlayerSessionProfileActions } from "../types/index.js";
import { dashUUID, undashUUID } from "./formatters.js";
import { validateUUID, validateUsername, validatePlayer, validateArray } from "./validators.js";

const axiosInstance = setupCache(
  axios.create({
    baseURL: "https://mowojang.matdoes.dev/",
    timeout: 10000,
    maxRedirects: 0,
    headers: {
      "User-Agent": `axios/${axios.VERSION} mowojang/${PackageJSON.version}`,
      Accept: "application/json",
    },
  }),
  {
    methods: ["get", "post"],
    cacheTakeover: false,
  }
);

/**
 * Simple Wrapper for the getPlayer Function that soley converts Username to its UUID.
 */
const getUUID = async (username: string, options?: Options): Promise<string> => (await getPlayer(username, options)).UUID;
/**
 * Simple Wrapper for the getPlayer Function that soley converts UUID to its Username.
 */
const getUsername = async (UUID: string, options?: Options): Promise<string> => (await getPlayer(UUID, options)).username;

/**
 * Simple Wrapper for the getPlayerSession Function that soley returns the Skin Data. This Function also requests the Skin Data and returns it in a Buffer.
 *
 * @param player The normal Mojang-API only allows queries by UUID so keep in mind that passing a Username here will result in an additional request to convert it to its UUID
 */

const getSkin = async (player: Player, options?: Options): Promise<null | { URL: string; hash: string; metadata: { slim: boolean }; buffer: Buffer }> => {
  if (validatePlayer(player)) {
    const session = await getPlayerSession(player, options);

    try {
      if (session.skin) {
        const buffer = Buffer.from((await axiosInstance.get(session.skin.URL, { responseType: "arraybuffer", cache: options ? (options.cache === true || options.cache === undefined ? { ttl: options.cacheTTL, override: options.cacheOverride } : false) : undefined })).data, "base64");
        return {
          ...session.skin,
          buffer,
        };
      }
      return null;
    } catch (err) {
      throw new Error("[Mowojang] Unknown Error: " + String(err));
    }
  } else {
    throw new Error("[Mowojang] Invalid UUID or Username");
  }
};

/**
 * Simple Wrapper for the getPlayerSession Function that soley returns the Cape Data. This Function also requests the Cape Data and returns it in a Buffer.
 *
 * @param player The normal Mojang-API only allows queries by UUID so keep in mind that passing a Username here will result in an additional request to convert it to its UUID
 */

const getCape = async (player: Player, options?: Options): Promise<null | { URL: string; hash: string; buffer: Buffer }> => {
  if (validatePlayer(player)) {
    const session = await getPlayerSession(player, options);

    try {
      if (session.cape) {
        const buffer = Buffer.from((await axiosInstance.get(session.cape.URL, { responseType: "arraybuffer", cache: options ? (options.cache === true || options.cache === undefined ? { ttl: options.cacheTTL, override: options.cacheOverride } : false) : undefined })).data, "base64");
        return {
          ...session.cape,
          buffer,
        };
      }
      return null;
    } catch (err) {
      throw new Error("[Mowojang] Unknown Error: " + String(err));
    }
  } else {
    throw new Error("[Mowojang] Invalid UUID or Username");
  }
};

const getPlayer = async (player: Player, options?: Options): Promise<{ UUID: string; username: string }> => {
  if (validatePlayer(player)) {
    return await axiosInstance
      .get<MowojangPlayer>(`/${player}`, { timeout: options?.timeout, cache: options ? (options.cache === true || options.cache === undefined ? { ttl: options.cacheTTL, override: options.cacheOverride } : false) : undefined })
      .then((res) => {
        return {
          UUID: res.data.id,
          username: res.data.name,
        };
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

const getPlayers = async (players: Player[], options?: Options): Promise<{ UUID: string; username: string }[]> => {
  if (validateArray(players, validatePlayer)) {
    return await axiosInstance
      .post<MowojangPlayer[]>("/", players, { timeout: options?.timeout, cache: options ? (options.cache === true || options.cache === undefined ? { ttl: options.cacheTTL, override: options.cacheOverride } : false) : undefined })
      .then((res) => {
        return res.data.map((player) => {
          return {
            UUID: player.id,
            username: player.name,
          };
        });
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
const getPlayerSession = async (
  player: Player,
  options?: Options
): Promise<{
  UUID: string;
  username: string;
  skin: null | {
    URL: string;
    hash: string;
    metadata: {
      slim: boolean;
    };
  };
  cape: null | {
    URL: string;
    hash: string;
  };
  actions: MowojangPlayerSessionProfileActions;
}> => {
  if (validatePlayer(player)) {
    return await axiosInstance
      .get<MowojangPlayerSession>(`/session/minecraft/profile/${validateUUID(player) ? player : await getUUID(player)}`, { timeout: options?.timeout, cache: options ? (options.cache === true || options.cache === undefined ? { ttl: options.cacheTTL, override: options.cacheOverride } : false) : undefined })
      .then((res) => {
        const encodedTextures = res.data.properties.find((property) => property.name === "textures")?.value;
        let skin = null;
        let cape = null;
        if (encodedTextures) {
          const decodedTextures = JSON.parse(Buffer.from(encodedTextures, "base64").toString()).textures;
          if (decodedTextures.SKIN) {
            skin = {
              URL: decodedTextures?.SKIN.url,
              hash: decodedTextures?.SKIN.url.split("/").at(-1),
              metadata: {
                slim: decodedTextures?.SKIN?.metadata?.model === "slim",
              },
            };
          }
          if (decodedTextures.CAPE) {
            cape = {
              URL: decodedTextures?.CAPE.url,
              hash: decodedTextures?.CAPE.url.split("/").at(-1),
            };
          }
        }
        return {
          UUID: res.data.id,
          username: res.data.name,
          skin,
          cape,
          actions: res.data.profileActions,
        };
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
  getSkin,
  getCape,
  getPlayer,
  getPlayers,
  getPlayerSession,
  validateUUID,
  validateUsername,
  validatePlayer,
  dashUUID,
  undashUUID,
};

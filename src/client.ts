import { isAxiosError } from "axios";
import { AxiosCacheInstance } from "axios-cache-interceptor";
import axiosInstance from "./axiosInstance.js";
import {
  Player,
  Username,
  UUID,
  ClientOptions,
  MowojangCape,
  MowojangProfile,
  MowojangRequestConfig,
  MowojangResponse,
  MowojangSession,
  MowojangSkin,
} from "../types/index.js";
import { validateArray, validatePlayer, validateUUID, validateUsername } from "./validators.js";
import { undashUUID } from "./utils.js";

export default class Client {
  private axios: AxiosCacheInstance;

  constructor(clientOptions?: ClientOptions) {
    this.axios = axiosInstance(clientOptions);
  }

  /**
   * Returns an Array of Player Profiles consisting of their Usernames and UUIDs
   *
   * Players considered "INVALID" are excluded from the results
   */
  public async getProfiles(
    players: Player[],
    config?: MowojangRequestConfig,
  ): MowojangResponse<MowojangProfile[], undefined> {
    try {
      if (config?.validate !== false && !validateArray(players, validatePlayer))
        return { data: null, error: "INVALID_INPUT" };
      players = players
        .map((player) => {
          if (validateUUID(player)) return undashUUID(player);
          return player.toLowerCase();
        })
        .sort();

      const fetchResponse = await this.axios.post("https://mowojang.matdoes.dev/", players, {
        cache: config?.cache ?? { ttl: 15 * 60 * 1000 },
      });
      if (!Array.isArray(fetchResponse?.data)) return { data: null, error: "UNKOWN_ERROR" };

      return {
        data: fetchResponse.data.map((player) => {
          return {
            UUID: player.id,
            username: player.name,
          };
        }),
        error: null,
      };
    } catch {
      return { data: null, error: "UNKOWN_ERROR" };
    }
  }

  /**
   * Returns a Player's Profile consisting of their Username and UUID
   *
   */
  public async getProfile(
    player: Player,
    config?: MowojangRequestConfig,
  ): MowojangResponse<MowojangProfile, "INVALID_PLAYER"> {
    if (config?.validate !== false && !validatePlayer(player)) return { data: null, error: "INVALID_INPUT" };

    const profiles = await this.getProfiles([player], config);
    if (profiles.error) return { data: null, error: profiles.error };
    if (profiles.data.length === 0) return { data: null, error: "INVALID_PLAYER" };
    return { data: profiles.data[0], error: null };
  }

  /**
   * A Simple Wrapper to Retrieve Only the UUID of a Player's Profile
   *
   */
  public async getUUID(username: Username, config?: MowojangRequestConfig): Promise<null | Username> {
    const profile = await this.getProfile(username, config);
    if (profile.error) return null;
    return profile.data.UUID;
  }

  /**
   * A Simple Wrapper to Retrieve Only the Username of a Player's Profile
   *
   */
  public async getUsername(UUID: UUID, config?: MowojangRequestConfig): Promise<null | UUID> {
    const profile = await this.getProfile(UUID, config);
    if (profile.error) return null;
    return profile.data.username;
  }

  /**
   * Returns an Array of Player Sessions consisting of their Usernames, UUIDs, Skins and Capes
   *
   * Players considered "INVALID" are excluded from the results
   */
  public async getSessions(
    players: Player[],
    config?: MowojangRequestConfig,
  ): MowojangResponse<MowojangSession[], "INVALID_PLAYER"> {
    try {
      if (config?.validate !== false && !validateArray(players, validatePlayer))
        return { data: null, error: "INVALID_INPUT" };
      players = players.map((player) => {
        if (validateUUID(player)) return undashUUID(player);
        return player.toLowerCase();
      });

      const sessionsPromises: MowojangResponse<MowojangSession, "INVALID_PLAYER">[] = [];
      players.forEach((player) => {
        sessionsPromises.push(this.getSession(player, config));
      });
      const sessions = (await Promise.all(sessionsPromises))
        .filter((session) => session.data !== null)
        .map((session) => session.data);

      return {
        // @ts-ignore
        data: sessions,
        error: null,
      };
    } catch {
      return { data: null, error: "UNKOWN_ERROR" };
    }
  }

  /**
   * Returns a Player's Sessions consisting of their Username, UUID, Skin and Cape
   *
   */
  public async getSession(
    player: Player,
    config?: MowojangRequestConfig,
  ): MowojangResponse<MowojangSession, "INVALID_PLAYER"> {
    if (config?.validate !== false && !validatePlayer(player)) return { data: null, error: "INVALID_INPUT" };
    const UUID = await this.getUUID(player);
    if (!UUID) return { data: null, error: "INVALID_PLAYER" };

    return await this.axios
      .get(`https://mowojang.matdoes.dev/session/minecraft/profile/${UUID}`, {
        cache: config?.cache ?? { ttl: 15 * 60 * 1000 },
      })
      .then((fetchResponse) => {
        let textures: any = fetchResponse.data.properties.find((property: any) => property.name === "textures").value;
        let skin: MowojangSkin = null;
        let cape: MowojangCape = null;
        if (textures) {
          textures = JSON.parse(Buffer.from(textures, "base64").toString()).textures;
          if (textures.SKIN) {
            skin = {
              url: textures.SKIN.url,
              hash: textures.SKIN.url.split("/").at(-1),
              metadata: {
                slim: textures.SKIN?.metadata?.model === "slim",
              },
            };
          }
          if (textures.CAPE) {
            cape = {
              url: textures.CAPE.url,
              hash: textures.CAPE.url.split("/").at(-1),
            };
          }
        }

        return {
          data: {
            UUID: fetchResponse.data.id,
            username: fetchResponse.data.name,
            skin,
            cape,
            actions: fetchResponse.data.profileActions,
          },
          error: null,
        };
      })
      .catch((fetchError) => {
        if (isAxiosError(fetchError)) {
          return { data: null, error: "INVALID_PLAYER" };
        }
        return { data: null, error: "UNKOWN_ERROR" };
      });
  }

  /**
   * A Simple Wrapper to Retrieve Only the Skin from a Player's Session
   *
   */
  public async getSkin(player: Player, config?: MowojangRequestConfig): Promise<null | MowojangSkin> {
    const session = await this.getSession(player, config);
    if (session.error) return null;
    return session.data.skin;
  }

  /**
   * A Simple Wrapper to Retrieve Only the Player's Skin from their Session Data Loaded into a Buffer
   *
   */
  public async getSkinBuffer(player: Player, config?: MowojangRequestConfig): Promise<null | Buffer> {
    const session = await this.getSession(player, config);
    if (session.error || !session.data.skin) return null;

    const fetchResponse = await this.axios.get(session.data.skin.url, {
      responseType: "arraybuffer",
      cache: config?.cache ?? { ttl: 24 * 60 * 60 * 1000 },
    });

    return Buffer.from(fetchResponse.data, "base64");
  }

  /**
   * A Simple Wrapper to Retrieve Only the Cape Data from a Player's Session
   *
   */
  public async getCape(player: Player, config?: MowojangRequestConfig): Promise<null | MowojangCape> {
    const session = await this.getSession(player, config);
    if (session.error) return null;
    return session.data.cape;
  }

  /**
   * A Simple Wrapper to Retrieve Only the Player's Cape from their Session Data Loaded into a Buffer
   *
   */
  public async getCapeBuffer(player: Player, config?: MowojangRequestConfig): Promise<null | Buffer> {
    const session = await this.getSession(player, config);
    if (session.error || !session.data.cape) return null;

    const fetchResponse = await this.axios.get(session.data.cape.url, {
      responseType: "arraybuffer",
      cache: config?.cache ?? { ttl: 30 * 24 * 60 * 60 * 1000 },
    });

    return Buffer.from(fetchResponse.data, "base64");
  }
}

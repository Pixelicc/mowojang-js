export interface MowojangPlayer {
  /**
   * Player's Minecraft UUID (Undashed)
   */
  id: string;
  /**
   * Player's Minecraft Username
   */
  name: string;
}

export type MowojangPlayerSessionProfileActions = ("FORCED_NAME_CHANGE" | "USING_BANNED_SKIN")[];
export interface MowojangPlayerSessionProperty {
  name: string;
  value: string;
}
export interface MowojangPlayerSessionTextureProperty {
  name: "textures";
  /**
   * Base64 Encoded String containing all Textures
   */
  value: string;
}
export type MowojangPlayerSessionProperties = (MowojangPlayerSessionTextureProperty | MowojangPlayerSessionProperty)[];
export interface MowojangPlayerSession extends MowojangPlayer {
  profileActions: MowojangPlayerSessionProfileActions;
  properties: MowojangPlayerSessionProperties;
}

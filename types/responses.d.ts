export interface Player {
  /**
   * Player's Minecraft UUID (Undashed)
   */
  id: string;
  /**
   * Player's Minecraft Username
   */
  name: string;
}

export interface PlayerSessionProperty {
  name: string;
  value: string;
}
export interface PlayerSession extends Player {
  profileActions: unknown[];
  properties: PlayerSessionProperty[];
}

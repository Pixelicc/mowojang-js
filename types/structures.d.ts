import type { UUID, Username } from "./index.d.ts";

export interface MowojangProfile {
  UUID: UUID;
  username: Username;
}

export interface MowojangSession {
  UUID: UUID;
  username: Username;
  skin: MowojangSkin;
  cape: MowojangCape;
  actions: ("FORCED_NAME_CHANGE" | "USING_BANNED_SKIN")[];
}

export type MowojangSkin = null | {
  url: string;
  hash: string;
  metadata: {
    slim: boolean;
  };
};

export type MowojangCape = null | {
  url: string;
  hash: string;
};

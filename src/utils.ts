import { UUID } from "../types/index.js";

export const undashUUID = (UUID: string): UUID => UUID.replace(/-/g, "").toLowerCase();
export const dashUUID = (UUID: string): UUID =>
  undashUUID(UUID).replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, "$1-$2-$3-$4-$5");

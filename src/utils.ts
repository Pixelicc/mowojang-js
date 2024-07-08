import { UUID } from "../types/index.js";

/**
 * Removes dashes from a UUID string
 *
 */
export const undashUUID = (UUID: UUID): UUID => UUID.replace(/-/g, "").toLowerCase();

/**
 * Adds dashes to a UUID string if not already dashed
 *
 */
export const dashUUID = (UUID: UUID): UUID =>
  undashUUID(UUID).replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, "$1-$2-$3-$4-$5");

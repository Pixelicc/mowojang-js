export const undashUUID = (UUID: string) => UUID.replace(/-/g, "").toLowerCase();
export const dashUUID = (UUID: string) => undashUUID(UUID).replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, "$1-$2-$3-$4-$5");

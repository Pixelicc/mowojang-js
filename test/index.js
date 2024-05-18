import Mowojang from "../dist/src/index.js";
import { describe, it } from "node:test";
import * as assert from "node:assert";

describe("Utility Functions", { timeout: 10000 }, function () {
  describe("#dashUUID()", function () {
    it("Should add dashes to an UUIDv4 String", function () {
      assert.strictEqual(Mowojang.dashUUID("14727faefbdc4aff848cd2713eb9939e"), "14727fae-fbdc-4aff-848c-d2713eb9939e");
    });
  });
  describe("#undashUUID()", function () {
    it("Should remove all dashes from an UUIDv4 String", function () {
      assert.strictEqual(
        Mowojang.undashUUID("14727fae-fbdc-4aff-848c-d2713eb9939e"),
        "14727faefbdc4aff848cd2713eb9939e",
      );
    });
  });
});

describe("Validator Functions", { timeout: 10000 }, function () {
  describe("#validateUUID()", function () {
    it("Should be true on an valid UUIDv4 String", function () {
      assert.strictEqual(Mowojang.validateUUID("14727fae-fbdc-4aff-848c-d2713eb9939e"), true);
    });
    it("Should be false on an invalid UUIDv4 String", function () {
      assert.strictEqual(Mowojang.validateUUID("xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"), false);
    });
  });
  describe("#validateUsername()", function () {
    it("Should be true on an valid Minecraft Username", function () {
      assert.strictEqual(Mowojang.validateUsername("Pixelic"), true);
    });
    it("Should be false on an invalid Minecraft Username", function () {
      assert.strictEqual(Mowojang.validateUsername("Pixelic'sNameIsWayTooLongToBeAValidMinecraftUsername"), false);
    });
  });
  describe("#validatePlayer()", function () {
    it("Should be true on an valid UUIDv4 String", function () {
      assert.strictEqual(Mowojang.validatePlayer("14727fae-fbdc-4aff-848c-d2713eb9939e"), true);
    });
    it("Should be false on an invalid UUIDv4 String", function () {
      assert.strictEqual(Mowojang.validatePlayer("xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"), false);
    });
    it("Should be true on an valid Minecraft Username", function () {
      assert.strictEqual(Mowojang.validatePlayer("Pixelic"), true);
    });
    it("Should be false on an invalid Minecraft Username", function () {
      assert.strictEqual(Mowojang.validatePlayer("Pixelic'sNameIsWayTooLongToBeAValidMinecraftUsername"), false);
    });
  });
});

describe("Functions", { timeout: 10000 }, function () {
  describe("#getUUID", function () {
    it("Should convert an Minecraft Username to its UUIDv4 String", async function () {
      const UUID = await Mowojang.getUUID("Pixelic");
      assert.strictEqual(UUID, "14727faefbdc4aff848cd2713eb9939e");
    });
  });
  describe("#getUsername", function () {
    it("Should convert an UUIDv4 String to its Minecraft Username", async function () {
      const username = await Mowojang.getUsername("14727faefbdc4aff848cd2713eb9939e");
      assert.strictEqual(username, "Pixelic");
    });
  });
  describe("#getSkin", function () {
    it("Should return an Skin Object", async function () {
      const skin = await Mowojang.getSkin("Pixic");
      assert.strictEqual(
        skin.URL,
        "http://textures.minecraft.net/texture/56dab0d218f41af5812c4b4692719ab3b2f28ef668338f0753336c79acb6b5fa",
      );
      assert.strictEqual(skin.hash, "56dab0d218f41af5812c4b4692719ab3b2f28ef668338f0753336c79acb6b5fa");
      assert.strictEqual(
        skin.buffer.toString("base64"),
        "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",
      );
      assert.deepStrictEqual(skin.metadata, { slim: true });
    });
  });
  describe("#getCape", function () {
    it("Should return an Cape Object", async function () {
      const cape = await Mowojang.getCape("Pixic");
      assert.strictEqual(
        cape.URL,
        "http://textures.minecraft.net/texture/2340c0e03dd24a11b15a8b33c2a7e9e32abb2051b2481d0ba7defd635ca7a933",
      );
      assert.strictEqual(cape.hash, "2340c0e03dd24a11b15a8b33c2a7e9e32abb2051b2481d0ba7defd635ca7a933");
      assert.strictEqual(
        cape.buffer.toString("base64"),
        "iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAYAAACinX6EAAACiElEQVR4XuWWT2oVQRjE3xGCCDG4MFF0EzSIGFBBEZTss8km4M6NJ/AE7gR3HsO1kHU2LvUIHsATjKlmaqjU149umh5BevHj9avpmf6q+ps/m1enPzZnr3cmsH9wmIXHP9y4NX3Zuz99v3OUBcfmOZtfD55V8eTp2+nw4Yt0/tX/HOEcME1TFzZq0o3XHNuGF7wNBuB6CTfSyhLAp/e7qRCAolgYwDE3WMILLsF18fvm5Dyha/t8N9JK2gEWffF5PwQAjcd1bgkvuASvr0DT8FcLgIuh1dUwxmx/naegwFyHuMEaNHyupfXoreJGWkmL0sjHm7cTP789TvA/DXKumsdDD3gIbq4GnKfdB1DHqgEwZRj9und3MU2o6U64+VwIbq4GmsyZXy0ANU/4WlONIbDl3TxgtwA3V0MuAO0+0jUAFK1m9X3sOubSKMceAHU3VwON4tdvQT6guwegOw4u7x1fC0DBXDeaCwC4uRrY6t6VvCZ00D0AmNYAfj86SriuxeCrz0OARt3N1cCdVvPalRquG2llCYBmsRADwJjmNQAa5acvd1/1+VrBZAma59qsiVBzI61cC4DtzwDYBdAYkJrkbrt5MBccDFYQnkVO1wB0h9n+f14+T7ALAMb/IgCuo3B9rceNtJIC4IURAM0TLoixB0DzPQPgmtoBuVvBjbSSAuCiLQFsewbM5wWDJTQArWO1DsD9VhsA5qpJfw12CmAJget6ENDdSCtB6MVsIBgsoQFoEKt1gAu9mAsNBksggOnd+RIAxmSYDrgyu4SgATCEIQLA+blb4L/pgPm1FQyWkA5YQvDd7/oh5MJoBGE0gjAaQRiNIIxGEEYjCKMRhNEIwmgEYTT+AksiJ9gdoefNAAAAAElFTkSuQmCC",
      );
    });
  });
  describe("#getPlayer", function () {
    it("Should return an Player Object", async function () {
      const player = await Mowojang.getPlayer("Pixelic");
      assert.strictEqual(player.UUID, "14727faefbdc4aff848cd2713eb9939e");
      assert.strictEqual(player.username, "Pixelic");
    });
  });
  describe("#getPlayers", function () {
    it("Should return an Array of Player Objects", async function () {
      const players = await Mowojang.getPlayers(["Pixelic", "Pixic"]);
      assert.strictEqual(Array.isArray(players), true);
      assert.strictEqual(players[0].UUID, "14727faefbdc4aff848cd2713eb9939e");
      assert.strictEqual(players[0].username, "Pixelic");
      assert.strictEqual(players[1].UUID, "03197f1eabd74794b8668f513db2d2f0");
      assert.strictEqual(players[1].username, "Pixic");
    });
  });
  describe("#getPlayerSession", function () {
    it("Should return an Player Session Object", async function () {
      const playerSession = await Mowojang.getPlayerSession("Pixic");
      assert.strictEqual(playerSession.UUID, "03197f1eabd74794b8668f513db2d2f0");
      assert.strictEqual(playerSession.username, "Pixic");
      assert.strictEqual(
        playerSession.skin.URL,
        "http://textures.minecraft.net/texture/56dab0d218f41af5812c4b4692719ab3b2f28ef668338f0753336c79acb6b5fa",
      );
      assert.strictEqual(playerSession.skin.hash, "56dab0d218f41af5812c4b4692719ab3b2f28ef668338f0753336c79acb6b5fa");
      assert.deepStrictEqual(playerSession.skin.metadata, { slim: true });
      assert.strictEqual(
        playerSession.cape.URL,
        "http://textures.minecraft.net/texture/2340c0e03dd24a11b15a8b33c2a7e9e32abb2051b2481d0ba7defd635ca7a933",
      );
      assert.strictEqual(playerSession.cape.hash, "2340c0e03dd24a11b15a8b33c2a7e9e32abb2051b2481d0ba7defd635ca7a933");
      assert.strictEqual(Array.isArray(playerSession.actions), true);
    });
  });
});

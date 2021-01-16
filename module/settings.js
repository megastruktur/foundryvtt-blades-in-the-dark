export const registerSystemSettings = function() {

  /**
   * Track the system version upon which point a migration was last applied
   */
  game.settings.register("wicked-ones", "systemMigrationVersion", {
    name: "System Migration Version",
    scope: "world",
    config: false,
    type: Number,
    default: 0.9
  });

  /**
   * Track the system version upon which point a migration was last applied
   */
  game.settings.register("wicked-ones", "showExpandedRollResults", {
    name: "SETTINGS.WOExpandedResults.Name",
    hint: "SETTINGS.WOExpandedResults.Label",
    scope: "client",
    config: true,
    type: Boolean,
    default: true
  });
};

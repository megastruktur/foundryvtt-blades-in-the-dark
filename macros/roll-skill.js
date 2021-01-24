// Macro to roll the skill of one's assigned actor
// Replace the value of SKILL_NAME with any of the keys in CONFIG.WO.rollable_skills

const SKILL_NAME = "scan";
main();

async function main() {

  if (actor == null) {
    ui.notifications.error(game.i18n.localize("FITD.ERRORS.NoActorAssigned"));
    return;
  }
  actor.rollAttributePopup(SKILL_NAME);
}
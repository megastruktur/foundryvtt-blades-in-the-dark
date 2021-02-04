// Macro to roll the skill of the selected minion pack of one's assigned actor
// Replace the value of SKILL_NAME with any of the keys in CONFIG.WO.rollable_skills

const SKILL_NAME = "scan";
main();

async function main() {

  if (actor == null) {
    ui.notifications.error(game.i18n.localize("FITD.ERRORS.NoActorAssigned"));
    return;
  }

  const mpID = actor.data.data.minionpack ?? "";
  if (mpID == "") {
    ui.notifications.error(game.i18n.localize("FITD.ERRORS.NoMinionPackLinked"));
    return;
  }
  console.log(mpID);
  let mp = game.actors.get(mpID);
  if (mp == undefined) {
    ui.notifications.error(game.i18n.localize("FITD.ERRORS.NoMinionPackLinked"));
    return;
  }
  console.log(mp);
  mp.rollAttributePopup(SKILL_NAME);
}
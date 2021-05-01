
import { WickedSheet } from "./wicked-sheet.js";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {WickedSheet}
 */
export class WickedActorSheet extends WickedSheet {

  /** @override */
	static get defaultOptions() {
	  return mergeObject(super.defaultOptions, {
          classes: ["wicked-ones", "sheet", "actor"],
          template: "systems/wicked-ones/templates/actor-sheet.html",
      width: 820,
      height: 970,
      tabs: [{navSelector: ".tabs", contentSelector: ".tab-content", initial: "abilities"}]
    });
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    const data = super.getData();
    data.editable = this.options.editable;
    const actorData = data.data;
		data.actor = actorData;
		data.data = actorData.data;

    // look for abilities that change the number of gold, supply and dark heart icons
    // also check for Doomseeker rays and add translations
    data.items.forEach(i => {
      if (i.type == "specialability") {
        if (i.name == game.i18n.localize("FITD.GAME_LOGIC.PackMule")) {
          data.data.supply.max += 1;
        } else if (i.name == game.i18n.localize("FITD.GAME_LOGIC.StickyFingers")) {
          data.data.gold.max += 1;
        } else if (i.name == game.i18n.localize("FITD.GAME_LOGIC.Lair") && i.data.primal.gm_path_value == 3) {
          data.data.dark_hearts.max += 1;
        } else if (i.name == game.i18n.localize("FITD.GAME_LOGIC.GearLocker")) {
          data.data.supply.max += 1;
        } else if (i.data.ability_type == "ds_eyes") {
          for (var j = 1; j < 10; j++) {
            i.data.primal['ds_eye_ray_' + j + '_name'] = game.i18n.localize(CONFIG.WO.doomseeker_eye_rays[i.data.primal['ds_eye_ray_' + j]] + '.Name');
            i.data.primal['ds_eye_ray_' + j + '_tooltip'] = game.i18n.localize(CONFIG.WO.doomseeker_eye_rays[i.data.primal['ds_eye_ray_' + j]] + '.Tooltip');
          }
        }
      }
    });

    // check if Braineater and remove invoke skill
    if (data.data.primal_monster_type == game.i18n.localize("FITD.GAME_LOGIC.Braineater")) {
      delete data.data.attributes.guts.skills.invoke;
    }

    // Get list of minions
    data.data.existing_minions = game.actors.filter(entry => entry.data.type === "minion_pack");
    let found = false;
    data.data.existing_minions.forEach(i => {
      if (i.id == data.data.minionpack) {
        found = true;
      }
    });
    if (!found) {
      data.data.minionpack = "";
    }

    return data;
  }

  /* -------------------------------------------- */

  /** @override */
	activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    // Update Inventory Item
    html.find('.item-open-editor').click(ev => {
      const element = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(element.data("itemId"));
			item.sheet.render(true);
    });

    // Delete Inventory Item
    html.find('.item-delete').click(ev => {
      const element = $(ev.currentTarget).parents(".item");
      this.actor.deleteEmbeddedDocuments("Item", [element.data("itemId")]);
      element.slideUp(200, () => this.render(false));
    });
  }

  /* -------------------------------------------- */

}

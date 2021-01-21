
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


    // look for abilities that change the number of gold, supply and dark heart icons
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
        }
      }
    });

    // check if braineater and remove invoke skill
    if (data.data.primal_monster_type == game.i18n.localize("FITD.GAME_LOGIC.Braineater")) {
      delete data.data.attributes.guts.skills.invoke;
    }

    // Get list of minions
    data.data.existing_minions = game.actors.filter(entry => entry.data.type === "minion_pack");
    let found = false;
    data.data.existing_minions.forEach(i => {
      if (i._id == data.data.minionpack) {
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
      const item = this.actor.getOwnedItem(element.data("itemId"));
      item.sheet.render(true);
    });

    // Delete Inventory Item
    html.find('.item-delete').click(ev => {
      const element = $(ev.currentTarget).parents(".item");
      this.actor.deleteOwnedItem(element.data("itemId"));
      element.slideUp(200, () => this.render(false));
    });
  }

  /* -------------------------------------------- */

}

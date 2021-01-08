
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
      width: 760,
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
        if (i.name == game.i18n.localize("FITD.AbilityPackMule")) {
          data.data.supply_max += 1;
        } else if (i.name == game.i18n.localize("FITD.AbilityStickyFingers")) {
          data.data.gold_max += 1;
        } else if (i.name == game.i18n.localize("FITD.AbilityLair") && i.data.primal.gm_path_value == 3) {
          data.data.dark_hearts_max += 1;
        } else if (i.name == game.i18n.localize("FITD.RoomGearLocker")) {
          data.data.supply_max += 1;
        }
      }
    });

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

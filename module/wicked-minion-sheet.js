
import { WickedSheet } from "./wicked-sheet.js";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {WickedSheet}
 */
export class WickedMinionSheet extends WickedSheet {

  /** @override */
	static get defaultOptions() {
	  return mergeObject(super.defaultOptions, {
          classes: ["wicked-ones", "sheet", "actor"],
      template: "systems/wicked-ones/templates/minion-sheet.html",
      width: 650,
      height: 770,
      tabs: [{ navSelector: ".tabs", contentSelector: ".tab-content", initial: "upgrades" }]
    });
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    const data = super.getData();

    // get localization string for the item roll name
    data.items.forEach(i => {
      if (i.type == "minion_upgrade") {
        if (i.data.upgrade_type == "external" && i.data.upgrade_skill_name != "") {
          const loc = CONFIG.WO.rollable_skills[i.data.upgrade_skill_name];
          i.data.upgrade_skill_localization_ref = loc;
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

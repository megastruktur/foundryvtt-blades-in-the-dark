
import { WickedSheet } from "./wicked-sheet.js";

/**
 * @extends {WickedSheet}
 */
export class WickedGMSheet extends WickedSheet {

  /** @override */
	static get defaultOptions() {
	  return mergeObject(super.defaultOptions, {
          classes: ["wicked-ones", "sheet", "gamemaster"],
          template: "systems/wicked-ones/templates/gm-sheet.html",
      width: 830,
      height: 850,
      tabs: [{ navSelector: ".tabs", contentSelector: ".tab-content", initial: "players" }]
    });
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    const data = super.getData();
    return data;
  }


  /* -------------------------------------------- */


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

    // Add a new Adventurer --> Change to player, clock, invasion ...
    html.find('.add-item').click(ev => {
      WickedHelpers._addOwnedItem(ev, this.actor);
    });

  }

  /* -------------------------------------------- */
  /*  Form Submission  (Check relevance)          */
	/* -------------------------------------------- */

  /** @override */
  async _updateObject(event, formData) {

    // Update the Item
    super._updateObject(event, formData);
  }
  /* -------------------------------------------- */

}

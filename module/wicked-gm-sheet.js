
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

    // Progressivly count up the invasion items
    let invasion_count = 1;
    data.items.forEach(i => {
      if (i.type == "invasion") {
        i.data.inv_number = invasion_count++;
      }
    });

    // Add a hint for the selected phase and scaffold HTML
    data.data.phase_hint = "<ul>";
    for (var i = 1; i < 10; i++) {
      let new_hint = "FITD.CYCLE.PHASE" + data.data.current_phase.value + ".Hint" + i;
      let new_hint_loc = game.i18n.localize(new_hint);
      if (new_hint == new_hint_loc) {
        break;
      }
      data.data.phase_hint += "<li>" + new_hint_loc + "</li>"
    }
    data.data.phase_hint += "</ul>";

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

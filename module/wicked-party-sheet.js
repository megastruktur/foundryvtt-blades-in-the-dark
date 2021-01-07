
import { WickedSheet } from "./wicked-sheet.js";

/**
 * @extends {WickedSheet}
 */
export class WickedPartySheet extends WickedSheet {

  /** @override */
	static get defaultOptions() {
	  return mergeObject(super.defaultOptions, {
          classes: ["wicked-ones", "sheet", "actor"],
          template: "systems/wicked-ones/templates/party-sheet.html",
      width: 830,
      height: 620,
      tabs: []
    });
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    const data = super.getData();

    // Override Code for updating the sheet goes here
    let max_tier = 0;
    data.items.forEach(e => {
      if (e.type == "adventurer" && e.data.adventurer_type == "adventurer") {
        if ((e.data.tier) > max_tier) {
          max_tier = e.data.tier;
        }
      }
    });

    data.items.forEach(e => {
      if (e.type == "adventurer" && e.data.adventurer_type == "adventurer") {
        e.data.hearts = [];
        let slashes_left = e.data.heart_slashes ?? 0;
        for (var i = 5; i > 0; i--) {
          if (i > max_tier + 1) {
            e.data.hearts[i] = "hidden";
          } else if (i > e.data.tier + 1 ) {
            e.data.hearts[i] = "greyed";
          } else {
            // Distribute slashes
            if (slashes_left > 1) {
              e.data.hearts[i] = "slashed-2";
              slashes_left -= 2;
            } else if (slashes_left == 1) {
              e.data.hearts[i] = "slashed-1";
              slashes_left = 0;
            } else {
              e.data.hearts[i] = "";
            }
          }
        }
      }
    });

    data.items.forEach(e => {
      if (e.type == "adventurer" && e.data.adventurer_type == "hireling") {
        e.data.hearts = [];
        let slashes_left = e.data.heart_slashes ?? 0;
        // Distribute slashes
        if (slashes_left > 1) {
          e.data.hearts[1] = "slashed-2";
          slashes_left -= 2;
        } else if (slashes_left == 1) {
          e.data.hearts[1] = "slashed-1";
          slashes_left = 0;
        } else {
          e.data.hearts[1] = "";
        }
      }
    });


    return data;
  }


  /* -------------------------------------------- */

  async _onHeartSetSlashes(event) {

    if (event.currentTarget.classList.contains("greyed")) {
      return;
    }

    let selected_heart = event.currentTarget.control.value;
    const itemId = event.currentTarget.closest(".item").dataset.itemId;
    const item = this.actor.getOwnedItem(itemId);

    const hearts = item.data.data.tier + 1;
    const slashes = item.data.data.heart_slashes ?? 0;
    let new_slashes = slashes;

    if (event.currentTarget.classList.contains("slashed-2")) {
      // Remove slashes from current heart and all hearts to the left
      new_slashes = (hearts - selected_heart) * 2;
    } else if (event.currentTarget.classList.contains("slashed-1")) {
      // Set current heart to slashed 2
      new_slashes = (hearts - selected_heart + 1) * 2;
    } else {
      // Set current heart to slashed 1 and all to the right to slashed 2
      new_slashes = (hearts - selected_heart) * 2 + 1;
    }

    // Update Data
    item.update({ ['data.heart_slashes']: new_slashes });
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

    // Add a new Adventurer
    html.find('.add-item').click(ev => {
      WickedHelpers._addOwnedItem(ev, this.actor);
    });

    // Update Hearts
    html.find('#adventure-party .adv-heart').click(this._onHeartSetSlashes.bind(this));

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

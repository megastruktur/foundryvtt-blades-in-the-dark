
import { BladesSheet } from "./blades-sheet.js";

/**
 * @extends {BladesSheet}
 */
export class BladesCrewSheet extends BladesSheet {

  /** @override */
	static get defaultOptions() {
	  return foundry.utils.mergeObject(super.defaultOptions, {
  	  classes: ["blades-in-the-dark", "sheet", "actor", "crew"],
  	  template: "systems/blades-in-the-dark/templates/crew-sheet.html",
      width: 940,
      height: 1020,
      tabs: [{navSelector: ".tabs", contentSelector: ".tab-content", initial: "turfs"}]
    });
  }

  /* -------------------------------------------- */

  /** @override */
  getData(options) {
    const superData = super.getData( options );
    const sheetData = superData.data;
    sheetData.owner = superData.owner;
    sheetData.editable = superData.editable;
    sheetData.isGM = game.user.isGM;
    sheetData.limited = superData.limited

    // Calculate Turfs amount.
    // We already have Lair, so set to -1.
    let turfs_amount = 0

    sheetData.items.forEach(item => {

      if (item.type === "crew_type") {
        // Object.entries(item.data.turfs).forEach(turf => {turfs_amount += (turf.value === true) ? 1 : 0});
        Object.entries(item.system.turfs).forEach(([key, turf]) => {
          if (turf.name === 'BITD.Turf') {
            turfs_amount += (turf.value === true) ? 1 : 0;
          }
        });
      }

    });
    sheetData.system.turfs_amount = turfs_amount;

    return sheetData;
  }

  /* -------------------------------------------- */

  /** @override */
	activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    // Add Crew Type
    html.find(".crew-class").click(this._onItemAddClick.bind(this));

    // Update Inventory Item
    html.find('.item-sheet-open').click(ev => {
      const element = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(element.data("itemId"));
      item.sheet.render(true);
    });

    // Delete Inventory Item
    html.find('.item-delete').click( async ev => {
      const element = $(ev.currentTarget).parents(".item");
      await this.actor.deleteEmbeddedDocuments("Item", [element.data("itemId")]);
      element.slideUp(200, () => this.render(false));
    });

    // Add a new Cohort
    html.find('.add-item').click(ev => {
      BladesHelpers._addOwnedItem(ev, this.actor);
    });

    // Toggle Turf
    html.find('.turf-select').click( async ev => {
      const element = $(ev.currentTarget).parents(".item");

      let item_id = element.data("itemId")
      let turf_id = $(ev.currentTarget).data("turfId");
      let turf_current_status = $(ev.currentTarget).data("turfStatus");
      let turf_checkbox_name = 'system.turfs.' + turf_id + '.value';

      await this.actor.updateEmbeddedDocuments('Item', [{
        _id: item_id,
        [turf_checkbox_name]: !turf_current_status}]);
      this.render(false);
    });

    // Cohort Block Harm handler
    html.find('.cohort-block-harm input[type="radio"]').change( async ev => {
      const element = $(ev.currentTarget).parents(".item");

      let item_id = element.data("itemId")
      let harm_id = $(ev.currentTarget).val();

      await this.actor.updateEmbeddedDocuments('Item', [{
        _id: item_id,
        "system.harm": [harm_id]}]);
      this.render(false);
    });
  }


  /* -------------------------------------------- */
  /*  Form Submission                             */
	/* -------------------------------------------- */

  /** @override */
  async _updateObject(event, formData) {

    // Update the Item
    await super._updateObject(event, formData);

    if (event.target && event.target.name === "system.tier") {
      this.render(true);
    }
  }
  /* -------------------------------------------- */

}

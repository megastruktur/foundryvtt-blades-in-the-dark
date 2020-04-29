/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class BladesCrewSheet extends ActorSheet {

  /** @override */
	static get defaultOptions() {
	  return mergeObject(super.defaultOptions, {
  	  classes: ["blades-in-the-dark", "sheet", "actor"],
  	  template: "systems/blades-in-the-dark/templates/crew-sheet.html",
      width: 930,
      height: 970
    });
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    const data = super.getData();

    // Calculate Turfs amount.
    // We already have Lair, so set to -1.
    let turfs_amount = -1;

    data.items.forEach(item => {

      if (item.type === "crew_type") {
        // Object.entries(item.data.turfs).forEach(turf => {turfs_amount += (turf.value === true) ? 1 : 0});
        Object.entries(item.data.turfs).forEach(([key, turf]) => {
          turfs_amount += (turf.value === true) ? 1 : 0;
        });
      }

    });
    data.data.turfs_amount = turfs_amount;

    return data;
  }

  /* -------------------------------------------- */

  /** @override */
	activateListeners(html) {
    super.activateListeners(html);

    // Activate tabs
    const tabs = new TabsV2({navSelector: ".tabs", contentSelector: ".section", initial: "turfs"});

    // @todo Fix the error in TabsV2
    // tabs.bind(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    // Update Inventory Item
    html.find('.item-body').click(ev => {
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

    // Toggle Turf
    html.find('.turf-select').click(ev => {
      const element = $(ev.currentTarget).parents(".item");
      
      let item_id = element.data("itemId")
      let turf_id = $(ev.currentTarget).data("turfId");
      let turf_current_status = $(ev.currentTarget).data("turfStatus");
      let turf_checkbox_name = 'data.turfs.' + turf_id + '.value';

      this.actor.updateEmbeddedEntity('OwnedItem', {
        _id: item_id,
        [turf_checkbox_name]: !turf_current_status});
      this.render(false);
    });
  }

  /* -------------------------------------------- */

  /** override */
  _getFormData(form) {
    const FD = BladesHelpers.getFormDataHelper(form, this.editors);
    return FD;
  }

  /* -------------------------------------------- */

}

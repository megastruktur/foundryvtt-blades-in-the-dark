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
      width: 700,
      height: 970
    });
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    const data = super.getData();

    // Calculate Load
    let loadout = 0;
    data.items.forEach(i => {loadout += (i.type === "item") ? parseInt(i.data.load) : 0});
    data.data.loadout = loadout;
    console.log("DATA");
    console.log(data);
    return data;
  }

  /* -------------------------------------------- */

  /** @override */
	activateListeners(html) {
    super.activateListeners(html);

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
  }

  /* -------------------------------------------- */

  /** @override */
  _updateObject(event, formData) {
    
    // Update the Actor
    return this.object.update(formData);
  }

  /** override */
  _getFormData(form) {
    const FD = BladesHelpers.getFormDataHelper(form, this.editors);
    return FD;
  }

  /* -------------------------------------------- */

  /** @override */
  async _onDrop (event) {

    event.preventDefault();

    // Get dropped data
    let data;
    let item;
    try {
      data = JSON.parse(event.dataTransfer.getData('text/plain'));
    } catch (err) {
      return false;
    }

    // Add only Items.
    if (data.type === "Item") {

      // Import from Compendium
      if (data.pack) {
        const pack = game.packs.find(p => p.collection === data.pack);
        await pack.getEntity(data.id).then(ent => {
          item = ent;
        });
      }
      // Get from Items list.
      else {
        // Class must be distinct.
        item = game.items.get(data.id);
      }

      if (item) {
        const actor = this.actor;
        BladesHelpers._removeDuplicatedItemType(item.data.type, actor);
      }

      // Call parent on drop logic
      return super._onDrop(event);
    }

  }

  /* -------------------------------------------- */
}

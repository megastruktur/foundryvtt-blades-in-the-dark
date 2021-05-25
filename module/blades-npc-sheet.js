
import { BladesSheet } from "./blades-sheet.js";

/**
 * @extends {BladesSheet}
 */
export class BladesNPCSheet extends BladesSheet {

  /** @override */
	static get defaultOptions() {
	  return foundry.utils.mergeObject(super.defaultOptions, {
  	  classes: ["blades-in-the-dark", "sheet", "actor"],
  	  template: "systems/blades-in-the-dark/templates/npc-sheet.html",
      width: 900,
      height: 'auto',
      tabs: [{navSelector: ".tabs", contentSelector: ".tab-content"}]
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
    return data;
  }

  /* -------------------------------------------- */

    /** @override */
	activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    // Update Inventory Item
    // html.find('.item-body').click(ev => {
    //   const element = $(ev.currentTarget).parents(".item");
    //   const item = this.actor.items.get(element.data("itemId"));
    //   item.sheet.render(true);
    // });
	
    // // Delete Inventory Item
    // html.find('.item-delete').click(ev => {
    //   const element = $(ev.currentTarget).parents(".item");
    //   this.actor.deleteEmbeddedDocuments("Item", [element.data("itemId")]);
    //   element.slideUp(200, () => this.render(false));
    // });
	
	}
}

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
  async getData(options) {
    const superData = super.getData( options );
    const sheetData = superData.data;

    sheetData.isGM = game.user.isGM;
    sheetData.owner = superData.owner;
    sheetData.editable = superData.editable;

    sheetData.system.description = await TextEditor.enrichHTML(sheetData.system.description, {secrets: sheetData.owner, async: true});

    return sheetData;
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
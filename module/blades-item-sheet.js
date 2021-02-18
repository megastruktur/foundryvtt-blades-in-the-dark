/**
 * Extend the basic ItemSheet
 * @extends {ItemSheet}
 */
export class BladesItemSheet extends ItemSheet {

  /** @override */
	static get defaultOptions() {

	  return mergeObject(super.defaultOptions, {
			classes: ["blades-in-the-dark", "sheet", "item"],
      width: '800',
      height: 'auto',
      tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description"}]
		});
  }

  /* -------------------------------------------- */

  /** @override */
  get template() {
    const path = "systems/blades-in-the-dark/templates/items";
    let simple_item_types = ["background", "heritage", "vice", "crew_reputation"];
    let template_name = `${this.item.data.type}`;

    if (simple_item_types.indexOf(this.item.data.type) >= 0) {
      template_name = "simple";
    }

    return `${path}/${template_name}.html`;
  }

  /* -------------------------------------------- */

  /** @override */
	activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;
  }

  /* -------------------------------------------- */

  /** @override */
getData() {
  const data = super.getData();
  data.isGm = game.user.isGM;
  return data;
}
}

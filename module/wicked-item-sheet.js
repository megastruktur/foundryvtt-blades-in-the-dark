/**
 * Extend the basic ItemSheet
 * @extends {ItemSheet}
 */
export class BladesItemSheet extends ItemSheet {

  /** @override */
	static get defaultOptions() {

	  return mergeObject(super.defaultOptions, {
          classes: ["wicked-ones", "sheet", "item"],
			width: 'auto',
			height: 'auto',
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "abilitiestab"}]
		});
  }

  /* -------------------------------------------- */

  // Add config Values to local data object

  /** @override */
  async getData(options) {
    const data = super.getData(options);
    data.config = CONFIG.WO;
    return data;
  }

  /* -------------------------------------------- */

  /** @override */
  get template() {
      const path = "systems/wicked-ones/templates/items";
    let simple_item_types = ["defense", "wickedimpulse", "minionimpulse", "monsterrace", "revelry", "minion_type", "gear", "supply"];
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

    // Update Inventory Item
    html.find('#clock-type-list .clock-size-picker').click(ev => {
      const element = $(ev.currentTarget).parents(".item");
      const item = this.actor.getOwnedItem(element.data("itemId"));
      if (ev.target.value < this.getData().data.clock_progress) {
        html.find('#progress-' + ev.target.value).click();
      }
      item.sheet.render(true);
    });

  }

  /* -------------------------------------------- */
}

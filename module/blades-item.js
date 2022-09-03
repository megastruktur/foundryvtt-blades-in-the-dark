import { BladesHelpers } from "./blades-helpers.js";

/**
 * Extend the basic Item
 * @extends {Item}
 */
export class BladesItem extends Item {

  /** @override */
  async _preCreate( data, options, user ) {
    await super._preCreate( data, options, user );

    let removeItems = [];
    if( user.id === game.user.id ) {
      let actor = this.parent ? this.parent : null;
      if( actor?.documentName === "Actor" ) {
        removeItems = BladesHelpers.removeDuplicatedItemType( data, actor );
      }
      if( removeItems.length !== 0 ) {
        await actor.deleteEmbeddedDocuments( "Item", removeItems );
      }
    }
  }

  /* -------------------------------------------- */

  /* override */
  prepareData() {

    super.prepareData();

    const item_data = this.system;

    if (this.type === "cohort") {

      this._prepareCohort(item_data);

    }

    if (this.type === "faction") {
      if( !item_data.goal_1_clock_value ){ this.system.goal_1_clock_value = 0 }
      if( item_data.goal_1_clock_max === 0 ){ this.system.goal_1_clock_max = 4 }
      if( !item_data.goal_2_clock_value ){ this.system.goal_2_clock_value = 0 }
      if( item_data.goal_2_clock_max === 0 ){ this.system.goal_2_clock_max = 4 }
      this.system.size_list_1 = BladesHelpers.createListOfClockSizes( game.system.bladesClocks.sizes, this.system.goal_1_clock_max, parseInt( this.system.goal_1_clock_max ) );
      this.system.size_list_2 = BladesHelpers.createListOfClockSizes( game.system.bladesClocks.sizes, this.system.goal_2_clock_max, parseInt( this.system.goal_2_clock_max ) );
    }

  }

  /**
   * Prepares Cohort data
   *
   * @param {object} data
   */
  _prepareCohort(item_data) {

    let quality = 0;
    let scale = 0;

    // Adds Scale and Quality
    if (this.actor?.system) {
      switch (item_data.cohort) {
        case "Gang":
          scale = parseInt(this.actor.system.tier);
          quality = parseInt(this.actor.system.tier);
          break;
        case "Expert":
          scale = 0;
          quality = parseInt(this.actor.system.tier) + 1;
          break;
      }
    }

    this.system.scale = scale;
    this.system.quality = quality;
}
}

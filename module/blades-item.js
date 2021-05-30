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

  /** @override */
  async _onCreate( data, options, userId ) {
    super._onCreate( data, options, userId );

    if( userId === game.user.id ) {
      let actor = this.parent ? this.parent : null;

      if( ( actor?.documentName === "Actor" ) && ( actor?.permission >= CONST.ENTITY_PERMISSIONS.OWNER ) ) {
        await BladesHelpers.callItemLogic( data, actor );
      }
    }
  }

  /* -------------------------------------------- */

  /** @override */
  async _onDelete( options, userId ) {
    super._onDelete( options, userId );

    let actor = this.parent ? this.parent : null;
    let data = this.data;
    if ( ( actor?.documentName === "Actor" ) && ( actor?.permission >= CONST.ENTITY_PERMISSIONS.OWNER ) ) {
      await BladesHelpers.undoItemLogic( data, actor );
    }
  }

  /* -------------------------------------------- */

  /* override */
  prepareData() {

    super.prepareData();
    
    const item_data = this.data;
    const data = item_data.data;

    if (item_data.type === "cohort") {
    
      this._prepareCohort(data);
    
    }
  }

  /**
   * Prepares Cohort data
   *
   * @param {object} data 
   */
  _prepareCohort(data) {

    let quality = 0;
    let scale = 0;

    // Adds Scale and Quality
    if (this.actor) {
      switch (data.cohort[0]) {
        case "Gang":
          scale = parseInt(this.actor.data.data.tier[0]);
          quality = parseInt(this.actor.data.data.tier[0]);
          break;
        case "Expert":
          scale = 1;
          quality = parseInt(this.actor.data.data.tier[0]) + 1;
          break;
      }
    }

    data.scale = scale;
    data.quality = quality;
    
    this.data.data = data;
}
}

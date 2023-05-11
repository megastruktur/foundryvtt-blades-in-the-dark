
import { BladesSheet } from "./blades-sheet.js";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {BladesSheet}
 */
export class BladesClockSheet extends BladesSheet {

  /** @override */
	static get defaultOptions() {
	  return foundry.utils.mergeObject(super.defaultOptions, {
  	  classes: ["blades-in-the-dark", "sheet", "actor", "clock"],
  	  template: "systems/blades-in-the-dark/templates/actors/clock-sheet.html",
      width: 420,
      height: 400,
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

    return sheetData;
  }

    /* -------------------------------------------- */

  /** @override */
  async _updateObject(event, formData) {
    let image_path = `systems/blades-in-the-dark/styles/assets/progressclocks-svg/Progress Clock ${formData['system.type']}-${formData['system.value']}.svg`;
    formData['img'] = image_path;
    formData['prototypeToken.texture.src'] = image_path;
    let data = [];
    let update = {
      img: image_path
    };

    let tokens = this.actor.getActiveTokens();
    tokens.forEach( function( token ) {
      data.push(
        foundry.utils.mergeObject(
          { _id: token.id },
          update
        )
      );
    });
    if(game.scenes.current){
      await TokenDocument.updateDocuments( data, { parent: game.scenes.current } )
    }

    // Update the Actor
    return this.object.update(formData);
  }

  /* -------------------------------------------- */

}

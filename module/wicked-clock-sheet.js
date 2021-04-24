
import { WickedSheet } from "./wicked-sheet.js";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {WickedSheet}
 */
export class WickedClockSheet extends WickedSheet {

  /** @override */
	static get defaultOptions() {
	  return mergeObject(super.defaultOptions, {
          classes: ["wicked-ones", "sheet", "actor"],
          template: "systems/wicked-ones/templates/actors/clock-sheet.html",
      width: 600,
      height: 390,
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

		// Override Code for updating the sheet goes here

		return data;
	}

	/* -------------------------------------------- */

  /** @override */
  async _updateObject(event, formData) {

    let image_path = `/systems/wicked-ones/styles/assets/progressclocks-webp/${formData['data.style']}-${formData['data.type']}-${formData['data.value']}.webp`;

    formData['img'] = image_path;
    formData['token.img'] = image_path;

    let data = {
      img: image_path,
      width: 1,
      height: 1,
      scale: 1,
      mirrorX: false,
      mirrorY: false,
      tint: "",
      displayName: 50
    };

		let tokens = this.actor.getActiveTokens();

    tokens.forEach(function (token) {
			data.push(mergeObject(
				{_id: token.id},
				image
			));
    });

    await TokenDocument.updateDocuments(data, {parent: game.scenes.current});

    // Update the Actor
    return this.object.update(formData);
  }

  /* -------------------------------------------- */

}

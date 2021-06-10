
import { BladesSheet } from "./blades-sheet.js";
import {onManageActiveEffect, prepareActiveEffectCategories} from "./effects.js";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {BladesSheet}
 */
export class BladesActorSheet extends BladesSheet {

  /** @override */
	static get defaultOptions() {
	  return foundry.utils.mergeObject(super.defaultOptions, {
  	  classes: ["blades-in-the-dark", "sheet", "actor"],
  	  template: "systems/blades-in-the-dark/templates/actor-sheet.html",
      width: 700,
      height: 970,
      tabs: [{navSelector: ".tabs", contentSelector: ".tab-content", initial: "abilities"}]
    });
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    var data = super.getData();
    data.editable = this.options.editable;
    data.isGM = game.user.isGM;
    const actorData = data.data;
    data.actor = actorData;
    data.data = actorData.data;

    // Prepare active effects
    data.effects = prepareActiveEffectCategories(this.actor.effects);

    // Calculate Load
    let loadout = 0;
    data.items.forEach(i => {loadout += (i.type === "item") ? parseInt(i.data.load) : 0});
    data.data.loadout = loadout;
    
    // Encumbrance Levels
    let load_level=["BITD.Light","BITD.Light","BITD.Light","BITD.Light","BITD.Normal","BITD.Normal","BITD.Heavy","BITD.Encumbered",
			"BITD.Encumbered","BITD.Encumbered","BITD.OverMax"];
    let mule_level=["BITD.Light","BITD.Light","BITD.Light","BITD.Light","BITD.Light","BITD.Light","BITD.Normal","BITD.Normal",
			"BITD.Heavy","BITD.Encumbered","BITD.OverMax"];
    let mule_present=0;
 
    //Sanity Check
    if (loadout < 0) {
      loadout = 0;
    }
    if (loadout > 10) {
      loadout = 10;
    }

    //look for Mule ability
    // @todo - fix translation.
    data.items.forEach(i => {
      if (i.type == "ability" && i.name == "(C) Mule") {
        mule_present = 1;
      }
    });

    //set encumbrance level
    if (mule_present) {
      data.data.load_level=mule_level[loadout];
    } else {
      data.data.load_level=load_level[loadout];   
    }
    
    data.load_levels = {"BITD.Light":"BITD.Light", "BITD.Normal":"BITD.Normal", "BITD.Heavy":"BITD.Heavy"};

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
      const item = this.actor.items.get(element.data("itemId"));
      item.sheet.render(true);
    });

    // Delete Inventory Item
    html.find('.item-delete').click( async ev => {
      const element = $(ev.currentTarget).parents(".item");
      await this.actor.deleteEmbeddedDocuments("Item", [element.data("itemId")]);
      element.slideUp(200, () => this.render(false));
    });

    // manage active effects
    html.find(".effect-control").click(ev => onManageActiveEffect(ev, this.actor));
  }

  /* -------------------------------------------- */

}

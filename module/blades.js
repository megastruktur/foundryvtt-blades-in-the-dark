/**
 * A simple and flexible system for world-building using an arbitrary collection of character and item attributes
 * Author: Atropos
 * Software License: GNU GPLv3
 */

// Import Modules
import { preloadHandlebarsTemplates } from "./templates.js";
import { BladesHelpers } from "./blades-helpers.js";
import { BladesItem } from "./item.js";
import { BladesItemSheet } from "./item-sheet.js";
import { BladesActorSheet } from "./actor-sheet.js";
import { BladesCrewSheet } from "./crew-sheet.js";

window.BladesHelpers = BladesHelpers;

/* -------------------------------------------- */
/*  Foundry VTT Initialization                  */
/* -------------------------------------------- */
Hooks.once("init", async function() {
  console.log(`Initializing Blades In the Dark System`);

	/**
	 * Set an initiative formula for the system
	 * @type {String}
	 */
  CONFIG.Item.entityClass = BladesItem;

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("blades", BladesActorSheet, { types: ["character"], makeDefault: true });
  Actors.registerSheet("blades", BladesCrewSheet, { types: ["crew"], makeDefault: true });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("blades", BladesItemSheet, {makeDefault: true});
  preloadHandlebarsTemplates();


  // Multiboxes.
  Handlebars.registerHelper('multiboxes', function(selected, options) {
    
    let html = options.fn(this);
    
    selected.forEach(selected_value => {
      if (selected_value !== false) {
        const escapedValue = RegExp.escape(Handlebars.escapeExpression(selected_value));
        const rgx = new RegExp(' value=\"' + escapedValue + '\"');
        html = html.replace(rgx, "$& checked=\"checked\"");
      }
    });
    return html;
  });

  // Trauma Counter
  Handlebars.registerHelper('traumacounter', function(selected, options) {
    
    let html = options.fn(this);
    var count = selected.length;
    if (count > 4) count = 4;
    
    const rgx = new RegExp(' value=\"' + count + '\"');
    return html.replace(rgx, "$& checked=\"checked\"");

  });

  // Equals handlebar.
  Handlebars.registerHelper('eq', function (a, b, options) {
    return (a === b) ? options.fn(this) : '';
  });

  // NotEquals handlebar.
  Handlebars.registerHelper('noteq', function (a, b, options) {
    return (a !== b) ? options.fn(this) : '';
  });

  // ReputationTurf handlebar.
  Handlebars.registerHelper('repturf', function (turfs_amount, options) {
    let html = options.fn(this);
    var turfs_amount_int = parseInt(turfs_amount);

    // Can't be more than 6.
    if (turfs_amount_int > 6) {
      turfs_amount_int = 6;
    }

    for (let i = 13 - turfs_amount_int; i <= 12; i++) {
      const rgx = new RegExp(' value=\"' + i + '\"');
      html = html.replace(rgx, "$& disabled=\"disabled\"");
    }
    return html;
  });

});

/*
 * Hooks
 */
Hooks.on("preCreateOwnedItem", (parent_entity, child_data, options, userId) => {
  BladesHelpers.removeDuplicatedItemType(child_data.type, parent_entity);
});

Hooks.on("createOwnedItem", (parent_entity, child_data, options, userId) => {
  BladesHelpers.callItemLogic(child_data, parent_entity);
});

Hooks.on("deleteOwnedItem", (parent_entity, child_data, options, userId) => {
  BladesHelpers.undoItemLogic(child_data, parent_entity);
});

/**
 * A simple and flexible system for world-building using an arbitrary collection of character and item attributes
 * Author: Atropos
 * Software License: GNU GPLv3
 */

// Import Modules
import { preloadHandlebarsTemplates } from "./templates.js";
import { BladesItemSheet } from "./item-sheet.js";
import { BladesActorSheet } from "./actor-sheet.js";

/* -------------------------------------------- */
/*  Foundry VTT Initialization                  */
/* -------------------------------------------- */

Hooks.once("init", async function() {
  console.log(`Initializing Blades In the Dark System`);

	/**
	 * Set an initiative formula for the system
	 * @type {String}
	 */
	CONFIG.Combat.initiative = {
	  formula: "1d20",
    decimals: 2
  };

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("bitd", BladesActorSheet, { makeDefault: true });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("bitd", BladesItemSheet, {makeDefault: true});
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

});

/**
 * A simple and flexible system for world-building using an arbitrary collection of character and item attributes
 * Author: Atropos
 * Software License: GNU GPLv3
 */

// Import Modules
import { WO } from "./config.js";
import { registerSystemSettings } from "./settings.js";
import { preloadHandlebarsTemplates } from "./wicked-templates.js";
import { wickedRoll, simpleRollPopup } from "./wicked-roll.js";
import { WickedHelpers } from "./wicked-helpers.js";
import { WickedActor } from "./wicked-actor.js";
import { WickedItem } from "./wicked-item.js";
import { WickedItemSheet } from "./wicked-item-sheet.js";
import { WickedActorSheet } from "./wicked-actor-sheet.js";
import { WickedMinionSheet } from "./wicked-minion-sheet.js";
import { WickedDungeonSheet } from "./wicked-dungeon-sheet.js";
import { WickedPartySheet } from "./wicked-party-sheet.js";
import { WickedFactionSheet } from "./wicked-faction-sheet.js";
import { WickedClockSheet } from "./wicked-clock-sheet.js";
import * as migrations from "./migration.js";
import "./wicked-dicesonice.js";

CONFIG.WO = WO;

window.WickedHelpers = WickedHelpers;

/* -------------------------------------------- */
/*  Foundry VTT Initialization                  */
/* -------------------------------------------- */
Hooks.once("init", async function() {
  console.log(`Initializing Wicked Ones System`);

  game.wicked = {
    dice: wickedRoll
  }

  // Define Roll template.
  // CONFIG.Dice.template = "systems/wicked-ones/templates/wicked-roll.html"
  // CONFIG.Dice.tooltip = "systems/wicked-ones/templates/wicked-roll-tooltip.html"

  CONFIG.Item.entityClass = WickedItem;
  CONFIG.Actor.entityClass = WickedActor;

  // Register System Settings
  registerSystemSettings();

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("wicked", WickedActorSheet, { types: ["character"], makeDefault: true });
  Actors.registerSheet("wicked", WickedMinionSheet, { types: ["minion_pack"], makeDefault: true });
  Actors.registerSheet("wicked", WickedDungeonSheet, { types: ["dungeon"], makeDefault: true });
  Actors.registerSheet("wicked", WickedPartySheet, { types: ["party"], makeDefault: true });
  Actors.registerSheet("wicked", WickedFactionSheet, { types: ["faction"], makeDefault: true });
  Actors.registerSheet("wicked", WickedClockSheet, { types: ["clock"], makeDefault: true });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("wicked", WickedItemSheet, {makeDefault: true});
  preloadHandlebarsTemplates();


  // Multiboxes.
  Handlebars.registerHelper('multiboxes', function(selected, options) {
    
    let html = options.fn(this);

    // Fix for single non-array values.
    if ( !Array.isArray(selected) ) {
      selected = [selected];
    }
    
    if (typeof selected !== 'undefined') {
      selected.forEach(selected_value => {
        if (selected_value !== false) {
          const escapedValue = RegExp.escape(Handlebars.escapeExpression(selected_value));
          const rgx = new RegExp(' value=\"' + escapedValue + '\"');
          html = html.replace(rgx, "$& checked=\"checked\"");
        }
      });
    }
    return html;
  });

  // Debug Helper
  Handlebars.registerHelper("debug", function (optionalValue) {
    console.log("Current Context");
    console.log("====================");
    console.log(this);

    if (optionalValue) {
      console.log("Value");
      console.log("====================");
      console.log(optionalValue);
    }
  });

  // NotEquals handlebar.
  Handlebars.registerHelper('noteq', (a, b, options) => {
    return (a !== b) ? options.fn(this) : '';
  });

  // Ifin Helper to check if an element is part of a list
  Handlebars.registerHelper('ifIn', function (elem, list, options) {
    if (list.indexOf(elem) > -1) {
      return options.fn(this);
    }
    return options.inverse(this);
  });

  // Enrich the HTML replace /n with <br>
  Handlebars.registerHelper('html', (options) => {

    let text = options.hash['text'].replace(/\n/g, "<br />");

    return new Handlebars.SafeString(text);;
  });

  // "N Times" loop for handlebars.
  //  Block is executed N times starting from n=1.
  //
  // Usage:
  // {{#times_from_1 10}}
  //   <span>{{this}}</span>
  // {{/times_from_1}}
  Handlebars.registerHelper('times_from_1', function(n, block) {

    var accum = '';
    for (var i = 1; i <= n; ++i) {
      accum += block.fn(i);
    }
    return accum;
  });

  // "N Times" loop for handlebars.
  //  Block is executed N times starting from n=0.
  //
  // Usage:
  // {{#times_from_0 10}}
  //   <span>{{this}}</span>
  // {{/times_from_0}}
  Handlebars.registerHelper('times_from_0', function(n, block) {

    var accum = '';
    for (var i = 0; i <= n; ++i) {
      accum += block.fn(i);
    }
    return accum;
  });

  // Concat helper
  // https://gist.github.com/adg29/f312d6fab93652944a8a1026142491b1
  // Usage: (concat 'first 'second')
  Handlebars.registerHelper('concat', function() {
    var outStr = '';
    for(var arg in arguments){
        if(typeof arguments[arg]!='object'){
            outStr += arguments[arg];
        }
    }
    return outStr;
  });


  /**
   * @inheritDoc
   * Takes label from Selected option instead of just plain value.
   */

  Handlebars.registerHelper('selectOptionsWithLabel', function(choices, options) {

    const localize = options.hash['localize'] ?? false;
    let selected = options.hash['selected'] ?? null;
    let blank = options.hash['blank'] || null;
    selected = selected instanceof Array ? selected.map(String) : [String(selected)];

    // Create an option
    const option = (key, object) => {
      if ( localize ) object.label = game.i18n.localize(object.label);
      let isSelected = selected.includes(key);
      html += `<option value="${key}" ${isSelected ? "selected" : ""}>${object.label}</option>`
    };

    // Create the options
    let html = "";
    if ( blank ) option("", blank);
    Object.entries(choices).forEach(e => option(...e));

    return new Handlebars.SafeString(html);
  });


  /**
   * Create appropriate Blades clock
   */

  Handlebars.registerHelper('blades-clock', function(parameter_name, type, current_value, uniq_id) {

    let html = '';

    if (current_value === null) {
      current_value = 0;
    }

    if (parseInt(current_value) > parseInt(type)) {
      current_value = type;
    }

    // Label for 0
    html += `<label class="clock-zero-label" for="clock-0-${uniq_id}}"><i class="fab fa-creative-commons-zero nullifier" title="${game.i18n.localize('FITD.TOOLTIP.Reset')}"></i></label>`;
      html += `<div id="blades-clock-${uniq_id}" class="blades-clock clock-${type} clock-${type}-${current_value}" style="background-image:url('/systems/wicked-ones/styles/assets/progressclocks-webp/transparent-${type}-${current_value}.webp');">`;

    let zero_checked = (parseInt(current_value) === 0) ? 'checked="checked"' : '';
    html += `<input type="radio" value="0" id="clock-0-${uniq_id}}" name="${parameter_name}" ${zero_checked}>`;

    for (let i = 1; i <= parseInt(type); i++) {
      let checked = (parseInt(current_value) === i) ? 'checked="checked"' : '';
      html += `        
        <input type="radio" value="${i}" id="clock-${i}-${uniq_id}" name="${parameter_name}" ${checked}>
        <label for="clock-${i}-${uniq_id}"></label>
      `;
    }

    html += `</div>`;
    return html;
  });
});

/**
 * Once the entire VTT framework is initialized, check to see if we should perform a data migration
 */
Hooks.once("ready", function() {

  // Determine whether a system migration is required
  const currentVersion = game.settings.get("wicked-ones", "systemMigrationVersion");
  const NEEDS_MIGRATION_VERSION = 0.9;
  
  let needMigration = (currentVersion < NEEDS_MIGRATION_VERSION) || (currentVersion === null);
  
  // Perform the migration
  if ( needMigration && game.user.isGM ) {
    migrations.migrateWorld();
  }
});

/*
 * Hooks
 */
Hooks.on("preCreateOwnedItem", (parent_entity, child_data, options, userId) => {

  WickedHelpers.removeDuplicatedItemType(child_data, parent_entity);

  return true;
});

Hooks.on("createOwnedItem", (parent_entity, child_data, options, userId) => {

  WickedHelpers.callItemLogic(child_data, parent_entity);

  return true;
});


Hooks.on("deleteOwnedItem", (parent_entity, child_data, options, userId) => {
  
  WickedHelpers.undoItemLogic(child_data, parent_entity);

  return true;
});

// getSceneControlButtons
Hooks.on("renderSceneControls", async (app, html) => {
  let dice_roller = $('<li class="scene-control" title="Dice Roll"><i class="fas fa-dice"></i></li>');
  dice_roller.click(function() {
    simpleRollPopup();
  });
  html.append(dice_roller);
});

Hooks.on("renderChatMessage", (app, html, data) => {

  // Optionally expant the dice results
  if (game.settings.get("wicked-ones", "showExpandedRollResults")) html.find(".dice-tooltip").addClass('exp');
});

/**
 * Extend the basic ItemSheet
 * @extends {ItemSheet}
 */
export class WickedItemSheet extends ItemSheet {

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

    // Prepare special ability data
    if (data.item.type == "specialability") {

      if (data.data.ability_type == "ds_eyes") {

        let assigned_rays = [];
        let available_rays = {};

        // Iterate through ray selectors and populate assigned rays
        for (var i = 1; i < 10; i++) {
          if (data.data.primal['ds_eye_ray_' + i] != "") {
            assigned_rays.push(data.data.primal['ds_eye_ray_' + i]);
          }
        }

        // Iterate through all rays and populate available rays
        for (const [key, value] of Object.entries(CONFIG.WO.doomseeker_eye_rays)) {
          if (assigned_rays.indexOf(key) == -1) {
            available_rays[key] = CONFIG.WO.doomseeker_eye_rays[key];
          }
        }

        // Iterate through ray selectors and pupulate available rays for selector
        for (var i = 1; i < 10; i++) {
          data.config["available_rays" + i] = {};
          let val = data.data.primal['ds_eye_ray_' + i];
          if (val != "") {
            // Add own selected avalue as available
            data.config['available_rays' + i][val] = CONFIG.WO.doomseeker_eye_rays[val];
          }

          // Add available values to the list to select from
          for (const [key, value] of Object.entries(available_rays)) {
            available_rays[key] = CONFIG.WO.doomseeker_eye_rays[key];
            data.config['available_rays' + i][key] = CONFIG.WO.doomseeker_eye_rays[key];
          }
        }
      }

      if (data.data.ability_type == "be_psi") {
        data.data.source = game.i18n.localize("FITD.Braineater");
      } else if (data.data.ability_type == "ds_eyes") {
        data.data.source = game.i18n.localize("FITD.Doomseeker");
      } else if (data.data.ability_type == "fs_face") {
        data.data.source = game.i18n.localize("FITD.Facestealer");
      } else if (data.data.ability_type == "gm_path") {
        data.data.source = game.i18n.localize("FITD.Goldmonger");
      }

    } else {
      switch (data.item.type) {
        // Prepare dungeon duty data
        case "duty":
          data.data.type_hint_prompt = "";
          data.data.type_hint_paragraph1 = "";
          data.data.type_hint_paragraph2 = "";
          switch (data.data.type) {
            case "FITD.DUTY_TYPE.Creature":
              data.data.type_hint_prompt = game.i18n.localize("FITD.DUTY_TYPE.HINT.CreaturePrompt");
              data.data.type_hint_paragraph1 = game.i18n.localize("FITD.DUTY_TYPE.HINT.CreatureParagraph");
              break;
            case "FITD.DUTY_TYPE.Lock":
              data.data.type_hint_prompt = game.i18n.localize("FITD.DUTY_TYPE.HINT.LockPrompt");
              data.data.type_hint_paragraph1 = game.i18n.localize("FITD.DUTY_TYPE.HINT.LockParagraph1");
              data.data.type_hint_paragraph2 = game.i18n.localize("FITD.DUTY_TYPE.HINT.LockParagraph2");
              break;
            case "FITD.DUTY_TYPE.Trap":
              data.data.type_hint_prompt = game.i18n.localize("FITD.DUTY_TYPE.HINT.TrapPrompt");
              data.data.type_hint_paragraph1 = game.i18n.localize("FITD.DUTY_TYPE.HINT.TrapParagraph1");
              data.data.type_hint_paragraph2 = game.i18n.localize("FITD.DUTY_TYPE.HINT.TrapParagraph2");
              break;
            case "FITD.DUTY_TYPE.Trick":
              data.data.type_hint_prompt = game.i18n.localize("FITD.DUTY_TYPE.HINT.TrickPrompt");
              data.data.type_hint_paragraph1 = game.i18n.localize("FITD.DUTY_TYPE.HINT.TrickParagraph");
              break;

            default:
          }
          break;

        default:
      }

    }

    return data;
  }

  /* -------------------------------------------- */

  /** @override */
  get template() {
      const path = "systems/wicked-ones/templates/items";
    let simple_item_types = ["defense", "minionimpulse", "minion_type", "revelry", "wickedimpulse" ];
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

    // Update shared supplies across actors
    html.find('.shared-supply-count').change(this._onSharedSupplyChange.bind(this));

    // Update Inventory Item
    html.find('#item-type-select').change(ev => {
      const abilitytype = ev.currentTarget.value;
      const abilitygroup = $('#item-group-select')[0];
      switch (abilitytype) {
        case "be_psi":
        case "ds_eyes":
        case "gm_path":
          abilitygroup.value = "group_primal";
          break;
        case "fs_face":
          abilitygroup.value = "group_faces";
          break;

        case "basic":
        case "advanced":
        default:
          if (abilitygroup.value == "group_primal" || abilitygroup.value == "group_faces") {
            abilitygroup.value = "group_general";
          }
      }
    });

    /* -------------------------------------------- */

    // Update Edge List
    html.find('#edge-list input').change(ev => {
      const element = $(ev.currentTarget).parents(".item");
      const idOffset = element[0].id.lastIndexOf('-') + 1;
      const id = element[0].id.substring(idOffset);
      const item = this.actor ? this.actor.getOwnedItem(id) : this.object;
      const newEdges = [];
      const inputs = html.find('#edge-list input');
      for (var i = 0; i < inputs.length; i++) {
        if (typeof inputs[i].value != "undefined" && inputs[i].value != "") {
          newEdges.push(inputs[i].value);
        }
      }
      item.update({ ['data.edges']: newEdges });
    });

    /* -------------------------------------------- */

    // Update Adventurer Custom Field
    html.find('select.list-with-custom').change(ev => {
      const element = $(ev.currentTarget).parents(".item");
      const idOffset = element[0].id.lastIndexOf('-') + 1;
      const id = element[0].id.substring(idOffset);
      const item = this.actor ? this.actor.getOwnedItem(id) : this.object;
      const selected = ev.currentTarget.value;
      const propertyToSet = ev.currentTarget.dataset.propertyToSet;
      if (selected == "" || selected == "custom") {
        item.update({ ['data.' + propertyToSet]: "" });
      } else if (selected == "random") {
        const options = ev.currentTarget.length - 3;
        const choice = Math.floor(Math.random() * options ) + 3;
        for (var i = 0; i < ev.currentTarget.length; i++) {
          if (i == choice) {
            ev.currentTarget[i].selected = true;
            item.update({ ['data.' + propertyToSet]: game.i18n.localize(ev.currentTarget[i].value) });
          } else {
            ev.currentTarget[i].selected = false;
          }
        }
      } else {
        item.update({ ['data.' + propertyToSet]: game.i18n.localize(selected) });
      }
    });

    /* -------------------------------------------- */

    // Clock Size Changed
    html.find('#clock-type-list .clock-size-picker').click(ev => {
      const element = $(ev.currentTarget).parents(".item");
      const idOffset = element[0].id.lastIndexOf('-') + 1;
      const id = element[0].id.substring(idOffset);
      const item = this.actor ? this.actor.getOwnedItem(id) : this.object;
      if (ev.target.value < item.data.data.clock_progress) {
        item.update({ ['data.clock_progress']: ev.target.value });
      }
      item.update({ ['data.clock_size']: ev.target.value });
    });

  }


  /* -------------------------------------------- */

  /**
   * Update shared supplies across characters
   * @param {*} event 
   */
  async _onSharedSupplyChange(event) {
    event.preventDefault();

    let name = this.object.data.name;
    let value = event.currentTarget.value;

    const actors = game.actors.filter(entry => entry.data.type === "character");
    actors.forEach(actor => {
      actor.items.forEach(item => {
        if (item.name == name && item.type == "gearsupply") {
          if (item.data.data.gear_or_supply == "supply" && item.data.data.use_type == "shared") {
            item.update({ ['data.uses_left' ]: value });
          }
        }
      });
    });

  }


  /* -------------------------------------------- */
}

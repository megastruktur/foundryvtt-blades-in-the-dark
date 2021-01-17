import { wickedRoll } from "./wicked-roll.js";
import { WickedHelpers } from "./wicked-helpers.js";

/**
 * Extend the basic Actor
 * @extends {Actor}
 */
export class WickedActor extends Actor {

  /**
  * Create a new entity using provided input data
  * @override
  */
  static async create(data, options = {}) {
    if (Object.keys(data).includes("type")) {

      if (!(Object.keys(data).includes("token"))) {
        data.token = {};
      }
      switch (data.type) {
        case "character":
        case "dungeon":
        case "faction":
        case "minion_pack":
        case "party":
          // Replace default image
          data.img = `systems/wicked-ones/styles/assets/default-images/${data.type}.webp`;
          data.token.img = `systems/wicked-ones/styles/assets/default-images/${data.type}-token.webp`;
          break;
        default:
      }

      switch (data.type) {
        case "faction":
          mergeObject(
            data.token,
            {
              displayName: 50,
              lockRotation: true,
              vision: false,
              actorLink: true
            },
            { overwrite: false }
          );
          break;
        default:
      }


    }
    await super.create(data, options);
  }

  /* -------------------------------------------- */

  /**
   * Augment the basic actor data with additional dynamic data.
   */
  /** @override */
  prepareData() {
    super.prepareData();

    const actorData = this.data;
    const data = actorData.data;
    const flags = actorData.flags;

    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.
    if (actorData.type === 'character') this._prepareWickedOneData(actorData);
    if (actorData.type === 'dungeon') this._prepareDungeonData(actorData);
    if (actorData.type === 'faction') this._prepareFactionData(actorData);
  }


/* -------------------------------------------- */


  /**
  * Prepare Wicked One data
  */
  _prepareWickedOneData(actorData) {
    const data = actorData.data;

    // Make modifications to data here.
    data.is_primal_monster = false;
    data.primal_monster_type = "";
    data.calling_name = "";

    for (var i = 0; i < actorData.items.length; i++) {
      if (actorData.items[i].type == "monster_race") {
        data.is_primal_monster = actorData.items[i].data.primal;
        if (data.is_primal_monster) {
          data.primal_monster_type = actorData.items[i].name;
        }
      } else if (actorData.items[i].type == "calling") {
        data.calling_name = actorData.items[i].name;
      }
    }

    let removeAt = -1;
    for (var i = 0; i < actorData.items.length; i++) {
      if (actorData.items[i].type == "specialability" && actorData.items[i].data.ability_group == "group_general") {
        if (data.is_primal_monster && actorData.items[i].data.source != data.primal_monster_type) {
          actorData.items[i].data.ability_group = "group_flex";
        } else if (actorData.items[i].data.source != data.calling_name) {
          actorData.items[i].data.ability_group = "group_flex";
        }
      } else if (actorData.items[i].type == "calling" && data.is_primal_monster) {
        removeAt = i;
      }
    }
    // Remove callings for primal monsters
    if (removeAt != -1) {
      actorData.items.splice(removeAt, 1);
    }

  }

  /* -------------------------------------------- */

  /**
  * Prepare Dungeon data
  */
  _prepareDungeonData(actorData) {
    const data = actorData.data;

    // Make modifications to data here.
    data.has_no_theme = true;

    for (var i = 0; i < actorData.items.length; i++) {
      if (actorData.items[i].type == "dungeon_theme") {
        data.has_no_theme = false;
        break;
      }
    }
  }

  /* -------------------------------------------- */

  /**
   * Prepare Faction data
   */
  _prepareFactionData(actorData) {
    const data = actorData.data;

    // Make modifications to data here.
    data.clock_active_1 = (data.clock1.max != 0);
    data.clock_active_2 = (data.clock2.max != 0);
    data.clock_uid_1 = actorData._id + "-1";
    data.clock_uid_2 = actorData._id + "-2";
  }

  /* -------------------------------------------- */

  /** @override */
  getRollData() {
    const data = super.getRollData();

    data.dice_amount = this.getAttributeDiceToThrow();
    data.default_bonus = this.getAttributeDefaultBonus();

    return data;
  }


  /* -------------------------------------------- */

  /** @override */
  async createEmbeddedEntity(embeddedName, data, options) {
    if (data instanceof Array) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].type == "adventurer") {
          data[i].name = this.getUniqueName(data[i].name);
          if (data[i].data.adventurer_type == "hireling" && data[i].data.hireling_type == "") {
            data[i].data.hireling_type = this.getRandomHirelingType();
            data[i].data.hireling_type_custom = game.i18n.localize(data[i].data.hireling_type);
          }
        }
      }
    } else if (data.type == "adventurer") {
      data.name = this.getUniqueName(data.name);
      if (data.data.adventurer_type == "hireling" && data.data.hireling_type == "") {
        data.data.hireling_type = this.getRandomHirelingType();
        data.data.hireling_type_custom = game.i18n.localize(data.data.hireling_type);
      }
    }
    super.createEmbeddedEntity(embeddedName, data, options);
  }

  /* -------------------------------------------- */

  getUniqueName(oldName) {
    let namesUsed = [];
    for (var i = 0; i < this.data.items.length; i++) {
      namesUsed.push(this.data.items[i].name);
    }

    let newName = oldName;
    if (namesUsed.indexOf(newName) != -1) {
      let j = 1;
      do {
        j++;
        newName = oldName + ' ' + j;
      } while (namesUsed.indexOf(newName) != -1 || j > 999);
    }
    return newName;
  }

  /* -------------------------------------------- */


  getRandomHirelingType() {
    return Object.values(CONFIG.WO.hireling_types)[Math.floor(Math.random() * Object.values(CONFIG.WO.hireling_types).length)] ?? ""
    ;
  }

  /* -------------------------------------------- */

  /**
   * Calculate Attribute Dice to throw.
   */
  getAttributeDiceToThrow() {

    // Calculate Dice to throw.
    let dice_amount = {};

    // Add extra values for braineater disciplines and doomseeker eye rays if available
    this.data.items.forEach(specialAbility => {
      if (specialAbility.type == "specialability" && specialAbility.data.ability_type == "ds_eyes") {
        for (var i = 1; i < 10; i++) {
          dice_amount[specialAbility.data.primal['ds_eye_ray_' + i]] = parseInt(specialAbility.data.primal['ds_eye_ray_' + i + '_val']);
        }
      } else if (specialAbility.type == "specialability" && specialAbility.data.ability_type == "be_psi") {
        dice_amount[specialAbility.data.primal.be_psi_skill_name] = parseInt(specialAbility.data.primal.be_psi_dots);

      }
    });

    let attr = this.data.data.attributes;
    for (var attr_name in attr) {
      for (var skill_name in attr[attr_name].skills) {
        let val = parseInt(attr[attr_name].skills[skill_name]['value'][0]);
        if (val == 1 &&
            attr[attr_name].skills[skill_name].practice != undefined &&
            attr[attr_name].skills[skill_name].practice != 0) {
          val = 0;
        }
        dice_amount[skill_name] = val;
      }
    }

    return dice_amount;
  }

  /* -------------------------------------------- */

  /*
  * Calculate Attribute Default Bonus Dice to throw.
  */
  getAttributeDefaultBonus() {

    // Calculate Dice to throw.
    let dice_amount = {};

    // Add extra values for braineater disciplines and doomseeker eye rays if available
    this.data.items.forEach(specialAbility => {
      if (specialAbility.type == "specialability" && specialAbility.data.ability_type == "ds_eyes") {
        for (var i = 1; i < 10; i++) {
          dice_amount[specialAbility.data.primal['ds_eye_ray_' + i]] = this.data.data.attributes["guts"].shocked ? -1 : 0;
        }
      } else if (specialAbility.type == "specialability" && specialAbility.data.ability_type == "be_psi") {
        dice_amount[specialAbility.data.primal.be_psi_skill_name] = dice_amount[specialAbility.data.primal['ds_eye_ray_' + i]] = this.data.data.attributes["guts"].shocked ? -1 : 0;

      }
    });

    for (var attibute_name in this.data.data.attributes) {
      for (var skill_name in this.data.data.attributes[attibute_name].skills) {
        if (this.data.type == "minion_pack") {
          dice_amount[skill_name] = this.data.data.bloodied ? -1 : 0;
        } else {
          dice_amount[skill_name] = this.data.data.attributes[attibute_name].shocked ? -1 : 0;
        }
      }

    }

    return dice_amount;
  }

  /* -------------------------------------------- */

  rollAttributePopup(attribute_name, attribute_value = null) {

    let attribute_label = WickedHelpers.getAttributeLabel(attribute_name);
	
    // Calculate Dice Amount for Attributes
    var dice_amount = attribute_value ? attribute_value : 0;
    var default_bonus = 0;
    if (attribute_value == null && attribute_name !== "") {
      let roll_data = this.getRollData();
      dice_amount += roll_data.dice_amount[attribute_name];
      default_bonus += roll_data.default_bonus[attribute_name];
	  }
		
    new Dialog({
      title: `${game.i18n.localize('FITD.Roll')} ${game.i18n.localize(attribute_label)}`,
      content: `
        <h2>${game.i18n.localize('FITD.Roll')} ${game.i18n.localize(attribute_label)} (${dice_amount}D)</h2>
        <form id="skill-roll">
          <div class="form-group">
            <label>${game.i18n.localize('FITD.RollType')}:</label>
            <select id="type" name="type">
              <option value="action" selected>${game.i18n.localize('FITD.RollAction')}</option>		  
              <option value="resistance">${game.i18n.localize('FITD.RollResistance')}</option>			  
            </select>
          </div>
          <div class="form-group">
				    <label>${game.i18n.localize('FITD.Position')}:</label>
				    <select id="pos" name="pos">
				      <option value="dominant">${game.i18n.localize('FITD.PositionDominant')}</option>
				      <option value="default" selected>${game.i18n.localize('FITD.PositionDefault')}</option>
				      <option value="dire">${game.i18n.localize('FITD.PositionDire')}</option>
				      <option value="deadly">${game.i18n.localize('FITD.PositionDeadly')}</option>
				    </select>
          </div>
          <div class="form-group">
				    <label>${game.i18n.localize('FITD.Effect')}:</label>
				    <select id="fx" name="fx">
				      <option value="strong">${game.i18n.localize('FITD.EffectStrong')}</option>
				      <option value="default" selected>${game.i18n.localize('FITD.EffectDefault')}</option>		  
				      <option value="weak">${game.i18n.localize('FITD.EffectWeak')}</option>
				      <option value="zero">${game.i18n.localize('FITD.EffectZero')}</option>	  
				    </select>
			    </div>
		      <div class="form-group">
            <label>${game.i18n.localize('FITD.Modifier')}:</label>
            <select id="mod" name="mod" data-base-dice="${dice_amount}">
              ${this.createListOfDiceMods(-3, +3, default_bonus)}
            </select>
          </div>
		      <div class="total-rolled form-group">
            <label class="total-rolled">${game.i18n.localize('FITD.TotalSkillDice')}: </label>
			      <label>${dice_amount + default_bonus}D</label>
          </div>		  
        </form>
		    <h2>${game.i18n.localize('FITD.RollOptions')}</h2>
		    <div class="action-info">${game.i18n.localize('FITD.TooltipActions')}</div>
      `,
      buttons: {
        yes: {
          icon: "<i class='fas fa-check'></i>",
          label: game.i18n.localize('FITD.Roll'),
          callback: (html) => {
            let modifier = parseInt(html.find('[name="mod"]')[0].value);
            let position = html.find('[name="pos"]')[0].value;
            let effect = html.find('[name="fx"]')[0].value;
            let type = html.find('[name="type"]')[0].value;
            if (attribute_value == null) {
              this.rollAttribute(attribute_name, modifier, position, effect, type);
            } else {
              this.rollAttribute("", (dice_amount - 1 + modifier), position, effect, type);
            }
          }
        },
        no: {
          icon: "<i class='fas fa-times'></i>",
          label: game.i18n.localize('Close'),
        },
      },
      default: "yes",
      render: html => {
        $("#skill-roll #mod").change(this._onDiceModChange);
      },
    }).render(true);


  }

  /* -------------------------------------------- */
  
  rollAttribute(attribute_name = "", additional_dice_amount = 0, position, effect, type) {

    let dice_amount = 0;
    if (attribute_name !== "") {
      let roll_data = this.getRollData();
      dice_amount += roll_data.dice_amount[attribute_name];
    }
    else {
      dice_amount = 1;
    }
    dice_amount += additional_dice_amount;

    wickedRoll(dice_amount, attribute_name, position, effect, type);
  }

  /* -------------------------------------------- */

  /**
   * Create <options> for available actions
   *  which can be performed.
   */
  createListOfActions() {
  
    let text, attribute, skill;
    let attributes = this.data.data.attributes;
  
    for ( attribute in attributes ) {
  
      var skills = attributes[attribute].skills;
  
      text += `<optgroup label="${attribute} Actions">`;
      text += `<option value="${attribute}">${attribute} (Resist)</option>`;
  
      for ( skill in skills ) {
        text += `<option value="${skill}">${skill}</option>`;
      }
  
      text += `</optgroup>`;
  
    }
  
    return text;
  
  }

  /* -------------------------------------------- */

  /**
   * Creates <options> modifiers for dice roll.
   *
   * @param {int} rs
   *  Min die modifier
   * @param {int} re 
   *  Max die modifier
   * @param {int} s
   *  Selected die
   */
  createListOfDiceMods(rs, re, s) {
  
    var text = ``;
    var i = 0;
  
    if ( s == "" ) {
      s = 0;
    }
  
    for ( i  = rs; i <= re; i++ ) {
      var plus = "";
      if ( i >= 0 ) { plus = "+" };
      text += `<option value="${i}"`;
      if ( i == s ) {
        text += ` selected`;
      }
      
      text += `>${plus}${i}D</option>`;
    }
  
    return text;
  
  }

  /* -------------------------------------------- */

  /**
   * Change dice total on display
   * @param {*} event 
   */
  async _onDiceModChange(event) {
    let mod = this.value;
    let base = this.dataset.baseDice;

    $("#skill-roll .total-rolled label:nth-child(2)").text(parseInt(base) + parseInt(mod) + "D");
  }

  /* -------------------------------------------- */

}

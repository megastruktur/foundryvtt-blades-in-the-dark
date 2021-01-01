import { wickedRoll } from "./wicked-roll.js";
import { WickedHelpers } from "./wicked-helpers.js";

/**
 * Extend the basic Actor
 * @extends {Actor}
 */
export class WickedActor extends Actor {


  /** @override */
  getRollData() {
    const data = super.getRollData();

    data.dice_amount = this.getAttributeDiceToThrow();
    data.default_bonus = this.getAttributeDefaultBonus();

    return data;
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

    for (var attibute_name in this.data.data.attributes) {
      for (var skill_name in this.data.data.attributes[attibute_name].skills) {
        dice_amount[skill_name] = parseInt(this.data.data.attributes[attibute_name].skills[skill_name]['value'][0])
      }

    }

    return dice_amount;
  }

  /* -------------------------------------------- */
  /**
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
		
	  //aus Zeile 100: ${dice_amount+document.getElementById('mod').selected.value}
	  let diceMod = 0;

    new Dialog({
      title: `${game.i18n.localize('FITD.Roll')} ${game.i18n.localize(attribute_label)}`,
      content: `
        <h2>${game.i18n.localize('FITD.Roll')} ${game.i18n.localize(attribute_label)} (${dice_amount}D)</h2>
        <form>
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
            <select id="mod" name="mod">
              ${this.createListOfDiceMods(-3, +3, default_bonus)}
            </select>
          </div>
		  <div class="form-group">
            <label>${game.i18n.localize('FITD.TotalSkillDice')}:</label>
			Total not working yet: ${dice_amount+diceMod}
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

}

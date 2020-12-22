import { bladesRoll } from "./wicked-roll.js";
import { BladesHelpers } from "./wicked-helpers.js";

/**
 * Extend the basic Actor
 * @extends {Actor}
 */
export class BladesActor extends Actor {


  /** @override */
  getRollData() {
    const data = super.getRollData();

    data.dice_amount = this.getAttributeDiceToThrow();

    return data;
  }

  /* -------------------------------------------- */
  /**
   * Calculate Attribute Dice to throw.
   */
  getAttributeDiceToThrow() {

    // Calculate Dice to throw.
    let dice_amount = {};
    for (var attibute_name in this.data.data.attributes) {
      dice_amount[attibute_name] = 0;
      for (var skill_name in this.data.data.attributes[attibute_name].skills) {
        dice_amount[skill_name] = parseInt(this.data.data.attributes[attibute_name].skills[skill_name]['value'][0])

        // We add a +1d for every skill higher than 0.
        if (dice_amount[skill_name] > 0) {
          dice_amount[attibute_name]++;
        }
      }

    }

    return dice_amount;
  }

  /* -------------------------------------------- */

  rollAttributePopup(attribute_name) {

    // const roll = new Roll("1d20 + @abilities.wis.mod", actor.getRollData());
    let attribute_label = BladesHelpers.getAttributeLabel(attribute_name);
	
	// Calculate Dice Amount for Attributes
    var dice_amount = 0;
    if (attribute_name !== "") {
      let roll_data = this.getRollData();
      dice_amount += roll_data.dice_amount[attribute_name];
	}
	else {
	  dice_amount = 0;
		}
		
	 //aus Zeile 100: ${dice_amount+document.getElementById('mod').selected.value}
	let diceMod = 0;

    new Dialog({
      title: `${game.i18n.localize('FITD.Roll')} ${game.i18n.localize(attribute_label)}`,
      content: `
        <h2>${game.i18n.localize('FITD.Roll')} ${game.i18n.localize(attribute_label)}(${dice_amount}D)</h2>
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
              ${this.createListOfDiceMods(-3,+3,0)}
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
            this.rollAttribute(attribute_name, modifier, position, effect, type);
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

    bladesRoll(dice_amount, attribute_name, position, effect, type);
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

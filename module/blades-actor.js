import { bladesRoll } from "./blades-roll.js";

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
    new Dialog({
      title: `Roll ${attribute_name}`,
      content: `
        <h2>Roll ${attribute_name}</h2>
        <form>
          <div class="form-group">
            <label>${game.i18n.localize('BITD.Modifier')}:</label>
            <select id="mod" name="mod">
              ${this.createListOfDiceMods(-3,+3,0)}
            </select>
            </div>
            <div class="form-group">
            <label>${game.i18n.localize('BITD.Position')}:</label>
            <select id="pos" name="pos">
              <option value="controlled">${game.i18n.localize('BITD.PositionControlled')}</option>
              <option value="risky" selected>${game.i18n.localize('BITD.PositionRisky')}</option>
              <option value="desperate">${game.i18n.localize('BITD.PositionDesperate')}</option>
            </select>
            </div>
            <div class="form-group">
            <label>${game.i18n.localize('BITD.Effect')}:</label>
            <select id="fx" name="fx">
              <option value="limited">${game.i18n.localize('BITD.EffectLimited')}</option>
              <option value="standard" selected>${game.i18n.localize('BITD.EffectStandard')}</option>
              <option value="great">${game.i18n.localize('BITD.EffectGreat')}</option>
            </select>
          </div>
        </form>
      `,
      buttons: {
        yes: {
          icon: "<i class='fas fa-check'></i>",
          label: `Roll`,
          callback: (html) => {
            let modifier = parseInt(html.find('[name="mod"]')[0].value);
            let position = html.find('[name="pos"]')[0].value;
            let effect = html.find('[name="fx"]')[0].value;
            this.rollAttribute(attribute_name, modifier, position, effect);
          }
        },
        no: {
          icon: "<i class='fas fa-times'></i>",
          label: `Close`,
        },
      },
      default: "yes",
    }).render(true);

  }

  /* -------------------------------------------- */
  
  rollAttribute(attribute_name = "", additional_dice_amount = 0, position, effect) {

    let dice_amount = 0;
    if (attribute_name !== "") {
      let roll_data = this.getRollData();
      dice_amount += roll_data.dice_amount[attribute_name];
    }
    else {
      dice_amount = 1;
    }
    dice_amount += additional_dice_amount;

    bladesRoll(dice_amount, attribute_name, position, effect);
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
      
      text += `>${plus}${i}d</option>`;
    }
  
    return text;
  
  }

  /* -------------------------------------------- */

}
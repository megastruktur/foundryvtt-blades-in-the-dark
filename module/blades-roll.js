/**
 * Roll Dice.
 * @param {int} dice_amount
 * @param {string} attribute_name
 * @param {string} position
 * @param {string} effect
 */
export async function bladesRoll(dice_amount, attribute_name = "", position = "risky", effect = "standard", note = "", current_stress, current_crew_tier) {

  // ChatMessage.getSpeaker(controlledToken)
  let zeromode = false;

  if ( dice_amount < 0 ) { dice_amount = 0; }
  if ( dice_amount === 0 ) { zeromode = true; dice_amount = 2; }

  let r = new Roll( `${dice_amount}d6`, {} );

  // show 3d Dice so Nice if enabled
  r.evaluate({async:true});
  await showChatRollMessage(r, zeromode, attribute_name, position, effect, note, current_stress, current_crew_tier);
}

/**
 * Shows Chat message.
 *
 * @param {Roll} r
 * @param {Boolean} zeromode
 * @param {String} attribute_name
 * @param {string} position
 * @param {string} effect
 */
async function showChatRollMessage(r, zeromode, attribute_name = "", position = "", effect = "", note = "", current_stress, current_crew_tier) {

  let speaker = ChatMessage.getSpeaker();
  let rolls = (r.terms)[0].results;
  let attribute_label = BladesHelpers.getRollLabel(attribute_name);

  // Retrieve Roll status.
  let roll_status = getBladesRollStatus(rolls, zeromode);

  let result;
  if (BladesHelpers.isAttributeAction(attribute_name)) {
    let position_localize = '';
    switch (position) {
      case 'controlled':
        position_localize = 'BITD.PositionControlled'
        break;
      case 'desperate':
        position_localize = 'BITD.PositionDesperate'
        break;
      case 'risky':
      default:
        position_localize = 'BITD.PositionRisky'
    }

    let effect_localize = '';
    switch (effect) {
      case 'limited':
        effect_localize = 'BITD.EffectLimited'
        break;
      case 'great':
        effect_localize = 'BITD.EffectGreat'
        break;
      case 'standard':
      default:
        effect_localize = 'BITD.EffectStandard'
    }

    result = await renderTemplate("systems/blades-in-the-dark/templates/chat/action-roll.html", {rolls: rolls, roll_status: roll_status, attribute_label: attribute_label, position: position, position_localize: position_localize, effect: effect, effect_localize: effect_localize, note: note});
  }
  // Check for Resistance roll
  else if (BladesHelpers.isAttributeAttribute(attribute_name)) {
    let stress = getBladesRollStress(rolls, zeromode);

    result = await renderTemplate("systems/blades-in-the-dark/templates/chat/resistance-roll.html", {rolls: rolls, roll_status: roll_status, attribute_label: attribute_label, stress: stress, note: note});
  }
  // Check for Indugle Vice roll
  else if (attribute_name == 'BITD.Vice') {
    let clear_stress = getBladesRollVice(rolls, zeromode);

    if (current_stress - clear_stress >= 0) {
      roll_status = "success";
    } else {
      roll_status = "failure";
      clear_stress = current_stress;
    }

    result = await renderTemplate("systems/blades-in-the-dark/templates/chat/vice-roll.html", {rolls: rolls, roll_status: roll_status, attribute_label: attribute_label, clear_stress: clear_stress, note: note});
  }
  // Check for Gather Information roll
  else if (attribute_name == 'BITD.GatherInformation') {
    result = await renderTemplate("systems/blades-in-the-dark/templates/chat/gather-info-roll.html", {rolls: rolls, roll_status: roll_status, attribute_label: attribute_label, note: note});
  }
  // Check for Engagement roll
  else if (attribute_name == 'BITD.Engagement') {
    result = await renderTemplate("systems/blades-in-the-dark/templates/chat/engagement-roll.html", {rolls: rolls, roll_status: roll_status, attribute_label: attribute_label, note: note});
  }
  // Check for Asset roll
  else if (attribute_name == 'BITD.AcquireAsset') {
    let tier_quality = Number(current_crew_tier);
    let status = String(roll_status);
    switch (status) {
      case "critical-success":
        tier_quality = tier_quality + 2;
        break;
      case "success":
        tier_quality = tier_quality + 1;
        break;
      case "failure":
        if (tier_quality > 0){
          tier_quality = tier_quality - 1;
        }
        break;
      default:
        break;
    }

    result = await renderTemplate("systems/blades-in-the-dark/templates/chat/asset-roll.html", {rolls: rolls, roll_status: roll_status, attribute_label: attribute_label, tier_quality: tier_quality, note: note});
  }
  // Fortune roll if not specified
  else {
    result = await renderTemplate("systems/blades-in-the-dark/templates/chat/fortune-roll.html", {rolls: rolls, roll_status: roll_status, attribute_label: "BITD.Fortune", note: note});
  }

  let messageData = {
    speaker: speaker,
    content: result,
    type: CONST.CHAT_MESSAGE_TYPES.ROLL,
    roll: r
  }

  CONFIG.ChatMessage.documentClass.create(messageData, {})
}

/**
 * Get status of the Roll.
 *  - failure
 *  - partial-success
 *  - success
 *  - critical-success
 * @param {Array} rolls
 * @param {Boolean} zeromode
 */
export function getBladesRollStatus(rolls, zeromode = false) {

  // Sort roll values from lowest to highest.
  let sorted_rolls = rolls.map(i => i.result).sort();

  let roll_status = "failure"

  if (sorted_rolls[0] === 6 && zeromode) {
    roll_status = "success";
  }
  else {
    let use_die;
    let prev_use_die = false;

    if (zeromode) {
      use_die = sorted_rolls[0];
    }
    else {
      use_die = sorted_rolls[sorted_rolls.length - 1];

      if (sorted_rolls.length - 2 >= 0) {
        prev_use_die = sorted_rolls[sorted_rolls.length - 2]
      }
    }

    // 1,2,3 = failure
    if (use_die <= 3) {
      roll_status = "failure";
    }
    // if 6 - check the prev highest one.
    else if (use_die === 6) {
      // 6,6 - critical success
      if (prev_use_die && prev_use_die === 6) {
        roll_status = "critical-success";
      }
      // 6 - success
      else {
        roll_status = "success";
      }
    }
    // else (4,5) = partial success
    else {
      roll_status = "partial-success";
    }

  }

  return roll_status;

}
/**
 * Get stress of the Roll.
 * @param {Array} rolls
 * @param {Boolean} zeromode
 */
export function getBladesRollStress(rolls, zeromode = false) {

  var stress = 6;

  // Sort roll values from lowest to highest.
  let sorted_rolls = rolls.map(i => i.result).sort();

  let roll_status = "failure"

  if (sorted_rolls[0] === 6 && zeromode) {
    stress = -1;
  }
  else {
    let use_die;
    let prev_use_die = false;

    if (zeromode) {
      use_die = sorted_rolls[0];
    }
    else {
      use_die = sorted_rolls[sorted_rolls.length - 1];

      if (sorted_rolls.length - 2 >= 0) {
        prev_use_die = sorted_rolls[sorted_rolls.length - 2]
      }
    }

    if (use_die === 6 && prev_use_die && prev_use_die === 6) {
      stress = -1;
    } else {
      stress = 6 - use_die;
    }

  }

  return stress;

}

/**
 * Get stress cleared with a Vice Roll.
 * @param {Array} rolls
 * @param {Boolean} zeromode
 */
export function getBladesRollVice(rolls, zeromode = false) {
  // Sort roll values from lowest to highest.
  let sorted_rolls = rolls.map(i => i.result).sort();
  let use_die;

  if (zeromode) {
    use_die = sorted_rolls[0];
  }
  else {
    use_die = sorted_rolls[sorted_rolls.length - 1];
  }

  return use_die;

}


/**
 * Call a Roll popup.
 */
export async function simpleRollPopup() {

  new Dialog({
    title: `Simple Roll`,
    content: `
      <h2>${game.i18n.localize("BITD.RollSomeDice")}</h2>
      <p>${game.i18n.localize("BITD.RollTokenDescription")}</p>
      <form>
        <div class="form-group">
          <label>${game.i18n.localize("BITD.RollNumberOfDice")}:</label>
          <select id="qty" name="qty">
            ${Array(11).fill().map((item, i) => `<option value="${i}">${i}d</option>`).join('')}
          </select>
        </div>
        <fieldset class="form-group" style="display:block;justify-content:space-between;">
          <legend>Roll Types</legend>
          <div class="radio-group" >
            <label>
              <input type="radio" id="fortune" name="rollSelection" checked=true> ${game.i18n.localize("BITD.Fortune")}
            </label>
          </div>
          <div class="radio-group">
            <label>
              <input type="radio" id="gatherInfo" name="rollSelection"> ${game.i18n.localize("BITD.GatherInformation")}
            </label>
          </div>
          <div class="radio-group">
            <label>
              <input type="radio" id="engagement" name="rollSelection"> ${game.i18n.localize("BITD.Engagement")}
            </label>
          </div>
          <div class="radio-group" style="display:flex;flex-direction:row;justify-content:space-between;">
            <label><input type="radio" id="indulgeVice" name="rollSelection"> ${game.i18n.localize("BITD.IndulgeVice")}</label>
            <span style="width:200px">
              <label>${game.i18n.localize('BITD.Stress')}:</label>
              <select style="width:100px;float:right" id="stress" name="stress">
                ${Array(11).fill().map((item, i) => `<option value="${i}">${i}</option>`).join('')}
              </select>
            </span>
          </div>
          <div class="radio-group" style="display:flex;flex-direction:row;justify-content:space-between;">
            <label><input type="radio" id="acqurieAsset" name="rollSelection"> ${game.i18n.localize("BITD.AcquireAsset")}</label>
            <span style="width:200px">
              <label>${game.i18n.localize('BITD.CrewTier')}:</label>
              <select style="width:100px;float:right" id="tier" name="tier">
                ${Array(5).fill().map((item, i) => `<option value="${i}">${i}</option>`).join('')}
              </select>
            </span>
          </div>
        </fieldset>
        <div className="form-group">
          <label>${game.i18n.localize('BITD.Notes')}:</label>
          <input id="note" name="note" type="text" value="">
        </div><br/>
      </form>
    `,
    buttons: {
      yes: {
        icon: "<i class='fas fa-check'></i>",
        label: `Roll`,
        callback: async (html) => {
          let diceQty = Number(html.find('[name="qty"]')[0].value);
          let stress = html.find('[name="stress"]')[0].value;
          let tier = html.find('[name="tier"]')[0].value;
          let note = html.find('[name="note"]')[0].value;

          let input = html.find("input");
          for (let i = 0; i < input.length; i++){
            if (input[i].checked) {
              switch (input[i].id) {
                case 'gatherInfo':
                  await bladesRoll(diceQty,"BITD.GatherInformation","","",note,"");
                  break;
                case 'engagement':
                  await bladesRoll(diceQty,"BITD.Engagement","","",note,"");
                  break;
                case 'indulgeVice':
                  await bladesRoll(diceQty,"BITD.Vice","","",note,stress);
                  break;
                case 'acqurieAsset':
                  await bladesRoll(diceQty,"BITD.AcquireAsset","","",note,"",tier);
                  break;

                default:
                  await bladesRoll(diceQty,"","","",note,"");
                  break;
              }
              break;
            }
          }
        },
      },
      no: {
        icon: "<i class='fas fa-times'></i>",
        label: game.i18n.localize('Cancel'),
      },
    },
    default: "yes"
  }).render(true);
}

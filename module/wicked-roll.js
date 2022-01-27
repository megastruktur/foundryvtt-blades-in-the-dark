/**
 * Roll Dice.
 * @param {int} dice_amount
 * @param {string} attribute_name
 * @param {string} position
 * @param {string} effect
 * @param {string} type
 * @param {string} char_name
 */
export async function wickedRoll(dice_amount, attribute_name = "", position = "default", effect = "default", type = "fortune", char_name = "") {

  let zeromode = false;
  if (dice_amount <= 0) {
    zeromode = true;
    dice_amount = 2;
  }

  let r = new Roll( `${dice_amount}d6`, {} );

  r.evaluate({async: true});
  showChatRollMessage(r, zeromode, attribute_name, position, effect, type, char_name)

}

/**
 * Shows Chat message.
 *
 * @param {Roll} r
 * @param {Boolean} zeromode
 * @param {String} attribute_name
 * @param {string} position
 * @param {string} effect
 * @param {string} type
 * @param {string} char_name
 */
async function showChatRollMessage(r, zeromode, attribute_name = "", position = "", effect = "", type="", char_name="") {

  let speaker = ChatMessage.getSpeaker();
  if (speaker.alias == char_name) {
    char_name = "";
  }
  let isBelow070 = isNewerVersion('0.7.0', game.version ?? game.data.version);
  let rolls = [];
  let attribute_label = WickedHelpers.getAttributeLabel(attribute_name);

  // Backward Compat for rolls.
  if (isBelow070) {
    rolls = (r.parts)[0].rolls;
  } else {
    rolls = (r.terms)[0].results;
  }

  // Retrieve Roll status.
  let roll_status = getWickedRollStatus(rolls, zeromode);

  let position_localize = '';
  switch (position) {
    case 'dominant':
      position_localize = 'FITD.PositionDominant'
      break;
    case 'dire':
      position_localize = 'FITD.PositionDire'
      break;
	case 'deadly':
      position_localize = 'FITD.PositionDeadly'
      break;
    case 'default':
    default:
      position_localize = 'FITD.PositionDefault'
  }

  let effect_localize = '';
  switch (effect) {
    case 'weak':
      effect_localize = 'FITD.EffectWeak'
      break;
    case 'strong':
      effect_localize = 'FITD.EffectStrong'
      break;
    case 'zero':
      effect_localize = 'FITD.EffectZero'
      break;
    case 'default':
    default:
      effect_localize = 'FITD.EffectDefault'
  }

  let roll_type = game.i18n.localize('FITD.ROLL.' + type.toUpperCase() + '.Name');
  let roll_status_text = game.i18n.localize('FITD.ROLL.' + roll_status.capitalize());
  let roll_description = game.i18n.localize('FITD.ROLL.' + type.toUpperCase() + '.' + roll_status.capitalize() );

  // Append special description information
  if (type == 'creature') {
    roll_description += '<br/>' + game.i18n.localize('FITD.ROLL.CREATURE.Note');
  } else if (type == 'lock') {
    roll_description += '<br/>' + game.i18n.localize('FITD.ROLL.LOCK.Note');
  } else if (type == 'loot') {
    if (!zeromode && rolls.length > 1) {
      roll_description = "";
      if (roll_status == "critical") {
        roll_description += ' ' + game.i18n.localize('FITD.ROLL.' + type.toUpperCase() + '.' + roll_status.capitalize());
      }
      roll_description += '<ul>'
      for (var i = 0; i < rolls.length; i++) {
        roll_description += '<li>' + game.i18n.localize('FITD.ROLL.' + type.toUpperCase() + '.' + getWickedRollStatus([rolls[i]], false).capitalize()) + '</li>';
      }
      roll_description += '</ul>'
    }
    roll_description += '<p>' + game.i18n.localize('FITD.ROLL.LOOT.Note') + '</p>';
  } else if (type == 'resistance' && position == 'deadly') {
    if (roll_status == 'failure' || roll_status == 'mixed') {
      roll_description = game.i18n.localize('FITD.ROLL.RESISTDEATH.' + roll_status.capitalize());
    }
  }

  let result = await renderTemplate("systems/wicked-ones/templates/wicked-roll.html", { rolls: rolls, roll_type: roll_type, roll_status_class: roll_status, roll_status_text: roll_status_text, attribute_label: attribute_label, position: position_localize, effect: effect_localize, roll_description: roll_description, zeromode: zeromode, char_name: char_name });

  let messageData = {
    user: game.user.id,
    speaker: speaker,
    content: result,
    type: CONST.CHAT_MESSAGE_TYPES.ROLL,
    sound: CONFIG.sounds.dice,
    roll: r
  }

  // Prepare message options
  const rMode = game.settings.get("core", "rollMode");
  if (["gmroll", "blindroll"].includes(rMode)) {
    messageData.whisper = ChatMessage.getWhisperRecipients("GM");
  }
  const messageOptions = { rollMode: rMode };

  CONFIG.ChatMessage.documentClass.create(messageData, messageOptions)
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
export function getWickedRollStatus(rolls, zeromode = false) {

  // Dice API has changed in 0.7.0 so need to keep that in mind.
  let isBelow070 = isNewerVersion('0.7.0', game.version ?? game.data.version);

  let sorted_rolls = [];
  // Sort roll values from lowest to highest.
  if (isBelow070) {
    sorted_rolls = rolls.map(i => i.roll).sort();
  } else {
    sorted_rolls = rolls.map(i => i.result).sort();
  }

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
        roll_status = "critical";
      }
      // 6 - success
      else {
        roll_status = "success";
      }
    }
    // else (4,5) = partial success
    else {
      roll_status = "mixed";
    }

  }

  return roll_status;

}


/**
 * Call a Roll popup.
 */
export async function simpleRollPopup() {

  new Dialog({
    title: `Dice Roller`,
    content: `
      <h2>${game.i18n.localize("FITD.RollSomeDice")}</h2>
      <p>${game.i18n.localize("FITD.RollTokenDescription")}</p>
      <form id="dice-roller">
		<div class="form-group">
		<label>${game.i18n.localize('FITD.RollType')}:</label>
		<select id="type" name="type">
		  <option value="fortune" selected>${game.i18n.localize('FITD.ROLL.FORTUNE.Name')}</option>
		  <option value="blowback">${game.i18n.localize('FITD.ROLL.BLOWBACK.Name')}</option>
		  <option value="calamity">${game.i18n.localize('FITD.ROLL.CALAMITY.Name')}</option>
		  <option value="defensive">${game.i18n.localize('FITD.ROLL.DEFENSIVE.Name')}</option>
		  <option value="discovery">${game.i18n.localize('FITD.ROLL.DISCOVERY.Name')}</option>
		  <option value="engagement">${game.i18n.localize('FITD.ROLL.ENGAGEMENT.Name')}</option>
		  <option value="lock">${game.i18n.localize('FITD.ROLL.LOCK.Name')}</option>
		  <option value="loot">${game.i18n.localize('FITD.ROLL.LOOT.Name')}</option>
		  <option value="creature">${game.i18n.localize('FITD.ROLL.CREATURE.Name')}</option>
		  <option value="trap">${game.i18n.localize('FITD.ROLL.TRAP.Name')}</option>
		  <option value="starting">${game.i18n.localize('FITD.ROLL.STARTING.Name')}</option>
		  <option value="pathing">${game.i18n.localize('FITD.ROLL.PATHING.Name')}</option>
		</select>
	  </div>
        <div class="form-group">
          <label>${game.i18n.localize("FITD.RollNumberOfDice")}:</label>
          <select id="qty" name="qty">
            ${Array(11).fill().map((item, i) => `<option value="${i}">${i}D</option>`).join('')}
          </select>
        </div>
      </form>
    `,
    buttons: {
      yes: {
        icon: "<i class='fas fa-check'></i>",
        label: `Roll`,
        callback: (html) => {
          let diceQty = html.find('[name="qty"]')[0].value;
		  let type = html.find('[name="type"]')[0].value;
          wickedRoll(diceQty, "", "default", "default", type);
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

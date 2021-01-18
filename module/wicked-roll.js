/**
 * Roll Dice.
 * @param {int} dice_amount 
 * @param {string} attribute_name 
 * @param {string} position
 * @param {string} effect
 */
export async function wickedRoll(dice_amount, attribute_name = "", position = "default", effect = "default", type="fortune") {

  let zeromode = false;
  if (dice_amount <= 0) {
    zeromode = true;
    dice_amount = 2;
  }

  let r = new Roll( `${dice_amount}d6`, {} );

  r.roll();
  showChatRollMessage(r, zeromode, attribute_name, position, effect, type)

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
 */
async function showChatRollMessage(r, zeromode, attribute_name = "", position = "", effect = "",type="") {
  
  let speaker = ChatMessage.getSpeaker();
  let isBelow070 = isNewerVersion('0.7.0', game.data.version);
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
  
  let type_localize = '';
  switch (type) {
    case 'action':
      type_localize = 'FITD.RollAction'
      break;                
    case 'blowback':        
      type_localize = 'FITD.RollBlowback'
      break;                
    case 'calamity':        
      type_localize = 'FITD.RollCalamity'
      break;               
    case 'defensiveMove':   
      type_localize = 'FITD.RollDefensiveMove'
      break;                
    case 'discovery':       
      type_localize = 'FITD.RollDiscovery'
      break;                
    case 'engagement':      
      type_localize = 'FITD.RollEngagement'
      break;                
    case 'lock':           
      type_localize = 'FITD.RollLock'
      break;               
    case 'loot':           
      type_localize = 'FITD.RollLoot'
      break;               
    case 'resistance':    
      type_localize = 'FITD.RollResistance'
      break;                
    case 'creature':        
      type_localize = 'FITD.RollCreature'
      break;                
    case 'trap':            
      type_localize = 'FITD.RollTrap'
      break;                
    case 'startingLoc':     
      type_localize = 'FITD.RollStartingLoc'
      break;                
    case 'pathing':         
      type_localize = 'FITD.RollPathing'
      break;   	  
    case 'fortune':     
    default:            
      type_localize = 'FITD.RollFortune'	  
  }

  let result = await renderTemplate("systems/wicked-ones/templates/wicked-roll.html", { rolls: rolls, roll_status: roll_status, attribute_label: attribute_label, position: position_localize, effect: effect_localize, type: type_localize, zeromode: zeromode });

  let messageData = {
    user: game.user._id,
    speaker: speaker,
    content: result,
    type: CHAT_MESSAGE_TYPES.ROLL,
    sound: CONFIG.sounds.dice,
    roll: r
  }

  // Prepare message options
  const rMode = game.settings.get("core", "rollMode");
  if (["gmroll", "blindroll"].includes(rMode)) {
    messageData.whisper = ChatMessage.getWhisperRecipients("GM");
  }
  const messageOptions = { rollMode: rMode };

  CONFIG.ChatMessage.entityClass.create(messageData, messageOptions)
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
  let isBelow070 = isNewerVersion('0.7.0', game.data.version);

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
		  <option value="fortune" selected>${game.i18n.localize('FITD.RollFortune')}</option>		  
		  <option value="blowback">${game.i18n.localize('FITD.RollBlowback')}</option>
		  <option value="calamity">${game.i18n.localize('FITD.RollCalamity')}</option>
		  <option value="defensiveMove">${game.i18n.localize('FITD.RollDefensiveMove')}</option>
		  <option value="discovery">${game.i18n.localize('FITD.RollDiscovery')}</option>
		  <option value="engagement">${game.i18n.localize('FITD.RollEngagement')}</option>
		  <option value="lock">${game.i18n.localize('FITD.RollLock')}</option>
		  <option value="loot">${game.i18n.localize('FITD.RollLoot')}</option>
		  <option value="creature">${game.i18n.localize('FITD.RollCreature')}</option>
		  <option value="trap">${game.i18n.localize('FITD.RollTrap')}</option>
		  <option value="startingLoc">${game.i18n.localize('FITD.RollStartingLoc')}</option>
		  <option value="pathing">${game.i18n.localize('FITD.RollPathing')}</option>		  
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

/**
 * Roll Dice.
 * @param {int} dice_amount 
 * @param {string} attribute_name 
 */
export async function bladesRoll(dice_amount, attribute_name = "") {


 // Is Dice So Nice enabled ?
    let niceDice = '';
        try {
      niceDice = true;
      game.settings.get('dice-so-nice', 'settings').enabled;
          
    } catch {
      niceDice = false;
    }

// Is FoundryVTT core version >= 0.7.0 ?  
//  if using >= 0.7.0 New api calls enabled and DiceSoNice disabled until module update
// if using < 0.7.0 Old Roll API calls used and DiceSoNice enabled 

 let isBelow070 = isNewerVersion('0.7.0', game.data.version);
   if (isBelow070==false) {niceDice=false;}




  let speaker = ChatMessage.getSpeaker();
  // ChatMessage.getSpeaker(controlledToken)
  let zeromode = false;
  
  if ( dice_amount < 0 ) { dice_amount = 0; }
  if ( dice_amount == 0 ) { zeromode = true; dice_amount = 2; }

  let r = new Roll( `${dice_amount}d6`, {} );

  r.roll();


  // show 3d Dice so Nice if enabled
  if (niceDice) {
          
  game.dice3d.showForRoll(r).then(displayed => {   });

  }


  // r.toMessage();

  // Might be better as a DicePool with keep high/keep low intelligence, 
  // but I want to get my hands into this directly, and I think players 
  // will want to see all the dice happening.

  let rolls='';
  let sorted_rolls='';

  if (isBelow070) { rolls = (r.parts)[0].rolls;} else { rolls = (r.terms)[0].results; }


  // Sort roll values from lowest to highest.
  if (isBelow070) {  sorted_rolls = rolls.map(i => i.roll).sort(); } else { sorted_rolls = rolls.map(i => i.result).sort(); }


  let roll_status = "failure"

  if (sorted_rolls[0] === 6 && zeromode) {
    roll_status = "critical-success";
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

  let result = await renderTemplate("systems/blades-in-the-dark/templates/blades-roll.html", {rolls: rolls, roll_status: roll_status, attribute_name: attribute_name});

  let messageData = {
    speaker: speaker,
    content: result,
    type: CONST.CHAT_MESSAGE_TYPES.OOC,
    roll: r
  }

  CONFIG.ChatMessage.entityClass.create(messageData, {})

  return result;
}

/**
 * Call a Roll popup.
 */
export async function simpleRollPopup() {
  
  new Dialog({
    title: `Simple Roll`,
    content: `
      <h2>Roll some dice!</h2>
      <p>If you want to pull the numbers from a character, select their Token first.</p>
      <form>
        <div class="form-group">
          <label>Number of Dice:</label>
          <select id="qty" name="qty">
            ${Array(11).fill().map((item, i) => `<option value="${i}">${i}d</option>`).join('')}
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
          console.log("Roll "+diceQty);
  
          bladesRoll(diceQty);
        },
      },
      no: {
        icon: "<i class='fas fa-times'></i>",
        label: `Cancel`,
      },
    },
    default: "yes"
  }).render(true);
}

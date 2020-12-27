/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */

export class BladesSheet extends ActorSheet {

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    html.find(".item-add-popup").click(this._onItemAddClick.bind(this));
    html.find(".skill-practice-xp").click(this._onSkillSetPracticeXP.bind(this));
    html.find('.item-checkmark input').click(ev => ev.target.select()).change(this._onCheckmarkChange.bind(this));
    html.find('.item-radio input').click(ev => ev.target.select()).change(this._onRadioChange.bind(this));

    // This is a workaround until is being fixed in FoundryVTT.
    if (this.options.submitOnChange) {
      html.on("change", "textarea", this._onChangeInput.bind(this));  // Use delegated listener on the form
    }

    html.find(".roll-die-attribute").click(this._onRollAttributeDieClick.bind(this));
  }


  async _onItemAddClick(event) {
    event.preventDefault();
    const item_type = $(event.currentTarget).data("itemType")
    const distinct = $(event.currentTarget).data("distinct")
    let input_type = "checkbox";

    if (typeof distinct !== "undefined") {
      input_type = "radio";
    }

    let items = await BladesHelpers.getAllItemsByType(item_type, game);

    // Sort apecial abilities and tier-3 rooms
    if (items.length > 0 && items[0].type == "specialability") {
      items.sort(BladesHelpers.specialAbilitySort);
    } else if (items.length > 0 && items[0].type == "tier3room") {
      items.sort(BladesHelpers.tierThreeRoomSort);
    }


    let html = `<div id="items-to-add">`;

    items.forEach(e => {
      let itemPrefix = ``;
      let itemSuffix = ``;
      if (item_type == "specialability") {
        if (typeof e.data.source !== "undefined") {
          itemPrefix += `(${e.data.source}): `
        }
        if (e.data.ability_group == 'group_core') {
          itemSuffix += ` (Core)`
        }
      } else if (item_type == "tier3room") {
        if (typeof e.data.theme !== "undefined") {
          itemPrefix += `(${e.data.theme}): `
        }
      }


      html += `<input id="select-item-${e._id}" type="${input_type}" name="select_items" value="${e._id}">`;
      html += `<label class="flex-horizontal" for="select-item-${e._id}">`;
      html += `${itemPrefix}${game.i18n.localize(e.name)}${itemSuffix} <i class="tooltip fas fa-question-circle"><span class="tooltiptext">${e.data.description}</span></i>`;
      html += `</label>`;
    });

    html += `</div>`;

    const label = CONFIG.Item?.typeLabels?.[item_type] ?? item_type;
    let title = game.i18n.has(label) ? game.i18n.localize(label) : item_type;

    let options = {
      // width: "500"
    }

    let dialog = new Dialog({
      title: `${game.i18n.localize('Add')} ${game.i18n.localize(title)}`,
      content: html,
      buttons: {
        one: {
          icon: '<i class="fas fa-check"></i>',
          label: game.i18n.localize('Add'),
          callback: () => this.addItemsToSheet(item_type, $(document).find('#items-to-add'))
        },
        two: {
          icon: '<i class="fas fa-times"></i>',
          label: game.i18n.localize('Cancel'),
          callback: () => false
        }
      },
      default: "two"
    }, options);

    dialog.render(true);
  }

  /* -------------------------------------------- */

  async addItemsToSheet(item_type, el) {

    let items = await BladesHelpers.getAllItemsByType(item_type, game);
    let items_to_add = [];
    el.find("input:checked").each(function () {

      items_to_add.push(items.find(e => e._id === $(this).val()));
    });
    this.actor.createEmbeddedEntity("OwnedItem", items_to_add);
  }
  /* -------------------------------------------- */

  /**
   * Roll an Attribute die.
   * @param {*} event 
   */
  async _onRollAttributeDieClick(event) {

    const attribute_name = $(event.currentTarget).data("rollAttribute");
    this.actor.rollAttributePopup(attribute_name);

  }

  /* -------------------------------------------- */

  async _onSkillSetPracticeXP(event) {
    event.preventDefault();
    let pressed_button = event.currentTarget.control;
    const attribute_name = pressed_button.name.split(".")[2];
    const skill_name = pressed_button.name.split(".")[4];
    const temp_var = pressed_button.value;
    let skill = this.actor.data.data.attributes[attribute_name].skills[skill_name];

    // Set Practice XP
    if (temp_var == 0 || temp_var > 1 || skill.value > 1) {
      skill.practice = 0;
    }
    else {
      if (skill.value == 0) {
        skill.practice = 1;
      }
      else if (skill.practice == 1) {
        skill.practice = 2;
      }
      else if (skill.practice == 2) {
        skill.practice = 0;
      }
      else {
        skill.practice = 0;
        pressed_button = pressed_button.previousElementSibling.previousElementSibling;
      }
    }

    // Update Data
    this.actor.update({ ['data.attributes.' + attribute_name + '.skills.' + skill_name + '.practice']: skill.practice });

    // Submit click
    pressed_button.click();
  }

  /* -------------------------------------------- */

  /**
   * Change the Checkbox Status in an Owned Item within the Actor
   */
  async _onCheckmarkChange(event) {
    event.preventDefault();
    const itemId = event.currentTarget.closest(".item").dataset.itemId;
    const propertyToSet = event.currentTarget.dataset.propertyToSet;
    const item = this.actor.getOwnedItem(itemId);
    return item.update({ ['data.' + propertyToSet]: event.target.checked });
  }

  /* -------------------------------------------- */

  /**
   * Change the Radio Button Status of an Owned Item within the Actor
   */
  async _onRadioChange(event) {
    event.preventDefault();
    const itemId = event.currentTarget.closest(".item").dataset.itemId;
    const propertyToSet = event.currentTarget.dataset.propertyToSet;
    const item = this.actor.getOwnedItem(itemId);
    return item.update({ ['data.' + propertyToSet]: event.target.value });
  }

  /* -------------------------------------------- */
}
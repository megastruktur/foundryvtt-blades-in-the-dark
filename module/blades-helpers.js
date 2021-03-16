export class BladesHelpers {

  /**
   * Removes a duplicate item type from charlist.
   * 
   * @param {Object} item_data 
   * @param {Entity} actor 
   */
  static removeDuplicatedItemType(item_data, actor) {

    let distinct_types = ["crew_reputation", "class", "vice", "background", "heritage"];
    let should_be_distinct = distinct_types.includes(item_data.type);
    // If the Item has the exact same name - remove it from list.
    // Remove Duplicate items from the array.
    actor.items.forEach(i => {
      let has_double = (item_data.type === i.data.type);
      if (i.data.name === item_data.name || (should_be_distinct && has_double)) {
        actor.deleteOwnedItem(i.id);
      }
    });
  }

  /**
   * Add item modification if logic exists.
   * @param {Object} item_data 
   * @param {Entity} entity 
   */
  static callItemLogic(item_data, entity) {

    if ('logic' in item_data.data && item_data.data.logic !== '') {
      let logic = JSON.parse(item_data.data.logic);

      // Should be an array to support multiple expressions
      if (!Array.isArray(logic)) {
        logic = [logic];
      }

      if (logic) {

        logic.forEach(expression => {

          // Different logic behav. dep on operator.
          switch (expression.operator) {
    
            // Add when creating.
            case "addition":
              entity.update({
                [expression.attribute]: Number(BladesHelpers.getNestedProperty(entity, "data." + expression.attribute)) + expression.value
              });
              break;

            // Change name property.
            case "attribute_change":
              entity.update({
                [expression.attribute]: expression.value
              });
              break;
    
          }
        });
      }

    }

  }

  /**
   * Undo Item modifications when item is removed.
   * @todo
   *  - Remove all items and then Add them back to
   *    sustain the logic mods
   * @param {Object} item_data 
   * @param {Entity} entity 
   */
  static undoItemLogic(item_data, entity) {

    if ('logic' in item_data.data && item_data.data.logic !== '') {
      let logic = JSON.parse(item_data.data.logic)

      // Should be an array to support multiple expressions
      if (!Array.isArray(logic)) {
        logic = [logic];
      }

      if (logic) {

        var entity_data = entity.data;

        logic.forEach(expression => {
          // Different logic behav. dep on operator.
          switch (expression.operator) {

            // Subtract when removing.
            case "addition":
              entity.update({
                [expression.attribute]: Number(BladesHelpers.getNestedProperty(entity, "data." + expression.attribute)) - expression.value
              });
              break;

            // Change name back to default.
            case "attribute_change":
              // Get the array path to take data.
              let default_expression_attribute_path = expression.attribute + '_default';
              let default_name = default_expression_attribute_path.split(".").reduce((o, i) => o[i], entity_data);

              entity.update({
                [expression.attribute]: default_name
              });
              break;
          }
        });
      }
    }

  }

  /**
   * Get a nested dynamic attribute.
   * @param {Object} obj 
   * @param {string} property 
   */
  static getNestedProperty(obj, property) {
    return property.split('.').reduce((r, e) => {
        return r[e];
    }, obj);
  }


  /**
   * Add item functionality
   */
  static _addOwnedItem(event, actor) {

    event.preventDefault();
    const a = event.currentTarget;
    const item_type = a.dataset.itemType;

    let data = {
      name: randomID(),
      type: item_type
    };
    return actor.createEmbeddedEntity("OwnedItem", data);
  }

  /**
   * Get the list of all available ingame items by Type.
   * 
   * @param {string} item_type 
   * @param {Object} game 
   */
  static async getAllItemsByType(item_type, game) {

    let list_of_items = [];
    let game_items = [];
    let compendium_items = [];
    
    game_items = game.items.filter(e => e.type === item_type).map(e => {return e.data});

    let pack = game.packs.find(e => e.metadata.name === item_type);
    let compendium_content = await pack.getContent();
    compendium_items = compendium_content.map(e => {return e.data});

    list_of_items = game_items.concat(compendium_items);

    return list_of_items;

  }

  /* -------------------------------------------- */

  /**
   * Returns the label for attribute.
   *
   * @param {string} attribute_name 
   * @returns {string}
   */
  static getAttributeLabel(attribute_name) {
        let attribute_labels = {};
        const attributes = game.system.model.Actor.character.attributes;
        
        for (var attribute in attributes) {
          attribute_labels[attribute] = attributes[attribute].label;
          for (var skill_name in attributes[attribute].skills) {
            attribute_labels[skill_name] = attributes[attribute].skills[skill_name].label;
          }
    
        }
    
        return attribute_labels[attribute_name];
  }
  
  /**
   * Returns true if the attribute is an action
   *
   * @param {string} attribute_name 
   * @returns {bool}
   */
  static isAttributeAction(attribute_name) {
        let attribute_labels = {};
        const attributes = game.system.model.Actor.character.attributes;
        
        return !(attribute_name in attributes);
  }

  /* -------------------------------------------- */

}

/**
 * Perform a system migration for the entire World, applying migrations for Actors, Items, and Compendium packs
 * @return {Promise}      A Promise which resolves once the migration is completed
 */
export const migrateWorld = async function() {
  ui.notifications.info(`Applying BITD Actors migration for version ${game.system.data.version}. Please be patient and do not close your game or shut down your server.`, {permanent: true});

  // Migrate World Actors
  for ( let a of game.actors.entities ) {
    if (a.data.type === 'character') {
      try {
        const updateData = _migrateActorSkills(a.data);
        if ( !isObjectEmpty(updateData) ) {
          console.log(`Migrating Actor entity ${a.name}`);
          await a.update(updateData, {enforceTypes: false});
        }
      } catch(err) {
        console.error(err);
      }
    }
  }

  // Set the migration as complete
  game.settings.set("bitd", "systemMigrationVersion", game.system.data.version);
  ui.notifications.info(`BITD System Migration to version ${game.system.data.version} completed!`, {permanent: true});
};

/* -------------------------------------------- */

/* -------------------------------------------- */
/*  Entity Type Migration Helpers               */
/* -------------------------------------------- */

/**
 * Migrate the actor skills
 * @param {Actor} actor   The actor to Update
 * @return {Object}       The updateData to apply
 */
function _migrateActorSkills(actor) {

  let updateData = {}
  const attributes = game.system.model.Actor.character.attributes;

  for ( let attribute_name of Object.keys(actor.data.attributes || {}) ) {

    // Insert attribute label
    if (typeof actor.data.attributes[attribute_name].label === 'undefined') {
      updateData[`data.attributes.${attribute_name}.label`] = attributes[attribute_name].label;
    }
    for ( let skill_name of Object.keys(actor.data.attributes[attribute_name]['skills']) ) {

      // Insert skill label
      // Copy Skill value
      if (typeof actor.data.attributes[attribute_name].skills[skill_name].label === 'undefined') {

        // Create Label.
        updateData[`data.attributes.${attribute_name}.skills.${skill_name}.label`] = attributes[attribute_name].skills[skill_name].label;
        // Migrate from skillname = [0]
        let skill_tmp = actor.data.attributes[attribute_name].skills[skill_name];
        if (Array.isArray(skill_tmp)) {
          updateData[`data.attributes.${attribute_name}.skills.${skill_name}.value`] = [skill_tmp[0]];
        }
        
      }
    }
  }

  return updateData;

  // for ( let k of Object.keys(actor.data.attributes || {}) ) {
  //   if ( k in b ) updateData[`data.bonuses.${k}`] = b[k];
  //   else updateData[`data.bonuses.-=${k}`] = null;
  // }
}

/* -------------------------------------------- */
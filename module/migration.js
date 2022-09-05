/**
 * Perform a system migration for the entire World, applying migrations for Actors, Items, and Compendium packs
 * @return {Promise}      A Promise which resolves once the migration is completed
 */
export const migrateWorld = async function() {
  ui.notifications.info(`Applying BITD Actors migration for version ${game.system.data.version}. Please be patient and do not close your game or shut down your server.`, {permanent: true});

  // Migrate World Actors
  for ( let a of game.actors.contents ) {
    if (a.type === 'character') {
      try {
        const updateData = _migrateActor(a);
        if ( !isObjectEmpty(updateData) ) {
          console.log(`Migrating Actor entity ${a.name}`);
          await a.update(updateData, {enforceTypes: false});
        }
      } catch(err) {
        console.error(err);
      }
    }

    // Migrate Token Link for Character and Crew
    if (a.type === 'character' || a.type === 'crew') {
      try {
        const updateData = _migrateTokenLink(a);
        if ( !isObjectEmpty(updateData) ) {
          console.log(`Migrating Token Link for ${a.name}`);
          await a.update(updateData, {enforceTypes: false});
        }
      } catch(err) {
        console.error(err);
      }
    }

  }

  // Migrate Actor Link
  for ( let s of game.scenes.contents ) {
    try {
      const updateData = _migrateSceneData(s);
      if ( !isObjectEmpty(updateData) ) {
        console.log(`Migrating Scene entity ${s.name}`);
        await s.update(updateData, {enforceTypes: false});
      }
    } catch(err) {
      console.error(err);
    }
  }

  // Set the migration as complete
  game.settings.set("bitd", "systemMigrationVersion", game.system.version);
  ui.notifications.info(`BITD System Migration to version ${game.system.version} completed!`, {permanent: true});
};


/* -------------------------------------------- */

/**
 * Migrate a single Scene entity to incorporate changes to the data model of it's actor data overrides
 * Return an Object of updateData to be applied
 * @param {Object} scene  The Scene data to Update
 * @return {Object}       The updateData to apply
 */
export const _migrateSceneData = function(scene) {
  const tokens = foundry.utils.deepClone(scene.tokens);
  return {
    tokens: tokens.map(t => {
      t.actorLink = true;
      t.actorData = {};
      return t;
    })
  };
};

/* -------------------------------------------- */

/* -------------------------------------------- */
/*  Entity Type Migration Helpers               */
/* -------------------------------------------- */

/**
 * Migrate the actor attributes
 * @param {Actor} actor   The actor to Update
 * @return {Object}       The updateData to apply
 */
function _migrateActor(actor) {

  let updateData = {}

  // Migrate Skills
  const attributes = game.system.model.Actor.character.attributes;
  for ( let attribute_name of Object.keys(actor.system.attributes || {}) ) {

    // Insert attribute label
    if (typeof actor.system.attributes[attribute_name].label === 'undefined') {
      updateData[`system.attributes.${attribute_name}.label`] = attributes[attribute_name].label;
    }
    for ( let skill_name of Object.keys(actor.system.attributes[attribute_name]['skills']) ) {

      // Insert skill label
      // Copy Skill value
      if (typeof actor.system.attributes[attribute_name].skills[skill_name].label === 'undefined') {

        // Create Label.
        updateData[`system.attributes.${attribute_name}.skills.${skill_name}.label`] = attributes[attribute_name].skills[skill_name].label;
        // Migrate from skillname = [0]
        let skill_tmp = actor.system.attributes[attribute_name].skills[skill_name];
        if (Array.isArray(skill_tmp)) {
          updateData[`system.attributes.${attribute_name}.skills.${skill_name}.value`] = [skill_tmp[0]];
        }

      }
    }
  }

  // Migrate Stress to Array
  if (typeof actor.system.stress[0] !== 'undefined') {
    updateData[`system.stress.value`] = actor.system.stress;
    updateData[`system.stress.max`] = 9;
    updateData[`system.stress.max_default`] = 9;
    updateData[`system.stress.name_default`] = "BITD.Stress";
    updateData[`system.stress.name`] = "BITD.Stress";
  }

  // Migrate Trauma to Array
  if (typeof actor.system.trauma === 'undefined') {
    updateData[`system.trauma.list`] = actor.system.traumas;
    updateData[`system.trauma.value`] = [actor.system.traumas.length];
    updateData[`system.trauma.max`] = 4;
    updateData[`system.trauma.max_default`] = 4;
    updateData[`system.trauma.name_default`] = "BITD.Trauma";
    updateData[`system.trauma.name`] = "BITD.Trauma";
  }

  return updateData;

  // for ( let k of Object.keys(actor.system.attributes || {}) ) {
  //   if ( k in b ) updateData[`system.bonuses.${k}`] = b[k];
  //   else updateData[`system.bonuses.-=${k}`] = null;
  // }
}

/* -------------------------------------------- */


/**
 * Make Token be an Actor link.
 * @param {Actor} actor   The actor to Update
 * @return {Object}       The updateData to apply
 */
function _migrateTokenLink(actor) {

  let updateData = {}
  updateData['prototypeToken.actorLink'] = true;

  return updateData;
}

/* -------------------------------------------- */
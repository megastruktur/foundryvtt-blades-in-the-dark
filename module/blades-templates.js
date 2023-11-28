/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function() {

  // Define template paths to load
  const templatePaths = [

    // Actor Sheet Partials
    "systems/beam-saber/templates/parts/coins.html",
    "systems/beam-saber/templates/parts/attributes.html",
    "systems/beam-saber/templates/parts/turf-list.html",
    "systems/beam-saber/templates/parts/cohort-block.html",
    "systems/beam-saber/templates/parts/factions.html",
    "systems/beam-saber/templates/parts/active-effects.html",
  ];

  // Load the template parts
  return loadTemplates(templatePaths);
};

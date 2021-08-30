/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function() {

  // Define template paths to load
  const templatePaths = [

    // Actor Sheet Partials
    "systems/beamsaber/templates/parts/coins.html",
    "systems/beamsaber/templates/parts/attributes.html",
    "systems/beamsaber/templates/parts/turf-list.html",
    "systems/beamsaber/templates/parts/cohort-block.html",
    "systems/beamsaber/templates/parts/factions.html",
    "systems/beamsaber/templates/parts/active-effects.html",
  ];

  // Load the template parts
  return loadTemplates(templatePaths);
};

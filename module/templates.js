/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function() {

  // Define template paths to load
  const templatePaths = [

    // Actor Sheet Partials
    "systems/blades-in-the-dark/templates/parts/attributes.html",
    
    "systems/blades-in-the-dark/templates/parts/cutter-class.html",
    "systems/blades-in-the-dark/templates/parts/hound-class.html",
    "systems/blades-in-the-dark/templates/parts/leech-class.html",
    "systems/blades-in-the-dark/templates/parts/lurk-class.html",
    "systems/blades-in-the-dark/templates/parts/slide-class.html",
    "systems/blades-in-the-dark/templates/parts/spider-class.html",
    "systems/blades-in-the-dark/templates/parts/whisper-class.html"
  ];

  // Load the template parts
  return loadTemplates(templatePaths);
};

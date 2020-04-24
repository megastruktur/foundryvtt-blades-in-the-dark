export class BladesHelpers {

  /**
   * Removes a duplicate item type from charlist.
   * 
   * @param {string} item_type 
   * @param {Actor} actor 
   */
  static removeDuplicatedItemType(item_type, actor) {

    let distinct_types = ["class", "heritage", "background", "vice", "crew_type"];

    if (distinct_types.indexOf(item_type) >= 0) {
      actor.items.forEach(i => {
        if (i.data.type === item_type) {
          actor.deleteOwnedItem(i.id);
        }
      });
    }
  }

  /**
   * _getFormData() override helper.
   * @param {*} form 
   */
  static getFormDataHelper(form, editors) {

    const FD = new FormData(form);
    const dtypes = {};
    const editorTargets = Object.keys(editors);
    
    // Always include checkboxes
    for ( let el of form.elements ) {
      if ( !el.name ) continue;

      // Handle Radio groups
      if ( form[el.name] instanceof RadioNodeList ) {
        
        const inputs = Array.from(form[el.name]);
        if ( inputs.every(i => i.disabled) ) FD.delete(k);
        
        let values = "";
        let type = "Checkboxes";
        values = inputs.map(i => i.checked ? i.value : false).filter(i => i);
        
        FD.set(el.name, JSON.stringify(values));
        dtypes[el.name] = 'Radio';
      }

      // Remove disabled elements
      else if ( el.disabled ) FD.delete(el.name);

      // Checkboxes
      else if ( el.type == "checkbox" ) {
          FD.set(el.name, el.checked || false);
          dtypes[el.name] = "Boolean";
      }

      // Include dataset dtype
      else if ( el.dataset.dtype ) dtypes[el.name] = el.dataset.dtype;
    }

    // Process editable images
    for ( let img of form.querySelectorAll('img[data-edit]') ) {
      if ( img.getAttribute("disabled") ) continue;
      let basePath = window.location.origin+"/";
      if ( ROUTE_PREFIX ) basePath += ROUTE_PREFIX+"/";
      FD.set(img.dataset.edit, img.src.replace(basePath, ""));
    }

    // Process editable divs (excluding MCE editors)
    for ( let div of form.querySelectorAll('div[data-edit]') ) {
      if ( div.getAttribute("disabled") ) continue;
      else if ( editorTargets.includes(div.dataset.edit) ) continue;
      FD.set(div.dataset.edit, div.innerHTML.trim());
    }

    // Handle MCE editors
    Object.values(editors).forEach(ed => {
      if ( ed.mce ) {
        FD.delete(ed.mce.id);
        if ( ed.changed ) FD.set(ed.target, ed.mce.getContent());
      }
    });

    // Record target data types for casting
    FD._dtypes = dtypes;
    return FD;

  }

}

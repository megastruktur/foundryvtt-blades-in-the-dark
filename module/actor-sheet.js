/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class BladesActorSheet extends ActorSheet {

  /** @override */
	static get defaultOptions() {
	  return mergeObject(super.defaultOptions, {
  	  classes: ["blades-in-the-dark", "sheet", "actor"],
  	  template: "systems/blades-in-the-dark/templates/actor-sheet.html",
      width: 1400,
      height: 1200
    });
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    const data = super.getData();
    data.dtypes = ["String", "Number", "Boolean", "Radio"];
    console.log("DATA");
    console.log(data);
    // for ( let attr of Object.values(data.data) ) {
    //   attr.isCheckbox = attr.dtype === "Boolean";
    // }
    return data;
  }

  /* -------------------------------------------- */

  /** @override */
	activateListeners(html) {
    super.activateListeners(html);

    // Activate tabs
    let tabs = html.find('.tabs');
    let initial = this._sheetTab;
    new Tabs(tabs, {
      initial: initial,
      callback: clicked => this._sheetTab = clicked.data("tab")
    });

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    // Update Inventory Item
    html.find('.item-edit').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.getOwnedItem(li.data("itemId"));
      item.sheet.render(true);
    });

    // Delete Inventory Item
    html.find('.item-delete').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      this.actor.deleteOwnedItem(li.data("itemId"));
      li.slideUp(200, () => this.render(false));
    });

    // Add or Remove Attribute
    html.find(".attributes").on("click", ".attribute-control", this._onClickAttributeControl.bind(this));
  }

  /* -------------------------------------------- */

  /**
   * Listen for click events on an attribute control to modify the composition of attributes in the sheet
   * @param {MouseEvent} event    The originating left click event
   * @private
   */
  async _onClickAttributeControl(event) {
    event.preventDefault();
    const a = event.currentTarget;
    const action = a.dataset.action;
    const attrs = this.object.data.data.attributes;
    const form = this.form;

    // Add new attribute
    if ( action === "create" ) {
      const nk = Object.keys(attrs).length + 1;
      let newKey = document.createElement("div");
      newKey.innerHTML = `<input type="text" name="data.attributes.attr${nk}.key" value="attr${nk}"/>`;
      newKey = newKey.children[0];
      form.appendChild(newKey);
      await this._onSubmit(event);
    }

    // Remove existing attribute
    else if ( action === "delete" ) {
      const li = a.closest(".attribute");
      li.parentElement.removeChild(li);
      await this._onSubmit(event);
    }
  }

  /* -------------------------------------------- */

  /** @override */
  _updateObject(event, formData) {

    console.log(formData);
    // Handle the free-form attributes list
    // const formAttrs = expandObject(formData).data.attributes || {};
    // const attributes = Object.values(formAttrs).reduce((obj, v) => {
    //   let k = v["key"].trim();
    //   if ( /[\s\.]/.test(k) )  return ui.notifications.error("Attribute keys may not contain spaces or periods");
    //   delete v["key"];
    //   obj[k] = v;
    //   return obj;
    // }, {});
    
    // // Remove attributes which are no longer used
    // for ( let k of Object.keys(this.object.data.data.attributes) ) {
    //   if ( !attributes.hasOwnProperty(k) ) attributes[`-=${k}`] = null;
    // }

    // // Re-combine formData
    // formData = Object.entries(formData).filter(e => !e[0].startsWith("data.attributes")).reduce((obj, e) => {
    //   obj[e[0]] = e[1];
    //   return obj;
    // }, {_id: this.object._id, "data.attributes": attributes});
    
    // Update the Actor
    return this.object.update(formData);
  }

  /** @override */
  _getFormData(form) {
    const FD = new FormData(form);
    const dtypes = {};
    const editorTargets = Object.keys(this.editors);
    
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
    Object.values(this.editors).forEach(ed => {
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

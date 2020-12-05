/**
 * Extend the basic Item
 * @extends {Item}
 */
export class BladesItem extends Item {

  /* override */
  prepareData() {

    super.prepareData();
    
    const item_data = this.data;
    const data = item_data.data;

    if (item_data.type === "cohort") {
    
      this._prepareCohort(data);
    
    }
  }

  /**
   * Prepares Cohort data
   *
   * @param {object} data 
   */
  _prepareCohort(data) {

    let quality = 0;
    let scale = 0;

    // Adds Scale and Quality
    if (this.actor) {
      switch (data.cohort[0]) {
        case "Gang":
          scale = parseInt(this.actor.data.data.tier[0]);
          quality = parseInt(this.actor.data.data.tier[0]);
          break;
        case "Expert":
          scale = 1;
          quality = parseInt(this.actor.data.data.tier[0]) + 1;
          break;
      }
    }

    data.scale = scale;
    data.quality = quality;
    
    this.data.data = data;
}
}

/**
 * Extend the basic Item
 * @extends {Item}
 */
export class WickedItem extends Item {

  /**
    * Create a new entity using provided input data
    * @override
    */
  static async create(data, options = {}) {
    if (Object.keys(data).includes("type")) {

      // Replace default image
      let path = `systems/wicked-ones/styles/assets/icons/`;
      switch (data.type) {
        case "adventurer":
          path += 'Icon.1_05';
          break;
        case "calling":
          path += 'Icon.1_66';
          break;
        case "defense":
          path += 'Icon.1_04';
          break;
        case "dungeon_theme":
          path += 'Icon.3_67';
          break;
        case "duty":
          path += 'Icon.5_85';
          break;
        case "gearsupply":
          path += 'Icon.6_37';
          break;
        case "goldmonger_type":
          path += 'Icon.5_16';
          break;
        case "minionimpulse":
          path += 'Icon.2_29';
          break;
        case "minion_type":
          path += 'Icon.6_62';
          break;
        case "minion_upgrade":
          path += 'Icon.7_96';
          break;
        case "monster_race":
          path += 'Icon.3_37';
          break;
        case "project":
          path += 'Icon.7_53';
          break;
        case "revelry":
          path += 'Icon.4_48';
          break;
        case "specialability":
          path += 'Icon.5_34';
          break;
        case "tier3room":
          path += 'Icon.5_70';
          break;
        case "wickedimpulse":
          path += 'Icon.6_25';
          break;
        default:
          path = "";
      }
      if (path != "") {
          data.img = path + `.png`;
      }

    }
    await super.create(data, options);
  }

  /* override */
  prepareData() {

    super.prepareData();

    // Code to override data-preparation for items
  }
}

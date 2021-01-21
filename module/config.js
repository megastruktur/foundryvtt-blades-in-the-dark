// Namespace Configuration Values
export const WO = {};

/**
* Define the set of special ability types
* @type {Object}
*/

WO.gear_supply_types = {
  "gear": "FITD.Gear",
  "supply": "FITD.Supply"
};

WO.gear_quality_types = {
  "mundane": "FITD.Mundane",
  "valuable": "FITD.Valuable",
  "powerful": "FITD.Powerful",
  "tier1": "FITD.TierOne",
  "tier2": "FITD.TierTwo",
  "tier3": "FITD.TierThree"
};

WO.gear_supply_use_types = {
  "unlimited": "FITD.UnlimitedUse",
  "steady": "FITD.SteadySupply",
  "limited": "FITD.LimitedSupply",
  "shared": "FITD.SharedSupply"
};


WO.special_ability_types = {
  "basic": "FITD.Basic",
  "advanced": "FITD.Advanced",
  "be_psi": "FITD.PsiDiscipline",
  "ds_eyes": "FITD.EyeRays",
  "fs_face": "FITD.Face",
  "gm_path": "FITD.GrowthPath"
};

WO.special_ability_primal =
  ["be_psi", "ds_eyes", "fs_face", "gm_path"];

WO.special_ability_groups = {
  "group_base": "FITD.BasicPrimalAbilities",
  "group_faces": "FITD.FaceStealerFaces",
  "group_core": "FITD.CoreSkill",
  "group_primal": "FITD.PrimalSpecials",
  "group_general": "FITD.GeneralAbilities",
  "group_ext": "FITD.ExternalAbilities"
};

WO.special_ability_hidden_groups =
  ["group_faces", "group_primal"];

WO.doomseeker_eye_rays = {
  "FITD.RayBewitchment": "FITD.RayBewitchment",
  "FITD.RayDeath": "FITD.RayDeath",
  "FITD.RayFear": "FITD.RayFear",
  "FITD.RayNullMagic": "FITD.RayNullMagic",
  "FITD.RayParalysis": "FITD.RayParalysis",
  "FITD.RayTelekinesis": "FITD.RayTelekinesis",
  "FITD.RayTime": "FITD.RayTime",
  "FITD.RayTransmo": "FITD.RayTransmo",
  "FITD.RayVision": "FITD.RayVision"
};

WO.minion_upgrade_types = {
  "regular": "FITD.Regular",
  "path": "FITD.InvocationPath",
  "external": "FITD.External"
};

WO.rollable_skills = {
  "scan": "FITD.SkillsScan",
  "tinker": "FITD.SkillsTinker",
  "trick": "FITD.SkillsTrick",
  "finesse": "FITD.SkillsFinesse",
  "skulk": "FITD.SkillsSkulk",
  "smash": "FITD.SkillsSmash",
  "banter": "FITD.SkillsBanter",
  "invoke": "FITD.SkillsInvoke",
  "threaten": "FITD.SkillsThreaten"
};

WO.adventurer_types = {
  "adventurer": "FITD.Adventurer",
  "hireling": "FITD.Hireling"
};

WO.adventurer_classes = {
  "academic": "FITD.ADV_CLASS.Academic",
  "alchemist": "FITD.ADV_CLASS.Alchemist",
  "amazon": "FITD.ADV_CLASS.Amazon",
  "aristocrat": "FITD.ADV_CLASS.Aristocrat",
  "assassin": "FITD.ADV_CLASS.Assassin",
  "barbarian": "FITD.ADV_CLASS.Barbarian",
  "bard": "FITD.ADV_CLASS.Bard",
  "buccaneer": "FITD.ADV_CLASS.Buccaneer",
  "centurion": "FITD.ADV_CLASS.Centurion",
  "chaosmage": "FITD.ADV_CLASS.ChaosMage",
  "cleric": "FITD.ADV_CLASS.Cleric",
  "deathknight": "FITD.ADV_CLASS.DeathKnight",
  "defender": "FITD.ADV_CLASS.Defender",
  "druid": "FITD.ADV_CLASS.Druid",
  "eldritchwarrior": "FITD.ADV_CLASS.EldritchWarrior",
  "illusionist": "FITD.ADV_CLASS.Illusionist",
  "inquisitor": "FITD.ADV_CLASS.Inquisitor",
  "knight": "FITD.ADV_CLASS.Knight",
  "lancer": "FITD.ADV_CLASS.Lancer",
  "magehunter": "FITD.ADV_CLASS.MageHunter",
  "monk": "FITD.ADV_CLASS.Monk",
  "occultslayer": "FITD.ADV_CLASS.OccultSlayer",
  "ranger": "FITD.ADV_CLASS.Ranger",
  "scout": "FITD.ADV_CLASS.Scout",
  "shadowdancer": "FITD.ADV_CLASS.Shadowdancer",
  "slinger": "FITD.ADV_CLASS.Slinger",
  "spellbow": "FITD.ADV_CLASS.Spellbow",
  "templar": "FITD.ADV_CLASS.Templar",
  "weaponsmith": "FITD.ADV_CLASS.Weaponsmith",
  "wildling": "FITD.ADV_CLASS.Wildling"
};

WO.hireling_types = {
  "archer": "FITD.ADV_TYPE.Archer",
  "boatman": "FITD.ADV_TYPE.Boatman",
  "burglar": "FITD.ADV_TYPE.Burglar",
  "butcher": "FITD.ADV_TYPE.Butcher",
  "carpenter": "FITD.ADV_TYPE.Carpenter",
  "cartographer": "FITD.ADV_TYPE.Cartographer",
  "chronicler": "FITD.ADV_TYPE.Chronicler",
  "cook": "FITD.ADV_TYPE.Cook",
  "driver": "FITD.ADV_TYPE.Driver",
  "farmhand": "FITD.ADV_TYPE.Farmhand",
  "fisherman": "FITD.ADV_TYPE.Fisherman",
  "footman": "FITD.ADV_TYPE.Footman",
  "footpad": "FITD.ADV_TYPE.Footpad",
  "forester": "FITD.ADV_TYPE.Forester",
  "guard": "FITD.ADV_TYPE.Guard",
  "guide": "FITD.ADV_TYPE.Guide",
  "inventor": "FITD.ADV_TYPE.Inventor",
  "linguist": "FITD.ADV_TYPE.Linguist",
  "locksmith": "FITD.ADV_TYPE.Locksmith",
  "lumberjack": "FITD.ADV_TYPE.Lumberjack",
  "mercenary": "FITD.ADV_TYPE.Mercenary",
  "messenger": "FITD.ADV_TYPE.Messenger",
  "miner": "FITD.ADV_TYPE.Miner",
  "pathfinder": "FITD.ADV_TYPE.Pathfinder",
  "priest": "FITD.ADV_TYPE.Priest",
  "ratcatcher": "FITD.ADV_TYPE.RatCatcher",
  "rider": "FITD.ADV_TYPE.Rider",
  "sailor": "FITD.ADV_TYPE.Sailor",
  "sawbones": "FITD.ADV_TYPE.Sawbones",
  "scholar": "FITD.ADV_TYPE.Scholar",
  "scribe": "FITD.ADV_TYPE.Scribe",
  "singer": "FITD.ADV_TYPE.Singer",
  "spelunker": "FITD.ADV_TYPE.Spelunker",
  "swordsman": "FITD.ADV_TYPE.Swordsman",
  "trader": "FITD.ADV_TYPE.Trader",
  "trapfinder": "FITD.ADV_TYPE.Trapfinder"
};

WO.positive_traits = {
  "clever": "FITD.ADV_TRAIT.Clever",
  "confident": "FITD.ADV_TRAIT.Confident",
  "generous": "FITD.ADV_TRAIT.Generous",
  "helpful": "FITD.ADV_TRAIT.Helpful",
  "honest": "FITD.ADV_TRAIT.Honest",
  "optimistic": "FITD.ADV_TRAIT.Optimistic",
  "persistent": "FITD.ADV_TRAIT.Persistent",
  "steady": "FITD.ADV_TRAIT.Steady"
};

WO.negative_traits = {
  "brash": "FITD.ADV_TRAIT.Brash",
  "cocky": "FITD.ADV_TRAIT.Cocky",
  "dishonest": "FITD.ADV_TRAIT.Dishonest",
  "dumb": "FITD.ADV_TRAIT.Dumb",
  "greedy": "FITD.ADV_TRAIT.Greedy",
  "impatient": "FITD.ADV_TRAIT.Impatient",
  "indecisive": "FITD.ADV_TRAIT.Indecisive",
  "stubborn": "FITD.ADV_TRAIT.Stubborn"
};

WO.adventurer_motivations = {
  "challenge": "FITD.ADV_MOTIVE.Challenge",
  "exploration": "FITD.ADV_MOTIVE.Exploration",
  "justice": "FITD.ADV_MOTIVE.Justice",
  "respect": "FITD.ADV_MOTIVE.Respect",
  "riches": "FITD.ADV_MOTIVE.Riches",
  "thrills": "FITD.ADV_MOTIVE.Thrills",
  "vengeance": "FITD.ADV_MOTIVE.Vengeance"
};

WO.goldmonger_types = {
  "acid": "FITD.GM_TYPE.Acid",
  "crystal": "FITD.GM_TYPE.Crystal",
  "fire": "FITD.GM_TYPE.Fire",
  "earth": "FITD.GM_TYPE.Earth",
  "energy": "FITD.GM_TYPE.Energy",
  "ice": "FITD.GM_TYPE.Ice",
  "illusion": "FITD.GM_TYPE.Illusion",
  "lightning": "FITD.GM_TYPE.Lightning",
  "metal": "FITD.GM_TYPE.Metal",
  "mind": "FITD.GM_TYPE.Mind",
  "plant": "FITD.GM_TYPE.Plant",
  "shadow": "FITD.GM_TYPE.Shadow",
  "shimmering": "FITD.GM_TYPE.Shimmering",
  "sonic": "FITD.GM_TYPE.Sonic",
  "venom": "FITD.GM_TYPE.Venom",
  "water": "FITD.GM_TYPE.Water",
  "wind": "FITD.GM_TYPE.Wind"
};

WO.duty_types = {
  "creature": "FITD.DUTY_TYPE.Creature",
  "discovery": "FITD.DUTY_TYPE.Discovery",
  "lock": "FITD.DUTY_TYPE.Lock",
  "room": "FITD.DUTY_TYPE.Room",
  "trap": "FITD.DUTY_TYPE.Trap",
  "trick": "FITD.DUTY_TYPE.Trick"
};

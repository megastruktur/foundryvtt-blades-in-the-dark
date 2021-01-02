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
  "group_flex": "FITD.FlexibilityAbilities",
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
  "academic": "FITD.ClassAcademic",
  "alchemist": "FITD.ClassAlchemist",
  "amazon": "FITD.ClassAmazon",
  "aristocrat": "FITD.ClassAristocrat",
  "assassin": "FITD.ClassAssassin",
  "barbarian": "FITD.ClassBarbarian",
  "bard": "FITD.ClassBard",
  "buccaneer": "FITD.ClassBuccaneer",
  "centurion": "FITD.ClassCenturion",
  "chaosmage": "FITD.ClassChaosMage",
  "cleric": "FITD.ClassCleric",
  "deathknight": "FITD.ClassDeathKnight",
  "defender": "FITD.ClassDefender",
  "druid": "FITD.ClassDruid",
  "eldritchwarrior": "FITD.ClassEldritchWarrior",
  "illusionist": "FITD.ClassIllusionist",
  "inquisitor": "FITD.ClassInquisitor",
  "knight": "FITD.ClassKnight",
  "lancer": "FITD.ClassLancer",
  "magehunter": "FITD.ClassMageHunter",
  "monk": "FITD.ClassMonk",
  "occultslayer": "FITD.ClassOccultSlayer",
  "ranger": "FITD.ClassRanger",
  "scout": "FITD.ClassScout",
  "shadowdancer": "FITD.ClassShadowdancer",
  "slinger": "FITD.ClassSlinger",
  "spellbow": "FITD.ClassSpellbow",
  "templar": "FITD.ClassTemplar",
  "weaponsmith": "FITD.ClassWeaponsmith",
  "wildling": "FITD.ClassWildling"
};

WO.hireling_types = {
  "archer": "FITD.TypeArcher",
  "boatman": "FITD.TypeBoatman",
  "burglar": "FITD.TypeBurglar",
  "butcher": "FITD.TypeButcher",
  "carpenter": "FITD.TypeCarpenter",
  "cartographer": "FITD.TypeCartographer",
  "chronicler": "FITD.TypeChronicler",
  "cook": "FITD.TypeCook",
  "driver": "FITD.TypeDriver",
  "farmhand": "FITD.TypeFarmhand",
  "fisherman": "FITD.TypeFisherman",
  "footman": "FITD.TypeFootman",
  "footpad": "FITD.TypeFootpad",
  "forester": "FITD.TypeForester",
  "guard": "FITD.TypeGuard",
  "guide": "FITD.TypeGuide",
  "inventor": "FITD.TypeInventor",
  "linguist": "FITD.TypeLinguist",
  "locksmith": "FITD.TypeLocksmith",
  "lumberjack": "FITD.TypeLumberjack",
  "mercenary": "FITD.TypeMercenary",
  "messenger": "FITD.TypeMessenger",
  "miner": "FITD.TypeMiner",
  "pathfinder": "FITD.TypePathfinder",
  "priest": "FITD.TypePriest",
  "ratcatcher": "FITD.TypeRatCatcher",
  "rider": "FITD.TypeRider",
  "sailor": "FITD.TypeSailor",
  "sawbones": "FITD.TypeSawbones",
  "scholar": "FITD.TypeScholar",
  "scribe": "FITD.TypeScribe",
  "singer": "FITD.TypeSinger",
  "spelunker": "FITD.TypeSpelunker",
  "swordsman": "FITD.TypeSwordsman",
  "trader": "FITD.TypeTrader",
  "trapfinder": "FITD.TypeTrapfinder"
};

WO.positive_traits = {
  "clever": "FITD.TraitClever",
  "confident": "FITD.TraitConfident",
  "generous": "FITD.TraitGenerous",
  "helpful": "FITD.TraitHelpful",
  "honest": "FITD.TraitHonest",
  "optimistic": "FITD.TraitOptimistic",
  "persistent": "FITD.TraitPersistent",
  "steady": "FITD.TraitSteady"
};

WO.negative_traits = {
  "brash": "FITD.TraitBrash",
  "cocky": "FITD.TraitCocky",
  "dishonest": "FITD.TraitDishonest",
  "dumb": "FITD.TraitDumb",
  "greedy": "FITD.TraitGreedy",
  "impatient": "FITD.TraitImpatient",
  "indecisive": "FITD.TraitIndecisive",
  "stubborn": "FITD.TraitStubborn"
};

WO.adventurer_motivations = {
  "challenge": "FITD.MotivationChallenge",
  "exploration": "FITD.MotivationExploration",
  "justice": "FITD.MotivationJustice",
  "respect": "FITD.MotivationRespect",
  "riches": "FITD.MotivationRiches",
  "thrills": "FITD.MotivationThrills",
  "vengeance": "FITD.MotivationVengeance"
};


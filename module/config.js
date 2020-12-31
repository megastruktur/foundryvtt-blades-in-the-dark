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


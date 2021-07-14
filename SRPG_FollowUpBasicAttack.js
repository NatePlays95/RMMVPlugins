//=============================================================================
// SRPG_FollowUpBasicAttack.js
//=============================================================================
/*:
 * @plugindesc v1.0 Changes the AgiAttackPlus follow-up attack to the default attack.
 * @author Natan Maia
 *
 * @help This plugin does not provide plugin commands.
 *
 * --ABOUT-- 
 * By default in the SRPG_core.js, the follow-up attack made by both actors
 * and enemies is the same attack as the first. That means an attack with
 * a MP/TP cost will only be executed if there's MP/TP left, otherwise you
 * get no followup attack.
 * 
 * This plugin makes it so, if you meet the requirements for a follow-up, it
 * will always be that unit's default attack. It is also compatible with weapons
 * with basic attack skills changed by WeaponSkill.js or SRPG_core.js, so
 * the skill for the follow-up is the same as the Attack command.
 * 
 * 
 * --COMPATIBILITY--
 * Should work with any other SRPG plugins. Place it below SRPG_core.
 * Works with WeaponSkill.js. Haven't tested YEP_WeaponUnleash.js yet.
 *
 * 
 * --TERMS OF USE--
 * I'd love to be credited in your project.
 * 
 * Feel free to modify it for personal use,
 * but for sharing an edit please contact me first
 * You can find me at NatePlays95 on Twitter 
 * or as nate-the-bard on Tumblr and Itch.
 * 
 */

var alias_Battler_reserveSameAction = Game_Battler.prototype.reserveSameAction;
Game_Battler.prototype.reserveSameAction = function() {   
  //this._reserveAction = this._actions[0];
  alias_Battler_reserveSameAction.call(this);
  // Nate edit
  // now followup attack is a basic attack action
  // can be modified by WeaponSkill.js
  atk_action = new Game_Action(this);
  if (this.isActor){
      atk_action.setSkill(Game_Actor.prototype.attackSkillId.call(this));
  } else if (this.isEnemy) {
      atk_action.setSkill(Game_Enemy.prototype.attackSkillId.call(this));
  } else {
      atk_action.setSkill(Game_BattlerBase.prototype.attackSkillId.call(this));
  }
  
  this._reserveAction = atk_action;
};




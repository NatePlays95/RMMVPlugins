//====================================================================================================================
// SRPG_EnemyLevelTag.js
//--------------------------------------------------------------------------------------------------------------------
// v1.0
//====================================================================================================================
/*:
 * @plugindesc Adds a <level:x> notetag for SRPG events.
 * @author Natan Maia
 * 
 * @help
 * If you have either YEP_EnemyLevels or Eli_EnemyClass installed,
 * you can set enemy levels from the map editor.
 * use the tags <level:X> or <lvl:X>, with X being the desired level.
 * 
 * Compatibility:
 * I suggest placing this as close to SRPG_Core as possible.
 */




var Imported = Imported || {};
Imported.SRPG_EnemyLevelTag = true;

MaiaSRPG_ELT = {};

Game_Event.prototype.getMetaLevel = function() {
    return this.event().meta.level || this.event().meta.lvl || false;
};

MaiaSRPG_ELT._Game_System_setSrpgEnemys = Game_System.prototype.setSrpgEnemys;
Game_System.prototype.setSrpgEnemys = function() {
    MaiaSRPG_ELT._Game_System_setSrpgEnemys.call(this);
    //apply ChangeLevel tags for every enemy
    $gameMap.events().forEach(function(event) {
        if (event.isType() === 'enemy' && !event.isErased()) {
            
            var metaLevel = event.getMetaLevel();
            if (!metaLevel) return;

            var enemy = $gameSystem.EventToUnit(event.eventId())[1];
            if (!enemy) return;
            
            var targetLevel = Math.max(1, metaLevel);
            console.log(event, targetLevel);
            //use Eli Enemy Levels
            if (Imported.Eli_EnemyClass) {
                enemy.changeLevel(targetLevel);
            
            //use Yanfly Engine - Enemy Levels
            } else if (Imported.YEP_EnemyLevels) {
                enemy.changeLevel(targetLevel); //they're the same, yes, but just to be sure.
            }

        } 
    });
};
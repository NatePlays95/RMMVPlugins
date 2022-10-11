
_existActorVarID = PluginManager.parameters('SRPG_core')['existActorVarID'];
_existEnemyVarID = PluginManager.parameters('SRPG_core')['existEnemyVarID'];

// CHANGES TO setSrpgActors AND setSrpgEnemys
// now they ignore existing events.

// UNSPAWN is inactive cus there are faster ways to remove enemies (say, kill())

Game_System.prototype.setSrpgEnemys = function() {
    var existingEnemies = 0;
    
    $gameMap.events().forEach(function(event) {
        // if event is not enemy or is knocked out, go to next event
        if (event.isType() != 'enemy' || event.isErased()) return;
        
        existingEnemies+=1;
        
        // if event is already set up, go to next event
        if ( $gameSystem.EventToUnit(event._eventId) != null) return;

        // else, setup new event
        $gameSystem.setNewSrpgEnemy(event);

    });
    
    $gameVariables.setValue(_existEnemyVarID, existingEnemies);
};

Game_System.prototype.setNewSrpgEnemy = function(event){
    var enemyId = event.event().meta.id ? Number(event.event().meta.id) : 1;
    var enemy_unit = new Game_Enemy(enemyId, 0, 0);
    if (enemy_unit) {
        if (event.event().meta.mode) {
            enemy_unit.setBattleMode(event.event().meta.mode);
            if (event.event().meta.targetId) {
                enemy_unit.setTargetId(Number(event.event().meta.targetId));
            }
        }
        enemy_unit.initTp(); //TPを初期化 //useless for my game but here you go i guess.

        // var faceName = enemy_unit.enemy().meta.faceName; //顔グラフィックをプリロードする //useless?? these bitmaps go unused in srpg core
        // if (faceName) { var bitmap = ImageManager.loadFace(faceName); } 
        // else {
        //     if ($gameSystem.isSideView()) { var bitmap = ImageManager.loadSvEnemy(enemy_unit.battlerName(), enemy_unit.battlerHue()); }
        //     else { var bitmap = ImageManager.loadEnemy(enemy_unit.battlerName(), enemy_unit.battlerHue()); } }

        $gameSystem.setEventToUnit(event.eventId(), 'enemy', enemy_unit);
    }
};

//copied from GALV
// Game_Map.prototype.spawnEvent = function(id,x,y,save) {
// 	// Get highest event id available
//     var eId = this._events.length;
// 	// Add to most recent spawn event variable
// 	this._lastSpawnEventId = eId;
// 	// Add event to event list
//     this._events[eId] = new Game_SpawnEvent(this._mapId,eId,x,y,id,save);
	
// 	// Add save data if save
// 	if (save) this._savedSpawnedEvents[this._mapId][eId] = {id: id, x:x, y:y, eId: Number(eId)};
// 	if (Galv.SPAWN.onScene()) SceneManager._scene._spriteset.createSpawnEvent(eId);
// };
//we can use lastSpawnEventId for our purposes....

Game_Map.prototype.spawnEnemyGALV = function(id, x, y, save) { //again, id is from test map
    this.spawnEvent(id,x,y,save);
    var eId = this._lastSpawnEventId;

    $gameSystem.setAllEventType();
    $gameSystem.setSrpgEnemys();
};

// TURNS OUT ACTORS WORK FINE, ACTUALLY?



// Game_System.prototype.setSrpgActors = function() {
//     var existingActors = 0;
    
//     $gameMap.events().forEach(function(event) {
//         // if event is not actor or is knocked out, go to next event
//         if (event.isType() != 'actor' || event.isErased()) return;
        
//         existingActors+=1;
        
//         // if event is already set up, go to next event
//         if ( $gameSystem.EventToUnit(event._eventId) != null) return;

//         // else, setup new event
//         $gameSystem.setNewSrpgActor(event);

//     });
    
//     $gameVariables.setValue(_existActorVarID, existingActors);
// };

// Game_System.prototype.setNewSrpgActor = function(event) {
//     if (_maxActorVarID > 0 && $gameVariables.value(_maxActorVarID) > 0 && actorNum >= $gameVariables.value(_maxActorVarID)) {
//         event.erase();
//         return;
//     }


// };

// Game_System.prototype.setNewSrpgActor = function(event){
//     //copied from SRPG_core
//     if (_maxActorVarID > 0 && $gameVariables.value(_maxActorVarID) > 0 && 
//         actorNum >= $gameVariables.value(_maxActorVarID)) {
//         event.erase();
//         return;
//     }
//     var actorId = event.event().meta.id ? Number(event.event().meta.id) : 0;
//     if (actorId > 0) {
//         var actor_unit = $gameActors.actor(actorId);
//     } else {
//         for (var j=0; j < array.length; j++) {
//             var actor_unit = array[i];
//             if (!actor_unit) {
//                 $gameSystem.setEventToUnit(event.eventId(), 'null', null);
//                 break;
//             }
//             i += 1;
//             if (fix_actors.indexOf(actor_unit.actorId()) < 0) {
//                 break;
//             }
//         };
//     }
//     if (actor_unit) {
//         $gameSystem.pushSrpgAllActors(event.eventId());
//         if (event.event().meta.mode) {
//             actor_unit.setBattleMode(event.event().meta.mode);
//             if (event.event().meta.targetId) {
//                 actor_unit.setTargetId(Number(event.event().meta.targetId));
//             }
//         }
//         actor_unit.setSearchItem(event.event().meta.searchItem);
//         actor_unit.initTp(); //TPを初期化
//         var bitmap = ImageManager.loadFace(actor_unit.faceName()); //顔グラフィックをプリロードする
//         var oldValue = $gameVariables.value(_existActorVarID);
//         $gameVariables.setValue(_existActorVarID, oldValue + 1);
//         actorNum += 1;
//         $gameSystem.setEventToUnit(event.eventId(), 'actor', actor_unit.actorId());
//     }
// };





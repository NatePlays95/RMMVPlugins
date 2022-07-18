//==========================================================================
// Maia_FastForwardKey.js
//==========================================================================

/*:
@plugindesc v1.0 Change the key to accelerate text and scenes.
@author Natan Maia

@param keyName
@text Fast Forward Key
@type string
@desc Type the name of the key, low caps.
@default ok
*/

var Imported = Imported || {};
Imported.Maia_FastForwardKey = true;

var params = PluginManager.parameters('Maia_FastForwardKey');
var _keyName = params['keyName'] || 'ok';

Scene_Map.prototype.isFastForward = function() {
    return ($gameMap.isEventRunning() && !SceneManager.isSceneChanging() &&
            (Input.isPressed(_keyName) || TouchInput.isLongPressed()));
};

Window_Message.prototype.isFastForward = function() {
    //Yanfly compatibility
    if (Imported.YEP_MessageCore){
        if (!$gameSystem.isFastFowardEnabled()) return false; 
    }
    return Input.isPressed(_keyName);
};
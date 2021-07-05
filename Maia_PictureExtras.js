//=============================================================================
// Maia_PictureExtras.js
//=============================================================================
/*:
 * @plugindesc v1.0 Adds more functionality to pictures via commands.
 * @author Natan Maia
 *
 * @param Tint Presets
 * @type struct<TintPresets>[]
 * @desc presets for the TintPicture command
 * @default
 * 
 * @help
 * --ABOUT--
 * This plugin adds two commands: ChangePicture and TintPicture
 * 
 * --------------------------------
 * ChangePicture pictureId filename
 * --------------------------------
 * ChangePicture lets you change the file used by a picture on screen,
 * while keeping its alterations like position, scale, tint etc.
 * 
 * In the command structure, 'pictureId' is the same picture number
 * you choose in the event commands, while 'filename' is the name
 * of the file, without any extensions, to replace the current image with.
 * 
 * For example, 'ChangePicture 5 bg_castle' replaces picture 5 with
 * the picture named bg_castle.png in your pictures folder.
 * 
 * --------------------------------------------------
 * TintPicture pictureId red green blue gray duration
 * --------------------------------------------------
 * TintPicture lets you tint a picture as in the default event command.
 * Again, 'pictureId' is the number you assigned to the picture.
 * Red, Green, Blue and Gray refer to the color values to tint the
 * image with. Red, Green and Blue range from -255 to 255, while Gray
 * ranges from 0 to 255. Duration is the amount of frames that you
 * want the tint process to take.
 * 
 * For example, 'TintPicture 5 34 -34 -68 170 10' will tint picture
 * number 5 with a sepia tone, in 10 frames (1/6 seconds).
 * 
 * -------------------------------------
 * TintPicture pictureId preset duration
 * -------------------------------------
 * You can also create new presets for TintPicture, much like the
 * 4 default presets in the even command. Create a new preset in
 * the plugin parameters, add a name and the color values.
 * 
 * For example, 'TintPicture normal 60' will change the picture's
 * colors to the normal tint, as set in the plugin params, taking
 * a full second (60 frames) to do it.
 * 
 * 
 * 
 * --HELP--
 * Before using ChangePicture, it is recommended you preload the picture,
 * otherwise the image may be invisible for a frame or so (loading).
 * 
 * Here's the default tint presets from MV:
 * normal = 0, 0, 0, 0
 * dark = -68, -68, -68, 0
 * sepia = 34, -34, -68, 170
 * sunset = 68, -34, -34, 0
 * night = -68, -68, 0, 68
 * Look into the plugin parameters to create your own tint presets.
 * 
 * 
 * --TERMS OF USE--
 * This took me some work, so I'd love to be at least credited.
 * You can find me at NatePlays95 on Twitter 
 * or as nate-the-bard on Tumblr and Itch.
 *
 * --COMPATIBILITY--
 * Should work with anything; this is just a script call made easier.
 */

/*~struct~TintPresets:
 * 
 * @param presetName
 * @text Name of Preset
 * @type text
 * @desc Name used in commands to call the parameter (warning: case sensitive)
 * @default 
 *  
 * @param red
 * @text Red Tint
 * @type number
 * @min -255
 * @max 255
 * @decimals 0
 * @desc Amount of red tint for the preset. Ranges from -255 to 255.
 * @default 0
 * 
 * @param green
 * @text Green Tint
 * @type number
 * @min -255
 * @max 255
 * @decimals 0
 * @desc Amount of green tint for the preset. Ranges from -255 to 255.
 * @default 0
 * 
 * @param blue
 * @text Blue Tint
 * @type number
 * @min -255
 * @max 255
 * @decimals 0
 * @desc Amount of blue tint for the preset. Ranges from -255 to 255.
 * @default 0
 * 
 * @param gray
 * @text Gray Tint
 * @type number
 * @min 0
 * @max 255
 * @decimals 0
 * @desc How grayscale the preset is. Ranges from 0 to 255.
 * @default 0
 * 
 */
////////////////////////////////////
//Variable Setup
////////////////////////////////////

var params = PluginManager.parameters("Maia_PictureExtras");
//var tintPresets = JSON.parse(PluginManager.parameters("Maia_PictureExtras")['Tint Presets']); //access with tintPresets['name'] etc
var tintPresetsRaw = JSON.parse(PluginManager.parameters("Maia_PictureExtras")['Tint Presets']);
var tintPresets = [];
for (var i = 0; i < tintPresetsRaw.length; i++) {
    tintPresets.push(JSON.parse(tintPresetsRaw[i])); //access with tintPresets['name'] etc
}
console.log(tintPresetsRaw);
console.log(tintPresets);

///////////////////////////////////
// Command Logic
///////////////////////////////////

//alias the plugin command reader
var alias_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;

Game_Interpreter.prototype.pluginCommand = function(command, args) {
    alias_Game_Interpreter_pluginCommand.call(this, command, args);
    //test the command name
    if (command.toLowerCase() === "changepicture") {
        var picId = parseInt(args[0]);
        var filename = args[1];

        //call to change the picture
        $gameScreen.picture(picId)._name = filename;

    } else if (command.toLowerCase() === "tintpicture"){
        var picId = parseInt(args[0]);
        //tone = [red, green, blue, gray]   
        var tone = [0,0,0,0];
        var duration = 1;
        if (args.length == 3){
            for (var i = 0; i < tintPresets.length; i++){
                
                if (args[1] === tintPresets[i].presetName) {
                    tone = [parseInt(tintPresets[i].red), parseInt(tintPresets[i].green), 
                            parseInt(tintPresets[i].blue), parseInt(tintPresets[i].gray)];
                    duration = parseInt(args[2]);
                    //console.log("found!");
                    break;
                }
            }
        } else if (args.length == 6){
            tone = [parseInt(args[1]), 
                    parseInt(args[2]), 
                    parseInt(args[3]), 
                    parseInt(args[4]) ];
            duration = parseInt(args[5]);
        }
        //console.log(tone, duration);

        //call to tint picture
        $gameScreen.tintPicture(picId, tone, duration);
    }
};

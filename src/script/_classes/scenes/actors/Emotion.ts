"use strict";
import Actor   = require("../../lib/scenes/actors/Actor");
import Scene   = require("../../lib/scenes/Scene");

const emojis = "😀😁😂😃😄😅😆😇😈😉😊😋😌😍😎😏😐😑😒😓😔😕😖😗😘😙😚😛😜😝😞😟😠😡😢😣😤😥😦😧😨😩😪😫😬😭😮😯";

/**
 * Emotion class
 */

class Emotion extends Actor {
  public emoji:string;

  constructor(scene:Scene, obj:any) {
    super(scene, obj);
    this.shape = "circle";
    this.emoji = emojis.substr(Math.floor(emojis.length*Math.random()*.5)*2, 2);
  }

  render() {
    var g = this.scene.game.ctx, x=0, y=0;
    this.scene.game.ctx.strokeStyle = "red";
    g.font = "32px sans-serif";
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText(this.emoji, x, y);
    super.render();
  }


  /*
    _privates
  */

}
export = Emotion;

"use strict";
import Actor   = require("../../lib/scenes/actors/Actor");
import Scene   = require("../../lib/scenes/Scene");
import Vector2 = require("../../lib/utils/Vector2");

/**
 * Aye class
 */

class Aye extends Actor {
  public state:string;
  public target:Vector2;
  public distanceToTarget:Vector2 = new Vector2();
  public dir:Vector2 = new Vector2();

  constructor(scene:Scene, obj:any) {
    super(scene, obj);
    this.shape = "circle";
    // this.setAnchor(this.size.x/2, this.size.y-15);
    // this.size.set(60, 30);
    this.addAnimation("idle",  [ 0, 1, 2, 3, 4, 5, 6, 7]);
    this.addAnimation("walk",  [ 8, 9,10,11,12,13,14,15], 0);
    this.addAnimation("do",    [16,17,18,19,20,21,22,23]);
    this.addAnimation("sleep", [24,25,26,27,28,29,30,31]);
    this.order = 1024;
  }

  update() {
    var joy = this.scene.game.joypad;
    if (this.target) {
      joy.dir.copyFrom(this.dir);
      let lastDist = this.distanceToTarget.magnitude;
      this.target.subtract(this.position, this.distanceToTarget);
      if (this.distanceToTarget.magnitude >= lastDist) {
        this.target = null;
        joy.fire = true;
        joy.delta.fire++;
      }
    }
    if (this.state) return super.update();
    if (joy.dir.magnitude) {
      this.velocity.copyFrom(joy.dir).multiplyXY(8);
      this.playAnimation("walk");
      this.animationFrame += joy.dir.magnitude;
      if (joy.dir.x < 0) {
        this.scale.x = -1;
      }
      if (joy.dir.x > 0) {
        this.scale.x = 1;
      }
    } else {
      this.velocity.set(0);
      this.playAnimation("idle");
    }
    super.update();
    let pe = this.scene.actorsByType["ParticleEmitter"][0];
    pe.position.copyFrom(this.position);
    pe.emit();
    pe.emit();
    pe.emit();
    pe.emit();
    this.scene.camera.copyFrom(this.position).subtractXY(this.scene.game.canvas.width/2, this.scene.game.canvas.height/2);
  }

  goTo(dest:Vector2) {
    this.target = dest;
    this.target.subtract(this.position, this.distanceToTarget);
    this.distanceToTarget.magnitude += 8;
    this.dir.copyFrom(this.distanceToTarget);
    this.dir.magnitude = 1;
  }

  doNothing() {
    for(let thing of this.scene.actorsByType["Thing"]) {
      if (this.overlapsWith(thing)) {
        thing.deactivate();
      }
    }
    this.state = null;
  }

  doSomething() {
    for(let thing of this.scene.actorsByType["Thing"]) {
      if (this.overlapsWith(thing)) {
        this.position.x = thing.position.x;
        thing.activate();
      }
    }
    this.state = "doing";
    this.playAnimation("do");
    this.velocity.set(0);
  }

  sleep() {
    for(let thing of this.scene.actorsByType["Thing"]) {
      if (this.overlapsWith(thing)) {
        this.position.x = thing.position.x;
        thing.activate();
      }
    }
    this.state = "sleeping";
    this.scale.x = 1;
    this.playAnimation("sleep");
    this.velocity.set(0);
  }

  /*
    _privates
  */

}
export = Aye;

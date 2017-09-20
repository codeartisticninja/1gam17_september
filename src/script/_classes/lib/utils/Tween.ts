"use strict";


/**
 * Tween class
 * 
 * @date 20-sep-2017
 */

class Tween {
  constructor(public object:Object, public endProps:Object, public duration:number, autostart=true) {
    this.update = this.update.bind(this);
    if (autostart) this.start();
  }

  start(endProps=this.endProps, duration=this.duration) {
    this.endProps=endProps;
    this.duration=duration;
    this._startTime = Date.now();
    this._startProps = {};
    for (var key in this.endProps) {
      this._startProps[key] = this.object[key];
    }
    this.update();
  }

  update() {
    cancelAnimationFrame(this._updateTO);
    var progress = Math.min(1, (Date.now() - this._startTime) / this.duration);
    this._setValues(this.object, this._startProps, this.endProps, progress);
    if (progress < 1) {
      this._updateTO = requestAnimationFrame(this.update);
    } else {
      for (let cb of this._callbacks) {
        cb(this);
      }
    }
  }

  stop() {
    cancelAnimationFrame(this._updateTO);
  }

  reverse() {
    this.stop();
    this.endProps = this._startProps;
    this.start();
  }

  onEnd(cb:Function, forget=false) {
    let i = this._callbacks.indexOf(cb);
    if (forget) {
      if (i !== -1) this._callbacks.splice(i,1);
    } else {
      if (i === -1) this._callbacks.push(cb);
    }
  }

  /*
    _privates
  */
  private _startProps:Object;
  private _startTime:number;
  private _updateTO:any;
  private _callbacks:Function[]=[];

  private _setValues(object:Object, startProps:Object, endProps:Object, progress:number) {
    for (var key in endProps) {
      if (typeof object[key] === "object") {
        object[key] = object[key] || {};
        this._setValues(object[key], startProps[key], endProps[key], progress);
      } else {
        object[key] = startProps[key] + progress * (endProps[key] - startProps[key]);
      }
    }
  }

}
export = Tween;

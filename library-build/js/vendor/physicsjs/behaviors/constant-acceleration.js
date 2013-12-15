/**
 * PhysicsJS v0.5.3 - 2013-11-25
 * A modular, extendable, and easy-to-use physics engine for javascript
 * http://wellcaffeinated.net/PhysicsJS
 *
 * Copyright (c) 2013 Jasper Palfree <jasper@wellcaffeinated.net>
 * Licensed MIT
 */

(function(e,t){var n=["physicsjs"];if(typeof exports=="object"){var r=n.map(require);module.exports=t.call(e,r[0])}else typeof define=="function"&&define.amd?define(n,function(n){return t.call(e,n)}):e.Physics=t.call(e,e.Physics)})(this,function(e){return e.behavior("constant-acceleration",function(t){var n={acc:{x:0,y:4e-4}};return{init:function(r){t.init.call(this,r),this.options=e.util.extend(this.options,n,r),this._acc=e.vector(),this.setAcceleration(this.options.acc)},setAcceleration:function(e){return this._acc.clone(e),this},behave:function(e){var t=e.bodies;for(var n=0,r=t.length;n<r;++n)t[n].accelerate(this._acc)}}}),e});
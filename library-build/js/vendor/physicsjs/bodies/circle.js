/**
 * PhysicsJS v0.5.3 - 2013-11-25
 * A modular, extendable, and easy-to-use physics engine for javascript
 * http://wellcaffeinated.net/PhysicsJS
 *
 * Copyright (c) 2013 Jasper Palfree <jasper@wellcaffeinated.net>
 * Licensed MIT
 */

(function(e,t){var n=["physicsjs","../geometries/circle"];if(typeof exports=="object"){var r=n.map(require);module.exports=t.call(e,r[0])}else typeof define=="function"&&define.amd?define(n,function(n){return t.call(e,n)}):e.Physics=t.call(e,e.Physics)})(this,function(e){return e.body("circle",function(t){var n={radius:1};return{init:function(r){t.init.call(this,r),r=e.util.extend({},n,r),this.geometry=e.geometry("circle",{radius:r.radius}),this.recalc()},recalc:function(){t.recalc.call(this),this.moi=this.mass*this.geometry.radius*this.geometry.radius/2}}}),e});
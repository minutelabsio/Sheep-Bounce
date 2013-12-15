/**
 * PhysicsJS v0.5.3 - 2013-11-25
 * A modular, extendable, and easy-to-use physics engine for javascript
 * http://wellcaffeinated.net/PhysicsJS
 *
 * Copyright (c) 2013 Jasper Palfree <jasper@wellcaffeinated.net>
 * Licensed MIT
 */

(function(e,t){var n=["physicsjs","../geometries/convex-polygon"];if(typeof exports=="object"){var r=n.map(require);module.exports=t.call(e,r[0])}else typeof define=="function"&&define.amd?define(n,function(n){return t.call(e,n)}):e.Physics=t.call(e,e.Physics)})(this,function(e){return e.body("convex-polygon",function(t){var n={};return{init:function(r){t.init.call(this,r),r=e.util.extend({},n,r),this.geometry=e.geometry("convex-polygon",{vertices:r.vertices}),this.recalc()},recalc:function(){t.recalc.call(this),this.moi=e.geometry.getPolygonMOI(this.geometry.vertices)}}}),e});
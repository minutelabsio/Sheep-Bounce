/**
 * PhysicsJS v0.5.3 - 2013-11-25
 * A modular, extendable, and easy-to-use physics engine for javascript
 * http://wellcaffeinated.net/PhysicsJS
 *
 * Copyright (c) 2013 Jasper Palfree <jasper@wellcaffeinated.net>
 * Licensed MIT
 */

(function(e,t){var n=["physicsjs"];if(typeof exports=="object"){var r=n.map(require);module.exports=t.call(e,r[0])}else typeof define=="function"&&define.amd?define(n,function(n){return t.call(e,n)}):e.Physics=t.call(e,e.Physics)})(this,function(e){return e.behavior("newtonian",function(t){var n={strength:1};return{init:function(r){t.init.call(this,r),r=e.util.extend({},n,r),this.strength=r.strength,this.tolerance=r.tolerance||100*this.strength},behave:function(t){var n=t.bodies,r,i,s=this.strength,o=this.tolerance,u=e.scratchpad(),a=u.vector(),f,l;for(var c=0,h=n.length;c<h;c++){r=n[c];for(var p=c+1;p<h;p++)i=n[p],a.clone(i.state.pos),a.vsub(r.state.pos),f=a.normSq(),f>o&&(l=s/f,r.accelerate(a.normalize().mult(l*i.mass)),i.accelerate(a.mult(r.mass/i.mass).negate()))}u.done()}}}),e});
/**
 * PhysicsJS v0.5.3 - 2013-11-25
 * A modular, extendable, and easy-to-use physics engine for javascript
 * http://wellcaffeinated.net/PhysicsJS
 *
 * Copyright (c) 2013 Jasper Palfree <jasper@wellcaffeinated.net>
 * Licensed MIT
 */

(function(e,t){var n=["physicsjs"];if(typeof exports=="object"){var r=n.map(require);module.exports=t.call(e,r[0])}else typeof define=="function"&&define.amd?define(n,function(n){return t.call(e,n)}):e.Physics=t.call(e,e.Physics)})(this,function(e){return e.integrator("improved-euler",function(t){return{init:function(e){t.init.call(this,e)},integrateVelocities:function(e,t){var n=1-this.options.drag,r=null,i;for(var s=0,o=e.length;s<o;++s)r=e[s],i=r.state,r.fixed?(i.vel.zero(),i.acc.zero(),i.angular.vel=0,i.angular.acc=0):(i.old.vel.clone(i.vel),i.old.acc.clone(i.acc),i.vel.vadd(i.acc.mult(t)),n&&i.vel.mult(n),i.acc.zero(),i.old.angular.vel=i.angular.vel,i.angular.vel+=i.angular.acc*t,i.angular.acc=0)},integratePositions:function(t,n){var r=.5*n*n,i=null,s,o=e.scratchpad(),u=o.vector(),a;for(var f=0,l=t.length;f<l;++f)i=t[f],s=i.state,i.fixed||(s.old.pos.clone(s.pos),u.clone(s.old.vel),s.pos.vadd(u.mult(n)).vadd(s.old.acc.mult(r)),s.old.acc.zero(),s.old.angular.pos=s.angular.pos,s.angular.pos+=s.old.angular.vel*n+s.old.angular.acc*r,s.old.angular.acc=0);o.done()}}}),e});
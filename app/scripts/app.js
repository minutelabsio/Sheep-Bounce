define(
    [
        'jquery',
        'boxbox',
        'modules/device-gravity'
    ], 
    function(
        
        $,
        boxbox,
        deviceGravity

    ) {

        var canvas
            ,world
            ,scale = 5
            ,width
            ,height
            ,defaultGravity = {
                    x: 0,
                    y: 100
                }
            ;

        function resize(){

            if (!canvas) return;

            var win = $(window);

            width = win.width();
            height = win.height();

            canvas[0].width = width;
            canvas[0].height = height;

            width /= scale;
            height /= scale;
        }

        function initDragDropToss(){

            var grabbed
                ,grabPos
                ,grabOffset
                ,path
                ;

            canvas.on({
                'mousedown': function(e){

                    var x = e.offsetX/scale
                        ,y = e.offsetY/scale
                        ,entities = world.find(x, y, x+1, y+1)
                        ;

                    if (entities.length){

                        grabbed = entities[0];
                        grabbed._body.SetType(Box2D.Dynamics.b2Body.b2_staticBody);
                        grabbed._body.SetActive(false);

                        grabPos = grabbed.position();

                        grabOffset = {
                            x: e.offsetX/scale - grabPos.x,
                            y: e.offsetY/scale - grabPos.y
                        };

                        path = [{
                            t: e.timeStamp,
                            x: grabPos.x,
                            y: grabPos.y
                        }];
                    }
                },
                'mousemove': function(e){

                    if (grabbed) {

                        var x = e.offsetX/scale
                            ,y = e.offsetY/scale
                            ;

                        path.push({
                            t: e.timeStamp,
                            x: x,
                            y: y
                        });
                    
                        grabbed.position({
                            x: x - grabOffset.x,
                            y: y - grabOffset.y
                        });
                    }
                },
                'mouseup': function(e){

                    var dx, dy, prev, last, dt;

                    if (grabbed){

                        last = path.pop();
                        prev = path.pop();

                        if (prev){
                            dt = last.t - prev.t;
                            dx = last.x - prev.x;
                            dy = last.y - prev.y;
                        }

                        grabbed._body.SetType(Box2D.Dynamics.b2Body.b2_dynamicBody);
                        grabbed._body.SetActive(true);
                        
                        if (prev)
                            grabbed.applyImpulse(100000*Math.sqrt(dx*dx + dy*dy)/dt, dx, dy);

                        grabbed = null;
                    }
                }
            });
        }

        function initGravity(){

            var gravity = {};

            if (!deviceGravity.isSupported){ 
                return;
            }

            deviceGravity.subscribe(function(data){

                gravity = {
                    x: defaultGravity.y * ( defaultGravity.x + data.x ),
                    y: defaultGravity.y * ( 1 + data.y )
                };
            });

            world.onTick(function(){

                // world.gravity({
                //     x: gravity.x,
                //     y: defaultGravity.y
                // });

                //return;

                var entities = world.find(0,0,width,height)
                    ,entity
                    ;

                for ( var i = 0, l = entities.length; i < l; ++i ){
                    
                    entity = entities[i];

                    entity.clearForce('grav');
                    entity.setForce('grav', Math.abs(5000 * gravity.x), gravity.x > 0 ? 90 : -90);
                }
            });
        }

        function createBoundaries(){

            var tplBoundary = {
                    restitution: 1,
                    friction: 0.1,
                    type: 'static',
                    active: true,
                    shape: 'square'
                }
                ,bounds = []
                ;

            // left
            bounds.push(
                world.createEntity(tplBoundary, {
                    x: 0,
                    y: 0,
                    width: 1,
                    height: height*2
                })
            );

            // bottom
            bounds.push(
                world.createEntity(tplBoundary, {
                    x: 0,
                    y: height,
                    width: width*2,
                    height: 1
                })
            );

            // top
            bounds.push(
                world.createEntity(tplBoundary, {
                    x: 0,
                    y: 0,
                    width: width*2,
                    height: 1
                })
            );

            // right
            bounds.push(
                world.createEntity(tplBoundary, {
                    x: width,
                    y: 0,
                    width: 1,
                    height: height*2
                })
            );

            return bounds;
        }

        function createSheep(){

            var sheepTemplate1 = {
                    restitution: 1.4,
                    friction: 0.1,
                    rotation: 10,
                    width: 25,
                    height: 20,
                    shape: 'square',
                    image: 'images/sheep-1.png',
                    imageOffsetX: -7,
                    imageOffsetY: -4,
                    imageStretchToFit: true
                }
                ,sheepTemplate2 = $.extend({}, sheepTemplate1, {

                    image: 'images/sheep-2.png'
                })
                ,sheepTemplateFly = $.extend({}, sheepTemplate1, {

                    width: 46,
                    height: 26,
                    imageOffsetY: -7,
                    imageOffsetX: -10,
                    image: 'images/sheep-fly.png'
                })
                ,sheep = []
                ;
            
            sheep.push(
                world.createEntity(sheepTemplate1, {
                    x: 30,
                    y: 10
                })
            );

            sheep.push(
                world.createEntity(sheepTemplate1, {
                    x: 80,
                    y: 50
                })
            );

            sheep.push(
                world.createEntity(sheepTemplate1, {
                    x: 120,
                    y: 60
                })
            );

            sheep.push(
                world.createEntity(sheepTemplate2, {
                    x: 60,
                    y: 10
                })
            );

            sheep.push(
                world.createEntity(sheepTemplate2, {
                    x: 20,
                    y: 60
                })
            );

            sheep.push(
                world.createEntity(sheepTemplate2, {
                    x: 140,
                    y: 10
                })
            );

            return sheep;
        }

        function getTotalKE( entities ){

            var energy = 0;

            if (!entities.length) return energy;

            for ( var i = 0, l = entities.length, body; i < l; ++i ){
                
                body = entities[ i ]._body;
                energy += 0.5 * body.GetMass() * body.GetLinearVelocity().LengthSquared();
            }

            return energy;
        }

        function init(){

            var sheep
                ,bounds
                ;

            $(window).on('resize', resize);

            $(function(){

                canvas = $('#canvas');
                resize();

                world = boxbox.createWorld(canvas[0], {
                    scale: scale,
                    gravity: defaultGravity,
                    collisionOutlines: false
                });

                initDragDropToss();
                initGravity();
                
                bounds = createBoundaries();
                sheep = createSheep();

                // world.onTick(function(){
                //     console.log(getTotalKE(sheep));
                // })
            });
    
        }

        return {

            init: init
        };
    }
);
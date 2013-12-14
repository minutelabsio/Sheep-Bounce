define(
    [
        'jquery',
        'modules/device-gravity',
        'physicsjs',
        'physicsjs/bodies/convex-polygon',
        'physicsjs/behaviors/edge-collision-detection',
        'physicsjs/behaviors/body-collision-detection',
        'physicsjs/behaviors/body-impulse-response',
        'physicsjs/behaviors/sweep-prune',
        'physicsjs/behaviors/constant-acceleration',
        'physicsjs/renderers/canvas',
        'modules/pjs-mouse'
    ],
    function(
        $,
        deviceGravity,
        Physics
    ) {

        'use strict';
        Physics(function( world ){

            var pent = [
                    { x: 50, y: 0 },
                    { x: 25, y: -25 },
                    { x: -25, y: -25 },
                    { x: -50, y: 0 },
                    { x: 0, y: 50 }
                ];

            var viewWidth = window.innerWidth
                ,viewHeight = window.innerHeight
                ,viewportBounds = Physics.aabb(0, 0, viewWidth, viewHeight)
                ,edgeBounce = Physics.behavior('edge-collision-detection', {
                    aabb: viewportBounds,
                    restitution: 1.1
                })
                ,renderer = Physics.renderer('canvas', {
                    el: 'canvas',
                    width: viewWidth,
                    height: viewHeight
                })
                ,defaultGravity = {
                    x: 0,
                    y: 0.0003
                }
                ,acc = Physics.vector(0, 0)
                ,grav = Physics.behavior('constant-acceleration')
                ,sheepTemplate = {
                    vertices: [
                        {x: 0, y: 100},
                        {x: 140, y: 100},
                        {x: 140, y: 0},
                        {x: 0, y: 0}
                    ],
                    restitution: 0.97
                }
                ,sheep1 = document.getElementById('sheep1')
                ,sheep2 = document.getElementById('sheep2')
                ,sheepfly = document.getElementById('sheep-fly')
                ;


            world.subscribe('step', function(){
                world.render();
            });

            function initGravity(){

                var gravity = {
                    x: defaultGravity.x,
                    y: defaultGravity.y
                };

                if (!deviceGravity.isSupported){ 
                    return false;
                }

                var cb = function (){

                    $('body').addClass('device-orientation');

                    cb = function(){};
                };

                deviceGravity.subscribe(function(data){

                    cb();

                    acc.clone({
                        x: defaultGravity.y * ( defaultGravity.x + data.x ),
                        y: defaultGravity.y * ( 1 + data.y )
                    });

                    grav.setAcceleration( acc );
                });

                return true;
            }

            function createSheep(){

                var sheep = [];

                for ( var i = 0, l = 6; i < l; ++i ){
                    
                    sheep.push(
                        Physics.util.extend({}, sheepTemplate, {
                            x: 200 + (i % 3|0)*150,
                            y: 150 + (i/3|0)*150
                        })
                    );
                }
                

                var ret = [];
                Physics.util.each( sheep, function( sh ){
                    var b = Physics.body('convex-polygon', sh);
                    b.view = (Math.random() > 0.5)? sheep1 : sheep2;
                    ret.push( b );
                });

                return ret;
            }

            function resize(){

                viewWidth = window.innerWidth;
                viewHeight = window.innerHeight;
                renderer.el.width = viewWidth;
                renderer.el.height = viewHeight;
                viewportBounds = Physics.aabb(0, 0, viewWidth, viewHeight);
                edgeBounce.setAABB( viewportBounds );

            }

            function flyingSheep(){
                var sheep = Physics.body('convex-polygon', Physics.util.extend({}, sheepTemplate, {
                    x: -50,
                    y: viewHeight / 2,
                    fixed: true
                }));

                sheep.view = sheepfly;

                world.subscribe('step', function( data ){
                    if ( sheep.state.pos.get(0) > (viewWidth - 200) ){
                        sheep.fixed = false;
                        sheep.view = Math.random() > 0.5 ? sheep1 : sheep2;
                        sheep.state.vel.set(0.2, 0);
                        world.unsubscribe( data.topic, data.handler );
                    } else {
                        sheep.state.pos.add( 10, 0 );
                    }
                });

                world.add( sheep );
            }

            $(document).on('click', '#controls .ctrl-energy', function(){
                flyingSheep();
                return false;
            });
            
            window.addEventListener('resize', resize, false);

            
            $(function(){

                world.add( createSheep() );
                
                resize();
                initGravity();

                world.add([
                    Physics.integrator('verlet', { drag: 0.001 }),
                    renderer,
                    Physics.behavior('body-collision-detection', { checkAll: false }),
                    Physics.behavior('sweep-prune'),
                    Physics.behavior('body-impulse-response'),
                    edgeBounce,
                    // add gravity
                    grav,
                    Physics.behavior('demo-mouse-events', { el: $('#canvas')[0] })
                ]);

                Physics.util.ticker.subscribe(function( t ){
                    world.step( t );
                }).start();

            });
        });
    }
);





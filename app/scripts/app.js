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
            ,flyingSheepVelocity = 1000
            ;

        var sheepTemplate1 = {
                restitution: 1.4,
                friction: 0.1,
                rotation: 10,
                width: 25,
                height: 20,
                shape: 'square',
                image: $('#sheep1').attr('src'),
                imageOffsetX: -7,
                imageOffsetY: -4,
                imageStretchToFit: true
            }
            ,sheepTemplate2 = $.extend({}, sheepTemplate1, {

                image: $('#sheep2').attr('src')
            })
            ,sheepTemplateFly = $.extend({}, sheepTemplate1, {

                width: 46,
                height: 26,
                imageOffsetY: -7,
                imageOffsetX: -10,
                image: $('#sheep-fly').attr('src')
            })
            ,sheep = []
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
                ,isTouch = Modernizr.touch
                ;

            function grab(e){

                var coords = isTouch? e.originalEvent.touches[0] : e
                    ,x = coords.pageX/scale
                    ,y = coords.pageY/scale
                    ,entities
                    ;

                if (!x || !y) return;
                
                entities = world.find(x, y, x+1, y+1);

                if (entities.length){

                    e.preventDefault();

                    grabbed = entities[0];
                    grabbed._body.SetType(Box2D.Dynamics.b2Body.b2_staticBody);
                    grabbed._body.SetActive(false);

                    grabPos = grabbed.position();

                    grabOffset = {
                        x: coords.pageX/scale - grabPos.x,
                        y: coords.pageY/scale - grabPos.y
                    };

                    path = [{
                        t: e.timeStamp,
                        x: grabPos.x,
                        y: grabPos.y
                    }];
                }
            }

            function drag(e){

                e.preventDefault();

                if (grabbed) {

                    var coords = isTouch? e.originalEvent.touches[0] : e
                        ,x = coords.pageX/scale
                        ,y = coords.pageY/scale
                        ;

                    if (!x || !y){

                        release(e);
                    }

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
            }

            function release(e){

                e.preventDefault();

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

            if (isTouch){

                canvas.on({
                    'touchstart': grab,
                    'touchmove': drag,
                    'touchend': release
                });                

            } else {

                canvas.on({
                    'mousedown': grab,
                    'mousemove': drag,
                    'mouseup': release,
                });
            }
        }

        function initGravity(){

            var gravity = {
                x: defaultGravity.x,
                y: defaultGravity.y
            };

            if (!deviceGravity.isSupported){ 
                return false;
            }

            function cb(){

                $('body').addClass('device-orientation');

                cb = function(){};
            }

            deviceGravity.subscribe(function(data){

                cb();

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

                // return;

                var entities = world.find(0, 0, width, height)
                    ,entity
                    ;

                for ( var i = 0, l = entities.length; i < l; ++i ){
                    
                    entity = entities[i];

                    entity.clearForce('grav');
                    entity.setForce('grav', Math.abs(5000 * gravity.x), gravity.x > 0 ? 90 : -90);
                }
            });

            return true;
        }

        function createBoundaries(){

            var tplBoundary = {
                    restitution: 1.4,
                    friction: 0.1,
                    type: 'static',
                    active: true,
                    shape: 'square',
                    color: '#222'
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

        function getEnergy( entities ){

            var ke = 0
                ,pe = 0
                ,m
                ;

            if (!entities.length) return ke;

            for ( var i = 0, l = entities.length, body; i < l; ++i ){
                
                body = entities[ i ]._body;
                m = body.GetMass();
                ke += 0.5 * m * body.GetLinearVelocity().LengthSquared();
                pe += m * defaultGravity.y * (height - body.GetPosition().y);

            }

            return {
                ke: ke,
                pe: pe,
                total: ke + pe
            };
        }

        function flyingSheep( cb ){

            var flying;

            flying = world.createEntity(sheepTemplateFly, {
                x: 0.5*sheepTemplateFly.width,
                y: height/1.5,
                fixedRotation: true,
                rotation: -20
            });

            flying.setVelocity('fly', flyingSheepVelocity, 90);
            flying.onTick(function(){

                var pos = flying.position();
                //console.log(pos.x, width)
                if ( pos.x > (width - sheepTemplateFly.width) ){

                    flying.destroy();
                    cb && cb(pos);
                }
            });
        }

        function init(){

            var sheep
                ,bounds
                ;

            $(document).on('click', 'a[href^=http]', function(e){

                var $this = $(this)
                    ,url = $this.attr('href')
                    ,newtab = ($this.attr('target') === '_blank' || e.metaKey || e.ctrlKey)
                    ;

                window._gaq = window._gaq || [];
                
                try {

                    window._gaq.push(['_trackEvent', 'Outbound Links', e.currentTarget.host, url, 0]);
                    
                    if (!newtab) {

                        e.preventDefault();
                        setTimeout('document.location = "' + url + '"', 100);
                    }
                } catch (err){}
            });

            //$(window).on('resize', resize);

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
                //     var e = getEnergy(sheep);
                //     console.log(e.ke, e.pe, e.total);
                // })
                
                $('#controls .ctrl-energy').on('click', function(e){

                    e.preventDefault();

                    flyingSheep(function( pos ){

                        var tpl = Math.random() > 0.5 ? sheepTemplate1 : sheepTemplate2
                            ,shp
                            ;

                        shp = world.createEntity(tpl, {
                            x: pos.x,
                            y: pos.y
                        });

                        shp.applyImpulse(flyingSheepVelocity*100, 90);
                        
                        sheep.push(shp);
                    });
                });
            });
    
        }

        return {

            init: init
        };
    }
);
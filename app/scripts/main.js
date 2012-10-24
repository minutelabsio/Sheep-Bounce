require.config({
    shim: {
        'box2d': {

            exports: 'Box2D'
        },
        'boxbox': {

            deps: ['box2d'],
            exports: 'boxbox'
        }
    },

    paths: {

        'jquery': 'vendor/jquery.min',
        'box2d': 'vendor/box2dweb-2.1.a.3',
        'boxbox': 'vendor/boxbox'
    },

    map: {

        '*': {
            
        }
    }

});
 
require(['app'], function(app) {

    app.init();
});
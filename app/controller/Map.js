Ext.define('EM.controller.Map', {
    extend: 'Ext.app.Controller',
    config: {
        control: {
            eMap: {
                painted: 'initMap'
            }
        },
        refs: {
            eMap: 'emap'
        }


    },

    initMap: function () {
        console.log('test')
        console.log(this.getMap())
    },
    launch: function () {
       // this.getEMap().down('draw').getSurface().scale(2/2)
    }

});
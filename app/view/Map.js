Ext.define('EM.view.Map', {
    extend: 'Ext.Panel',
    fullscreen: true,
    requires: [
        'Ext.draw.Component',
        'Ext.draw.sprite.Circle'
    ],
    xtype: 'emap',
    config: {

        scrollable: true,
        items: [
            {
                xtype: 'draw',
                width: 10000,
                height: 10000,
                items: [
                    {
                        type: 'circle',
                        cx: 100,
                        cy: 100,
                        r: 25,
                        fillStyle: 'blue'
                    },
                    {
                        type: 'text',
                        x: 20,
                        y: 20,
                        text: 'x=0',
                        fontSize: 18,
                        fillStyle: 'blue'
                    },
                    {
                        type: 'text',
                        x: 1020,
                        y: 20,
                        text: 'x=1000',
                        fontSize: 18,
                        fillStyle: 'blue'
                    }
                ]

            }


        ]

    }


});
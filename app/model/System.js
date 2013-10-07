Ext.define('EM.model.System', {
    extend: 'Ext.data.Model',
    config: {

        fields: [
            'UniqueID',
            {
                name: 'SX',
                type: 'float'
            },
            {
                name: 'SY',
                type: 'float'
            },
            {
                name: 'SZ',
                type: 'float'
            },
            'ObjName',
            'ObjType',
            'destination'
        ]
    }

});
Ext.define('EM.model.System',{
    extend:'Ext.data.Model',
    fields: [
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
         'ObjName'
     ]
});
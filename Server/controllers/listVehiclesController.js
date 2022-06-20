const sql = require('mssql')
const sqlConfig=require('../sqlConfig.js');

exports.listVehicles=function(req,res){
    sql.connect(sqlConfig).then(pool => {
        
        return pool.request()
            .execute('uspReadVehicles');
    }).then(result => {
        //console.log(result);
        return res.json(result);
    }).catch(err => {
        console.log(err);
    })
}
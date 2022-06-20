const sql = require('mssql')
const sqlConfig=require('../sqlConfig.js');

exports.takeUserVehicle=function(req,res){
    sql.connect(sqlConfig).then(pool => {
        id = req.body.id;
        
        return pool.request()
            .input('pID', sql.Int, id)
            .output('responseMessage', sql.VarChar(250))
            .execute('uspTakeVehicleUser');
    }).then(result => {
        console.log(result);
    }).catch(err => {
        console.log(err);
    })
}
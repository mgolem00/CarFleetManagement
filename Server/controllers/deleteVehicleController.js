const sql = require('mssql')
const sqlConfig=require('../sqlConfig.js');

exports.deleteVehicle=function(req,res){
    //console.log(req.body.username + req.body.password);
    sql.connect(sqlConfig).then(pool => {
        vehicleID = req.body.vehicleID;
        
        return pool.request()
            .input('pID', sql.Int, vehicleID)
            .output('responseMessage', sql.VarChar(250))
            .execute('uspDeleteVehicle');
    }).then(result => {
        console.log(result);
    }).catch(err => {
        console.log(err);
    })
}
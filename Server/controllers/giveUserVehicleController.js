const sql = require('mssql')
const sqlConfig=require('../sqlConfig.js');

exports.giveUserVehicle=function(req,res){
    sql.connect(sqlConfig).then(pool => {
        userID = req.body.userID;
        vehicleID = req.body.vehicleID;
        console.log(req.body);
        
        return pool.request()
            .input('pUserID', sql.Int, userID)
            .input('pVehicleID', sql.Int, vehicleID)
            .output('responseMessage', sql.VarChar(250))
            .execute('uspCreateVehicleUser');
    }).then(result => {
        console.log(result);
    }).catch(err => {
        console.log(err);
    })
}
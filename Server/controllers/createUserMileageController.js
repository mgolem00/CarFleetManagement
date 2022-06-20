const sql = require('mssql')
const sqlConfig=require('../sqlConfig.js');

exports.createUserMileage=function(req,res){
    sql.connect(sqlConfig).then(pool => {
        vehicleUserID = req.body.vehicleUserID;
        kilometersPassed = req.body.kilometersPassed;
        
        return pool.request()
            .input('pVehicleUserID', sql.Int, vehicleUserID)
            .input('pKilometersPassed', sql.Int, kilometersPassed)
            .output('responseMessage', sql.VarChar(250))
            .execute('uspCreateVehicleUserMileage');
    }).then(result => {
        console.log(result);
    }).catch(err => {
        console.log(err);
    })
}
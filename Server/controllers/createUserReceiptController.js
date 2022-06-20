const sql = require('mssql')
const sqlConfig=require('../sqlConfig.js');

exports.createUserReceipt=function(req,res){
    sql.connect(sqlConfig).then(pool => {
        vehicleUserID = req.body.vehicleUserID;
        typeOfCostID = req.body.typeOfCostID;
        cost = req.body.cost;
        costDescription = req.body.costDescription;
        
        return pool.request()
            .input('pVehicleUserID', sql.Int, vehicleUserID)
            .input('pTypeOfCostID', sql.Int, typeOfCostID)
            .input('pCost', sql.Int, cost)
            .input('pCostDescription', sql.NVarChar(50), costDescription)
            .output('responseMessage', sql.VarChar(250))
            .execute('uspCreateVehicleUserReceipt');
    }).then(result => {
        console.log(result);
    }).catch(err => {
        console.log(err);
    })
}
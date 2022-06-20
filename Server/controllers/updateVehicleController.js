const sql = require('mssql')
const sqlConfig=require('../sqlConfig.js');

exports.updateVehicle=function(req,res){
    //console.log(req.body.username + req.body.password);
    sql.connect(sqlConfig).then(pool => {
        vehicleID = req.body.vehicleID;
        manufacturer = req.body.manufacturer;
        model = req.body.model;
        color = req.body.color;
        yearManufactured = req.body.yearManufactured;
        fuelType = req.body.fuelType;
        transmissionType = req.body.transmissionType;
        
        return pool.request()
            .input('pID', sql.Int, vehicleID)
            .input('pManufacturer', sql.NVarChar(20), manufacturer)
            .input('pModel', sql.NVarChar(20), model)
            .input('pColor', sql.NVarChar(20), color)
            .input('pYearManufactured', sql.Int, yearManufactured)
            .input('pFuelType', sql.NVarChar(20), fuelType)
            .input('pTransmissionType', sql.NVarChar(20), transmissionType)
            .output('responseMessage', sql.VarChar(250))
            .execute('uspUpdateVehicle');
    }).then(result => {
        console.log(result);
    }).catch(err => {
        console.log(err);
    })
}
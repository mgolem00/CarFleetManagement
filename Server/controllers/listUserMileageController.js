const sql = require('mssql')
const sqlConfig=require('../sqlConfig.js');

exports.listUserMileage=function(req,res){
    sql.connect(sqlConfig).then(pool => {
        userID = req.query.userID;

        return pool.request()
            .input('pUserID', sql.Int, userID)
            .execute('uspReadUserMileage');
    }).then(result => {
        return res.json(result);
    }).catch(err => {
        console.log(err);
    })
}
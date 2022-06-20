const sql = require('mssql')
const sqlConfig=require('../sqlConfig.js');

exports.listUserReceipt=function(req,res){
    sql.connect(sqlConfig).then(pool => {
        userID = req.query.userID;

        return pool.request()
            .input('pUserID', sql.Int, userID)
            .execute('uspReadUserReceipt');
    }).then(result => {
        return res.json(result);
    }).catch(err => {
        console.log(err);
    })
}
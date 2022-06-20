const sql = require('mssql')
const sqlConfig=require('../sqlConfig.js');

exports.deleteUser=function(req,res){
    sql.connect(sqlConfig).then(pool => {
        userID = req.body.userID;
        
        return pool.request()
            .input('pID', sql.Int, userID)
            .output('responseMessage', sql.VarChar(250))
            .execute('uspDeleteUser');
    }).then(result => {
        console.log(result);
    }).catch(err => {
        console.log(err);
    })
}
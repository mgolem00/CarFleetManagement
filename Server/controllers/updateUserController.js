const sql = require('mssql')
const sqlConfig=require('../sqlConfig.js');

exports.updateUser=function(req,res){
    //console.log(req.body.username + req.body.password);
    sql.connect(sqlConfig).then(pool => {
        userID = req.body.userID;
        username = req.body.username;
        password = req.body.password;
        namesurname = req.body.namesurname;
        roleID = req.body.roleID;
        
        return pool.request()
            .input('pID', sql.Int, userID)
            .input('pUsername', sql.NVarChar(50), username)
            .input('pPassword', sql.NVarChar(50), password)
            .input('pNameSurname', sql.NVarChar(50), namesurname)
            .input('pRoleID', sql.Int, roleID)
            .output('responseMessage', sql.VarChar(250))
            .execute('uspUpdateUser');
    }).then(result => {
        console.log(result);
    }).catch(err => {
        console.log(err);
    })
}
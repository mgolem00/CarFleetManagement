const {signJwt} = require('../jwt');
const sql = require('mssql')
const sqlConfig=require('../sqlConfig.js');

exports.login=function(req,res){
    sql.connect(sqlConfig).then(pool => {
        username = req.body.username;
        password = req.body.password;
        
        return pool.request()
            .input('pUsername', sql.NVarChar(20), username)
            .input('pPassword', sql.NVarChar(50), password)
            .execute('uspLogin');
    }).then(result => {
        //console.log(result);
        //return res.json(result);
        //username: user.Username, nameSurname: user.NameSurname, roleID: user.FK_RoleID
        userInfo = {
            username: result.recordset[0].Username,
            nameSurname: result.recordset[0].NameSurname,
            id: result.recordset[0].ID,
            roleID: result.recordset[0].FK_RoleID
        }
        const token = signJwt(result.recordset[0].ID, result.recordset[0].FK_RoleID);
        return res.json({accessToken: token, user: userInfo});
    }).catch(err => {
        console.log(err);
    })
}
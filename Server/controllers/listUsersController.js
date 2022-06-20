const sql = require('mssql')
const sqlConfig=require('../sqlConfig.js');

exports.listUsers=function(req,res){
    sql.connect(sqlConfig).then(pool => {
        
        return pool.request()
            .execute('uspReadUsers');
    }).then(result => {
        return res.json(result);
    }).catch(err => {
        console.log(err);
    })
}
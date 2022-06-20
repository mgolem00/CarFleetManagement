const {getRole} = require('../jwt');

exports.getLoggedRole=function(req,res){
    return getRole(req,res);
}
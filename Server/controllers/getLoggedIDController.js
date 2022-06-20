const {getID} = require('../jwt');

exports.getLoggedID=function(req,res){
    return getID(req,res);
}
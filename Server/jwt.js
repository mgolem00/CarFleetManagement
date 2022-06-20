const jwt = require('jsonwebtoken');

function signJwt(userID, userRoleID) {
    const token = jwt.sign({id: userID, roleID: userRoleID}, process.env.SECRET);
    if (!token) return false;
    return token;
}

function verifyJwt(req, res, next) {
    const authorization = req.header('authorization');
    const token = authorization ? authorization.split('Bearer ')[1] : undefined;
    if(!token) {
        return res.status(401).send("Unauthorized");
    }
    jwt.verify(token, process.env.SECRET, (err, payload)=>{
        if (err || !payload.id) {
            return res.status(401).send("Unauthorized");
        }
        return next();
    })
}

function verifyAdmin(req, res, next) {
    const authorization = req.header('authorization');
    const token = authorization ? authorization.split('Bearer ')[1] : undefined;
    if(!token) {
        return res.status(401).send("Unauthorized");
    }
    jwt.verify(token, process.env.SECRET, (err, payload)=>{
        if (err || payload.roleID > 1) {
            return res.status(401).send("Unauthorized");
        }
        return next();
    })
}

function verifyManager(req, res, next) {
    const authorization = req.header('authorization');
    const token = authorization ? authorization.split('Bearer ')[1] : undefined;
    if(!token) {
        return res.status(401).send("Unauthorized");
    }
    jwt.verify(token, process.env.SECRET, (err, payload)=>{
        if (err || payload.roleID > 2) {
            return res.status(401).send("Unauthorized");
        }
        return next();
    })
}

function getRole(req, res) {
    const authorization = req.header('authorization');
    const token = authorization ? authorization.split('Bearer ')[1] : undefined;
    let roleID;
    if(!token) {
        return res.status(401).send("Unauthorized");
    }
    roleID = jwt.verify(token, process.env.SECRET, (err, payload)=>{
        if (err || !payload.roleID) {
            return res.status(401).send("Unauthorized");
        }
        return payload.roleID;
    })
    return roleID;
}

function getID(req, res) {
    const authorization = req.header('authorization');
    const token = authorization ? authorization.split('Bearer ')[1] : undefined;
    if(!token) {
        return res.status(401).send("Unauthorized");
    }
    jwt.verify(token, process.env.SECRET, (err, payload)=>{
        if (err || !payload.id) {
            return res.status(401).send("Unauthorized");
        }
        return payload.id;
    })
}

module.exports = {signJwt, verifyJwt, verifyAdmin, verifyManager, getRole, getID};
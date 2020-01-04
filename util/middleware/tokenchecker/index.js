var jwt = require('jsonwebtoken');

function tokenchecker(req, res, next) {
    let token = req.get('Authorization');
    if(token){
        try {
            req.decode_token = jwt.decode(token, req.app.get('jwtTokenSecret'));
            req.decode_token.token = token;
        }catch (e) {
            req.decode_token = {};
        }
    }
    next();
}

module.exports = tokenchecker;

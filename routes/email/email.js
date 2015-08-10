/**
 * Application email functionality.
 * Created by: tremainekb on 10/08/2015
 */
var sendgrid = require('sendgrid')(process.env.SENDGRID_USERNAME, process.env.SENDGRID_PASSWORD);
var common = require('../common/common');
/**
 * Sends email using SendGrid API based on the body of the
 * request.
 * @param req
 * @param res
 */
exports.sendEmail = function(req, res){
    if(common.isAuthenticated(req, res)){
        var email = new sendgrid.Email(req.body);
        sendgrid.send(email, function(err,json){
            if(err){
                console.log(err);
            }else{
                res.send(json);
            }
        });
    }
};
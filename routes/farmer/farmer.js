/**
 * This is intended to enable any logic/control for
 * any operations on a farmer.  All functions here
 * are used by endpoints in the farmer_routes.js
 * file and must ensure that appropriate validations
 * are done.
 *
 * Created by matjames007 on 4/28/15.
 */

var model = require('../../models/db');

/**
 * This is a generic helper function for MongoDB errors
 * that occur during searching/creating/updating a document.
 * @param err
 * @param res
 */
handleDBError = function(err, res) {
    if(err.name == "ValidationError") {
        res.status(400);
        res.send(err);
    } else if(err.name == "CastError") {
        res.status(400);
        res.send(err);
    } else {
        res.status(500);
        res.send(err);
    }
};

/**
 * Retrieves all farmers based on the criteria given in the
 * request parameters.
 *
 * TODO: Need to ensure that this uses the request params!
 *
 * @param req
 * @param res
 */
exports.getFarmers = function(req, res) {
    model.Farmer.find(req.params, function(err, list) {
        if(err) {
            handleDBError(err, res);
        } else {
            res.send(list);
        }
    })
};

/**
 * This function attempts to create the farmer based on the body of
 * the web service request.  MongoDB handles the validation of info.
 * @param req
 * @param res
 */
exports.createFarmer = function(req, res) {
    var farmer = new model.Farmer(req.body);
    farmer.save(function(err) {
        if(err) {
            handleDBError(err, res);
        } else {
            res.send(farmer);
        }
    })
};

/**
 * Attempts to retrieve document based on the document _id.
 * @param req
 * @param res
 */
exports.getFarmerById = function(req, res) {
    model.Farmer.findById(req.params.id, function(err, item) {
        if(err) {
            handleDBError(err, res);
        } else {
            if(item) {
                res.send(item);
            } else {
                res.status(404);
                res.send({error: "Not Found"});
            }
        }
    })
};

/**
 * Attempt to update/upsert farmer given an id in the req.params
 * @param req
 * @param res
 */
exports.updateFarmerById = function(req, res) {
    model.Farmer.update({_id: req.params.id}, req.body, function(err, response) {
        if(err) {
            handleDBError(err, res);
        } else {
            //check if any document got modified
            if(response.nModified != 0) {
                res.send(response);
            } else {
                res.status(404);
                res.send({error: "Not Found"});
            }
        }
    })
};

/**
 * Retrieves all farms based on a farmer's id.
 * @param req
 * @param res
 */
exports.getFarmsByFarmerId = function(req, res) {
    model.Farmer.findById(req.params.id, function(err, item) {
        if(err) {
            handleDBError(err, res);
        } else {
            if(item == null) {
                res.status(404);
                res.send("Farmer Not Found");
            } else {
                res.send(item.fr_farms);
            }
        }
    });
};

/**
 * Create a farm based on the farmer's ID.
 * @param req
 * @param res
 */
exports.createFarm = function(req, res) {
    var farm = new model.Farm(req.body);
    model.Farmer.findById(req.params.id, function(err, item) {
        if(err) {
            handleDBError(err, res);
        } else {
            if(item == null) {
                res.status(404);
                res.send("Farmer Not Found");
            } else {
                item.fr_farms.push(farm);
                item.save(function(err2, result) {
                    if(err2) {
                        handleDBError(err2, res);
                    } else {
                        res.send(result);
                    }
                });
            }
        }
    });
};

/**
 * Function really only requires the farm_id to be in the parameter
 * and does a query based on only this parameter.  The function
 * itself just searches based on the id for the farm then updates the
 * farm with the information in the request body.  Should be used for
 * PUT requests.
 *
 * @param req
 * @param res
 */
exports.updateFarmById = function(req, res) {
    model.Farm.update({_id: req.params.farm_id}, req.body, function(err, response) {
        if(err) {
            handleDBError(err, res);
        } else {
            //check if any document got modified
            if(response.nModified != 0) {
                res.send(response);
            } else {
                res.status(404);
                res.send({error: "Not Found"});
            }
        }
    });
};

/**
 * Allows for a comment to be created based on a given farmer.
 * Requires a id of the farmer to be passed as a parameter in
 * the request.
 *
 * @param req
 * @param res
 */
exports.createFarmerComment = function(req, res) {
    var comment = new model.Comment(req.body);
    model.Farmer.findById(req.params.id, function(err, item) {
        if(err) {
            handleDBError(err, res);
        } else if(item == null) {
            res.status(404);
            res.send({error: "Farmer Not Found"});
        } else {
            item.ct_comments.push(comment);
            item.save(function(err2, result) {
                if(err2) {
                    handleDBError(err2, res);
                } else {
                    res.send(result);
                }
            });
        }
    });
};

/**
 * Retrieves the comments on a particular farmer based on the id
 * submitted in the parameters inside the request.
 *
 * @param req
 * @param res
 */
exports.getCommentsForFarmer = function(req, res) {
    model.Farmer.findById(req.params.id, function(err, item) {
        if(err) {
            handleDBError(err, res);
        } else {
            if(item == null) {
                res.status(404);
                res.send("Farmer Not Found");
            } else {
                res.send(item.ct_comments);
            }
        }
    });
};

/**
 * Creates a new membership record and associates it with a
 * particular farmer.  The database should ensure validation.
 *
 *
 * @param req
 * @param res
 */
exports.createMembership = function(req, res) {
    var membership = new model.Membership(req.body);
    model.Farmer.findById(req.params.id, function(err, item) {
        if(err) {
            handleDBError(err, res);
        } else if(item == null) {
            res.status(404);
            res.send({error: "Farmer Not Found"});
        } else {
            item.ct_comments.push(membership);
            item.save(function(err2, result) {
                if(err2) {
                    handleDBError(err2, res);
                } else {
                    res.send(result);
                }
            });
        }
    });
};

/**
 * This function looks for a farmer's active membership record and
 * sends it.  If there is none then it returns an empty record.
 * This function requires the farmer's record _id to be sent in
 * req.params
 *
 * TODO: This is unchecked!  This should also be documented!
 *
 * @param req
 * @param res
 */
exports.getActiveMembership = function(req, res) {
    model.Farmer.findById(req.params.id, function(err, item) {
        if(err) {
            handleDBError(err, res);
        } else {
            item.mi_membership.find({mi_expiration: {"$gte": Date.now()},
                mi_start: {"$lte": Date.now()}}, function(err2, items) {
                if(items) {
                    /**
                     * There is a possibility that there are multiple
                     * items coming back because there can be more than
                     * one membership record created for one period of time.
                     *
                     * We therefore would required the record last created.
                     */
                    var max = new Date(0); //start this value at the minimum date
                    var v;
                    for(i in items) {
                        if(i.mi_date_updated > max) {
                            max = i.mi_date_updated;
                            v = i;
                        }
                    }
                    res.send(v);
                } else {
                    res.send({});
                }
            });
        }
    });
};

/**
 * Allows for updating of a membership record. Based on a Farmer ID and a
 * Membership ID.
 *
 * TODO: Test this function!!!!
 *
 * @param req
 * @param res
 */
exports.updateMembership = function(req, res) {
    model.Farmer.findById(req.params.id, function(err, item) {
        if(err) {
            handleDBError(err,res);
        } else {
            var member_record = item.mi_membership.id(req.params.member_id);
            //for each element in the request body modify
            //the record in the membership record.
            for(var key in req.body) {
                if(req.body.hasOwnProperty(key)) {
                    member_record[key] = req.body[key];
                }
            }
            item.save(function(err2,item2) {
                if(err2) {
                    handleDBError(err2, res);
                } else {
                    res.send(item2);
                }
            });
        }
    });
}
const express = require('express');
const router = express.Router();
const personnel = require('../../../models/personnel');
const personnelHealth = require('../../../models/personnelHealth');
const ObjectId = require('mongodb').ObjectId;
const AuthController = require('../../../contollers/AuthController');

router.post('/add',AuthController.verify_token,AuthController.is_authorized,function(req,res){
    if(!ObjectId.isValid(req.body.personnelID)) return res.status(403).json({message:"Invalid Personnel"});
    personnel.findOne({_id:ObjectId(req.body.personnelID)}).then(matchedPersonnel => {
        if(!matchedPersonnel) return res.status(403).json({message:"Unauthorized"});
        else {
            if(req.decoded.priority < 3 || req.decoded.company == matchedPersonnel.company){
                let newHealthRep = new personnelHealth({
                    personnel : matchedPersonnel._id,
                    dateOfEntry : req.body.dateOfEntry,
                    score : 10
                });
                req.body.parameters.forEach((param,i)=>{
                    if(!ObjectId.isValid(param.healthParameter)) return res.status(403).json({message:"Unauthorized"});
                    let currentParam = {};
                    currentParam.healthParameter = param.healthParameter;
                    if(typeof req.body.stage != 'undefined') currentParam.stage = req.body.stage;
                    if(typeof req.body.value != 'undefined') currentParam.value = req.body.value;
                    if(typeof req.body.presence != 'undefined') currentParam.presence = req.body.presence;                    
                    newHealthRep.parameters.push(currentParam);
                });
                newHealthRep.save((err,result) => {
                    if(err) return res.status(500).json({message:"Internal Server Error"});
                    matchedPersonnel.lastEntry = result._id;
                    if(typeof req.body.followUpRequired != 'undefined' && typeof req.body.followUpRequired == 'boolean') matchedPersonnel.followUpRequired = req.body.followUpRequired;
                    matchedPersonnel.save((err,_result) => {
                        if(err) return res.status(500).json({message:"Internal Server Error"});
                        return res.status(200).json({message:"Health Record Created"});
                    });
                });
            }
            else return res.status(403).json({message:"Unauthorized"});
        }
    }).catch(err => {return res.status(500).json({message:"Internal Server Error"});});
});

module.exports = router;
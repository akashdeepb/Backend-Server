const mongoose = require('mongoose');

const battalionSchema = new mongoose.Schema({
    battalionNumber : {
        type:Number,
        unique:true,
        required:true
    },
    companies:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Company'
    }]
});

module.exports = mongoose.model('Battalion',battalionSchema);
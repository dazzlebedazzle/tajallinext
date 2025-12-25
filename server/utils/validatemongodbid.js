const mongoose = require('mongoose');

function isValidObjectId(id) {
    const isValid =mongoose.Types.ObjectId.isValid(id);

    if(!isValid){
        throw new Error("id is not valid");
    }
}

module.exports ={ isValidObjectId};
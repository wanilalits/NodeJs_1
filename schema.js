const mongoose = require('mongoose');
let userSchema =new mongoose.Schema({
       // _id:mongoose.Schema.Types.ObjecyId,
name: { type: String, required: false },
email: { type: String, required: false },
address:{ type: String, required: false },
password:{ type: String, required: false },
Encryptedpassword:{ type: String, required: false },

    });
module.exports = mongoose.model('nodes',userSchema);
 
//module.exports =mongoose.model(<'Database Name with "S"'>,userSchema);
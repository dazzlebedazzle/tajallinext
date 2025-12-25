const mongoose = require('mongoose'); // Erase if already required


const emailSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true }
  });
  
//   const Email = mongoose.model('Email', emailSchema);

  

  module.exports=mongoose.model('Email', emailSchema);
  
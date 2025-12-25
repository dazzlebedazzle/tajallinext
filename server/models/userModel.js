  const mongoose = require('mongoose'); // Erase if already required
  const bcrypt = require('bcryptjs');
  const crypto=require('crypto');
  // Declare the Schema of the Mongo model

  var userSchema = new mongoose.Schema({
    firstname:{
          type:String,
          required:true,
        
      },
      lastname:{
          type:String,
          required:false,
      },
      email:{
          type:String,
          required:true,
          unique:true,
      },
      mobile:{
          type:String,
          required:true,
          unique:true,
      },
      password:{
          type:String,
          required:true,
          
      },
      referralCode: { 
        type: String, 
        unique: true },
        referralLink: { 
          type: String, 
          unique: true },
      referredBy: { 
        type: String, 
        default: null },
      discount: { 
        type: Number, 
        default: 0 },
      Isblocked:{
        type:Boolean,
        default:false,
      },
      role:{
        type:String,
        default:"user",
      },

      cart:[
        {
        
          productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
          title: { type: String, required: true },
          cartId:{type:String},
          image: { type: String,  },
          category: { type: String, required: true },
          weight: { type: Number, required: true },
          totalPrice: { type: Number, required: true },
          quantity: { type: Number, default: 1, required: true },
          slug: { type: String, required: true },
          
        }
      ],
      address:{ type:String},  
    wishlist:[{ type:mongoose.Schema.Types.ObjectId, ref:"Product" }],
    profileImage: { type: String,     
                 default:"https://res.cloudinary.com/dqa6jk5fx/image/upload/v1720350290/nw4boys1nujjhhcj9sgq.jpg",
                      }, 

    refreshToken:{
      type:String,
    },
    passwordChangedAt:Date,
    passwordResetToken:String,
    passwordResetExpires:Date,
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
    },
      {
    timestamps:true,
  }
  );
  //encoding password
  userSchema.pre("save", async function(next) {
      const user = this;
    
      if (user.isModified('password') || user.isNew) {
        try {
          // Generate a salt
          const salt = await bcrypt.genSalt(10);
          // Hash the password using the salt
          const hashedPassword = await bcrypt.hash(user.password, salt);
          // Set the hashed password on the user object
          user.password = hashedPassword;
        } catch (err) {
          return next(err);
        }
      }
      next();
    });
    
    // Method to compare input password with the stored hashed password
    userSchema.methods.comparePassword = async function(password) {
      return await bcrypt.compare(password, this.password);
    };
    
    userSchema.methods.createPasswordResetToken=async function (){
      const resettoken=crypto.randomBytes(32).toString('hex');
      console.log(resettoken);

      this.passwordResetToken=crypto.createHash('sha256').update(resettoken).digest('hex');
      console.log(this.passwordResetToken);
      this.passwordResetExpires=Date.now()+ 30*60*1000;
      return resettoken;
    }

  //Export the model
  module.exports = mongoose.model('User', userSchema);
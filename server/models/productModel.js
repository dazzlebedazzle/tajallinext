const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var ProductSchema = new mongoose.Schema({
    
    title: {
        type: String,
        required: true,
        trim: true,
    },
    slug: { type: String, 
            unique: true,
            required: true },
    category: {
        type: String,
       required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
    },
    // image: {
    //     type: String,
    //     required: true,
    //     default:"no image",
    // },   
    images: [
        {
            type: String,
           required: true,
        }
    ],
  weights: {
  type: [String],
  required: false,
  default: [],
},
aboutProduct: {
  type: [String],
  required: false,
  default: [],
},

    numberOfPurchases: {
        type: Number,
        default: 0, // Initialize with 0
    },
    details: {
        origin: {
            type: String,
            // required: true,
        },
        addedPreservatives: {
            type: String,
            // required: true,
        },
        // preservationType: {
        //     type: String,
        //     required: true,
        // },
        fssaiApproved: {
            type: String,
            required: true,
        },
        vegNonVeg: {
            type: String,
            // required: true,
            
        },
        storage: {
            type: String,
            // required: true,
        },
        allergen: {
            type: String,
            // required: true,
        },
        netQuantity: {
            type: String,   
            required: true,
        },
        productType: {
            type: String,
            // required: true,
        },
        
        height: {
            type: String,
            required: true,
        },
        length: {
            type: String,
            required: true,
        },
        width: {
            type: String,
            required: true,
        },
       
        ratings:[
            {
                star:Number,
                comment:String,
                postedby:{type:mongoose.Schema.Types.ObjectId,ref:"User" },
    
            }
            
        ], 
        totalRating:{
            type:String,
            default:0,
        }, 
       
        // productSpecifications: {
        //     productType: {
        //         type: String,
                //required: true,
        //     },
        //     dimensions: {
        //         height: {
        //             type: String,
        //             required: true,
        //         },
        //         length: {
        //             type: String,
        //             required: true,
        //         },
        //         width: {
        //             type: String,
        //             required: true,
        //         },
        //         netQuantity: {
        //             type: String,
        //             required: true,
        //         }
        //     }
        // }
    }
}, {
    timestamps: true,
});

// Export the model
module.exports = mongoose.model('Product', ProductSchema,'newproduct');
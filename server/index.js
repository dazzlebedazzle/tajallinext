const express= require("express");
const dbConnect = require("./config/db");
const app=express();
const env= require("dotenv");
env.config();
const PORT =process.env.PORT|| 5000;
const cookieparser=require("cookie-parser");
const cors = require('cors');

app.use(cookieparser());
const authRoute = require('./routes/authRoutes');
const productRoute=require('./routes/productroutes');
const couponRoute=require('./routes/couponRoutes')
const verifyRoutes = require('./routes/verifyRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const paymentRoute = require('./routes/paymentRoutes');
const orderRoutes = require('./routes/orderRoutes');
const shipmentRoutes = require('./routes/shipmentRoutes');
const offerRoutes = require('./routes/offerRoutes');
const emailRoutes= require('./routes/emailRoutes');
const adminRoutes= require('./routes/adminRoutes');
const bannerRoutes = require('./routes/bannerRoutes');

const bodyParser = require('body-parser');

const errorHandler = require("./middleware/errorhandler");
const prerenderMiddleware = require("./middleware/preRender");
const corsOptions = {
    origin: ['http://localhost:3000','http://tajalli.co.in', 'http://admin.tajalli.co.in','https://tajalli.co.in' ,'https://www.tajalli.co.in',  'https://tajalli.co.in', 'https://admin.tajalli.co.in','http://localhost:4001','http://localhost:5000',"http://72.60.202.5:4000","http://72.60.202.5:4000",],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
  };
app.use(cors(corsOptions));
app.use(prerenderMiddleware);

dbConnect();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))


app.use('/api/user',authRoute);
app.use('/api/coupon',couponRoute);
app.use('/api/product',productRoute);
app.use('/api/otp', verifyRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/payment',paymentRoute);
app.use('/api/order', orderRoutes);
app.use('/api/shipment',shipmentRoutes);
app.use('/api/offer',offerRoutes);
app.use('/api/email',emailRoutes);
app.use('/api/admin',adminRoutes);
app.use('/api/offer1',bannerRoutes);
//app.use('/api/blogs',require("./routes/blogRoutes"))
app.use(errorHandler); 

app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})

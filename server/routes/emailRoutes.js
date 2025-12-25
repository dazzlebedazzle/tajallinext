
const express=require('express');
const {authMiddleware,admin}=require("../middleware/authMiddleware");
const {emailCollection,getemails}=require('../controllers/adminCtrl');
const router=express.Router();
router.post('/submit-email',emailCollection);
router.get('/emails',authMiddleware,admin,getemails);

module.exports=router;
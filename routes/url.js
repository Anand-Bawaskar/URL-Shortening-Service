const express=require("express");
const {handlegenrateNewShortURL}=require('../controllers/url');

const router=express.Router();


router.post('/',handlegenrateNewShortURL);
module.exports=router;
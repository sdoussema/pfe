import express from 'express';
import { ProtectRoute } from '../middleware/ProtectRoute.js';
import {signup,login,logout,verifyEmail,forgetpassword,resetpassword,checkAuth }from '../controllers/auth.js';



const router = express.Router(); 



router.get('/check_auth',ProtectRoute,checkAuth);


router.post('/signup',  signup);
router.post('/login', login );
router.post('/logout', logout);


router.post('/verify-email', verifyEmail);
router.post('/forget-password', forgetpassword);
router.post('/reset-password/:token', resetpassword);




export default router;
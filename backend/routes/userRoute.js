import express from 'express';
import { registerUser, loginUser, getProfile, updateProfile, bookDocAppointment, listDocAppointment, cancelDocAppointment, paymentRazorpay, verifyRazorpay } from '../controllers/userController.js';
import authUser from '../middlewares/authUser.js';
import upload from '../middlewares/multer.js';

const userRouter = express.Router();

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)
userRouter.get("/get-profile", authUser, getProfile)
userRouter.post("/update-profile", upload.single('image'), authUser, updateProfile)
userRouter.post("/book-DocAppointment", authUser, bookDocAppointment)
userRouter.get("/DocAppointments", authUser, listDocAppointment)
userRouter.post("/cancel-DocAppointment", authUser, cancelDocAppointment)
userRouter.post("/payment-razorpay", authUser, paymentRazorpay)
userRouter.post("/verifyRazorpay", authUser, verifyRazorpay)


 




export default userRouter;
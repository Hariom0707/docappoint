import express from 'express'
import { addDoctor, adminDashboard, allDoctors, DocAppointmentCancel, DocAppointmentsAdmin, loginAdmin} from '../controllers/adminController.js'
import upload from '../middlewares/multer.js'
import authAdmin from '../middlewares/authAdmin.js';
import { changeAvailability } from '../controllers/doctorController.js';

const adminRouter = express.Router();

adminRouter.post("/login", loginAdmin)
adminRouter.post("/add-doctor", authAdmin, upload.single('image'), addDoctor)
adminRouter.get("/all-doctors", authAdmin, allDoctors)
adminRouter.post("/change-availability", authAdmin, changeAvailability)
adminRouter.get("/DocAppointments", authAdmin, DocAppointmentsAdmin)
adminRouter.post("/cancel-DocAppointment", authAdmin, DocAppointmentCancel)
adminRouter.get("/dashboard", authAdmin, adminDashboard)




export default adminRouter;

import express from 'express';
import { loginDoctor, DocAppointmentsDoctor, DocAppointmentCancel, doctorList,  DocAppointmentComplete, doctorDashboard, doctorProfile, updateDoctorProfile, changeAvailability } from '../controllers/doctorController.js';
import authDoctor from '../middlewares/authDoctor.js';
const doctorRouter = express.Router();

doctorRouter.post("/login", loginDoctor)
doctorRouter.post("/cancel-DocAppointment", authDoctor, DocAppointmentCancel)
doctorRouter.get("/DocAppointments", authDoctor, DocAppointmentsDoctor)
doctorRouter.get("/list", doctorList)
doctorRouter.post("/change-availability", authDoctor, changeAvailability)
doctorRouter.post("/complete-DocAppointment", authDoctor, DocAppointmentComplete)
doctorRouter.get("/dashboard", authDoctor, doctorDashboard)
doctorRouter.get("/profile", authDoctor, doctorProfile)
doctorRouter.post("/update-profile", authDoctor, updateDoctorProfile)

export default doctorRouter;
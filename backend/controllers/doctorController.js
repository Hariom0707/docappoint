import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import doctorModel from "../models/doctorModel.js";
import DocAppointmentModel from "../models/DocAppointmentModel.js";

// Doctor login
const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await doctorModel.findOne({ email });

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get doctor's DocAppointments
const DocAppointmentsDoctor = async (req, res) => {
  try {
    const docId = req.user.id;
    const DocAppointments = await DocAppointmentModel.find({ docId });
    res.json({ success: true, DocAppointments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cancel DocAppointment
const DocAppointmentCancel = async (req, res) => {
  try {
    const docId = req.user.id;
    const { DocAppointmentId } = req.body;

    const DocAppointment = await DocAppointmentModel.findById(DocAppointmentId);
    if (!DocAppointment || DocAppointment.docId.toString() !== docId) {
      return res.status(403).json({ success: false, message: "Invalid doctor or DocAppointment" });
    }

    await DocAppointmentModel.findByIdAndUpdate(DocAppointmentId, { cancelled: true });
    res.json({ success: true, message: "DocAppointment Cancelled" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Complete DocAppointment
const DocAppointmentComplete = async (req, res) => {
  try {
    const docId = req.user.id;
    const { DocAppointmentId } = req.body;

    const DocAppointment = await DocAppointmentModel.findById(DocAppointmentId);
    if (!DocAppointment || DocAppointment.docId.toString() !== docId) {
      return res.status(403).json({ success: false, message: "Invalid doctor or DocAppointment" });
    }

    await DocAppointmentModel.findByIdAndUpdate(DocAppointmentId, { isCompleted: true });
    res.json({ success: true, message: "DocAppointment Completed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all doctors (for frontend list)
const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password -email");
    res.json({ success: true, doctors });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Toggle doctor's availability
  const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;

    if (!docId) {
      return res.status(400).json({ success: false, message: "Doctor ID missing" });
    }

    const doctor = await doctorModel.findById(docId);

    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    doctor.available = !doctor.available;
    await doctor.save();

    res.json({ success: true, message: "Availability changed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// Get doctor's profile
const doctorProfile = async (req, res) => {
  try {
    const docId = req.user.id;
    const profile = await doctorModel.findById(docId).select("-password");
    res.json({ success: true, profileData: profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update doctor's profile
const updateDoctorProfile = async (req, res) => {
  try {
    const docId = req.user.id;
    const { fees, address, available, about } = req.body; // ✅ include `about`

    await doctorModel.findByIdAndUpdate(docId, {
      fees,
      address,
      available,
      about, // ✅ update `about`
    });

    res.json({ success: true, message: "Profile Updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// Get dashboard data
const doctorDashboard = async (req, res) => {
  try {
    const docId = req.user.id;
    const DocAppointments = await DocAppointmentModel.find({ docId });

    let earnings = 0;
    const patientSet = new Set();

    DocAppointments.forEach((a) => {
      if (a.isCompleted || a.payment) earnings += a.amount;
      patientSet.add(a.userId.toString());
    });

    const dashData = {
      earnings,
      DocAppointments: DocAppointments.length,
      patients: patientSet.size,
      latestDocAppointments: DocAppointments.reverse().slice(0, 5),
    };

    res.json({ success: true, dashData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  loginDoctor,
  DocAppointmentsDoctor,
  DocAppointmentCancel,
  DocAppointmentComplete,
  doctorList,
  changeAvailability,
  doctorProfile,
  updateDoctorProfile,
  doctorDashboard,
};

const express = require("express");
const {
  validationRequest,
  getAllDocument,
  getSupervisors,
  commentOnValidation,
  getRequest,
  getDocument,
  commentOnDocument,
  profile,
  createAppointment,
  getAppointments,
  editAppointment,
  deleteAppointment,
  getResearchers,
  getResearcher,
  addProgressAndComments,
  getAllProgress,
  getSingleProgress
} = require("../controllers/supervisorController");
const setSeason = require("../middlewares/seasonValidate");
const { auth, authorize } = require("../middlewares/auth");
const { route } = require("./researcherRoute");
const { getProgress } = require("../controllers/researcherController");

const router = express.Router();

// Supervisor Routes
router.post("/", getSupervisors);

// Get Profile
router.get('/', auth, profile)

// Validation Request Routes

//  Get All Validation request
router.get("/validation-requests", auth, setSeason, validationRequest);

// Get A Validation request
router.get("/validation-requests/:id", auth, getRequest);

// Comment on a validation request
router.put(
  "/validation-requests/comment/:id",
  auth,
  authorize("Supervisor"),
  commentOnValidation
);

// Document Routes

// Get All Documents
router.get(
  "/documents",
  auth,
  authorize("Supervisor"),
  setSeason,
  getAllDocument
);

// Get A document
router.get("/documents/:id", auth, getDocument);

// Comment on A Document
router.put(
  "/documents/comment/:id",
  auth,
  authorize("Supervisor"),
  commentOnDocument
);

// Get All Researchers
router.get('/get-researchers', auth, setSeason, getResearchers);

// Get A Researcher
router.get('/get-researchers/:id', auth, setSeason, getResearcher);

// Appointment CRUD
router.post('/create-appointment', auth, authorize('Supervisor'), createAppointment);
router.get('/appointments', auth, authorize('Supervisor'), getAppointments);
router.put('/update-appointment', auth, authorize('Supervisor'), editAppointment);
router.delete('/delete-appointment', auth, authorize('Supervisor'), deleteAppointment);

// Progress and Comments CRUD
router.post('/add-progress', auth, authorize('Supervisor'), addProgressAndComments);
router.get('/get-all-progress', auth, getAllProgress);
router.get('/get-progress/:id', auth, getSingleProgress);

module.exports = router;

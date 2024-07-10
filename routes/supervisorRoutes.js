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
} = require("../controllers/supervisorController");
const setSeason = require("../middlewares/seasonValidate");
const { auth, authorize } = require("../middlewares/auth");

const router = express.Router();

// Supervisor Routes
router.post("/", getSupervisors);

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

// Get Profile
router.get('/', auth, profile)

module.exports = router;

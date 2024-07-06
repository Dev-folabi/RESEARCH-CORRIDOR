const express = require("express");
const {
  validationRequest,
  getAllDocument,
  getSupervisors,
  commentOnValidation,
  getRequest,
  getDocument,
  commentOnDocument,
} = require("../controllers/supervisorController");
const setSeason = require("../middlewares/seasonValidate");
const { auth, authorize } = require("../middlewares/auth");

const router = express.Router();

// Supervisor Routes
router.post("/supervisors", getSupervisors);

// Validation Request Routes
router.get("/validation-requests", auth, setSeason, validationRequest);
router.get("/validation-requests/:id", auth, getRequest);
router.put(
  "/validation-requests/comment",
  auth,
  authorize("Supervisor"),
  commentOnValidation
);

// Document Routes
router.get(
  "/documents",
  auth,
  authorize("Supervisor"),
  setSeason,
  getAllDocument
);
router.get("/documents/:id", auth, getDocument);
router.put(
  "/documents/comment",
  auth,
  authorize("Supervisor"),
  commentOnDocument
);

module.exports = router;

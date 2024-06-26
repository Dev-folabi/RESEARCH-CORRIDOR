const express = require('express')
const {  validationRequest, getAllDocument, getSupervisors, commentOnValidation, getRequest, getDocument, commentOnDocument  } = require('../controllers/supervisorController')
const setSeason = require("../middlewares/seasonValidate");
const { auth, authorize } = require('../middlewares/auth');
const router = express.Router()

// Get Supervisors
router.post('/', getSupervisors)

// Get All Validation Request
router.get("/validation-request", auth, setSeason, validationRequest);

// Get  A Validation Request
router.get("/validation-request/:id", auth, getRequest);

// Comment on Validation
router.put("/comment-on-validation", auth, authorize('Supervisor'), commentOnValidation);

// Get All Reseachers documents
router.get("/get-document", auth, authorize('Supervisor'), setSeason, getAllDocument);

// Get  A Reseacher document
router.get("/get-document/:id",auth,  getDocument);

// Comment on Document
router.put("/comment-on-document", auth, authorize('Supervisor'), commentOnDocument);


module.exports = router

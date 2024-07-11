const multer = require('multer');
const path = require('path');

// Storage Configuration
const storage = (folder) => multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, folder);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// File Filter
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|pdf|doc|docx|xls|xlsx/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: File type not supported');
  }
};

// Upload Middleware
const upload = (folder) => multer({
  storage: storage(folder),
  limits: { fileSize: 1024 * 1024 * 10 }, // 10MB limit
  fileFilter
});

module.exports = {
  uploadValidateDocument: upload('validateDocuments'),
  uploadResearchDocument: upload('researchDocuments')
};

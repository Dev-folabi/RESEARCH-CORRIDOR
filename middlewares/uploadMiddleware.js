const fs = require('fs');
const path = require('path');

// Directory Middleware
const createDirectory = (folderName) => (req, res, next) => {
  const uploadDir = path.join(__dirname, '..', folderName);

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  next();
};

module.exports = {
  validationDirectory: createDirectory('validateDocuments'),
  researchDirectory: createDirectory('researchDocuments')
};

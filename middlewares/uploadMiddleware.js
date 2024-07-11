const fs = require('fs');
const path = require('path');

// Topic validation Documents Directory middleware
const validationDirectory = (req, res, next) => {
    const uploadDir = path.join(__dirname, '..', 'validateDocuments');
    
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    next();
};

// Research Documents Directory middleware
const researchDirectory = (req, res, next) => {
    const uploadDir = path.join(__dirname, '..', 'researchDocuments');
    
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }const fs = require('fs');
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
    
    
    next();
};

//researchDocuments
module.exports = {validationDirectory, researchDirectory};

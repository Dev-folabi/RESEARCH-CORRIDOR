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
    }
    
    next();
};

//researchDocuments
module.exports = {validationDirectory, researchDirectory};

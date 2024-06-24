const express = require('express');
const router = express.Router();
const {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment
} = require('../controllers/departmentController');

// Create a new department
router.post('/', createDepartment);

// Get all departments
router.get('/', getDepartments);

// Get a single department by ID
router.get('/:id', getDepartmentById);

// Update a department by ID
router.put('/:id', updateDepartment);

// Delete a department by ID
router.delete('/:id', deleteDepartment);

module.exports = router;

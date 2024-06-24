const Department = require('../models/departmentModel');

// Create a new department
exports.createDepartment = async (req, res) => {
  const { department } = req.body;

  try {
    let existingDepartment = await Department.findOne({ department });
    if (existingDepartment) {
      return res.status(400).json({ msg: 'Department already exists' });
    }

    const newDepartment = new Department({ department });
    await newDepartment.save();

    res.status(201).json({ msg: 'Department created successfully', department: newDepartment });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Get all departments
exports.getDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    res.status(200).json(departments);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Get a single department by ID
exports.getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ msg: 'Department not found' });
    }

    res.status(200).json(department);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Update a department by ID
exports.updateDepartment = async (req, res) => {
  const { department } = req.body;

  try {
    const updatedDepartment = await Department.findByIdAndUpdate(
      req.params.id,
      { department },
      { new: true, runValidators: true }
    );

    if (!updatedDepartment) {
      return res.status(404).json({ msg: 'Department not found' });
    }

    res.status(200).json({ msg: 'Department updated successfully', department: updatedDepartment });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Delete a department by ID
exports.deleteDepartment = async (req, res) => {
  try {
    const deletedDepartment = await Department.findByIdAndDelete(req.params.id);

    if (!deletedDepartment) {
      return res.status(404).json({ msg: 'Department not found' });
    }

    res.status(200).json({ msg: 'Department deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

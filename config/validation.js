const Joi = require('joi');

const supervisorSignupSchema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('Supervisor'),
    prefix: Joi.string().optional(),
    gender: Joi.string().valid('Male', 'Female', 'other').required(),
    department: Joi.string().min(2).required(),
    phone: Joi.string().pattern(/^[0-9]{10,15}$/).optional()
});

const researcherSignupSchema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('Researcher'),
    gender: Joi.string().valid('Male', 'Female', 'other').required(),
    department: Joi.string().min(2).required(),
    matric: Joi.string().min(5).max(20).required(),
    phone: Joi.string().pattern(/^[0-9]{10,15}$/).optional(),
    topic: Joi.string().optional(),
    season: Joi.string().required(),
    supervisor: Joi.string().optional()
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

const researcherLoginSchema = Joi.object({
    emailOrMatric: Joi.string().required(),
    password: Joi.string().required()
});

const updateSupervisorSchema = Joi.object({
    name: Joi.string().min(3).optional(),
    email: Joi.string().email().optional(),
    role: Joi.string().valid('Supervisor').optional(),
    prefix: Joi.string().optional(),
    gender: Joi.string().valid('Male', 'Female', 'other').optional(),
    department: Joi.string().min(2).optional(),
    phone: Joi.string().pattern(/^[0-9]{10,15}$/).optional()
});

const updateResearcherSchema = Joi.object({
    name: Joi.string().min(3).optional(),
    email: Joi.string().email().optional(),
    role: Joi.string().valid('Researcher').optional(),
    gender: Joi.string().valid('Male', 'Female', 'other').optional(),
    department: Joi.string().min(2).optional(),
    matric: Joi.string().min(5).max(20).optional(),
    phone: Joi.string().pattern(/^[0-9]{10,15}$/).optional(),
    topic: Joi.string().optional(),
    season: Joi.string().optional(),
    supervisor: Joi.string().optional()
});

const gradeSchema = Joi.object({
    introduction : Joi.number().max(15).required(),
    reviewLit : Joi.number().max(15).required(),
    researchMethod : Joi.number().max(15).required(), 
    dataAnalysis : Joi.number().max(20).required(), 
    discussion : Joi.number().max(10).required(), 
    language : Joi.number().max(10).required(), 
    reference : Joi.number().max(10).required(), 
    formart : Joi.number().max(5).required(), 
    generalComment : Joi.string().required(), 
    evaluator : Joi.string().required()
});

module.exports = {
    supervisorSignupSchema,
    researcherSignupSchema,
    loginSchema,
    researcherLoginSchema,
    updateSupervisorSchema,
    updateResearcherSchema,
    gradeSchema
};

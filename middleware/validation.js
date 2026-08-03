const { body, validationResult } = require("express-validator");

const validateAppointment = [

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 2, max: 50 })
        .withMessage("Name must be between 2 and 50 characters")
        .matches(/^[A-Za-z\s]+$/)
        .withMessage("Name can only contain letters and spaces"),

    body("phone")
        .trim()
        .matches(/^[6-9]\d{9}$/)
        .withMessage("Enter a valid 10-digit Indian phone number"),

    body("service")
        .trim()
        .notEmpty()
        .withMessage("Service is required"),

    body("date")
        .optional({ checkFalsy: true })
        .isISO8601()
        .withMessage("Invalid date"),

    body("time")
        .optional({ checkFalsy: true })
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .withMessage("Invalid time"),

    body("msg")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Message cannot exceed 500 characters"),

    (req, res, next) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        next();
    }

];

module.exports = {
    validateAppointment
};
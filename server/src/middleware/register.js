import { body, validationResult } from "express-validator";

export const registerValidationRules = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isAlphanumeric()
    .withMessage("Username must be alphanumeric"),
  body("password").notEmpty().withMessage("Password is required"),
  body("fname").trim().notEmpty().withMessage("First name is required"),
  body("lname").trim().notEmpty().withMessage("Last name is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }
    next();
  },
];

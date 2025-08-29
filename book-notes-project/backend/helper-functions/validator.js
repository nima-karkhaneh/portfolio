// validator-middleware/validator.js
import { body, param } from "express-validator";
import isbn from "isbn-utils";

// Validation for creating a new book (POST /submit)
export const validateCreateBook = [
    body("title").trim().notEmpty().withMessage("Title is required."),
    body("author").trim().notEmpty().withMessage("Author is required."),
    body("isbn").custom(value => {
        if (isbn.parse(value)) return true;
        throw new Error("Invalid ISBN format.");
    }),
    body("review")
        .trim()
        .notEmpty()
        .withMessage("Review must not be empty.")
        .isLength({ max: 1000 })
        .withMessage("Review must be under 1000 characters."),
    body("rate")
        .isInt({ min: 1, max: 5 })
        .withMessage("Rating is required. It must be between 1 and 5."),
    body("reader_name")
        .trim()
        .notEmpty()
        .withMessage("Reader's name is required."),
    body("date")
        .isISO8601()
        .withMessage("Invalid date format"),
];

// Validation for updating a book (PATCH /books/:id)
export const validateUpdateBook = [
    param("id").isInt({ min: 1 }).withMessage("Invalid book ID."),
    body("date")
        .isISO8601()
        .withMessage("Invalid date format"),
    body("review")
        .trim()
        .notEmpty()
        .withMessage("Review must not be empty.")
        .isLength({ max: 1000 })
        .withMessage("Review must be under 1000 characters."),
    body("rate")
        .isInt({ min: 1, max: 5 })
        .withMessage("Rating is required. It must be between 1 and 5."),
];

// Validation for deleting a book (DELETE /books/:id)
export const validateGetAndDeleteBook = [
    param("id").isInt({ min: 1 }).withMessage("Invalid book ID."),
];

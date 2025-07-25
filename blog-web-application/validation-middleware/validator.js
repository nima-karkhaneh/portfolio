import { body } from "express-validator";

const validator = [
    body("author").trim().notEmpty().withMessage("Author is required.").isLength({ min: 2 }).withMessage("Author must be at least two characters."),
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("text").trim().notEmpty().withMessage("Text is required.")
    ]

export default validator;
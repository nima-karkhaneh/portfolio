import { body, param } from "express-validator";

export const postValidator = [
    body("author").trim().notEmpty().withMessage("Author is required.").isLength({ min: 2 }).withMessage("Author must be at least two characters."),
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("text").trim().notEmpty().withMessage("Text is required.")
    ]

export const postIDValidator = [
    param("postID").trim().isInt({ gt: 0 }).withMessage("Invalid Post ID. Must be a positive number.")
]
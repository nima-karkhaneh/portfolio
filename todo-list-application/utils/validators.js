// utils/validators.js

export function validateDescription(description) {
    if (typeof description !== "string") {
        return { error: "Invalid todo, please try a plain text." };
    }

    const trimmed = description.trim().replace(/\s+/g, " ");

    if (trimmed === "") {
        return { error: "Description cannot be empty." };
    }

    if (trimmed.length > 255) {
        return { error: "Description too long (max 255 characters)." };
    }

    return { cleaned: trimmed };
}

export function validateId(id) {
    if (!/^\d+$/.test(id)) {
        return { error: "Invalid ID format. Must be a positive number." };
    }

    return { cleaned: parseInt(id, 10) };
}

export function validateSignupInput(email, password) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (typeof email !== "string" || !email.trim() || email.includes(" ")) {
        return { error: "Email cannot be empty or contain spaces." };
    }

    if (!emailRegex.test(email.trim())) {
        return { error: "Please enter a valid email address." };
    }

    if (typeof password !== "string" || password.trim().length < 6) {
        return { error: "Password must be at least 6 characters long." };
    }

    return {
        cleaned: {
            email: email.trim(),
            password: password.trim(),
        }
    };
}

export function validateLoginInput(email, password) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (typeof email !== "string" || !email.trim() || email.includes(" ")) {
        return { error: "Email cannot be empty or contain spaces." };
    }

    if (!emailRegex.test(email.trim())) {
        return { error: "Please enter a valid email address." };
    }

    if (typeof password !== "string" || password.trim() === "") {
        return { error: "Password cannot be empty." };
    }

    return {
        cleaned: {
            email: email.trim(),
            password: password.trim(),
        }
    };
}

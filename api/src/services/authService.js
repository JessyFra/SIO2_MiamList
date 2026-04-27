const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, Product, Recipe, ShoppingList, ListItem } = require("../models");

exports.register = async (email, password, role = "USER") => {
    const existing = await User.findOne({
        where: { email },
    });

    if (existing) {
        const error = new Error("Email already used");
        error.code = "EMAIL_ALREADY_USED";

        throw error;
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed, role });

    return { id: user.id, email: user.email, role: user.role };
};

exports.login = async (email, password) => {
    const user = await User.findOne({
        where: { email },
    });

    if (!user) {
        const error = new Error("Invalid credentials");
        error.code = "INVALID_CREDENTIALS";

        throw error;
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
        const error = new Error("Invalid credentials");
        error.code = "INVALID_CREDENTIALS";

        throw error;
    }

    const token = jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN },
    );

    return {
        access_token: token,
        token_type: "Bearer",
        expires_in: process.env.JWT_EXPIRES_IN,
    };
};

exports.myself = async (email) => {
    const user = await User.findOne({
        where: { email },
        include: [
            {
                model: Product
            },
            {
                model: Recipe, as: "Recipes",
                include: [
                    {
                        model: Product
                    }
                ]
            },
            {
                model: ShoppingList
            }
        ]
    });

    if (!user) {
        const error = new Error("Identifiants invalides");
        error.code = "INVALID_CREDENTIALS";

        throw error;
    }

    return user;
};

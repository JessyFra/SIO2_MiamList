const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const authService = require("../services/authService");

exports.register = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({ error: "Parameters 'email' and 'password' required" });
        }

        const user = await authService.register(email, password);
        return res.status(201).json(user);
    } catch (error) {
        if (error.code === "EMAIL_ALREADY_USED") {
            return res.status(409).json({ error: error.message });
        } else {
            return res.status(500).json({ error: error.message });
        }
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res
                .status(400)
                .json({ error: "Parameters 'email' and 'password' required" });
        }
        const tokenData = await authService.login(email, password);
        return res.json(tokenData);
    } catch (error) {
        if (error.code === "INVALID_CREDENTIALS") {
            return res.status(401).json({ error: error.message });
        } else {
            return res.status(500).json({ error: error.message });
        }
    }
};

exports.myself = async (req, res, _) => {
    try {
        const userData = await authService.myself(req.user.email);

        return res.json(userData);
    } catch (error) {
        if (error.code === 'INVALID_CREDENTIALS') {
            return res.status(401).json({ error: error.message });
        } else {
            return res.status(500).json({ error: error.message });
        }
    }
};

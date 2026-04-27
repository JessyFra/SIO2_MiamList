const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

exports.register = async (req, res) => {
    // TODO (issue #05)
    res.status(501).json({ message: "Not implemented" });
};

exports.login = async (req, res) => {
    // TODO (issue #05)
    res.status(501).json({ message: "Not implemented" });
};

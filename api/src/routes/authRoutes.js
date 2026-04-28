const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Authentification
 *   description: Gestion de l'authentification
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Inscription d'un utilisateur
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: user
 *     responses:
 *       201:
 *         description: Utilisateur inscrit avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Mauvaise requête
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Parameters 'email' and 'password' required
 *       409:
 *         description: Conflit
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Email already used
 */
router.post("/register", authController.register);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Connexion d'un utilisateur
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: user
 *     responses:
 *       200:
 *         description: Utilisateur connecté avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 access_token:
 *                   type: string
 *                   example: MThZh4...
 *                 token_type:
 *                   type: string
 *                   example: Bearer
 *                 expires_in:
 *                   type: string
 *                   example: 1h
 *       400:
 *         description: Mauvaise requête
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Parameters 'email' and 'password' required
 *       401:
 *         description: Identifiants invalides
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid credentials
 */
router.post("/login", authController.login);

/**
 * @swagger
 * /me:
 *   get:
 *     summary: Récupération de son utilisateur
 *     tags: [Authentification]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Utilisateur récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.get('/me', authMiddleware, authController.myself);

module.exports = router;

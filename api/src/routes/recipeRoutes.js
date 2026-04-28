const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const recipeController = require("../controllers/recipeController");

/**
 * @swagger
 * /recipes:
 *   get:
 *     summary: Récupérer toutes les recettes
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des recettes
 */
router.get("/recipes", auth, recipeController.getAll);

/**
 * @swagger
 * /recipes/{id}:
 *   get:
 *     summary: Récupérer une recette par ID
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: La recette
 *       404:
 *         description: Recette introuvable
 */
router.get("/recipes/:id", auth, recipeController.getOne);

/**
 * @swagger
 * /recipes:
 *   post:
 *     summary: Créer une recette
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Gâteau à la fraise"
 *               description:
 *                 type: string
 *                 example: "Gâteau d'anniversaire"
 *     responses:
 *       201:
 *         description: Recette créée
 */
router.post("/recipes/", auth, recipeController.create);

/**
 * @swagger
 * /recipes/{id}:
 *   put:
 *     summary: Modifier une recette
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Recipe'
 *     responses:
 *       200:
 *         description: Succès
 */
router.put("/recipes/:id", auth, recipeController.update);

/**
 * @swagger
 * /recipes/{id}:
 *   delete:
 *     summary: Supprimer une recette
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Supprimé
 */
router.delete("/recipes/:id", auth, recipeController.remove);

module.exports = router;
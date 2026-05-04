const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const recipeController = require("../controllers/recipeController");

/**
 * @swagger
 * tags:
 *   name: Recette
 *   description: Gestion des recettes
 */

/**
 * @swagger
 * /recipes:
 *   get:
 *     summary: Récupérer toutes les recettes de l'Utilisateur
 *     tags: [Recette]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recettes récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Recipe'
 */
router.get("/recipes", auth, recipeController.getAll);

/**
 * @swagger
 * /recipes/{id}:
 *   get:
 *     summary: Récupérer une recette par ID
 *     tags: [Recette]
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
 *         description: Recette récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 *       403:
 *         description: Erreur d'appartenance
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: An user can only see his own recipes
 *       404:
 *         description: Non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Recipe not found
 */
router.get("/recipes/:id", auth, recipeController.getOne);

/**
 * @swagger
 * /recipes:
 *   post:
 *     summary: Créer une recette
 *     tags: [Recette]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Gâteau à la fraise"
 *               description:
 *                 type: string
 *                 example: "Gâteau d'anniversaire"
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     quantity:
 *                       type: number
 *                       example: 2.5
 *                     checked:
 *                       type: integer
 *                       example: 1
 *                     productId:
 *                       type: integer
 *                       example: 1
 *     responses:
 *       201:
 *         description: Recette créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 recipe:
 *                   $ref: '#/components/schemas/Recipe'
 *                 products:
 *                     type: integer
 *                     example: 1
 *       400:
 *         description: Mauvaise requête
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             examples:
 *               recipeBadRequest:
 *                 summary: Manque de paramètre dans la recette
 *                 value:
 *                   error: Parameters 'name' is required
 *               recipeProductBadRequest:
 *                 summary: Manque de paramètre dans la liste des products
 *                 value:
 *                   error: Element of parameter 'products' require 'quantity', 'checked' and 'productId'
 *       403:
 *         description: Erreur d'appartenance
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: An user can only use his own products
 *       404:
 *         description: Non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Product not found
 */
router.post("/recipes/", auth, recipeController.create);

/**
 * @swagger
 * /recipes/{id}:
 *   put:
 *     summary: Modifier une recette
 *     tags: [Recette]
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
 *             required:
 *              - name
 *              - description
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Gâteau au chocolat"
 *               description:
 *                 type: string
 *                 example: "Gâteau d'anniversaire"
 *     responses:
 *       200:
 *         description: Recette modifiée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 *       400:
 *         description: Mauvaise requête
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Parameters 'name' and 'description' are required
 *       403:
 *         description: Erreur d'appartenance
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: An user can only update his own recipes
 *       404:
 *         description: Non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Recipe not found
 */
router.put("/recipes/:id", auth, recipeController.update);

/**
 * @swagger
 * /recipes/{id}:
 *   delete:
 *     summary: Supprimer une recette
 *     tags: [Recette]
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
 *         description: Recette supprimée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 *       403:
 *         description: Erreur d'appartenance
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: An user can only delete his own recipes
 *       404:
 *         description: Non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Recipe not found
 */
router.delete("/recipes/:id", auth, recipeController.remove);

module.exports = router;

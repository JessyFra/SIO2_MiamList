const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const recipeProductController = require("../controllers/recipeProductController");

/**
 * @swagger
 * /recipe/{id}/recipe-product:
 *   get:
 *     summary: Récupération des produits d'une recette
 *     tags: [Produit de recette]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           required: true
 *           description: Id de la recette
 *     responses:
 *       200:
 *         description: Tous les produits de la recette récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RecipeProductFull'
 */
router.get(
    "/recipe/:id/recipe-product",
    authMiddleware,
    recipeProductController.getByRecipeId,
);

/**
 * @swagger
 * /recipe/{id}/recipe-product:
 *   post:
 *     summary: Ajouter un produit à une recette
 *     tags: [Produit de recette]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           required: true
 *           description: Id de la recette
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - recipeId
 *               - productId
 *             properties:
 *               quantity:
 *                 type: number
 *                 example: 1.5
 *               recipeId:
 *                 type: integer
 *                 example: 1
 *               productId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Quantité du produit modifié de la recette avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RecipeProductMinimal'
 *       201:
 *         description: Produit ajouté à la recette avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RecipeProductMinimal'
 *       400:
 *         description: Mauvaise requête
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Parameters 'recipeId' and 'productId' required
 *       404:
 *         description: Non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             examples:
 *               recipeNotFound:
 *                 summary: Référence à une recette inexistante
 *                 value:
 *                   error: Recipe not found
 *               productNotFound:
 *                 summary: Référence à un produit inexistant
 *                 value:
 *                   error: Product not found
 *       403:
 *         description: Erreur d'appartenance
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: An user can only modify his own recipe
 */
router.post(
    "/recipe/:id/recipe-product",
    authMiddleware,
    recipeProductController.create,
);

/**
 * @swagger
 * /recipe-product/{id}:
 *   patch:
 *     summary: Modifier un produit d'une recette
 *     tags: [Produit de recette]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           required: true
 *           description: Id de la recette
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: number
 *                 example: 1.5
 *     responses:
 *       200:
 *         description: Quantité du produit modifié de la recette avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RecipeProductMinimal'
 *       404:
 *         description: Non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Recipe-Product not found
 *       400:
 *         description: Mauvaise requête
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Parameters 'quantity' required
 *       403:
 *         description: Erreur d'appartenance
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: An user can only modify his own recipe
 */
router.patch(
    "/recipe-product/:id",
    authMiddleware,
    recipeProductController.patchQuantity,
);

/**
 * @swagger
 * /recipe-product/{id}:
 *   delete:
 *     summary: Suppression d'un produit d'une recette
 *     tags: [Produit de recette]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           required: true
 *           description: Id de la recette
 *     responses:
 *       200:
 *         description: Produit de la recette supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RecipeProductFull'
 */
router.delete(
    "/recipe-product/:id",
    authMiddleware,
    recipeProductController.delete,
);

module.exports = router;

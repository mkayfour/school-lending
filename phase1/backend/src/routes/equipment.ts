/**
 * @openapi
 * /equipment:
 *   get:
 *     summary: List equipment items (searchable, filterable)
 *     tags: [equipment]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *         description: Search by name (partial match)
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *         description: Filter by equipment category
 *       - in: query
 *         name: available
 *         schema: { type: string }
 *         description: Only show equipment with available quantity > 0
 *     responses:
 *       200:
 *         description: List of equipment items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Equipment'
 *   post:
 *     summary: Add new equipment (admin only)
 *     tags: [equipment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, category, condition, quantity]
 *             properties:
 *               name: { type: string }
 *               category: { type: string }
 *               condition: { type: string }
 *               quantity: { type: integer }
 *     responses:
 *       201:
 *         description: Equipment created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Equipment'
 *       400:
 *         description: Missing fields
 * /equipment/{id}:
 *   put:
 *     summary: Update equipment (admin only)
 *     tags: [equipment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: integer }
 *         required: true
 *         description: Equipment id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               category: { type: string }
 *               condition: { type: string }
 *               quantity: { type: integer }
 *     responses:
 *       200:
 *         description: Equipment updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Equipment'
 *       404:
 *         description: Not found
 *   delete:
 *     summary: Delete equipment (admin only)
 *     tags: [equipment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: integer }
 *         required: true
 *         description: Equipment id
 *     responses:
 *       204:
 *         description: Deleted
 *       404:
 *         description: Not found
 */

import { Router } from 'express';
import { Equipment } from '../models/index.ts';
import { auth } from '../../middlewares/authentication.ts';

import { Op } from 'sequelize';

const router = Router();

router.get('/', async (req, res) => {
  const { q, category, available } = req.query;
  const where: any = {};

  // Search by name (case-insensitive, partial match)
  if (q) {
    where.name = { [Op.iLike]: `%${q}%` };
  }

  // Filter by category if present
  if (category) {
    where.category = category;
  }

  // Filter by availability (availableQuantity > 0)
  // Accept available=1 or available=true or available=yes (case-insensitive)
  if (
    available &&
    (
      available === '1' ||
      available === 'true' ||
      available === 'yes' ||
      available === 'Yes' ||
      available === 'TRUE'
    )
  ) {
    where.availableQuantity = { [Op.gt]: 0 };
  }

  const items = await Equipment.findAll({ where, order: [['name', 'ASC']] });
  res.json(items);
});

router.post('/', auth(['ADMIN']), async (req, res) => {
  const { name, category, condition, quantity } = req.body;
  if (![name, category, condition, quantity].every(Boolean)) return res.status(400).json({ error: 'Missing fields' });
  const item = await Equipment.create({ name, category, condition, quantity, availableQuantity: Number(quantity) });
  res.status(201).json(item);
});

router.put('/:id', auth(['ADMIN']), async (req, res) => {
  const { id } = req.params;
  const { name, category, condition, quantity } = req.body;
  const [count, rows] = await Equipment.update(
    { name, category, condition, quantity, availableQuantity: quantity },
    { where: { id }, returning: true }
  );
  if (!count) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
});

router.delete('/:id', auth(['ADMIN']), async (req, res) => {
  const { id } = req.params;
  const count = await Equipment.destroy({ where: { id }});
  if (!count) return res.status(404).json({ error: 'Not found' });
  res.status(204).end();
});

export default router;
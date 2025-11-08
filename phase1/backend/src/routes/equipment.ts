import { Router } from 'express';
import { Equipment } from '../models/index.ts';
import { auth } from '../../middlewares/authentication.ts';

const router = Router();

router.get('/', async (req, res) => {
  const { q, category, available } = req.query;
  const where: any = {};
  if (q) where.name = { [Symbol.for('sequelize.where')]: undefined };
  const whereOpts: any = {};
  if (q) whereOpts.name = { [Equipment.sequelize.Op.iLike]: `%${q}%` };
  if (category) whereOpts.category = category;
  if (available) whereOpts.availableQuantity = { [Equipment.sequelize.Op.gt]: 0 };

  const items = await Equipment.findAll({ where: whereOpts, order: [['name','ASC']] });
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
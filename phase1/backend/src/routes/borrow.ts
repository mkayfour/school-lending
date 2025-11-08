import { Router } from 'express';
import { BorrowRequest, Equipment, User, sequelize } from '../models/index.ts';
import { auth } from '../../middlewares/authentication.ts';
import { Op } from 'sequelize';

const router = Router();

// create request (student/staff/admin may request)
router.post('/', auth(['STUDENT','STAFF','ADMIN']), async (req, res) => {
  const { equipmentId, borrowDate, returnDate } = req.body;
  if (!equipmentId || !borrowDate || !returnDate) return res.status(400).json({ error: 'Missing fields' });

  const eq = await Equipment.findByPk(equipmentId);
  if (!eq) return res.status(400).json({ error: 'Invalid equipment' });

  const br = await BorrowRequest.create({
    userId: req.user.id,
    equipmentId,
    borrowDate: new Date(borrowDate),
    returnDate: new Date(returnDate),
    status: 'REQUESTED'
  });
  res.status(201).json(br);
});

// my requests
router.get('/my', auth(['STUDENT','STAFF','ADMIN']), async (req, res) => {
  const rows = await BorrowRequest.findAll({
    where: { userId: req.user.id },
    include: [{ model: Equipment }],
    order: [['id','DESC']]
  });
  res.json(rows);
});

// all (staff/admin)
router.get('/all', auth(['STAFF','ADMIN']), async (_req, res) => {
  const rows = await BorrowRequest.findAll({
    include: [{ model: Equipment }, { model: User, attributes: ['name','role'] }],
    order: [['id','DESC']]
  });
  res.json(rows);
});

// approve → prevent overlapping approvals beyond capacity
router.put('/:id/approve', auth(['STAFF','ADMIN']), async (req, res) => {
  const id = Number(req.params.id);
  const br = await BorrowRequest.findByPk(id);
  if (!br) return res.status(404).json({ error: 'Not found' });

  const eq = await Equipment.findByPk(br.equipmentId);
  if (!eq) return res.status(400).json({ error: 'Equipment missing' });

  // Overlap rule: count APPROVED requests for same equipment whose time ranges overlap
  const overlaps = await BorrowRequest.count({
    where: {
      equipmentId: br.equipmentId,
      status: 'APPROVED',
      [Op.and]: [
        { borrowDate: { [Op.lte]: br.returnDate } },
        { returnDate: { [Op.gte]: br.borrowDate } }
      ]
    }
  });

  if (overlaps >= eq.availableQuantity) {
    return res.status(409).json({ error: 'No availability in that window' });
  }

  br.status = 'APPROVED';
  await br.save();
  res.json(br);
});

router.put('/:id/reject', auth(['STAFF','ADMIN']), async (req, res) => {
  const id = Number(req.params.id);
  const br = await BorrowRequest.findByPk(id);
  if (!br) return res.status(404).json({ error: 'Not found' });
  br.status = 'REJECTED';
  await br.save();
  res.json(br);
});

router.put('/:id/return', auth(['STAFF','ADMIN']), async (req, res) => {
  const id = Number(req.params.id);
  const br = await BorrowRequest.findByPk(id);
  if (!br) return res.status(404).json({ error: 'Not found' });
  br.status = 'RETURNED';
  await br.save();
  res.json(br);
});

export default router;
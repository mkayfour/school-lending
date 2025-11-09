/**
 * @openapi
 * /borrow:
 *   post:
 *     summary: Create borrow request (student, staff, or admin)
 *     tags: [borrow]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [equipmentId, borrowDate, returnDate]
 *             properties:
 *               equipmentId: { type: integer }
 *               borrowDate: { type: string, format: date }
 *               returnDate: { type: string, format: date }
 *     responses:
 *       201:
 *         description: Borrow request created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BorrowRequest'
 *       400:
 *         description: Missing fields or invalid equipment
 *
 * /borrow/my:
 *   get:
 *     summary: List current user's borrow requests
 *     tags: [borrow]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of borrow requests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BorrowRequest'
 *
 * /borrow/all:
 *   get:
 *     summary: List all borrow requests (staff/admin only)
 *     tags: [borrow]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all borrow requests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BorrowRequest'
 *
 * /borrow/{id}/approve:
 *   put:
 *     summary: Approve a borrow request (staff/admin)
 *     tags: [borrow]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: integer }
 *         required: true
 *         description: Borrow request id
 *     responses:
 *       200:
 *         description: Borrow request approved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BorrowRequest'
 *       404:
 *         description: Not found
 *       409:
 *         description: No availability in that window
 *
 * /borrow/{id}/reject:
 *   put:
 *     summary: Reject a borrow request (staff/admin)
 *     tags: [borrow]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: integer }
 *         required: true
 *         description: Borrow request id
 *     responses:
 *       200:
 *         description: Borrow request rejected
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BorrowRequest'
 *       404:
 *         description: Not found
 *
 * /borrow/{id}/return:
 *   put:
 *     summary: Mark a borrow request as returned (staff/admin)
 *     tags: [borrow]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: integer }
 *         required: true
 *         description: Borrow request id
 *     responses:
 *       200:
 *         description: Borrow request returned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BorrowRequest'
 *       404:
 *         description: Not found
 */

import { Router } from 'express';
import { BorrowRequest, Equipment, User, sequelize } from '../models/index.ts';
import { auth } from '../../middlewares/authentication.ts';
import { Op } from 'sequelize';

const router = Router();

// create request
router.post('/', auth(['STUDENT']), async (req, res) => {
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
    include: [{ model: Equipment }, { model: User , attributes: ['name','role'] }],
    order: [['id','DESC']]
  });
  res.json(rows);
});

// approve -> prevent overlapping approvals beyond capacity
router.put('/:id/approve', auth(['STAFF','ADMIN']), async (req, res) => {
  const id = Number(req.params.id);
  const br = await BorrowRequest.findByPk(id);
  if (!br) return res.status(404).json({ error: 'Not found' });

  const eq = await Equipment.findByPk(br.equipmentId);
  if (!eq) return res.status(400).json({ error: 'Equipment missing' });

  // Overlap rule: count APPROVED requests for same equipment whose time ranges overlap, check available quantity
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
  eq.availableQuantity = Number(eq.availableQuantity) - 1;
  await eq.save();

  await br.save();
  res.json(br);
});

router.put('/:id/reject', auth(['STAFF','ADMIN']), async (req, res) => {
  const id = Number(req.params.id);
  const br = await BorrowRequest.findByPk(id);
  if (!br) return res.status(404).json({ error: 'Not found' });

  const eq = await Equipment.findByPk(br.equipmentId);
  if (!eq) return res.status(400).json({ error: 'Equipment missing' });

  eq.availableQuantity = Number(eq.availableQuantity) + 1;
  await eq.save();

  br.status = 'REJECTED';

  await br.save();
  res.json(br);
});

router.put('/:id/return', auth(['STAFF','ADMIN']), async (req, res) => {
  const id = Number(req.params.id);
  const br = await BorrowRequest.findByPk(id);
  if (!br) return res.status(404).json({ error: 'Not found' });

  const eq = await Equipment.findByPk(br.equipmentId);
  if (!eq) return res.status(400).json({ error: 'Equipment missing' });

  br.status = 'RETURNED';
  eq.availableQuantity = Number(eq.availableQuantity) + 1;

  await eq.save();
  await br.save();
  res.json(br);
});

export default router;
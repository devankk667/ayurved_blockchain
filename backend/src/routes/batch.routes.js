const express = require('express');
const router = express.Router();
const batchController = require('../controllers/batch.controller');
const { rateLimit } = require('express-rate-limit');
const { rateLimit: rateLimitConfig } = require('../config/config');

// Apply rate limiting to all routes
const limiter = rateLimit({
  windowMs: rateLimitConfig.windowMs,
  max: rateLimitConfig.max,
  message: 'Too many requests from this IP, please try again later.'
});

router.use(limiter);

/**
 * @swagger
 * /api/batch/{batchId}:
 *   get:
 *     summary: Get batch details by ID
 *     tags: [Batches]
 *     parameters:
 *       - in: path
 *         name: batchId
 *         required: true
 *         schema:
 *           type: string
 *         description: The batch ID
 *     responses:
 *       200:
 *         description: Batch details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Batch'
 *       400:
 *         description: Bad request - missing or invalid batch ID
 *       404:
 *         description: Batch not found
 *       500:
 *         description: Internal server error
 */
router.get('/:batchId', batchController.getBatchDetails);

module.exports = router;

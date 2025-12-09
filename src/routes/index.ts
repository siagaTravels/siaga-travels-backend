import { Router } from 'express';
import destinationsRoutes from '../modules/destinations/destinations.routes';

const router = Router();

/**
 * @swagger
 * /api/health:
 *   get:
 *     tags: [Health]
 *     summary: Health check endpoint
 *     responses:
 *       200:
 *         description: API is healthy
 */
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'API is healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});

/**
 * @swagger
 * /api:
 *   get:
 *     tags: [General]
 *     summary: API root endpoint
 *     responses:
 *       200:
 *         description: API information
 */
router.get('/', (req, res) => {
    res.json({
        message: 'Siyoga Travels API v1.0.0',
        documentation: '/api-docs',
        health: '/api/health',
    });
});

// API v1 routes
router.use('/v1/destinations', destinationsRoutes);

export default router;

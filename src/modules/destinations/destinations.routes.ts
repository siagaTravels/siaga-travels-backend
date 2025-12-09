import { Router } from 'express';
import { validate } from '../../middleware/validate';
import * as destinationsController from './destinations.controller';
import {
    getDestinationsQuerySchema,
    getDestinationParamsSchema,
    createDestinationSchema,
    updateDestinationSchema,
} from './destinations.validation';

const router = Router();

// GET /api/v1/destinations
router.get(
    '/',
    validate({ query: getDestinationsQuerySchema }),
    destinationsController.getAllDestinations
);

// GET /api/v1/destinations/:slug
router.get(
    '/:slug',
    validate({ params: getDestinationParamsSchema }),
    destinationsController.getDestinationBySlug
);

// POST /api/v1/destinations
router.post(
    '/',
    validate({ body: createDestinationSchema }),
    destinationsController.createDestination
);

// PUT /api/v1/destinations/:slug
router.put(
    '/:slug',
    validate({
        params: getDestinationParamsSchema,
        body: updateDestinationSchema,
    }),
    destinationsController.updateDestination
);

// DELETE /api/v1/destinations/:slug
router.delete(
    '/:slug',
    validate({ params: getDestinationParamsSchema }),
    destinationsController.deleteDestination
);

export default router;

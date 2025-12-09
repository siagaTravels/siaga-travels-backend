import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Prisma } from '@prisma/client';
import { asyncHandler } from '../../utils/asyncHandler';
import * as destinationsService from './destinations.service';
import { GetDestinationsQuery } from './destinations.validation';

/**
 * @swagger
 * tags:
 *   name: Destinations
 *   description: Sri Lanka travel destinations management
 */

/**
 * @swagger
 * /api/v1/destinations:
 *   get:
 *     tags: [Destinations]
 *     summary: Get all destinations
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: province
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of destinations
 */
export const getAllDestinations = asyncHandler(async (req: Request, res: Response) => {
    // Use validatedQuery from middleware or fallback to req.query
    const query = ((req as any).validatedQuery || req.query) as GetDestinationsQuery;
    const destinations = await destinationsService.findAll(query);
    const total = await destinationsService.count(query);

    res.status(StatusCodes.OK).json({
        success: true,
        data: destinations,
        meta: { total, count: destinations.length },
    });
});

/**
 * @swagger
 * /api/v1/destinations/{slug}:
 *   get:
 *     tags: [Destinations]
 *     summary: Get destination by slug
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Destination details
 *       404:
 *         description: Destination not found
 */
export const getDestinationBySlug = asyncHandler(async (req: Request, res: Response) => {
    const params = (req as any).validatedParams || req.params;
    const slug = params.slug as string;

    if (!slug) {
        res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Slug parameter is required',
            error: { code: 400, type: 'MISSING_PARAMETER', details: 'slug is required' },
        });
        return;
    }

    const destination = await destinationsService.findBySlug(slug);

    if (!destination) {
        res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            message: `Destination with slug '${slug}' not found`,
            error: { code: 404, type: 'NOT_FOUND', details: `No destination exists with slug: ${slug}` },
        });
        return;
    }

    res.status(StatusCodes.OK).json({
        success: true,
        data: destination,
    });
});

/**
 * @swagger
 * /api/v1/destinations:
 *   post:
 *     tags: [Destinations]
 *     summary: Create a new destination
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - slug
 *               - name
 *             properties:
 *               slug:
 *                 type: string
 *               name:
 *                 type: string
 *           example:
 *             slug: "ella-rock"
 *             name: "Ella Rock"
 *             subtitle: "Scenic viewpoint in Ella"
 *             description: "Ella Rock is a famous cliff, located high above Ella's village, roughly a 2-hour strenuous trek from the center of town."
 *             longDescription: "The hike to Ella Rock is one of the most popular activities in the hill country of Sri Lanka. The panoramic views from the top are truly breathtaking, showcasing the Ella Gap and the surrounding tea plantations."
 *             experience: "Hiking, Photography, Nature"
 *             location: "Ella, Badulla"
 *             province: "Uva"
 *             image: "https://example.com/ella-rock.jpg"
 *             gallery: ["https://example.com/gallery1.jpg", "https://example.com/gallery2.jpg"]
 *             rating: 4.8
 *             reviews: 1500
 *             bestSeason: ["Dry Season (Dec - Mar)"]
 *             category: "Hiking"
 *             difficulty: "Medium"
 *             distanceFromColombo: "200 km"
 *             duration: "4 hours"
 *             gradient: "Steep"
 *             highlights: ["Panoramic Views", "Tea Plantations"]
 *             whyVisit: ["Stunning Scenery", "Challenging Hike"]
 *             tips: ["Start early in the morning", "Wear comfortable shoes"]
 *             nearbyPlaces: ["Nine Arch Bridge", "Little Adam's Peak"]
 *             popularity: 95
 *             price: "Free"
 *             travelTimeFromColombo: "6 hours"
 *     responses:
 *       201:
 *         description: Destination created
 */
export const createDestination = asyncHandler(async (req: Request, res: Response) => {
    const data = req.body as Prisma.DestinationCreateInput;

    if (!data.slug) {
        res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Slug is required',
            error: { code: 400, type: 'MISSING_FIELD', details: 'slug field is required' },
        });
        return;
    }

    const destination = await destinationsService.create(data);

    res.status(StatusCodes.CREATED).json({
        success: true,
        data: destination,
        message: 'Destination created successfully',
    });
});

/**
 * @swagger
 * /api/v1/destinations/{slug}:
 *   put:
 *     tags: [Destinations]
 *     summary: Update a destination
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *           example:
 *             name: "Ella Rock Viewpoint"
 *             subtitle: "A must-visit scenic viewpoint in Ella"
 *             rating: 4.9
 *             reviews: 1600
 *             tips: ["Start early in the morning to avoid the heat", "Wear comfortable hiking shoes", "Bring plenty of water"]
 *     responses:
 *       200:
 *         description: Destination updated
 */
export const updateDestination = asyncHandler(async (req: Request, res: Response) => {
    const params = (req as any).validatedParams || req.params;
    const slug = params.slug as string;
    const data = req.body as Prisma.DestinationUpdateInput;

    if (!slug) {
        res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Slug parameter is required',
            error: { code: 400, type: 'MISSING_PARAMETER', details: 'slug is required' },
        });
        return;
    }

    const existing = await destinationsService.findBySlug(slug);
    if (!existing) {
        res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            message: `Destination with slug '${slug}' not found`,
            error: { code: 404, type: 'NOT_FOUND', details: `No destination exists with slug: ${slug}` },
        });
        return;
    }

    const destination = await destinationsService.updateBySlug(slug, data);

    res.status(StatusCodes.OK).json({
        success: true,
        data: destination,
        message: 'Destination updated successfully',
    });
});

/**
 * @swagger
 * /api/v1/destinations/{slug}:
 *   delete:
 *     tags: [Destinations]
 *     summary: Delete a destination
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Destination deleted
 */
export const deleteDestination = asyncHandler(async (req: Request, res: Response) => {
    const params = (req as any).validatedParams || req.params;
    const slug = params.slug as string;

    if (!slug) {
        res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Slug parameter is required',
            error: { code: 400, type: 'MISSING_PARAMETER', details: 'slug is required' },
        });
        return;
    }

    const existing = await destinationsService.findBySlug(slug);
    if (!existing) {
        res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            message: `Destination with slug '${slug}' not found`,
            error: { code: 404, type: 'NOT_FOUND', details: `No destination exists with slug: ${slug}` },
        });
        return;
    }

    await destinationsService.deleteBySlug(slug);

    res.status(StatusCodes.OK).json({
        success: true,
        message: 'Destination deleted successfully',
    });
});

import { z } from 'zod';

/**
 * Zod validation schemas for destinations endpoints
 */

export const getDestinationsQuerySchema = z.object({
    category: z.string().optional(),
    province: z.string().optional(),
    difficulty: z.enum(['Easy', 'Moderate', 'Challenging']).optional(),
    limit: z.coerce.number().int().positive().max(100).default(10),
    offset: z.coerce.number().int().nonnegative().default(0),
    sortBy: z.enum(['popularity', 'rating', 'createdAt', 'name']).optional(),
    order: z.enum(['asc', 'desc']).default('desc'),
});

export const getDestinationParamsSchema = z.object({
    slug: z.string().min(1, 'Slug is required'),
});

export const createDestinationSchema = z.object({
    slug: z.string().min(1).max(100),
    name: z.string().min(1).max(200),
    subtitle: z.string().max(300).optional(),
    description: z.string().optional(),
    longDescription: z.string().optional(),
    experience: z.string().optional(),
    location: z.string().optional(),
    province: z.string().optional(),
    image: z.string().url().optional(),
    gallery: z.array(z.string().url()).optional(),
    rating: z.number().min(0).max(5).optional(),
    reviews: z.number().int().nonnegative().optional(),
    bestSeason: z.array(z.string()).optional(),
    category: z.string().optional(),
    difficulty: z.enum(['Easy', 'Moderate', 'Challenging']).optional(),
    distanceFromColombo: z.string().optional(),
    duration: z.string().optional(),
    gradient: z.string().optional(),
    highlights: z.array(z.string()).optional(),
    whyVisit: z.array(z.string()).optional(),
    tips: z.array(z.string()).optional(),
    nearbyPlaces: z.array(z.string()).optional(),
    popularity: z.number().int().min(0).max(100).optional(),
    price: z.string().optional(),
    travelTimeFromColombo: z.string().optional(),
});

export const updateDestinationSchema = createDestinationSchema.partial();

// Type exports
export type GetDestinationsQuery = z.infer<typeof getDestinationsQuerySchema>;
export type GetDestinationParams = z.infer<typeof getDestinationParamsSchema>;
export type CreateDestinationInput = z.infer<typeof createDestinationSchema>;
export type UpdateDestinationInput = z.infer<typeof updateDestinationSchema>;

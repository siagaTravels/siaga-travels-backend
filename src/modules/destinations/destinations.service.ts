import { Prisma } from '@prisma/client';
import * as destinationsModel from './destinations.model';
import { GetDestinationsQuery } from './destinations.validation';

/**
 * Destinations Service - Business logic layer
 * Uses model for database operations
 */

export const findAll = async (query: GetDestinationsQuery) => {
    const { category, province, difficulty, limit, offset, sortBy, order } = query;

    // Build where clause for filtering
    const where: Prisma.DestinationWhereInput = {};
    if (category) where.category = category;
    if (province) where.province = province;
    if (difficulty) where.difficulty = difficulty;

    // Build orderBy clause with type assertion
    let orderBy: Prisma.DestinationOrderByWithRelationInput = { popularity: 'desc' };
    if (sortBy) {
        orderBy = { [sortBy]: order || 'desc' } as Prisma.DestinationOrderByWithRelationInput;
    }

    return destinationsModel.findAll({
        where,
        orderBy,
        take: limit,
        skip: offset,
    });
};

export const findBySlug = async (slug: string) => {
    return destinationsModel.findBySlug(slug);
};

export const findById = async (id: bigint) => {
    return destinationsModel.findById(id);
};

export const create = async (data: Prisma.DestinationCreateInput) => {
    return destinationsModel.create(data);
};

export const updateBySlug = async (slug: string, data: Prisma.DestinationUpdateInput) => {
    return destinationsModel.updateBySlug(slug, data);
};

export const deleteBySlug = async (slug: string) => {
    return destinationsModel.deleteBySlug(slug);
};

export const count = async (query: Partial<GetDestinationsQuery>) => {
    const { category, province, difficulty } = query;

    const where: Prisma.DestinationWhereInput = {};
    if (category) where.category = category;
    if (province) where.province = province;
    if (difficulty) where.difficulty = difficulty;

    return destinationsModel.count(where);
};

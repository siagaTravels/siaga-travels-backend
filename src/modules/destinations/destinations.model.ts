import { prisma } from '../../config/db';
import { Prisma } from '@prisma/client';

/**
 * Destinations Model - Pure Prisma database queries
 * Follows Single Responsibility Principle
 */

export const findAll = async (options: {
    where?: Prisma.DestinationWhereInput;
    orderBy?: Prisma.DestinationOrderByWithRelationInput;
    take?: number;
    skip?: number;
}) => {
    return prisma.destination.findMany(options);
};

export const findBySlug = async (slug: string) => {
    return prisma.destination.findUnique({
        where: { slug },
    });
};

export const findById = async (id: bigint) => {
    return prisma.destination.findUnique({
        where: { id },
    });
};

export const create = async (data: Prisma.DestinationCreateInput) => {
    return prisma.destination.create({ data });
};

export const updateBySlug = async (slug: string, data: Prisma.DestinationUpdateInput) => {
    return prisma.destination.update({
        where: { slug },
        data,
    });
};

export const deleteBySlug = async (slug: string) => {
    return prisma.destination.delete({
        where: { slug },
    });
};

export const count = async (where?: Prisma.DestinationWhereInput) => {
    return prisma.destination.count({ where });
};

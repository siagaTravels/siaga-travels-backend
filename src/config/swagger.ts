import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

/**
 * Swagger configuration options following OpenAPI 3.0 specification
 */
const swaggerOptions: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Siyoga Travels API',
            version: '1.0.0',
            description: 'Backend API for Siyoga Travels - Discover Sri Lanka',
            contact: {
                name: 'API Support',
                email: 'support@siyogatravels.com',
            },
        },
        servers: [
            {
                url: process.env.NODE_ENV === 'production'
                    ? 'https://api.siyogatravels.com'
                    : `http://localhost:${process.env.PORT || 5000}`,
                description: process.env.NODE_ENV === 'production'
                    ? 'Production server'
                    : 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                Error: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: false },
                        message: { type: 'string', example: 'An error occurred' },
                        error: {
                            type: 'object',
                            properties: {
                                code: { type: 'number', example: 400 },
                                type: { type: 'string', example: 'VALIDATION_ERROR' },
                                details: { type: 'string', example: 'Detailed error message' },
                            },
                        },
                    },
                },
                SuccessResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true },
                        message: { type: 'string', example: 'Operation completed successfully' },
                        data: { type: 'object', description: 'Response data' },
                    },
                },
            },
        },
    },
    apis: [
        './src/routes/*.ts',
        './src/modules/**/*.ts',
    ],
};

/**
 * Swagger specification generator
 */
export const swaggerSpec = swaggerJSDoc(swaggerOptions);

/**
 * Swagger UI options
 */
const swaggerUiOptions: swaggerUi.SwaggerUiOptions = {
    explorer: true,
    swaggerOptions: {
        docExpansion: 'none',
        filter: true,
        showRequestDuration: true,
        tryItOutEnabled: true,
    },
    customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info .title { color: #2c3e50; }
  `,
    customSiteTitle: 'Siyoga Travels API Documentation',
};

/**
 * Swagger setup interface
 */
export interface ISwaggerSetup {
    setupSwagger(app: Express): void;
}

/**
 * Swagger setup implementation
 */
export class SwaggerSetup implements ISwaggerSetup {
    public setupSwagger(app: Express): void {
        try {
            // Serve swagger documentation
            app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

            // Serve swagger.json
            app.get('/api-docs.json', (req, res) => {
                res.setHeader('Content-Type', 'application/json');
                res.send(swaggerSpec);
            });

            console.log('📚 Swagger docs available at /api-docs');
        } catch (error) {
            console.error('❌ Failed to setup Swagger:', error);
        }
    }
}

/**
 * Factory function for creating Swagger setup instance
 */
export const createSwaggerSetup = (): ISwaggerSetup => {
    return new SwaggerSetup();
};

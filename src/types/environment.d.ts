declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'development' | 'production' | 'test';
            PORT: string;
            DATABASE_URL: string;
            JWT_SECRET?: string;
            API_KEY?: string;
        }
    }
}

export { };

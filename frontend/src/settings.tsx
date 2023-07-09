export const DEBUG = process.env.NODE_ENV === 'development';

export const SERVER_URL = DEBUG
    ? 'http://localhost:8000'
    : 'http://backend-production-0b66.up.railway.app';

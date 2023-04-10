import { createContext } from 'react';

export interface Error {
    title: string;
    description?: string;
}

export const ErrorContext = createContext(
    {
        errors: [] as Error[],
        throwError: (title: string, description?: string) => {}
    }
);

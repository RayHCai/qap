import { createContext } from 'react';

export interface Error {
    title: string;
    description?: string;
    isConfirm: boolean;
    callback?: (confirmed: boolean) => void;
}

export const ErrorContext = createContext(
    {
        errors: [] as Error[],
        throwError: (title: string, description?: string, isConfirm: boolean = false) => {},
        throwConfirm: (title: string, callback: (confirmed: boolean) => void, description?: string) => {}
    }
);

import { createContext } from 'react';

export interface Error {
    title: string;
    description?: string;
    isConfirm: boolean;
    callback?: (confirmed: boolean) => void;
}

export const ErrorContext = createContext({
    errors: [] as Error[],
    throwError: (
        _title: string,
        _description?: string,
        _isConfirm: boolean = false
    ) => {},
    throwConfirm: (
        _title: string,
        _callback: (confirmed: boolean) => void,
        _description?: string
    ) => {},
});

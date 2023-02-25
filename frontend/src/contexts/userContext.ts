import { createContext } from 'react';

export const UserContext = createContext(
    {
        code: null as string | null,
        setCode: (_: string | null) => {}
    }
);

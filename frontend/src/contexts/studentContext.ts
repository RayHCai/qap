import { createContext } from 'react';

export const StudentContext = createContext(
    {
        name: null as string | null,
        updateName: (_: string | null) => {}
    }
);

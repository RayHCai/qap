import { useState, createContext, type PropsWithChildren } from 'react';

export const UserContext = createContext<
    {
        user: Student | User | null;
        setUser: (_: Student | User | null) => void;
    }
>(
    {
        user: null,
        setUser: (_: Student | User | null) => {},
    }
);

export default function UserContextWrapper({ children }: PropsWithChildren) {
    const [user, setUser] = useState<Student | User | null>(null);

    return (
        <UserContext.Provider value={ { user, setUser } }>
            { children }
        </UserContext.Provider>
    );
}

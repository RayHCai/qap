import { useState, createContext, type PropsWithChildren } from 'react';

type UserContext = {
    user: Student | Teacher | null;
    setUser: (_user: Student | Teacher | null) => void;
};

export const UserContext = createContext<UserContext>({
    user: null,
    setUser: (_user: Student | Teacher | null) => {},
});

export default function UserContextWrapper({ children }: PropsWithChildren) {
    const [user, setUser] = useState<Student | Teacher | null>(null);

    return (
        <UserContext.Provider value={ { user, setUser } }>
            { children }
        </UserContext.Provider>
    );
}

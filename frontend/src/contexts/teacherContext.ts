import { createContext } from 'react';

export const TeacherContext = createContext({
    user: null as User | null,
    updateUser: (_: User | null) => {},
});

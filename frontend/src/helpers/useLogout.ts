import { useContext } from 'react';

import { UserContext } from '@/contexts/userContext';

export default function useLogout() {
    const { setUser } = useContext(UserContext);
    
    return () => {
        setUser(null);
    };
}

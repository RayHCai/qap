import { createContext, useState, type PropsWithChildren } from 'react';

type RoomContext = {
    currentRoom: Room | null;
    setCurrentRoom: (room: Room) => void;
};

const RoomContext = createContext<RoomContext>(
    {
        currentRoom: null,
        setCurrentRoom: () => {},
    }
);

export function RoomContextWrapper({ children }: PropsWithChildren) {
    const [currentRoom, setCurrentRoom] = useState<Room | null>(null);

    return (
        <RoomContext.Provider
            value={
                {
                    currentRoom,
                    setCurrentRoom,
                }
            }
        >
            { children }
        </RoomContext.Provider>
    );
}

export default RoomContext;

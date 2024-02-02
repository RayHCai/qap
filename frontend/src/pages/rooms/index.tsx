import { useState, useEffect, useContext, useRef } from 'react';

import CloseableModal from '@/components/ui/modal/closeable';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';

import { UserContext } from '@/contexts/userContext';
import { ModalContext } from '@/contexts/modalContext';
import useThrowError from '@/hooks/useThrowError';

import { SERVER_URL } from '@/settings';

import classes from './styles.module.css';

export default function Rooms() {
    const { openModal, closeModal } = useContext(ModalContext);
    const { user } = useContext(UserContext);

    const throwError = useThrowError();

    const [rooms, updateRooms] = useState<Room[]>([]);
    const [modalId, updateModalId] = useState(-1);

    const name = useRef<HTMLInputElement>(null);

    function createRoom() {        
        
        function onClose() {
            closeModal(modalId);
            updateModalId(-1);
        }

        async function onSubmit() {
            const roomName = name.current!.value;

            const res = await fetch(`${SERVER_URL}/rooms/create/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    {
                        name: roomName,
                        owner: (user as Teacher).id,
                    }
                ),
            });

            const json = await res.json();

            if (!res.ok) return throwError(json.message);

            updateRooms([...rooms, json]);

            onClose();
        }

        updateModalId(
            openModal(
                <CloseableModal
                    title="Create Room"
                    onClose={ onClose }
                    blurBg={ true }
                    onSubmit={ onSubmit }
                    submitButtonText="Create"
                >
                    <div className={ classes.createRoomModal }>
                        <Input
                            ref={ name }
                            type="text"
                            placeholder="Room Name"
                        />
                    </div>
                </CloseableModal>
            )
        );
    }

    useEffect(
        () => {
            (async function() {
                const res = await fetch(`${SERVER_URL}/rooms/get/${(user as Teacher).id}/`);
                const json = await res.json();

                updateRooms(json.data);
            })();
        }, []
    );

    return (
        <div className={ classes.container }>
            <div className={ classes.header }>
                <h1>Rooms</h1>

                <div>
                    <Button onClick={ createRoom }>Create a Room</Button>
                </div>
            </div>

            

            <div className={ classes.roomsContainer }>
                {
                    rooms.length === 0 && <h3>No Rooms!</h3>
                }

                {
                    rooms.map(
                        room => (
                            <div key={ room.id } className={ classes.room }>
                                <h3>{ room.name }</h3>
                            </div>
                        )
                    )
                }
            </div>
        </div>
    );
}

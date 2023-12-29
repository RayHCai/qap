import CloseableModal from '../closeable';

type ErrorModalProps = {
    error: string;
    onClose: () => void;
    title?: string;
};

export default function ErrorModal(props: ErrorModalProps) {
    return (
        <CloseableModal
            blurBg={ true }
            title={ props.title || 'Error' }
            onClose={ props.onClose }
        >
            <p>{ props.error }</p>
        </CloseableModal>
    );
}

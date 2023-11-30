import ModalBase from '../ui/modals';
import Button from '../ui/button';

import classes from './styles.module.css';

type ErrorModalProps = {
	error: string;
	onClose: () => void;
	title?: string;
};

export default function ErrorModal(props: ErrorModalProps) {
	return (
		<ModalBase>
			<div className={ classes.errorContainer }>
				<h1>{ props.title }</h1>

				<p>{ props.error }</p>
				
				<Button onClick={ props.onClose }>Close</Button>
			</div>
		</ModalBase>
	);
}

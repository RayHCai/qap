import { Link } from 'react-router-dom';
import { BiRightArrowAlt } from 'react-icons/bi';

import classes from './styles.module.css';

export default function PageNotFound() {
	return (
		<div className={ classes.content }>
			<div className={ classes.container }>
				<h1 className={ classes.letter }>4</h1>
				<h1 className={ classes.letter }>0</h1>
				<h1 className={ classes.letter }>4</h1>
			</div>

			<Link
				className={ classes.link }
				to="/"
			>
				Go Back Home <BiRightArrowAlt />
			</Link>
		</div>
	);
}

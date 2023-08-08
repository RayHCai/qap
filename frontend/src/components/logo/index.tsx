import { useNavigate } from 'react-router';
import classes from './styles.module.css';

type LogoProps = {
	containerClassName?: string;
	logoClassName?: string;
	shapeClassName?: string;
}

export default function Logo({ containerClassName, logoClassName, shapeClassName }: LogoProps) {
	const navigate = useNavigate();

	return (
		<div
			className={
				`${ classes.logoContainer } ${ containerClassName }`
			}
			onClick={
				() => navigate('/')
			}
		>
			<span
				className={
					`${ classes.logo } ${ logoClassName }`
				}
			>
				qap
			</span>

			<span
				className={
					`${ classes.logoShape } ${ shapeClassName }`
				}
			/>
		</div>
	);
}

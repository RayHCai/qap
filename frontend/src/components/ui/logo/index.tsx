import { useNavigate } from 'react-router';

import classes from './styles.module.css';

type LogoProps = {
    containerClassName?: string;
    logoClassName?: string;
    shapeClassName?: string;
};

export default function Logo(props: LogoProps) {
    const navigate = useNavigate();

    return (
        <div
            className={ `${classes.logoContainer} ${props.containerClassName}` }
            onClick={ () => navigate('/') }
        >
            <span className={ `${classes.logo} ${props.logoClassName}` }>
                qap
            </span>

            <span className={ `${classes.logoShape} ${props.shapeClassName}` } />
        </div>
    );
}

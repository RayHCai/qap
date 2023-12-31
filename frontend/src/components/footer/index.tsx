import Logo from '@/components/ui/logo';

import classes from './styles.module.css';

export default function Footer() {
    return (
        <footer className={ classes.container }>
            <div className={ classes.logoContainer }>
                <Logo logoClassName={ classes.logo } />
            </div>
        </footer>
    );
}

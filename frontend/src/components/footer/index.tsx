import Logo from '@/components/ui/logo';

import classes from './styles.module.css';

export default function Footer() {
    return (
        <footer className={ classes.container }>
            <Logo logoClassName={ classes.logo } />
        </footer>
    );
}

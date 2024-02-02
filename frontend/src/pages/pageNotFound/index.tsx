import { BiRightArrowAlt } from 'react-icons/bi';

import UnderlinedLink from '@/components/ui/underlinedLink';

import classes from './styles.module.css';

export default function PageNotFound() {
    return (
        <div className={ classes.content }>
            <div className={ classes.textContainer }>
                <h1 className={ classes.letter }>4</h1>
                <h1 className={ classes.letter }>0</h1>
                <h1 className={ classes.letter }>4</h1>
            </div>

            <UnderlinedLink className={ classes.link } to="/">
                Go Back Home <BiRightArrowAlt />
            </UnderlinedLink>
        </div>
    );
}

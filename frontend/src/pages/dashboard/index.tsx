import { useNavigate } from 'react-router';

import {
    PiNewspaperThin,
    PiQuestionThin,
    PiCheckCircleThin,
    PiChatCircleTextThin,
} from 'react-icons/pi';

import classes from './styles.module.css';

export default function Dashboard() {
    const navigate = useNavigate();

    return (
        <div className={ classes.container }>
            <div className={ classes.topLaunch }>
                <div className={ classes.iconContainer } onClick={ () => navigate('/quiz-editor') }>
                    <PiNewspaperThin className={ classes.icon } />
                    <span>Quiz</span>
                </div>
            </div>

            <div className={ classes.seperator }>
                <span className={ classes.line } />

                <div>
                    <span>Quick Question</span>
                </div>

                <span className={ classes.line } />
            </div>

            <div className={ classes.quickLaunch }>
                <div className={ classes.iconContainer }>
                    <PiQuestionThin className={ classes.icon } />
                    <span>Multiple Choice</span>
                </div>

                <div className={ classes.iconContainer }>
                    <PiCheckCircleThin className={ classes.icon } />
                    <span>True / False</span>
                </div>

                <div className={ classes.iconContainer }>
                    <PiChatCircleTextThin className={ classes.icon } />
                    <span>Short Answer</span>
                </div>
            </div>
        </div>
    );
}

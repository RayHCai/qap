import { useNavigate } from 'react-router';
import { BsDownload, BsFillTrashFill } from 'react-icons/bs';
import { FaCopy } from 'react-icons/fa';

import classes from './quizCard.module.css';

export default function QuizCard(props: { quiz: Quiz }) {
    const navigate = useNavigate();

    return (
        <div className={ classes.cardContainer }>
            <div className={ classes.flexedContainer }>
                <div className={ classes.clickContainer } onClick={ () => navigate(`/dashboard/edit/${ props.quiz.id }`) }>
                    <h1>{ props.quiz.name }</h1>
                </div>

                <div className={ classes.iconsContainer }>
                    <div className={ classes.iconContainer }>
                        <BsDownload />
                    </div>
                    
                    <div className={ classes.iconContainer }>
                        <FaCopy />
                    </div>

                    <div className={ classes.iconContainer }>
                        <BsFillTrashFill />
                    </div>
                </div>
            </div>
        </div>
    );
}
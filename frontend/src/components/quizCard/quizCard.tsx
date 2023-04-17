import { useNavigate } from 'react-router';

import { BsDownload, BsFillTrashFill } from 'react-icons/bs';
import { FaCopy, FaLongArrowAltRight } from 'react-icons/fa';
import { VscDebugStart , VscDebugStop} from 'react-icons/vsc';

import classes from './quizCard.module.css';

type QuizCardProps = {
    quiz: Quiz;
    session: Session | null;
    deleteQuiz: (id: string) => void;
    startSession: (id: string) => void;
    stopSession: (id: string) => void;
}

export default function QuizCard(props: QuizCardProps) {
    const navigate = useNavigate();

    // TODO: need to implement these

    async function download() {}

    async function copy() {}

    return (
        <div className={ classes.cardContainer }>
            <div className={ classes.flexedContainer }>
                <div className={ classes.clickContainer } onClick={ () => navigate(`/dashboard/edit/${ props.quiz.id }`) }>
                    <h1>{ props.quiz.name }</h1>
                </div>

                <div className={ classes.iconsContainer }>
                    <div className={ classes.iconContainer }>
                        {
                            props.session ?
                                <VscDebugStop onClick={ () => props.stopSession(props.quiz.id) }/>
                            : <VscDebugStart onClick={ () => props.startSession(props.quiz.id) }/>
                        }
                    </div>

                    <div className={ classes.iconContainer }>
                        <BsDownload />
                    </div>
                    
                    <div className={ classes.iconContainer }>
                        <FaCopy />
                    </div>

                    <div className={ classes.iconContainer } onClick={ () => props.deleteQuiz(props.quiz.id) }>
                        <BsFillTrashFill />
                    </div>

                    {
                        props.session && (
                            <div className={ classes.viewDashboardBtn } onClick={ () => navigate(`/dashboard/session/${ props.session!.id }`) }>
                                <div className={ classes.iconContainer }>
                                    <FaLongArrowAltRight />
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
}

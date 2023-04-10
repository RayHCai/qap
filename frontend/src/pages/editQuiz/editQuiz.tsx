import { useEffect, useState, useContext, createRef } from 'react';
import { useParams } from 'react-router';

import { BsArrowRight } from 'react-icons/bs';

import QuestionCard from '../../components/questionCard/questionCard';
import Loading from '../../components/loading/loading';

import { ErrorContext } from '../../contexts/errorContext';

import { SERVER_URL } from '../../settings';

import classes from './editQuiz.module.css';

export default function EditQuiz() {
    const { quizId } = useParams();

    const { throwError } = useContext(ErrorContext);

    const [questions, updateQuestions] = useState<Question[]>();
    const [quiz, updateQuiz] = useState<Quiz>();

    const [editingQuestion, updateEditingQuestion] = useState(-1);

    const [filter, updateFilter] = useState('');

    const [isLoading, updateLoading] = useState(false);

    useEffect(() => {
        (async function() {
            updateLoading(true);

            const res = await fetch(`${ SERVER_URL }/questions/manage/${ quizId }/`);
            const json = await res.json();

            updateLoading(false);

            if(!res.ok) return throwError(json.message);

            updateQuestions(json.data.questions);
            updateQuiz(json.data.quiz);
        })();
    }, []);

    function resizeInput(e: React.ChangeEvent<HTMLInputElement>) {
        const newVal = e.target.value;

        if(newVal.length > 255) return;

        if(newVal.length < 100) e.target.style.width = `${ newVal.length }ch`;

        updateQuiz({
            ...quiz!,
            name: newVal
        });
    }

    function addQuestion(type: 'mc' | 'tf' | 'sa') {
        const newQuestion: Question = {
            id: '',
            title: '',
            content: '',
            isVisible: true,
            questionFor: quizId!,
            choices: [] as string[],
            required: true,
        };

        if(type === 'mc') {
            newQuestion.selectMultiple = false;
            newQuestion.correctAnswer = [];
        }
        else if(type === 'tf') {
            newQuestion.choices = ['True', 'False'];
            newQuestion.selectMultiple = false;
        }

        updateEditingQuestion(questions!.length);
        updateQuestions([...questions!, newQuestion]);
    }

    function deleteQuestion(i: number) {

    }

    if(isLoading || !quiz || !questions) return <Loading />;

    return (
        <div className={ classes.container }>
            <div className={ classes.header }>
                <input
                    placeholder="Quiz Title"
                    className={ classes.title }
                    value={ quiz.   name }
                    onChange={ resizeInput }
                />

                <button>
                    <p>Save and Exit</p>

                    <div className={ classes.iconContainer }>
                        <BsArrowRight />
                    </div>
                </button>
            </div>

            <div className={ classes.questions }>
                {
                    questions.filter(
                        q => q.title.toLowerCase().includes(filter.toLowerCase())
                    ).length === 0 && (
                        <h1>
                            You don't have any questions for this quiz!
                        </h1>
                    )
                }
                
                {
                    questions.filter(
                        q => q.title.toLowerCase().includes(filter.toLowerCase())
                    ).map(
                        (q, i) => (
                            <QuestionCard
                                key={ i }
                                question={ q }
                                questionNumber={ i + 1 }
                                delete={ deleteQuestion }
                                isEdit={ i === editingQuestion }
                            />
                        )
                    )
                }
            </div>

            <div className={ classes.footer }>
                <p>Add a Question</p>

                <div className={ classes.questionTypes }>
                    <button onClick={ () => addQuestion('mc') }>Multiple Choice</button>
                    <button onClick={ () => addQuestion('tf') }>True / False</button>
                    <button onClick={ () => addQuestion('sa') }>Short Answer</button>
                </div>
            </div>
        </div>
    );
}

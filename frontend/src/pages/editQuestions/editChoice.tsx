import { GrClose } from 'react-icons/gr';

type EditChoiceProps = {
    deleteChoice: () => void;
    changeChoice: (v: string) => void;
    changeCorrect: (b: boolean) => void;
    value: string;
    correct: boolean;
};

export default function EditChoice(props: EditChoiceProps) {
    return (
        <div className="choice-container">
            <div className="edit-q-d-choice-container">
                <GrClose className="delete-choice-button" onClick={ () => props.deleteChoice() } />
            </div>

            <div>
                <input 
                    type="checkbox"
                    checked={ props.correct }
                    onChange={ (e) => props.changeCorrect(e.target.checked) }
                />

                <input
                    className="choice-input"
                    value={ props.value }
                    onChange={ (e) => props.changeChoice(e.target.value) }
                />
            </div>
        </div>
    );
}

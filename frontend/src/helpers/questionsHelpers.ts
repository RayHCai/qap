export function questionTypeCodeToString(q: Question) {
    if(q.questionType === 'sa') return 'short-answer';
    else if(q.questionType === 'tf') return 'true-false';
    else return 'multiple-choice';
}

export function verifyQuestion(q: Question) {
    const title = q.title;
    const choices = q.choices;
    const type = q.questionType;

    if(
        title.replaceAll(' ', '').length === 0 ||
        (choices.length < 2 && (type === 'mc' || type === 'tf'))
    )
        return false;

    return true;
}

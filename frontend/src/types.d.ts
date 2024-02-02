declare module '*.css';
declare module '*.png';
declare module '*.svg';

// #region Users
declare interface Student {
    name: string;
}

declare interface Teacher {
    id: string;

    username: string;
    email: string;

    createdAt: Date;
}
// #endregion

// #region Questions
declare const enum QuestionType {
    MC = 'mc',
    TF = 'tf',
    SA = 'sa',
}

declare interface Question {
    id: string;

    content: string;

    questionFor: string; // ID of quiz that question belongs to

    questionType: QuestionType;
    numPoints: number;

    choices: string[];
    correctAnswers?: string[];
}

declare interface Answer {
    id: string;

    answeredBy: string;

    answerFor: string; // ID of question that answer belongs to
    sessionFor: string; // ID of session that answer belongs to

    correct: boolean;
    dateAnswered: Date;

    textAnswer?: string;
    selected?: string[];
}
// #endregion

// #region Quizzes
declare interface Session {
    id: string;

    code: string;
    active: boolean;

    sessionFor: string; // ID of quiz that session belongs to
    usersInSession: string[];

    dateCreated: string;
}

declare interface Quiz {
    id: string;

    name: string;
    teacher: string; // ID of teacher that owns the quiz
}

declare interface Room {
    id: string;

    name: string;
    createdAt: Date;
}
// #endregion

declare module '*.css';
declare module '*.png';
declare module '*.svg';

// #region Users

declare interface Student {
    studentName: string;
}

declare interface Teacher {
    id: string;

    username: string;
    email: string;
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

    title: string; // TODO: What is this
    content: string;

    questionFor: string; // quiz id
    questionType: QuestionType;
    numPoints: number;

    choices: string[]; // TODO: see if this is optional?
    correctAnswer?: string[];
}

declare interface Answer {
    id: string;
    studentName: string;
    answerFor: string; // question id
    textAnswer?: string;
    selected?: string[];
    correct: boolean;
    dateAnswered: string;
}

// #endregion

// #region Quizzes

declare interface Session {
    id: string;
    code: string;
    active: boolean;
    dateCreated: string;
    sessionFor: string; // quiz id
    usersInSession: string[];
}

declare interface Quiz {
    id: string;

    name: string;
    teacher: string; // user id
}

// #endregion

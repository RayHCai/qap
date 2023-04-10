declare module '*.css';

declare interface User {
    id: string;

    username: string;
    email: string;
}

declare interface Question {
    id: string;
    
    title: string;
    content: string;

    isVisible: boolean;

    questionFor: string;

    choices: string[];
    selectMultiple?: boolean;

    required: boolean;

    correctAnswer?: string[];
}

declare interface Session {
    id: string;
    code: string;
    active: boolean;
    dateCreated: string;
    sessionFor: string;
}

declare interface Quiz {
    id: string;

    name: string;
    teacher: string;
}

declare type Answer = {
    id: string;
    studentName: string;
    answerFor: string;
    textAnswer?: string;
    selected?: string[];
    correct: boolean;
    dateAnswered: string;
}

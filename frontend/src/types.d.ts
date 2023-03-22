declare interface Question {
    title: string;
    id: string;
    content: string;
    visible: boolean;
    choices?: string;
    select_multiple?: boolean;
    correct_answer?: string;
}

declare type Answer = {
    question?: number;
    answer: string;
    name?: string;
    date_answered?: string;
    choice?: string;
    correct?: string;
};
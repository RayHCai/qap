declare interface Question {
    title: string;
    id: string;
    content: string;
    visible: boolean;
    choices?: string;
    select_multiple?: boolean;
    correct_answer?: string;
}

export interface Question {
    num: string;
    id: string;
    question: string;
    options?: { [key: string]: string };
    correctAnswer?: string;
    a: string;
    b: string;
    c: string;
    d: string;
    solution: string;
    image: string;
    translation: { [key: string]: QuestionTranslation } | null;
    context: string;
    category: undefined | null | string;
    sessionId?: number;
    sessionName?: string;
}
export interface QuestionTranslation {
    question: string;
    a: string;
    b: string;
    c: string;
    d: string;
    context: string;
}
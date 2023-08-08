declare module '*.css';
declare module '*.png';
declare module '*.svg';

declare interface Student {
	studentName: string;
}

declare interface User {
	id: string;

	username: string;
	email: string;
}

declare interface Question {
	id: string;

	title: string;
	content: string;

	questionFor: string; // quiz id
	questionType: 'mc' | 'tf' | 'sa';
	numPoints: number;

	choices: string[];

	correctAnswer?: string[];
}

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

declare interface Answer {
	id: string;
	studentName: string;
	answerFor: string; // question id
	textAnswer?: string;
	selected?: string[];
	correct: boolean;
	dateAnswered: string;
}

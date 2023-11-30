import { useState, createContext, type PropsWithChildren } from 'react';

import ErrorModal from '@/components/errorModal';

export const ErrorContext = createContext<{
	throwError: (
		error: string,
		title?: string,
		onCloseCallback?: () => void
	) => void;
}>({
	throwError: (
		_error: string,
		_title?: string,
		_onCloseCallback?: () => void
	) => {}
});

export default function ErrorContextWrapper({ children }: PropsWithChildren) {
	const [errors, updateErrors] = useState<JSX.Element[]>([]);

	function closeError(index: number) {
		const newModals = [...errors].filter((_, i) => i !== index);

		updateErrors(newModals);
	}

	function throwError(
		error: string,
		title?: string,
		onCloseCallback?: () => void
	) {
		const index = errors.length;

		updateErrors([
			...errors,
			<ErrorModal
				key={ index }
				error={ error }
				onClose={ () => {
                    onCloseCallback && onCloseCallback();
					closeError(index);
				} }
                title={ title }
			/>
		]);

		return index;
	}

	return (
		<ErrorContext.Provider value={ { throwError } }>
			{ errors }

			{ children }
		</ErrorContext.Provider>
	);
}

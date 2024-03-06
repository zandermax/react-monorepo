import { Button, Input, Space } from 'antd';

import { useState } from 'react';

const DEFAULT_ERROR_MESSAGE = 'Error message';

const ErrorThrower = ({
	setError,
}: {
	setError: (message: string) => void;
}) => {
	const [errorText, setErrorText] = useState(DEFAULT_ERROR_MESSAGE);

	return (
		<Space direction="vertical" size={'middle'}>
			<Space>
				<Input
					placeholder="Enter error message"
					defaultValue={DEFAULT_ERROR_MESSAGE}
					onChange={({ target: { value } }) => setErrorText(value)}
					value={errorText}
				></Input>
				<Button
					danger
					disabled={!errorText}
					onClick={() => errorText && setError(errorText)}
				>
					Throw it!
				</Button>
				<Button
					onClick={() => {
						setError('');
						setErrorText('');
					}}
				>
					Clear
				</Button>
			</Space>
		</Space>
	);
};

export default ErrorThrower;

import { useState } from 'react';
import { useHistory } from 'react-router-dom';

export const AutoMsg = () => {
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [listings, setListings] = useState<string>('');
	const [message, setMessage] = useState<string>('');
	const [sleep, setSleep] = useState<number>(1);
	const [loading, setLoading] = useState<boolean>(false);
	const [result, setResult] = useState<any>();
	//eslint-disable-next-line
	const [history, setHistory] = useState(useHistory());

	const startAutoMsg = async () => {
		setLoading(true);
		const send = { email, password, listings, message, sleep };

		const resp = await fetch(`auto-msg/start`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(send),
		});
		const data = await resp.json();
		setResult(data);
		setLoading(false);
	};

	return (
		<div className="auto-msg">
			<div onClick={history.goBack}>Back</div>
			Auto Msg <br />
			{loading ? 'Sending messages...' : 'Ready to start'} <br />
			Username{' '}
			<input
				type="text"
				value={email}
				onChange={(e) => {
					setEmail(e.target.value);
				}}
			></input>
			Password{' '}
			<input
				type="text"
				value={password}
				onChange={(e) => {
					setPassword(e.target.value);
				}}
			></input>
			Sleep time between messages{' '}
			<input
				type="number"
				min="1"
				value={sleep}
				onChange={(e) => {
					setSleep(parseInt(e.target.value));
				}}
			></input>
			Listings
			<textarea
				value={listings}
				onChange={(e) => {
					setListings(e.target.value);
				}}
			/>
			Message ($ = category, @ = name)
			<textarea
				value={message}
				onChange={(e) => {
					setMessage(e.target.value);
				}}
			/>
			{email && password && listings && message ? (
				<button onClick={startAutoMsg}>Start</button>
			) : (
				<div>Please fill all the information above to start</div>
			)}
			<div>{result}</div>
		</div>
	);
};

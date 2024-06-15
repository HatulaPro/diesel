import './App.css';
import { $createMacro } from 'diesel-core/macros';

const $num = $createMacro((tokens) => {
	return parseInt(tokens[0]);
});

function App() {
	return (
		<>
			<strong>{$num`1234`}</strong> Will Be Replaced
		</>
	);
}

export default App;

import './App.css';
import { $createMacro } from 'diesel-core/macros';

const $num = $createMacro(() => {
	return parseInt('12345');
});

function App() {
	return (
		<>
			<strong>{$num`1234`}</strong> Will Be Replaced
		</>
	);
}

export default App;

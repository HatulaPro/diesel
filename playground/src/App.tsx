import './App.css';
import { Diesel } from 'diesel-core/macros';
const $num = Diesel.$num;
function App() {
	return (
		<>
			<strong>{$num`1234`}</strong> Will Be Replaced
		</>
	);
}

export default App;

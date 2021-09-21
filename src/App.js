import './App.css';
import Header from './component/Header';
import Contents from './component/Contents';

function App() {
  return (
    <div className="App">
      <Header />
      <h2 className="title">국내 코로나 현황</h2>
      <Contents />

    </div>
  );
}

export default App;

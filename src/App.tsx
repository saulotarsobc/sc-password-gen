import { Route, HashRouter as Router, Routes } from "react-router-dom";
import Home from "./pages/Home";

function App() {
  return (
    <Router>
      <div className="App">
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

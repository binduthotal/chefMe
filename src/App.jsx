import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import Register from './components/Register';
import Home from './components/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        {/* We will protect this route later so only logged-in users can see it */}
        <Route path="/home" element={<Home />} /> 
      </Routes>
    </Router>
  );
}

export default App;
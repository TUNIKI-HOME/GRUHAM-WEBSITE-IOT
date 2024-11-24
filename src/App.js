import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './Components/Nav-Foo/Navbar';
import Home from "./Components/HomeJS/Home";
import Rooms from "./Components/HomeJS/Roomes";
import RoomSwitches from "./Components/HomeJS/Switches";
import ProfilePage from "./Components/HomeJS/Profile";
import Power from "./Components/HomeJS/Power";
import Temperature from "./Components/HomeJS/Temperatures";
import Camera from "./Components/HomeJS/Cameras";
import Footer from "./Components/Nav-Foo/Footer";
import Auth from './Components/Auth/Auths'; // Adjusted import path for Auth component
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Adjusted Firebase imports
import Ledstrip from './Components/HomeJS/Ledstrip';

function App() {
  const auth = getAuth();
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);

  return (
    <Router >
      <Routes>
        <Route path="/signinup" element={<Auth />} /> {/* Route for signing in/up */}
        {user ? (
          <>
            {/* Protected routes for authenticated users */}
            <Route path="/" element={<><Navbar /><Home /><Footer /></>} />
            <Route path="/home" element={<><Navbar /><Home /><Footer /></>} />
            <Route path="/rooms" element={<><Navbar /><Rooms /><Footer /></>} />
            <Route path="/switches" element={<><Navbar /><RoomSwitches /><Footer /></>} />
            <Route path="/camera" element={<><Navbar /><Camera /><Footer /></>} />
            <Route path="/profile" element={<><Navbar /><ProfilePage /><Footer /></>} />
            <Route path="/led" element={<><Navbar /><Ledstrip /><Footer /></>} />
            <Route path="/power" element={<><Navbar /><Power /><Footer /></>} />
            <Route path="/temperature" element={<><Navbar /><Temperature /><Footer /></>} />
            {/* Redirect unmatched routes to home */}
            <Route path="*" element={<Navigate to="/" />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/signinup" />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;

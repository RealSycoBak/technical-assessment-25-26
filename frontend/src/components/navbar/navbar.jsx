import React, { useContext } from 'react'
import { ThemeContext, TimeContext } from '../frame/contexts';
import "./navbar.css";
import Title from '../../components/title/title'
import { Moon } from 'lucide-react';
import { useLocation } from "react-router-dom";
import { getSecureBrowserIdentity, API_URL } from '../global/signaturesClient';



export default function NavBar() {
  /* 
      Component: NavBar
      Navigation bar at the top of frame.
      Includes the Title component, navigation links, and dark mode toggler.
  */

  const [theme, setTheme] = useContext(ThemeContext);
  const [timeZone, setTimeZone] = useContext(TimeContext);

  const toggleTheme = () => {
    setTheme(prev => !prev);
  };

  const location = useLocation();

  const clearHistory = async () => {
    try {
      const { browserId, signature } = await getSecureBrowserIdentity();

      const response = await fetch(`${API_URL}/api/history/clear`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          browserId,
          signature
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("History cleared:", result);
        window.location.reload();
      } else {
        console.error("Failed to clear history");
      }
    } catch (error) {
      console.error("Error clearing history:", error);
    }
  };

  return (
    <div className={`nav-bar ${!theme ? "light-nav-bar" : ""}`}>
      <div className="nav-left">
        <Title />
      </div>
      <div className="nav-right">
        <div>
          <select
            id="timezone-select"
            value={timeZone}
            onChange={(e) => setTimeZone(e.target.value)}
          >
            <option value="America/New_York">Eastern (America/New_York)</option>
            <option value="America/Chicago">Central (America/Chicago)</option>
            <option value="America/Denver">Mountain (America/Denver)</option>
            <option value="America/Los_Angeles">Pacific (America/Los_Angeles)</option>
            <option value="UTC">UTC</option>
            <option value="Europe/London">London (Europe/London)</option>
            <option value="Europe/Berlin">Berlin (Europe/Berlin)</option>
            <option value="Asia/Tokyo">Tokyo (Asia/Tokyo)</option>
            <option value="Asia/Kolkata">India (Asia/Kolkata)</option>
            <option value="Australia/Sydney">Sydney (Australia/Sydney)</option>
          </select>
        </div>
        {location.pathname === "/history" ? (
          <button className="clear-history-button" onClick={clearHistory}>
            Clear History
          </button>
        ) : (
          <a href="/history" style={{ color: theme ? 'white' : 'black' }}>History</a>
        )}
        <button className="dark-toggle" aria-label="Toggle dark mode" onClick={toggleTheme}>
          <Moon color={theme ? "white" : "black"} size={30} />
        </button>
      </div>
    </div>
  );
}
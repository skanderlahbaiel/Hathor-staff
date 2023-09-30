// In a component where you want to display navigation links
import React from 'react';
import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <nav id="booking-nav-bar">
      <ul>
        <li>
          <Link to="/live">Réservations Direct</Link>
        </li>
        <li>
          <Link to="/all">Toutes les réservations</Link>
        </li>
        <li>
          <Link to="/calendar">Calendrier</Link>
        </li>
        
      </ul>
    </nav>
  );
}

export default Navigation;

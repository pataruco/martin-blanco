import React from 'react';
import Link from 'next/link';

const App = () => (
  <header>
    <h1>Martin Blanco</h1>
    <nav>
      <ul>
        <li>
          <Link href="/menu-builder">
            <a>Menu builder</a>
          </Link>
        </li>
      </ul>
    </nav>
  </header>
);

export default App;

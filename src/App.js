import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';

import Rotas from './routes';

function App() {
    return (
        <>
            <Router>
                <Rotas />
            </Router>
        </>
    );
}

export default App;

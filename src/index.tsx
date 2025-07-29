import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import RouletteWindow from "./components/RouletteWindow";
import RouletteRegistrationBlock from "./components/RouletteRegistrationBlock";
import MainPage from "./components/MainPage";
import Futures from "./components/Futures";
import History from "./components/History";
import Manager from "./components/Manager";
import Bonuses from "./components/Bonuses";
import UserProfile from "./components/UserProfile";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>
);


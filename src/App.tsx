import './App.css';
import SplashScreen from "./Demo/SplashScreen";
import ModeSelect from './Demo/ModePage';
import SongSelect from './Demo/SongPage';
import { HashRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router';
import { Debug } from './Demo/utils/Debug';
import { PauseMenu } from './Demo/PlayPianoMenus/PauseMenu';
import PlayPianoController from './pianoStateController/PlayPianoController';
import { Settings } from './Demo/PlayPianoMenus/Settings';
import React, { useContext } from 'react';
import PlayPage from './Demo/PlayPage';

export function usePlayPianoController(): PlayPianoController {
  const ctx = useContext(controllerContext);
  return ctx;
}

export const controllerContext = React.createContext<PlayPianoController>(new PlayPianoController());

export enum PPPATH {
  SPLASHSCREEN = '/',
  MODESELECT = '/ModeSelect',
  PAUSED = '/Paused',
  SONGSELECT = '/SongSelect',
  DEBUG = '/debug',
  PLAY = '/Play',
  SETTINGS = '/Settings',
}

function App() {
  return (
    <HashRouter>
      <div>
        <Routes>
          <Route path={PPPATH.SPLASHSCREEN} element={<SplashScreen />} />
          <Route path={PPPATH.MODESELECT} element={<ModeSelect />} />
          <Route path={PPPATH.PAUSED} element={<PauseMenu />} />
          <Route path={PPPATH.SONGSELECT} element={<SongSelect />} />
          <Route path={PPPATH.SETTINGS} element={<Settings />} />
          <Route path={PPPATH.PLAY} element={<PlayPage />} />
          <Route path={PPPATH.DEBUG} element={<Debug />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;

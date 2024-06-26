import { useNavigate } from "react-router-dom"
import logo from '../../assets/play-piano-logo.svg';
import "./index.css"
import  { EVENTENDPOINT, KeyPress, useControllerMode } from "../utils/APIHooks";
import { PPPATH, usePlayPianoController } from "../../App";
import { useEffect } from "react";

function SplashScreen() {
    const nav = useNavigate();
    const controller = usePlayPianoController();
    const mode = useControllerMode();

    const action = () => {
        nav(PPPATH.MODESELECT);
    }

    
    controller.setStatus('Menus')
    
    useEffect(  () => {
        controller.setStatus('Menus');
        const events = new EventSource(EVENTENDPOINT);

       (async()=> {await controller.clearKeys();
        await controller.registerAllKeys();})();

  
        events.onmessage = (event) => {
  
          const keypressed = JSON.parse(event.data);
          const keypress : KeyPress  = {keyID: keypressed.keyID, count : keypressed.count};
          console.log(`Key pressed id : ${keypress.keyID} keys listening for ANY`);

          if(keypress.keyID === undefined){
            console.log(`returning keypress :  ${keypress}`)
            return;
          }
          action();


    }

        return () => {
            events.close();
          }

      // eslint-disable-next-line react-hooks/exhaustive-deps
      },[mode, controller.pianoMode,controller.status,controller])
        
    return ( 

        <div className="splash-container centered" onClick={action}>

              <div className="piano-logo">
                <img
                    src={logo}
                    className="piano-logo"
                    alt="logo"/>
             </div>
            <h1 className='splash-text'>Play any key to start!</h1>
        </div>
    );
}
export default SplashScreen;


import  { useEffect, useState } from "react";
import { PianoState, isPianoState,  } from "./types";
import { usePlayPianoController } from "../../App";
import { PPEvents } from "../../pianoStateController/PlayPianoEventHandler";

export const EVENTENDPOINT = 'http://localhost:8080/api/events'

export type KeyPress = {keyID: number, count: number};

/**
 * react hook that gets key presses from the server api.
 * updates whenvever a keypress event happens
 * @param keysToReport keys ids that this should report
 * @returns 
 */
/*
  function useKeyPressesFromServer(keysToReport?: number | number[],colorID?:number) {
  const controller = usePlayPianoController();

  const [lastKeyPress, setLastKeyPress ] = useState(-1);
  const [lastKeyCount, setLastKeyCount] = useState(-1);
  
  let colorindex = 0
  const setColorsIfKey=(val:number)=>{
    console.log(`registering ${val}`);
    if(val>61)
    controller.httpcontroller.registerkey(val);
    else if(val<=61){
      controller.registerKey(val,ButtonColors[colorID||colorindex])
      colorindex = (colorindex + 1)%6;
    }}

  if(keysToReport !== undefined){
    console.log(keysToReport);
    if(typeof keysToReport ==='number'){
      console.log(`atttemping register and to set color of single key`)
      setColorsIfKey(keysToReport);
    }
    else {
      console.log(`atttemping to register and set color of multiple keys`)
      keysToReport.forEach(setColorsIfKey);
    }
  }
  else {
    console.log(`atttemping to register and set color of middle 10 white keys`)
    MIDDLE10KEYS.forEach(setColorsIfKey);
    }

  
  




  useEffect( () => {
      const events = new EventSource(EVENTENDPOINT);

      events.onmessage = (event) => {

        const keypressed = JSON.parse(event.data);
        const keypress : KeyPress  = {keyID: keypressed.keyID, count : keypressed.count};

        console.log(`Key pressed id : ${keypress.keyID} keys listening for ${keysToReport}`);

        if(keypress.keyID === undefined){
          return;
        }
        if(keysToReport !== undefined){
          if(typeof keysToReport === "number"){
            // eslint-disable-next-line eqeqeq
            if(keypress.keyID != keysToReport){
              console.log("returning key not needed first if");
              return;
            }
          }
            else if(keysToReport.includes(keypress.keyID.valueOf())){
              console.log(`returning key not needed second if ${keysToReport} ${keypress.keyID}`)
              return;

            }
        }
        console.log(`key pressed processed  ${keypress.keyID}`)
        setLastKeyPress(()=> keypress.keyID);
        setLastKeyCount(()=>keypress.count)


    }

    return () => {
      events.close();
    }
  }, [keysToReport]);

  return [lastKeyPress, lastKeyCount];
}

*/
/**
 * 
 * @param action is run when a key is pressed. 
 * @param keyID optional specific keys that performs action when pressed
 *//*
 function useActionOnKeyPress(action : (keyID?:number)=> void, keyID?:number[] | number,colorID?:number) {
  const [keyPressed, keyPresses] = useKeyPressesFromServer(keyID,colorID);
  const [ countProcecced, setCountProccessed] = useState(keyPresses);

  useEffect(()=>{
    //exit if no key has been pressed since making this hook
    if( keyPresses < 0 || keyPressed < 0 || keyPresses <= countProcecced){
      return;
    }
    setCountProccessed(prev=> prev+1);
    action(keyPressed);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[action, keyPresses]);
}
 */

export function useScoreFromServer() {
  const [score, setScore ] = useState(0);

  useEffect( () => {
      const events = new EventSource(EVENTENDPOINT);

      events.onmessage = (event) => {

        const lastEvent = JSON.parse(event.data);
        const apiscore : number  = lastEvent.progress



        if(apiscore === undefined){
          console.log(`returing before setting progress because :  ${apiscore} <is undefined `)

          return;
        }
        console.log(`midi score being set to ${apiscore}`)
        setScore(apiscore);


    }

    return () => {
      events.close();
    }
  }, []);

  return score
}

export function useProgressFromServer() { 
  const [progress, setProgress ] = useState(0);
  const controller = usePlayPianoController();

  useEffect( () => {
      const events = new EventSource(EVENTENDPOINT);

      events.onmessage = (event) => {

        const lastEvent = JSON.parse(event.data);
        const apiprogress : number = lastEvent.progress



        if(apiprogress < 0 || apiprogress === undefined){
          console.log(`returing before setting progress because :${lastEvent}  ${apiprogress}`)

          return;
        }
        console.log(`midi progress processed prev progress${progress}  ${apiprogress}`);
        setProgress(prev=>prev+1);


    }
    

    return () => {
      events.close();
      console.log("dismounting progress tracker")
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controller,controller.status]);

  return progress
}

export function useStatusFromServer() {
  const controllerStatus = useControllerStatus();

  const [status, setStatus ] = useState<PianoState>('Menus');

  useEffect( () => {
      const events = new EventSource(EVENTENDPOINT);

      events.onmessage = (event) => {

        const lastEvent = JSON.parse(event.data);
        const statusFromServer = lastEvent.status



        if(!isPianoState(statusFromServer)){
          console.log(`status undefined ${statusFromServer}`)
          return;
        }
        if(statusFromServer){
        console.log(`midi status processed  ${statusFromServer}`)
        //controller.setStatus(statusFromServer);
        setStatus(statusFromServer);
        }

    }

    return () => {
      events.close();
    }
  }, [controllerStatus]);

  return status
}





export function useControllerStatus(){
  const controller = usePlayPianoController();
  const [pianoStatus,setPianoStatus] = useState(controller.status);

  useEffect(()=>{

    
  const statusListener = ()=>{
    setPianoStatus(controller.status);
  }

    controller.addListener(PPEvents.STATUS,statusListener)

    return ()=>{controller.removeListener(PPEvents.STATUS,statusListener)}
    
  },[controller, controller.status])
  return pianoStatus;
}


//custom react hook to listen to the Mode in the controller, and update when it emmits changes
export function useControllerMode(){
  const controller = usePlayPianoController();
  const [mode,setMode] = useState(controller.pianoMode);

  useEffect(()=>{

    
  const modeListener = ()=>{
    setMode(controller.pianoMode);
  }
    controller.addListener(PPEvents.MODE,modeListener)
    return ()=>{controller.removeListener(PPEvents.MODE,modeListener)}
    
  },[controller])
  return mode;
}
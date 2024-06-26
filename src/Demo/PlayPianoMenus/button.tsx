import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import {faQuestion } from '@fortawesome/free-solid-svg-icons';

import "./index.css"
import "../../App.css"
import { ButtonColors } from '../utils/types';

interface MenuButtonProps {
  title: string | undefined;
  icon: IconDefinition | undefined;
  text: string | undefined;
  action: ()=>any | undefined;
  keyID: number;
  colorID?: number;
}


function MenuButton( {colorID, title, icon, text, action,keyID} : MenuButtonProps) : JSX.Element {

  // for testing 
  title = title ? title : "";
  icon = icon ? icon : faQuestion;
  text = text ? text : "";
  
  return (
    <div className="pause-card"
    id={`${title}`}
    style={{backgroundColor:`rgba(${ButtonColors[colorID||0]},.9)` }}
     onClick={()=>{if (action){action()}}}>
      <FontAwesomeIcon icon={icon}  className="mode-icon" />
      <h2>{title}</h2>
      <p>{text}
      </p>
    </div>
  );
}

export default MenuButton;

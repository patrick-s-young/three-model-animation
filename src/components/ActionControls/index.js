
export const ActionControls = ({ 
  uiParent, 
  clipActionsMap,
  setClipAction }) => {

  const flexContainer = document.createElement('div');
 // flexContainer.style.display = 'flex';
//  flexContainer.style.justifyContent = 'space-around';
  flexContainer.style.width = '100vw';
  uiParent.appendChild(flexContainer);


  for (const [key, value] of clipActionsMap.entries()) {
    flexContainer.appendChild(navButton({ label: key }));
  }

  
  function navButton ({ label }) {
    const div = document.createElement('div');
    div.style.width = '200px';
    div.style.height = '25px';
    div.style.backgroundColor = 'orange';
    div.style.display = 'inline-block';
    div.style.textAlign = 'center';
    div.style.margin = '4px';
    div.innerHTML = label;
    div.onclick = () => onClick({ label });
    return div;
  }

  function onClick ({ label }) {
    setClipAction(label);
  }


  return {
    
  }
}
import React, { useRef, useState } from 'react';
import CanvasDraw from 'react-canvas-draw';

const DrawingComponent = React.forwardRef((props,ref) => {
  const [brushRadius, setBrushRadius] = useState(3);
  const [brushColor, setBrushColor] = useState('Black');
  let canvasRef = useRef(null);
  canvasRef=ref;

  const handleUndo = () => {
    canvasRef.current.undo();
  };

  const handleColorChange = (color) => {
    canvasRef.current && setBrushColor(color) ;
  };

  const handleWidthChange = (event) => {
    const width = parseInt(event.target.value);
    // console.log(canvasRef.current.props.brushRadius)
    setBrushRadius(width*.4+0.6)
    // canvasRef.current && (canvasRef.current.props.brushRadius = width);
  };

  function GetDataURL(){
    console.log('getting image url')
    return (canvasRef.current && canvasRef.current.getDataURL())
  }

  return (
    <div>
      <div>
        <button onClick={() => canvasRef.current && canvasRef.current.clear()} style={{color:'black', padding:'1px', margin:'5px 2px'}}>Clear</button>
        <button onClick={handleUndo} style={{color:'black', padding:'1px', margin:'5px 2px'}}>Undo</button>
      </div>
      <div>
        <button onClick={() => handleColorChange('Black')} style={{color:'black', padding:'3px', margin:'1px'}}> Default</button>
        <button onClick={() => handleColorChange('Red')} style={{color:'red', padding:'3px', margin:'0px'}}>Red</button>
        <button onClick={() => handleColorChange('#00FF00')} style={{color:'green', padding:'3px', margin:'0px'}}>Green</button>
        <button onClick={() => handleColorChange('#0000FF')} style={{color:'blue', padding:'3px', margin:'0px'}}>Blue</button>
      </div>
      <div>
        <input
          type="range"
          min="1"
          max="20"
          defaultValue='6'          
          onChange={handleWidthChange}
        />
      </div>
      <CanvasDraw
        ref={ref}
        canvasWidth={800}
        canvasHeight={400}
        brushRadius = {brushRadius}
        brushColor={brushColor}
        catenaryColor={brushColor}
        lazyRadius = {0}
      />
    </div>
  );
});

export default DrawingComponent;

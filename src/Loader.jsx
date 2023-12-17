import React, { useState } from 'react'
import PulseLoader from "react-spinners/PulseLoader";

export default function Loader() {
    let [color, setColor] = useState("black");
  return (
    <div id='loaderdiv'>
      
      <PulseLoader
        color={color}
        size={25}
        aria-label="Loading Spinner"
        data-testid="loader"
      />

    </div>
  )
}

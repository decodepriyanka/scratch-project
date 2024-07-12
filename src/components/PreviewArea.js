import React from "react";
import CatSprite from "./CatSprite";

const PreviewArea = () => (
  <div id="cat-sprite" className="flex-none overflow-y-auto p-2 w-44 h-44">
    <div
      className="hidden border-2 p-2 ml-3 mb-2 w-auto whitespace-nowrap"
      id="message-box"
    ></div>
    <CatSprite />
  </div>
);

export default PreviewArea;

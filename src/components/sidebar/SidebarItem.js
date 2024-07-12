import React, { useRef, useState } from "react";

const SidebarItem = React.forwardRef(
  ({ name, id, handleDragStart, executeCommand, type, sidebarRef }, ref) => {
    return (
      <div
        ref={ref}
        className={`flex justify-center  text-white p-5 text-sm my-3 cursor-move rounded ${
          type === "motion" ? "bg-blue-500" : "bg-purple-500"
        }`}
        onMouseDown={(e) => {
          e.stopPropagation();
          handleDragStart(name, id, e, type);
        }}
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
            executeCommand(name);
          }}
          onMouseDown={(e) => e.stopPropagation()}
          className="min-w-max cursor-pointer"
        >
          {name}
        </div>
      </div>
    );
  }
);

export default SidebarItem;

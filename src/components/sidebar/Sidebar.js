import React, { createRef, useRef, useState } from "react";
import { looksComponents, motionComponents } from "./SidebarConstant";
import SidebarItem from "./SidebarItem";

const Sidebar = React.forwardRef(
  ({ handleDragStart, clonedEl, executeCommand }, itemRefs) => {
    const sidebarRef = useRef(null);

    return (
      <div
        className="w-60 flex-none h-full overflow-y-auto flex flex-col items-start p-2 border-r border-gray-200"
        ref={sidebarRef}
      >
        <div className="mb-4 w-full">
          <div className="font-bold mb-2">MOTION</div>
          {motionComponents.map(({ name, id }) => {
            return (
              <SidebarItem
                key={id}
                name={name}
                id={id}
                handleDragStart={handleDragStart}
                executeCommand={executeCommand}
                ref={
                  itemRefs.current[id]
                    ? itemRefs.current[id]
                    : (itemRefs.current[id] = createRef())
                }
                type="motion"
                sidebarRef={sidebarRef}
              />
            );
          })}
        </div>
        <div className="mb-4 w-full">
          <div className="font-bold mb-2">LOOKS</div>
          {looksComponents.map(({ name, id }) => {
            return (
              <SidebarItem
                key={id}
                name={name}
                id={id}
                handleDragStart={handleDragStart}
                executeCommand={executeCommand}
                ref={
                  itemRefs.current[id]
                    ? itemRefs.current[id]
                    : (itemRefs.current[id] = createRef())
                }
                type="looks"
                sidebarRef={sidebarRef}
              />
            );
          })}
          {clonedEl.length > 0 &&
            clonedEl.map(({ name, position, id, type }) => {
              return (
                <div
                  key={id}
                  ref={
                    itemRefs.current[id]
                      ? itemRefs.current[id]
                      : (itemRefs.current[id] = createRef())
                  }
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    handleDragStart(name, id, e, type, sidebarRef);
                  }}
                  style={{
                    position: "absolute",
                    left: `${position?.x}px`,
                    top: `${position?.y}px`,
                    cursor: "move",
                  }}
                  className={`flex justify-center text-white p-5 text-sm cursor-pointer rounded ${
                    type === "motion" ? "bg-blue-500" : "bg-purple-500"
                  }`}
                >
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      executeCommand(name);
                    }}
                    className="w-48 text-center cursor-pointer"
                  >
                    {name}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    );
  }
);
export default Sidebar;

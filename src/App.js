import React, { useRef, useCallback } from "react";
import Sidebar from "./components/sidebar/Sidebar";
import MidArea from "./components/MidArea";
import PreviewArea from "./components/PreviewArea";
import { useDraggable } from "./hooks/useDraggable";
import { executeCommand, getElements, moveToPrevState } from "./utility/utils";
import { useOverlapChecker } from "./hooks/useOverlapChecker";

export default function App() {
  const itemRefs = useRef([]);

  const { checkForOverlap, previewAreaRef } = useOverlapChecker();

  const { handleDragStart, clonedEl } = useDraggable(checkForOverlap, itemRefs);

  let actionsHistory = [];

  const replayIntervalRef = useRef(null);

  const replayActions = useCallback(
    (startIndex = 0) => {
      if (startIndex < 0 || startIndex >= actionsHistory.length) return;
      clearInterval(replayIntervalRef.current);
      let currentIndex = startIndex;
      const { previewElement, messageBoxElement } = getElements();
      if (currentIndex === 0) {
        previewElement.style.transform = `translate(0px, 0px) rotate(0deg)`;
        messageBoxElement.style.display = "none";
      } else {
        const { transform } = actionsHistory[currentIndex];
        const { command } = actionsHistory[currentIndex - 1];
        moveToPrevState(command);
        previewElement.style.transform = transform;
      }
      replayIntervalRef.current = setInterval(() => {
        if (currentIndex >= actionsHistory.length) {
          clearInterval(replayIntervalRef.current);
          return;
        }
        const { command } = actionsHistory[currentIndex];
        executeCommand(command);

        currentIndex++;
      }, 1000);
    },
    [actionsHistory, executeCommand, moveToPrevState]
  );

  const handlePlay = useCallback(() => {
    let currentIndex = 0;
    const executeCommandsSequentially = () => {
      if (currentIndex >= clonedEl.length) return;
      executeCommand(clonedEl[currentIndex]?.name, actionsHistory);
      currentIndex++;
      setTimeout(executeCommandsSequentially, 1000); // Adjust delay as needed
    };
    executeCommandsSequentially();
  }, [clonedEl, executeCommand]);

  return (
    <div className="bg-green-100 font-sans">
      <div className="h-screen overflow-hidden flex flex-row">
        <div className="flex-1 h-screen overflow-hidden flex flex-row bg-white border-t border-r border-gray-200 rounded-tr-xl mr-2">
          <Sidebar
            ref={itemRefs}
            handleDragStart={handleDragStart}
            clonedEl={clonedEl}
            executeCommand={executeCommand}
          />
          <MidArea handlePlay={handlePlay} replayActions={replayActions} />
        </div>
        <div
          ref={previewAreaRef}
          className="w-1/3 h-screen overflow-hidden flex flex-row bg-white border-t border-l border-gray-200 rounded-tl-xl ml-2"
        >
          <PreviewArea />
        </div>
      </div>
    </div>
  );
}

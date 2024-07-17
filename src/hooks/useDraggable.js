import { useCallback, useState } from "react";

export const useDraggable = (checkForOverlap, itemRefs) => {
  const [clonedEl, setClonedEl] = useState([]);

  const updateItemPosition = (newPosition, id) => {
    setClonedEl((prev) => {
      const updatedArray = prev.map((item) =>
        item.id === id ? { ...item, position: newPosition, id: id } : item
      );
      return updatedArray;
    });
  };

  const handleDragStart = useCallback(
    (name, id, e, type, sidebarRef) => {
      document.body.style.userSelect = "none";
      const itemRef = itemRefs.current[id]?.current;
      const rect = itemRef?.getBoundingClientRect();
      const offsetX = e.clientX - rect?.left;
      const offsetY = e.clientY - rect?.top;

      const startX = rect?.left;
      const startY = rect?.top;

      const elementExists = clonedEl.some((item) => item.id === id);
      const isTimestamp = !isNaN(new Date(id).getTime());
      let newElId = isTimestamp ? id : Date.now();
      if (!elementExists) {
        setClonedEl((prev) => [
          ...prev,
          { name, position: { x: newX, y: newY }, id: newElId, type },
        ]);
      }

      let newX = startX;
      let newY = startY;

      const handleMouseMove = (e) => {
        newX = e.clientX - offsetX;
        newY = e.clientY - offsetY;
        const newPosition = {
          x: newX,
          y: newY,
        };
        if (itemRef) {
          updateItemPosition(newPosition, newElId);
          itemRef.style.left = `${newX}px`;
          itemRef.style.top = `${newY}px`;
        }
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        const newPosition = { x: newX, y: newY };
        const currentItemRef = itemRefs?.current[id]?.current;
        const currentRect = currentItemRef?.getBoundingClientRect();

        let sidebarOverlap = false;
        if (sidebarRef) {
          const otherRect = sidebarRef?.current?.getBoundingClientRect();
          sidebarOverlap =
            currentRect?.right >= otherRect?.left &&
            currentRect?.left <= otherRect?.right &&
            currentRect?.bottom >= otherRect?.top &&
            currentRect?.top <= otherRect?.bottom;
        }

        if (sidebarOverlap) {
          setClonedEl((prev) => prev.filter((item) => item.id !== id));
        } else {
          if (checkForOverlap(newElId, itemRefs, clonedEl)) {
            const newPosition = {
              x: startX,
              y: startY,
            };

            updateItemPosition(newPosition, newElId);
            itemRef.style.left = `${startX}px`;
            itemRef.style.top = `${startY}px`;
          } else {
            updateItemPosition(newPosition, newElId);
          }
        }
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [itemRefs, clonedEl, checkForOverlap]
  );

  return { handleDragStart, clonedEl };
};

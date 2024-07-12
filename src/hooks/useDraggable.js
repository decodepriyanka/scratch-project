import { useCallback, useState } from "react";

export const useDraggable = (checkForOverlap, itemRefs) => {
  const [clonedEl, setClonedEl] = useState([]);

  const updateItemPosition = (newPosition, name, id, type) => {
    setClonedEl((prev) => {
      const updatedArray = prev.map((item) =>
        item.id === id ? { ...item, position: newPosition } : item
      );

      const isTimestamp = !isNaN(new Date(id).getTime());

      if (!isTimestamp && !updatedArray.some((item) => item.id === id)) {
        return [...prev, { name, position: newPosition, id: Date.now(), type }];
      }

      return updatedArray;
    });
  };
  const handleDragStart = useCallback(
    (name, id, e, type, sidebarRef) => {
      document.body.style.userSelect = "none";
      const itemRef = itemRefs.current[id].current;
      const rect = itemRef?.getBoundingClientRect();
      const offsetX = e.clientX - rect?.left;
      const offsetY = e.clientY - rect?.top;

      const startX = rect?.left;
      const startY = rect?.top;
      let newX;
      let newY;
      const handleMouseMove = (e) => {
        newX = e.clientX - offsetX;
        newY = e.clientY - offsetY;

        if (itemRef) {
          itemRef.style.left = `${newX}px`;
          itemRef.style.top = `${newY}px`;
        }
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);

        // const finalRect = itemRef?.getBoundingClientRect();
        // const left = finalRect?.left <= 200 ? 150 : finalRect?.left;
        const newPosition = { x: newX, y: newY };
        const currentitemRef = itemRefs?.current[id]?.current;
        const currentRect = currentitemRef?.getBoundingClientRect();

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
          setClonedEl((prev) => {
            const updatedArray = prev.filter((item) => item.id !== id);
            return updatedArray;
          });
        } else {
          if (checkForOverlap(id, itemRefs)) {
            itemRef.style.left = `${startX}px`;
            itemRef.style.top = `${startY}px`;
          } else {
            updateItemPosition(newPosition, name, id, type);
          }
        }
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [itemRefs, clonedEl]
  );

  return { handleDragStart, clonedEl };
};

import { useRef } from "react";

export const useOverlapChecker = () => {
  const previewAreaRef = useRef(null);

  const checkForOverlap = (id, itemRefs, clonedEl) => {
    if (itemRefs.current[id]) {
      const currentitemRef = itemRefs.current[id].current;
      const currentRect = currentitemRef?.getBoundingClientRect();
      if (previewAreaRef.current) {
        const previewAreaRect =
          previewAreaRef?.current?.getBoundingClientRect();

        const previewAreaOverlap =
          currentRect?.right >= previewAreaRect?.left &&
          currentRect?.left <= previewAreaRect?.right &&
          currentRect?.bottom >= previewAreaRect?.top &&
          currentRect?.top <= previewAreaRect?.bottom;
        if (previewAreaOverlap) return true;
      }

      return [...clonedEl].some((comp) => {
        if (comp.id === id) return false;

        const otherCompRef = itemRefs.current[comp.id].current;
        const otherRect = otherCompRef.getBoundingClientRect();

        const itemAreaOverlap =
          currentRect?.right >= otherRect?.left &&
          currentRect?.left <= otherRect?.right &&
          currentRect?.bottom >= otherRect?.top &&
          currentRect?.top <= otherRect?.bottom;

        if (itemAreaOverlap) return true;
      });
    }

    return false;
  };

  return { checkForOverlap, previewAreaRef };
};

import { useRef } from "react";

export const useOverlapChecker = () => {
  const previewAreaRef = useRef(null);

  const checkForOverlap = (id, itemRefs) => {
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
    }
    return false;
  };

  return { checkForOverlap, previewAreaRef };
};

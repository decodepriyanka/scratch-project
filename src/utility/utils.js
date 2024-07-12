export const getElements = () => {
  const previewElement = document.getElementById("cat-sprite");
  const messageBoxElement = document.getElementById("message-box");
  return { previewElement, messageBoxElement };
};

export const executeCommand = (command, actionsHistory) => {
  const { previewElement, messageBoxElement } = getElements();
  const style = window.getComputedStyle(previewElement);
  const matrix = new DOMMatrixReadOnly(style.transform);
  const currentX = matrix.m41;
  const currentY = matrix.m42;
  const currentRotation =
    matrix.a === 1 ? 0 : Math.round(Math.asin(matrix.b) * (180 / Math.PI));

  let newX = currentX;
  let newY = currentY;
  let newRotation = currentRotation;

  // Boundary checks to prevent the element from going out of the viewport
  const viewportWidth = window.innerWidth / 3;
  const viewportHeight = window.innerHeight;
  const elementRect = previewElement.getBoundingClientRect();

  // Parse command and update newX, newY, newRotation accordingly
  if (command.includes("Move X")) {
    newX += parseInt(command.split(" ")[2], 10);
    if (newX + elementRect.width > viewportWidth) {
      newX = viewportWidth - elementRect.width;
    } else if (newX < 0) {
      newX = 0;
    }
  } else if (command.includes("Move Y")) {
    newY += parseInt(command.split(" ")[2], 10);
    if (newY + elementRect.height > viewportHeight) {
      newY = viewportHeight - elementRect.height;
    } else if (newY < 0) {
      newY = 0;
    }
  } else if (command.includes("Turn anticlockwise")) {
    newRotation -= parseInt(command.split(" ")[2], 10);
  } else if (command.includes("Turn clockwise")) {
    newRotation += parseInt(command.split(" ")[2], 10);
  } else if (command.includes("Say")) {
    const words = command.split(" ");
    const sayIndex = words.indexOf("say") + 1;
    const forIndex = words.indexOf("for");
    let message = words.slice(sayIndex).join(" ").replace(/"/g, "");
    if (forIndex !== -1) {
      message = words.slice(sayIndex, forIndex).join(" ").replace(/"/g, "");
      const time = parseInt(words[forIndex + 1], 10) * 1000;
      messageBoxElement.style.display = "block";
      messageBoxElement.style.position = "relative";
      messageBoxElement.innerHTML = message;
      setTimeout(() => {
        messageBoxElement.style.display = "none";
      }, time);
    } else {
      messageBoxElement.style.display = "block";
      messageBoxElement.style.position = "relative";
      messageBoxElement.innerHTML = message;
      setTimeout(() => {
        messageBoxElement.style.display = "none";
      }, 1000);
    }
  } else if (command.includes("Think")) {
    const words = command.split(" ");
    const thinkIndex = words.indexOf("think") + 1;
    const message = words.slice(thinkIndex).join(" ").replace(/"/g, "");
    messageBoxElement.style.display = "block";
    messageBoxElement.style.position = "relative";
    messageBoxElement.innerHTML = message;
    setTimeout(() => {
      messageBoxElement.style.display = "none";
    }, 1000);
  } else if (command.includes("Show")) {
    previewElement.style.display = "block";
  } else if (command.includes("Hide")) {
    previewElement.style.display = "none";
  }

  if (actionsHistory) {
    actionsHistory.push({
      command,
      transform: `translate(${newX}px, ${newY}px) rotate(${newRotation}deg)`,
    });
  }

  previewElement.style.transform = `translate(${newX}px, ${newY}px) rotate(${newRotation}deg)`;
};

export const moveToPrevState = (command) => {
  const { previewElement, messageBoxElement } = getElements();
  if (command.includes("Say")) {
    const words = command.split(" ");
    const sayIndex = words.indexOf("say") + 1;
    const forIndex = words.indexOf("for");
    let message = words.slice(sayIndex).join(" ").replace(/"/g, "");
    if (forIndex !== -1) {
      message = words.slice(sayIndex, forIndex).join(" ").replace(/"/g, "");
      const time = parseInt(words[forIndex + 1], 10) * 1000;
      messageBoxElement.style.display = "block";
      messageBoxElement.style.position = "relative";
      messageBoxElement.innerHTML = message;
      setTimeout(() => {
        messageBoxElement.style.display = "none";
      }, time);
    } else {
      messageBoxElement.style.display = "block";
      messageBoxElement.style.position = "relative";
      messageBoxElement.innerHTML = message;
    }
  } else if (command.includes("Think")) {
    const words = command.split(" ");
    const thinkIndex = words.indexOf("think") + 1;
    const message = words.slice(thinkIndex).join(" ").replace(/"/g, "");
    messageBoxElement.style.display = "block";
    messageBoxElement.style.position = "relative";
    messageBoxElement.innerHTML = message;
  } else if (command.includes("Show")) {
    previewElement.style.display = "block";
  } else if (command.includes("Hide")) {
    previewElement.style.display = "none";
  }
};

export default { executeCommand, moveToPrevState };

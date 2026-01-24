import { updateElement } from "../core/stateActions.js";
import { setActiveInteraction } from "../main.js";

const widthInput = document.querySelector("#setWidth")
const heightInput = document.querySelector("#setHeight")

export function startResizeTopRight(e, element, div, canvas) {
    const canvasRect = canvas.getBoundingClientRect();
    const startX = element.x;
    const startY = element.y;
    const startWidth = element.width;
    const startHeight = element.height;

    const fixedBottomY = startY + startHeight;

    let newWidth = 0;
    let newHeight = 0;
    let mouseY = 0;

    const onMove = (ev) => {
        const shift = ev.shiftKey;
        const mouseX = ev.clientX - canvasRect.left;
        mouseY = ev.clientY - canvasRect.top;

        const largest =
            mouseX - startX > fixedBottomY - mouseY
                ? mouseX - startX
                : fixedBottomY - mouseY;

        newWidth = shift ? largest : Math.floor(mouseX - startX);
        newHeight = shift ? largest : Math.floor(fixedBottomY - mouseY);

        if (shift && element.type === "circle") {
            const size = Math.max(newWidth, newHeight);

            if (size > 20) {
                div.style.width = `${size}px`;
                div.style.height = `${size}px`;
                div.style.top = `${mouseY}px`;
                console.log(size)
                widthInput.value = size
                heightInput.value = size

            }
        } else if (newWidth > 20 && newHeight > 20) {
            div.style.width = `${newWidth}px`;
            div.style.height = `${newHeight}px`;
            div.style.top = `${mouseY}px`;
            widthInput.value = newWidth
            heightInput.value = newHeight
        }
    };

    attachResizeListeners(onMove, () => {
        if (newWidth > 20 && newHeight > 20) {
            updateElement(element.id, {
                width: newWidth,
                height: newHeight,
                y: mouseY,
            });
        }
    });
}

export function startResizeTopLeft(e, element, div, canvas) {
    const canvasRect = canvas.getBoundingClientRect();

    const startX = element.x;
    const startY = element.y;
    const startWidth = element.width;
    const startHeight = element.height;

    const fixedRightX = startX + startWidth;
    const fixedBottomY = startY + startHeight;

    let newWidth = 0;
    let newHeight = 0;
    let mouseX = 0;
    let mouseY = 0;

    const onMove = (ev) => {
        const shift = ev.shiftKey;
        mouseX = ev.clientX - canvasRect.left;
        mouseY = ev.clientY - canvasRect.top;
        const largest = fixedRightX - mouseX > fixedBottomY - mouseY ? fixedRightX - mouseX : fixedBottomY - mouseY

        newWidth = shift ? largest : Math.floor(fixedRightX - mouseX);
        newHeight = shift ? largest : Math.floor(fixedBottomY - mouseY);

        if (shift && element.type === "circle") {
            const size = Math.max(newWidth, newHeight);

            if (size > 20) {
                div.style.width = `${size}px`;
                div.style.height = `${size}px`;
                div.style.left = `${fixedRightX - size}px`;
                div.style.top = `${fixedBottomY - size}px`;
                widthInput.value = size
                heightInput.value = size

            }
        } else if (newWidth > 20 && newHeight > 20) {
            div.style.left = `${mouseX}px`;
            div.style.top = `${mouseY}px`;
            div.style.width = `${newWidth}px`;
            div.style.height = `${newHeight}px`;
            widthInput.value = newWidth
            heightInput.value = newHeight
        }
    };

    attachResizeListeners(onMove, () => {
        if (newWidth > 20 && newHeight > 20) {
            updateElement(element.id, {
                x: mouseX,
                y: mouseY,
                width: newWidth,
                height: newHeight,
            });
        }
    });
}

export function startResizeBottomRight(e, element, div, canvas) {
    const canvasRect = canvas.getBoundingClientRect();

    const startWidth = element.width;
    const startHeight = element.height;

    const startMouseX = e.clientX - canvasRect.left;
    const startMouseY = e.clientY - canvasRect.top;

    let newWidth = 0;
    let newHeight = 0;

    const onMove = (ev) => {
        const shift = ev.shiftKey;
        const mouseX = ev.clientX - canvasRect.left;
        const mouseY = ev.clientY - canvasRect.top;

        const largest = startWidth + (mouseX - startMouseX) > startHeight + (mouseY - startMouseY) ? startWidth + (mouseX - startMouseX) : startHeight + (mouseY - startMouseY)

        newWidth = shift ? largest : Math.floor(startWidth + (mouseX - startMouseX));
        newHeight = shift ? largest : Math.floor(startHeight + (mouseY - startMouseY));

        if (shift && element.type === "circle") {
            const size = Math.max(newWidth, newHeight);

            if (size > 20) {
                div.style.width = `${size}px`;
                div.style.height = `${size}px`;
                widthInput.value = size
                heightInput.value = size
            }
        } else if (newWidth > 20 && newHeight > 20) {
            div.style.width = `${newWidth}px`;
            div.style.height = `${newHeight}px`;
            widthInput.value = newWidth
            heightInput.value = newHeight
        }
    };

    attachResizeListeners(onMove, () => {
        if (newWidth > 20 && newHeight > 20) {
            updateElement(element.id, {
                width: newWidth,
                height: newHeight,
            });
        }
    });
}

export function startResizeBottomLeft(e, element, div, canvas) {
    const canvasRect = canvas.getBoundingClientRect();

    const startX = element.x;
    const startWidth = element.width;
    const startHeight = element.height;

    const fixedRightX = startX + startWidth;

    const startMouseX = e.clientX - canvasRect.left;
    const startMouseY = e.clientY - canvasRect.top;

    let newWidth = 0;
    let newHeight = 0;
    let mouseX = 0;

    const onMove = (ev) => {
        const shift = ev.shiftKey;
        mouseX = ev.clientX - canvasRect.left;
        const mouseY = ev.clientY - canvasRect.top;
        const largest = fixedRightX - mouseX > startHeight + (mouseY - startMouseY) ? fixedRightX - mouseX : startHeight + (mouseY - startMouseY)
        newWidth = shift ? largest : Math.floor(fixedRightX - mouseX);
        newHeight = shift ? largest : Math.floor(startHeight + (mouseY - startMouseY));

        if (shift && element.type === "circle") {
            const size = Math.max(newWidth, newHeight);

            if (size > 20) {
                div.style.width = `${size}px`;
                div.style.height = `${size}px`;
                div.style.left = `${fixedRightX - size}px`;
                widthInput.value = size
                heightInput.value = size

            }
        } else if (newWidth > 20 && newHeight > 20) {
            div.style.left = `${mouseX}px`;
            div.style.width = `${newWidth}px`;
            div.style.height = `${newHeight}px`;
            widthInput.value = newWidth
            heightInput.value = newHeight
        }
    };

    attachResizeListeners(onMove, () => {
        if (newWidth > 20 && newHeight > 20) {
            updateElement(element.id, {
                x: mouseX,
                width: newWidth,
                height: newHeight,
            });
        }
    });
}

function attachResizeListeners(onMove, onEnd) {
    document.addEventListener("mousemove", onMove);

    document.addEventListener(
        "mouseup",
        () => {
            setActiveInteraction(null)
            document.removeEventListener("mousemove", onMove);
            onEnd();
        },
        { once: true }

    );
}


import { updateElement } from "../core/stateActions.js";
import { setActiveInteraction } from "../main.js";

export function startResizeTopRight(e, element, div, canvas) {
console.log("triggered 1")
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

        newWidth = shift ? largest : mouseX - startX;
        newHeight = shift ? largest : fixedBottomY - mouseY;

        if (shift && element.type === "circle") {
            const size = Math.max(newWidth, newHeight);

            if (size > 20) {
                div.style.width = `${size}px`;
                div.style.height = `${size}px`;
                div.style.top = `${mouseY}px`;
            }
        } else if (newWidth > 20 && newHeight > 20) {
            div.style.width = `${newWidth}px`;
            div.style.height = `${newHeight}px`;
            div.style.top = `${mouseY}px`;
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


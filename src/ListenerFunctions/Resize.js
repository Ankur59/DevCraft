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

        newWidth = fixedRightX - mouseX;
        newHeight = fixedBottomY - mouseY;

        if (shift && element.type === "circle") {
            const size = Math.max(newWidth, newHeight);

            if (size > 20) {
                div.style.width = `${size}px`;
                div.style.height = `${size}px`;
                div.style.left = `${fixedRightX - size}px`;
                div.style.top = `${fixedBottomY - size}px`;
            }
        } else if (newWidth > 20 && newHeight > 20) {
            div.style.left = `${mouseX}px`;
            div.style.top = `${mouseY}px`;
            div.style.width = `${newWidth}px`;
            div.style.height = `${newHeight}px`;
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

        newWidth = startWidth + (mouseX - startMouseX);
        newHeight = startHeight + (mouseY - startMouseY);

        if (shift && element.type === "circle") {
            const size = Math.max(newWidth, newHeight);

            if (size > 20) {
                div.style.width = `${size}px`;
                div.style.height = `${size}px`;
            }
        } else if (newWidth > 20 && newHeight > 20) {
            div.style.width = `${newWidth}px`;
            div.style.height = `${newHeight}px`;
        }
    };


    function startResizeBottomLeft(e, element, div, canvas) {
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

            newWidth = fixedRightX - mouseX;
            newHeight = startHeight + (mouseY - startMouseY);

            if (shift && element.type === "circle") {
                const size = Math.max(newWidth, newHeight);

                if (size > 20) {
                    div.style.width = `${size}px`;
                    div.style.height = `${size}px`;
                    div.style.left = `${fixedRightX - size}px`;
                }
            } else if (newWidth > 20 && newHeight > 20) {
                div.style.left = `${mouseX}px`;
                div.style.width = `${newWidth}px`;
                div.style.height = `${newHeight}px`;
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

        newWidth = fixedRightX - mouseX;
        newHeight = startHeight + (mouseY - startMouseY);

        if (shift && element.type === "circle") {
            const size = Math.max(newWidth, newHeight);

            if (size > 20) {
                div.style.width = `${size}px`;
                div.style.height = `${size}px`;
                div.style.left = `${fixedRightX - size}px`;
            }
        } else if (newWidth > 20 && newHeight > 20) {
            div.style.left = `${mouseX}px`;
            div.style.width = `${newWidth}px`;
            div.style.height = `${newHeight}px`;
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


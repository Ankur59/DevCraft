import { editorState } from "./core/state.js";
import { createElement, selectElement, updateElement } from "./core/stateActions.js";
import { handleRotate } from "./utils/centerHandler.js";
import { addCornerHandles } from "./utils/cornerHandles.js";

const canvas = document.querySelector("#canvas")

const addRectangle = document.querySelector("#addRectangle")

canvas.addEventListener("click", (e) => {
    const elementNode = e.target.closest("[data-id]");

    if (!elementNode) {
        selectElement(null);
        renderCanvas();
    }
});



// This function has a particular job just to read the central state and render things in DOM
export const renderCanvas = () => {
    canvas.innerHTML = "";

    editorState.elements.forEach(element => {
        const div = document.createElement("div");
        const isSelected = editorState.selectedElementId === element.id;

        div.dataset.id = element.id;

        div.style.position = "absolute";
        div.style.left = `${element.x}px`;
        div.style.top = `${element.y}px`;
        div.style.width = `${element.width}px`;
        div.style.height = `${element.height}px`;
        div.style.backgroundColor = "red"
        div.style.transform = `rotate(${element.rotation}deg)`;
        div.style.zIndex = element.zIndex;
        div.style.borderRadius = "10px";

        if (isSelected) {
            addCornerHandles(div);
            handleRotate(div);

            const topright = div.querySelector("#top-right");
            const topleft = div.querySelector("#top-left");
            const bottomright = div.querySelector("#bottom-right");
            const bottomleft = div.querySelector("#bottom-left");

            // Listener for Top right 
            topright.addEventListener("mousedown", (e) => {
                e.stopPropagation();

                const canvasRect = canvas.getBoundingClientRect();

                const startMouseX = e.clientX - canvasRect.left;
                const startMouseY = e.clientY - canvasRect.top;

                const startX = element.x;
                const startY = element.y;
                const startWidth = element.width;
                const startHeight = element.height;

                const fixedBottomY = startY + startHeight;

                const onMove = (ev) => {
                    const mouseX = ev.clientX - canvasRect.left;
                    const mouseY = ev.clientY - canvasRect.top;

                    const newWidth = mouseX - startX;
                    const newHeight = fixedBottomY - mouseY;

                    if (newWidth > 20 && newHeight > 20) {
                        div.style.width = `${newWidth}px`;
                        div.style.height = `${newHeight}px`;
                        div.style.top = `${mouseY}px`;
                    }
                };

                document.addEventListener("mousemove", onMove);

                document.addEventListener(
                    "mouseup",
                    (ev) => {
                        document.removeEventListener("mousemove", onMove);

                        const mouseX = ev.clientX - canvasRect.left;
                        const mouseY = ev.clientY - canvasRect.top;
                        const newWidth = mouseX - startX
                        const newHeight = fixedBottomY - mouseY
                        if (newWidth > 20 && newHeight > 20) {
                            updateElement(element.id, {
                                width: newWidth,
                                height: newHeight,
                                y: mouseY
                            });
                        }

                    },
                    { once: true }
                );
            });

            // Listener for Top Left
            topleft.addEventListener("mousedown", (e) => {
                e.stopPropagation();

                const canvasRect = canvas.getBoundingClientRect();

                // const startMouseX = e.clientX - canvasRect.left;
                // const startMouseY = e.clientY - canvasRect.top;

                const startX = element.x;
                const startY = element.y;
                const startWidth = element.width;
                const startHeight = element.height;

                const fixedRightX = startX + startWidth;
                const fixedBottomY = startY + startHeight;

                const onMove = (ev) => {
                    const mouseX = ev.clientX - canvasRect.left;
                    const mouseY = ev.clientY - canvasRect.top;

                    const newWidth = fixedRightX - mouseX;
                    const newHeight = fixedBottomY - mouseY;

                    if (newWidth > 20 && newHeight > 20) {
                        div.style.left = `${mouseX}px`;
                        div.style.top = `${mouseY}px`;
                        div.style.width = `${newWidth}px`;
                        div.style.height = `${newHeight}px`;
                    }
                };

                document.addEventListener("mousemove", onMove);

                document.addEventListener(
                    "mouseup",
                    (ev) => {
                        document.removeEventListener("mousemove", onMove);

                        const mouseX = ev.clientX - canvasRect.left;
                        const mouseY = ev.clientY - canvasRect.top;
                        const newWidth = fixedRightX - mouseX
                        const newHeight = fixedBottomY - mouseY
                        if (newWidth > 20 && newHeight > 20) {
                            updateElement(element.id, {
                                x: mouseX,
                                y: mouseY,
                                width: newWidth,
                                height: newHeight
                            });
                        }

                    },
                    { once: true }
                );
            });

            // Listener for Bottom Right
            bottomright.addEventListener("mousedown", (e) => {
                e.stopPropagation();

                const canvasRect = canvas.getBoundingClientRect();

                const startX = element.x;
                const startY = element.y;
                const startWidth = element.width;
                const startHeight = element.height;

                const startMouseX = e.clientX - canvasRect.left;
                const startMouseY = e.clientY - canvasRect.top;

                const onMove = (ev) => {
                    const mouseX = ev.clientX - canvasRect.left;
                    const mouseY = ev.clientY - canvasRect.top;

                    const newWidth = startWidth + (mouseX - startMouseX);
                    const newHeight = startHeight + (mouseY - startMouseY);

                    if (newWidth > 20 && newHeight > 20) {
                        div.style.width = `${newWidth}px`;
                        div.style.height = `${newHeight}px`;
                    }
                };

                document.addEventListener("mousemove", onMove);

                document.addEventListener(
                    "mouseup",
                    (ev) => {
                        document.removeEventListener("mousemove", onMove);

                        const mouseX = ev.clientX - canvasRect.left;
                        const mouseY = ev.clientY - canvasRect.top;
                        const newWidth = startWidth + (mouseX - startMouseX)
                        const newHeight = startHeight + (mouseY - startMouseY)
                        if (newWidth > 20 && newHeight > 20) {
                            updateElement(element.id, {
                                width: startWidth + (mouseX - startMouseX),
                                height: startHeight + (mouseY - startMouseY)
                            });
                        }
                    },
                    { once: true }
                );
            });


            // Listener for bottom left
            bottomleft.addEventListener("mousedown", (e) => {
                e.stopPropagation();

                const canvasRect = canvas.getBoundingClientRect();

                const startX = element.x;
                const startY = element.y;
                const startWidth = element.width;
                const startHeight = element.height;

                const startMouseX = e.clientX - canvasRect.left;
                const startMouseY = e.clientY - canvasRect.top;

                const fixedRightX = startX + startWidth;

                const onMove = (ev) => {
                    const mouseX = ev.clientX - canvasRect.left;
                    const mouseY = ev.clientY - canvasRect.top;

                    const newWidth = fixedRightX - mouseX;
                    const newHeight = startHeight + (mouseY - startMouseY);

                    if (newWidth > 20 && newHeight > 20) {
                        div.style.left = `${mouseX}px`;
                        div.style.width = `${newWidth}px`;
                        div.style.height = `${newHeight}px`;
                    }
                };

                document.addEventListener("mousemove", onMove);

                document.addEventListener(
                    "mouseup",
                    (ev) => {
                        document.removeEventListener("mousemove", onMove);

                        const mouseX = ev.clientX - canvasRect.left;
                        const mouseY = ev.clientY - canvasRect.top;
                        const newWidth = fixedRightX - mouseX
                        const newHeight = startHeight + (mouseY - startMouseY)
                        if (newWidth > 20 && newHeight > 20) {
                            updateElement(element.id, {
                                x: mouseX,
                                width: newWidth,
                                height: newHeight
                            });
                        }

                    },
                    { once: true }
                );
            });

            

        }

        div.classList.add(isSelected ? "cursor-grab" : "cursor-pointer")

        div.addEventListener("click", () => { selectElement(div.dataset.id) })

        div.addEventListener("mousedown", (e) => {
            if (editorState.selectedElementId !== div.dataset.id) return;
            div.classList.add("cursor-grabbing")
            const elementRect = div.getBoundingClientRect();
            const canvasRect = canvas.getBoundingClientRect();

            const offsetX = e.clientX - elementRect.left;
            const offsetY = e.clientY - elementRect.top;

            const onMove = (ev) => {
                let nextX = ev.clientX - canvasRect.left - offsetX;
                let nextY = ev.clientY - canvasRect.top - offsetY;

                const maxX = canvasRect.width - div.offsetWidth;
                const maxY = canvasRect.height - div.offsetHeight;

                nextX = Math.max(0, Math.min(nextX, maxX));
                nextY = Math.max(0, Math.min(nextY, maxY));

                div.style.left = `${nextX}px`;
                div.style.top = `${nextY}px`;
            };

            document.addEventListener("mousemove", onMove);

            document.addEventListener(
                "mouseup",
                (ev) => {
                    document.removeEventListener("mousemove", onMove);

                    let finalX = ev.clientX - canvasRect.left - offsetX;
                    let finalY = ev.clientY - canvasRect.top - offsetY;

                    const maxX = canvasRect.width - div.offsetWidth;
                    const maxY = canvasRect.height - div.offsetHeight;

                    finalX = Math.max(0, Math.min(finalX, maxX));
                    finalY = Math.max(0, Math.min(finalY, maxY));

                    updateElement(div.dataset.id, {
                        x: finalX,
                        y: finalY
                    });
                },
                { once: true }
            );
        });

        if (element.type === "rectangle") {
            div.style.border = isSelected
                ? "2px dashed #ef4444"
                : "2px solid #3b82f6";
        }

        canvas.appendChild(div);
    });
};


addRectangle.addEventListener("click", () => {
    // Add new reactangle element to the central state
    const element = createElement("rectangle");

    // Render the canvas with new states
    renderCanvas()
});


// const renderElement = (element) => {
//     const div = document.createElement("div");

//     // Event listener on mouse enter
//     div.addEventListener("mouseenter", () => {

//     })



//     const canvas = document.querySelector("#canvas");

//     const maxX = canvas.clientWidth - element.width;
//     const maxY = canvas.clientHeight - element.height;

//     const randomX = Math.random() * maxX;
//     const randomY = Math.random() * maxY;

//     div.dataset.id = element.id;

//     div.style.position = "absolute";
//     div.style.left = `${randomX}px`;
//     div.style.top = `${randomY}px`;
//     div.style.width = `${element.width}px`;
//     div.style.height = `${element.height}px`;
//     div.style.transform = `rotate(${element.rotation}deg)`;
//     div.style.zIndex = element.zIndex;
//     div.style.borderRadius = "10px";
//     div.classList.add("cursor-nwse-resize");

//     if (element.type === "rectangle") {
//         div.style.border = "2px dashed #3b82f6";
//     }

//     return div;
// };

// const renderElement = (element) => {
//     const div = document.createElement("div");

//     div.dataset.id = element.id;

//     div.style.position = "absolute";
//     div.style.left = `${element.x}px`;
//     div.style.top = `${element.y}px`;
//     div.style.width = `${element.width}px`;
//     div.style.height = `${element.height}px`;
//     div.style.transform = `rotate(${element.rotation}deg)`;
//     div.style.zIndex = element.zIndex;
//     div.style.borderRadius = "10px"
//     div.classList.add("cursor-nwse-resize");
//     if (element.type === "rectangle") {
//         div.style.border = "2px dashed #3b82f6"
//     }

//     return div;
// };
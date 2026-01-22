import { editorState } from "./core/state.js";
import { createElement, selectElement, updateElement } from "./core/stateActions.js";
import { startResizeBottomLeft, startResizeBottomRight, startResizeTopLeft, startResizeTopRight } from "./ListenerFunctions/Resize.js";
import { handleRotate } from "./utils/centerHandler.js";
import { addCornerHandles } from "./utils/cornerHandles.js";

const canvas = document.querySelector("#canvas")

const addRectangle = document.querySelector("#addRectangle")

let activeInteraction = null

const addCircle = document.querySelector("#addCircle")

export function setActiveInteraction(value) {
    activeInteraction = value;
}

canvas.addEventListener("mousedown", (e) => {
    if (activeInteraction) return;

    const elementNode = e.target.closest("[data-id]");
    if (!elementNode) {
        selectElement(null);
        renderCanvas();
    }
});



canvas.addEventListener("mousedown", (e) => {
    const handle = e.target.closest("[data-handle]");
    if (!handle) return;

    e.stopPropagation();
    e.preventDefault();

    const elementDiv = handle.closest("[data-id]");
    if (!elementDiv) return;

    const elementId = elementDiv.dataset.id;
    const element = editorState.elements.find(el => el.id === elementId);
    if (!element) return;

    switch (handle.dataset.handle) {
        case "top-right":
            // resize
            setActiveInteraction("resize")
            startResizeTopRight(e, element, elementDiv, canvas);
            break;
        case "top-left":
            // resize
            startResizeTopLeft(e, element, elementDiv, canvas);
            break;
        case "bottom-left":
            startResizeBottomLeft(e, element, elementDiv, canvas);
            // resize
            break;
        case "bottom-right":
            startResizeBottomRight(e, element, elementDiv, canvas)
            // resize
            break;
    }
})

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
        div.style.backgroundColor =
            div.style.transform = `rotate(${element.rotation}deg)`;
        div.style.zIndex = element.zIndex;
        div.style.borderRadius = element.borderRadius || "10px";
        div.style.alignItems = "center"
        div.style.display = "flex"
        div.style.justifyContent = "center"

        if (isSelected) {
            addCornerHandles(div);
            handleRotate(div);

            div.addEventListener("mousedown", (e) => {
                if (e.srcElement.id !== "rotate-handle") return;
                if (editorState.selectedElementId !== div.dataset.id) return;
                const centerHandler = div.children[4]
                centerHandler.classList.add("cursor-grabbing")
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
        }

        div.classList.add(isSelected ? "cursor-pointer" : "cursor-pointer")

        div.addEventListener("click", () => { selectElement(div.dataset.id) })



        // if (element.type === "rectangle") {
        div.style.border = isSelected
            ? "2px dashed #ef4444"
            : "2px solid #3b82f6";
        // }

        canvas.appendChild(div);
    });
};


addRectangle.addEventListener("click", () => {
    // Add new reactangle element to the central state
    const element = createElement("rectangle");

    // Render the canvas with new states
    renderCanvas()
});



addCircle.addEventListener("click", () => {
    createElement("circle")
    renderCanvas()
})














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
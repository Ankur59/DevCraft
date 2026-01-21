import { editorState } from "./core/state.js";
import { createElement, selectElement, updateElement } from "./core/stateActions.js";

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
        div.style.transform = `rotate(${element.rotation}deg)`;
        div.style.zIndex = element.zIndex;
        div.style.borderRadius = "10px";



        div.classList.add(isSelected ? "cursor-grab" : "cursor-pointer")

        div.addEventListener("click", () => { selectElement(div.dataset.id) })

        div.addEventListener("mousedown", (e) => {
            if (editorState.selectedElementId !== div.dataset.id) return;
            
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
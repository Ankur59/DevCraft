import { editorState } from "./core/state.js";
import { createElement, getSelectedElement, selectElement, updateElement } from "./core/stateActions.js";
import { startResizeBottomLeft, startResizeBottomRight, startResizeTopLeft, startResizeTopRight } from "./ListenerFunctions/Resize.js";
import { handleRotate } from "./utils/centerHandler.js";
import { addCornerHandles } from "./utils/cornerHandles.js";

const canvas = document.querySelector("#canvas")

const addRectangle = document.querySelector("#addRectangle")

const textBox = document.querySelector("#textBox")

const colorContainer = document.querySelector("#colorContainer")

const addCircle = document.querySelector("#addCircle")

const setHeight = document.querySelector("#setHeight")

const setWidth = document.querySelector("#setWidth")

const input = document.querySelector("#textContent")

input.addEventListener("input", (e) => {
    const selected = getSelectedElement()
    if (selected.type === "textArea") {
        input.style.color = "black"
        updateElement(selected.id, { content: e.target.value })
    }
    else {
        input.style.color = "red"
    }
})

setWidth.addEventListener("input", (e) => {
    const maxWidth = canvas.getBoundingClientRect()
    console.log(maxWidth.width)
    const selected = getSelectedElement()
    if (e.target.value > 20 && e.target.value < maxWidth.width) {
        setWidth.style.color = "black"
        selected.width = e.target.value
        renderCanvas()
    }
    else if (e.target.value < 20 || e.target.value > maxWidth.width) {
        console.log("Width Not Allowed")
        setWidth.style.color = "red"
    }
});

setHeight.addEventListener("input", (e) => {
    const maxHeight = canvas.getBoundingClientRect()

    const selected = getSelectedElement()
    if (e.target.value > 20 && e.target.value < maxHeight.height) {
        setHeight.style.color = "black"
        selected.height = e.target.value
        renderCanvas()
    }
    else if (e.target.value < 20 || e.target.value > maxHeight.height) {
        console.log("Width Not Allowed")
        setHeight.style.color = "red"
    }
});

export function setActiveInteraction(value) {
    activeInteraction = value;
}

let activeInteraction = null

textBox.addEventListener("click", (e) => { createElement("textArea") })

canvas.addEventListener("mousedown", (e) => {
    console.log(activeInteraction)
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

        if (element.type !== "textArea") {
            div.style.backgroundColor = element.backgroundColor || ""
            div.style.position = "absolute";
            div.style.left = `${element.x}px`;
            div.style.top = `${element.y}px`;
            div.style.width = `${element.width}px`;
            div.style.height = `${element.height}px`;
            div.style.transform = `rotate(${element.rotation}deg)`;
            div.style.zIndex = element.zIndex;
            div.style.borderRadius = element.borderRadius || "10px";
            div.style.display = "flex";
            div.style.alignItems = "center";
            div.style.justifyContent = "center";
        }
        if (element.type === "textArea") {
            // wrapper
            div.style.position = "absolute";
            div.style.left = `${element.x}px`;
            div.style.top = `${element.y}px`;
            div.style.width = `${element.width}px`;
            div.style.height = `${element.height}px`;
            div.style.zIndex = element.zIndex;
            div.style.display = "flex";
            div.style.alignItems = "center";
            div.style.justifyContent = "center";

            // textarea
            const textarea = document.createElement("textarea");

            // default text
            textarea.value = element.content;

            // textarea.addEventListener("mousedown", (e) => {
            //     e.stopPropagation();
            // });

            textarea.addEventListener("click", (e) => {
                e.stopPropagation();
            });

            // textarea styles (destructured idea, logically)
            Object.assign(textarea.style, {
                width: "100%",
                height: "100%",
                resize: "none",
                border: "none",
                outline: "none",
                padding: "6px",
                background: "transparent",

                overflow: "auto",          // still scrollable
                scrollbarWidth: "none",    // Firefox
                msOverflowStyle: "none"    // IE / old Edge
            });

            textarea.addEventListener("input", (e) => {
                updateElement(div.dataset.id, { content: e.target.value }, { render: false });
            });


            div.appendChild(textarea);
            // console.log("this is div", div)
            addCornerHandles(div);
            // handleRotate(div);
        }
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

            // div.addEventListener("dblclick", (e) => { appendInput(div) })
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
    createElement("rectangle");
    renderCanvas()
});

addCircle.addEventListener("click", () => {
    createElement("circle")
    renderCanvas()
})

colorContainer.addEventListener("click", (e) => {
    if (e.srcElement.dataset.color) {
        const element = getSelectedElement()
        if (element) {
            updateElement(element.id, { backgroundColor: e.srcElement.dataset.color })
        }
    }
})

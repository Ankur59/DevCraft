import { editorState } from "./core/state.js";
import { changeLayerDown, changeLayerUP, createElement, deleteLayer, getSelectedElement, handleDeleteAll, removeElement, rotateLeft, rotateRight, selectElement, updateElement } from "./core/stateActions.js";
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

const rotateL = document.querySelector("#rotateLeft")

const rotateR = document.querySelector("#rotateRight")

document.addEventListener("keydown", (e) => {

    if (
        document.activeElement.tagName === "INPUT" ||
        document.activeElement.tagName === "TEXTAREA"
    ) {
        return;
    }

    const selected = getSelectedElement();
    if (!selected) return;

    const step = e.shiftKey ? 10 : 5;

    const maxX = canvas.clientWidth - selected.width;
    const maxY = canvas.clientHeight - selected.height;

    switch (e.key) {
        case "Delete":
            removeElement(selected.id);
            break;

        case "ArrowUp":
            updateElement(selected.id, {
                y: Math.max(0, selected.y - step),
            });
            break;

        case "ArrowDown":
            updateElement(selected.id, {
                y: Math.min(maxY, selected.y + step),
            });
            break;

        case "ArrowLeft":
            updateElement(selected.id, {
                x: Math.max(0, selected.x - step),
            });
            break;

        case "ArrowRight":
            updateElement(selected.id, {
                x: Math.min(maxX, selected.x + step),
            });
            break;
    }
});
const deleteAll = document.querySelector("#deleteAll")

deleteAll.addEventListener("click", () => {
    const ok = confirm("Are you sure you want to delete all elements? Note- It can't be recovered");

    if (ok) {
       handleDeleteAll()
    } else {
        // user clicked Cancel
        console.log("User cancelled");
    }
})
rotateL.addEventListener("click", (e) => {
    rotateLeft()
})

rotateR.addEventListener("click", (e) => {
    rotateRight()
})

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

const layerContainer = document.querySelector("#layerContainer")


layerContainer.addEventListener("click", (e) => {
    const actionBtn = e.target.closest("button");
    const card = e.target.closest("[data-id]:not(button)");
    if (!card) return;

    const layerId = card.dataset.id;

    if (actionBtn) {
        const action = actionBtn.dataset.id;

        const index = Number(
            card.querySelector("span").textContent.split(" ")[1]
        );

        if (action === "up") {
            changeLayerUP(layerId, action, index);
        }
        else if (action === "down") {
            changeLayerDown(layerId, action, index);
        }
        else if (action === "deleteLayer") {
            removeElement(layerId);
        }

        return;
    }


    selectElement(layerId)

});


export function createLayerCard(layerName, layerId) {
    const layerContainer = document.querySelector("#layerContainer");

    // Card
    const card = document.createElement("div");
    card.className =
        "bg-white rounded-lg shadow p-3 flex items-center justify-between mb-3";

    card.dataset.id = layerId;
    if (layerId === editorState.selectedElementId) {
        card.style.border = "1px dashed black"
    }

    // Layer name
    const name = document.createElement("span");
    name.className = "text-sm font-medium text-gray-700";
    name.textContent = layerName;

    // Actions container
    const actions = document.createElement("div");
    actions.className = "flex gap-2";

    // Up button
    const upBtn = document.createElement("button");
    upBtn.className =
        "w-7 h-7 flex items-center justify-center rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs";
    upBtn.textContent = "▲";
    upBtn.dataset.id = "up"

    // Down button
    const downBtn = document.createElement("button");
    downBtn.className =
        "w-7 h-7 flex items-center justify-center rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs";
    downBtn.textContent = "▼";
    downBtn.dataset.id = "down"

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.dataset.id = "deleteLayer"
    deleteBtn.className =
        "w-7 h-7 flex items-center justify-center rounded-md bg-red-100 hover:bg-red-200 text-red-600 text-xs";
    deleteBtn.textContent = "✕";

    // Assemble
    actions.appendChild(upBtn);
    actions.appendChild(downBtn);
    actions.appendChild(deleteBtn);

    card.appendChild(name);
    card.appendChild(actions);

    layerContainer.prepend(card);

    // Return references for listeners
    return { card, upBtn, downBtn, deleteBtn };
}

setWidth.addEventListener("input", (e) => {
    const maxWidth = canvas.getBoundingClientRect()
    // console.log(maxWidth.width)
    const selected = getSelectedElement()
    if (e.target.value > 20 && e.target.value < maxWidth.width) {
        setWidth.style.color = "black"
        selected.width = e.target.value
        renderCanvas()
    }
    else if (e.target.value < 20 || e.target.value > maxWidth.width) {
        // console.log("Width Not Allowed")
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
        // console.log("Width Not Allowed")
        setHeight.style.color = "red"
    }
});

export function setActiveInteraction(value) {
    activeInteraction = value;
}

let activeInteraction = null

textBox.addEventListener("click", (e) => { createElement("textArea") })

canvas.addEventListener("mousedown", (e) => {
    // console.log("runnign")
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

// This function has a particular job just to read the central state and render things in DOM for canvas
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

        div.style.border = isSelected
            ? "2px dashed #ef4444"
            : "2px solid #3b82f6";

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



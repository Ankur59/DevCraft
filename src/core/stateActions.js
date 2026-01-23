import { createLayerCard, renderCanvas } from "../main.js";
import { editorState } from "./state.js";

export const generateId = () => crypto.randomUUID()

// This function adds a item in the central element array
export const createElement = (type) => {

    const element = {
        id: generateId(),
        type, // "rect" | "circle" | "text" | "textArea"
        x: 100,
        y: 100,
        width: type === "circle" ? 80 : 120,
        height: type === "textArea" ? 120 : 80,
        rotation: 0,
        backgroundColor: "red",
        zIndex: editorState.elements.length + 1,
        content:
            type === "text" ? "Text" :
                type === "textArea" ? "...." :
                    null,
        borderRadius: type === "circle" ? "100%" : "10px",
        styles: {
            wrapper: {
                display: "flex",
                justifyContent: "center",
                border: "1px solid black",
                alignItems: "center"
            },
            textarea: {
                width: "100%",
                height: "100%",
                resize: "none",
                border: "1px solid black",
                outline: "none",
                margin: "10px"
            }
        }
    };

    editorState.elements.push(element);
    selectElement(element.id)
    // editorState.selectedElementId = element.id;
    const widthInput = document.querySelector("#setWidth")
    const heightInput = document.querySelector("#setHeight")
    widthInput.value = element.height
    heightInput.value = element.width
    widthInput.style.color = "black"
    widthInput.style.color = "black"
    // console.log(element)
    createLayerCard(`${element.type} ${element.zIndex}`, element.id)
    return element;
};

// This function is to toggle selected elements
export const selectElement = (id) => {
    const previous = editorState.selectedElementId
    if (id) {
        editorState.selectedElementId = id;
    }
    else if (!id) {
        editorState.selectedElementId = null
    }

    const widthInput = document.querySelector("#setWidth")
    const heightInput = document.querySelector("#setHeight")
    const target = getSelectedElement()

    if (target) {
        widthInput.style.color = "black"
        heightInput.style.color = "black"
        widthInput.value = target.width
        heightInput.value = target.height
        if (target.type === "textArea") {
            const input = document.querySelector("#textContent")
            input.value = target.content
        }
    }
    else if (target === null) {
        widthInput.value = 0
        heightInput.value = 0
    }


    renderCanvas()
    changeLayerFocus(editorState.selectedElementId, previous)
};

// This function is to delete a state
export const removeElement = (id) => {
    console.log("DELETE FUNCTION RUNNING")
    editorState.elements = editorState.elements.filter(el => el.id !== id);
    if (editorState.selectedElementId === id) {
        editorState.selectedElementId = null;
        selectElement(null)
    }
    console.log('delete function if done')
    deleteLayer(id)
    renderCanvas()
};

// Function to update some property of of the object
export const updateElement = (id, updates, options = {}) => {
    const element = editorState.elements.find(el => el.id === id);
    if (!element) return;

    Object.assign(element, updates);

    if (options.render !== false) {
        renderCanvas();
    }
};

export const getSelectedElement = () => {
    return editorState.elements.find(
        el => el.id === editorState.selectedElementId
    ) || null;
};



const changeLayerFocus = (id, previous) => {
    const layerContainer = document.querySelector("#layerContainer");

    if (!layerContainer) return;

    for (const element of layerContainer.children) {
        if (!id) {
            element.style.border = "none";
        }
        else if (id && previous) {
            if (element.dataset.id === previous) {
                element.style.border = "none";
            }
            else if (element.dataset.id === id) {
                element.style.border = "1px dashed black";
            }
        }
        else if (id && !previous) {
            if (element.dataset.id === id) {
                element.style.border = "1px dashed black";
            }
        }
    }
};


const deleteLayer = (id) => {
    const layerContainer = document.querySelector("#layerContainer")
    const child = layerContainer.querySelector(`[data-id="${id}"]`)
    console.log(child)
    child?.remove()
    const span = child.querySelector("span").innerText.split(" ")[1]
    editorState.elements.forEach((item) => {
        if (item.zIndex > span) {
            item.zIndex -= 1
            const target = layerContainer.querySelector(`[data-id="${item.id}"]`)
            const span = target.querySelector("span")
            console.log("this is inside span", span.innerText)
            span.innerText = `${item.type} ${item.zIndex}`
        }
    })
}
import { renderCanvas } from "../main.js";
import { editorState } from "./state.js";

export const generateId = () => crypto.randomUUID()

// This function adds a item in the central element array
export const createElement = (type) => {
    const canvas = document.querySelector("#canvas");

    const maxX = canvas.clientWidth - 120;
    const maxY = canvas.clientHeight - 80;

    const element = {
        id: generateId(),
        type,
        x: 100,//Math.random() * maxX
        y: 100,//Math.random() * maxY
        width: type === "circle" ? 80 : 120,
        height: 80,
        rotation: 0,
        zIndex: editorState.elements.length + 1,
        content: type === "text" ? "Text" : null,
        borderRadius: type === "circle" ? "100%" : "10px",
        styles: {}
    };

    editorState.elements.push(element);
    editorState.selectedElementId = element.id;

    return element;
};

// This function is to toggle selected elements
export const selectElement = (id) => {
    editorState.selectedElementId = id;
    renderCanvas()
};

// This function is to delete a state
export const removeElement = (id) => {
    editorState.elements = editorState.elements.filter(el => el.id !== id);

    if (editorState.selectedElementId === id) {
        editorState.selectedElementId = null;
    }
};

// Function to update some property of of the object
export const updateElement = (id, updates) => {
    const element = editorState.elements.find(el => el.id === id);
    if (!element) return;
    console.log(updates)
    Object.assign(element, updates);
    renderCanvas()
};

export const getSelectedElement = () => {
    return editorState.elements.find(
        el => el.id === editorState.selectedElementId
    ) || null;
};

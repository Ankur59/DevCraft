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



const createTextDiv = () => {
    const div = document.createElement()
}
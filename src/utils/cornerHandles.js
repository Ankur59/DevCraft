export const addCornerHandles = (parent) => {
    const positions = [
        {
            id: "top-left",
            cls: "top-0 left-0",
            cursor: "cursor-nwse-resize",
            side: "border-r border-b",
            translate: "-translate-x-1/2 -translate-y-1/2"
        },
        {
            id: "top-right",
            cls: "top-0 right-0",
            cursor: "cursor-nesw-resize",
            side: "border-l border-b",
            translate: "translate-x-1/2 -translate-y-1/2"
        },
        {
            id: "bottom-left",
            cls: "bottom-0 left-0",
            cursor: "cursor-nesw-resize",
            side: "border-r border-t",
            translate: "-translate-x-1/2 translate-y-1/2"
        },
        {
            id: "bottom-right",
            cls: "bottom-0 right-0",
            cursor: "cursor-nwse-resize",
            side: "border-l border-t",
            translate: "translate-x-1/2 translate-y-1/2"
        }
    ];


    positions.forEach(p => {
        const handle = document.createElement("div");
        handle.id = p.id
        handle.className = `
            absolute w-3 h-3 bg-white
            border border-black 
            ${p.side}
            ${p.cls}
            ${p.translate}
            ${p.cursor}
            rounded-full
        `;

        parent.appendChild(handle);
    });
};

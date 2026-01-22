export const handleRotate = (parent) => {
    const handle = document.createElement("div");

    handle.id = "rotate-handle";

    handle.className = `
    
        w-[50%] h-[50%]
        bg-[#DCE0E4]
       item-center

        rounded
        flex items-center justify-center
        cursor-grab
        select-none
    `;

    handle.textContent = "+";

    parent.appendChild(handle);
};

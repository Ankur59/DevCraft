export const handleRotate = (parent) => {
    const handle = document.createElement("div");

    handle.id = "rotate-handle";

    handle.className = `
        absolute
        top-0 left-1/2
        -translate-x-1/2 -translate-y-6
        w-6 h-6
        bg-[#DCE0E4]
        rounded-full
        flex items-center justify-center
        cursor-crosshair
        select-none
    `;

    handle.textContent = "⟲";

    parent.appendChild(handle);
};

const optionsContainerElement = document.querySelector(".options-container");
const menuIcon = optionsContainerElement.children[0];
const toolsContainerElement = document.querySelector(".tools-container");
const pencilToolContainerElement = document.querySelector(".pencil-tool-container");
const eraserToolContainerElement = document.querySelector(".eraser-tool-container");

//tools selector
const pencilToolElement = document.querySelector("#pencil");
const eraserToolElement = document.querySelector("#eraser");
const notesToolElement = document.querySelector("#notes");
const uploadToolElement = document.querySelector("#upload");

let optionFlag = true; //true -> showing tool , false -> hides tools
let pencilFlag = false;
let eraserFlag = false;

optionsContainerElement.addEventListener("click", () => {
    optionFlag = !optionFlag;

    //toggling
    optionFlag ? openTools() : closeTools();

});


function openTools() {
    menuIcon.classList.remove("fa-times");
    menuIcon.classList.add("fa-bars");

    toolsContainerElement.style.display = "flex";
}

function closeTools() {
    menuIcon.classList.add("fa-times");
    menuIcon.classList.remove("fa-bars");

    toolsContainerElement.style.display = "none";
    pencilToolContainerElement.style.display = "none";
    eraserToolContainerElement.style.display = "none";
}

//pencil tool
pencilToolElement.addEventListener("click", () => {
    pencilFlag = !pencilFlag;

    pencilFlag ? (pencilToolContainerElement.style.display = "block") : (pencilToolContainerElement.style.display = "none");
});

//eraser tool
eraserToolElement.addEventListener("click", () => {
    eraserFlag = !eraserFlag;

    eraserFlag ? (eraserToolContainerElement.style.display = "block") : (eraserToolContainerElement.style.display = "none");
});

//sticky notes tool
notesToolElement.addEventListener('click', (e) => {
    const template = `
        <div class="header-container">
            <div class="minimize">-</div>
            <div class="remove">x</div>
        </div>
        <div class="note-container">
            <textarea spellcheck="false"></textarea>
        </div>
    `;

    createStickyNote(template);
});

function noteActions(minimizeElement, removeElement, element) {
    minimizeElement.addEventListener("click", (e) => {
        const noteContainer = document.querySelector(".note-container");
        const display = getComputedStyle(noteContainer).getPropertyValue("display"); //to get to know about any property

        display === "none" ? (noteContainer.style.display = "block") : (noteContainer.style.display = "none");
    });

    removeElement.addEventListener("click", () => {
        element.remove();
    });
}


function dragAndDropNotes(element, e) {
    let shiftX = e.clientX - element.getBoundingClientRect().left;
    let shiftY = e.clientY - element.getBoundingClientRect().top;

    element.style.position = "absolute";
    element.style.zIndex = 1000;

    moveAt(e.pageX, e.pageY);

    function moveAt(pageX, pageY) {
        element.style.left = pageX - shiftX + "px";
        element.style.top = pageY - shiftY + "px";
    }

    function onMouseMove(e) {
        moveAt(e.pageX, e.pageY);
    }

    document.addEventListener("mousemove", onMouseMove);

    element.onmouseup = function () {
        document.removeEventListener("mousemove", onMouseMove);
        element.onmouseup = null;
    }
}

//upload tool listener
uploadToolElement.addEventListener("click", () => {
    //open file explorer
    const inputFileElement = document.createElement("input");
    inputFileElement.setAttribute("type", "file");
    inputFileElement.click();

    inputFileElement.addEventListener("change", (e) => {
        const file = inputFileElement.files[0];
        const url = URL.createObjectURL(file);


        const template = `
            <div class="header-container">
            <div class="minimize">-</div>
            <div class="remove">x</div>
            </div>
            <div class="note-container">
                <img src="${url}" />
            </div>
        `;

        createStickyNote(template);




    });


});

function createStickyNote(template) {
    const stickyContainer = document.createElement("div");
    stickyContainer.setAttribute("class", "sticky-container");
    stickyContainer.innerHTML = template;

    document.body.appendChild(stickyContainer);

    stickyContainer.onmousedown = function (e) {
        dragAndDropNotes(stickyContainer, e);
    }

    stickyContainer.ondragstart = function () {
        return false;
    }

    const minimizeElement = document.querySelector(".minimize");
    const removeElement = document.querySelector(".remove");

    noteActions(minimizeElement, removeElement, stickyContainer);
}
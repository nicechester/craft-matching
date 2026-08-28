const dropZone = document.getElementById("drop-zone");
fileInput.addEventListener("change", () => { if (fileInput.files[0]) loadCSV(fileInput.files[0]); });

dropZone.addEventListener("drop", dropHandler);
window.addEventListener("drop", (e) => e.preventDefault());
window.addEventListener("dragover", (e) => e.preventDefault());
dropZone.addEventListener("dragover", (e) => {
  const fileItems = [...e.dataTransfer.items].filter(
    (item) => item.kind === "file",
  );
  if (fileItems.length > 0) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  }
});

const preview = document.getElementById("preview");

function dropHandler(ev) {
  ev.preventDefault();
  const files = [...ev.dataTransfer.items]
    .map((item) => item.getAsFile())
    .filter((file) => file);
  loadCSV(files[0]);
}

const clearBtn = document.getElementById("clear-btn");
clearBtn.addEventListener("click", () => {
    const tbody = document.getElementById("match-tbody");
    tbody.innerHTML = '';
});

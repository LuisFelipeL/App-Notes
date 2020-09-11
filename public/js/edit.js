const textarea = document.getElementById("body");
let heightLimit =
  "innerHeight" in window
    ? window.innerHeight
    : document.documentElement.offsetHeight;
heightLimit -= 180;

function adjustHeight() {
  textarea.style.height = "";
  textarea.style.height = Math.min(textarea.scrollHeight, heightLimit) + "px";
}

textarea.oninput = adjustHeight;
adjustHeight();

const form = document.querySelector("form");
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.querySelector("#title").value;
  const body = document.querySelector("#body").value;

  const btnUpdate = document.getElementById("btn-update");
  const id = btnUpdate.dataset.id;
  fetch(`/notes/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `title=${title}&body=${body}`,
  }).then((res) => {
    window.location = `/notes/${id}`;
  });
});

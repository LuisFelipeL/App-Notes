const btnDelete = document.querySelector(".btn-delete");

btnDelete.addEventListener("click", function (e) {
  e.preventDefault();

  const id = btnDelete.dataset.id;

  if (confirm("Are you sure to delete this note?")) {
    fetch(`/notes/${id}`, {
      method: "DELETE",
    }).then((response) => {
      window.location = "/";
    });
  }
});

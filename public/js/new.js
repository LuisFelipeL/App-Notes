const textarea = document.getElementById("body");
const heightLimit = 1000;

textarea.oninput = () => {
  textarea.style.height = "";
  textarea.style.height = Math.min(textarea.scrollHeight, heightLimit) + "px";
};

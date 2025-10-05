// src/scripts/gestor.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("task-form");
  const btnClear = document.getElementById("btn-clear");

  const inputTitulo = form.querySelector("input[name='titulo']");
  const inputDescripcion = form.querySelector("input[name='descripcion']");
  const selPrioridad = form.querySelector("select[name='prioridad']");
  const selEstado = form.querySelector("select[name='estado']");
  const hiddenAction = form.querySelector("input[name='action']");
  const hiddenId = form.querySelector("input[name='id_tarea']");

  form.addEventListener("submit", (e) => {
    if (!inputTitulo.value || inputTitulo.value.trim().length < 3) {
      e.preventDefault();
      alert("⚠ El título debe tener al menos 3 caracteres");
      inputTitulo.focus();
    }
  });

  // Limpiar form
  btnClear?.addEventListener("click", () => {
    form.reset();
    selPrioridad.value = "media";
    selEstado.value = "por_hacer";
    hiddenAction.value = "create";
    hiddenId.value = "";
    inputTitulo.focus();
  });

  document.querySelectorAll(".task-card .btn-edit").forEach((btn) => {
    btn.addEventListener("click", (ev) => {
      const card = ev.target.closest(".task-card");
      if (!card) return;

      inputTitulo.value = card.dataset.titulo || "";
      inputDescripcion.value = card.dataset.descripcion || "";
      selPrioridad.value = card.dataset.prioridad || "media";
      selEstado.value = card.dataset.estado || "por_hacer";
      hiddenId.value = card.dataset.id_tarea || "";
      hiddenAction.value = "update";

      window.scrollTo({ top: 0, behavior: "smooth" });
      inputTitulo.focus();
    });
  });
});
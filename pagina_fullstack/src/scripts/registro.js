// Simple validación de contraseña
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".registro-form");
  const passwordInput = form.querySelector("input[name='password']");

  form.addEventListener("submit", (e) => {
    if (passwordInput.value.length < 6) {
      e.preventDefault();
      alert("⚠ La contraseña debe tener al menos 6 caracteres");
    }
  });
});
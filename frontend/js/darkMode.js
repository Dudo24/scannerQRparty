function toggleDarkMode() {
  document.body.classList.toggle("dark-mode")
  const isDark = document.body.classList.contains("dark-mode")
  localStorage.setItem("theme", isDark ? "dark" : "light")
  updateThemeButton()
}

function updateThemeButton() {
  const buttons = document.querySelectorAll(".theme-toggle")
  const isDark = document.body.classList.contains("dark-mode")
  buttons.forEach((btn) => {
    btn.querySelector(".theme-icon").textContent = isDark ? "☀️" : "🌙"
  })
}

document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme")
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode")
  }
  updateThemeButton()

  const themeToggleButtons = document.querySelectorAll(".theme-toggle")
  themeToggleButtons.forEach((btn) => {
    btn.addEventListener("click", toggleDarkMode)
  })
})

export { toggleDarkMode }

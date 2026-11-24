import { Icon } from "./Icon";

export function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const dark = !root.classList.contains("dark");
    root.classList.toggle("dark", dark);
    try {
      localStorage.setItem("theme", dark ? "dark" : "light");
    } catch {
      /* storage unavailable: the switch still works for this visit */
    }
  }
  return (
    <button type="button" onClick={toggle} aria-label="Toggle dark mode" className="grid size-10 place-items-center rounded-xl text-muted transition hover:bg-panel-2 hover:text-fg">
      <span className="dark:hidden">
        <Icon name="moon" />
      </span>
      <span className="hidden dark:block">
        <Icon name="sun" />
      </span>
    </button>
  );
}

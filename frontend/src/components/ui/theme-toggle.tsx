import { useTheme } from "../theme-provider"
import { Button } from "./button"
import { IconDeviceDesktop, IconMoon, IconSun } from "@tabler/icons-react"

function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  function toggleTheme() {
    console.log(theme)
    if (theme == "system") setTheme("dark")
    else if (theme == "dark") setTheme("light")
    else if (theme == "light") setTheme("system")
  }

  return (
    <Button variant="outline" onClick={toggleTheme}>
      {theme == "system" && <IconDeviceDesktop stroke={2} />}
      {theme == "dark" && <IconMoon stroke={2} />}
      {theme == "light" && <IconSun stroke={2} />}
    </Button>
  )
}

export { ThemeToggle }

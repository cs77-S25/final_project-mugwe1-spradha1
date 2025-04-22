import { Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "@/components/theme-provider"

export function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="cursor-pointer hover:text-orange-500 dark:ring-1" variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-[#A11833] hover:bg-[#3F030F] dark:bg-gray-800 dark:hover:bg-gray-900 transition-all duration-600 ease-in-out" align="end">
        <DropdownMenuItem className="hover:cursor-pointer text-white font-bold dark:hover:bg-white dark:hover:text-black transition-all duration-600 ease-in-out" onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem className="hover:cursor-pointer text-white font-bold dark:hover:bg-white dark:hover:text-black transition-all duration-600 ease-in-out" onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem className="hover:cursor-pointer text-white font-bold dark:hover:bg-white dark:hover:text-black transition-all duration-600 ease-in-out" onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

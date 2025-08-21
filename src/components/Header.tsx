import React, { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import useAuth from "@/hooks/useAuth"
import {
  Menu,
  Home,
  LayoutDashboard,
  User as UserIcon,
  Shield,
  LogOut,
  LogIn,
  Sun,
  Moon,
} from "lucide-react"

type AuthMode = "login" | "register"

const THEME_KEY = "theme"

function applyThemeClass(theme: "dark" | "light") {
  const root = document.documentElement
  if (theme === "dark") root.classList.add("dark")
  else root.classList.remove("dark")
}

const Header: React.FC = () => {
  const { user, isAdmin, signOut } = useAuth()
  const { toast } = useToast()
  const location = useLocation()

  // (mantido para compatibilidade, caso use AuthDialog em outro ponto)
  const [authDialogOpen, setAuthDialogOpen] = useState(false)
  const [authMode, setAuthMode] = useState<AuthMode>("login")

  // Tema (padrão claro)
  const [theme, setTheme] = useState<"dark" | "light">("light")
  useEffect(() => {
    const saved = (localStorage.getItem(THEME_KEY) as "dark" | "light") || "light"
    setTheme(saved)
    applyThemeClass(saved)
  }, [])

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark"
    setTheme(next)
    localStorage.setItem(THEME_KEY, next)
    applyThemeClass(next)
  }

  const handleSignOut = async () => {
    await signOut()
    toast({ title: "Você saiu da sua conta." })
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <header className="w-full border-b border-border/30 bg-background/70 dark:bg-darkBg/90 backdrop-blur">
      <div className="mx-auto max-w-6xl px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="La Vie Pâtisserie"
              className="h-12 sm:h-16 md:h-20 w-auto"
              loading="eager"
              decoding="async"
            />
          </Link>
        </div>

        {/* DESKTOP: navegação permanece igual */}
        <nav className="hidden md:flex items-center gap-2">
          <Link
            to="/"
            className={`px-3 py-2 rounded-lg text-sm font-medium hover:underline ${
              isActive("/") ? "text-foreground" : "text-foreground/80 dark:text-white/90"
            }`}
          >
            Início
          </Link>
          {user && (
            <Link
              to="/dashboard"
              className={`px-3 py-2 rounded-lg text-sm font-medium hover:underline ${
                isActive("/dashboard") ? "text-foreground" : "text-foreground/80 dark:text-white/90"
              }`}
            >
              Dashboard
            </Link>
          )}
          {user && (
            <Link
              to="/minha-conta"
              className={`px-3 py-2 rounded-lg text-sm font-medium hover:underline ${
                isActive("/minha-conta") ? "text-foreground" : "text-foreground/80 dark:text-white/90"
              }`}
            >
              Minha conta
            </Link>
          )}
          {isAdmin && (
            <Link
              to="/admin"
              className={`px-3 py-2 rounded-lg text-sm font-medium hover:underline ${
                isActive("/admin") ? "text-foreground" : "text-foreground/80 dark:text-white/90"
              }`}
            >
              Admin
            </Link>
          )}

          <Separator orientation="vertical" className="mx-2 h-6" />

          <Button
            onClick={toggleTheme}
            variant="default"
            className="inline-flex items-center gap-2"
            aria-label="Alternar tema"
            title="Alternar tema"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            <span>{theme === "dark" ? "Claro" : "Escuro"}</span>
          </Button>

          {user ? (
            <Button onClick={handleSignOut} variant="outline" className="ml-1">
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          ) : (
            <Link to="/minha-conta">
              <Button variant="outline" className="ml-1">
                <LogIn className="h-4 w-4 mr-2" />
                Entrar
              </Button>
            </Link>
          )}
        </nav>

        {/* MOBILE: ações + hamburger */}
        <div className="flex md:hidden items-center gap-2">
          {/* Toggle de tema (como já existia) */}
          <Button
            onClick={toggleTheme}
            size="icon"
            variant="default"
            aria-label="Alternar tema"
            title="Alternar tema"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {/* Sair/Entrar rápido (mantido) */}
          {user ? (
            <Button onClick={handleSignOut} size="icon" variant="outline" aria-label="Sair">
              <LogOut className="h-5 w-5" />
            </Button>
          ) : (
            <Link to="/minha-conta">
              <Button size="icon" variant="outline" aria-label="Entrar">
                <LogIn className="h-5 w-5" />
              </Button>
            </Link>
          )}

          {/* NOVO: Menu hamburger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" aria-label="Abrir menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 sm:w-96">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>

              <div className="mt-6 flex flex-col gap-1">
                <MobileItem to="/" icon={<Home className="h-5 w-5" />} label="Início" onClose />
                {user && (
                  <MobileItem
                    to="/dashboard"
                    icon={<LayoutDashboard className="h-5 w-5" />}
                    label="Dashboard"
                    onClose
                  />
                )}
                {user && (
                  <MobileItem
                    to="/minha-conta"
                    icon={<UserIcon className="h-5 w-5" />}
                    label="Minha conta"
                    onClose
                  />
                )}
                {isAdmin && (
                  <MobileItem
                    to="/admin"
                    icon={<Shield className="h-5 w-5" />}
                    label="Admin"
                    onClose
                  />
                )}

                <Separator className="my-3" />

                <Button onClick={toggleTheme} variant="secondary" className="justify-start">
                  {theme === "dark" ? <Sun className="h-5 w-5 mr-2" /> : <Moon className="h-5 w-5 mr-2" />}
                  Alternar para tema {theme === "dark" ? "claro" : "escuro"}
                </Button>

                {user ? (
                  <Button onClick={handleSignOut} variant="outline" className="justify-start">
                    <LogOut className="h-5 w-5 mr-2" />
                    Sair
                  </Button>
                ) : (
                  <Link to="/minha-conta">
                    <SheetClose asChild>
                      <Button variant="outline" className="justify-start">
                        <LogIn className="h-5 w-5 mr-2" />
                        Entrar
                      </Button>
                    </SheetClose>
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Se você usar AuthDialog em outro lugar, mantenha-o aqui. 
          Caso contrário, pode remover este bloco e as states relacionadas. */}
      {/* <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} mode={authMode} /> */}
    </header>
  )
}

const MobileItem: React.FC<{
  to: string
  icon: React.ReactNode
  label: string
  onClose?: boolean
}> = ({ to, icon, label, onClose }) => {
  const content = (
    <Link
      to={to}
      className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-base font-medium hover:bg-muted"
    >
      {icon}
      <span>{label}</span>
    </Link>
  )
  return onClose ? <SheetClose asChild>{content}</SheetClose> : <>{content}</>
}

export default Header

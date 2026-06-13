"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Calculator, Bot, User, Leaf, Menu, X, Camera } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { isSignedIn } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/calculator", label: "Calculator", icon: Calculator },
    { href: "/community", label: "Community", icon: User },
    { href: "/vision-scanner", label: "AI Scanner", icon: Camera },
    { href: "/advisor", label: "AI Advisor", icon: Bot },
    { href: "/profile", label: "Profile", icon: User },
  ];

  return (
    <nav aria-label="Main Navigation" className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 transition-all duration-300 shadow-sm">
      <div className="container mx-auto flex h-16 items-center px-4 justify-between relative">
        <div className="flex items-center gap-6 md:gap-10">
          
          <Link href="/" className="flex items-center space-x-2 group outline-none focus-visible:ring-2 focus-visible:ring-green-500 rounded-lg">
            <motion.div 
              whileHover={{ rotate: 180, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              className="p-1.5 bg-green-500/10 rounded-lg group-hover:bg-green-500/20 transition-colors shadow-inner"
            >
              <Leaf className="h-6 w-6 text-green-500" />
            </motion.div>
            <span className="font-extrabold tracking-tight bg-gradient-to-r from-green-600 to-emerald-400 bg-clip-text text-transparent text-xl drop-shadow-sm">
              CarbonWise
            </span>
          </Link>

          {isSignedIn && (
            <div className="hidden md:flex gap-6 lg:gap-8">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="relative group outline-none py-2"
                  >
                    <motion.div 
                      className={cn(
                        "flex items-center text-sm font-semibold transition-colors px-3 py-1.5 rounded-md",
                        isActive ? "text-green-700 dark:text-green-400 bg-green-500/10" : "text-muted-foreground group-hover:text-foreground group-focus-visible:ring-2 group-focus-visible:ring-green-500"
                      )}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {/* Flip animation on hover for the icon */}
                      <motion.div
                        initial={{ rotateY: 0 }}
                        whileHover={{ rotateY: 180 }}
                        transition={{ duration: 0.4 }}
                      >
                        <Icon className={cn("mr-2 h-4 w-4 transition-colors", isActive && "text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]")} />
                      </motion.div>
                      {link.label}
                    </motion.div>
                    
                    {/* Active Underline Indicator */}
                    {isActive && (
                      <motion.div 
                        layoutId="navbar-indicator"
                        className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-green-500 to-emerald-400 rounded-t-full shadow-[0_-2px_10px_rgba(34,197,94,0.5)]"
                        initial={false}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full"
            aria-label="Toggle dark mode"
            aria-pressed={theme === "dark"}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-blue-500" />
          </Button>

          {isSignedIn ? (
            <>
              <div className="hidden md:block">
                <UserButton appearance={{ elements: { avatarBox: "h-9 w-9 ring-2 ring-green-500/20 hover:ring-green-500/50 transition-all shadow-sm" } }} />
              </div>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Toggle mobile menu" aria-expanded={mobileMenuOpen} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </>
          ) : (
            <div className="space-x-2">
              <Button asChild variant="ghost" className="hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-950/50 hidden sm:inline-flex font-semibold">
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button asChild className="bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/20 transition-all hover:shadow-green-500/40 font-semibold rounded-full px-6">
                <Link href="/sign-up">Get Started</Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isSignedIn && mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden bg-background border-b shadow-lg"
          >
            <div className="flex flex-col p-4 space-y-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center p-3 rounded-xl text-sm font-semibold transition-all",
                      isActive ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 shadow-inner" : "text-muted-foreground hover:bg-muted"
                    )}
                  >
                    <Icon className={cn("mr-3 h-5 w-5", isActive ? "text-green-600 dark:text-green-400" : "text-muted-foreground")} />
                    {link.label}
                  </Link>
                );
              })}
              <div className="pt-4 pb-2 border-t flex items-center justify-between px-2 mt-2">
                <span className="text-sm font-medium text-muted-foreground">Account</span>
                <UserButton appearance={{ elements: { avatarBox: "h-9 w-9" } }} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

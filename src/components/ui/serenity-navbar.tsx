"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, MessageCircle, BookOpen, Heart, Sparkles, User as UserIcon, LogOut, Calendar, FileText, Settings } from "lucide-react"
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { supabase } from '@/lib/supabaseClient'

const SerenityNavbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { user, signOut } = useAuth()
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [fullName, setFullName] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    let mounted = true
    const load = async () => {
      if (!user) {
        if (!mounted) return
        setAvatarUrl(null)
        setFullName(null)
        setIsAdmin(false)
        return
      }
      const { data } = await supabase
        .from('profiles')
        .select('avatar_url, full_name, role')
        .eq('id', user.id)
        .maybeSingle()
      if (!mounted) return
      const profile = (data as { avatar_url: string | null; full_name: string | null; role: string | null } | null)
      setAvatarUrl(profile?.avatar_url || null)
      setFullName(profile?.full_name || null)
      setIsAdmin((profile?.role || '') === 'admin')
    }
    load()
    return () => { mounted = false }
  }, [user])

  const toggleMenu = () => setIsOpen(!isOpen)

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate(`/#${sectionId}`)
      setIsOpen(false)
      return
    }
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsOpen(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const navItems = [
    { label: "AI Therapist", onClick: () => scrollToSection('ai-therapist'), icon: MessageCircle, requireAuth: true },
    { label: "Wellness Tools", onClick: () => scrollToSection('wellness-tools'), icon: Sparkles },
    { label: "Music Therapy", onClick: () => scrollToSection('mood-music'), icon: Heart },
    { label: "E-Books", onClick: () => scrollToSection('ebooks'), icon: BookOpen },
    { label: "Journal", to: "/journal", icon: FileText, requireAuth: true },
    { label: "About", onClick: () => scrollToSection('about') },
  ]

  return (
    <div className="flex justify-center w-full py-4 px-4 fixed top-0 z-[2147483647] pointer-events-none">
      <div className="flex items-center justify-between px-6 py-3 bg-white/90 backdrop-blur-lg rounded-full shadow-[0_8px_30px_rgb(147,51,234,0.12)] w-full max-w-5xl relative pointer-events-auto border border-purple-100/50">
        
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <motion.div
            className="flex items-center space-x-2"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-md">
              <span className="text-white text-xl">🧘‍♀️</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                Serenity
              </h1>
            </div>
          </motion.div>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-6">
          {navItems.map((item) => {
            if (item.requireAuth && !user) return null
            
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.05 }}
              >
                {item.to ? (
                  <Link 
                    to={item.to} 
                    className="text-sm text-gray-700 hover:text-purple-600 transition-colors font-medium flex items-center gap-1.5"
                  >
                    {item.icon && <item.icon size={16} />}
                    {item.label}
                  </Link>
                ) : (
                  <button 
                    onClick={item.onClick}
                    className="text-sm text-gray-700 hover:text-purple-600 transition-colors font-medium flex items-center gap-1.5"
                  >
                    {item.icon && <item.icon size={16} />}
                    {item.label}
                  </button>
                )}
              </motion.div>
            )
          })}
        </nav>

        {/* Desktop User Controls */}
        <div className="hidden lg:flex items-center space-x-3">
          {!user ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              <Link
                to="/auth"
                className="inline-flex items-center justify-center px-5 py-2 text-sm text-white bg-gradient-to-r from-purple-600 to-pink-500 rounded-full hover:shadow-lg transition-all"
              >
                Sign In
              </Link>
            </motion.div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <motion.div 
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-purple-50 transition-all"
                  whileHover={{ scale: 1.05 }}
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={avatarUrl || undefined} alt={fullName || 'User'} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xs">
                      {(fullName || user.email || 'U').slice(0,1).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate hidden xl:block">
                    {fullName || 'User'}
                  </span>
                </motion.div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white/95 backdrop-blur-lg border-purple-100">
                <DropdownMenuLabel className="text-purple-900">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-purple-100" />
                <DropdownMenuItem onClick={() => navigate('/profile')} className="hover:bg-purple-50 cursor-pointer">
                  <UserIcon className="mr-2 h-4 w-4 text-purple-600" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/journal')} className="hover:bg-purple-50 cursor-pointer">
                  <FileText className="mr-2 h-4 w-4 text-purple-600" />
                  Journal
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/appointments')} className="hover:bg-purple-50 cursor-pointer">
                  <Calendar className="mr-2 h-4 w-4 text-purple-600" />
                  Appointments
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem onClick={() => navigate('/admin')} className="hover:bg-purple-50 cursor-pointer">
                    <Settings className="mr-2 h-4 w-4 text-purple-600" />
                    Admin Panel
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator className="bg-purple-100" />
                <DropdownMenuItem onClick={handleSignOut} className="hover:bg-red-50 cursor-pointer text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Mobile Menu Button */}
        <motion.button 
          className="lg:hidden flex items-center" 
          onClick={toggleMenu} 
          whileTap={{ scale: 0.9 }}
        >
          <Menu className="h-6 w-6 text-purple-600" />
        </motion.button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-gradient-to-br from-purple-50 to-pink-50 z-[2147483648] pt-24 px-6 lg:hidden pointer-events-auto"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <motion.button
              className="absolute top-6 right-6 p-2 bg-white rounded-full shadow-lg"
              onClick={toggleMenu}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <X className="h-6 w-6 text-purple-600" />
            </motion.button>

            <div className="flex flex-col space-y-6">
              {navItems.map((item, i) => {
                if (item.requireAuth && !user) return null
                
                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 + 0.1 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    {item.to ? (
                      <Link 
                        to={item.to} 
                        className="text-lg text-gray-900 font-medium flex items-center gap-2" 
                        onClick={toggleMenu}
                      >
                        {item.icon && <item.icon size={20} className="text-purple-600" />}
                        {item.label}
                      </Link>
                    ) : (
                      <button 
                        onClick={() => { item.onClick?.(); toggleMenu(); }}
                        className="text-lg text-gray-900 font-medium flex items-center gap-2 w-full text-left"
                      >
                        {item.icon && <item.icon size={20} className="text-purple-600" />}
                        {item.label}
                      </button>
                    )}
                  </motion.div>
                )
              })}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                exit={{ opacity: 0, y: 20 }}
                className="pt-6 space-y-4"
              >
                {!user ? (
                  <Link
                    to="/auth"
                    className="inline-flex items-center justify-center w-full px-5 py-3 text-base text-white bg-gradient-to-r from-purple-600 to-pink-500 rounded-full hover:shadow-lg transition-all"
                    onClick={toggleMenu}
                  >
                    Sign In
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow-md"
                      onClick={toggleMenu}
                    >
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={avatarUrl || undefined} alt={fullName || 'User'} />
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                          {(fullName || user.email || 'U').slice(0,1).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{fullName || 'User'}</p>
                        <p className="text-sm text-gray-500">View Profile</p>
                      </div>
                    </Link>
                    <button
                      onClick={() => { handleSignOut(); toggleMenu(); }}
                      className="inline-flex items-center justify-center w-full px-5 py-3 text-base text-red-600 bg-white border-2 border-red-200 rounded-full hover:bg-red-50 transition-all"
                    >
                      <LogOut className="mr-2 h-5 w-5" />
                      Sign Out
                    </button>
                  </>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export { SerenityNavbar }

import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FiMenu, FiX, FiBell, FiLogOut, FiUser, FiShield, FiChevronDown } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'

const LOGO = () => (
  <Link to="/" className="flex items-center gap-3 group">
    <div className="relative">
      <div className="w-9 h-9 grad-burgundy rounded-xl flex items-center justify-center shadow-[var(--shadow-burgundy)] group-hover:scale-105 transition-transform duration-300">
        <span className="font-display font-bold text-[var(--cream)] text-lg leading-none">P</span>
      </div>
      <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[var(--gold-light)] rounded-full border-2 border-white status-dot"/>
    </div>
    <div className="leading-none">
      <span className="font-display font-bold text-[17px] text-[var(--cream)] tracking-tight">Pass</span>
      <span className="font-display font-bold text-[17px] text-[var(--gold-light)] tracking-tight">With</span>
      <span className="font-display font-bold text-[17px] text-[var(--cream)] tracking-tight">AI</span>
    </div>
  </Link>
)

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen]         = useState(false)
  const [userMenu, setUserMenu] = useState(false)
  const { user, role, logout }  = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])
  useEffect(() => setOpen(false), [pathname])

  const navLinks = !user
    ? [{ to:'/', label:'Home' }, { to:'/student/login', label:'Students' }, { to:'/admin/login', label:'Admins' }]
    : role==='student'
    ? [{ to:'/student/dashboard', label:'Dashboard' }, { to:'/student/request', label:'New Request' }, { to:'/student/status', label:'My Requests' }]
    : [{ to:'/admin/dashboard', label:'Dashboard' }, { to:'/admin/requests', label:'Requests' }, { to:'/admin/analytics', label:'Analytics' }, { to:'/admin/audit-logs', label:'Audit Logs' }]

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass-dark shadow-2xl shadow-[var(--burgundy-deep)]/30' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex items-center justify-between h-16">
            <LOGO />

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(({ to, label }) => (
                <Link key={to} to={to}
                  className={`px-4 py-2 rounded-xl text-sm font-medium font-body transition-all duration-200 ${
                    pathname === to
                      ? 'bg-white/12 text-[var(--cream)] border border-white/12 shadow-inner'
                      : 'text-[var(--cream)]/65 hover:text-[var(--cream)] hover:bg-white/8'
                  }`}>
                  {label}
                </Link>
              ))}
          </div>

            {/* Right */}
            <div className="hidden md:flex items-center gap-2.5">
              {user ? (
                <>
                  <button className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-white/8 border border-white/12 text-[var(--cream)]/70 hover:text-[var(--cream)] hover:bg-white/15 transition-all duration-200">
                    <FiBell size={15}/>
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--gold-light)] rounded-full animate-pulse border border-[var(--burgundy-deep)]"/>
                  </button>
                  <div className="relative">
                    <button onClick={() => setUserMenu(p => !p)}
                      className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white/8 border border-white/12 hover:bg-white/15 transition-all duration-200">
                      <div className="w-7 h-7 rounded-lg grad-burgundy flex items-center justify-center flex-shrink-0">
                        {role==='admin' ? <FiShield size={12} className="text-[var(--cream)]"/> : <FiUser size={12} className="text-[var(--cream)]"/>}
                      </div>
                      <span className="text-[var(--cream)] text-sm font-medium font-body max-w-[100px] truncate">{user?.name?.split(' ')[0] || 'User'}</span>
                      <FiChevronDown size={12} className={`text-[var(--cream)]/50 transition-transform ${userMenu?'rotate-180':''}`}/>
                    </button>
                    {userMenu && (
                      <div className="absolute top-full right-0 mt-2 w-44 glass-dark rounded-2xl overflow-hidden border border-white/12 shadow-2xl anim-scale-up">
                        <Link to={role==='admin'?'/admin/profile':'/student/profile'}
                          onClick={()=>setUserMenu(false)}
                          className="flex items-center gap-2.5 px-4 py-3 text-[var(--cream)]/70 hover:text-[var(--cream)] hover:bg-white/10 transition-colors text-sm font-body">
                          <FiUser size={13}/> My Profile
                        </Link>
                        <div className="h-px bg-white/8"/>
                        <button onClick={()=>{ logout(); navigate('/'); setUserMenu(false) }}
                          className="w-full flex items-center gap-2.5 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-sm font-body">
                          <FiLogOut size={13}/> Sign Out
                        </button>
                      </div>
                    )}
          </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/student/login"
                    className="px-4 py-2 text-[var(--cream)]/70 hover:text-[var(--cream)] text-sm font-medium font-body transition-colors">
                    Sign In
                  </Link>
                  <Link to="/student/signup"
                    className="btn-magnetic px-5 py-2 grad-burgundy text-[var(--cream)] text-sm font-semibold rounded-xl shadow-[var(--shadow-burgundy)] font-body">
                    Get Started
                  </Link>
        </div>
              )}
      </div>

            {/* Mobile */}
            <button onClick={() => setOpen(p=>!p)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-white/8 border border-white/12 text-[var(--cream)]">
              {open ? <FiX size={17}/> : <FiMenu size={17}/>}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${open?'max-h-96':'max-h-0'}`}>
          <div className="glass-dark border-t border-white/8 px-5 py-4 space-y-1">
            {navLinks.map(({to,label}) => (
              <Link key={to} to={to} className="block px-4 py-3 rounded-xl text-[var(--cream)]/70 hover:text-[var(--cream)] hover:bg-white/8 text-sm font-body transition-colors">
                {label}
              </Link>
            ))}
            {!user && (
              <div className="pt-2 flex gap-2">
                <Link to="/student/signup" className="flex-1 btn-magnetic py-3 grad-burgundy text-[var(--cream)] text-sm font-semibold rounded-xl text-center font-body">Sign Up</Link>
                <Link to="/admin/login"    className="flex-1 py-3 border border-white/20 text-[var(--cream)]/70 text-sm font-semibold rounded-xl text-center font-body hover:bg-white/8 transition-colors">Admin</Link>
      </div>
            )}
            {user && (
              <button onClick={()=>{logout();navigate('/')}} className="w-full flex items-center gap-2 px-4 py-3 text-red-400 text-sm font-body">
                <FiLogOut size={13}/> Sign Out
        </button>
            )}
          </div>
        </div>
      </nav>

      {/* Overlay for user menu */}
      {userMenu && <div className="fixed inset-0 z-40" onClick={()=>setUserMenu(false)}/>}
    </>
  )
}
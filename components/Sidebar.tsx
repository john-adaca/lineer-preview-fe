'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Home, Users, Building2, ListTodo, Send, Mail, LucideIcon } from 'lucide-react'

interface NavItem {
  name: string
  href: string
  icon: LucideIcon
  enabled :boolean
}

const baseNavItems: NavItem[] = [
  { name: 'Home', href: '/', icon: Home  , enabled:true},
  { name: 'Contacts', href: '/contacts', icon: Users, enabled:false },
  { name: 'Companies', href: '/companies', icon: Building2 , enabled:false},
  { name: 'Lists', href: '/lists', icon: ListTodo, enabled:false },
  { name: 'Campaigns', href: '/campaigns', icon: Send , enabled:false},
  { name: 'Tasks', href: '/tasks', icon: ListTodo, enabled:false },
  { name: 'Inbox', href: '/inbox', icon: Mail , enabled:false},
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white flex flex-col border-r border-gray-200">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">lineer</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        {baseNavItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          const baseClassName = `flex items-center gap-3 px-6 py-3 transition-colors ${
            isActive
              ? 'bg-primary text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`

          if (!item.enabled) {
            return (
              <div
                key={item.href}
                className={`${baseClassName} opacity-50 cursor-not-allowed pointer-events-none`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </div>
            )
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={baseClassName}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Active Workspace */}
      <div className="p-6 border-t border-gray-200">
        <div className="text-xs text-gray-500 mb-2">Active Workspace</div>
        <div className="font-bold text-gray-900">Workspace 1</div>
        <div className="text-sm text-gray-500 mt-1">2 Active Campaigns</div>
      </div>
    </div>
  )
}


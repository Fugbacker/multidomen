import React from 'react'
import Link from 'next/link'
import MobileNavigation from '@/Components/mobile-navigation'
import Navigation from '@/Components/navigation'

export default function HeaderFcad ({ host }) {
  return (
    <header className="small">
      <div className="top_menu">
        <div className="menus" id="menu">
        <div className="logo">
          <div className="logo_name"><Link href="/" className="logo__name">{host}</Link></div>
          <strong className="logo_descr">Навигатор данных</strong>
        </div>
          <Navigation />
          <MobileNavigation />
        </div>
      </div>
    </header>
  )
}

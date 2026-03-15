import React from 'react'
import Link from 'next/link'
import MobileNavigation from '@/Components/mobile-navigation'
import Navigation from '@/Components/navigation'

export default function HeaderFcad () {
  return (
    <header className="small">
      <div className="top_menu">
        <div className="menus" id="menu">
        <div className="logo">
          <div className="logo_name"><Link href="/" className="logo__name">fcad.su</Link></div>
          <strong className="logo_descr">Навигатор данных</strong>
        </div>
          <Navigation />
          <MobileNavigation />
        </div>
      </div>
      <div id="top"></div>
    </header>
  )
}

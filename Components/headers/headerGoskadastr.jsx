import React from 'react'
import Link from 'next/link'
import MobileNavigation from '@/Components/mobile-navigation'
import Navigation from '@/Components/navigation'
import style from '@/styles/goskadastr.module.css'

export default function HeaderGoskadastr ({ host }) {
  return (
    <header >
      <div className={style.top_menu}>
        <div className={style.menus} id="menu">
        <div className={style.logo}>
          <div className={style.logo_name}><Link href="/" className={style.logo__name}>{host}</Link></div>
          <strong className={style.logo_descr}>Кадастровый сервис</strong>
        </div>
          <Navigation />
          <MobileNavigation />
        </div>
      </div>
    </header>
  )
}

import React from 'react'
import Link from 'next/link'
import MobileNavigation from '@/Components/mobile-navigation'
import Navigation from '@/Components/navigation'
import style from '@/styles/fegrn.module.css'


export default function HeaderFegrn ({ host }) {
  return (
    <header className={style.small}>
      <div className={style.layout2}>
        <div className={style.header__medium}>
          <div className={`${style["flex-ac-jcb"]}`}>
            <Link href="/">
              <div className={style["header__logo-info"]}>
                <div className={style["header__logo-title"]}>{host}</div>
                <div className={style["header__logo-desc"]}>Федеральный кадастровый сервис</div>
              </div>
            </Link>
            <div className={`${style["flex-ac"]}`}>
              <div className={style["header__schedule-support"]}>(Поддержка: c 09:00 до 17:00)</div>
              <div className={`${style.mail} ${style["h-mylo"]}`} data-item1="nspd.su" data-item2="e-mail: admin"></div>
              {/* <a href="/" className={`${style["personal_area-btn"]} ${style.idle} ${style.pc}`}><span>Личный кабинет</span></a> */}
            </div>
          </div>
        </div>
      </div>
      <div className={style.top_menu}>
        <div className={style.menus} id="menu">
          <Navigation />
          <MobileNavigation />
        </div>
      </div>
    </header>
  )
}

import React from 'react'
import Link from 'next/link'
import MobileNavigation from '@/Components/mobile-navigation'
import Navigation from '@/Components/navigation'
import style from '@/styles/goskadastr.module.css'

export default function HeaderGoskadastr () {
  return (
    <header >
      <div className={style.top_menu}>
        <div className={style.menus} id="menu">
        <div className={style.logo}>
          <div className={style.logo_name}><Link href="/" className={style.logo__name}>nspdm</Link></div>
          <strong className={style.logo_descr}>Кадастровый сервис</strong>
        </div>
          <Navigation />
          <MobileNavigation />
        </div>
      </div>
      {/* <div className={style.delay}>
        <div className={style.delayText}>
          Внимание! В связи с существенным повышением цен на услуги ФГИС Росреестра, с 13 января поднимутся цены на отчеты, выдаваемые сервисом. Успейте заказать интересующие вас отчеты по старым ценам.
        </div>
      </div> */}
      {/* <div className={style.header_logo}>
        <div className={style.support}>
          <div className={style.mail}>Техническая поддержка <span className={style.nobr}>с 9.00 до 21.00 мск</span></div>
          <div className={`${style.mail} ${style["h-mylo"]}`} data-item1="nspdm.su" data-item2="e-mail: admin"></div>
        </div>
      </div> */}

    </header>
  )
}

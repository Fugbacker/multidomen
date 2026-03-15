import React from 'react'
import Link from "next/link"
import style from '@/styles/goskadastr.module.css'

export const NavLinks = () => {
  return (
    <nav id="nav-wrap">
    <ul id="nav">
      <li><Link className={`${style.bold} ${style.button_menu}`} href="/" title='публичная кадастровая карта'>Кадастровая карта</Link></li>
      {/* <li><Link className={style.button_menu} href="/" title='численность населения России на 2026 год'>Население</Link></li> */}
      <li><Link className={style.button_menu} href="/" title='Справка о кадастровой стоимости'>Кадастровая стоимость</Link></li>
      <li><Link className={style.button_menu} href="/" title='кадастровый номер по адресу объекта недвижимости'>Кадастровый номер</Link></li>

      <li><Link className={style.button_menu} href="/" title='Справочная информация по объектам недвижимости в режиме online'>Справочная информация</Link></li>
      {/* <li><Link className={style.button_menu} href="/" title='кадастровый учет земельных участков'>Участки</Link></li> */}
      {/* <li><Link className="button_menu" href="https://t.me/goskad_bot">Телеграм бот</Link></li> */}
    </ul>
  </nav>
  )
}

export default NavLinks






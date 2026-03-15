import React from 'react'
import NavLinks from './navigation/navlinks'
import style from '@/styles/goskadastr.module.css'

export const Navigation = () => {
  return (
    <nav className={style.header__menu}>
      <NavLinks />
    </nav>
  )
}

export default Navigation
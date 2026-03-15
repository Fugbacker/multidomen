import React, { useEffect, useState } from 'react'
import macroRegions from '@/Components/files/macroRegions'
import Link from 'next/link'
import axios from 'axios'
import CryptoJS from 'crypto-js/';
import style from '@/styles/goskadastr.module.css'
import { encryptBase62 } from '@/utils/base62'


const MacroRegions = ({ host }) => {

  const sortedMacroRegions = macroRegions.sort((a, b) => {
    const nameA = a.name.toLowerCase()
    const nameB = b.name.toLowerCase()
    return nameA.localeCompare(nameB)
  })

  return (
    <div className={style.regionsContainer}>
      {sortedMacroRegions.map((it, index) => {

        // Формируем строку для шифрования
        const strToEncrypt = `${it.key}|${it.id}`

        // Короткий Base62 URL
        const urlCode = encryptBase62(strToEncrypt, host) // ключ можно любой фиксированный

        return (
          <Link className={style.regionName} href={`/map/${urlCode}`} key={index}>
            <div className={style.name}>{it.name}</div>
          </Link>
        )
      })}
    </div>
  )
}

export default MacroRegions
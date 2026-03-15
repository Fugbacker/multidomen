import React, { useEffect, useState } from 'react'
import macroRegions from '@/Components/files/macroRegions'
import { encryptBase62 } from '@/utils/base62'
import Link from 'next/link'
import axios from 'axios'
import style from '@/styles/rosegrn.module.css'

export default function MacroRegionsRosegrn ({ host }) {

  const sortedMacroRegions = macroRegions.sort((a, b) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    return 0;
  });


  return (
    <div className={style.regionsContainer}>
    {sortedMacroRegions.map((it, index) => {

    const strToEncrypt = `${it.id}|${it.key}`
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


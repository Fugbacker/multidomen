import React from 'react'
import Link from 'next/link'
import style from '@/styles/fegrn.module.css'

export default function FooterFegrn  ({ host, url }) {
  return (
    <footer>
      <div className={style.layoutFooter}>
        <div className={style.footinfo}>
            <div className={style.footname}>
              <div className={style.header3}>{host}</div>
              {/* <div className="h3">ИП Золотарев Е.А. ИНН 634003496894</div> */}
              <div>
                <span>E-mail: <span className={`${style["h-mylo"]}`} data-item1="nspd.su" data-item2="admin"></span></span>
                {/* <span className=""><span className="h-mylo" data-item1="ИП Золотарев Е.А. ИНН 634003496894" ></span></span> */}
              </div>
            </div>
            <div>
              <p className={style.copy}>2015-2026 © Все права защищены. <a href={`https://${host}`}>{host}</a><br/><br/>
              Сайт не является официальным сайтом, официальный сайт Росреестра - rosreestr.gov.ru
              </p>
              <div className={style.payLogo}></div>
            </div>
          </div>
          <div className={style.rigthContainer}>
            <div className={style.footLinkContainer}>
            <div className={style.footlink}>
              <div className={style.header3}>Информация</div>
              <menu>
                <li><Link href="/" title="Кадастровая карта">Главная</Link></li>
                <li><Link href="/privacy-policy" title="">Политика конфиденциальности</Link></li>
                <li><Link href="/agreement" title="">Пользовательское соглашение</Link></li>
                <li><Link href="/public-offer" title="">Оферта</Link></li>
              </menu>
            </div>
            <div className={style.footnav}>
              <div className={style.header3}>Кадастр</div>
              <menu>
                <li><Link href={url} title="Межевание">Межевание</Link></li>
                <li><Link href={url} title="Схема предварительного согласования участка">Схема участка</Link></li>
                <li><Link href={url} title="Категория земель">Категория земель</Link></li>
                <li><Link href={url} title="Границы участков">Границы участков</Link></li>
                <li><Link href={url} title="земельные участки">Земельные участки</Link></li>
              </menu>
            </div>
            <div className={style.footnav}>
              <div className={style.header3}>Услуги</div>
              <menu>
                <li><Link href={url} title="Кадастровые данные">Отчеты из ЕГРН</Link></li>
                <li><Link href={url} title="Справка о кадастровой стоимости">Кадастровая стоимость</Link></li>
                <li><Link href={url} title="Узнать кадастровый номер по адресу">Кадастровый номер</Link></li>
                <li><Link href={url} title="Публичная кадастровая карта">Кадастровая карта</Link></li>
                <li><Link href={url} title="справочная информация по объектам недвижимости в режиме online">Справочная информация</Link></li>
              </menu>
            </div>
          </div>
          </div>
      </div>
    </footer>
  )
}

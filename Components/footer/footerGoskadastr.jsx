import React from 'react'
import Link from 'next/link'
import style from '@/styles/goskadastr.module.css'

export default function FooterGoskadastr ({ host, url }) {
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
              <p className={style.copy}>2015-2023 © Все права защищены. <a href={`https://${host}`}>{host}</a><br/><br/>
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
                <li><Link href="/" title="Отчет из ЕГРН">Главная</Link></li>
                {/* <li><a href="/contacts" title="">Контакты</a></li> */}
                <li><Link href="/privacy-policy" title="">Политика конфиденциальности</Link></li>
                <li><Link href="/agreement" title="">Пользовательское соглашение</Link></li>
                <li><Link href="/public-offer" title="">Оферта</Link></li>
                {/* <li><a href="/info" title="Информационный раздел">Информационный раздел</a></li> */}
              </menu>
            </div>
            <div className={style.footnav}>
              <div className={style.header3}>Кадастр</div>
              <menu>
                <li><Link href={url} title="Схема предварительного согласования участка">Схема участка</Link></li>
                <li><Link href={url} title="Межевание">Межевание</Link></li>
                <li><Link href={url} title="Границы участков">Границы участков</Link></li>
                <li><Link href={url} title="Категория земель">Категория земель</Link></li>
              </menu>
            </div>
            <div className={style.footnav}>
              <div className={style.header3}>Сервисы</div>
              <menu>
                <li><Link href={url} title="Выписк из ЕГРН на квартиру">Отчеты из ЕГРН</Link></li>
                <li><Link href={url} title="Численность населения России на 2026 год">Численность населения</Link></li>
                <li><Link href={url} title="Комплексная проверка недвижимости на арест, обременение, залог">Проверка недвижимости</Link></li>
                <li><Link href={url} title="Справка о кадастровой стоимости">Справка о кадастровой стоимости</Link></li>
                <li><Link href={url} title="Узнать кадастровый номер по адресу">Кадастровый номер</Link></li>
                <li><Link href={url} title="публичная кадастровая карта">Кадастровая карта</Link></li>
                <li><Link href={url} title="справочная информация по объектам недвижимости в режиме online">Справочная информация</Link></li>
                <li><Link href={url} title="земельные участки">Земельные участки</Link></li>
              </menu>
            </div>
          </div>
          <div className={`${style["footer__top-contacts"]}`}>
            <div className={`${style["footer__top-contactsTd"]}`}>
              <div className={`${style["footer__top-contacts-title"]}`}>Время работы:</div>
              <div className={`${style["footer__top-contacts-data"]}`}>Понед.- Пятница с<br/>10:00 до 20:00</div>
            </div>

            <Link  className={style.tgLink} href="https://t.me/goskad_bot">
              <div className={`${style["footer__top-contactsTd"]}`}>
                <div className={`${style["footer__top-contacts-title"]}`}>Telegram:</div>
                <div className={`${style["footer__top-contacts-data"]} ${style.disable}`}>
                  <div className={`${style["footer__top-contacts-soc"]} ${style._tg}`}></div>
                </div>
              </div>
            </Link>
            <div className={`${style["footer__top-contactsTd"]}`}>
              <div className={`${style["footer__top-contacts-title"]}`}>Почта для обращений:</div>
              <div className={`${style["footer__top-contacts-data"]} ${style._email}`}><span>e-mail: <span className={`${style["h-mylo"]}`} data-item1={host} data-item2="admin"></span></span></div>
            </div>
            <div className={`${style["footer__top-contactsTd"]}`}>
              <div className={`${style["footer__top-contacts-title"]}`}>Официальное приложене:</div>
              <div className={`${style["footer__top-contacts-data"]} ${style.disable}`}>
                <div className={`${style["footer__top-contacts-download"]} ${style._google}`}></div>
              </div>
            </div>
          </div>
          </div>
      </div>
    </footer>
  )
}

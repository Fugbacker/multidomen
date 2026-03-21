import React from 'react'
import Link from 'next/link'
import style from '@/styles/rosegrn.module.css'

export default function FooterRosegrn ({ host }) {
  return (
    <footer>
      <div className="layout">
        <div className="footlink">
          <div className="h3">Информация</div>
          <menu>
            <li><Link href="/" title="">Главная</Link></li>
            <li><Link href="/contacts" title="">Контакты</Link></li>
            <li><Link href="/privacy-policy" title="">Политика конфиденциальности</Link></li>
            <li><Link href="/agreement" title="">Пользовательское соглашение</Link></li>
            <li><Link href="/public-offer" title="">Оферта</Link></li>
            {/* <li><a href="/info" title="Информационный раздел">Информационный раздел</a></li>
            <li><a href="/help" title="Ответы на часто задаваемые вопросы">Ответы на вопросы</a></li> */}
          </menu>
        </div>
        <div className="footnav">
          <div className="h3">Сервисы</div>
          <menu>
            <li><Link href="/" title="кадастровый номер по адресу">Кадастровый номер</Link></li>
            <li><Link href="/" title="Справочная информация по объекту недвижимости в режиме online">Справочная информация</Link></li>
            <li><Link href="/" title="Межевание участков">Межевание участков</Link></li>
            <li><Link href="/" title="Схема участка">Схема участка</Link></li>
            <li><Link href="/" title="Кадастровые отчеты">Кадастровые отчеты</Link></li>
            <li><Link href="/" title="Кадастровая стоимость объектов недвижимости">Кадастровая стоимость</Link></li>
            <li><Link href="/" title="Публичная кадастровая карта 2026">Кадастровая карта</Link></li>
            <li><Link href="/" title="Отчет о собственниках">Собственники</Link></li>
          </menu>
        </div>
        <div className="footinfo">
          <div className="footname">
            {/* <div className="h3">Онлайн-сервис {host}</div> */}
            <div>
                <span className="">E-mail: <span className="h-mylo" data-item1="nspd.su" data-item2="order"></span></span>
            </div>
          </div>
          <div>
            <p>Данный сайт не является официальным сайтом Росреестра. Официальный сайт Росреестра - rosreestr.gov.ru</p>
            <p className="copy">2019-2026 © Все права защищены. <a href="/">{host}</a></p>
            <div className="payLogo"></div>
          </div>
        </div>
      </div>
    </footer>
  )
}

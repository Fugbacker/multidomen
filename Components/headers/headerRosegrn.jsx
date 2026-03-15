import Link from 'next/link'
import MobileNavigation from '@/Components/mobile-navigation'
import Navigation from '@/Components/navigation'
import style from '@/styles/rosegrn.module.css'


export default function HeaderRosegrn() {
  return (
    <header className={style.small}>
      <div className={style.header_logo}>
        <div className={style.logo}>
          <div className={style.logo_name}>
            <Link href="/" className={style.logo__name}>
              nspdmap
            </Link>
          </div>
          <strong className={style.logo_descr}>
            Кадастровые услуги
          </strong>
        </div>
        <div className={style.support}>
          <div className={style.mail}>
            Техническая поддержка <span className={style.nobr}>с 9.00 до 21.00 мск</span>
          </div>
          <div
            className={`${style.mail} ${style["h-mylo"]}`}
            data-item1="nspd.su"
            data-item2="e-mail: admin"
          ></div>
        </div>
        <Link className={style.tgLink} href="https://t.me/goskad_bot">
          <div className={`${style["footer__top-contacts-soc"]} ${style._tg}`}></div>
        </Link>
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

import React from 'react'
import { useRouter } from 'next/router'
import {
  FacebookShareButton,
  FacebookIcon,
  TelegramShareButton,
  TelegramIcon,
  TwitterShareButton,
  TwitterIcon,
  ViberShareButton,
  ViberIcon,
  WhatsappShareButton,
  WhatsappIcon,
  VKShareButton,
  VKIcon,
  EmailShareButton,
  EmailIcon
} from 'next-share';

import style from '@/styles/goskadastr.module.css'

const ShareButtons = ({ ogDescrition }) => {
  const title = ogDescrition
  const router = useRouter()
  const path = router?.asPath

  const data = new Date()
  const year = data.getFullYear()
  const month = `0${data.getMonth()+1}`
  const monthReal = month.length > 2 ? month.slice(1) : month
  const day = data.getDate()

  return (
    <div className={style["object__content-top"]}>
      <div className={style["object__content-top-link"]}>{`Дата запроса:  ${day}.${monthReal}.${year}`}</div>
      <div className={style.shareButtons}>
        <p>поделиться</p>
        <FacebookShareButton
          url={`https://nspdm.su${path}`}
          quote={title}
          image={'https://nspdm.su/images/oghouse.jpg'}
          >
            <FacebookIcon size={25} />
        </FacebookShareButton>
        <TelegramShareButton
          url={`https://nspdm.su${path}`}
          title={title}
          image={'https://nspdm.su/images/oghouse.jpg'}
        >
          <TelegramIcon size={25} />
        </TelegramShareButton>
        <TwitterShareButton
          url={`https://nspdm.su${path}`}
          title={title}
          image={'https://nspdm.su/images/oghouse.jpg'}
        >
          <TwitterIcon size={25} />
        </TwitterShareButton>
        <ViberShareButton
          url={`https://nspdm.su${path}`}
          title={title}
          image={'https://nspdm.su/images/oghouse.jpg'}
        >
          <ViberIcon size={25} />
        </ViberShareButton>
        <WhatsappShareButton
          url={`https://nspdm.su${path}`}
          title={title}
          image={'https://nspdm.su/images/oghouse.jpg'}
        >
          <WhatsappIcon size={25} />
        </WhatsappShareButton>
        <VKShareButton
          url={`https://nspdm.su${path}`}
          image={'https://nspdm.su/images/oghouse.jpg'}
        >
          <VKIcon size={25} />
        </VKShareButton>
        <EmailShareButton
          url={`https://nspdm.su${path}`}
          subject={'Ссылка на объект недвижимости'}
          body={title}
        >
          <EmailIcon size={25} />
        </EmailShareButton>
      </div>
    </div>
  )
}

export default ShareButtons
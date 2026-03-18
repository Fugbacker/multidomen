import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import CryptoJS from 'crypto-js/'
import dayjs from "dayjs";
import axios from 'axios'
import Link from 'next/link'
import { cityIn, cityFrom, cityTo } from 'lvovich';
import Header from '@/Components/layout/Header'
import Footer from '@/Components/layout/Footer'
import CheckRaports from '@/Components/checkRaports'
import CheckShema from '@/Components/checkShema'
import Meta from '@/Components/meta'
import SearchMap from '@/Components/layout/SearchMap';
import macroRegions from '@/Components/files/macroRegions'
import PpkMap from '@/Components/ppkMap'
import { encryptBase62 } from '@/utils/base62'
import style from '@/styles/rosegrn.module.css'
import styles from '@/styles/PublicCadastralMap.module.css';
import styleses from'@/styles/fcad.module.css'

const renameUrl = function(url) {
  const encodedData = Buffer.from(url, 'utf-8').toString('base64');
  // console.log('encodedData', encodedData)
  const urlSafeEncodedData = encodedData.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  // console.log('urlSafeEncodedData', urlSafeEncodedData)  // Убираем паддинг '=' в конце строки
  return urlSafeEncodedData;
};



export default function RosegrnKadastrMap ({ cities, districts, regionName, regionCode, regionStat, center, regionNumber, list, districtData, city, settlement, region, macroRegionNameGenetive, settlementName, field, url, host, totalPopulation, totalChildren, childrenPercentage, typeStats, typePercentages, settlementCounts }) {
  const citiesList = cities && JSON.parse(cities)
  const districtsList = districts && JSON.parse(districts)
  const stats = regionStat && JSON.parse(regionStat)
  const districtStats = districtData && JSON.parse(districtData)?.stat
  const population = totalPopulation && JSON.parse(totalPopulation)
  const children = totalChildren && JSON.parse(totalChildren)
  const childrenPercent = childrenPercentage && JSON.parse(childrenPercentage)
  const statsType = typeStats && JSON.parse(typeStats)
  const statsPercent = typePercentages && JSON.parse(typePercentages)
  const settlementCount = settlementCounts && JSON.parse(settlementCounts)
  const lat = center && JSON.parse(center)[0]
  const lon = center && JSON.parse(center)[1]
  const [cadastrData, setCadastrData] = useState([])
  const [cadastrNumber, setCadastrNumber] = useState('')
  const [isVisible, setIsVisible] = useState(true);
  const [onCkickCadastrNumber, setOnCkickCadastrNumber] = useState('')
  const [closeChecker, setCloseChecker] = useState(false)
  const [alarmMessage, setAlarmMessage] = useState(false)
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const [error, setError] = useState(false)
  const [flatRights, setFlatRights] = useState('')
  const [promoCode, setPromoCode] = useState('')
  const [activate, setActivate] = useState(false)
  const [loading, setLoading] = useState(false);
  const [baloonData, setBaloonData] = useState('');
  const [sendActivePromoCode, SetSendActivePromoCode] = useState('')
  const [shema, setShema] = useState(false);
  const [checkLand, setCheckLand] = useState(false);

  const [isCurrentlyDrawing, setIsCurrentlyDrawing] = useState(false);
  const [polygonCoordinates, setPolygonCoordinates] = useState(null);
  const [isEditingPolygon, setIsEditingPolygon] = useState(false);


  const rights = flatRights?.realty?.rights
  const rightsCheck = rights?.filter((it) =>  it?.rightState === 1)

  const cityList = list && JSON.parse(list).sort()
  const cityes = cityList?.filter(it => {
    if (!it.name) return false;
    const name = it.name.trim().toLowerCase();
    return /^(?:г\.|город)/.test(name);
  });
  const villages = cityList?.filter(it => {
    if (!it.name) return false;
    const name = it.name.trim();
    return /^(?:д\.|с\.)/i.test(name);
  });

  const settlements = cityList?.filter(it => {
    if (!it.name) return false;
    const name = it.name.trim();
    return /^(?:п\.)/i.test(name);
  });

  const otherLocality = cityList?.filter(it => {
    if (!it.name) return false;
    const name = it.name.trim();
    // исключаем если начинается с "п.", "г.", "д.", "с." (регистронезависимо)
    return !/^(?:п|г|д|с)\./i.test(name);
  });


  const router = useRouter()
  const path = router?.asPath
  // const aroundObjects = field && JSON.parse(field)

  const genetiveRegionName = macroRegions?.find((it => it.name === regionName))?.genitive || macroRegions?.find((it => it.key === parseInt(regionNumber)))?.genitive

  const baseRegionId = macroRegions.find(it => it.key === Number(regionNumber))?.id

  useEffect(() => {
    setCadastrData([])
  }, [closeChecker])

  useEffect(() => {
    setCadastrData([])
  }, [alarmMessage])

  useEffect(() => {
    SetSendActivePromoCode(promoCode)
  }, [activate])

  const showNotification = () => {
    setIsNotificationVisible(true);
  };

  const hideNotification = () => {
    setIsNotificationVisible(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      showNotification();
      setTimeout(() => {
        hideNotification();
      }, 7000); // Устанавливаем время показа уведомления (в миллисекундах)
    }, Math.floor(Math.random() * 11000) + 25000); // Рандомный интервал от 10 до 20 секунд

    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    // askAboutRights()
    setActivate(false)
    SetSendActivePromoCode('')
  }, [cadastrNumber])

      const typeNames = {
    г: 'городах',
    с: 'селах',
    п: 'поселках',
    д: 'деревнях',
    пгт: 'пгт',
    рп: 'районных поселениях',
    ст: 'станицах',
    х: 'хуторах',
    аул: 'аулах',
    'ж/д_ст': 'жд станциях',
    'ж/д_рзд': 'жд разъездах',
    заимка: 'заимках',
    высел: 'выселках',
    'с/п': 'сельских поселениях',
    арбан: 'арбанах',
    массив: 'массивах',
    мкр: 'микрорайонах',
    казарма: 'казармах',
    'ж/д_будка': 'железнодорожных будках',
    кордон: 'кордонах',
    'ж/д_платф': 'жд платформах',
    'ж/д_пост': 'жд постах',
    'ж/д_казарм': 'жд казармах',
    жилрайон: 'жилрайонах',
    починок: 'починках',
  };

  const typeNames1 = {
    г: 'городов',
    с: 'сел',
    п: 'поселков',
    д: 'деревень',
    пгт: 'пгт',
    рп: 'районных поселений',
    ст: 'станиций',
    х: 'хуторов',
    аул: 'аулов',
    'ж/д_ст': 'жд станций',
    'ж/д_рзд': 'жд разъездов',
    заимка: 'заимкок',
    высел: 'выселок',
    'с/п': 'сельских поселениий',
    арбан: 'арбанов',
    массив: 'массивов',
    мкр: 'микрорайонов',
    казарма: 'казарм',
    'ж/д_будка': 'железнодорожных будкок',
    кордон: 'кордонов',
    'ж/д_платф': 'жд платформ',
    'ж/д_пост': 'жд постов',
    'ж/д_казарм': 'жд казарм',
    жилрайон: 'жилрайонов',
    починок: 'починков',
  };

  const malePercentageByRegion = {
    "Белгородская область": 46.3,
    "Брянская область": 45.8,
    "Владимирская область": 45.4,
    "Воронежская область": 46.2,
    "Ивановская область": 44.9,
    "Калужская область": 47.3,
    "Костромская область": 45.4,
    "Курская область": 45.3,
    "Липецкая область": 45.8,
    "Московская область": 47.5,
    "Орловская область": 45.5,
    "Рязанская область": 45.3,
    "Смоленская область": 45.1,
    "Тамбовская область": 46.1,
    "Тверская область": 45.6,
    "Тульская область": 45.3,
    "Ярославская область": 44.9,
    "Москва": 46.4,
    "Республика Карелия": 44.8,
    "Республика Коми": 46.2,
    "Архангельская область": 46.2,
    "Вологодская область": 45.8,
    "Калининградская область": 47.2,
    "Ленинградская область": 46.9,
    "Мурманская область": 47.1,
    "Новгородская область": 44.9,
    "Псковская область": 45.3,
    "Санкт-Петербург": 45.1,
    "Республика Адыгея": 46.7,
    "Республика Калмыкия": 48.6,
    "Республика Крым": 46.3,
    "Краснодарский край": 47.1,
    "Астраханская область": 47.0,
    "Волгоградская область": 46.9,
    "Ростовская область": 46.6,
    "Севастополь": 47.5,
    "Республика Дагестан": 49.4,
    "Республика Ингушетия": 49.8,
    "Кабардино-Балкарская Республика": 47.4,
    "Карачаево-Черкесская Республика": 47.2,
    "Республика Северная Осетия": 46.7,
    "Чеченская Республика": 50.1,
    "Ставропольский край": 47.1,
    "Республика Башкортостан": 47.3,
    "Республика Марий Эл": 46.5,
    "Республика Мордовия": 46.3,
    "Республика Татарстан": 46.7,
    "Удмуртская Республика": 45.7,
    "Чувашская Республика": 46.2,
    "Пермский край": 45.7,
    "Кировская область": 45.6,
    "Нижегородская область": 45.3,
    "Оренбургская область": 46.3,
    "Пензенская область": 45.5,
    "Самарская область": 45.9,
    "Саратовская область": 46.4,
    "Ульяновская область": 45.9,
    "Курганская область": 45.4,
    "Свердловская область": 46.3,
    "Тюменская область": 47.3,
    "Челябинская область": 45.8,
    "Республика Алтай": 47.1,
    "Республика Тыва": 47.2,
    "Республика Хакасия": 45.9,
    "Алтайский край": 45.6,
    "Красноярский край": 46.4,
    "Иркутская область": 45.9,
    "Кемеровская область": 45.7,
    "Новосибирская область": 45.7,
    "Омская область": 46.1,
    "Томская область": 46.6,
    "Республика Бурятия": 46.8,
    "Республика Саха (Якутия)": 48.3,
    "Забайкальский край": 47.1,
    "Камчатский край": 48.5,
    "Приморский край": 46.7,
    "Хабаровский край": 47.2,
    "Амурская область": 47.2,
    "Магаданская область": 48.3,
    "Сахалинская область": 47.3,
    "Еврейская автономная область": 46.9,
    "Чукотский автономный округ": 49.1
  };

  const today = dayjs();
  const formattedDate = today.format('DD.MM.YYYY');


  const malePercentage = malePercentageByRegion[region] || 46.47;
  const femalePercentage = 100 - malePercentage;
  const totalMen = Math.round((totalPopulation - totalChildren) * (malePercentage / 100));
  const totalWomen = Math.round((totalPopulation - totalChildren) * (femalePercentage / 100));

  const rootDomain = host && host.split('.').slice(-2).join('.')
  const baseUrl = `https://${rootDomain}` // поставь свой URL если нужно
  const mainArticleId = `${baseUrl}#main-article`

  const mainArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": mainArticleId,
    "headline":
     cities ? `Кадастровая карта  НСПД ${genetiveRegionName}` :
     region ? `Кадастровая карта  НСПД ${cityFrom(regionName)} района ${genetiveRegionName}` :
     city ? `Кадастровая карта  НСПД ${cityFrom(regionName)} ${genetiveRegionName}` :
     `Кадастровая карта  НСПД ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName}`,
    "description":
     cities ? `Публичная кадастровая карта ${genetiveRegionName}из НСПД` :
     region ? `Публичная кадастровая карта ${cityFrom(regionName)} района ${genetiveRegionName} из НСПД.` :
     city ? `Публичная кадастровая карта ${cityFrom(regionName)} ${genetiveRegionName} из НСПД.` :
      `Публичная кадастровая карта ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName} из НСПД.`,
    "author": {
      "@type": "Organization",
      "name": `${rootDomain}`,
      "url": `${baseUrl}/${path}`,
    },
    "publisher": {
      "@type": "Organization",
      "name": `${rootDomain}`,
      "url": `${baseUrl}/${path}`,
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${baseUrl}/${path}`
    },
    "articleSection": [
      cities ? `Кадастровая карта НСПД ${genetiveRegionName}` :
      region ? `Кадастровая карта НСПД ${cityFrom(regionName)} района ${genetiveRegionName}` :
      city ? `Кадастровая карта НСПД ${cityFrom(regionName)} ${genetiveRegionName}` : `Кадастровая карта НСПД ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName}`,
      cities ? `Данные кадастровой карты НСПД ${genetiveRegionName}` :
      region ? `Данные кадастровой карты НСПД ${cityFrom(regionName)} района ${genetiveRegionName}` :
      city ? `Данные кадастровой карты НСПД ${cityFrom(regionName)} ${genetiveRegionName}` : `Данные кадастровой карты НСПД ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName}`,
    ],
    "url": `${baseUrl}/${path}`
  }

  // секции — каждая как Article (isPartOf -> основной)
  const sections = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": `${mainArticleId}#section-1`,
      "headline":
        cities ? `Публичная кадастровая карта ${genetiveRegionName} с данными из НСПД` :
        region ? `Публичная кадастровая карта ${cityFrom(regionName)} района ${genetiveRegionName} с данными из НСПД` :
        city ? `Публичная кадастровая карта ${cityFrom(regionName)} ${genetiveRegionName} с данными из НСПД` : `Публичная кадастровая карта ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName} с данными из НСПД`,
      "description":
        cities ? `Сведения, доступные по кадастровым объектам на кадастровой карте ${genetiveRegionName}` :
        region ? `Поиск земельных участков, зданий и сооружений на кадастровой карте ${cityFrom(regionName)} района ${genetiveRegionName}` :
        city ? `Поиск земельных участков, зданий и сооружений на кадастровой карте ${cityFrom(regionName)} ${genetiveRegionName}` : `Поиск земельных участков, зданий и сооружений на кадастровой карте ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName}`,
      "isPartOf": { "@type": "Article", "@id": mainArticleId },
      "mainEntityOfPage": { "@type": "WebPage", "@id": `${baseUrl}/${path}`},
      "url": `${baseUrl}/${path}#section-1`
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": `${mainArticleId}#section-2`,
      "headline":
        cities ? `Статистические данные по кадастровым объектам и населению ${genetiveRegionName}` :
        region ? `Статистические данные по кадастровым объектам и населению ${cityFrom(regionName)} района ${genetiveRegionName}` :
        city ? `Статистические данные по кадастровым объектам и населению ${cityFrom(regionName)} ${genetiveRegionName}` :  `Статистические данные по кадастровым объектам и населению ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName}`
      ,
      "description":
        cities ? `Статистика существующих населенных пунктов на кадастровой карте ${genetiveRegionName}` :
        region ? `Статистика существующих населенных пунктов на кадастровой карте ${cityFrom(regionName)} района ${genetiveRegionName}` :
        city ? `Статистика существующих населенных пунктов на кадастровой карте ${cityFrom(regionName)} ${genetiveRegionName}` :  `Статистика существующих населенных пунктов на кадастровой карте ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName}`,
      "isPartOf": { "@type": "Article", "@id": mainArticleId },
      "mainEntityOfPage": { "@type": "WebPage", "@id": `${baseUrl}/${path}` },
      "url": `${baseUrl}/${path}}#section-2`
    },
     {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": `${mainArticleId}#section-3`,
      "headline":
        cities ? `Название населенных пунктов ${genetiveRegionName}` :
        region ? `Название населенных пунктов ${cityFrom(regionName)} района ${genetiveRegionName}` :
        city ? `Название населенных пунктов ${cityFrom(regionName)} ${genetiveRegionName}` :  `Публичная кадастровая карта ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName}`,
      "description": "Раздел с выбором регионов и ссылками на кадастровые карты по субъектам РФ.",
      "isPartOf": { "@type": "Article", "@id": mainArticleId },
      "mainEntityOfPage": { "@type": "WebPage", "@id": `${baseUrl}/${path}` },
      "url": `${baseUrl}/${path}#section-3`
    }
  ]


  const jsonLdObjects = [mainArticle, ...sections]

  return (
    <>
      <Head>
        {jsonLdObjects.map((obj, i) => (
          <script
            key={i}
            type="application/ld+json"
            // prettier-ignore
            dangerouslySetInnerHTML={{ __html: JSON.stringify(obj, null, 2) }}
          />
        ))}
      </Head>
      {cities && <Meta
        host={host}
        title={`НСПД кадастровая карта ${genetiveRegionName}`}
        descritoin={`Публичная кадастровая карта НСПД ${genetiveRegionName} 2026.`}
        keywords={`публичная кадастровая карта ${genetiveRegionName} 2026, официальная кадастровая карта, общедоступная кадастровая карта, пкк Единого Государственного Реестра недвижимости (Росреестра), кадастровая карта ${genetiveRegionName}, Национальная система пространственных данных, новая кадастровая карта НСПД ${genetiveRegionName}`}
        canonicalURL={`https://${rootDomain}/${path}`}
        robots='index, follow'
        ogUrl={`https://${rootDomain}/${path}`}
        ogTitle={`НСПД кадастровая карта ${genetiveRegionName}`}
        ogDescrition={`Публичная кадастровая карта НСПД ${genetiveRegionName} 2026.`}
        twitterTitle={`НСПД кадастровая карта ${genetiveRegionName}`}
        twitterDescription={`Публичная кадастровая карта НСПД ${genetiveRegionName} 2026.`}
      />}
      {region &&
        <Meta
          title={`НСПД кадастровая карта ${cityFrom(regionName)} района ${genetiveRegionName}`}
          descritoin={`Публичная кадастровая карта НСПД ${cityFrom(regionName)} района ${genetiveRegionName} 2026.`}
          keywords={`НСПД, публичная кадастровая карта ${cityFrom(regionName)} района ${genetiveRegionName} 2026, официальная кадастровая карта, общедоступная кадастровая карта, кадастровая карта ${cityFrom(regionName)} района ${genetiveRegionName}, Национальная система пространственных данных, новая кадастровая карта НСПД ${cityFrom(regionName)} района ${genetiveRegionName}`}
          canonicalURL={`https://${rootDomain}/${path}`}
          robots='index, follow'
          ogUrl={`https://${rootDomain}/${path}`}
          ogTitle={`НСПД кадастровая карта ${cityFrom(regionName)} района ${genetiveRegionName}`}
          ogDescrition={`Публичная кадастровая карта НСПД ${cityFrom(regionName)} района ${genetiveRegionName} 2026.`}
          twitterTitle={`НСПД кадастровая карта ${cityFrom(regionName)} района ${genetiveRegionName}`}
          twitterDescription={`Публичная кадастровая карта НСПД ${cityFrom(regionName)} района ${genetiveRegionName} 2026.`}
        />
      }

      {city &&
        <Meta
          title={`НСПД кадастровая карта ${cityFrom(regionName)} ${genetiveRegionName}`}
          descritoin={`Публичная кадастровая карта НСПД ${cityFrom(regionName)} ${genetiveRegionName} 2026.`}
          keywords={`НСПД, публичная кадастровая карта ${cityFrom(regionName)} ${genetiveRegionName} 2026, официальная кадастровая карта, общедоступная кадастровая карта, кадастровая карта ${cityFrom(regionName)} ${genetiveRegionName}, Национальная система пространственных данных, новая кадастровая карта НСПД ${cityFrom(regionName)} ${genetiveRegionName}`}
          canonicalURL={`https://${rootDomain}/${path}`}
          robots='index, follow'
          ogUrl={`https://${rootDomain}/${path}`}
          ogTitle={`НСПД кадастровая карта ${cityFrom(regionName)} ${genetiveRegionName}`}
          ogDescrition={`Публичная кадастровая карта НСПД ${cityFrom(regionName)} ${genetiveRegionName} 2026.`}
          twitterTitle={`НСПД кадастровая карта ${cityFrom(regionName)} ${genetiveRegionName}`}
          twitterDescription={`Публичная кадастровая карта НСПД ${cityFrom(regionName)} ${genetiveRegionName} 2026.`}
        />
      }

      {settlement &&
        <Meta
          title={`НСПД кадастровая карта ${settlementName} ${cityFrom(regionName)} района ${genetiveRegionName}`}
          descritoin={`Публичная кадастровая карта НСПД ${settlementName} ${cityFrom(regionName)} района ${genetiveRegionName}. ${settlementName} 2026.`}
          keywords={`НСПД, публичная кадастровая карта ${settlementName} ${cityFrom(regionName)} района ${genetiveRegionName} 2026, официальная кадастровая карта, общедоступная кадастровая карта, кадастровая карта ${settlementName} ${cityFrom(regionName)} района ${genetiveRegionName}, Национальная система пространственных данных, новая кадастровая карта НСПД ${settlementName} ${cityFrom(regionName)} района ${genetiveRegionName}`}
          canonicalURL={`https://${rootDomain}/${path}`}
          robots='index, follow'
          ogUrl={`https://${rootDomain}/${path}`}
          ogTitle={`НСПД кадастровая карта ${settlementName} ${cityFrom(regionName)} района ${genetiveRegionName}`}
          ogDescrition={`Публичная кадастровая карта НСПД ${settlementName} ${cityFrom(regionName)} района ${genetiveRegionName}. ${settlementName} 2026.`}
          twitterTitle={`НСПД кадастровая карта ${settlementName} ${cityFrom(regionName)} района ${genetiveRegionName}`}
          twitterDescription={`Публичная кадастровая карта НСПД ${settlementName} ${cityFrom(regionName)} района ${genetiveRegionName}. ${settlementName} 2026.`}
        />
          }
      <Header />
        <div className={`${styleses.section} ${styleses.fieldform} ${styleses.start}`} id="start">
          <div className={styleses.layout}>
            <div className={styleses.mainFirst}>
              <div className={styleses["main__first-wrap"]}>
                  {cities ? <h1 className={styleses["main__first-h1"]}>Кадастровая карта {genetiveRegionName}</h1>:
                  region ? <h1 className={styleses["main__first-h1"]}>Кадастровая карта {cityFrom(regionName)} района {genetiveRegionName}</h1>:
                  city ? <h1 className={styleses["main__first-h1"]}>Кадастровая карта {cityFrom(regionName)} {genetiveRegionName}</h1>:
                  <h1 className={styleses["main__first-h1"]}>Кадастровая карта {settlementName} {cityFrom(regionName)} района {genetiveRegionName}</h1>
                  }
                <div className={styleses["main__first-descr"]}>
                  Кадастровые сведения по объектам недвижимости, границы участков, межевание, схемы для предварительного согласования участков в собственность или аренду, сводные земельные отчеты.
                </div>
              </div>
              <div className={styleses["main__first-img"]}></div>
            </div>
          </div>
        </div>
        <div className="section animate">
           <div className="layout">
            <div className={style.serviceItem}>
              <div className={style.serviceText}>
                {cities ?
                <p>Границы и схемы земельных участков, межевание, сводные земельные отчеты, кадастровая стоимость, поиск по кадастровому номеру, кадастровая информация по объектам недвижимости {genetiveRegionName}.</p>:
                region ? <p>Границы и схемы земельных участков, межевание, сводные земельные отчеты, кадастровая стоимость, поиск по кадастровому номеру, кадастровая информация по объектам недвижимости {cityFrom(regionName)} района {genetiveRegionName}.</p>:
                city ? <p>Границы и схемы земельных участков, межевание, сводные земельные отчеты, кадастровая стоимость, поиск по кадастровому номеру, кадастровая информация по объектам недвижимости {cityFrom(regionName)} {genetiveRegionName}.</p>:
                <p>Границы и схемы земельных участков, межевание, сводные земельные отчеты, кадастровая стоимость, поиск по кадастровому номеру, кадастровая информация по объектам недвижимости{settlementName} {cityFrom(regionName)} района {genetiveRegionName}.</p>
                }
              </div>
            </div>
          <SearchMap setCadastrData={setCadastrData} cadastrData={cadastrData} setCadastrNumber={setCadastrNumber} closeChecker={closeChecker} alarmMessage={alarmMessage} setAlarmMessage={setAlarmMessage} setBaloonData={setBaloonData} error={error} setError={setError} />
        </div>
      </div>
      {alarmMessage &&
      <div className={`${style.section} ${style.services}`}>
        <div className={style.content1}>
          <div className={style.repairBlock}>
            <div className={style["object__block-wrap"]}>
              <div className={style.repairInfo}>
                <p>Не удалось загрузить данные по объекту, серверы кадастровой карты перегружены. Попробуйте произвести поиск чуть позже.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      }
       <div className="section fieldform second">
        <div className="layout">
          <PpkMap cadastrNumber={cadastrNumber} setCloseChecker={setCloseChecker} setAlarmMessage={setAlarmMessage} setCadastrNumber={setCadastrNumber} flatRights={flatRights} promoCode={promoCode} sendActivePromoCode={sendActivePromoCode} setPromoCode={setPromoCode} setActivate={setActivate} activate={activate} lat={lat} lon={lon} closeChecker={closeChecker} setLoading={setLoading} loading={loading} setBaloonData={setBaloonData} baloonData={baloonData} onCkickCadastrNumber={onCkickCadastrNumber} setOnCkickCadastrNumber={setOnCkickCadastrNumber} setIsVisible={setIsVisible} isVisible={isVisible} error={error} setError={setError} setIsCurrentlyDrawing={setIsCurrentlyDrawing} isCurrentlyDrawing={isCurrentlyDrawing} setPolygonCoordinates={setPolygonCoordinates} polygonCoordinates={polygonCoordinates} setIsEditingPolygon={setIsEditingPolygon} isEditingPolygon={isEditingPolygon} setShema={setShema} shema={shema} setCheckLand={setCheckLand} checkLand={checkLand} />

          {!shema && (cadastrNumber || onCkickCadastrNumber) && !loading &&<CheckRaports cadNum={cadastrNumber} owner={rights} rightsCheck={rightsCheck} promoCode={promoCode} sendActivePromoCode={sendActivePromoCode} setPromoCode={setPromoCode} setActivate={setActivate} activate={activate} onCkickCadastrNumber={onCkickCadastrNumber} setIsVisible={setIsVisible} isVisible={isVisible} checkLand={checkLand} />}
          {(!isCurrentlyDrawing && polygonCoordinates && !isEditingPolygon && shema) && <CheckShema cadNum={cadastrNumber} owner={rights} rightsCheck={rightsCheck} promoCode={promoCode} sendActivePromoCode={sendActivePromoCode} setPromoCode={setPromoCode} setActivate={setActivate} activate={activate} onCkickCadastrNumber={onCkickCadastrNumber} polygonCoordinates={polygonCoordinates} />}
        </div>
      </div>
      {citiesList &&<div className={`${style.section} ${style.services}`}>
         <div className="layout">
            <div className={style.object__block}>
              <div className={style["object__block-wrap"]}>
                <article itemScope itemType="https://schema.org/Article" >
                <div className={style.contentText}>
                  <section itemProp="articleBody" className={styles.sec} id="section-1">
                    <h2>Кадастровая карта {genetiveRegionName}</h2>
                    <p>Кадастровая карта {genetiveRegionName} позволяет получить в режиме онлайн открытую <Link href='/' title ='Справочная информация по объектам недвижимости в режиме online'>справочную информацию</Link> и заказать необходимые документы по конкретному объекту недвижимости, которые содержат:</p>
                    <ul id="cadData">
                      <li>Информацию о <Link href='/kadastrovaya-stoimost' title='кадастровая стоимость по кадастровому номеру на 2026 год бесплатно'>кадастровой стоимости</Link> на дату запроса</li>
                      <li><Link href='/' title='узнать кадастровый номер по адресу'>кадастровый номер объекта недвижимости</Link>.</li>
                      <li>фактический адрес</li>
                      <li>Технический план участка, квартиры или здания</li>
                      <li>Раздел сведений о наличии или отсуствии ограничений и обременений</li>
                      <li>Площадь участка или ОКС</li>
                      <li>Сведения о текущих правообладателях и бывших собственниках</li>
                    </ul>
                  </section>
                  <section itemProp="articleBody" className={styles.sec} id="section-2">
                  <h2>Данные публичной кадастровой карты {genetiveRegionName}</h2>
                  <p>Публичная кадастровая карта {genetiveRegionName} имеет упорядоченную иерархическую структуру, которая содержит</p>
                  <ul>
                    <li>{stats?.rayon?.total} кадастровых районов</li>
                    <li>{stats?.kvartal?.total} кварталов</li>
                    <li>{stats?.oks?.total} капитальных строений</li>
                    <li>{stats?.parcel?.total} земельных участков</li>
                  </ul>
                    <p>На {formattedDate} общая численность населения {genetiveRegionName} составляет <b>{population}</b> человек, которые проживают на территориях:</p>
                  <ul>
                      {Object.entries(typeNames1).map(([type, name]) => {
                        const count = settlementCount[type];
                        // Выводим только существующие данные
                        if (!count) {
                          return null;
                        }

                        return (
                          <li key={type}>
                           {count} {name}
                          </li>
                        );
                      })}
                    </ul>
                </section>
                </div>
              </article>
              <section id="section-3">
                <div className={style.regionsContainer}>
                  <h2>Города {genetiveRegionName}</h2>
                  {citiesList.map((it, index) => {
                    return (
                      <Link href={`/map/${encryptBase62(`${regionNumber}_${it.id}`, rootDomain)}`} className={style.regionName} key={index}>
                        <div className={style.statRegionContainer}>
                          <div className={style.name}>{it.name}</div>
                        </div>
                      </Link>
                      )
                    })
                  }
                  <h2>Районы {genetiveRegionName}</h2>
                  {districtsList.map((it, index) => {
                    return (
                      <Link href={`/map/${encryptBase62(`${regionNumber}-${it.id}`, rootDomain)}`} className={style.regionName} key={index}>
                        <div className={style.statRegionContainer}>
                          <div className={style.name}>{it.name}</div>
                        </div>
                      </Link>
                      )
                    })
                  }
                </div>
              </section>
              </div>
            </div>
          </div>
      </div>}
      {region && (
       <div className="section fieldform second">
        <div className="layout">
            <div className={style.object__block}>
              <div className={style["object__block-wrap"]}>
              <article itemScope itemType="https://schema.org/Article" >
                <div className={style.contentText}>
                  <section itemProp="articleBody" className={styles.sec} id="section-1">
                  <h2><Link href={`/map/${renameUrl(`${baseRegionId}|${regionNumber}`)}`} title={`Публичная кадастровая карта ${genetiveRegionName}`}>Кадастровая карта</Link> {cityFrom(regionName)} района {genetiveRegionName}.</h2>
                    <p>Кадастровая карта {cityFrom(regionName)} района {genetiveRegionName} позволяет получить в режиме онлайн открытую <Link href='/' title ='Справочная информация по объектам недвижимости в режиме online'>справочную информацию</Link> и заказать необходимые документы по конкретному объекту недвижимости, которые содержат:</p>
                    <ul id="cadData">
                      <li>Информацию о <Link href='/kadastrovaya-stoimost' title='кадастровая стоимость по кадастровому номеру на 2026 год бесплатно'>кадастровой стоимости</Link> на дату запроса</li>
                      <li><Link href='/' title='узнать кадастровый номер по адресу'>кадастровый номер объекта недвижимости</Link>.</li>
                      <li>фактический адрес</li>
                      <li>Технический план участка, квартиры или здания</li>
                      <li>Раздел сведений о наличии или отсуствии ограничений и обременений</li>
                      <li>Площадь участка или ОКС</li>
                      <li>Сведения о текущих правообладателях и бывших собственниках</li>
                    </ul>
                  </section>
                  <section itemProp="articleBody" className={styles.sec} id="section-2">
                  <h2>Данные публичной кадастровой карты {cityFrom(regionName)} района {genetiveRegionName}</h2>
                  <p>Публичная кадастровая карта {cityFrom(regionName)} района {genetiveRegionName} имеет упорядоченную иерархическую структуру, которая содержит</p>
                  <ul>
                    <li>{districtStats?.kvartal?.total} кварталов</li>
                    <li>{districtStats?.oks?.total} капитальных строений</li>
                    <li>{districtStats?.parcel?.total} земельных участков</li>
                  </ul>
                    <p>На {formattedDate} общая численность населения {cityFrom(regionName)} района{genetiveRegionName} составляет <b>{population}</b> человек, которые проживают на территориях:</p>
                  <ul>
                    {Object.entries(typeNames1).map(([type, name]) => {
                      const count = settlementCount[type];
                      // Выводим только существующие данные
                      if (!count) {
                        return null;
                      }

                      return (
                        <li key={type}>
                          {name} {count} шт.
                        </li>
                      );
                    })}
                  </ul>
                </section>
                </div>
              </article>
               <section id="section-5">
                <div className={style.regionsContainer}>
                  {villages.length !==0 && <h2>Деревни и села</h2>}
                  {villages.map((it, index) => {
                    return (
                      <>
                        <Link href={`/map/${encryptBase62(`${regionNumber},${it.id}`, rootDomain)}`} className={style.regionName} key={index}>
                          <div className={style.statRegionContainer}>
                            <div className={style.name}>{it.name}</div>
                          </div>
                        </Link>
                      </>
                    )
                  })}
                  {settlements.length !==0 && <h2>ПГТ и поселки</h2>}
                  {settlements.map((it, index) => {
                    return (
                      <>
                        <Link href={`/map/${encryptBase62(`${regionNumber},${it.id}`, rootDomain)}`} className={style.regionName} key={index}>
                          <div className={style.statRegionContainer}>
                            <div className={style.name}>{it.name}</div>
                          </div>
                        </Link>
                      </>
                    )
                  })}
                  {otherLocality.length !==0 && <h2>Другие населенные пункты</h2>}
                  {otherLocality.map((it, index) => {
                    return (
                      <>
                        <Link href={`/map/${encryptBase62(`${regionNumber},${it.id}`, rootDomain)}`} className={style.regionName} key={index}>
                          <div className={style.statRegionContainer}>
                            <div className={style.name}>{it.name}</div>
                          </div>
                        </Link>
                      </>
                    )
                  })}
                </div>
                </section>
              </div>
            </div>
          </div>
      </div>
      )}
      {city && (
      <div className="section fieldform second">
        <div className="layout">
            <div className={style.object__block}>
              <div className={style["object__block-wrap"]}>
              <article itemScope itemType="https://schema.org/Article" >
                <div className={style.contentText}>
                  <section itemProp="articleBody" className={styles.sec} id="section-1">
                    <h2><Link href={`/map/${renameUrl(`${baseRegionId}|${regionNumber}`)}`} title={`Публичная кадастровая карта ${genetiveRegionName}`}>Кадастровая карта</Link> {cityFrom(regionName)} {genetiveRegionName}.</h2>
                    <p>Кадастровая карта {cityFrom(regionName)} {genetiveRegionName} позволяет получить в режиме онлайн открытую <Link href='/' title ='Справочная информация по объектам недвижимости в режиме online'>справочную информацию</Link> и заказать необходимые документы по конкретному объекту недвижимости, которые содержат:</p>
                    <ul id="cadData">
                      <li>Информацию о <Link href='/kadastrovaya-stoimost' title='кадастровая стоимость по кадастровому номеру на 2026 год бесплатно'>кадастровой стоимости</Link> на дату запроса</li>
                      <li><Link href='/' title='узнать кадастровый номер по адресу'>кадастровый номер объекта недвижимости</Link>.</li>
                      <li>фактический адрес</li>
                      <li>Технический план участка, квартиры или здания</li>
                      <li>Раздел сведений о наличии или отсуствии ограничений и обременений</li>
                      <li>Площадь участка или ОКС</li>
                      <li>Сведения о текущих правообладателях и бывших собственниках</li>
                    </ul>
                  </section>
                  <section itemProp="articleBody" className={styles.sec} id="section-2">
                  <h2>Данные публичной кадастровой карты {cityFrom(regionName)} {genetiveRegionName}</h2>
                  <p>Публичная кадастровая карта {cityFrom(regionName)} {genetiveRegionName} имеет упорядоченную иерархическую структуру, которая содержит</p>
                  <ul>
                    <li>{districtStats?.kvartal?.total} кварталов</li>
                    <li>{districtStats?.oks?.total} капитальных строений</li>
                    <li>{districtStats?.parcel?.total} земельных участков</li>
                  </ul>
                    <p>На {formattedDate} общая численность населения {cityFrom(regionName)} {genetiveRegionName} составляет <b>{population}</b> человек, которые проживают на территориях:</p>
                  <ul>
                    {Object.entries(typeNames1).map(([type, name]) => {
                      const count = settlementCount[type];
                      // Выводим только существующие данные
                      if (!count) {
                        return null;
                      }

                      return (
                        <li key={type}>
                          {name} {count} шт.
                        </li>
                      );
                    })}
                  </ul>
                </section>
                </div>
              </article>
               <section id="section-3">
                <div className={style.regionsContainer}>
                  {villages.length !==0 && <h2>Деревни и села</h2>}
                  {villages.map((it, index) => {
                    return (
                      <>
                        <Link href={`/map/${encryptBase62(`${regionNumber},${it.id}`, rootDomain)}`} className={style.regionName} key={index}>
                          <div className={style.statRegionContainer}>
                            <div className={style.name}>{it.name}</div>
                          </div>
                        </Link>
                      </>
                    )
                  })}
                  {settlements.length !==0 && <h2>ПГТ и поселки</h2>}
                  {settlements.map((it, index) => {
                    return (
                      <>
                        <Link href={`/map/${encryptBase62(`${regionNumber},${it.id}`, rootDomain)}`} className={style.regionName} key={index}>
                          <div className={style.statRegionContainer}>
                            <div className={style.name}>{it.name}</div>
                          </div>
                        </Link>
                      </>
                    )
                  })}
                  {otherLocality.length !==0 && <h2>Другие населенные пункты</h2>}
                  {otherLocality.map((it, index) => {
                    return (
                      <>
                        <Link href={`/map/${encryptBase62(`${regionNumber},${it.id}`, rootDomain)}`} className={style.regionName} key={index}>
                          <div className={style.statRegionContainer}>
                            <div className={style.name}>{it.name}</div>
                          </div>
                        </Link>
                      </>
                    )
                  })}
                </div>
                </section>
              </div>
            </div>
          </div>
      </div>
      )}
      {settlement && (
        <div className="section fieldform second">
        <div className="layout">
            <div className={style.object__block}>
              <div className={style["object__block-wrap"]}>
              <article itemScope itemType="https://schema.org/Article" >
                <div className={style.contentText}>
                  <section itemProp="articleBody" className={styles.sec} id="section-1">
                    <h2><Link href={`/map/${renameUrl(`${baseRegionId}|${regionNumber}`)}`} title={`Публичная кадастровая карта ${genetiveRegionName}`}>Кадастровая карта</Link> {cityFrom(settlementName)} {cityFrom(regionName)} района {genetiveRegionName}.</h2>
                    <p>Кадастровая карта {cityFrom(settlementName)} {cityFrom(regionName)} района {genetiveRegionName} позволяет получить в режиме онлайн открытую <Link href='/' title ='Справочная информация по объектам недвижимости в режиме online'>справочную информацию</Link> и заказать необходимые документы по конкретному объекту недвижимости, которые содержат:</p>
                    <ul>
                      <li>Информацию о <Link href='/kadastrovaya-stoimost' title='кадастровая стоимость по кадастровому номеру на 2026 год бесплатно'>кадастровой стоимости</Link> на дату запроса</li>
                      <li><Link href='/' title='узнать кадастровый номер по адресу'>кадастровый номер объекта недвижимости</Link>.</li>
                      <li>фактический адрес</li>
                      <li>Технический план участка, квартиры или здания</li>
                      <li>Раздел сведений о наличии или отсуствии ограничений и обременений</li>
                      <li>Площадь участка или ОКС</li>
                      <li>Сведения о текущих правообладателях и бывших собственниках</li>
                    </ul>
                  </section>
                  <section itemProp="articleBody" className={styles.sec} id="section-2">
                  <h2>Данные публичной кадастровой карты {cityFrom(settlementName)} {cityFrom(regionName)} района {genetiveRegionName}</h2>
                  <p>На {formattedDate} общая численность населения {cityFrom(regionName)} {genetiveRegionName} составляет <b>{population}</b> человек.</p>
                </section>
                </div>
              </article>
              </div>
            </div>
          </div>
      </div>
      )}
      <Footer host={host} url={url} />
    </>
  )
}

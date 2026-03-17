import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { cityIn, cityFrom, cityTo } from 'lvovich';
import Link from 'next/link'
import dayjs from "dayjs";
import axios from 'axios'
import Header from '@/Components/layout/Header'
import Footer from '@/Components/layout/Footer'
import CheckRaports from '@/Components/checkRaports'
import Meta from '@/Components/meta'
import SearchMap from '@/Components/layout/SearchMap';
import CheckShema from '@/Components/checkShema'
import macroRegions from '@/Components/files/macroRegions'
import PpkMap from '@/Components/ppkMap'
import style from '@/styles/goskadastr.module.css'
import styles from '@/styles/PublicCadastralMap.module.css';
import { encryptBase62 } from '@/utils/base62'

export default function GoskadastrKadastrMap ({ cities, districts, regionName, regionCode, regionStat, center, regionNumber, list, districtData, city, settlement, region, macroRegionNameGenetive, settlementName, field, url, host, totalPopulation, totalChildren, childrenPercentage, typeStats, typePercentages, settlementCounts }) {
  const citiesList = cities && JSON.parse(cities)
  const districtsList = districts && JSON.parse(districts)
  const stats = regionStat && JSON.parse(regionStat)
  const districtStats = districtData && JSON.parse(districtData)
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
  const [isCurrentlyDrawing, setIsCurrentlyDrawing] = useState(false);
  const [polygonCoordinates, setPolygonCoordinates] = useState(null);
  const [isEditingPolygon, setIsEditingPolygon] = useState(false);
  const [shema, setShema] = useState(false);
  const [checkLand, setCheckLand] = useState(false);



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

  // const aroundObjects = field && JSON.parse(field)
  const baseRegionId = macroRegions.find(it => it.key === Number(regionNumber))?.id
  const router = useRouter()
  const path = router?.asPath

  const genetiveRegionName = macroRegions?.find((it => it.name === regionName))?.genitive || macroRegions?.find((it => it.key === parseInt(regionNumber)))?.genitive

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

  const today = dayjs();
  const formattedDate = today.format('DD.MM.YYYY');

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
     cities ? `Публичная кадастровая карта ${genetiveRegionName} 2026` :
     region ? `Публичная кадастровая карта ${cityFrom(regionName)} района ${genetiveRegionName} 2026` :
     city ? `Публичная кадастровая карта ${cityFrom(regionName)} ${genetiveRegionName} 2026` :
     `Публичная кадастровая карта ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName} 2026`,
    "description":
     cities ? `Кадастровая карта  ${genetiveRegionName} 2026 года с кадастровыми сведениями по объектам недвижимости из НСПД.` :
     region ? `Кадастрвоая карта ${cityFrom(regionName)} района ${genetiveRegionName} 2026 года с кадастровыми сведениями по объектам недвижимости из НСПД.` :
     city ? `Кадастровая карта ${cityFrom(regionName)} ${genetiveRegionName} 2026 года с кадастровыми сведениями по объектам недвижимости из НСПД.` :
      `Кадастровая карта ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName} 2026 года с кадастровыми сведениями по объектам недвижимости из НСПД.`,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${baseUrl}/${path}`
    },
    "articleSection": [
      cities ? `Публичная кадастровая карта ${genetiveRegionName}` :
      region ? `Публичная кадастровая карта ${cityFrom(regionName)} района ${genetiveRegionName}` :
      city ? `Публичная кадастровая карта ${cityFrom(regionName)} ${genetiveRegionName}` : `Публичная кадастровая карта ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName}`,
      cities ? `Статистика кадастровой карты ${genetiveRegionName}` :
      region ? `Статистика кадастровой карты ${cityFrom(regionName)} района ${genetiveRegionName}` :
      city ? `Статистика кадастровой карты ${cityFrom(regionName)} ${genetiveRegionName}` : `Статистика кадастровой карты ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName}`,
      cities ? `Население на кадастроовой карте ${genetiveRegionName}` :
      region ? `Население на кадастроовой карте ${cityFrom(regionName)} района ${genetiveRegionName}` :
      city ? `Население на кадастроовой карте ${cityFrom(regionName)} ${genetiveRegionName}` : `Население на кадастроовой карте ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName}`,
      cities ? `Распределение населения ${genetiveRegionName}` :
      region ? `Распределение населения ${cityFrom(regionName)} района ${genetiveRegionName}` :
      city ? `Распределение населения ${cityFrom(regionName)} ${genetiveRegionName}` : `Распределение населения ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName}`,

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
        cities ? `Публичная кадастровая карта ${genetiveRegionName}` :
        region ? `Публичная кадастровая карта ${cityFrom(regionName)} района ${genetiveRegionName}` :
        city ? `Публичная кадастровая карта ${cityFrom(regionName)} ${genetiveRegionName}` :
        settlement ? `Публичная кадастровая карта ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName}` : `Публичная кадастровая карта ${cityFrom(streetName)} ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName}`
      ,
      "description":
        cities ? `Кадастровая карта ${genetiveRegionName} 2026 года с кадастровыми сведениями по объектам недвижимости из НСПД` :
        region ? `Кадастровая карта ${cityFrom(regionName)} района ${genetiveRegionName} 2026 года с кадастровыми сведениями по объектам недвижимости из НСПД` :
        city ? `Кадастровая карта ${cityFrom(regionName)} ${genetiveRegionName} 2026 года с кадастровыми сведениями по объектам недвижимости из НСПД` :
        settlement ? `Кадастровая карта ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName} 2026 года с кадастровыми сведениями по объектам недвижимости из НСПД` : `Кадастровая карта ${cityFrom(streetName)} ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName} 2026 года с кадастровыми сведениями по объектам недвижимости из НСПД`
      ,
      "isPartOf": { "@type": "Article", "@id": mainArticleId },
      "mainEntityOfPage": { "@type": "WebPage", "@id": `${baseUrl}/${path}` },
      "url": `${baseUrl}/${path}#section-1`
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": `${mainArticleId}#section-2`,
      "headline":
        cities ? `Статистичиеские сведения кадастровой карты ${genetiveRegionName}` :
        region ? `Статистичиеские сведения кадастровой карты ${cityFrom(regionName)} района ${genetiveRegionName}` :
        city ? `Статистичиеские сведения кадастровой карты ${cityFrom(regionName)} ${genetiveRegionName}` : `Статистичиеские сведения кадастровой карты ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName} `,
      "description":
        cities ? `Статистика по кадастровой карте ${genetiveRegionName}` :
        region ? `Статистика по кадастровой карте ${cityFrom(regionName)} района ${genetiveRegionName}` :
        city ? `Статистика по кадастровой карте ${cityFrom(regionName)} ${genetiveRegionName}` : `Статистика по кадастровой карте ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName}`,
      "isPartOf": { "@type": "Article", "@id": mainArticleId },
      "mainEntityOfPage": { "@type": "WebPage", "@id": `${baseUrl}/${path}`},
      "url": `${baseUrl}/${path}#section-2`
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": `${mainArticleId}#section-3`,
      "headline":
        cities ? `Население на кадастровой карте ${genetiveRegionName}` :
        region ? `Население на кадастровой карте ${cityFrom(regionName)} района ${genetiveRegionName}` :
        city ? `Население на кадастровой карте ${cityFrom(regionName)} ${genetiveRegionName}` :  `Население на кадастровой карте ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName}`
      ,
      "description":
        cities ? `Демографическая статистика на кадастровой карте ${genetiveRegionName}` :
        region ? `Демографическая статистика на кадастровой карте ${cityFrom(regionName)} района ${genetiveRegionName}` :
        city ? `Демографическая статистика на кадастровой карте ${cityFrom(regionName)} ${genetiveRegionName}` :  `Демографическая статистика на кадастровой карте ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName}`,
      "isPartOf": { "@type": "Article", "@id": mainArticleId },
      "mainEntityOfPage": { "@type": "WebPage", "@id": `${baseUrl}/${path}` },
      "url": `${baseUrl}/${path}}#section-3`
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": `${mainArticleId}#section-4`,
      "headline":
        cities ? `Распределение населения ${genetiveRegionName}` :
        region ? `Распределение населения ${cityFrom(regionName)} района ${genetiveRegionName}` :
        city ? `Распределение населения ${cityFrom(regionName)} ${genetiveRegionName}` : `Распределение населения ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName}`
      ,
      "description":
        cities ? `Распределение населения ${genetiveRegionName} ` :
        region ? `Распределение населения ${cityFrom(regionName)} района ${genetiveRegionName} ` :
        city ? `Распределение населения ${cityFrom(regionName)} ${genetiveRegionName} ` :  `Распределение населения ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName} `
      ,
      "isPartOf": { "@type": "Article", "@id": mainArticleId },
      "mainEntityOfPage": { "@type": "WebPage", "@id": `${baseUrl}/${path}` },
      "url": `${baseUrl}/${path}#section-4`
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
        title={`Публичная кадастровая карта ${genetiveRegionName} 2026`}
        descritoin={`Кадастровая карта ${genetiveRegionName} 2026 года с кадастровыми сведениями по объектам недвижимости из НСПД.`}
        keywords={`пкк Единого Государственного Реестра недвижимости (Росреестра), публичная кадастровая карта 2026 ${genetiveRegionName}, официальная кадастровая карта, общедоступная кадастровая карта, кадастровая карта ${genetiveRegionName}, Национальная система пространственных данных, НСПД, новая публичная кадастровая карта ${genetiveRegionName}`}
        canonicalURL={`https://${rootDomain}/${path}`}
        robots='index, follow'
        ogUrl={`https://${rootDomain}/${path}`}
        ogTitle={`Публичная кадастровая карта ${genetiveRegionName} 2026`}
        ogDescrition={`Кадастровая карта ${genetiveRegionName} 2026 года с кадастровыми сведениями по объектам недвижимости из НСПД.`}
        twitterTitle={`Публичная кадастровая карта ${genetiveRegionName} 2026`}
        twitterDescription={`Кадастровая карта ${genetiveRegionName} 2026 года с кадастровыми сведениями по объектам недвижимости из НСПД.`}
      />}
      {region &&
        <Meta
          title={`Публичная кадастровая карта ${cityFrom(regionName)} района ${genetiveRegionName} 2026`}
          descritoin={`Кадастровая карта ${cityFrom(regionName)} района ${genetiveRegionName} 2026 с кадастровыми сведениями по объектам недвижимости из НСПД`}
          keywords={`пкк Единого Государственного Реестра недвижимости (Росреестра), публичная кадастровая карта 2026 ${cityFrom(regionName)} района ${genetiveRegionName}, официальная кадастровая карта ${cityFrom(regionName)} района ${genetiveRegionName}, общедоступная кадастровая карта ${cityFrom(regionName)} района ${genetiveRegionName}, кадастровая карта ${cityFrom(regionName)} района ${genetiveRegionName}, Национальная система пространственных данных, НСПД, новая публичная кадастровая карта ${cityFrom(regionName)} района ${genetiveRegionName}`}
          canonicalURL={`https://${rootDomain}/${path}`}
          robots='index, follow'
          ogUrl={`https://${rootDomain}/${path}`}
          ogTitle={`Публичная кадастровая карта ${cityFrom(regionName)} района ${genetiveRegionName} 2026`}
          ogDescrition={`Кадастровая карта ${cityFrom(regionName)} района ${genetiveRegionName} 2026 с кадастровыми сведениями по объектам недвижимости из НСПД`}
          twitterTitle={`Публичная кадастровая карта ${cityFrom(regionName)} района ${genetiveRegionName} 2026`}
          twitterDescription={`Кадастровая карта ${cityFrom(regionName)} района ${genetiveRegionName} 2026 с кадастровыми сведениями по объектам недвижимости из НСПД`}
        />
      }

      {city &&
        <Meta
          title={`Публичная кадастровая карта ${cityFrom(regionName)} ${genetiveRegionName} 2026`}
          descritoin={`Кадастровая карта ${cityFrom(regionName)} ${genetiveRegionName} 2026 с кадастровыми сведениями по объектам недвижимости из НСПД`}
          keywords={`пкк Единого Государственного Реестра недвижимости (Росреестра), публичная кадастровая карта 2026 ${cityFrom(regionName)} ${genetiveRegionName}, официальная кадастровая карта ${cityFrom(regionName)} ${genetiveRegionName}, общедоступная кадастровая карта ${cityFrom(regionName)} ${genetiveRegionName}, кадастровая карта ${cityFrom(regionName)} ${genetiveRegionName}, Национальная система пространственных данных, НСПД, новая публичная кадастровая карта ${cityFrom(regionName)} ${genetiveRegionName}`}
          canonicalURL={`https://${rootDomain}/${path}`}
          robots='index, follow'
          ogUrl={`https://${rootDomain}/${path}`}
          ogTitle={`Публичная кадастровая карта ${cityFrom(regionName)} ${genetiveRegionName} 2026`}
          ogDescrition={`Кадастровая карта ${cityFrom(regionName)} ${genetiveRegionName} 2026 с кадастровыми сведениями по объектам недвижимости из НСПД`}
          twitterTitle={`Публичная кадастровая карта ${cityFrom(regionName)} ${genetiveRegionName} 2026`}
          twitterDescription={`Кадастровая карта ${cityFrom(regionName)} ${genetiveRegionName} 2026 с кадастровыми сведениями по объектам недвижимости из НСПД`}
        />
      }

      {settlement &&
        <Meta
        title={`Публичная кадастровая карта ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName} 2026`}
        descritoin={`Кадастровая карта ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName} 2026 с кадастровыми сведениями по объектам недвижимости из НСПД`}
        keywords={`пкк Единого Государственного Реестра недвижимости (Росреестра), публичная кадастровая карта 2026 ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName}, официальная кадастровая карта ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName}, общедоступная кадастровая карта ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName}, кадастровая карта ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName}, Национальная система пространственных данных, НСПД, новая публичная кадастровая карта ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName}`}
        canonicalURL={`https://${rootDomain}/${path}`}
        robots='index, follow'
        ogUrl={`https://${rootDomain}/${path}`}
        ogTitle={`Публичная кадастровая карта ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName} 2026`}
        ogDescrition={`Кадастровая карта ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName} 2026 с кадастровыми сведениями по объектам недвижимости из НСПД`}
        twitterTitle={`Публичная кадастровая карта ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName} 2026`}
        twitterDescription={`Кадастровая карта ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName} 2026 с кадастровыми сведениями по объектам недвижимости из НСПД`}
      />
      }
      <Header />
       <div className={`${style.section} ${style.content1} ${style.blue}`}>
          <div className={style.content1}>
            {cities ? <h1>Публичная кадастровая карта {genetiveRegionName}</h1>:
            region ? <h1>Публичная кадастровая карта {cityFrom(regionName)} района {genetiveRegionName}</h1>:
            city ? <h1>Публичная кадастровая карта {cityFrom(regionName)} {genetiveRegionName}</h1>:
            <h1>Публичная кадастровая карта {cityFrom(settlementName)} {cityFrom(regionName)} района {genetiveRegionName}</h1>
            }
            <div className={style.serviceItem}>
              <div className={style.serviceText}>
                {cities ?
                <p>Публичная кадастровая карта {genetiveRegionName} - публичная открытая информация о кадастровых объектах недвижимости, которые поставлены на учет в Единый Государственный Реестр Недвижимости.</p>:
                region ? <p>Публичная кадастровая карта {cityFrom(regionName)} района {genetiveRegionName} - публичная открытая информация о кадастровых объектах недвижимости, которые поставлены на учет в Единый Государственный Реестр Недвижимости.</p>:
                city ? <p>Публичная кадастровая карта города {cityFrom(regionName)} {genetiveRegionName} - публичная открытая информация о кадастровых объектах недвижимости, которые поставлены на учет в Единый Государственный Реестр Недвижимости.</p>:
                <p>Публичная кадастровая карта {cityFrom(settlementName)} {cityFrom(regionName)} района {genetiveRegionName} - публичная открытая информация о кадастровых объектах недвижимости, которые поставлены на учет в Единый Государственный Реестр Недвижимости.</p>
                }
              </div>
              <div className={style.servicePictureCad}></div>
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
      <div className={`${style.section} ${style.services}`}>
        <div className={style.content1}>
          <PpkMap cadastrNumber={cadastrNumber} setCloseChecker={setCloseChecker} setAlarmMessage={setAlarmMessage} setCadastrNumber={setCadastrNumber} flatRights={flatRights} promoCode={promoCode} sendActivePromoCode={sendActivePromoCode} setPromoCode={setPromoCode} setActivate={setActivate} activate={activate} lat={lat} lon={lon} closeChecker={closeChecker} setLoading={setLoading} loading={loading} setBaloonData={setBaloonData} baloonData={baloonData} onCkickCadastrNumber={onCkickCadastrNumber} setOnCkickCadastrNumber={setOnCkickCadastrNumber} setIsVisible={setIsVisible} isVisible={isVisible} error={error} setError={setError} setIsCurrentlyDrawing={setIsCurrentlyDrawing} isCurrentlyDrawing={isCurrentlyDrawing} setPolygonCoordinates={setPolygonCoordinates} polygonCoordinates={polygonCoordinates} setIsEditingPolygon={setIsEditingPolygon} isEditingPolygon={isEditingPolygon} setShema={setShema} shema={shema} setCheckLand={setCheckLand} checkLand={checkLand} />

          {!shema && (cadastrNumber || onCkickCadastrNumber) && !loading &&<CheckRaports cadNum={cadastrNumber} owner={rights} rightsCheck={rightsCheck} promoCode={promoCode} sendActivePromoCode={sendActivePromoCode} setPromoCode={setPromoCode} setActivate={setActivate} activate={activate} onCkickCadastrNumber={onCkickCadastrNumber} setIsVisible={setIsVisible} isVisible={isVisible} checkLand={checkLand} />}
          {(!isCurrentlyDrawing && polygonCoordinates && !isEditingPolygon && shema) && <CheckShema cadNum={cadastrNumber} owner={rights} rightsCheck={rightsCheck} promoCode={promoCode} sendActivePromoCode={sendActivePromoCode} setPromoCode={setPromoCode} setActivate={setActivate} activate={activate} onCkickCadastrNumber={onCkickCadastrNumber} polygonCoordinates={polygonCoordinates} />}
        </div>
      </div>
  { !baloonData &&
    <>
      {citiesList &&<div className={`${style.section} ${style.services}`}>
        <div className={style.content1}>
            <div className={style.object__block}>
              <div className={style["object__block-wrap"]}>
                <div className={style["object__block-title"]}><h2>Публичная кадастровая карта {genetiveRegionName}</h2></div>
                <article itemScope itemType="https://schema.org/Article" >
                <div className={style.contentText}>
                <section itemProp="articleBody" className={styles.sec} id="section-1">
                  <p>Кадастровая карта - интерактивный инструмент, который позволяет получить актуальные кадастровые сведения о земельных участках, зданиях и соооружениях, которые поставлены на учер в Единый Государственный Реестр Недвижимости.</p>
                  <p>По каждому объекту недвижимости доступна в режиме online следующая <Link href='/' title ='Справочная информация по объектам недвижимости в режиме online'>справочная информация:</Link></p>
                  <ul>
                    <li>адрес объекта недвижимости</li>
                    <li><Link href='/' title='кадастровая стоимость по кадастровому номеру на 2026 год бесплатно'>кадастровая стоимость</Link> объекта недвижимости</li>
                    <li><Link href='/' title='узнать кадастровый номер по адресу'>кадастровый номер</Link> , который можно узнать по адресу</li>
                    <li>категория и наначение земель</li>
                    <li>разрешенное использование земель</li>
                  </ul>
                  </section>
                  <section itemProp="articleBody" className={styles.sec} id="section-2">
                    <h2>Статистика кадастровой карты</h2>
                    <p>Согласно данным из НСПД, на {formattedDate} кадастровая карта {genetiveRegionName} содержит сведения о:</p>
                    <ul>
                      <li>{stats?.rayon?.total} кадастровых районах</li>
                      <li>{stats?.kvartal?.total} кадастровых кварталах</li>
                      <li>{stats?.oks?.total} строениях</li>
                      <li>{stats?.parcel?.total} земельных участках</li>
                    </ul>
                    <p>На территории {genetiveRegionName} расположено:</p>
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
                    <ul></ul>
                  </section>
                  <section itemProp="articleBody" className={styles.sec} id="section-3">
                    <h2>Население на кадастровой карте</h2>
                      <p>На {formattedDate} общая численность населения {genetiveRegionName} составляет <b>{population}</b> человек:</p>
                      <ul>
                        <li>{children} детей, что составляет {childrenPercent}% от общего количества населения</li>
                        <li>{totalWomen} женщин, что составляет {femalePercentage}% от взрослого населения</li>
                        <li>{totalMen} мужчин, что составляет {malePercentage}% от взрослого населения</li>
                      </ul>
                  </section>

                  <section itemProp="articleBody" className={styles.sec} id="section-4">
                    <h2>Распределение населения:</h2>
                      <ul>
                        {Object.entries(typeNames).map(([type, name]) => {
                          const population = statsType[type];
                          const percentage = statsPercent[type];
                          const count = settlementCount[type];

                          // Выводим только существующие данные
                          if (!population || !count) {
                            return null;
                          }

                          return (
                            <li key={type}>
                              {population} ({percentage}%) человек проживает в {name}.
                            </li>
                          );
                        })}
                      </ul>
                  </section>
                </div>
                </article>
                <section id="section-5">
                <div className={style.regionsContainer}>
                  <h2>Города и городские округа {genetiveRegionName}</h2>
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
        <div className={`${style.section} ${style.services}`}>
        <div className={style.content1}>
            <div className={style.object__block}>
              <div className={style["object__block-wrap"]}>
                <div className={style["object__block-title"]}><h2><Link href={`/map/${regionNumber}|${baseRegionId}`} title={`Публичная кадастровая карта ${genetiveRegionName}`}>Публичная кадастровая карта</Link> {cityFrom(regionName)} района {genetiveRegionName}</h2></div>
                <article itemScope itemType="https://schema.org/Article" >
                <div className={style.contentText}>
                <section itemProp="articleBody" className={styles.sec} id="section-1">
                  <p>Кадастровая карта - интерактивный инструмент, который позволяет получить актуальные кадастровые сведения о земельных участках, зданиях и соооружениях, которые поставлены на учер в Единый Государственный Реестр Недвижимости.</p>
                  <p>По каждому объекту недвижимости доступна в режиме online следующая <Link href='/' title ='Справочная информация по объектам недвижимости в режиме online'>справочная информация:</Link></p>
                  <ul>
                    <li>адрес объекта недвижимости</li>
                    <li><Link href='/' title='кадастровая стоимость по кадастровому номеру на 2026 год бесплатно'>кадастровая стоимость</Link> объекта недвижимости</li>
                    <li><Link href='/' title='узнать кадастровый номер по адресу'>кадастровый номер</Link> , который можно узнать по адресу</li>
                    <li>категория и наначение земель</li>
                    <li>разрешенное использование земель</li>
                  </ul>
                  </section>
                  <section itemProp="articleBody" className={styles.sec} id="section-2">
                    <h2>Статистика кадастровой карты</h2>
                    <p>Согласно данным из НСПД, на {formattedDate} кадастровая карта {cityFrom(regionName)} района {genetiveRegionName} содержит сведения о:</p>
                    <ul>
                      <li>{stats?.kvartal?.total} кадастровых кварталах</li>
                      <li>{stats?.oks?.total} строениях</li>
                      <li>{stats?.parcel?.total} земельных участках</li>
                    </ul>
                    <p>На территории {cityFrom(regionName)} района {genetiveRegionName} расположено:</p>
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
                  <section itemProp="articleBody" className={styles.sec} id="section-3">
                    <h2>Население на кадастровой карте</h2>
                      <p>На {formattedDate} общая численность населения {cityFrom(regionName)} района {genetiveRegionName} составляет <b>{population}</b> человек:</p>
                      <ul>
                        <li>{children} детей, что составляет {childrenPercent}% от общего количества населения</li>
                        <li>{totalWomen} женщин, что составляет {femalePercentage}% от взрослого населения</li>
                        <li>{totalMen} мужчин, что составляет {malePercentage}% от взрослого населения</li>
                      </ul>
                  </section>

                  <section itemProp="articleBody" className={styles.sec} id="section-4">
                    <h2>Распределение населения:</h2>
                      <ul>
                        {Object.entries(typeNames).map(([type, name]) => {
                          const population = statsType[type];
                          const percentage = statsPercent[type];
                          const count = settlementCount[type];

                          // Выводим только существующие данные
                          if (!population || !count) {
                            return null;
                          }

                          return (
                            <li key={type}>
                              {population} ({percentage}%) человек проживает в {name}.
                            </li>
                          );
                        })}
                      </ul>
                  </section>
                </div>
                </article>
                <section id="section-5">
                <div className={style.regionsContainer}>
                  {villages.length !==0 && <h2>Деревни и села {cityFrom(regionName)} района</h2>}
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
                  {settlements.length !==0 && <h2>ПГТ и поселки {cityFrom(regionName)} района</h2>}
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
                  {otherLocality.length !==0 && <h2>Другие населенные пункты {cityFrom(regionName)} района</h2>}
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
        <div className={`${style.section} ${style.services}`}>
        <div className={style.content1}>
            <div className={style.object__block}>
              <div className={style["object__block-wrap"]}>
                <div className={style["object__block-title"]}><h2><Link href={`/map/${regionNumber}|${baseRegionId}`} title={`Публичная кадастровая карта ${genetiveRegionName}`}>Публичная кадастровая карта</Link> {cityFrom(regionName)}</h2></div>
                <article itemScope itemType="https://schema.org/Article" >
                <div className={style.contentText}>
                <section itemProp="articleBody" className={styles.sec} id="section-1">
                  <p>Кадастровая карта - интерактивный инструмент, который позволяет получить актуальные кадастровые сведения о земельных участках, зданиях и соооружениях, которые поставлены на учер в Единый Государственный Реестр Недвижимости.</p>
                  <p>По каждому объекту недвижимости доступна в режиме online следующая <Link href='/' title ='Справочная информация по объектам недвижимости в режиме online'>справочная информация:</Link></p>
                  <ul>
                    <li>адрес объекта недвижимости</li>
                    <li><Link href='/' title='кадастровая стоимость по кадастровому номеру на 2026 год бесплатно'>кадастровая стоимость</Link> объекта недвижимости</li>
                    <li><Link href='/' title='узнать кадастровый номер по адресу'>кадастровый номер</Link> , который можно узнать по адресу</li>
                    <li>категория и наначение земель</li>
                    <li>разрешенное использование земель</li>
                  </ul>
                  </section>
                  {districtStats && <section itemProp="articleBody" className={styles.sec} id="section-2">
                    <h2>Статистика кадастровой карты</h2>
                    <p>Согласно данным из НСПД, на {formattedDate} кадастровая карта {cityFrom(regionName)} {genetiveRegionName} содержит сведения о:</p>
                    <ul>
                      <li>{districtStats?.stat?.kvartal?.total} кадастровых кварталов из них с границами {districtStats?.stat?.kvartal?.geo}</li>
                      <li>{districtStats?.stat?.oks?.total} объектов капитального строительства из них с границами {districtStats?.stat?.oks?.geo}</li>
                      <li>{districtStats?.stat?.parcel?.total} земельных участков из них с границами {districtStats?.stat?.parcel?.geo}</li>
                    </ul>
                  </section>}
                  <section itemProp="articleBody" className={styles.sec} id="section-3">
                    <h2>Население на кадастровой карте</h2>
                      <p>На {formattedDate} общая численность населения {cityFrom(regionName)} {genetiveRegionName} составляет <b>{population}</b> человек:</p>
                      <ul>
                        <li>{children} детей, что составляет {childrenPercent}% от общего количества населения</li>
                        <li>{totalWomen} женщин, что составляет {femalePercentage}% от взрослого населения</li>
                        <li>{totalMen} мужчин, что составляет {malePercentage}% от взрослого населения</li>
                      </ul>
                  </section>
                </div>
                </article>
                <div className={style.regionsContainer}>
                  {villages.length !==0 && <h2>Деревни и села {cityFrom(regionName)}</h2>}
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
                  {settlements.length !==0 && <h2>ПГТ и поселки {cityFrom(regionName)}</h2>}
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
                  {otherLocality.length !==0 && <h2>Другие населенные пункты {cityFrom(regionName)}</h2>}
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
              </div>
            </div>
          </div>
      </div>
      )}
      {settlement && (
        <div className={`${style.section} ${style.services}`}>
        <div className={style.content1}>
            <div className={style.object__block}>
              <div className={style["object__block-wrap"]}>
                <div className={style["object__block-title"]}><h2><Link href={`/map/${regionNumber}|${baseRegionId}`} title={`Публичная кадастровая карта ${genetiveRegionName}`}>Публичная кадастровая карта</Link> {cityFrom(settlementName)} {cityFrom(regionName)} района {genetiveRegionName}</h2></div>
                <article itemScope itemType="https://schema.org/Article" >
                <div className={style.contentText}>
                <section itemProp="articleBody" className={styles.sec} id="section-1">
                  <p>Кадастровая карта - интерактивный инструмент, который позволяет получить актуальные кадастровые сведения о земельных участках, зданиях и соооружениях, которые поставлены на учер в Единый Государственный Реестр Недвижимости.</p>
                  <p>По каждому объекту недвижимости доступна в режиме online следующая <Link href='/' title ='Справочная информация по объектам недвижимости в режиме online'>справочная информация:</Link></p>
                  <ul>
                    <li>адрес объекта недвижимости</li>
                    <li><Link href='/' title='кадастровая стоимость по кадастровому номеру на 2026 год бесплатно'>кадастровая стоимость</Link> объекта недвижимости</li>
                    <li><Link href='/' title='узнать кадастровый номер по адресу'>кадастровый номер</Link> , который можно узнать по адресу</li>
                    <li>категория и наначение земель</li>
                    <li>разрешенное использование земель</li>
                  </ul>
                  </section>
                  {population !== 0 && <section itemProp="articleBody" className={styles.sec} id="section-3">
                    <h2>Население {cityFrom(settlementName)}</h2>
                      <p>На {formattedDate} общая численность населения {cityFrom(settlementName)} {cityFrom(regionName)} района {genetiveRegionName} составляет <b>{population}</b> человек:</p>
                      <ul>
                        {children !== 0 && <li>{children} детей, что составляет {childrenPercent}% от общего количества населения</li>}
                        <li>{totalWomen} женщин, что составляет {femalePercentage}% от взрослого населения</li>
                        <li>{totalMen} мужчин, что составляет {malePercentage}% от взрослого населения</li>
                      </ul>
                  </section>}
                </div>
                </article>
              </div>
            </div>
          </div>
      </div>
      )}
    </>
  }

      <Footer />
    </>
  )
}


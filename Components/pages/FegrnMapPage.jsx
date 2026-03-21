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



export default function FegrnKadastrMap ({ cities, districts, regionName, regionCode, regionStat, center, regionNumber, list, districtData, city, settlement, region, macroRegionNameGenetive, settlementName, field, url, host, totalPopulation, totalChildren, childrenPercentage, typeStats, typePercentages, settlementCounts }) {
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
  const [flats, setFlats] = useState([])
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

  const regionFlats = flats.find((it  => it.rusName === regionName))?.flatsCount
  const regionHouse = flats.find((it  => it.rusName === regionName))?.houseCount
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
  const area = macroRegions?.find((it => it.key === parseInt(regionNumber)))?.area

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

  useEffect(() => {
    axios('/api/flatsCount')
    .then(({ data }) => setFlats(data))
  }, [])

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

  const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${baseUrl}/${path}#app`,
      "name":
        cities ? `Публичная кадастровая карта ${genetiveRegionName} 2026` :
        region ? `Публичная кадастровая карта ${cityFrom(regionName)} района ${genetiveRegionName} 2026` :
        city ? `Публичная кадастровая карта ${cityFrom(regionName)} ${genetiveRegionName} 2026` :
        `Публичная кадастровая карта ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName} 2026`,
      "url": `${baseUrl}/${path}`,
      "description":
        cities ? `Кадастровая карта  ${genetiveRegionName} 2026 года с кадастровыми сведениями по объектам недвижимости из НСПД.` :
        region ? `Кадастрвоая карта ${cityFrom(regionName)} района ${genetiveRegionName} 2026 года с кадастровыми сведениями по объектам недвижимости из НСПД.` :
        city ? `Кадастровая карта ${cityFrom(regionName)} ${genetiveRegionName} 2026 года с кадастровыми сведениями по объектам недвижимости из НСПД.` :
          `Кадастровая карта ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName} 2026 года с кадастровыми сведениями по объектам недвижимости из НСПД.`,
      "applicationCategory": "MapApplication",
      "operatingSystem": "All",
      "inLanguage": "ru",
      "browserRequirements": "Requires JavaScript",
      "author": {
        "@id": `${baseUrl}#org`
      }
    },

    {
      "@type": "WebPage",
      "@id": `${baseUrl}/${path}#page`,
      "url": `${baseUrl}/${path}`,
      "name":
        cities ? `Публичная кадастровая карта ${genetiveRegionName} 2026` :
        region ? `Публичная кадастровая карта ${cityFrom(regionName)} района ${genetiveRegionName} 2026` :
        city ? `Публичная кадастровая карта ${cityFrom(regionName)} ${genetiveRegionName} 2026` :
        `Публичная кадастровая карта ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName} 2026`,
      "description":
        cities ? `Кадастровая карта  ${genetiveRegionName} 2026 года с кадастровыми сведениями по объектам недвижимости из НСПД.` :
        region ? `Кадастрвоая карта ${cityFrom(regionName)} района ${genetiveRegionName} 2026 года с кадастровыми сведениями по объектам недвижимости из НСПД.` :
        city ? `Кадастровая карта ${cityFrom(regionName)} ${genetiveRegionName} 2026 года с кадастровыми сведениями по объектам недвижимости из НСПД.` :
          `Кадастровая карта ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName} 2026 года с кадастровыми сведениями по объектам недвижимости из НСПД.`,
      "isPartOf": {
        "@id": `${baseUrl}#website`
      },
      "about": {
        "@id": `${baseUrl}/${path}#app`
      },
      "inLanguage": "ru",
      "dateModified": new Date().toISOString()
    },

    {
      "@type": "Organization",
      "@id": `${baseUrl}#org`,
      "name": rootDomain,
      "url": baseUrl,
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logo.png`
      }
    },

    {
      "@type": "WebSite",
      "@id": `${baseUrl}#website`,
      "url": baseUrl,
      "name": "Кадастровая карта НСПД",
      "publisher": {
        "@id": `${baseUrl}#org`
      }
    }
  ]
}

const jsonLdObjects = [jsonLd]


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
        title={`Кадастровая карта НСПД ${genetiveRegionName} 2026`}
        descritoin={`Публичная кадастровая карта ${genetiveRegionName} с актуальными сведениями из НСПД за 2026 год`}
        keywords={`публичная кадастровая карта ${genetiveRegionName} 2026, официальная кадастровая карта, общедоступная кадастровая карта, пкк Единого Государственного Реестра недвижимости (Росреестра), кадастровая карта ${genetiveRegionName}, Национальная система пространственных данных, новая кадастровая карта НСПД ${genetiveRegionName}`}
        canonicalURL={`https://${rootDomain}/${path}`}
        robots='index, follow'
        ogUrl={`https://${rootDomain}/${path}`}
        ogTitle={`Кадастровая карта НСПД ${genetiveRegionName} 2026`}
        ogDescrition={`Публичная кадастровая карта ${genetiveRegionName} с актуальными сведениями из НСПД за 2026 год.`}
        twitterTitle={`Кадастровая карта НСПД ${genetiveRegionName} 2026`}
        twitterDescription={`Кадастровая карта НСПД ${genetiveRegionName} 2026`}
      />}
      {region &&
        <Meta
          host={host}
          title={`Кадастровая карта НСПД ${cityFrom(regionName)} района ${genetiveRegionName} 2026`}
          descritoin={`Публичная кадастровая карта ${cityFrom(regionName)} района ${genetiveRegionName} с актуальными сведениями из НСПД за 2026 год.`}
          keywords={`НСПД, публичная кадастровая карта ${cityFrom(regionName)} района ${genetiveRegionName} 2026, официальная кадастровая карта, общедоступная кадастровая карта, кадастровая карта ${cityFrom(regionName)} района ${genetiveRegionName}, Национальная система пространственных данных, новая кадастровая карта НСПД ${cityFrom(regionName)} района ${genetiveRegionName}`}
          canonicalURL={`https://${rootDomain}/${path}`}
          robots='index, follow'
          ogUrl={`https://${rootDomain}/${path}`}
          ogTitle={`Кадастровая карта НСПД ${cityFrom(regionName)} района ${genetiveRegionName} 2026`}
          ogDescrition={`Публичная кадастровая карта ${cityFrom(regionName)} района ${genetiveRegionName} с актуальными сведениями из НСПД за 2026 год.`}
          twitterTitle={`Кадастровая карта НСПД ${cityFrom(regionName)} района ${genetiveRegionName} 2026`}
          twitterDescription={`Публичная кадастровая карта ${cityFrom(regionName)} района ${genetiveRegionName} с актуальными сведениями из НСПД за 2026 год.`}
        />
      }

      {city &&
        <Meta
          host={host}
          title={`Кадастровая карта НСПД ${cityFrom(regionName)} ${genetiveRegionName} 2026`}
          descritoin={`Публичная кадастровая карта ${cityFrom(regionName)} ${genetiveRegionName} с актуальными сведениями из НСПД за 2026 год.`}
          keywords={`НСПД, публичная кадастровая карта ${cityFrom(regionName)} ${genetiveRegionName} 2026, официальная кадастровая карта, общедоступная кадастровая карта, кадастровая карта ${cityFrom(regionName)} ${genetiveRegionName}, Национальная система пространственных данных, новая кадастровая карта НСПД ${cityFrom(regionName)} ${genetiveRegionName}`}
          canonicalURL={`https://${rootDomain}/${path}`}
          robots='index, follow'
          ogUrl={`https://${rootDomain}/${path}`}
          ogTitle={`Кадастровая карта НСПД ${cityFrom(regionName)} ${genetiveRegionName} 2026`}
          ogDescrition={`Публичная кадастровая карта ${cityFrom(regionName)} ${genetiveRegionName} с актуальными сведениями из НСПД за 2026 год.`}
          twitterTitle={`Кадастровая карта НСПД ${cityFrom(regionName)} ${genetiveRegionName} 2026`}
          twitterDescription={`Публичная кадастровая карта ${cityFrom(regionName)} ${genetiveRegionName} с актуальными сведениями из НСПД за 2026 год.`}
        />
      }

      {settlement &&
        <Meta
          host={host}
          title={`Кадастровая карта НСПД ${settlementName} ${cityFrom(regionName)} района ${genetiveRegionName}`}
          descritoin={`Публичная кадастровая карта ${settlementName} ${cityFrom(regionName)} района ${genetiveRegionName}. ${settlementName} с актуальными сведениями из НСПД за 2026 год.`}
          keywords={`НСПД, публичная кадастровая карта ${settlementName} ${cityFrom(regionName)} района ${genetiveRegionName} 2026, официальная кадастровая карта, общедоступная кадастровая карта, кадастровая карта ${settlementName} ${cityFrom(regionName)} района ${genetiveRegionName}, Национальная система пространственных данных, новая кадастровая карта НСПД ${settlementName} ${cityFrom(regionName)} района ${genetiveRegionName}`}
          canonicalURL={`https://${rootDomain}/${path}`}
          robots='index, follow'
          ogUrl={`https://${rootDomain}/${path}`}
          ogTitle={`Кадастровая карта НСПД ${settlementName} ${cityFrom(regionName)} района ${genetiveRegionName}`}
          ogDescrition={`Публичная кадастровая карта ${settlementName} ${cityFrom(regionName)} района ${genetiveRegionName}. ${settlementName} с актуальными сведениями из НСПД за 2026 год.`}
          twitterTitle={`НСПД кадастровая карта ${settlementName} ${cityFrom(regionName)} района ${genetiveRegionName}`}
          twitterDescription={`Публичная кадастровая карта ${settlementName} ${cityFrom(regionName)} района ${genetiveRegionName}. ${settlementName} с актуальными сведениями из НСПД за 2026 год.`}
        />
          }
      <Header host={host} />
        <div className="section animate">
           <div className="layout">
            <div className={style.content1}>
            {cities ? <h1>ПКК {genetiveRegionName}</h1>:
              region ? <h1>ПКК {cityFrom(regionName)} района {genetiveRegionName}</h1>:
              city ? <h1>ПКК {cityFrom(regionName)} {genetiveRegionName}</h1>:
              <h1>ПКК {cityFrom(settlementName)} {cityFrom(regionName)} района {genetiveRegionName}</h1>
              }
            <div className={style.serviceItem}>
              <div className={style.serviceText}>
                {cities ?
                <p>Земельные участки, здания и сооружения на публичной кадастровой карте {genetiveRegionName}. Схемы земельных участков, межевание, кадастровая информация по объектам недвижимости.</p>:
                region ? <p>Земельные участки, здания и сооружения на публичной кадастровой карте {cityFrom(regionName)} района {genetiveRegionName}. Схемы земельных участков, межевание, кадастровая информация по объектам недвижимости.</p>:
                city ? <p>Земельные участки, здания и сооружения на публичной кадастровой карте {cityFrom(regionName)} {genetiveRegionName}. Схемы земельных участков, межевание, кадастровая информация по объектам недвижимости.</p>:
                <p>Земельные участки, здания и сооружения на публичной кадастровой карте {settlementName} {cityFrom(regionName)} района {genetiveRegionName}. Схемы земельных участков, межевание, кадастровая информация по объектам недвижимости.</p>
                }
              </div>
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
                  <section className={styles.sec}>
                  <h2>Публичная кадастровая карта {genetiveRegionName}</h2>
                  <p>{regionName} занимает территорию <b>{area}</b> кв.км, которая поделена на:</p>
                  <ul>
                    <li>{stats?.rayon?.total} кадастровых районов</li>
                    <li>{stats?.kvartal?.total} кадастровых кварталов</li>
                    <li>{stats?.parcel?.total} земельных участков</li>
                  </ul>
                  <p>На данной территории размещено: </p>
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
                  <p>Численность населения {genetiveRegionName} составляет <b>{population}</b> человек. Для проживания построено {stats?.oks?.total} частных домов, а так же {regionHouse} многоквартирных домов, в которых имеется {regionFlats} квартир.</p>
                </section>
                <section className={styles.sec}>
                  <h2>Кадастровые сведения</h2>
                  <p>Публичная кадастровая карта {genetiveRegionName} содержит <Link href='/' title ='Справочная информация по объектам недвижимости в режиме online'>справочную информацию</Link> по всем объектам недвижимости, внесенных в ЕГРН. По каждому найденному объекту доступны следующие сведения:</p>
                  <ul>
                    <li><Link href='/' title='кадастровая стоимость по кадастровому номеру на 2026 год бесплатно'>Кадастровая стоимость</Link></li>
                    <li>фактический адрес</li>
                    <li>кадастровый план участка или технический план квартиры</li>
                    <li><Link href='/' title='узнать кадастровый номер по адресу'>кадастровый номер</Link>.</li>
                    <li>Данные об ограничениях и обременениях</li>
                    <li>информация о собственниках</li>
                  </ul>
                </section>
                </div>
              </article>
              <section>
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
                  <section className={styles.sec}>
                  <h2><Link href={`/map/${renameUrl(`${baseRegionId}|${regionNumber}`)}`} title={`Публичная кадастровая карта ${genetiveRegionName}`}>Кадастровая карта</Link> {cityFrom(regionName)} района {genetiveRegionName}.</h2>
                  <p>{regionName} район расположен на территории {genetiveRegionName} и поделен на:</p>
                  <ul>
                    <li>{districtStats?.rayon?.total} кадастровых районов</li>
                    <li>{districtStats?.kvartal?.total} кадастровых кварталов</li>
                    <li>{districtStats?.parcel?.total} земельных участков</li>
                  </ul>
                  <p>На данной территории размещено: </p>
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
                  <p>Численность населения {cityFrom(regionName)} района {genetiveRegionName} составляет <b>{population}</b> человек. На территории района поставнлено на учет {stats?.oks?.total} капитальных строений, на каждое из которых можно запросить кадастровые сведения.</p>
                  </section>
                  <section className={styles.sec}>
                    <h2>Кадастровые сведения</h2>
                    <p>Публичная кадастровая карта {cityFrom(regionName)} района {genetiveRegionName} содержит <Link href='/' title ='Справочная информация по объектам недвижимости в режиме online'>справочную информацию</Link> по всем объектам недвижимости, внесенных в ЕГРН. По каждому найденному объекту доступны следующие сведения:</p>
                    <ul>
                      <li><Link href='/' title='кадастровая стоимость по кадастровому номеру на 2026 год бесплатно'>Кадастровая стоимость</Link></li>
                      <li>фактический адрес</li>
                      <li>кадастровый план участка или технический план квартиры</li>
                      <li><Link href='/' title='узнать кадастровый номер по адресу'>кадастровый номер</Link>.</li>
                      <li>Данные об ограничениях и обременениях</li>
                      <li>информация о собственниках</li>
                    </ul>
                  </section>
                </div>
              </article>
               <section>
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
                  <section className={styles.sec}>
                    <h2><Link href={`/map/${renameUrl(`${baseRegionId}|${regionNumber}`)}`} title={`Публичная кадастровая карта ${genetiveRegionName}`}>Кадастровая карта</Link> {cityFrom(regionName)} {genetiveRegionName}.</h2>
                     <p>{regionName} расположен на территории {genetiveRegionName} и поделен на:</p>
                      <ul>
                        <li>{districtStats?.rayon?.total} кадастровых районов</li>
                        <li>{districtStats?.kvartal?.total} кадастровых кварталов</li>
                        <li>{districtStats?.parcel?.total} земельных участков</li>
                      </ul>
                    <p>На данной территории размещено: </p>
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
                     <p>Численность населения {cityFrom(regionName)} района {genetiveRegionName} составляет <b>{population}</b> человек. На территории района поставнлено на учет {stats?.oks?.total} капитальных строений, на каждое из которых можно запросить кадастровые сведения.</p>
                  </section>
                  <section className={styles.sec}>
                    <h2>Кадастровые сведения</h2>
                    <p>Публичная кадастровая карта {cityFrom(regionName)} {genetiveRegionName} содержит <Link href='/' title ='Справочная информация по объектам недвижимости в режиме online'>справочную информацию</Link> по всем объектам недвижимости, внесенных в ЕГРН. По каждому найденному объекту доступны следующие сведения:</p>
                    <ul>
                      <li><Link href='/' title='кадастровая стоимость по кадастровому номеру на 2026 год бесплатно'>Кадастровая стоимость</Link></li>
                      <li>фактический адрес</li>
                      <li>кадастровый план участка или технический план квартиры</li>
                      <li><Link href='/' title='узнать кадастровый номер по адресу'>кадастровый номер</Link>.</li>
                      <li>Данные об ограничениях и обременениях</li>
                      <li>информация о собственниках</li>
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
                  <section className={styles.sec}>
                    <h2><Link href={`/map/${renameUrl(`${baseRegionId}|${regionNumber}`)}`} title={`Публичная кадастровая карта ${genetiveRegionName}`}>Кадастровая карта</Link> {cityFrom(settlementName)} {cityFrom(regionName)} района {genetiveRegionName}.</h2>
                    {population && <p>На {formattedDate} население {cityFrom(settlementName)} составляет <b>{population}</b> человек.</p>}
                    <p>Публичная кадастровая карта {cityFrom(settlementName)} {cityFrom(regionName)} района {genetiveRegionName} содержит <Link href='/' title ='Справочная информация по объектам недвижимости в режиме online'>справочную информацию</Link> по всем объектам недвижимости, внесенных в ЕГРН. По каждому найденному объекту доступны следующие сведения:</p>
                    <ul>
                      <li><Link href='/' title='кадастровая стоимость по кадастровому номеру на 2026 год бесплатно'>Кадастровая стоимость</Link></li>
                      <li>фактический адрес</li>
                      <li>кадастровый план участка или технический план квартиры</li>
                      <li><Link href='/' title='узнать кадастровый номер по адресу'>кадастровый номер</Link>.</li>
                      <li>Данные об ограничениях и обременениях</li>
                      <li>информация о собственниках</li>
                    </ul>
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

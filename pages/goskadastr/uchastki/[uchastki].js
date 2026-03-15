import { useState, useEffect } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { cityIn, cityFrom, cityTo } from 'lvovich';
import { useRouter } from 'next/router'
import { Search } from '@/Components/search/searchGoskadastr'
import { Header } from "@/Components/headers/headerGoskadastr"
import { Footer } from "@/Components/footer/footerGoskadastr"
import Scroll from '@/Components/scroll'
import CheckRaports from '@/Components/checkRaports'
import Meta from '@/Components/meta'
import  { SearchMap }  from '@/Components/searchMap'
import { MongoClient } from 'mongodb'
import CheckShema from '@/Components/checkShema'
import MacroRegions from '@/Components/macroRegion/macroRegions'
import macroRegions from '@/Components/files/macroRegions'
import rusRegions from '@/Components/files/regionsWithNumber'
import PpkMapUchastok from '@/Components/ppkMapUchastok'
import AroundObjects from '@/Components/aroundObjects'
import style from '@/styles/goskadastr.module.css'

const url = process.env.MONGO_URL
// const client = new MongoClient(url, { useUnifiedTopology: true })
const client = new MongoClient(process.env.MONGO_URL, { useUnifiedTopology: true })
const clientPromise = client.connect()
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0

async function getDatabase() {
  await clientPromise; // Убедитесь, что подключение завершено
  return client.db(process.env.MONGO_COLLECTION);
}



export default function Home({ cities, districts, regionName, regionCode, regionStat, center, regionNumber, list, districtData, city, settlement, region, macroRegionNameGenetive, settlementName, field, }) {
  const citiesList = cities && JSON.parse(cities)
  const districtsList = districts && JSON.parse(districts)
  const stats = regionStat && JSON.parse(regionStat)
  const districtStats = districtData && JSON.parse(districtData)
  const lat = center && JSON.parse(center)[0]
  const lon = center && JSON.parse(center)[1]
  const [cadastrData, setCadastrData] = useState([])
  const [shema, setShema] = useState(false);
  const [cadastrNumber, setCadastrNumber] = useState('')
  const [isVisible, setIsVisible] = useState(true);
  const [onCkickCadastrNumber, setOnCkickCadastrNumber] = useState('')
  const [closeChecker, setCloseChecker] = useState(false)
  const [alarmMessage, setAlarmMessage] = useState(false)
  const [flatRights, setFlatRights] = useState('')
  const [promoCode, setPromoCode] = useState('')
  const [activate, setActivate] = useState(false)
  const [loading, setLoading] = useState(false);
  const [baloonData, setBaloonData] = useState('');
  const [error, setError] = useState(false)
  const [sendActivePromoCode, SetSendActivePromoCode] = useState('')
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

  const aroundObjects = field && JSON.parse(field)


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


  const askAboutRights = async () => {
    const askObjectId = await axios(`/api/findId?cadNumber=${cadastrNumber}`)
    const objectId = askObjectId?.data
    if (objectId !== 0 && typeof objectId !== null) {
      const r = await axios(`/api/findRights?objectid=${objectId}&cadNumber=${cadastrNumber}`)
      if (typeof r !== null) {
        setFlatRights(r.data)
        return
      }
      setFlatRights('error')
      return
    }
    setFlatRights('error')
 }

  useEffect(() => {
    // askAboutRights()
    setActivate(false)
    SetSendActivePromoCode('')
  }, [cadastrNumber])

  return (
    <>
      {cities && <Meta
        title={`Кадастровые схемы расположения земельных участков ${genetiveRegionName} | Подготовка схемы земельных участков на кадастровом плане территории ${genetiveRegionName}`}
        descritoin={`Подготовка кадастровых планировочных схем для образования и перераспределения земельных участков ${genetiveRegionName} для аренды и покупки. Заказать схему расположения земельных участков ${genetiveRegionName}.`}
        keywords={`кадастровый учет земельных участков ${genetiveRegionName}, кадастровая схема земельных участков ${genetiveRegionName}, кадастровые границы земельных участков ${genetiveRegionName}, кадастровый план земельных участков ${genetiveRegionName}, кадастровый адрес земельных участков ${genetiveRegionName}, земельные участки ${genetiveRegionName}, аренда государственных земельных участков ${genetiveRegionName}, купить государственный земельный участок ${genetiveRegionName}`}
        canonicalURL={`https://nspdm.su/uchastki/${path}`}
        robots='index, follow'
        ogUrl={`https://nspdm.su/uchastki/${path}`}
        ogTitle={`Кадастровые схемы расположения земельных участков ${genetiveRegionName} | Подготовка схемы земельных участков на кадастровом плане территории ${genetiveRegionName}`}
        ogDescrition={`Подготовка кадастровых планировочных схем для образования и перераспределения земельных участков ${genetiveRegionName} для аренды и покупки. Заказать схему расположения земельных участков ${genetiveRegionName}.`}
        twitterTitle={`Кадастровые схемы расположения земельных участков ${genetiveRegionName} | Подготовка схемы земельных участков на кадастровом плане территории ${genetiveRegionName}`}
        twitterDescription={`Подготовка кадастровых планировочных схем для образования и перераспределения земельных участков ${genetiveRegionName} для аренды и покупки. Заказать схему расположения земельных участков ${genetiveRegionName}.`}
      />}
      {region &&
        <Meta
          title={`Кадастровые схемы расположения земельных участков ${cityFrom(regionName)} района ${genetiveRegionName} | Подготовка схемы земельных участков на кадастровом плане территории ${cityFrom(regionName)} района ${genetiveRegionName}`}
          descritoin={`Подготовка кадастровых планировочных схем для образования и перераспределения земельных участков ${cityFrom(regionName)} района ${genetiveRegionName} для аренды и покупки. Заказать схему расположения земельных участков ${cityFrom(regionName)} района ${genetiveRegionName}.`}
          keywords={`кадастровый учет земельных участков ${cityFrom(regionName)} района ${genetiveRegionName}, кадастровая схема земельных участков ${cityFrom(regionName)} района ${genetiveRegionName}, кадастровые границы земельных участков ${cityFrom(regionName)} района ${genetiveRegionName}, кадастровый план земельных участков ${cityFrom(regionName)} района ${genetiveRegionName}, кадастровый адрес земельных участков ${cityFrom(regionName)} района ${genetiveRegionName}, земельные участки ${cityFrom(regionName)} района ${genetiveRegionName}, аренда государственных земельных участков ${cityFrom(regionName)} района ${genetiveRegionName}, купить государственный земельный участок ${cityFrom(regionName)} района ${genetiveRegionName}`}
          canonicalURL={`https://nspdm.su/uchastki/${path}`}
          robots='index, follow'
          ogUrl={`https://nspdm.su/uchastki/${path}`}
          ogTitle={`Кадастровые схемы расположения земельных участков ${cityFrom(regionName)} района ${genetiveRegionName} | Подготовка схемы земельных участков на кадастровом плане территории ${cityFrom(regionName)} района ${genetiveRegionName}`}
          ogDescrition={`Подготовка кадастровых планировочных схем для образования и перераспределения земельных участков ${cityFrom(regionName)} района ${genetiveRegionName} для аренды и покупки. Заказать схему расположения земельных участков ${cityFrom(regionName)} района ${genetiveRegionName}.`}
          twitterTitle={`Кадастровые схемы расположения земельных участков ${cityFrom(regionName)} района ${genetiveRegionName} | Подготовка схемы земельных участков на кадастровом плане территории ${cityFrom(regionName)} района ${genetiveRegionName}`}
          twitterDescription={`Подготовка кадастровых планировочных схем для образования и перераспределения земельных участков ${cityFrom(regionName)} района ${genetiveRegionName} для аренды и покупки. Заказать схему расположения земельных участков ${cityFrom(regionName)} района ${genetiveRegionName}.`}
        />
      }

      {city &&
        <Meta
          title={`Кадастровые схемы расположения земельных участков ${cityFrom(regionName)} ${genetiveRegionName} | Подготовка схемы земельных участков на кадастровом плане территории ${cityFrom(regionName)} ${genetiveRegionName}`}
          descritoin={`Подготовка кадастровых планировочных схем для образования и перераспределения земельных участков ${cityFrom(regionName)} ${genetiveRegionName} для аренды и покупки. Заказать схему расположения земельных участков ${cityFrom(regionName)} ${genetiveRegionName}.`}
          keywords={`кадастровый учет земельных участков ${cityFrom(regionName)} ${genetiveRegionName}, кадастровая схема земельных участков ${cityFrom(regionName)} ${genetiveRegionName}, кадастровые границы земельных участков ${cityFrom(regionName)} ${genetiveRegionName}, кадастровый план земельных участков ${cityFrom(regionName)} ${genetiveRegionName}, кадастровый адрес земельных участков ${cityFrom(regionName)} ${genetiveRegionName}, земельные участки ${cityFrom(regionName)} ${genetiveRegionName}, аренда государственных земельных участков ${cityFrom(regionName)} ${genetiveRegionName}, купить государственный земельный участок ${cityFrom(regionName)} ${genetiveRegionName}`}
          canonicalURL={`https://nspdm.su/uchastki/${path}`}
          robots='index, follow'
          ogUrl={`https://nspdm.su/uchastki/${path}`}
          ogTitle={`Кадастровые схемы расположения земельных участков ${cityFrom(regionName)} ${genetiveRegionName} | Подготовка схемы земельных участков на кадастровом плане территории ${cityFrom(regionName)} ${genetiveRegionName}`}
          ogDescrition={`Подготовка кадастровых планировочных схем для образования и перераспределения земельных участков ${cityFrom(regionName)} ${genetiveRegionName} для аренды и покупки. Заказать схему расположения земельных участков ${cityFrom(regionName)} ${genetiveRegionName}.`}
          twitterTitle={`Кадастровые схемы расположения земельных участков ${cityFrom(regionName)} ${genetiveRegionName} | Подготовка схемы земельных участков на кадастровом плане территории ${cityFrom(regionName)} ${genetiveRegionName}`}
          twitterDescription={`Подготовка кадастровых планировочных схем для образования и перераспределения земельных участков ${cityFrom(regionName)} ${genetiveRegionName} для аренды и покупки. Заказать схему расположения земельных участков ${cityFrom(regionName)} ${genetiveRegionName}.`}
        />
      }

      {settlement &&
        <Meta
          title={`Кадастровые схемы расположения земельных участков ${settlementName} ${cityFrom(regionName)} района ${genetiveRegionName} | Подготовка схемы земельных участков на кадастровом плане территории ${settlementName} ${cityFrom(regionName)} района ${genetiveRegionName}`}
          descritoin={`Подготовка кадастровых планировочных схем для образования и перераспределения земельных участков ${settlementName} ${cityFrom(regionName)} района ${genetiveRegionName} для аренды и покупки. Заказать схему расположения земельных участков ${settlementName} ${cityFrom(regionName)} района ${genetiveRegionName}.`}
          keywords={`кадастровый учет земельных участков ${settlementName} ${cityFrom(regionName)} района ${genetiveRegionName}, кадастровая схема земельных участков ${settlementName} ${cityFrom(regionName)} района ${genetiveRegionName}, кадастровые границы земельных участков ${settlementName} ${cityFrom(regionName)} района ${genetiveRegionName}, кадастровый план земельных участков ${settlementName} ${cityFrom(regionName)} района ${genetiveRegionName}, кадастровый адрес земельных участков ${settlementName} ${cityFrom(regionName)} района ${genetiveRegionName}, земельные участки ${settlementName} ${cityFrom(regionName)} района ${genetiveRegionName}, аренда государственных земельных участков ${settlementName} ${cityFrom(regionName)} района ${genetiveRegionName}, купить государственный земельный участок ${settlementName} ${cityFrom(regionName)} района ${genetiveRegionName}`}
          canonicalURL={`https://nspdm.su/uchastki/${path}`}
          robots='index, follow'
          ogUrl={`https://nspdm.su/uchastki/${path}`}
          ogTitle={`Кадастровые схемы расположения земельных участков ${settlementName} ${cityFrom(regionName)} района ${genetiveRegionName} | Подготовка схемы земельных участков на кадастровом плане территории ${settlementName} ${cityFrom(regionName)} района ${genetiveRegionName}`}
          ogDescrition={`Подготовка кадастровых планировочных схем для образования и перераспределения земельных участков ${settlementName} ${cityFrom(regionName)} района ${genetiveRegionName} для аренды и покупки. Заказать схему расположения земельных участков ${settlementName} ${cityFrom(regionName)} района ${genetiveRegionName}.`}
          twitterTitle={`Кадастровые схемы расположения земельных участков ${settlementName} ${cityFrom(regionName)} района ${genetiveRegionName} | Подготовка схемы земельных участков на кадастровом плане территории ${settlementName} ${cityFrom(regionName)} района ${genetiveRegionName}`}
          twitterDescription={`Подготовка кадастровых планировочных схем для образования и перераспределения земельных участков ${settlementName} ${cityFrom(regionName)} района ${genetiveRegionName} для аренды и покупки. Заказать схему расположения земельных участков ${settlementName} ${cityFrom(regionName)} района ${genetiveRegionName}.`}
        />
          }
      <Header />
       <div className={`${style.section} ${style.content1} ${style.blue}`}>
          <div className={style.content1}>
            {cities ? <h1>Кадастровые схемы расположения земельных участков {genetiveRegionName}.</h1>:
            region ? <h1>Кадастровые схемы расположения земельных участков {cityFrom(regionName)} района {genetiveRegionName}.</h1>:
            city ? <h1>Кадастровые схемы расположения земельных участков {cityFrom(regionName)} {genetiveRegionName}.</h1>:
            <h1>Кадастровые схемы расположения земельных участков {settlementName} {cityFrom(regionName)} района {genetiveRegionName}.</h1>
            }
            <div className={style.serviceItem}>
              <div className={style.serviceText}>
                {cities ?
                <p>Сервис по подготовке схем земельных участков на кадастровом плане территории для дальнейшего образования или перераспределения земельных участков {genetiveRegionName}, которые можно арендовать, приобрести или получить безвозмездно в собственность, например многодетным семъям.</p>:
                region ? <p>Сервис по подготовке схем земельных участков на кадастровом плане территории для дальнейшего образования или перераспределения земельных участков {cityFrom(regionName)} района {genetiveRegionName}, которые можно арендовать, приобрести или получить безвозмездно в собственность, например многодетным семъям.</p>:
                city ? <p>Сервис по подготовке схем земельных участков на кадастровом плане территории для дальнейшего образования или перераспределения земельных участков {cityFrom(regionName)} {genetiveRegionName}, которые можно арендовать, приобрести или получить безвозмездно в собственность, например многодетным семъям.</p>:
                <p>Сервис по подготовке схем земельных участков на кадастровом плане территории для дальнейшего образования или перераспределения земельных участков {settlementName} {cityFrom(regionName)} района {genetiveRegionName}, которые можно арендовать, приобрести или получить безвозмездно в собственность, например многодетным семъям.</p>
                }
              </div>
              <div className={style.servicePictureUch}></div>
            </div>
          <SearchMap setCadastrData={setCadastrData} cadastrData={cadastrData} setCadastrNumber={setCadastrNumber} closeChecker={closeChecker} alarmMessage={alarmMessage} setAlarmMessage={setAlarmMessage} setBaloonData={setBaloonData} error={error} setError={setError}/>
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
        <PpkMapUchastok cadastrNumber={cadastrNumber} setCloseChecker={setCloseChecker} setAlarmMessage={setAlarmMessage} setCadastrNumber={setCadastrNumber} flatRights={flatRights} promoCode={promoCode} sendActivePromoCode={sendActivePromoCode} setPromoCode={setPromoCode} setActivate={setActivate} activate={activate} lat={lat} lon={lon} closeChecker={closeChecker} setLoading={setLoading} loading={loading} setBaloonData={setBaloonData} baloonData={baloonData} onCkickCadastrNumber={onCkickCadastrNumber} setOnCkickCadastrNumber={setOnCkickCadastrNumber} setIsVisible={setIsVisible} isVisible={isVisible} error={error} setError={setError} />
          {(cadastrNumber || onCkickCadastrNumber) && <CheckRaports cadNum={cadastrNumber} owner={rights} rightsCheck={rightsCheck} promoCode={promoCode} sendActivePromoCode={sendActivePromoCode} setPromoCode={setPromoCode} setActivate={setActivate} activate={activate} onCkickCadastrNumber={onCkickCadastrNumber} />}
        {!shema && (cadastrNumber || onCkickCadastrNumber) && !loading &&<CheckRaports cadNum={cadastrNumber} owner={rights} rightsCheck={rightsCheck} promoCode={promoCode} sendActivePromoCode={sendActivePromoCode} setPromoCode={setPromoCode} setActivate={setActivate} activate={activate} onCkickCadastrNumber={onCkickCadastrNumber} setIsVisible={setIsVisible} isVisible={isVisible} checkLand={checkLand} />}
          {(!isCurrentlyDrawing && polygonCoordinates && !isEditingPolygon && shema) && <CheckShema cadNum={cadastrNumber} owner={rights} rightsCheck={rightsCheck} promoCode={promoCode} sendActivePromoCode={sendActivePromoCode} setPromoCode={setPromoCode} setActivate={setActivate} activate={activate} onCkickCadastrNumber={onCkickCadastrNumber} polygonCoordinates={polygonCoordinates} />}
        </div>
      </div>
      {citiesList &&<div className={`${style.section} ${style.services}`}>
        <div className={style.content1}>
            <div className={style.object__block}>
              <div className={style["object__block-wrap"]}>
              <div className={style["object__block-title"]}><h2>Кадастровые планировочные схемы земельных участков {genetiveRegionName}</h2></div>
                <div className={style.contentText}>
                  <p>Сервис по подготовке схем земельных участков {genetiveRegionName} позволяет найти свободный муниципальный участок для дальнейшей аренды, покупки или безвозмездного приобретения в собственность с помощью различных государственных программ.</p>
                  <p>Для того чтобы инициализировать процесс образования участка, который в дальнейшем можно будет получить в собственность или взять в аренду у государства, необходимо первым делом сформировать кадастровую схему земельного участка, которая подается в соотвествующие муниципальные органы {genetiveRegionName}, вместе с заявлением на предварительное согласование образования земельного участка.</p>
                 </div>
                <div className={style["object__block-title"]}><h2>Как заказать кадастровую схему земельного участка {genetiveRegionName}?</h2></div>
                <div className={style.contentText}>
                  <p>Для того, чтобы подать заявку на подготовку кадастровой схемы земельного участка, необходимо выбрать подходящее место на <Link href={`/map/${regionNumber}|${baseRegionId}`} title={`публичная кадастровая карта ${genetiveRegionName}`}>кадастровой карте {genetiveRegionName}</Link> и сформировать полигон. Далее, следуя инструкции, необходимо перейти к заказу заявки на подготовку кадастровой схемы земельного участка. После оплаты заказ поступает в работу к специалистам сервиса.</p>
                 </div>
                <div className={style.regionsContainer}>
                  <h2>Города и городские округа {genetiveRegionName}</h2>
                  {citiesList.map((it, index) => {
                    return (
                    <Link href={`/uchastki/${regionNumber}_${it.id}`} className={style.regionName} key={index}>
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
                      <Link href={`/uchastki/${regionNumber}-${it.id}`} className={style.regionName} key={index}>
                        <div className={style.statRegionContainer}>
                          <div className={style.name}>{it.name}</div>
                        </div>
                      </Link>
                      )
                    })
                  }
                </div>
              </div>
            </div>
          </div>
      </div>}
      {region && (
        <div className={`${style.section} ${style.services}`}>
        <div className={style.content1}>
            <div className={style.object__block}>
              <div className={style["object__block-wrap"]}>
                <div className={style["object__block-title"]}><h2>Кадастровые планировочные схемы земельных участков {cityFrom(regionName)} района</h2></div>
                <div className={style.contentText}>
                  <p>Сервис по подготовке схем земельных участков {cityFrom(regionName)} района {genetiveRegionName} позволяет найти свободный муниципальный участок для дальнейшей аренды, покупки или безвозмездного приобретения в собственность с помощью различных государственных программ.</p>
                  <p>Для того чтобы инициализировать процесс образования участка, который в дальнейшем можно будет получить в собственность или взять в аренду у государства, необходимо первым делом сформировать кадастровую схему земельного участка, которая подается в соотвествующие муниципальные органы {cityFrom(regionName)} района {genetiveRegionName}, вместе с заявлением на предварительное согласование образования земельного участка.</p>
                </div>
                <div className={style["object__block-title"]}><h2>Как заказать кадастровую схему земельного участка {cityFrom(regionName)} района {genetiveRegionName}?</h2></div>
                <div className={style.contentText}>
                  <p>Для того, чтобы подать заявку на подготовку кадастровой схемы земельного участка, необходимо выбрать подходящее место на <Link href={`/map/${regionNumber}|${baseRegionId}`} title={`публичная кадастровая карта ${genetiveRegionName}`}>кадастровой карте {cityFrom(regionName)} района {genetiveRegionName}</Link> и сформировать полигон. Далее, следуя инструкции, необходимо перейти к заказу заявки на подготовку кадастровой схемы земельного участка. После оплаты заказ поступает в работу к специалистам сервиса.</p>
                 </div>
                <div className={style.regionsContainer}>
                  {villages.length !==0 && <h2>Деревни и села</h2>}
                  {villages.map((it, index) => {
                    return (
                      <>

                        <Link href={`/uchastki/${regionNumber},${it.id}`} className={style.regionName} key={index}>
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

                        <Link href={`/uchastki/${regionNumber},${it.id}`} className={style.regionName} key={index}>
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

                        <Link href={`/uchastki/${regionNumber},${it.id}`} className={style.regionName} key={index}>
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
      {city && (
        <div className={`${style.section} ${style.services}`}>
        <div className={style.content1}>
            <div className={style.object__block}>
              <div className={style["object__block-wrap"]}>
                <div className={style["object__block-title"]}><h2>Кадастровые планировочные схемы земельных участков {cityFrom(regionName)} </h2></div>
                <div className={style.contentText}>
                  <p>Сервис по подготовке схем земельных участков {cityFrom(regionName)} {genetiveRegionName} позволяет найти свободный муниципальный участок для дальнейшей аренды, покупки или безвозмездного приобретения в собственность с помощью различных государственных программ.</p>
                  <p>Для того чтобы инициализировать процесс образования участка, который в дальнейшем можно будет получить в собственность или взять в аренду у государства, необходимо первым делом сформировать кадастровую схему земельного участка, которая подается в соотвествующие муниципальные органы {cityFrom(regionName)} {genetiveRegionName}, вместе с заявлением на предварительное согласование образования земельного участка.</p>
                </div>
                <div className={style["object__block-title"]}><h2>Как заказать кадастровую схему земельного участка {cityFrom(regionName)} {genetiveRegionName}?</h2></div>
                <div className={style.contentText}>
                  <p>Для того, чтобы подать заявку на подготовку кадастровой схемы земельного участка, необходимо выбрать подходящее место на <Link href={`/map/${regionNumber}|${baseRegionId}`} title={`публичная кадастровая карта ${genetiveRegionName}`}>кадастровой карте {cityFrom(regionName)} {genetiveRegionName}</Link> и сформировать полигон. Далее, следуя инструкции, необходимо перейти к заказу заявки на подготовку кадастровой схемы земельного участка. После оплаты заказ поступает в работу к специалистам сервиса.</p>
                 </div>
                <div className={style.regionsContainer}>
                  {villages.length !==0 && <h2>Деревни и села</h2>}
                  {villages.map((it, index) => {
                    return (
                      <>
                        <Link href={`/uchastki/${regionNumber},${it.id}`} className={style.regionName} key={index}>
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
                        <Link href={`/uchastki/${regionNumber},${it.id}`} className={style.regionName} key={index}>
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
                        <Link href={`/uchastki/${regionNumber},${it.id}`} className={style.regionName} key={index}>
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
                <div className={style["object__block-title"]}><h2>Кадастровые планировочные схемы земельных участков {settlementName} {cityFrom(regionName)} района {genetiveRegionName}</h2></div>
                <div className={style.contentText}>
                  <p>Сервис по подготовке схем земельных участков {settlementName} {cityFrom(regionName)} района {genetiveRegionName} позволяет найти свободный муниципальный участок для дальнейшей аренды, покупки или безвозмездного приобретения в собственность с помощью различных государственных программ.</p>
                  <p>Для того чтобы инициализировать процесс образования участка, который в дальнейшем можно будет получить в собственность или взять в аренду у государства, необходимо первым делом сформировать кадастровую схему земельного участка, которая подается в соотвествующие муниципальные органы {settlementName} {cityFrom(regionName)} района {genetiveRegionName}, вместе с заявлением на предварительное согласование образования земельного участка.</p>
                </div>
                <div className={style["object__block-title"]}><h2>Как заказать кадастровую схему земельного участка {settlementName} {cityFrom(regionName)} района {genetiveRegionName}?</h2></div>
                <div className={style.contentText}>
                  <p>Для того, чтобы подать заявку на подготовку кадастровой схемы земельного участка, необходимо выбрать подходящее место на <Link href={`/map/${regionNumber}|${baseRegionId}`} title={`публичная кадастровая карта ${genetiveRegionName}`}>кадастровой карте {settlementName} {cityFrom(regionName)} района {genetiveRegionName}</Link> и сформировать полигон. Далее, следуя инструкции, необходимо перейти к заказу заявки на подготовку кадастровой схемы земельного участка. После оплаты заказ поступает в работу к специалистам сервиса.</p>
                 </div>
              </div>
            </div>
          </div>
      </div>
      )}
      {/* {aroundObjects && <div className={`${style.section} ${style.services}`}>
        <div className={style.content1}>
            <div className={style.object__block}>
              <div className={style["object__block-wrap"]}>
                <div className={style["object__block-title"]}><h2>Найденные земельные участки</h2></div>
                <AroundObjects aroundObjects={aroundObjects}/>
              </div>
            </div>
          </div>
      </div>} */}
      <Scroll />
      <Footer />
    </>
  )
}


export async function getServerSideProps(context) {
  const db = await getDatabase();
  let regionData = context.params.uchastki;

  if (regionData.includes('-')) {
    const regionNumber = regionData.split('-')[0];
    const regionId = parseInt(regionData.split('-')[1]);

    const collection = db.collection('Reestr_geo');
    const array = await collection.find({ 'regionId': regionId }).toArray();
    const settlementsArray = array.map((it) => {
      return {
        name: `${it.settlement_type}. ${it.settlement_name}`,
        id: it.settlementId,
        reestrId: it.id_rosreestr_geo,
        region_name: it.region_name
      };
    });

    const clearRegionList = Array.from(new Set(settlementsArray.map(JSON.stringify)), JSON.parse);
    const list = clearRegionList.filter(item => !item.name.includes('р-н')).filter(item => item.name.trim() !== '');
    const regionName = list[0]?.region_name;

    const db1 = client.db('cadastr');
    const collection1 = db1.collection('reeestr_districts');
    const object = await collection1.findOne({ districtId: regionId });


    function convertCoordinates(point) {
      return [(2 * Math.atan(Math.exp(point[1] / 6378137)) - Math.PI / 2) / (Math.PI / 180), point[0] / (Math.PI / 180.0) / 6378137.0];
    }

    const center = convertCoordinates([object?.data?.feature?.center?.x, object?.data?.feature?.center?.y]);

    return {
      props: {
        list: JSON.stringify(list) || null,
        regionName: regionName || null,
        regionNumber: regionNumber || null,
        districtData: JSON.stringify(object?.data?.feature) || null,
        center: JSON.stringify(center) || null,
        region: 'ok',
        // field:JSON.stringify(field) || null
      }
    };
  }

  if (regionData.includes('_')) {
    const regionNumber = regionData.split('_')[0];
    const regionId = parseInt(regionData.split('_')[1]);
    const collection = db.collection('Reestr_geo');
    const array = await collection.find({ 'regionId': regionId }).toArray();
    const settlementsArray = array.map((it) => {
      return {
        name: `${it.settlement_type}. ${it.settlement_name}`,
        id: it.settlementId,
        reestrId: it.id_rosreestr_geo,
        region_name: it.region_name
      };
    });

    const clearRegionList = Array.from(new Set(settlementsArray.map(JSON.stringify)), JSON.parse);
    const list = clearRegionList.filter(item => !item.name.includes('р-н')).filter(item => item.name.trim() !== '');
    let regionName = list[0]?.region_name;
    if (regionId === 39100000600000) {
      regionName = "Джанкой"
    }
    const db1 = client.db('cadastr');
    const collection1 = db1.collection('reeestr_districts');
    const object = await collection1.findOne({ districtId: regionId });
    // let center = convertCoordinates([object?.data?.feature?.center?.x, object?.data?.feature?.center?.y]);

    function convertCoordinates(point) {
      return [(2 * Math.atan(Math.exp(point[1] / 6378137)) - Math.PI / 2) / (Math.PI / 180), point[0] / (Math.PI / 180.0) / 6378137.0];
    }

    let center = convertCoordinates([object?.data?.feature?.center?.x, object?.data?.feature?.center?.y])

    if (!object) {
      const askToken = await axios('https://doc.nspdm.su/api/token');
      const token = askToken.data;
      const url = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address';
      const getAskDadata = await axios({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': token,
          'Host': 'suggestions.dadata.ru',
        },
        url: encodeURI(url),
        data: { query: regionName, 'count': 10 }
      });

      const settlementDadada = getAskDadata.data.suggestions[0];
      center = [settlementDadada?.data?.geo_lat, settlementDadada?.data?.geo_lon];
    }

    return {
      props: {
        list: JSON.stringify(list) || null,
        regionName: regionName || null,
        regionNumber: regionNumber || null,
        districtData: JSON.stringify(object?.data?.feature) || null,
        center: JSON.stringify(center) || null,
        city: 'ok'
      }
    };
  }

  if (regionData.includes(',')) {
    const regionNumber = regionData.split(',')[0];
    const regionId = parseInt(regionData.split(',')[1]);

    const collection = db.collection('Reestr_geo');
    const array = await collection.find({ 'settlementId': regionId }).toArray();
    // console.log('array', array)
    const settlementsArray = array.map((it) => {
      return {
        macroRegionId: it?.macroRegionId,
        name: `${it.settlement_type}. ${it.settlement_name}`,
        id: it?.settlementId,
        reestrId: it?.id_rosreestr_geo,
        region_name: it?.region_name
      };
    });

    const regionName = settlementsArray[0]?.region_name;
    const settlementName = settlementsArray[0]?.name;
    const macroRegionNameGenetive = macroRegions.find((it) => it.id === settlementsArray[0]?.macroRegionId)?.genitive;
    const macroRegionName = macroRegions.find((it) => it.id === settlementsArray[0]?.macroRegionId)?.name;

    let fullAddress = `${macroRegionName}, ${array[0].region_name} ${array[0].region_type}, ${settlementName}`;
    // console.log('fullAddress', fullAddress)
    const askToken = await axios('https://doc.nspdm.su/api/token');
    const token = askToken.data;
    const url = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address';
    const getAskDadata = await axios({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': token,
        'Host': 'suggestions.dadata.ru',
      },
      url: encodeURI(url),
      data: { query: fullAddress, 'count': 10 }
    });

    let settlementDadada = getAskDadata.data.suggestions[0];
    // console.log('settlementDadada', settlementDadada)

    if (!settlementDadada) {
      const fullAddress = `${macroRegionName}, ${array[0].region_name}, ${settlementName}`
      const askToken = await axios('https://doc.nspdm.su/api/token');
      const token = askToken.data;
      const url = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address';
      const getAskDadata = await axios({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': token,
          'Host': 'suggestions.dadata.ru',
        },
        url: encodeURI(url),
        data: { query: fullAddress, 'count': 10 }
      });
      settlementDadada = getAskDadata.data.suggestions[0]
    }
    // console.log('fullAddress', fullAddress)

    let center = [settlementDadada?.data?.geo_lat || 55.755864, settlementDadada?.data?.geo_lon || 37.617698, 13];
    // const pkkData = await axios(encodeURI(`https://pkk.rosreestr.ru/api/features/2?sq={"type":"Point","coordinates":[${center[1]},${center[0]}]}&tolerance=1&limit=11`))
    // console.log('pkkData', pkkData?.data)

    // const extent = pkkData?.data?.features?.[0]?.extent

    // const bbox = `${extent?.xmin},${extent?.ymin},${extent?.xmax},${extent?.ymax}`;

    // const url1 = `https://nspd.gov.ru/api/aeggis/v2/36048/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetFeatureInfo&FORMAT=image%2Fpng&TRANSPARENT=true&QUERY_LAYERS=36048&LAYERS=36048&INFO_FORMAT=application%2Fjson&FEATURE_COUNT=1000&I=50&J=50&CRS=EPSG%3A3857&STYLES=&WIDTH=101&HEIGHT=101&BBOX=${bbox}`

    // const nspdData = await axios({
    //   headers: {
    //     'Access-Control-Allow-Origin': '*',
    //     'Host': 'nspd.gov.ru',
    //     'Referer': 'https://nspd.gov.ru/map',
    //     'rejectUnauthorized': false,
    //   },
    //   method: 'GET',
    //   timeout: 1000 * 10,
    //   url: url1
    // })
    // const field = nspdData?.data?.features

    return {
      props: {
        list: JSON.stringify(settlementsArray) || null,
        regionName: regionName || null,
        regionNumber: regionNumber || null,
        settlement: 'ok',
        macroRegionNameGenetive: macroRegionNameGenetive || null,
        settlementName: settlementName || null,
        center: JSON.stringify(center) || null,
        // field: JSON.stringify(field) || null
      }
    };
  }

  const regionNumber = context.params.uchastki.split('|')[0];
  const regionCadastrCode = parseInt(context.params.uchastki.split('|')[1]);
  const regionName = macroRegions.find((it) => it.id === regionCadastrCode)?.name;
  const collection = db.collection('reeestr_regions');
  const regionStatsData = await collection.findOne({ 'attrs.id': regionNumber });
  let center = convertCoordinates([regionStatsData?.center?.x, regionStatsData?.center?.y]);

  if (!regionStatsData) {
    const askToken = await axios('https://doc.nspdm.su/api/token');
    const token = askToken.data;
    const url = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address';
    const getAskDadata = await axios({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': token,
        'Host': 'suggestions.dadata.ru',
      },
      url: encodeURI(url),
      data: { query: regionName, 'count': 10 }
    });

    const settlementDadada = getAskDadata.data.suggestions[0];
    center = [settlementDadada?.data?.geo_lat, settlementDadada?.data?.geo_lon];
  }

  const collection1 = db.collection('Reestr_geo');
  const array = await collection1.find({ 'macroRegionId': regionCadastrCode }).toArray();

  const regionArray = array.map((it) => {
    return {
      name: `${it.region_type}. ${it.region_name}`,
      id: it.regionId,
    };
  });

  const clearRegionList = Array.from(new Set(regionArray.map(JSON.stringify)), JSON.parse);
  const cities = clearRegionList.filter(item => !item.name.includes('р-н')).filter(item => item.name.trim() !== '');
  const districts = clearRegionList.filter(item => item.name.includes('р-н')).filter(item => item.name.trim() !== '');
  const arrayOfAllDistricts = [...cities, ...districts];

  function convertCoordinates(point) {
    return [(2 * Math.atan(Math.exp(point[1] / 6378137)) - Math.PI / 2) / (Math.PI / 180), point[0] / (Math.PI / 180.0) / 6378137.0];
  }

  // const center = convertCoordinates([regionStatsData?.center?.x, regionStatsData?.center?.y]);

  return {
    props: {
      cities: JSON.stringify(cities) || null,
      districts: JSON.stringify(districts) || null,
      regionName: regionName || null,
      regionCode: regionCadastrCode || null,
      regionStat: JSON.stringify(regionStatsData?.stat) || null,
      center: JSON.stringify(center) || null,
      regionNumber: regionNumber || null,
      // field: JSON.stringify(field) || null
    }
  };
}
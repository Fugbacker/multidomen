import { useState, useEffect } from 'react'
import Header from '@/Components/layout/Header'
import Footer from '@/Components/layout/Footer'
import Scroll from '@/Components/scroll'
import CheckRaports from '@/Components/checkRaports'
import Meta from '@/Components/meta'
import SearchMap from '@/Components/layout/SearchMap';
import MacroUchastok from '@/Components/macroUchastok'
import PpkMapUchastok from '@/Components/ppkMapUchastok'
import style from '@/styles/rosegrn.module.css'

export default function Home({ country, lat, lon, referer }) {
  const [cadastrData, setCadastrData] = useState([])
  const [cadastrNumber, setCadastrNumber] = useState('')
  const [onCkickCadastrNumber, setOnCkickCadastrNumber] = useState('')
  const [closeChecker, setCloseChecker] = useState(false)
  const [error, setError] = useState(false)
  const [alarmMessage, setAlarmMessage] = useState(false)
  const [flatRights, setFlatRights] = useState('')
  const [isVisible, setIsVisible] = useState(true);
  const [promoCode, setPromoCode] = useState('')
  const [activate, setActivate] = useState(false)
  const [loading, setLoading] = useState(false);
  const [baloonData, setBaloonData] = useState('');
  const [sendActivePromoCode, SetSendActivePromoCode] = useState('')
  const rights = flatRights?.realty?.rights
  const rightsCheck = rights?.filter((it) =>  it?.rightState === 1)

  useEffect(() => {
    setCadastrData([])
  }, [closeChecker])

  useEffect(() => {
    setCadastrData([])
  }, [alarmMessage])

  useEffect(() => {
    SetSendActivePromoCode(promoCode)
  }, [activate])


//   const askAboutRights = async () => {
//     const askObjectId = await axios(`/api/findId?cadNumber=${cadastrNumber}`)
//     const objectId = askObjectId?.data
//     if (objectId !== 0 && typeof objectId !== null) {
//       const r = await axios(`/api/findRights?objectid=${objectId}&cadNumber=${cadastrNumber}`)
//       if (typeof r !== null) {
//         setFlatRights(r.data)
//         return
//       }
//       setFlatRights('error')
//       return
//     }
//     setFlatRights('error')
//  }

  useEffect(() => {
    // askAboutRights()
    setActivate(false)
    SetSendActivePromoCode('')
  }, [cadastrNumber])


  return (
    <>
      <Meta
        title={`Земельные участки России - государственный кадастровый учет земельных участков | Кадастровый адрес, границы, план, схемы, кадастровые номера земельных участков России.`}
        descritoin={`Поиск частных и государственных земельных участков для аренды и покупки. Кадастровый план и схемы земельных участков, кадастровые границы, кадастровый адрес и государственный кадастровый учет земельных участков.`}
        keywords={`кадастровый учет земельных участков, кадастровая схема земельных участков, кадастровые границы земельных участков, кадастровый план земельных участков, кадастровый адрес земельных участков, земельные участки, аренда государственных земельных участков, купить государственный земельный участок`}
        canonicalURL={`https://gockadastr.su/zemelnie-uchastki`}
        robots='index, follow'
        ogUrl={`https://gockadastr.su/zemelnie-uchastki`}
        ogTitle={`Земельные участки России - государственный кадастровый учет земельных участков | Кадастровый адрес, границы, план, схемы, кадастровые номера земельных участков России.`}
        ogDescrition={`Поиск частных и государственных земельных участков для аренды и покупки. Кадастровый план и схемы земельных участков, кадастровые границы, кадастровый адрес и государственный кадастровый учет земельных участков.`}
        twitterTitle={`Земельные участки России - государственный кадастровый учет земельных участков | Кадастровый адрес, границы, план, схемы, кадастровые номера земельных участков России.`}
        twitterDescription={`Поиск частных и государственных земельных участков для аренды и покупки. Кадастровый план и схемы земельных участков, кадастровые границы, кадастровый адрес и государственный кадастровый учет земельных участков.`}
      />
      <Header />
      <div className={`${style.section} ${style.content1} ${style.blue}`}>
          <div className={style.content1}>
            <h1>Земельные участки РФ: государственный кадастровый учет земельных участков</h1>
            <div className={style.serviceItem}>
              <div className={style.serviceText}>
                <p>Федеральный реестр земельных участков России. Государственный кадастровый учет земельных участков, кадастровые схемы, границы, планы, кадастровый адрес земельных участков.</p>
              </div>
              <div className={style.servicePictureUch}></div>
            </div>
            <SearchMap setCadastrData={setCadastrData} cadastrData={cadastrData} setCadastrNumber={setCadastrNumber} closeChecker={closeChecker} alarmMessage={alarmMessage} setAlarmMessage={setAlarmMessage} setBaloonData={setBaloonData} referer={referer} error={error} setError={setError} />
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
        <PpkMapUchastok cadastrNumber={cadastrNumber} setCloseChecker={setCloseChecker} setAlarmMessage={setAlarmMessage} setCadastrNumber={setCadastrNumber} flatRights={flatRights} promoCode={promoCode} sendActivePromoCode={sendActivePromoCode} setPromoCode={setPromoCode} setActivate={setActivate} activate={activate} lat={lat} lon={lon} closeChecker={closeChecker} setLoading={setLoading} loading={loading} setBaloonData={setBaloonData} baloonData={baloonData} onCkickCadastrNumber={onCkickCadastrNumber} setOnCkickCadastrNumber={setOnCkickCadastrNumber} setIsVisible={setIsVisible} isVisible={isVisible} error={error} setError={setError}/>
        {(cadastrNumber || onCkickCadastrNumber) && !loading &&<CheckRaports cadNum={cadastrNumber} owner={rights} rightsCheck={rightsCheck} promoCode={promoCode} sendActivePromoCode={sendActivePromoCode} setPromoCode={setPromoCode} setActivate={setActivate} activate={activate} onCkickCadastrNumber={onCkickCadastrNumber} />}
        </div>
      </div>
      <div className={`${style.section} ${style.services}`}>
        <div className={style.content1}>
            <div className={style.object__block}>
              <div className={style["object__block-wrap"]}>
                <div className={style["object__block-title"]}><h2>Кадастровый учет земельных участков</h2></div>
                    <div className={style.contentText}>
                    <p>Федеральный реестр земельных участков содержит каталогизированную базу земельных участков России с кадастровыми координатами, схемами расположения и кадастровыми границами земельных участков. Позволяет найти и выбрать земельный участок сельхозназначения для аренды, а так же для приобретения в собственность участков под ИЖС.</p>
                    <p>Реестр земельных участков содержит, как муниципальные или государственные земельные участки, так и те, что находятся в частной собственности. </p>
                    <p>Воспользовавшись поиском по земельным участкам, можно получить следующую информацию:</p>
                    <ul className={style.govy1}>
                    <li>муниципальные земельные участки;</li>
                    <li>частные земельные участки;</li>
                    <li>разрешенное использование земельного участка;</li>
                    <li>виды земельных участков;</li>
                    <li>узнать жилой земельный участок или нет;</li>
                    <li>кадастровый адрес земельного участка;</li>
                    <li>размер земельного участка.</li>
                    </ul>
                  </div>
                </div>
            </div>
          </div>
      </div>
      <div className={`${style.section} ${style.services}`}>
        <div className={style.content1}>
            <div className={style.object__block}>
              <div className={style["object__block-wrap"]}>
                <div className={style["object__block-title"]}><h2>Земельные участки регионов РФ</h2></div>
                  <MacroUchastok />
                </div>
            </div>
          </div>
      </div>
      <Scroll />
      <Footer />
    </>
  )
}


// export async function getServerSideProps(context) {
//   // let regionData = context.params.map
//   const referer = context?.req?.headers?.referer?.split('/kadastr/')?.[1] || null

//   const regexp = /\d+\:\d+\:\d+\:\d+/g
//   // const checker = regexp.test(regionData)
//   try {
//     const userIp = await axios('https://kraken.rambler.ru/userip')
//     const userGeolocation = await axios(`http://ip-api.com/json/${userIp.data}`)
//     const country = userGeolocation?.data?.country

//     if (country === 'Russia' && referer) {
//       return {
//         props: {
//           country: userGeolocation?.data?.country,
//           lat: userGeolocation?.data?.lat,
//           lon: userGeolocation?.data?.lon,
//           referer
//         },
//       }
//     } else if (country === 'Russia' && !referer) {
//       return {
//         props: {
//           country: userGeolocation?.data?.country,
//           lat: userGeolocation?.data?.lat,
//           lon: userGeolocation?.data?.lon
//         },
//       }
//     } else {
//       return {
//         props: {
//           country: 'Russia',
//           lat: 55.755864,
//           lon: 37.617698
//         },
//       }
//     }

//   } catch {
//     return {
//       props: {
//         country: 'Russia',
//         lat: 55.755864,
//         lon: 37.617698
//       },
//     }
//   }
// }


export async function getServerSideProps(context) {
  const referer = context?.req?.headers?.referer?.split('/cn/')?.[1] || null
  return {
    props: {
      country: 'Russia',
      lat: 55.755864,
      lon: 37.617698,
      referer
    },
  }
}
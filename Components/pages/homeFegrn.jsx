import React, { useState, useEffect, useRef} from 'react'
import axios from 'axios'
import Head from 'next/head'
import Link from 'next/link'
import dayjs from "dayjs";
import { IoCheckmarkDone } from "react-icons/io5";
import Header from '@/Components/layout/Header'
import Footer from '@/Components/layout/Footer'
import Scroll from '@/Components/scroll'
import CheckRaports from '@/Components/checkRaports'
import CheckShema from '@/Components/checkShema'
import Meta from '@/Components/meta'
import SearchMap from '@/Components/layout/SearchMap';
import MacroRegion from '@/Components/macroRegion';
import PpkMap from '@/Components/ppkMap'
import style from '@/styles/fegrn.module.css'
import styles from'@/styles/PublicCadastralMap.module.css'


export default function HomeFegrn ({ country, lat, lon, url, host }) {
  const [cadastrData, setCadastrData] = useState([])
  const [cadastrNumber, setCadastrNumber] = useState('')
  const [onCkickCadastrNumber, setOnCkickCadastrNumber] = useState('')
  const [closeChecker, setCloseChecker] = useState(false)
  const [alarmMessage, setAlarmMessage] = useState(false)
  const [flatRights, setFlatRights] = useState('')
  const [isVisible, setIsVisible] = useState(true)
  const [promoCode, setPromoCode] = useState('')
  const [error, setError] = useState(false)
  const [shema, setShema] = useState(false);
  const [type, setType] = useState(false)
  const [activate, setActivate] = useState(false)
  const [loading, setLoading] = useState(false);
  const [baloonData, setBaloonData] = useState(null)
  const [sendActivePromoCode, SetSendActivePromoCode] = useState('')
  const rights = flatRights?.realty?.rights
  const rightsCheck = rights?.filter((it) =>  it?.rightState === 1)
  const [checkLand, setCheckLand] = useState(false);
  const [isCurrentlyDrawing, setIsCurrentlyDrawing] = useState(false);
  const [polygonCoordinates, setPolygonCoordinates] = useState(null);
  const [isEditingPolygon, setIsEditingPolygon] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);

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
    // askAboutRights()
    setActivate(false)
    SetSendActivePromoCode('')
  }, [cadastrNumber])

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const baseUrl = url


  const mainArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Публичная кадастровая карта 2026 года",
    "description": "Кадастровая НСПД карта 2026 - публичная кадастровая информация об объекта недвижимости",
    "author": {
      "@type": "Organization",
      "name": host,
      "url": baseUrl
    },
    "publisher": {
      "@type": "Organization",
      "name": host,
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/images/opg1.jpg`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": baseUrl
    },
    "url": baseUrl
  }

  const jsonLdObjects = [mainArticle]

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
      <Meta
        host={host}
        title={`Публичная кадастровая карта 2026 года | Национальная система пространственных данных`}
        descritoin={`Кадастровая НСПД карта 2026 - публичная кадастровая информация об объекта недвижимости`}
        keywords={`пкк росреестра, публичная кадастровая карта 2026, официальная кадастровая карта, общедоступная кадастровая карта, Национальная система пространственных данных, публичная кадастровая карта 2026, новая публичная кадастровая карта, кадастровая карта НСПД, пкк НСПД, публичная кадастровая карта РФ`}
        canonicalURL={baseUrl}
        robots='index, follow'
        ogUrl={baseUrl}
        ogTitle={`Публичная кадастровая карта 2026 года | Национальная система пространственных данных`}
        ogDescrition={`Кадастровая НСПД карта 2026 - публичная кадастровая информация об объекта недвижимости`}
        twitterTitle={`Публичная кадастровая карта 2026 года | Национальная система пространственных данных`}
        twitterDescription={`Кадастровая НСПД карта 2026 - публичная кадастровая информация об объекта недвижимости`}
      />
      <Header host={host} />
      <div className={`${style.section} ${style.content1} ${style.blue}`}>
          <div className={style.content1}>
            <h1>Публичная кадастровая карта</h1>
            <div className={style.serviceItem}>
              <div className={style.servicePictureCad}></div>
              <div className={style.serviceText}>
                <p>Кадастровая карта позволяет получать кадастровую информацию по любому объекту недвижимости, внесенному в Росреестр. Поиск объекта осуществляется по его кадастровому номеру или фактическому адресу.</p>
              </div>
            </div>
            <SearchMap setCadastrData={setCadastrData} cadastrData={cadastrData} setCadastrNumber={setCadastrNumber} closeChecker={closeChecker} alarmMessage={alarmMessage} setAlarmMessage={setAlarmMessage} setBaloonData={setBaloonData} error={error} setError={setError} type={type} setType={setType}/>
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
          <PpkMap cadastrNumber={cadastrNumber} setCloseChecker={setCloseChecker} setAlarmMessage={setAlarmMessage} setCadastrNumber={setCadastrNumber} flatRights={flatRights} promoCode={promoCode} sendActivePromoCode={sendActivePromoCode} setPromoCode={setPromoCode} setActivate={setActivate} activate={activate} lat={lat} lon={lon} closeChecker={closeChecker} setLoading={setLoading} loading={loading} setBaloonData={setBaloonData} baloonData={baloonData} onCkickCadastrNumber={onCkickCadastrNumber} setOnCkickCadastrNumber={setOnCkickCadastrNumber} setIsVisible={setIsVisible} isVisible={isVisible} error={error} setError={setError} type={type} setType={setType} setIsCurrentlyDrawing={setIsCurrentlyDrawing} isCurrentlyDrawing={isCurrentlyDrawing} setPolygonCoordinates={setPolygonCoordinates} polygonCoordinates={polygonCoordinates} setIsEditingPolygon={setIsEditingPolygon} isEditingPolygon={isEditingPolygon} setShema={setShema} shema={shema} setCheckLand={setCheckLand} checkLand={checkLand}  />

          {!shema && (cadastrNumber || onCkickCadastrNumber) && !loading &&<CheckRaports cadNum={cadastrNumber} owner={rights} rightsCheck={rightsCheck} promoCode={promoCode} sendActivePromoCode={sendActivePromoCode} setPromoCode={setPromoCode} setActivate={setActivate} activate={activate} onCkickCadastrNumber={onCkickCadastrNumber} setIsVisible={setIsVisible} isVisible={isVisible} checkLand={checkLand} host={host} />}
          {(!isCurrentlyDrawing && polygonCoordinates && !isEditingPolygon && shema) && <CheckShema cadNum={cadastrNumber} owner={rights} rightsCheck={rightsCheck} promoCode={promoCode} sendActivePromoCode={sendActivePromoCode} setPromoCode={setPromoCode} setActivate={setActivate} activate={activate} onCkickCadastrNumber={onCkickCadastrNumber} polygonCoordinates={polygonCoordinates} />}
        </div>
      </div>
      {!baloonData &&
        <>
        <main>
          <article>
          <div className={`${style.section} ${style.services}`}>
            <div className={style.content1}>
                <div className={style.object__block}>
                  <div className={style["object__block-wrap"]}>
                    <div className={style["object__block-title"]}><h2>Публичная кадастровая карта 2026</h2></div>
                      <section className={styles.sec}>
                       <table itemScope itemType="https://schema.org/Table">
                          <tbody>
                            <tr>
                              <td data-label="Понятие"><b>Межевание</b></td>
                              <td data-label="Описание">Процесс формирования земельного участка с определением координат угловых точек земельного участка.</td>
                            </tr>
                            <tr>
                              <td data-label="Понятие"><b>Границы участка</b></td>
                              <td data-label="Описание">Фактические границы земельного участка, которые определены в процессе межевания. Появляются на кадастровой карте после медевания.</td>
                            </tr>
                            <tr>
                              <td data-label="Понятие"><b>Схема участка</b></td>
                              <td data-label="Описание">Кадастровый документ, содержащий схему земельного участка, необходимый при подаче заявления на предварительное согласование.</td>
                            </tr>
                            <tr>
                              <td data-label="Понятие"><b>Предварительное согласование участка</b></td>
                              <td data-label="Описание">Процесс получения одобрения органов администрации на создание земельного участка на пустом никем не занятом месте.</td>
                            </tr>
                            <tr>
                              <td data-label="Отчёт"><b>Кадастровая стоимость</b></td>
                              <td data-label="Информация">Кадастровая стоимость - стоимость земельного участка, определяемая в процессе проведения кадастровой оценки.</td>
                            </tr>
                         </tbody>
                        </table>
                      </section>
                    </div>
                </div>
              </div>
          </div>
          <section>
            <div className={`${style.section} ${style.services}`}>
              <div className={style.content1}>
                  <div className={style.object__block}>
                    <div className={style["object__block-wrap"]}>
                      <div className={style["object__block-title"]}><h2>Регионы на кадастровой карте</h2></div>
                        <MacroRegion host={host}/>
                      </div>
                  </div>
                </div>
            </div>
          </section>

          </article>
          </main>
        </>
      }
      <Footer host={host} url={url} />
    </>
  )
}


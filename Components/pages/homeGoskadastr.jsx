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
import style from '@/styles/goskadastr.module.css'
import styles from'@/styles/PublicCadastralMap.module.css'


export default function HomeGoskadastr ({ country, lat, lon, url, host }) {
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

  const mainArticleId = `${baseUrl}#mainArticle`

  const mainArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": mainArticleId,
    "headline": "Публичная кадастровая карта 2026",
    "description": "Кадастровые сведения из НСПД и Росреестра на публичной кадастровой карте 2026 года",
    "author": {
      "@type": "Organization",
      "name": "Росреестр",
      "url": baseUrl
    },
    "publisher": {
      "@type": "Organization",
      "name": "НСПД",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/images/opg1.jpg`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": baseUrl
    },
    "articleSection": [
      "Кадастровая карта и доступная информация",
      "Что такое публичная кадастровая карта",
      "Слои кадастровой карты",
      "Поиск кадастровых объектов",
      "Какие кадастровые объекты расположены на карте",
      "Перечень доступных для заказа отчетов",
      "Что такое схема участка",
      "Часто задаваемые вопросы",
    ],
    "url": baseUrl
  }

  // секции — каждая как Article (isPartOf -> основной)
  const sections = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": `${mainArticleId}#section-1`,
      "headline": "Кадастровая карта: какие сведения доступны",
      "description": "Публичная кадастровая карта  - описание доступных сведений для каждого кадастрового объекта.",
      "isPartOf": { "@type": "Article", "@id": mainArticleId },
      "mainEntityOfPage": { "@type": "WebPage", "@id": baseUrl },
      "url": `${baseUrl}#section-1`
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": `${mainArticleId}#section-2`,
      "headline": "Что такое публичная кадастровая карта",
      "description": "Сферы применения публичной кадастровой карты.",
      "isPartOf": { "@type": "Article", "@id": mainArticleId },
      "mainEntityOfPage": { "@type": "WebPage", "@id": baseUrl },
      "url": `${baseUrl}#section-2`
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": `${mainArticleId}#section-3`,
      "headline": "Слои кадастровой карты",
      "description": "Какие сведения содержат отдельные кадастровые слои.",
      "isPartOf": { "@type": "Article", "@id": mainArticleId },
      "mainEntityOfPage": { "@type": "WebPage", "@id": baseUrl },
      "url": `${baseUrl}#section-3`
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": `${mainArticleId}#section-4`,
      "headline": "Поиск кадастровых объектов",
      "description": "Как работает поиск кадастровых объектов.",
      "isPartOf": { "@type": "Article", "@id": mainArticleId },
      "mainEntityOfPage": { "@type": "WebPage", "@id": baseUrl },
      "url": `${baseUrl}#section-4`
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": `${mainArticleId}#section-5`,
      "headline": "Объекты недвижимости на кадастровой карте",
      "description": "Описание объектов публичной кадастровой карты.",
      "isPartOf": { "@type": "Article", "@id": mainArticleId },
      "mainEntityOfPage": { "@type": "WebPage", "@id": baseUrl },
      "url": `${baseUrl}#section-5`
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": `${mainArticleId}#section-6`,
      "headline": "Официальные документы.",
      "description": "Описание отчетов, доступных для заказов.",
      "isPartOf": { "@type": "Article", "@id": mainArticleId },
      "mainEntityOfPage": { "@type": "WebPage", "@id": baseUrl },
      "url": `${baseUrl}#section-6`
    },
    // {
    //   "@context": "https://schema.org",
    //   "@type": "Article",
    //   "@id": `${mainArticleId}#section-7`,
    //   "headline": "Схема участка.",
    //   "description": "Что такое схема участка.",
    //   "isPartOf": { "@type": "Article", "@id": mainArticleId },
    //   "mainEntityOfPage": { "@type": "WebPage", "@id": baseUrl },
    //   "url": `${baseUrl}#section-7`
    // },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": `${mainArticleId}#section-7`,
      "headline": "FAQ.",
      "description": "Часто задаваемые вопросы по кадастровой карте.",
      "isPartOf": { "@type": "Article", "@id": mainArticleId },
      "mainEntityOfPage": { "@type": "WebPage", "@id": baseUrl },
      "url": `${baseUrl}#section-8`
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
      <Meta
        title={`Публичная кадастровая карта 2026`}
        descritoin={`Кадастровые сведения из НСПД и Росреестра на публичной кадастровой карте 2026 года`}
        keywords={`пкк росреестра, публичная кадастровая карта 2026, официальная кадастровая карта, общедоступная кадастровая карта, Национальная система пространственных данных, публичная кадастровая карта 2026, новая публичная кадастровая карта, кадастровая карта НСПД, пкк НСПД, публичная кадастровая карта РФ`}
        canonicalURL={baseUrl}
        robots='index, follow'
        ogUrl={baseUrl}
        ogTitle={`Публичная кадастровая карта 2026`}
        ogDescrition={`Кадастровые сведения из НСПД и Росреестра на публичной кадастровой карте 2026 года`}
        twitterTitle={`Публичная кадастровая карта 2026`}
        twitterDescription={`Кадастровые сведения из НСПД и Росреестра на публичной кадастровой карте 2026 года`}
      />
      <Header />
      <div className={`${style.section} ${style.content1} ${style.blue}`}>
          <div className={style.content1}>
            <h1>Публичная кадастровая карта России</h1>
            <div className={style.serviceItem}>
              <div className={style.serviceText}>
                <p>Публичная кадастровая карта - федеральный кадастровый сервис поиска земельных участков, зданий и сооружений. Кадастровые сведения получены из открытых источников и актуальны на момент запроса.</p>
              </div>
              <div className={style.servicePictureCad}></div>
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
          <article id="mainArticle" itemScope itemType="https://schema.org/Article" itemProp="mainContentOfPage">
          <div className={`${style.section} ${style.services}`}>
            <div className={style.content1}>
                <div className={style.object__block}>
                  <div className={style["object__block-wrap"]}>
                    <div className={style["object__block-title"]}><h2>Кадастровая карта и поиск сведений</h2></div>
                      <section id="section-1" itemProp="articleBody" className={styles.sec}>
                        <p>Публичная кадастровая карта Российской Федерации значительно упрощает поиск сведений об объектах недвижимости и дополнительно содержит:</p>
                        <ul className={style.govy1}>
                          <li>Информацию о межевании земельных участков;</li>
                          <li>Сведения о размере кадастровой стоимости;</li>
                          <li>Сведения о территориальных зонах и иные виды деления;</li>
                          <li>Данные о действующих ограничениях и обременениях;</li>
                          <li>Возможность оформления и заказа кадастровых отчетов;</li>
                        </ul>
                      </section>

                      <section id="section-2" itemProp="articleBody" className={styles.sec}>
                        <h2>Взаимодействие с кадастровой картой</h2>
                        <p>Кадастровая карта РФ представляет собой интерактивный онлайн-сервис, предназначенный для просмотра и получения публичных кадастровых сведений о земельных участках и иных объектах недвижимости. Данные об объекте недвижимости формируются из открытых источников Росреестра и НСПД и предоставляются пользователям на бесплатной основе.</p>
                        <p>На карте публикуются данные о местоположении объектов, их границах, площади, кадастровой стоимости и других характеристиках земельных участков (ЗУ) и объектов капитального строительства (ОКС). Дополнительно отображаются сведения о зарегистрированных правах и истории их перехода.</p>
                        <p>Сервис функционирует в режиме реального времени, что позволяет получать актуальную информацию о недвижимости. Данные публичной кадастровой карты используются для решения следующих задач:</p>
                        <ul className={style.govy1}>
                          <li>проведение сделок с объектами недвижимости;</li>
                          <li>оформление и регистрация прав собственности;</li>
                          <li>градостроительное планирование;</li>
                          <li>землеустройство и управление территориями;</li>
                          <li>расчет и контроль налогообложения;</li>
                          <li>мониторинг состояния объектов недвижимости;</li>
                          <li>планирование использования земель;</li>
                          <li>обеспечение безопасности населения и территорий.</li>
                        </ul>
                        <p>Таким образом, публичная кадастровая карта является удобным и информативным инструментом, обеспечивающим оперативный доступ к официальным сведениям об объектах недвижимости.</p>
                      </section>

                      <section id="section-3" itemProp="articleBody" className={styles.sec}>
                        <h2>Пространственные слои кадастровой карты</h2>
                        <p>В качестве основы применяется общедоступная картографическая подложка, поверх которой размещаются специализированные кадастровые слои. Каждый слой отражает отдельный вид сведений. Всего предусмотрено пять основных слоев:</p>
                        <ul className={style.govy1}>
                          <li>Слой с границами земельных участков;</li>
                          <li>Слой, отображающий здания, сооружения и объекты незавершенного строительства;</li>
                          <li>Слой единиц кадастрового деления;</li>
                          <li>Слой зон и территорий с особыми условиями использования;</li>
                          <li>Слой, содержащий сведения о кадастровой стоимости.</li>
                        </ul>
                        <p>Каждый из перечисленных слоев включает как графическую информацию, так и технические данные по соответствующим объектам.</p>
                      </section>

                      <section id="section-4" itemProp="articleBody" className={styles.sec}>
                        <h2>Поиск на кадастровой картой</h2>
                        <p>Публичная кадастровая карта России предоставляет возможность в интерактивном формате получать сведения о недвижимости и визуально просматривать установленные границы земельных участков. Для поиска информации необходимо ввести кадастровый номер или адрес объекта в поисковую строку. Допускается также выбор участка непосредственно на карте — при наличии сведений в базе Росреестра или НСПД соответствующая информация будет автоматически выведена на экран.</p>
                      </section>

                      <section id="section-5" itemProp="articleBody" className={styles.sec}>
                        <h2>Какие объекты отображаются на публичной кадастровой карте</h2>
                        <p>В зависимости от выбранного кадастрового слоя на карте могут отображаться различные категории объектов недвижимости, включая:</p>
                        <ul className={style.govy1}>
                          <li>Земельные участки;</li>
                          <li>Единицы кадастрового деления, а также зоны и территории;</li>
                          <li>Здания, сооружения и объекты незавершенного строительства.</li>
                        </ul>
                      </section>

                      <section id="section-6" itemProp="articleBody" className={styles.sec}>
                        <h2>Какие отчеты можно заказать</h2>
                        <p>По каждому найденному объекту недвижимости пользователю доступен заказ нескольких видов отчетов:</p>
                        <table itemScope itemType="https://schema.org/Table">
                          <thead>
                            <tr>
                              <th>Отчёт</th>
                              <th>Содержание</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td data-label="Отчёт"><b>Справка о кадастровой стоимости</b></td>
                              <td data-label="Информация">Официальный документ, подтверждающий актуальную кадастровую стоимость объекта на дату запроса, который необходим для формирования налогооблагаемой базы.</td>
                            </tr>
                            <tr>
                              <td data-label="Отчёт"><b>Сводный земельный отчёт</b></td>
                              <td data-label="Информация">Включает сведения о возможных пересечениях с зонами с особыми условиями использования территорий (ЗОУИТ), а также информацию о пересечениях с соседними участками. Если отчет не содержит пересечений, то сведения о пересечениях не выводятся.</td><td data-label="Информация"></td>
                            </tr>
                            <tr>
                              <td data-label="Отчёт"><b>Отчёт о переходе прав</b></td>
                              <td data-label="Информация">Отражает историю перехода права собственности на объект недвижимости. Не содержит ФИО собственников.</td>
                            </tr>
                            <tr>
                              <td data-label="Отчёт"><b>Основные характеристики</b></td>
                              <td data-label="Информация">Содержит технические параметры объекта и сведения о зарегистрированных ограничениях и обременениях.Рекомендуется заказывать в паре со сводным отчетом, так как они могут содержать сведения о разных обременениях. Не содержит ФИО собственников.</td>
                            </tr>
                         </tbody>
                        </table>
                      </section>

                      {/* <section id="section-7" itemProp="articleBody" className={styles.sec}>
                        <h2>Схемы участков на публичной кадастровой карте</h2>
                        <p>Функционал публичной кадастровой карты позволяет сформировать <Link href="/uchastki" title='схема участка для предварительного согласования'>схему участка</Link> для предварительного согласования. Такая схема используется при оформлении заявления о предварительном согласовании земельного участка в аренду либо в собственность.</p>
                      </section> */}

                      <section className={styles.sec} itemScope itemType="https://schema.org/FAQPage" id="section-7">
                        <h2>Вопросы и ответы</h2>
                        {[
                          {
                            question: `Что такое межевание?`,
                            answer: `Межевание представляет собой процедуру определения и закрепления границ земельного участка кадастровым инженером. С использованием геодезического оборудования устанавливаются характерные точки и формируются координаты границ. После завершения процедуры участок начинает отображаться на кадастровой карте.`,
                          },
                          {
                            question: 'Содержит ли публичная кадастровая карта информацию, если участок не размежеван?',
                            answer: `Да, если участок поставлен на кадастровый учет и сведения о нем внесены в Росреестр, информацию можно получить даже при отсутствии установленных границ. Однако визуально такой объект на карте не отображается.`,
                          },
                          {
                            question: `Как часто обновляются сведения на кадастровой карте?`,
                            answer: `Информация на карте актуализируется после обновления баз данных Росреестра. В среднем обновление сведений происходит примерно один раз в неделю.`,
                          },
                          {
                            question: `Можно ли доверять сведениям кадастровой карты?`,
                            answer: `Данные публичной кадастровой карты являются актуальными на момент запроса из Росеестра и НСПД, однако носят информационный характер. Для получения официальных сведений рекомендуется заказать соответствующий отчет.`,
                          },
                          {
                            question: `Почему участок или дом не отображается на кадастровой карте?`,
                            answer: `Для отображения земельного участка требуется проведение межевания, а для строения — его государственная регистрация в Росреестре. При отсутствии межевания или регистрации объект не будет отображаться на карте.`,
                          },
                        ].map((item, i) => (
                          <div
                            key={i}
                            className={styles['faq-item']}
                            itemProp="mainEntity"
                            itemScope
                            itemType="https://schema.org/Question"
                          >
                            <h3
                              onClick={() => toggleFAQ(i)}
                              className={`${styles['faq-question']} ${activeIndex === i ? 'active' : ''}`}
                              itemProp="name"
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') toggleFAQ(i);
                              }}
                            >
                              <IoCheckmarkDone /> {item.question}
                            </h3>

                            <div
                              className={styles['faq-answer']}
                              itemProp="acceptedAnswer"
                              itemScope
                              itemType="https://schema.org/Answer"
                              style={{ display: activeIndex === i ? 'block' : 'none' }}
                            >
                              <p itemProp="text">{item.answer}</p>
                            </div>
                          </div>
                        ))}
                      </section>

                    </div>
                </div>
              </div>
          </div>
          <section  id="section-9">
          <div className={`${style.section} ${style.services}`}>
            <div className={style.content1}>
                <div className={style.object__block}>
                  <div className={style["object__block-wrap"]}>
                    <div className={style["object__block-title"]}><h2>Публичная кадастровая карта регионов</h2></div>
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


import { useState, useEffect } from 'react'
import axios from 'axios'
import Link from 'next/link'
import Head from 'next/head'
import dayjs from "dayjs";
import { IoCheckmarkDone } from "react-icons/io5";
import Header from '@/Components/layout/Header'
import Footer from '@/Components/layout/Footer'
import Scroll from '@/Components/scroll'
import CheckRaports from '@/Components/checkRaports'
import CheckShema from '@/Components/checkShema'
import Meta from '@/Components/meta'
import SearchMap from '@/Components/layout/SearchMap';
import MacroUchastok from '@/Components/macroUchastok'
import PpkMapUchastok from '@/Components/ppkMapUchastok'
import style from '@/styles/goskadastr.module.css'
import styles from'@PublicCadastralMap.module.css'

export default function Home({ country, lat, lon, referer }) {
  const [cadastrData, setCadastrData] = useState([])
  const [cadastrNumber, setCadastrNumber] = useState('')
  const [onCkickCadastrNumber, setOnCkickCadastrNumber] = useState('')
  const [closeChecker, setCloseChecker] = useState(false)
  const [error, setError] = useState(false)
  const [shema, setShema] = useState(false);
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
  const [activeIndex, setActiveIndex] = useState(null);
  const [isCurrentlyDrawing, setIsCurrentlyDrawing] = useState(false);
  const [polygonCoordinates, setPolygonCoordinates] = useState(null);
  const [isEditingPolygon, setIsEditingPolygon] = useState(false);

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

    const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
    };

    const baseUrl = 'https://doc.nspdm.su' // поставь свой URL если нужно
    const datePublished = '13.10.2026'
    const dateModified = dayjs().format("DD.MM.YYYY")
    const mainArticleId = `${baseUrl}#main-article`

    const mainArticle = {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": mainArticleId,
      "headline": "Схемы участка для предварительного согасования предоставления участка",
      "description": "Сервис формирования схемы для предварительного согасования предоставления участка в аренду или собственность.",
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
      "datePublished": datePublished,
      "dateModified": dateModified,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": baseUrl
      },
      "articleSection": [
        "Что такое схема участка",
        "Для чего необходима схема земельного участка",
        "Как заказать схему участка",
        "Условия образования схемы земельного участка",
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
        "headline": "Что такое схема участка",
        "description": "Краткое описание схемы для предварительного согласования предоставления участка.",
        "isPartOf": { "@type": "Article", "@id": mainArticleId },
        "mainEntityOfPage": { "@type": "WebPage", "@id": baseUrl },
        "url": `${baseUrl}#section-1`
      },
      {
        "@context": "https://schema.org",
        "@type": "Article",
        "@id": `${mainArticleId}#section-2`,
        "headline": "Для чего нужна схема участка",
        "description": "Схема участка в инициации формирования участка с подачи заявления на предварительное согласование.",
        "isPartOf": { "@type": "Article", "@id": mainArticleId },
        "mainEntityOfPage": { "@type": "WebPage", "@id": baseUrl },
        "url": `${baseUrl}#section-2`
      },
      {
        "@context": "https://schema.org",
        "@type": "Article",
        "@id": `${mainArticleId}#section-3`,
        "headline": "Заказ схемы",
        "description": "Как заказать схему участка.",
        "isPartOf": { "@type": "Article", "@id": mainArticleId },
        "mainEntityOfPage": { "@type": "WebPage", "@id": baseUrl },
        "url": `${baseUrl}#section-3`
      },
      {
        "@context": "https://schema.org",
        "@type": "Article",
        "@id": `${mainArticleId}#section-4`,
        "headline": "Условия образования схемы участка",
        "description": "Что нужно учесть при образовании схемы.",
        "isPartOf": { "@type": "Article", "@id": mainArticleId },
        "mainEntityOfPage": { "@type": "WebPage", "@id": baseUrl },
        "url": `${baseUrl}#section-4`
      },
      {
        "@context": "https://schema.org",
        "@type": "Article",
        "@id": `${mainArticleId}#section-5`,
        "headline": "FAQ.",
        "description": "Часто задаваемые вопросы по кадастровой карте.",
        "isPartOf": { "@type": "Article", "@id": mainArticleId },
        "mainEntityOfPage": { "@type": "WebPage", "@id": baseUrl },
        "url": `${baseUrl}#section-5`
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
        title={`Кадастровые схемы расположения земельных участков | Подготовка схемы земельных участков на кадастровом плане территории`}
        descritoin={`Подготовка кадастровых планировочных схем для образования и перераспределения земельных участков. Заказать схему для предварительного согласования земельного участка`}
        keywords={`кадастровый учет земельных участков, кадастровая схема земельных участков, кадастровые схемы расположения земельных участков, кадастровые планировочные схемы земельных участков, предварительное согласование земельных участок, схема для предварительного согласования земельного участка`}
        canonicalURL={`https://nspdm.su/zemelnie-uchastki`}
        robots='index, follow'
        ogUrl={`https://nspdm.su/zemelnie-uchastki`}
        ogTitle={`Кадастровые схемы расположения земельных участков | Подготовка схемы земельных участков на кадастровом плане территории`}
        ogDescrition={`Подготовка кадастровых планировочных схем для образования и перераспределения земельных участков. Заказать схему для предварительного согласования земельного участка`}
        twitterTitle={`Кадастровые схемы расположения земельных участков | Подготовка схемы земельных участков на кадастровом плане территории`}
        twitterDescription={`Подготовка кадастровых планировочных схем для образования и перераспределения земельных участков. Заказать схему для предварительного согласования земельного участка`}
      />
      <Header />
      <div className={`${style.section} ${style.content1} ${style.blue}`}>
          <div className={style.content1}>
            <h1>Кадастровые схемы расположения земельных участков РФ</h1>
            <div className={style.serviceItem}>
              <div className={style.serviceText}>
                <p>Сервис по подготовке схем земельных участков на кадастровом плане территории для предварительного согласования предоставления земельного участка. Подготовка схемы для дальнейшего образования или перераспределения земельных участков.</p>
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
        <PpkMapUchastok cadastrNumber={cadastrNumber} setCloseChecker={setCloseChecker} setAlarmMessage={setAlarmMessage} setCadastrNumber={setCadastrNumber} flatRights={flatRights} promoCode={promoCode} sendActivePromoCode={sendActivePromoCode} setPromoCode={setPromoCode} setActivate={setActivate} activate={activate} lat={lat} lon={lon} closeChecker={closeChecker} setLoading={setLoading} loading={loading} setBaloonData={setBaloonData} baloonData={baloonData} onCkickCadastrNumber={onCkickCadastrNumber} setOnCkickCadastrNumber={setOnCkickCadastrNumber} setIsVisible={setIsVisible} isVisible={isVisible} error={error} setError={setError} setIsCurrentlyDrawing={setIsCurrentlyDrawing} isCurrentlyDrawing={isCurrentlyDrawing} setPolygonCoordinates={setPolygonCoordinates} polygonCoordinates={polygonCoordinates} setIsEditingPolygon={setIsEditingPolygon} isEditingPolygon={isEditingPolygon} setShema={setShema} shema={shema} />
          {!shema && (cadastrNumber || onCkickCadastrNumber) && !loading &&<CheckRaports cadNum={cadastrNumber} owner={rights} rightsCheck={rightsCheck} promoCode={promoCode} sendActivePromoCode={sendActivePromoCode} setPromoCode={setPromoCode} setActivate={setActivate} activate={activate} onCkickCadastrNumber={onCkickCadastrNumber} setIsVisible={setIsVisible} isVisible={isVisible} />}
          {(!isCurrentlyDrawing && polygonCoordinates && !isEditingPolygon && shema) && <CheckShema cadNum={cadastrNumber} owner={rights} rightsCheck={rightsCheck} promoCode={promoCode} sendActivePromoCode={sendActivePromoCode} setPromoCode={setPromoCode} setActivate={setActivate} activate={activate} onCkickCadastrNumber={onCkickCadastrNumber} polygonCoordinates={polygonCoordinates} />}
        </div>
      </div>
      <>
        <main>
          <article id="main-article" itemScope itemType="https://schema.org/Article" itemProp="mainContentOfPage">
          <div className={`${style.section} ${style.services}`}>
            <div className={style.content1}>
                <div className={style.object__block}>
                  <div className={style["object__block-wrap"]}>
                    <div className={style["object__block-title"]}><h2>Кадастровые планировочные схемы земельных участков</h2></div>
                      <div className={style.contentText}>
                        <section id="section-1" itemProp="articleBody" className={styles.sec}>
                          <p>Согласно действующему законадательству РФ, каждый гражданин имеет право подать заявление на предварительное согласование предоставления земельного участка. Федеральный реестр содержит каталогизированную базу земельных участков России с кадастровыми координатами, схемами расположения и кадастровыми границами. Позволяет найти и выбрать земельный участок для приобретения в собственность или долгосрочной аренды.</p>
                          <p>Реестр земельных участков содержит, как муниципальные или государственные земельные участки, так и те, что находятся в частной собственности.</p>
                        </section>
                        <section id="section-2" itemProp="articleBody" className={styles.sec}>
                          <h2>Для чего необходима схема земельного участка?</h2>
                          <p>Для того чтобы инициализировать процесс образования участка, который в дальнейшем можно будет получить в собственность или взять в аренду у государства, необходимо первым делом сформировать кадастровую схему земельного участка, которая подается в соотвествующие муниципальные органы вместе с заявлением на предварительное согласование образования земельного участка.</p>
                          <p>В дальнейшем, если предварительное согласование будет одобрено, земельный участок, согласно приложенной схеме, необходимо размежевать, а после проведения межевания, подать еще одно заявление для получения участка в собственность или аренду, согласно законадательству РФ.</p>
                          <p>Следует учитывать, что подготовка схемы земельного участка не гарантирует 100% принятия этой схемы со стороны муниципального органа.</p>
                        </section>
                        <section id="section-3" itemProp="articleBody" className={styles.sec}>
                          <h2>Как заказать кадастровую схему земельного участка?</h2>
                          <p>Для того, чтобы подать заявку на подготовку кадастровой схемы земельного участка, необходимо выбрать подходящее место на <Link href="/kadastrovaya-karta" title='публичная кадастровая карта'>кадастровой карте</Link> и сформировать полигон. Далее, следуя инструкции, необходимо перейти к заказу заявки на подготовку кадастровой схемы земельного участка. После оплаты заказ поступает в работу к специалистам сервиса.</p>
                        </section>
                        <section id="section-4" itemProp="articleBody" className={styles.sec}>
                          <h2>Условия образования земельного участка</h2>
                          <p>Для формирования схемы, необходимо соблюсти ряд обязательных условий:</p>
                          <ul>
                            <li>Участок ранее не образован</li>
                            <li>Участок не имеет кадастровых границ</li>
                            <li>Участок не межеван</li>
                            <li>Участок не пересекает границы других участков</li>
                          </ul>
                          <p>Кроме этого каждый муниципалитет может выдвинуть дополнительные условия, которые будут описаны в письменном ответе на заявление.</p>
                        </section>
                        <section className={styles.sec} itemScope itemType="https://schema.org/FAQPage" id="section-5">
                        <h2>Часто задаваемые вопросы</h2>
                        {[
                          {
                            question: 'Что такое схема участка?',
                            answer: `Схема участка - это документ, который содержит координаты реперных точек участка и его границы на геодезическом плане. Схема участка необходима для первичной подачи заявления о предварительном согласовании земельного участка.`,
                          },
                          {
                            question: `Если я получил схему, значит участок стал мой?`,
                            answer: `Нет, схема, как запрос, создается на несуществующий участок. Для того, чтобы стать собственником или арендатором участка необходимо пройти несколько этапов, первым из которых будет предварительное согласование.`,
                          },
                          {
                            question: `Что делать если отказали в предварительном согласовании?`,
                            answer: `Отказ в предварительном согласовании - очень частое явление, которое далеко не всегда означает, что участок невозможно сформировать. В случае отказа в предварительном согласовании, необходимо связаться со специалистами сервиса.`,
                          },
                          {
                            question: `Как подать заявление о предварительном согласовании?`,
                            answer: `Заявление о предварительном согласовании можно подать через сервис "Госуслуги". Проще всего взять участок в аренду, тогда в некоторых случаях можно обойтись без торгов, а значит - без конкурентов.
                            Заполнение формы выглядит так: Предоставление участка в аренду > заявитель > гражданин испрашивющий участок под ИЖС и ЛПХ > Схема расположения участка > Цель для ИЖС или для ведения личного подсобного хозяйства, срок аренды 20 лет (максимум)  > Участок не образован > Выбираете в какую администрацию отправить. Далее ждете ответ.`,
                          },
                          {
                            question: `Что делать дальше, после того, как подал заявление?`,
                            answer: `Далее, если муниципалитет предварительно согласует участок, необходимо будет обратиться к кадастровым инженерам для проведения межевания участка.

                            После того, как межевание будет сделано (на это уйдет пару недель) и земельный участок появится на кадастровой карте, необходимо подать еще одно заявление в тот же самый муниципалитет о предоставление земельного участка в аренду, например. В некоторых случаях можно обойтись без торгов, однако для уточнения всех нюансов, необходимо обратиться в администрацию, куд подается завление.

                            Далее, если участок можно получить без торгов, муниципалитет составляет договор аренды участка, который необходимо подписать, оптатить стоимость аренды. После этого вы становитесь арендатором участка на 20 лет.`,

                          }
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

                            {/* <-- Тут единственное изменение: управление display через inline-style --> */}
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
          </div>
          <section  id="section-6">
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
          </section>
        </article>
        </main>
      </>
      <Scroll />
      <Footer />
    </>
  )
}


export async function getServerSideProps(context) {
  const referer = context?.req?.headers?.referer?.split('/kadastr/')?.[1] || null
  return {
    props: {
      country: 'Russia',
      lat: 55.755864,
      lon: 37.617698,
      referer
    },
  }
}
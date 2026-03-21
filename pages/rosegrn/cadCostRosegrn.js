import React, { useState } from 'react'
import Head from 'next/head'
import Header from '@/Components/layout/Header'
import Footer from '@/Components/layout/Footer'
import Search from '@/Components/layout/Search'
import SearchMap from '@/Components/layout/SearchMap';
import NextLink from 'next/link'
import { Link } from 'react-scroll'
import FastCadastrData from '@/Components/fastCadastrData';
import { IoCheckmarkDone } from "react-icons/io5";
import Meta from '@/Components/meta'
import style from '@/styles/rosegrn.module.css'
import styleses from'@/styles/fcad.module.css'
import styles from'@/styles/PublicCadastralMap.module.css'

export default function CadCostRosegrn({ url, host }) {
  const [cadastrData, setCadastrData] = useState('')
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const baseUrl = url
  const mainArticleId = `${baseUrl}#mainArticle`
  const mainArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": mainArticleId,
    "headline": "Кадастровая стоимость на 2026",
    "description": "Кадастровая стоимость по кадастровому номеру или адресу",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": baseUrl
    },
    "articleSection": [
      "Онлайн поиск кадастровой стоимости",
      "Когда требуется кадастровая стоимость",
      "Как узнать кадастровую стоимость по кадастровому номеру или адресу",
      "Как формируется кадастровая стоимость в 2026 году",
      "Справка о кадастровой стоимости: кому и когда нужна",
      "Ответы на частые вопросы о кадастровой стоимости",
    ],
    "url": baseUrl
  }

  // секции — каждая как Article (isPartOf -> основной)
  const sections = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": `${mainArticleId}#section-1`,
      "headline": "Онлайн поиск кадастровой стоимости",
      "description": "Поиск по кадастровому номеру или адресу.",
      "isPartOf": { "@type": "Article", "@id": mainArticleId },
      "mainEntityOfPage": { "@type": "WebPage", "@id": baseUrl },
      "url": `${baseUrl}#section-1`
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": `${mainArticleId}#section-2`,
      "headline": "Когда требуется кадастровая стоимость",
      "description": "Ситуации, когда требуется кадастровая стоимость.",
      "isPartOf": { "@type": "Article", "@id": mainArticleId },
      "mainEntityOfPage": { "@type": "WebPage", "@id": baseUrl },
      "url": `${baseUrl}#section-2`
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": `${mainArticleId}#section-3`,
      "headline": "Как узнать кадастровую стоимость по кадастровому номеру или адресу",
      "description": "Алгоритм определения кадастровой стоимости",
      "isPartOf": { "@type": "Article", "@id": mainArticleId },
      "mainEntityOfPage": { "@type": "WebPage", "@id": baseUrl },
      "url": `${baseUrl}#section-3`
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": `${mainArticleId}#section-4`,
      "headline": "Как формируется кадастровая стоимость в 2026 году",
      "description": "Факторы влияющие на кадастровую стоимость.",
      "isPartOf": { "@type": "Article", "@id": mainArticleId },
      "mainEntityOfPage": { "@type": "WebPage", "@id": baseUrl },
      "url": `${baseUrl}#section-4`
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": `${mainArticleId}#section-5`,
      "headline": "Справка о кадастровой стоимости",
      "description": "Справка о кадастровой стоимости: кому и когда нужна",
      "isPartOf": { "@type": "Article", "@id": mainArticleId },
      "mainEntityOfPage": { "@type": "WebPage", "@id": baseUrl },
      "url": `${baseUrl}#section-5`
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": `${mainArticleId}#section-8`,
      "headline": "Вопросы о кадастровой стоимости",
      "description": "Ответы на частые вопросы о кадастровой стоимости.",
      "isPartOf": { "@type": "Article", "@id": mainArticleId },
      "mainEntityOfPage": { "@type": "WebPage", "@id": baseUrl },
      "url": `${baseUrl}#section-6`
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
        host={host}
        title={`Кадастровая стоимость на 2026 год`}
        descritoin={`Бесплатно узнать кадастровую стоимость на 2026 годпо кадастровому номеру или адресу`}
        keywords={`Кадастровая стоимость объекта недвижимости, Кадастровая стоимость по кадастровому номеру на 2026 год бесплатно, Кадастровая стоимость по кадастровому номеру на 2026 год бесплатно, кадастровая стоимость по кадастровому номеру объекта недвижимости на 2026 год бесплатно, кадастровая стоимость, кадастровая стоимость квартиры, кадастровая стоимость участка, кадастровая стоимость земли, кадастровая стоимость, кадастровая стоимость земли, узнать кадастровую стоимость`}
        canonicalURL={`https://${host}/kadastrovaya-stoimost`}
        robots='index, follow'
        ogUrl={`https://${host}/kadastrovaya-stoimost`}
        ogTitle={`Кадастровая стоимость на 2026 год`}
        ogDescrition={`Бесплатно узнать кадастровую стоимость на 2026 годпо кадастровому номеру или адресу`}
        twitterTitle={`Кадастровая стоимость на 2026 год`}
        twitterDescription={`Бесплатно узнать кадастровую стоимость на 2026 годпо кадастровому номеру или адресу`}
      />
      <Header host={host} />
      <div className={`${styleses.section} ${styleses.fieldform} ${styleses.start}`} id="start">
        <div className={styleses.layout}>
          <div className={styleses.mainFirst}>
            <div className={styleses["main__first-wrap"]}>
              <h1 className={styleses["main__first-h1"]}>
                Кадастровая стоимость
              </h1>
              <div className={styleses["main__first-descr"]}>
                Кадастровая стоимость по кадастровому номеру на 2026 год, узнать кадастровую стоимость земельного участка, квартиры по кадастровому номеру или адресу на 2026 год бесплатно
              </div>
            </div>
            <div className={styleses["main__first-img"]}></div>
          </div>
        </div>
      </div>
      <div className="section fieldform start" id="start">
        <div className="layout">
            <div className={style.serviceItem}>
              <div className={style.serviceText}>
                <p>Кадастровая стоимость объекта недвижимости на 2026 год влияет на размер налога, аренды и ряд юридически значимых расчетов. Наш кадастровый сервис позволяет быстро узнать кадастровую стоимость по адресу или кадастровому номеру на 2026 год бесплатно, а также оформить справку о кадастровой стоимости для предоставления по месту требования.</p>
              </div>
            </div>
          <Search cadastrData={cadastrData} setCadastrData={setCadastrData}/>
        </div>
      </div>
          {cadastrData.length === 1 && <FastCadastrData cadastrData={cadastrData}/>}
          {cadastrData.length === 0 &&
            <main>
              <article id="mainArticle" itemScope itemType="https://schema.org/Article" itemProp="mainContentOfPage">
              <div className={`${style.section} ${style.services}`}>
                <div className={style.content1}>
                    <div className={style.object__block}>
                      <div className={style["object__block-wrap"]}>
                        <div className={style["object__block-title"]}><h2>Онлайн-поиск кадастровой стоимости на 2026 год</h2></div>
                          <section id="section-1" itemProp="articleBody" className={styles.sec}>
                            <p>Кадастровый сервис предоставляет доступ к сведениям о кадастровой стоимости любых объектов недвижимости:</p>
                            <ul className={style.govy1}>
                              <li>квартир и комнат;</li>
                              <li>жилых домов и коттеджей;</li>
                              <li>земельных участков;</li>
                              <li>коммерческих помещений и зданий;</li>
                              <li>объектов незавершенного строительства;</li>
                            </ul>
                             <p>Поиск позволяет бесплатно узнать кадастровую стоимость по кадастровому номеру или адресу объекта недвижимости. Отображаемая информация носит справочный характер и помогает оперативно оценить налоговую нагрузку и планируемые расходы по объекту.</p>
                          </section>

                          <section id="section-2" itemProp="articleBody" className={styles.sec}>
                            <h2>Когда требуется кадастровая стоимость</h2>
                            <p>Актуальные сведения о кадастровой стоимости особенно важны в следующих ситуациях:</p>
                            <ul className={style.govy1}>
                              <li>расчет налога на имущество физических и юридических лиц;</li>
                              <li>проверка правильности начисленных налогов и подготовка возражений;</li>
                              <li>подготовка к сделкам купли-продажи, дарения, мены;</li>
                              <li>оформление наследства или раздел имущества;</li>
                              <li>расчет арендной платы за землю и объекты недвижимости;</li>
                              <li>участие в судебных спорах и оспаривание кадастровой стоимости;</li>
                            </ul>
                            <p>В большинстве случаев государственные органы, банки и иные организации требуют документальное подтверждение данных. Для таких целей оформляется справка о кадастровой стоимости объекта.</p>
                          </section>

                          <section id="section-3" itemProp="articleBody" className={styles.sec}>
                            <h2>Как узнать кадастровую стоимость по кадастровому номеру или адресу</h2>
                            <p>Пошаговый алгоритм получения бесплатной справочной информации через кадастровый сервис:</p>
                            <ul className={style.govy1}>
                              <li>Определите, какие данные удобнее использовать: адрес или кадастровый номер объекта.</li>
                              <li>Введите адрес или кадастровый номер в поисковую форму сервиса.</li>
                              <li>Из предложенного списка выберите нужный объект недвижимости.</li>
                              <li>Ознакомьтесь с отображаемой кадастровой стоимостью и сопутствующими характеристиками объекта (площадь, назначение, категория).</li>
                            </ul>
                            <p>Если кадастровый номер неизвестен, его можно найти в правоустанавливающих документах:</p>
                            <ul className={style.govy1}>
                              <li>в свидетельстве о праве собственности (если оно выдавалось ранее);</li>
                              <li>в договоре социального найма (для неприватизированного жилья);</li>
                              <li>в выписке из ЕГРН</li>
                            </ul>
                             <p>При большом количестве совпадений внимательно сверяйте адрес и характеристики, чтобы выбрать именно свой объект.</p>
                          </section>

                          <section id="section-4" itemProp="articleBody" className={styles.sec}>
                            <h2>Как формируется кадастровая стоимость в 2026 году</h2>
                            <p>Кадастровая стоимость на 2026 год определяется в ходе государственной кадастровой оценки. Оценка проводится уполномоченными организациями на основании решения органов государственной власти или местного самоуправления.</p>
                            <p>При расчете учитываются ключевые факторы:</p>
                            <ul className={style.govy1}>
                              <li>площадь и тип объекта недвижимости;</li>
                              <li>территориальное расположение и район;</li>
                              <li>наличие и качество инженерных коммуникаций;</li>
                              <li>год постройки и степень износа;</li>
                              <li>уровень развития и доступность инфраструктуры;</li>
                              <li>транспортная доступность и окружающая застройка;</li>
                              <li>среднерыночная стоимость аналогичных объектов на дату оценки.</li>
                            </ul>
                            <p>Если по результатам оценки невозможно определить стоимость стандартным способом, кадастровая стоимость может быть приравнена к рыночной. В большинстве случаев рыночная стоимость выше кадастровой, но бывают ситуации, когда значения сопоставимы или кадастровая стоимость оказывается завышенной, что увеличивает налоговую нагрузку.</p>
                          </section>

                          <section id="section-5" itemProp="articleBody" className={styles.sec}>
                            <h2>Справка о кадастровой стоимости: кому и когда нужна</h2>
                            <p>Бесплатные сведения, полученные через сервис, предназначены для первоначальной ориентировочной оценки. Для официального подтверждения по месту требования оформляется справка о кадастровой стоимости объекта недвижимости.</p>
                            <p>Справка может потребоваться:</p>
                            <ul className={style.govy1}>
                              <li>для налоговых органов при уточнении или оспаривании налогооблагаемой базы;</li>
                              <li>для банков при оформлении залога и кредитовании под недвижимость;</li>
                              <li>для нотариусов при наследственных и бракоразводных делах</li>
                              <li>для судов и государственных органов при разрешении имущественных споров;</li>
                              <li>для арендодателей и арендаторов при расчете арендной платы, привязанной к кадастровой стоимости.</li>
                            </ul>
                             <p>На практике многие организации принимают справку, выданную не ранее чем за 30 календарных дней до даты обращения, поэтому целесообразно заказывать документ незадолго до его фактического использования.</p>
                          </section>
                          <section className={styles.sec} itemScope itemType="https://schema.org/FAQPage" id="section-6">
                            <h2>Ответы на частые вопросы о кадастровой стоимости</h2>
                            {[
                              {
                                question: `Чем отличается кадастровая стоимость от рыночной?`,
                                answer: `Кадастровая стоимость определяется в рамках государственной оценки по единой методике. Рыночная стоимость формируется исходя из текущей ситуации на рынке и условий конкретной сделки. В большинстве случаев рыночная стоимость выше кадастровой, но возможны исключения.`,
                              },
                              {
                                question: 'Можно ли узнать кадастровую стоимость бесплатно?',
                                answer: `Да, через кадастровый сервис вы можете узнать кадастровую стоимость объекта недвижимости по кадастровому номеру на 2026 год бесплатно, а также выполнить поиск по адресу. Платной является только услуга оформления справки.`,
                              },
                              {
                                question: `Какие объекты можно проверить?`,
                                answer:
                                  <>
                                  <p>Через сервис доступны сведения о кадастровой стоимости:</p>
                                  <ul className={style.govy1}>
                                    <li>квартир и комнат в многоквартирных домах;</li>
                                    <li>жилых домов, дач и коттеджей;</li>
                                    <li>земельных участков различных назначений;</li>
                                    <li>нежилых помещений и зданий;</li>
                                    <li>отдельных объектов капитального строительства.</li>
                                  </ul>,
                                  </>
                              },
                              {
                                question: `Какие данные нужны для проверки?`,
                                answer:
                                  <>
                                    <p>Для проверки достаточно одного из двух вариантов:</p>
                                    <ul className={style.govy1}>
                                      <li>кадастрового номера объекта недвижимости;</li>
                                      <li>точного адреса объекта с указанием населенного пункта, улицы, номера дома и помещения (при наличии).</li>
                                    </ul>,
                                    <p>Чем точнее исходные данные, тем быстрее и корректнее будет найден объект и его кадастровая стоимость на 2026 год.</p>
                                  </>,
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
              </article>
              </main>}
      <Footer />
    </>
  )
}

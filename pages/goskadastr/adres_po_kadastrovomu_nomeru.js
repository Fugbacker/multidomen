import React, { useState } from 'react'
import Header from '@/Components/layout/Header'
import Footer from '@/Components/layout/Footer'
import Search from '@/Components/layout/Search'
// import Scroll from '@/components/scroll'
import Meta from '@/Components/meta'
import style from '@/styles/goskadastr.module.css'
export default function Home({ host }) {
  const [cadastrData, setCadastrData] = useState([])


  return (
    <>
      <Meta
        host={host}
        title={`Узнать кадастровый номер по адресу объекта недвижимости бесплатно | Определить кадастровый номер по адресу объекта недвижимости`}
        descritoin={`Бесплатно найти кадастровый номер квартиры, участка, частного дома по адресу онлайн. Узнать кадастровый номер объекта недвижимости по адресу.`}
        keywords={`кадастровый номер по адресу объекта недвижимости, узнать кадастровый номер, узнать по кадастровому номеру адрес объекта недвижимости,кадастровый номер по адресу, узнать кадастровый номер по адресу, кадастровый номер по адресу объекта недвижимости бесплатно`}
        canonicalURL={`https://nspdm.su/adres_po_kadastrovomu_nomeru`}
        robots='index, follow'
        ogUrl={`https://nspdm.su/adres_po_kadastrovomu_nomeru`}
        ogTitle={`Узнать кадастровый номер по адресу объекта недвижимости бесплатно | Определить кадастровый номер по адресу объекта недвижимости`}
        ogDescrition={`Бесплатно найти кадастровый номер квартиры, участка, частного дома по адресу онлайн. Узнать кадастровый номер объекта недвижимости по адресу.`}
        twitterTitle={`Узнать кадастровый номер по адресу объекта недвижимости бесплатно | Определить кадастровый номер по адресу объекта недвижимости`}
        twitterDescription={`Бесплатно найти кадастровый номер квартиры, участка, частного дома по адресу онлайн. Узнать кадастровый номер объекта недвижимости по адресу.`}
      />
      <Header />
       <div className={`${style.section} ${style.content} ${style.blue}`}>
          <div className={style.content1}>
            <h1>Узнать кадастровый номер по адресу объекта недвижимости бесплатно</h1>
            <div className={style.serviceItem}>
              <div className={style.serviceText}>
                <p>
				        	Сервис предоставляет доступ к общедоступным сведениям и позволяет бесплатно узнать кадастровый номер объекта недвижимости по адресу. Кадастровый номер позволяет
                  идентифицировать объект недвижимости для того, чтобы безошибочно произвести заказ необходимых отчетов.</p>
              </div>
              <div className={style.servicePictureNumber}></div>
            </div>
          <Search cadastrData={cadastrData} setCadastrData={setCadastrData}/>
        </div>
      </div>
      {cadastrData.length === 0 &&
        <>
          <div className={`${style.section} ${style.services}`}>
            <div className={style.content1}>
                <div className={style.object__block}>
                  <div className={style["object__block-wrap"]}>
                    <div className={`${style["object__block-title"]}`}><h2>Как узнать кадастровый номер недвижимости?</h2></div>
                        <div className={style.contentText}>
                        <p>Есть несколько вариантов узнать кадастрового номера объекта недвижимости:</p>
                        <ul>
                          <li>Кадастровый номер указывается в документах, подтверждающих право собственности на объект недвижимости, такие как свидетельство о праве собственности, либо выписка из ЕГРН. Однако доступ к этим бумагам есть не всегда, особенно если запрос делает лицо, не являющееся владельцем недвижимости.</li>
                          <li>Узнать кадастровый номер можно при личном визите в многофункциональный центр либо в территориальное подразделение Росреестра. Для этого потребуется оформить письменное заявление на конкретный объект. Следует учитывать, что обработка запроса может занять несколько рабочих дней.</li>
                          <li>Каадстровый номер может содержаться в техническом или кадастровом плане на объект недвижимости.</li>
                          <li>Воспользоваться поисковой формой данного ресурса, которая позволяет бесплатно узнать кадастровый номер недвижимости по адресу, что является общедоступной информацией. Для этого необходимо ввести адрес квартиры, участка или жилого дома в поисковую строку, выбрать из предложенных подсказок верный вариант и произвести поиск.</li>
                        </ul>
                        <p>Кроме того, платформа поддерживает и обратный алгоритм работы: здесь можно узнать адрес недвижимости, располагая только её кадастровым номером. Для этого нужно ввести номер в поисковое поле и выполнить запрос.</p>
                      </div>
                    </div>
                </div>
              </div>
          </div>
          <div className={`${style.section} ${style.services}`}>
            <div className={style.content1}>
                <div className={style.object__block}>
                  <div className={style["object__block-wrap"]}>
                    <div className={`${style["object__block-title"]}`}><h2>Из чего состоит кадастровый номер объекта недвижимости</h2></div>
                        <div className={style.contentText}>
                          <p>Кадастровый номер объекта недвижимости - это комбинация групп цифр, разделенная символом двоеточия, которая позволяет безошибочно идентифицировать и найти объект недвижимости в Росреестре.</p>
                          <p>Кадастровый номер выглядит следующим образом <strong>АА:ВВ:CCCCСCC:DDDD</strong>, где:</p>
                          <ul>
                            <li><strong>АА</strong> - кадастровый округ;</li>
                            <li><strong>ВВ</strong> - кадастровый район;</li>
                            <li><strong>CCCCCCС</strong> - кадастровый квартал (состоит из 6 или 7 цифр);</li>
                            <li><strong>DDDD</strong> - номер объекта (земельного участка, помещения, строения) - несколько цифр</li>
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
                    <div className={`${style["object__block-title"]}`}><h2>Условный номер объекта недвижимости</h2></div>
                        <div className={style.contentText}>
                        <p>Условный номер состоит из нескольких групп знаков, разделенных дефисом и наклонной вертикальной чертой: <strong>AA-BB-CC/DDD/EEEE-FFF</strong>, где</p>
                        <ul>
                          <li><strong>АА</strong> - номер субъекта РФ;</li>
                          <li><strong>ВВ</strong> - регистрационный округ;</li>
                          <li><strong>CC</strong> - код подразделения ФРС;</li>
                          <li><strong>DDD</strong> - номер книги учета по порядку;</li>
                          <li><strong>EEEE</strong> - год регистрации недвижимости;</li>
                          <li><strong>FFF</strong> - порядковая очередность записи в регистрационном реестре</li>
                        </ul>

                        <p>Номер из старых свидетельств о регистраци имеет более длинную комбинацию цифровых знаков.</p>
                      </div>
                    </div>
                </div>
              </div>
          </div>
        </>
      }
      {/* <Scroll /> */}
      <Footer />
    </>
  )
}

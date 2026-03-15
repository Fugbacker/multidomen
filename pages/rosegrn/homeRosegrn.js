import { useState, useEffect } from 'react'

import axios from 'axios'
import { Link } from 'react-scroll'
import Header from '@/Components/layout/Header'
import Footer from '@/Components/layout/Footer'
import Scroll from '@/Components/scroll'
import CheckRaports from '@/Components/checkRaports'
import CheckShema from '@/Components/checkShema'
import Meta from '@/Components/meta'
import SearchMap from '@/Components/layout/SearchMap';
import MacroRegion from '@/Components/MacroRegion'
import PpkMap from '@/Components/ppkMap'
import style from '@/styles/rosegrn.module.css'
import styleses from'@/styles/fcad.module.css'
import styles from'@/styles/PublicCadastralMap.module.css'

export default function HomeRosegrn({ country, lat, lon, url, host }) {
  const [cadastrData, setCadastrData] = useState([])
  const [cadastrNumber, setCadastrNumber] = useState('')
  const [onCkickCadastrNumber, setOnCkickCadastrNumber] = useState('')
  const [closeChecker, setCloseChecker] = useState(false)
  const [alarmMessage, setAlarmMessage] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [promoCode, setPromoCode] = useState('')
  const [error, setError] = useState(false)
  const [activate, setActivate] = useState(false)
  const [loading, setLoading] = useState(false);
  const [baloonData, setBaloonData] = useState('')
  const [sendActivePromoCode, SetSendActivePromoCode] = useState('')
  const [shema, setShema] = useState(false);
  const [checkLand, setCheckLand] = useState(false);
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



  useEffect(() => {
    setActivate(false)
    SetSendActivePromoCode('')
  }, [cadastrNumber])


  return (
    <>
      <Meta
        title={`Кадастровая карта России 2026 из НСПД`}
        descritoin={`Кадастровая карта РФ - публичные кадастровые сведения из НСПД о земельных участках в режиме онлайн за 2026 год.`}
        keywords={`пкк росреестра, публичная кадастровая карта 2026, официальная кадастровая карта, общедоступная кадастровая карта, Национальная система пространственных данных, публичная кадастровая карта РФ 2026, публичная кадастровая карта 2026, rosreestr, pkk, публичная кадастровая карта НСПД, кадастровая карта`}
        canonicalURL={url}
        robots='index, follow'
        ogUrl={url}
        ogTitle={`Кадастровая карта России 2026 из НСПД`}
        ogDescrition={`Кадастровая карта РФ - публичные кадастровые сведения из НСПД о земельных участках в режиме онлайн за 2026 год.`}
        twitterTitle={`Кадастровая карта России 2026 из НСПД`}
        twitterDescription={`Кадастровая карта РФ - публичные кадастровые сведения из НСПД о земельных участках в режиме онлайн за 2026 год.`}
      />
      <Header />

      <div className={`${styleses.section} ${styleses.fieldform} ${styleses.start}`} id="start">
        <div className={styleses.layout}>
          <div className={styleses.mainFirst}>
            <div className={styleses["main__first-wrap"]}>
              <h1 className={styleses["main__first-h1"]}>
                Публичная кадастровая карта Российской Федерации
              </h1>
              <div className={styleses["main__first-descr"]}>
                Межевание, кадастровые границы, схемы участка, технический и кадастровый план, сводные земельные отчеты, кадастровые номера, согласования строительства
              </div>
            </div>
            <div className={styleses["main__first-img"]}></div>
          </div>
        </div>
      </div>
      <div className="section fieldform start">
        <div className={style.layout}>
            <div className={style.serviceItem}>
              <div className={style.serviceText}>
                <p>Кадастровая карта - интерактивный сервис для онлайн поиска и демнострации общедоступной инфорамции об объектах недвижимости, даненые о которых внесены в Росреестр и НСПД.</p>
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
      <div className={style.layout}>
          <PpkMap cadastrNumber={cadastrNumber} setCloseChecker={setCloseChecker} setAlarmMessage={setAlarmMessage} setCadastrNumber={setCadastrNumber} promoCode={promoCode} sendActivePromoCode={sendActivePromoCode} setPromoCode={setPromoCode} setActivate={setActivate} activate={activate} lat={lat} lon={lon} closeChecker={closeChecker} setLoading={setLoading} loading={loading} setBaloonData={setBaloonData} baloonData={baloonData} onCkickCadastrNumber={onCkickCadastrNumber} setOnCkickCadastrNumber={setOnCkickCadastrNumber} setIsVisible={setIsVisible} isVisible={isVisible} error={error} setError={setError} setIsCurrentlyDrawing={setIsCurrentlyDrawing} isCurrentlyDrawing={isCurrentlyDrawing} setPolygonCoordinates={setPolygonCoordinates} polygonCoordinates={polygonCoordinates} setIsEditingPolygon={setIsEditingPolygon} isEditingPolygon={isEditingPolygon} setShema={setShema} shema={shema} setCheckLand={setCheckLand} checkLand={checkLand} />

          {!shema && (cadastrNumber || onCkickCadastrNumber) && !loading &&<CheckRaports cadNum={cadastrNumber}  promoCode={promoCode} sendActivePromoCode={sendActivePromoCode} setPromoCode={setPromoCode} setActivate={setActivate} activate={activate} onCkickCadastrNumber={onCkickCadastrNumber} setIsVisible={setIsVisible} isVisible={isVisible} checkLand={checkLand} />}
          {(!isCurrentlyDrawing && polygonCoordinates && !isEditingPolygon && shema) && <CheckShema cadNum={cadastrNumber}  promoCode={promoCode} sendActivePromoCode={sendActivePromoCode} setPromoCode={setPromoCode} setActivate={setActivate} activate={activate} onCkickCadastrNumber={onCkickCadastrNumber} polygonCoordinates={polygonCoordinates} host={host} />}
        </div>
      </div>
        <main>
          <article>
          <div className={`${style.section} ${style.services}`}>
            <div className={style.content1}>
                <div className={style.object__block}>
                  <div className={style["object__block-wrap"]}>
                    <div className={style["object__block-title"]}><h2>Публичная кадастровая карта</h2></div>
                      <section className={styles.sec}>
                        <p>Кадастровый сервис предоставляет доступ к публичной кадастровой карте РФ в удобном онлайн-формате. В одном интерфейсе объединены данные ППК Росреестра и кадастровой карты Национальной системы пространственных данных (НСПД), что позволяет получать актуальные сведения об объектах недвижимости по всей территории России:</p>
                        <ul className={style.govy1}>
                          <li>кадастровый номер и статус учета;</li>
                          <li>адрес (местоположение) объекта;</li>
                          <li>площадь и конфигурацию границ на карте;</li>
                          <li>категорию земель и вид разрешенного использования;</li>
                          <li>кадастровую стоимость;</li>
                          <li>сведения о зонах и территориях, в пределах которых расположен объект;</li>
                          <li>информацию об обременениях и ограничениях использования;</li>
                          <li>данные об объектах капитального строительства, связанных с участком.</li>
                        </ul>
                      </section>

                      <section className={styles.sec}>
                        <h2>Преимущества использования кадастрового сервиса</h2>
                        <p>Новая публичная кадастровая карта 2026 реализована с учетом требований к точности и удобству работы с пространственными данными.</p>

                        <ul className={style.govy1}>
                          <li><b>Актуальность сведений.</b> Используются данные официальной публичной кадастровой карты Росреестра и кадастровой карты НСПД с регулярным обновлением.</li>
                          <li><b>Скорость обработки запроса.</b> Поиск по кадастровому номеру, адресу или карте выполняется в считанные секунды, без лишних переходов между разделами.</li>
                          <li><b>Человекочитаемый формат.</b> Информация по объекту структурирована в логичные блоки: идентификация, характеристики, стоимость, зоны и ограничения. Параметры легко сопоставлять и анализировать.</li>
                          <li><b>Полный список населенных пунктов региона.</b> Для каждого субъекта РФ доступен перечень населенных пунктов, что упрощает навигацию и ускоряет поиск нужной территории.</li>
                        </ul>
                        <p>Благодаря такой организации кадастровая карта становится удобным инструментом как для единичных проверок, так и для системной работы с массивами объектов.</p>
                      </section>

                      <section className={styles.sec}>
                        <h2>Кому полезна публичная кадастровая карта</h2>
                        <p>Официальная кадастровая карта, представленная в формате общедоступного онлайн-сервиса, востребована у разных категорий пользователей:</p>

                        <ul className={style.govy1}>
                          <li>собственники и покупатели недвижимости — для проверки границ, площади, категорий земель и кадастровой стоимости;</li>
                          <li>девелоперы и застройщики — для предварительного анализа территорий, зонирования и ограничений;</li>
                          <li>оценщики и финансовые организации — для использования кадастровых параметров в расчетах и моделях;</li>
                          <li>юристы и риелторы — для подготовки документов по объектам и анализа рисков;</li>
                          <li>органы местного самоуправления и специалисты по градостроительству — для планирования развития территорий.</li>
                        </ul>
                        <p>Таким образом, публичная кадастровая карта является удобным и информативным инструментом, обеспечивающим оперативный доступ к официальным сведениям об объектах недвижимости.</p>
                      </section>

                      <section className={styles.sec}>
                        <h2>Кадастровые слои и их назначение</h2>
                        <p>Публичная кадастровая карта 2026 поддерживает несколько типов кадастровых слоев. Пользователь может включать и отключать их, настраивая отображение под свои задачи.</p>
                        <table>
                          <tr>
                            <td><b>Слой</b></td>
                            <td><b>Что показывает</b></td>
                            <td><b>Когда полезен</b></td>
                          </tr>
                          <tr>
                            <td>Границы земельных участков</td>
                            <td>Контуры участков, их взаимное расположение и конфигурация</td>
                            <td>Проверка наложений, анализ соседних владений, уточнение формы участка</td>
                          </tr>
                          <tr>
                            <td>Кадастровая стоимость</td>
                            <td>Информация о кадастровой стоимости по каждому объекту</td>
                            <td>Оценка налоговой нагрузки, подготовка к оспариванию стоимости, финансовое планирование</td>
                          </tr>
                          <tr>
                            <td>Зоны и территории</td>
                            <td>Градостроительные, природоохранные и иные зоны, в границах которых расположен объект</td>
                            <td>Анализ ограничений использования земли и рисков для будущих проектов</td>
                          </tr>
                          <tr>
                            <td>Единицы кадастрового деления</td>
                            <td>Кадастровые округа, районы и кварталы</td>
                            <td>Навигация по структуре кадастрового деления, подготовка технической документации</td>
                          </tr>
                          <tr>
                            <td>Объекты капитального строительства</td>
                            <td>Здания, сооружения, объекты завершенного и незавершенного строительства</td>
                            <td>Анализ застроенности территории и связки «участок–объект»</td>
                          </tr>
                        </table>
                      </section>

                      <section className={styles.sec}>
                        <p>Кадастровая карта предусматривет два базовых сценария работы: поиск по кадастровому номеру или адресу и визуальный поиск на карте.</p>
                       <ul className={style.govy1}>
                          <li>Выберите регион или интересующий населенный пункт из полного списка субъектов РФ.</li>
                          <li>Уточните масштаб карты, приблизив нужный район.</li>
                          <li>Используйте строку поиска для ввода кадастрового номера или адреса, если реквизиты известны.</li>
                          <li>Либо найдите объект визуально и кликните по нему на карте.</li>
                          <li>Ознакомьтесь с карточкой объекта: основные характеристики, границы, зоны, кадастровая стоимость и иные сведения.</li>
                          <li>При необходимости измените видимые кадастровые слои, чтобы отобразить только нужную информацию.</li>
                        </ul>
                        <p>Такая логика работы снижает количество ошибок при выборе объекта и делает процесс анализа максимально наглядным.</p>
                      </section>
                      {/* <section className={styles.sec}>
                        <h2>Схемы участков на публичной кадастровой карте</h2>
                        <p>Инструменты кадастровой карты позволяют сформировать <Link href="/uchastki" title='схема участка для предварительного согласования'>схему предварительного согласования участка</Link>, которая необходима для подачи заявления.</p>
                      </section> */}
                    </div>
                </div>
              </div>
          </div>
          <section >
          <div className={`${style.section} ${style.services}`}>
            <div className={style.content1}>
                <div className={style.object__block}>
                  <div className={style["object__block-wrap"]}>
                    <div className={style["object__block-title"]}><h2>Регионы на кадастровой карте</h2></div>
                      <MacroRegion host={host} />
                    </div>
                </div>
              </div>
          </div>
          </section>
          </article>
        </main>
      <Footer host={host} url={url} />
    </>
  )
}


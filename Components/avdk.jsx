import React from 'react'
import { Link } from 'react-scroll'

export const Avdk = () => {
  return (
    <div className='tooltipText'>
      <div className="table">
        <div className="table-row">
          <div className="table-cell hundred">
            <h3>Выписка из домовой книги</h3>
            <hr/>
          </div>
        </div>
      </div>
      <div className="table">
        <div className="table-row">
          <div className="table-cell">
            <p>Выписка из домовой книги показывает, кто был зарегистрирован по запрашиваемому адресу с момента начала приватизации в РФ,если дом постройки до 1991 года, а если дом-новостройка, то кто был зарегистрирован с момента заселения дома.</p>
            <br/>
            <p>Выписка из домовой книги требуется для снижения рисков при сделках с жилой недвижимостью. Поскольку выписка содержит данные о раннее зарегистрированных людях, можно проанализировать и выяснить воспользовались ли зарегистрированные правом на приватизацию или отказался от нее.</p>
            <br/>
            <ul>
              <li>ФИО ранее и ныне зарегистрированных;</li>
              <li>Даты регистрации;</li>
              <li>Когда и откуда/куда прибыл/выбыл;</li>
              <li>Гражданство;</li>
            </ul>
          </div>
          <div className="table-cell twenty">
            {/* <div className="sbox">
              <a href="/images/f_check.pdf" target="_blank" className="fancybox example-list-wrapper-img fancy-img" data-fancybox-type="iframe"><img src="/images/egrn_1_min.jpg" title="Отчет об истории владения недвижимостью" alt="Отчет об истории владения недвижимостью"/><span className="exampless__zoom"></span></a>
            </div> */}
            <div className="sbox">
            {/* <p className="exampleDocument">{'Образец >>'}</p> */}
              <Link to="#" activeClass="active" smooth="true" spy={true} duration={500}><img src="/images/avdk.jpg" title="выписка из домовой книги" alt="выписка из домовой книги"/></Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

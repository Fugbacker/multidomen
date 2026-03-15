import React, { useState } from 'react'
import { Link } from 'react-scroll'
import PulseLoader from "react-spinners/PulseLoader";
import style from '@/styles/goskadastr.module.css'

const MenuEgrul = ({ data }) => {
  const egrul = data && JSON.parse(data);
  const employeesByYear = Object.keys(egrul?.fin || [])
  .filter(key => key.startsWith("y")) // Фильтруем ключи по годам
  .map(yearKey => {
    const yearData = egrul?.fin[yearKey]["@attributes"];
    return {
      year: yearKey.replace("y", ""), // Получаем год из ключа
      employees: yearData["n"] ? parseInt(yearData["n"], 10) : null
    };
  })
  .filter(entry => entry.employees !== null);

  const additionalOkveds = egrul["СвЮЛ"]?.["СвОКВЭД"]?.["СвОКВЭДДоп"]?.map(okved => ({
    name: okved["@attributes"]["НаимОКВЭД"],
    code: okved["@attributes"]["КодОКВЭД"]
  }));

  const registrationLogs = egrul["СвЮЛ"]?.["СвЗапЕГРЮЛ"]?.map(log => ({
    id: log["@attributes"]["ИдЗап"],
    date: log["@attributes"]["ДатаЗап"],
    type: log["ВидЗап"]?.["@attributes"]?.["НаимВидЗап"]
  }));

  const financesByYear = Object?.keys(egrul?.fin || [])
  .filter(key => key.startsWith("y")) // Ищем ключи, начинающиеся с "y" (годы)
  .map(yearKey => {
    const finances = egrul?.fin[yearKey]["@attributes"];
    return {
      year: yearKey.replace("y", ""), // Извлекаем год из ключа
      revenue: finances["income"] || "Не указано",
      expenses: finances["outcome"] || "Не указано",
      profit: finances["income"] && finances["outcome"] ? parseInt(finances["income"], 10) - parseInt(finances["outcome"], 10) : 0,
      // employees: finances["n"] || "Не указано"
    };
  });

  console.log('financesByYear11111', financesByYear)

  const licenses = Array.isArray(egrul["СвЮЛ"]?.["СвЛицензия"])
  ? egrul["СвЮЛ"]?.["СвЛицензия"].map((lic) => {
    return {
      number: lic["@attributes"]["НомЛиц"],
      date: lic["@attributes"]["ДатаЛиц"],
      activity: Array.isArray(lic["НаимЛицВидДеят"]) ? lic["НаимЛицВидДеят"].join(", ") : lic["НаимЛицВидДеят"],
      issuedBy: lic["ЛицОргВыдЛиц"]
    }
  })
  : egrul["СвЮЛ"]?.["СвЛицензия"]
  ? [
      {
        number: egrul["СвЮЛ"]?.["СвЛицензия"]?.["@attributes"]?.["НомЛиц"],
        date: egrul["СвЮЛ"]?.["СвЛицензия"]?.["@attributes"]?.["ДатаЛиц"],
        activity: egrul["СвЮЛ"]?.["СвЛицензия"]?.["НаимЛицВидДеят"],
        issuedBy: egrul["СвЮЛ"]?.["СвЛицензия"]?.["ЛицОргВыдЛиц"]
      }
    ]
  : []

  const licenseChecker = licenses?.[0]?.activity

  return (
    <div className={style.object__leftMenu}>
      <div className={style["object__leftMenu-wrap"]}>
        {/* <div className={style.menuHead}>Объект <br />{cadNumber}</div> */}
        <ul className={style["object__leftMenu-links"]}>
          <li data-type="egrul" className={`${style["object__leftMenu-link"]} ${style._success}`}>
            <Link to="egrulBaseInfo" smooth={true} activeClass={style.active} spy={true} duration={500}>Сводка</Link>
          </li>
          {employeesByYear &&  employeesByYear.length !== 0 &&
          <li data-type="employees" className={`${style["object__leftMenu-link"]} ${style._success}`}>
            <Link to="employees" smooth={true} activeClass={style.active} spy={true} duration={500}>Сотрудники</Link>
          </li>}
         {additionalOkveds && additionalOkveds.length !== 0 &&
          <li data-type="additionalOkveds" className={`${style["object__leftMenu-link"]} ${style._success}`}>
            <Link to="additionalOkveds" smooth={true} activeClass={style.active} spy={true} duration={500}>ОКВЭДы</Link>
          </li>}
          {registrationLogs && registrationLogs.length !== 0 && <li data-type="registrationLogs" className={`${style["object__leftMenu-link"]} ${style._success}`}>
            <Link to="registrationLogs" smooth={true} activeClass={style.active} spy={true} duration={500}>Записи</Link>
          </li>}
          {financesByYear && financesByYear.length !== 0 && <li data-type="financesByYear" className={`${style["object__leftMenu-link"]} ${style._success}`}>
            <Link to="financesByYear" smooth={true} activeClass={style.active} spy={true} duration={500}>Финансы</Link>
          </li>}

          {licenses && licenses.length !== 0 && licenseChecker && <li data-type="licenses" className={`${style["object__leftMenu-link"]} ${style._success}`}>
            <Link to="licenses" smooth={true} activeClass={style.active} spy={true} duration={500}>Лицензии</Link>
          </li>}
          <li data-type="blocks" className={`${style["object__leftMenu-link"]} ${style._success}`}>
            <Link to="blocks" smooth={true} activeClass={style.active} spy={true} duration={500}>Штрафы</Link>
          </li>
          <li data-type="reports" className={`${style["object__leftMenu-link"]} ${style._success}`}>
            <Link to="egrn" smooth={true} activeClass={style.active} spy={true} duration={500}>Отчеты</Link>
          </li>
        </ul>
        {/* <div className={style.btn}>
          Получить полный отчёт
        </div> */}
      </div>
    </div>
  )
}

export default MenuEgrul

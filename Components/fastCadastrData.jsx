import React, { useState, useEffect, useRef} from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import QRCode from "react-qr-code"
import Cadastr from './info-cadastr';
import OwnersShot from './ownersShot';
import CheckRaports from './checkRaports';
import { ShortVisible } from './shortVisible';
import style from '@/styles/goskadastr.module.css'

const FastCadastrData = ({cadastrData}) => {
  const [cadastrObj, setCadastrObj] = useState(null)
  const [isVisible, setIsVisible] = useState(true);
  const [ready, setReady] = useState(false)
  const [timeLeft, setTimeLeft] = useState(300); // 10 минут в секундах
  const [stepTwoChecker, setTwoStepChecker] = useState(false)
  const [activate, setActivate] = useState(false)
  const [sendActivePromoCode, SetSendActivePromoCode] = useState('')
  const [rightLoader, setRightLoader] = useState(true)
  const [flatRights, setFlatRights] = useState('')
  const [promoCode, setPromoCode] = useState('')

  const router = useRouter()
  const path = router?.asPath
  const ref = useRef(null)
  const cadNumber = cadastrData?.[0]?.cadnum || cadastrData
  const rights = flatRights?.rightsData?.realty?.rights || cadastrObj?.result?.object?.rights || cadastrObj?.objectData?.rights ||
  cadastrObj?.elements?.[0]?.rights

  // const addressNotes = cadastrData?.objectData?.objectAddress?.addressNotes || cadastrData?.objectData?.objectAddress?.mergedAddress || cadastrData.addressNotes || cadastrData?.objectData?.address?.mergedAddress || cadastrData.objectData?.objectAddress || cadastrData?.result?.object?.address || cadastrData?.elements?.[0]?.address?.readableAddress || cadastrData?.data?.features?.[0]?.properties?.options?.readable_address

  const rightsCheck = rights?.filter((it) =>  it?.rightState === 1) || cadastrObj?.elements?.[0]?.rights.length !== 0

  const sendDataToServer = async () => {
    await axios.get(`/api/nspdCadNumData?cadNumber=${cadNumber}`)
    .then(({ data }) => {
        try {
          setCadastrObj(data)
        } catch {
          setCadastrObj(cadastrData)
        }
    })
  }

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);

      return () => clearInterval(timerId);
    } else {
      setIsVisible(false);
    }
  }, [timeLeft]);

  useEffect(() => {

    sendDataToServer()
  }, [])

  useEffect(() => {
    SetSendActivePromoCode(promoCode)
  }, [activate])

  useEffect(() => {
    setReady(false)
    setTimeout(() => {
      setReady(true)
    }, 500)
  }, [cadastrObj])

    const realEstateCategories = [
    { code: "002001001000", name: "Земельный участок" },
    { code: "002001002000", name: "Здание" },
    { code: "002001003000", name: "Помещение" },
    { code: "002001004000", name: "Сооружение" },
    { code: "002001005000", name: "Объект незавершённого строительства" },
    { code: "002001006000", name: "Предприятие как имущественный комплекс" },
    { code: "002001008000", name: "Единый недвижимый комплекс" },
    { code: "002001009000", name: "Машино-место" },
    { code: "002001010000", name: "Иной объект недвижимости" }
  ];


  const objectName = cadastrObj?.objectData?.objectName || cadastrObj?.objectData?.objectDesc || cadastrObj?.result?.object?.objectType || realEstateCategories.find(item => item.code === cadastrObj?.elements?.[0]?.objType)?.name || cadastrObj?.data?.features?.[0]?.properties?.options?.type || cadastrObj?.data?.features?.[0]?.properties?.options?.land_record_type || cadastrObj?.data?.features?.[1]?.properties?.options?.land_record_type || cadastrObj?.features?.[0]?.properties?.options?.params_type || cadastrObj?.features?.[0]?.properties?.options?.land_record_type || cadastrObj?.features?.[0]?.properties?.options?.building_name || 'Объект'


  return (
    <div className="layout">
      <div className={style.object__wrap}>
        <div className={style.object__contentWrap}>
          <div className={style.object__content}>
         {cadastrObj &&
           <>
            <div className={style.objectShortData} id="upTo" >
                <h1 ref={ref}>
                {objectName ? (
                    `${objectName}: ${cadNumber}`
                  ) : (
                    `Объект недвижимости: ${cadNumber}`
                  )}
              </h1>
            </div>
              <div className={style.cadastrContainer}>
                <Cadastr cadastrObj={JSON.stringify(cadastrObj)} promoCode={promoCode} activate={activate} setPromoCode={setPromoCode} cadNumber={cadNumber} setActivate={setActivate} setIsVisible={setIsVisible} isVisible={isVisible} cadastrData={cadastrData} objName={objectName} />
                <OwnersShot cadastrObj={flatRights} promoCode={promoCode} activate={activate} setPromoCode={setPromoCode} cadNumber={cadNumber} setActivate={setActivate} setIsVisible={setIsVisible} isVisible={isVisible} timeLeft={timeLeft} />
              </div>
              {ready && <CheckRaports cadNum={cadNumber} owner={rights} rightsCheck={rightsCheck} promoCode={promoCode} sendActivePromoCode={sendActivePromoCode} activate={activate} setTwoStepChecker={setTwoStepChecker} stepTwoChecker={stepTwoChecker} setPromoCode={setPromoCode} setActivate={setActivate} rightLoader={rightLoader} setRightLoader={setRightLoader} setIsVisible={setIsVisible} isVisible={isVisible} />}
           </>}

          </div>
        </div>
      </div>
    </div>
   )
}

export default FastCadastrData



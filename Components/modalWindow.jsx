import React from 'react'
import { Global } from './global'
import { Owners } from './owners'
import { Cost } from './cost'
import { Complex } from './complex'
import { NoOwners } from './noOwners'
import { OwnersWithPersonalData } from './ownersWithPersonalData'
import { GlobalWithOwner } from './globalWithOwner'
import { Express } from './express'
import { CostWarning } from './costWarning'
import { Egrul } from './egrul'
import  { Shema } from './shema'
import { LandRaport } from './landRaport'
import { Avdk } from './avdk'

export const ModalWindow = ({active, setActive, raport}) => {
  return (
    <div className={active ? "modal active" : "modal"} onClick={() => {setActive(false)}}>
      <div className={active ? "modalContent active" : "modalContent"}>
        {raport === 'general' ? <Global/> : (
          raport === 'owners' ? <Owners/> : (
            raport === 'cost' ? <Cost/> : (
              raport === 'noOwners' ? <NoOwners/> : (
                raport === 'ownersWithPersonalData' ?  <OwnersWithPersonalData /> : (
                  raport === 'express' ?  <Express /> : (
                    raport === 'generalWithOwner' ? <GlobalWithOwner /> : (
                      raport === 'costWarning' ? <CostWarning /> : (
                        raport === 'egrul' ? <Egrul /> : (
                          raport === 'shemaReport' ? <Shema /> : (
                            raport === 'landRaport' ? <LandRaport /> :
                              raport === 'avdk' ? <Avdk /> : <Complex />
                          )
                        )
                      )
                    )
                  )
                )
              )
            )
          )
        )}
      </div>
    </div>
  )
}

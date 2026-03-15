import { useSite } from '@/Components/site/SiteProvider'
import HeaderGoskadastr from '@/Components/headers/headerGoskadastr'
import HeaderRosegrn from '@/Components/headers/headerRosegrn'
import HeaderFcad from '@/Components/headers/headerFcad'
import HeaderFegrn from '@/Components/headers/headerFegrn'


export default function Header() {
  const { site } = useSite()
  if (site === 'nspdmap') return <HeaderRosegrn />
  return <HeaderGoskadastr />
}

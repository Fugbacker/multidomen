import { useSite } from '@/Components/site/SiteProvider'
import SearchMapGoskadastr from '@/Components/searchMap/searchMapGoskadastr'
import SearchMapRosegrn from '@/Components/searchMap/searchMapRosegrn'
import SearchMapFegrn from '@/Components/searchMap/searchMapFegrn'
import SearchMapFcad from '@/Components/searchMap/searchMapFcad'


export default function SearchMap(props) {
  const { site } = useSite()
  if (site === 'nspdmap') return <SearchMapRosegrn {...props} />
  return <SearchMapFegrn {...props} />
}

import { useSite } from '@/Components/site/SiteProvider'
import SearchGoskadastr from '@/Components/search/searchGoskadastr'
import SearchRosegrn from '@/Components/search/searchRosegrn'
import SearchFegrn from '@/Components/search/searchFegrn'
import SearchFcad from '@/Components/search/searchFcad'


export default function Search(props) {
  const { site } = useSite()
  if (site === 'nspdmap') return <SearchGoskadastr {...props} />
  if (site === 'nspdmaps') return <SearchFcad {...props} />
  return <SearchRosegrn {...props} />
}

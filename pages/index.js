// pages/index.js
import { useSite } from '@/Components/site/SiteProvider'
import HomeGoskadastr from '@/Components/pages/homeGoskadastr'
import HomeRosegrn from '@/Components/pages/homeRosegrn'
import HomeFegrn from '@/Components/pages/homeFegrn'
import { getSiteProps } from '@/services/ssr/getSiteProps'

export default function Home(props) {
  const { site } = useSite()

  if (site === 'nspdmap') return <HomeGoskadastr {...props}/>
  if (site === 'nspdmaps') return <HomeFegrn {...props}/>
  return <HomeRosegrn {...props}/>

}

export async function getServerSideProps(context) {
  return {
    props: getSiteProps(context)
  }
}
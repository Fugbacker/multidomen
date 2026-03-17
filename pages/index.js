// pages/index.js
import { useSite } from '@/Components/site/SiteProvider'
import HomeGoskadastr from '@/components/pages/homeGoskadastr'
import HomeRosegrn from '@/components/pages/homeRosegrn'
import { getSiteProps } from '@/services/ssr/getSiteProps'

export default function Home(props) {
  const { site } = useSite()

  if (site === 'nspdmap') return <HomeGoskadastr {...props}/>
  return <HomeRosegrn {...props}/>

}

export async function getServerSideProps(context) {
  return {
    props: getSiteProps(context)
  }
}
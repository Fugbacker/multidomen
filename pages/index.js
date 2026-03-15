// pages/index.js
import { useSite } from '@/Components/site/SiteProvider'
import HomeGoskadastr from '@/pages/goskadastr/homeGoskadastr'
import HomeRosegrn from '@/pages/rosegrn/homeRosegrn'

export default function Home(props) {
  const { site } = useSite()

  if (site === 'nspdmap') return <HomeGoskadastr {...props}/>
  return <HomeRosegrn {...props}/>

}

export async function getServerSideProps(context) {
  const protocol = context.req.headers['x-forwarded-proto'] || 'http'
  const rootHost = context.req.headers.host
  const site = context.req.headers['x-site'] || 'nspdm'
  const host = rootHost && rootHost.split('.').slice(-2).join('.')
  const url = `${protocol}://${host}${context.req.url}`
  return {
    props: {
      url,
      host,
      site
    },
  }
}
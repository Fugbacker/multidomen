import { useSite } from '@/Components/site/SiteProvider'
import GoskadastrKadastrMap from '@/pages/goskadastr/map/[map]'
import RosegrnKadastrMap from '@/pages/rosegrn/map/[map]'
import { getPkkMapProps } from '@/services/map/pkkMap'


export default function MapPage(props) {
  const { site } = useSite()

  if (site === 'nspdmap') {
    return <GoskadastrKadastrMap {...props} />
  }
  return <RosegrnKadastrMap {...props} />
}

export async function getServerSideProps(context) {
  const site = context.req.headers['x-site'] || 'nspdm'

  const mapProps = await getPkkMapProps(context)

  return {
    ...mapProps,
    props: {
      ...mapProps.props,
      site
    }
  }
}
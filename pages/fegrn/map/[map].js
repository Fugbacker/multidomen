import FegrnKadastrMap from '@/Components/pages/FegrnMapPage'
import { getPkkMapProps } from '@/services/map/pkkMap'

export default FegrnKadastrMap

export async function getServerSideProps(context) {
  const mapProps = await getPkkMapProps(context)

  return {
    props: {
      ...mapProps.props,
      site: 'nspdmaps', // фиксируем сайт
    }
  }
}
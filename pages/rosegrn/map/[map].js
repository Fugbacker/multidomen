import RosegrnKadastrMap from '@/Components/pages/RosegrnMapPage'
import { getPkkMapProps } from '@/services/map/pkkMap'

export default RosegrnKadastrMap

export async function getServerSideProps(context) {
  const mapProps = await getPkkMapProps(context)

  return {
    props: {
      ...mapProps.props,
      site: 'nspdm', // фиксируем сайт
    }
  }
}
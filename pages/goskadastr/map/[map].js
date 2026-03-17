import GoskadastrKadastrMap from '@/Components/pages/GoskadastrMapPage'
import { getPkkMapProps } from '@/services/map/pkkMap'

export default GoskadastrKadastrMap

export async function getServerSideProps(context) {
  const mapProps = await getPkkMapProps(context)

  return {
    props: {
      ...mapProps.props,
      site: 'nspdmap', // фиксируем сайт
    }
  }
}
import HomeRosegrn from '@/components/pages/HomeRosegrn'
import { getSiteProps } from '@/services/ssr/getSiteProps'

export default HomeRosegrn

export async function getServerSideProps(context) {
  return {
    props: getSiteProps(context)
  }
}
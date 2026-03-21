import HomeFegrn from '@/Components/pages/homeFegrn'
import { getSiteProps } from '@/services/ssr/getSiteProps'

export default HomeFegrn

export async function getServerSideProps(context) {
  return {
    props: getSiteProps(context)
  }
}
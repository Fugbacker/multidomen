import HomeGoskadastr from '@/Components/pages/homeGoskadastr'
import { getSiteProps } from '@/services/ssr/getSiteProps'

export default HomeGoskadastr

export async function getServerSideProps(context) {
  return {
    props: getSiteProps(context)
  }
}
import { useSite } from '@/Components/site/SiteProvider'
import FooterGoskadastr from '@/Components/footer/footerGoskadastr'
import FooterRosegrn from '@/Components/footer/footerRosegrn'

export default function Footer(props) {
  // console.log('Footer', FooterRosegrn)
  //   console.log('FooterGoskadastr', FooterGoskadastr)
  const { site } = useSite()
  if (site === 'nspdmap') return <FooterGoskadastr {...props} />
  return <FooterRosegrn {...props} />
}

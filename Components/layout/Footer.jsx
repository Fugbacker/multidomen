import { useSite } from '@/Components/site/SiteProvider'
import FooterGoskadastr from '@/Components/footer/footerGoskadastr'
import FooterRosegrn from '@/Components/footer/footerRosegrn'
import FooterFegrn from '@/Components/footer/footerFegrn'

export default function Footer(props) {
  const { site } = useSite()

  if (site === 'nspdmap') return <FooterGoskadastr {...props} />
  if (site === 'nspdmaps') return <FooterFegrn {...props} />
  return <FooterRosegrn {...props} />
}

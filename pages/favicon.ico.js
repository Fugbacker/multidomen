import fs from 'fs'
import path from 'path'

export async function getServerSideProps({ req, res }) {

  const host = req.headers.host || ''

  let file = 'nspdm.ico'

  if (host.includes('nspdmap')) {
    file = 'nspdmap.ico'
  }

  if (host.includes('nspdmaps')) {
    file = 'nspdmaps.ico'
  }


  const filePath = path.join(process.cwd(), 'public', file)

  const favicon = fs.readFileSync(filePath)

  res.setHeader('Content-Type', 'image/x-icon')
  res.write(favicon)
  res.end()

  return { props: {} }
}

export default function Favicon() {
  return null
}
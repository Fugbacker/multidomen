export async function getServerSideProps({ req, res }) {

  const host = req.headers.host || ''

  let content

  if (host.includes('nspdmap')) {
    content = `
    User-agent: *
    Allow: /
    Host: https://nspdmap.su
    `
  } else {
    content = `
    User-agent: *
    Allow: /
    Host: https://nspdm.su
`
  }

  res.setHeader('Content-Type', 'text/plain')
  res.write(content)
  res.end()

  return { props: {} }
}

export default function Robots() {
  return null
}
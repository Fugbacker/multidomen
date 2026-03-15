import axios from "axios"

export default async function tooltips(req, res) {
  const text = req.query.text
  try {
    const arrayOfAddresses = text.split("|").filter(it => it !== 'null')
    const address = arrayOfAddresses.join(' ')
    const url = `http://5.181.253.35:3000/api/tooltips?address=${address}`
    const encodingUrl = encodeURI(url)
    const getAskByReestrByAdress = await axios({
      method: 'GET',
        timeout: 1000 * 5,
        url: encodingUrl,
      })

    let result = getAskByReestrByAdress?.data
    return res.json(result)
  } catch (error) {
      return res.json('error')
    }
}

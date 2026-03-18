import axios from 'axios'
import path from 'path';
import fs from 'fs';
import pdf from 'html-pdf';
import CadastrCostPdfGenerator from "@/Components/cadastrCostPdfGenerator";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0

export default async function result(req, res) {
  const resultData = req.body
  const cadNum = resultData?.cadNumber
  const modifiedString = cadNum.replace(/:/g, '-');

  const url = `http://5.181.253.35:3000/api/search?cadNumber=${cadNum}`;

  let object = null
  const resp = await axios.get(url);
  const data = resp?.data;

  if (
    data?.features?.length > 0 ||
    data?.feature ||
    data?.properties ||
    data?.data?.features?.length > 0 ||
    data?.[0]?.length > 0
  ) {
    object = data;   // ✅ правильный ответ
  }

  let historyCadPrice

  try {
    const url = `	http://5.181.253.35:3000/api/history?cadNumber=${cadNumber}`
    let nspdData = await axios({
      method: 'GET',
      timeout: 1000 * 6,
      url: url
    })

    historyCadPrice = nspdData?.data?.data || nspdData?.data

  } catch {
    historyCadPrice = []
  }


  if (historyCadPrice.length !== 0) {
    object = {
      ...object,
      historyCadPrice
    }
  }

  const cadCostHtml = CadastrCostPdfGenerator({object})
  const pdfFilePath = path.join(`./public/expressPdf/${modifiedString}.pdf`);

  pdf.create(cadCostHtml, {
    childProcessOptions: {
      env: {
        OPENSSL_CONF: '/dev/null'
      }
    },
    format: "A2",
    border: {
      top: '75px',
      right: '50px',
      bottom: '50px',
      left: '50px'
    }
  }).toFile(pdfFilePath, async (err, filePath) => {
    if (err) {
      console.log('ОШИБКА ПРИ СОЗДАНИИ PDF', err);
      res.status(500).json({ error: 'Ошибка при создании PDF' });
      return;
    }

    const fileStream = fs.createReadStream(filePath.filename);
    const stat = fs.statSync(filePath.filename);

    res.setHeader('Content-Length', stat.size);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=example.pdf`);
    fileStream.pipe(res);
  });

}
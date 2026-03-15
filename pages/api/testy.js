import axios from "axios";
import UserAgent from 'user-agents';
import http from 'http';
import https from 'https';
import { getGeoportalUrls, origins } from '@/libs/urls';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const URL = process.env.NEXTAUTH_URL;
let lastSuccessfulIndex = -1;

export default async function chart(req, res) {
  const cadNum = req.query.cadNumber;
  const userAgent = new UserAgent();

  const host = req.headers.host;
  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const baseUrl = `${protocol}://${host}`;
  // === Кэширование IP-адресов ===
  let cachedIps = [];
  let ipsLastFetched = 0;
  const IPS_CACHE_TTL = 60 * 60 * 1000; // 5 минут

  async function getLocalIps(baseUrl) {
    const now = Date.now();
    if (now - ipsLastFetched > IPS_CACHE_TTL) {
      const ipResponse = await axios.get(`${baseUrl}/api/ips`, { timeout: 3000 });
      cachedIps = ipResponse.data; // вы уверены, что всегда массив
      ipsLastFetched = now;
    }
    return cachedIps;
  }

  let cachedCookies = [];
  let CookiesLastFetched = 0;
  const COOKIE_CACHE_TTL = 60 * 60 * 1000; // 5 минут

  async function getCookie() {
    const now = Date.now();
    if (now - CookiesLastFetched > COOKIE_CACHE_TTL) {
      const ipResponse = await axios.get(`${URL}/api/cookie`, { timeout: 3000 });
      cachedCookies = ipResponse.data; // вы уверены, что всегда массив
      CookiesLastFetched = now;
    }
    return cachedCookies;
  }

  const ipsList = await getLocalIps(baseUrl);

  const geoportalUrls = getGeoportalUrls(cadNum);

  const getRandomLocalIp = () =>
    ipsList[Math.floor(Math.random() * ipsList.length)];




  function makeNspdReferer(options = {}) {
  const layer = options.layer ?? "36048";
  const center = options.center ?? { x: 4857231.604740751, y: 5388693.217185968 };
  const radius = options.radius ?? 5000;

  // случайное целое в диапазоне [min, max]
  const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  // случайный float с N знаками
  const randFloat = (min, max, decimals = 12) =>
    (Math.random() * (max - min) + min).toFixed(decimals);

  // generate random spherical offset in meters (approx)
  const angle = Math.random() * Math.PI * 2;
  const dist = Math.random() * radius;
  const dx = Math.cos(angle) * dist;
  const dy = Math.sin(angle) * dist;
  const coordX = (center.x + dx).toFixed(12);
  const coordY = (center.y + dy).toFixed(12);

  // random components
  const thematic = "Default";
  const baseLayerId = randInt(1, 999);           // любой id
  const theme_id = randInt(1, 999);
  const zoom = randInt(0, 22);
  const is_copy_url = Math.random() < 0.9 ? "true" : "false"; // чаще true

  const qs = new URLSearchParams({
    thematic,
    baseLayerId: String(baseLayerId),
    theme_id: String(theme_id),
    zoom: String(zoom),
    coordinate_x: coordX,
    coordinate_y: coordY,
    is_copy_url,
    active_layers: String(layer)
  });

  return `https://nspd.gov.ru/map?${qs.toString()}`;
}




async function tryUrlsSequentially(startIndex, attemptsLeft) {
  if (attemptsLeft === 0) return null;

  const idx = startIndex % geoportalUrls.length;
  const url = geoportalUrls[idx];
  console.log('CLICKURL', url)
  const localIp = getRandomLocalIp();

  try {

    // =========================
    //  СЛУЧАЙ 1: test.fgishub.ru
    // =========================
    if (url.includes("test.fgishub.ru")) {
      console.log("🔍 fgishub flow...");

      const origin = origins[Math.floor(Math.random() * origins.length)];

      const resp = await axios({
        method: 'GET',
        url,
        timeout: 4000,
        headers: {
          'User-Agent': userAgent.toString(),
          'Host': 'test.fgishub.ru',
          'Origin': origin,
          // 'Referer': origin
        },
        httpAgent: new http.Agent({ localAddress: localIp }),
        httpsAgent: new https.Agent({ localAddress: localIp, rejectUnauthorized: false }),
      });


      if (resp?.data?.features && resp?.data?.features?.length > 0 || resp?.data?.data?.features && resp?.data?.data?.features?.length > 0) {

        lastSuccessfulIndex = idx;
        return resp.data;
      }
    }

    // =========================
    //  СЛУЧАЙ 3: binep.ru — POST поиск по координатам
    // =========================
    if (url.includes("binep.ru/api/v3/search")) {
      console.log("🔍 binep flow...");
      const postBody = {
        query: cadNum // координаты: [lonMerc, latMerc], как и просил
      };
      const localIp2 = getRandomLocalIp();

      const resp = await axios({
        method: 'POST',
        url,
        timeout: 4000,
        headers: {
          'User-Agent': userAgent.toString(),
          'Host': 'binep.ru',
          // 'Content-Type': 'application/json'
        },
        data: postBody,
        httpAgent: new http.Agent({ localAddress: localIp2 }),
        httpsAgent: new https.Agent({ localAddress: localIp2, rejectUnauthorized: false }),
      })

      if (resp?.data?.features && resp?.data?.features?.length !==0) {
        lastSuccessfulIndex = idx;
        return resp.data;
      }
    }

        // =========================
    //  СЛУЧАЙ 4: nspd.gov.ru
    // =========================
    if (url.includes("nspd.gov.ru")) {
      console.log("🔍 nspd.gov.ru flow...");

      const localIp2 = getRandomLocalIp();
      const referer = makeNspdReferer();
      const resp = await axios({
        method: 'GET',
        url,
        timeout: 4000,
        headers: {
          'User-Agent': userAgent.toString(),
          'Host': 'nspd.gov.ru',
          'Referer': referer,
          // 'Content-Type': 'application/json'
        },
        httpAgent: new http.Agent({ localAddress: localIp2 }),
        httpsAgent: new https.Agent({ localAddress: localIp2, rejectUnauthorized: false }),
      })

      if (resp?.data?.features && resp?.data?.features?.length !==0 || resp?.data?.data?.features && resp?.data?.data?.features?.length !==0) {
        lastSuccessfulIndex = idx;
        return resp.data;
      }
    }

    // =========================
    // ✅ СЛУЧАЙ 5: mobile.rosreestr.ru
    // =========================
    if (url.includes("mobile.rosreestr.ru")) {
      console.log("mobile.rosreestr.ru...");
      const cookies = await getCookie();
      const resp = await axios({
        method: 'GET',
        url,
        timeout: 4000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',
          'Host': 'mobile.rosreestr.ru',
          'Cookie': cookies,
          'Referer': 'https://mobile.rosreestr.ru'
        },
        httpAgent: new http.Agent({ localAddress: localIp }),
        httpsAgent: new https.Agent({ localAddress: localIp, rejectUnauthorized: false }),
      })

       if (resp?.data?.features && resp?.data?.features?.length !==0 || resp?.data?.data?.features && resp?.data?.data?.features?.length !==0) {
        lastSuccessfulIndex = idx;
        return resp.data;
      }
    }



    // =========================
    //  Стандартный WMS запрос
    // =========================
    console.log("standart flow...");
    const headers = {
      'User-Agent': userAgent.toString(),
    };

    if (url.includes('pub.fgislk.gov.ru')) {
      headers['Host'] = 'pub.fgislk.gov.ru';
      headers['Referer'] = 'https://pub.fgislk.gov.ru/map';
    }
    const response = await axios({
      method: 'GET',
      url,
      timeout: 3000,
      headers,
      httpAgent: new http.Agent({ localAddress: localIp }),
      httpsAgent: new https.Agent({ localAddress: localIp, rejectUnauthorized: false }),
    });



    if (response?.data?.features && response?.data?.features?.length !==0 || response?.data?.data?.features && response?.data?.data?.features?.length !==0|| response?.data?.properties || response?.data?.feature) {
      lastSuccessfulIndex = idx;
      return response.data;
    }

    return tryUrlsSequentially(idx + 1, attemptsLeft - 1);

  } catch (err) {
     return tryUrlsSequentially(idx + 1, attemptsLeft - 1);
  }
}

  const startFrom = (lastSuccessfulIndex + 1) % geoportalUrls.length;

  try {
    const data = await tryUrlsSequentially(startFrom, geoportalUrls.length);
    res.json(data || []);
  } catch (e) {
    console.log('ОШИБКА ЗАПРОСА К НСПД', e);
    res.json([]);
  }
}
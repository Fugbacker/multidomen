import clientPromise from '@/libs/mongoClient';
import macroRegions from '@/Components/files/macroRegions'
import axios from 'axios';
import { decryptBase62 } from '@/utils/base62'

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0




export async function getPkkMapProps(context) {
  const rootHost = context.req.headers.host
  const host = rootHost && rootHost.split('.').slice(-2).join('.')
  const client = await clientPromise;
  const db = client.db(process.env.MONGO_COLLECTION);
  const codeFromUrl = context.params.map
  const regionData = decryptBase62(codeFromUrl, host)

  function buildMatchStage(field, regionName, useRegex = false, settlementName = null, macroRegionName = null) {
    const matchStage = {}

      if (useRegex) {
        matchStage[field] = {
          $regex: `(${regionName}\\s*(район|муниципальный)?\\s*)`,
          $options: 'i',
        }
      } else {
        matchStage[field] = regionName
      }

      if (macroRegionName !== null) {
        matchStage.region = macroRegionName
      }

      if (settlementName !== null) {
        matchStage.settlement = settlementName
      }

      return matchStage
  }

async function getDemographyStats(regionName, options = {}, settlementName, macroRegionName) {
  const {
    field = 'region',
    regex = false,
  } = options;

  const matchStage = buildMatchStage(field, regionName, regex, settlementName, macroRegionName);

  const stats = await db.collection('demography').aggregate([
    { $match: matchStage },

    {
      $group: {
        _id: '$type',
        totalPopulation: { $sum: '$population' },
        totalChildren: { $sum: '$children' },
        totalSettlements: { $sum: 1 },
      },
    },

    {
      $group: {
        _id: null,
        totalPopulation: { $sum: '$totalPopulation' },
        totalChildren: { $sum: '$totalChildren' },

        totalSettlementsByType: {
          $push: {
            type: '$_id',
            count: '$totalSettlements',
          },
        },

        types: {
          $push: {
            type: '$_id',
            population: '$totalPopulation',
          },
        },
      },
    },

    {
      $project: {
        _id: 0,
        totalPopulation: 1,
        totalChildren: 1,
        totalSettlementsByType: 1,
        types: 1,
      },
    },
  ]).toArray();



  const {
    totalPopulation = 0,
    totalChildren = 0,
    types = [],
    totalSettlementsByType = [],
  } = stats[0] || {};

  // ---- Compute typeStats ----
  const typeStats = types.reduce((acc, { type, population }) => {
    acc[type || 'иной'] = population || 0;
    return acc;
  }, {});

  // ---- Compute settlementCounts ----
  const settlementCounts = totalSettlementsByType.reduce(
    (acc, { type, count }) => {
      const key = type || 'иной';
      acc[key] = (acc[key] || 0) + (count || 0);
      return acc;
    },
    {}
  );

  // ---- Return safe JSON-serializable data ----
  return {
    totalPopulation: totalPopulation ?? 0,
    totalChildren: totalChildren ?? 0,

    childrenPercentage: totalPopulation
      ? ((totalChildren / totalPopulation) * 100).toFixed(2)
      : "0.00",

    typeStats,

    typePercentages: Object.keys(typeStats).reduce((acc, key) => {
      acc[key] = totalPopulation
        ? ((typeStats[key] / totalPopulation) * 100).toFixed(6)
        : "0.000000";
      return acc;
    }, {}),

    settlementCounts,
  };
}

  if (regionData.includes('-')) {
    const regionNumber = regionData.split('-')[0];
    const regionId = parseInt(regionData.split('-')[1]);

    const collection = db.collection('Reestr_geo');
    const array = await collection.find({ 'regionId': regionId }).toArray();
    const settlementsArray = array.map((it) => {
      return {
        name: `${it.settlement_type}. ${it.settlement_name}`,
        id: it.settlementId,
        reestrId: it.id_rosreestr_geo,
        region_name: it.region_name
      };
    });

    const clearRegionList = Array.from(new Set(settlementsArray.map(JSON.stringify)), JSON.parse);
    const list = clearRegionList.filter(item => !item.name.includes('р-н')).filter(item => item.name.trim() !== '');
    const regionName = list[0]?.region_name;

    const db1 = client.db('cadastr');
    const collection1 = db1.collection('reeestr_districts');
    const object = await collection1.findOne({ districtId: regionId });


    const stats = await getDemographyStats(regionName, {
      field: 'municipality',
      regex: true
    });


    function convertCoordinates(point) {
      return [(2 * Math.atan(Math.exp(point[1] / 6378137)) - Math.PI / 2) / (Math.PI / 180), point[0] / (Math.PI / 180.0) / 6378137.0];
    }

    const center = convertCoordinates([object?.data?.feature?.center?.x, object?.data?.feature?.center?.y]);


    return {
      props: {
        list: JSON.stringify(list) || null,
        regionName: regionName || null,
        regionNumber: regionNumber || null,
        districtData: JSON.stringify(object?.data?.feature) || null,
        center: JSON.stringify(center) || null,
        region: 'ok',
        host,
        regionStat: JSON.stringify(object?.data?.feature?.stat) || null,
        totalPopulation: JSON.stringify(stats.totalPopulation),
        totalChildren: JSON.stringify(stats.totalChildren),
        childrenPercentage: JSON.stringify(stats.childrenPercentage),
        typeStats: JSON.stringify(stats.typeStats),
        typePercentages: JSON.stringify(stats.typePercentages),
        settlementCounts: JSON.stringify(stats.settlementCounts),
      }
    };
  }

  if (regionData.includes('_')) {
    const regionNumber = regionData.split('_')[0];
    const regionId = parseInt(regionData.split('_')[1]);
    const collection = db.collection('Reestr_geo');
    const array = await collection.find({ 'regionId': regionId }).toArray();
    const settlementsArray = array.map((it) => {
      return {
        name: `${it.settlement_type}. ${it.settlement_name}`,
        id: it.settlementId,
        reestrId: it.id_rosreestr_geo,
        region_name: it.region_name
      };
    });

    const clearRegionList = Array.from(new Set(settlementsArray.map(JSON.stringify)), JSON.parse);
    const list = clearRegionList.filter(item => !item.name.includes('р-н')).filter(item => item.name.trim() !== '');
    let regionName = list[0]?.region_name;
    if (regionId === 39100000600000) {
      regionName = "Джанкой"
    }
    const db1 = client.db('cadastr');
    const collection1 = db1.collection('reeestr_districts');
    const object = await collection1.findOne({ districtId: regionId });
    // let center = convertCoordinates([object?.data?.feature?.center?.x, object?.data?.feature?.center?.y]);

    function convertCoordinates(point) {
      return [(2 * Math.atan(Math.exp(point[1] / 6378137)) - Math.PI / 2) / (Math.PI / 180), point[0] / (Math.PI / 180.0) / 6378137.0];
    }

    let center = convertCoordinates([object?.data?.feature?.center?.x, object?.data?.feature?.center?.y])

    if (!object) {
      const askToken = await axios('http://5.181.253.35:3000/api/token');
      const token = askToken.data;
      const url = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address';
      const getAskDadata = await axios({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': token,
          'Host': 'suggestions.dadata.ru',
        },
        url: encodeURI(url),
        data: { query: regionName, 'count': 10 }
      });

      const settlementDadada = getAskDadata.data.suggestions[0];
      center = [settlementDadada?.data?.geo_lat, settlementDadada?.data?.geo_lon];
    }

    const stats = await getDemographyStats(regionName, {
      field: 'settlement',
    });

    return {
      props: {
        list: JSON.stringify(list) || null,
        regionName: regionName || null,
        regionNumber: regionNumber || null,
        districtData: JSON.stringify(object?.data?.feature) || null,
        center: JSON.stringify(center) || null,
        city: 'ok',
        host,
        totalPopulation: JSON.stringify(stats.totalPopulation),
        totalChildren: JSON.stringify(stats.totalChildren),
        childrenPercentage: JSON.stringify(stats.childrenPercentage),
        typeStats: JSON.stringify(stats.typeStats),
        typePercentages: JSON.stringify(stats.typePercentages),
        settlementCounts: JSON.stringify(stats.settlementCounts),
      }
    };
  }

  if (regionData.includes(',')) {
    const regionNumber = regionData.split(',')[0];
    const regionId = parseInt(regionData.split(',')[1]);

    const collection = db.collection('Reestr_geo');
    const array = await collection.find({ 'settlementId': regionId }).toArray();
    const settlementsArray = array.map((it) => {
      return {
        macroRegionId: it?.macroRegionId,
        name: `${it.settlement_type}. ${it.settlement_name}`,
        id: it?.settlementId,
        reestrId: it?.id_rosreestr_geo,
        region_name: it?.region_name
      };
    });

    const regionName = settlementsArray[0]?.region_name;
    const settlementName = settlementsArray[0]?.name.split('.')[1];
    const macroRegionNameGenetive = macroRegions.find((it) => it.id === settlementsArray[0]?.macroRegionId)?.genitive;
    const macroRegionName = macroRegions.find((it) => it.id === settlementsArray[0]?.macroRegionId)?.name;

    let fullAddress = `${macroRegionName}, ${array[0].region_name} ${array[0].region_type}, ${settlementName}`;
    // console.log('fullAddress', fullAddress)
    const askToken = await axios('http://5.181.253.35:3000/api/token');
    const token = askToken.data;
    const url = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address';
    const getAskDadata = await axios({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': token,
        'Host': 'suggestions.dadata.ru',
      },
      url: encodeURI(url),
      data: { query: fullAddress, 'count': 10 }
    });

    let settlementDadada = getAskDadata.data.suggestions[0];


    if (!settlementDadada) {
      const fullAddress = `${macroRegionName}, ${array[0].region_name}, ${settlementName}`
      const askToken = await axios('http://5.181.253.35:3000/api/token');
      const token = askToken.data;
      const url = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address';
      const getAskDadata = await axios({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': token,
          'Host': 'suggestions.dadata.ru',
        },
        url: encodeURI(url),
        data: { query: fullAddress, 'count': 10 }
      });
      settlementDadada = getAskDadata.data.suggestions[0]
    }

    let center = [settlementDadada?.data?.geo_lat || 55.755864, settlementDadada?.data?.geo_lon || 37.617698, 13];

    const stats = await getDemographyStats(regionName.trim(), {
      field: 'municipality',
      regex: true
    },
    settlementName.trim(),
    macroRegionName.trim()
  );

    return {
      props: {
        list: JSON.stringify(settlementsArray) || null,
        regionName: regionName || null,
        regionNumber: regionNumber || null,
        settlement: 'ok',
        macroRegionNameGenetive: macroRegionNameGenetive || null,
        settlementName: settlementName || null,
        center: JSON.stringify(center) || null,
        host,
        totalPopulation: JSON.stringify(stats.totalPopulation),
        totalChildren: JSON.stringify(stats.totalChildren),
        childrenPercentage: JSON.stringify(stats.childrenPercentage),
        typeStats: JSON.stringify(stats.typeStats),
        typePercentages: JSON.stringify(stats.typePercentages),
        settlementCounts: JSON.stringify(stats.settlementCounts),
      }
    };
  }

  const regionNumber = regionData.split('|')[0];
  const regionCadastrCode = parseInt(regionData.split('|')[1]);
  const regionName = macroRegions.find((it) => it.id === regionCadastrCode)?.name;
  const collection = db.collection('reeestr_regions');
  const regionStatsData = await collection.findOne({ 'attrs.id': regionNumber });
  let center = convertCoordinates([regionStatsData?.center?.x, regionStatsData?.center?.y]);

  if (!regionStatsData) {
    const askToken = await axios('http://5.181.253.35:3000/api/token');
    const token = askToken.data;
    const url = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address';
    const getAskDadata = await axios({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': token,
        'Host': 'suggestions.dadata.ru',
      },
      url: encodeURI(url),
      data: { query: regionName, 'count': 10 }
    });

    const settlementDadada = getAskDadata.data.suggestions[0];
    center = [settlementDadada?.data?.geo_lat, settlementDadada?.data?.geo_lon];
  }

  const collection1 = db.collection('Reestr_geo');
  const array = await collection1.find({ 'macroRegionId': regionCadastrCode }).toArray();

  const regionArray = array.map((it) => {
    return {
      name: `${it.region_type}. ${it.region_name}`,
      id: it.regionId,
    };
  });

  const clearRegionList = Array.from(new Set(regionArray.map(JSON.stringify)), JSON.parse);
  const cities = clearRegionList.filter(item => !item.name.includes('р-н')).filter(item => item.name.trim() !== '');
  const districts = clearRegionList.filter(item => item.name.includes('р-н')).filter(item => item.name.trim() !== '');
  const arrayOfAllDistricts = [...cities, ...districts];

  function convertCoordinates(point) {
    return [(2 * Math.atan(Math.exp(point[1] / 6378137)) - Math.PI / 2) / (Math.PI / 180), point[0] / (Math.PI / 180.0) / 6378137.0];
  }


  const stats = await getDemographyStats(regionName, {
      field: 'region',
    });

  return {
    props: {
      cities: JSON.stringify(cities) || null,
      districts: JSON.stringify(districts) || null,
      regionName: regionName || null,
      regionCode: regionCadastrCode || null,
      regionStat: JSON.stringify(regionStatsData?.stat) || null,
      center: JSON.stringify(center) || null,
      regionNumber: regionNumber || null,
      host,
      totalPopulation: JSON.stringify(stats.totalPopulation),
      totalChildren: JSON.stringify(stats.totalChildren),
      childrenPercentage: JSON.stringify(stats.childrenPercentage),
      typeStats: JSON.stringify(stats.typeStats),
      typePercentages: JSON.stringify(stats.typePercentages),
      settlementCounts: JSON.stringify(stats.settlementCounts),
    }
  };
}
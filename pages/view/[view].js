import { useRouter } from 'next/router'
import { useEffect, useMemo, useRef, useState } from 'react'
import { YMaps, Map, Polygon, Placemark } from '@pbe/react-yandex-maps'

// Функции гео-расчётов
function calculateDistance([lat1, lon1], [lat2, lon2]) {
  const R = 6371000; // радиус Земли в метрах
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * Math.PI / 180) *
            Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function getMidPoint([lat1, lon1], [lat2, lon2]) {
  return [(lat1 + lat2) / 2, (lon1 + lon2) / 2];
}

function calculateArea(coords) {
  // Простой планарный алгоритм (для небольших площадей работает)
  let area = 0;
  for (let i = 0; i < coords.length - 1; i++) {
    const [y1, x1] = coords[i];
    const [y2, x2] = coords[i + 1];
    area += (x1 * y2 - x2 * y1);
  }
  return Math.abs(area / 2) * 111000 * 111000; // перевод из "градусов" в м²
}

function getPolygonCenter(coords) {
  const latSum = coords.reduce((sum, [lat]) => sum + lat, 0);
  const lonSum = coords.reduce((sum, [, lon]) => sum + lon, 0);
  return [latSum / coords.length, lonSum / coords.length];
}

export default function ViewMap() {
  const router = useRouter();
  const mapRef = useRef(null);
  const [ymapsApi, setYmapsApi] = useState(null);

  const polygonParam = router.query.view;
  const polygonCoords = useMemo(() => {
    try {
      return JSON.parse(decodeURIComponent(polygonParam));
    } catch {
      return null;
    }
  }, [polygonParam]);

  const center = useMemo(() => getPolygonCenter(polygonCoords || []), [polygonCoords]);

  // Стороны
  const sideDistances = useMemo(() => {
    if (!polygonCoords || polygonCoords.length < 2) return [];
    return polygonCoords.map((point, i) => {
      const next = polygonCoords[(i + 1) % polygonCoords.length];
      return {
        id: `side-${i}`,
        from: point,
        to: next,
        midPoint: getMidPoint(point, next),
        distance: calculateDistance(point, next),
      };
    });
  }, [polygonCoords]);

  const totalArea = useMemo(() => {
    if (!polygonCoords || polygonCoords.length < 3) return null;
    return calculateArea(polygonCoords);
  }, [polygonCoords]);

  const formatMeters = (meters) => meters > 1000
    ? `${(meters / 1000).toFixed(2)} км`
    : `${Math.round(meters)} м`;

  const formatArea = (area) => {
    if (area > 1000000) return `${(area / 1e6).toFixed(2)} км²`;
    if (area > 10000) return `${(area / 10000).toFixed(2)} га`;
    return `${Math.round(area)} м²`;
  };

  const handleDownloadGeoJSON = () => {
    if (!polygonCoords || polygonCoords.length < 3) return;

    const geojson = {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [[
          ...polygonCoords.map(([lat, lon]) => [lon, lat]),
          [polygonCoords[0][1], polygonCoords[0][0]] // замыкаем
        ]]
      },
      properties: { name: "Пользовательский полигон" }
    };

    const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "polygon.geojson";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 space-y-4">
      <YMaps query={{ apikey: 'c1669e56-36a2-4324-b11c-9f5939204015' }} onLoad={setYmapsApi}>
        <Map
          defaultState={{ center, zoom: 17 }}
          width="100%"
          height="600px"
          instanceRef={mapRef}
          modules={["templateLayoutFactory"]}
        >
          {polygonCoords && (
            <>
              <Polygon
                geometry={[polygonCoords]}
                options={{
                  fillColor: '#00FF0055',
                  strokeColor: '#008000',
                  strokeWidth: 3
                }}
              />

              {ymapsApi && sideDistances.map((side, i) => (
                <Placemark
                  key={side.id}
                  geometry={side.midPoint}
                  options={{
                    iconLayout: 'default#imageWithContent',
                    iconImageSize: [1, 1],
                    iconContentLayout: ymapsApi.templateLayoutFactory.createClass(`
                      <div style="
                        background: white;
                        padding: 2px 5px;
                        font-size: 10px;
                        border-radius: 4px;
                        border: 1px solid #3B82F6;
                        color: #1E40AF;
                      ">${formatMeters(side.distance)}</div>
                    `)
                  }}
                />
              ))}

              {ymapsApi && totalArea && (
                <Placemark
                  geometry={center}
                  options={{
                    iconLayout: 'default#imageWithContent',
                    iconImageSize: [1, 1],
                    iconContentLayout: ymapsApi.templateLayoutFactory.createClass(`
                      <div style="
                        background: rgba(16, 185, 129, 0.95);
                        padding: 6px 10px;
                        font-size: 12px;
                        border-radius: 6px;
                        border: 1px solid #059669;
                        color: white;
                      ">
                        Площадь: ${formatArea(totalArea)}
                      </div>
                    `)
                  }}
                />
              )}
            </>
          )}
        </Map>
      </YMaps>

      {/* Кнопка скачивания */}
      <button
        onClick={handleDownloadGeoJSON}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Скачать GeoJSON
      </button>

      {/* Координаты */}
      {polygonCoords && (
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-semibold mb-2">Координаты точек:</h3>
          <ul className="text-sm font-mono space-y-1">
            {polygonCoords.map(([lat, lon], i) => (
              <li key={i}>[{lat.toFixed(6)}, {lon.toFixed(6)}]</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

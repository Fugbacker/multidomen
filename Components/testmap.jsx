import React, { useRef, useEffect } from 'react';
import { YMaps, Map } from '@pbe/react-yandex-maps';
import { Deck } from '@deck.gl/core';
import { TileLayer } from '@deck.gl/geo-layers';
import { BitmapLayer } from '@deck.gl/layers';

const CadastralMap = () => {
  const mapRef = useRef(null);
  const ymapsRef = useRef(null);
  const deckRef = useRef(null);
  const canvasRef = useRef(null);

  const getBbox = (x, y, z) => {
    const tileSize = 512;
    const resolution = (2 * Math.PI * 6378137) / (tileSize * Math.pow(2, z));

    const minX = x * tileSize * resolution - Math.PI * 6378137;
    const maxY = Math.PI * 6378137 - y * tileSize * resolution;
    const maxX = (x + 1) * tileSize * resolution - Math.PI * 6378137;
    const minY = Math.PI * 6378137 - (y + 1) * tileSize * resolution;

    return [minX, minY, maxX, maxY];
  };

  const loadImage = (url) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });

  useEffect(() => {
    if (!mapRef.current || !ymapsRef.current) return;

    const ymap = mapRef.current;
    const projection = ymap.options.get('projection');
    const container = ymap.container.getElement();

    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.pointerEvents = 'none';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '1000';
    container.appendChild(canvas);
    canvasRef.current = canvas;

    const wmsLayer = new TileLayer({
      id: 'wms-layer',
      tileSize: 512,
      minZoom: 5,
      maxZoom: 20,
      getTileData: async ({ x, y, z }) => {
        const bbox = getBbox(x, y, z);
        const url = `https://nspd.gov.ru/api/aeggis/v4/36048/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image/png&TRANSPARENT=true&LAYERS=36048&WIDTH=512&HEIGHT=512&CRS=EPSG:3857&BBOX=${bbox.join(',')}`;
        console.log('Tile URL:', url);
        return loadImage(url);
      },
      renderSubLayers: (props) => {
        const { bbox: [minX, minY, maxX, maxY] } = props.tile;
        return new BitmapLayer(props, {
          image: props.data,
          bounds: [minX, minY, maxX, maxY],
        });
      },
    });

    const getViewState = () => {
      const center = projection.toGlobalPixels(ymap.getCenter(), ymap.getZoom());
      return {
        longitude: ymap.getCenter()[1],
        latitude: ymap.getCenter()[0],
        zoom: ymap.getZoom() - 1,
        bearing: 0,
        pitch: 0,
      };
    };

    const deck = new Deck({
      parent: container,
      canvas,
      layers: [wmsLayer],
      controller: false,
      initialViewState: getViewState(),
    });

    deckRef.current = deck;

    const syncView = () => {
      deck.setProps({ viewState: getViewState() });
    };

    ymap.events.add('boundschange', syncView);

    return () => {
      deck.finalize();
    };
  }, []);

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <YMaps query={{ apikey: 'c1669e56-36a2-4324-b11c-9f5939204015', lang: 'ru_RU' }}>
        <Map
          defaultState={{ center: [55.75, 37.6], zoom: 12, controls: [] }}
          width="100%"
          height="100%"
          instanceRef={(ref) => (mapRef.current = ref)}
          onLoad={(ymaps) => (ymapsRef.current = ymaps)}
        />
      </YMaps>
    </div>
  );
};

export default CadastralMap;

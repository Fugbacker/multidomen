const YMapsLayers = ({ props }) => {

    const ymaps = useRef(props?.ymaps?.current);

    useEffect(() => {

        if (!props?.ymaps) return;

        addLayers(layersConfig);

    }, []);

    function addLayers(layersConfig) {
        layersConfig?.layers?.forEach((layer) => {
            const p = { ...layer };
            ymaps.current.layer.storage.add(layer.name, createLayer(p));
        });

        createMapTypes(layersConfig.mapTypes);
    }

    function createMapTypes(data) {
        data?.forEach((layer) => {
            ymaps.current.mapType.storage.add(
                layer.name,
                new ymaps.current.MapType(layer.name, layer.layers)
            );
        });
    }

    function createLayer(data) {
        return function () {

            let layer = new ymaps.current.Layer('', {
                projection: ymaps.current.projection.sphericalMercator,
                pane: data.pane || null,
                tileSize: data?.tileSize || [256, 256],
                tileTransparent: true,
                zIndex: data.zIndex || null
            });

            layer.getTileUrl = (tileNumber, zoom) => {
                if (zoom <= data?.minZoom || zoom > data?.maxZoom) return;

                return data?.tileUrl
                    .replace(/%x/ig, tileNumber[0])
                    .replace(/%y/ig, tileNumber[1] === -1 ? 0 : tileNumber[1])
                    .replace(/%z/ig, zoom);
            };

            layer.getCopyrights = () => {
                return ymaps.current.vow.resolve(data?.copyright || '');
            };

            layer.getZoomRange = () => {
                return ymaps.current.vow.resolve([data?.minZoom, data.maxZoom]);
            };

            return layer;
        };
    }

    return null;
}
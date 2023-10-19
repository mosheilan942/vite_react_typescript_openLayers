import React, { useEffect, useRef, useState } from 'react'


//ol imports
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import Feature, { FeatureLike } from "ol/Feature";
import Point from "ol/geom/Point";
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js';
import { OSM, Vector as VectorSource } from "ol/source";
import { Icon, Style } from "ol/style";
import Pointer from "ol/interaction/Pointer";
import { Geometry, Polygon } from "ol/geom";
import { Coordinate, createStringXY } from "ol/coordinate";
import { ScaleLine, MousePosition, defaults as defaultControls } from 'ol/control.js';
import { MapBrowserEvent } from "ol";
import { useGeographic } from 'ol/proj';
import { Select, Translate, defaults as defaultInteractions } from 'ol/interaction.js';

// icons
import location from "../assets/location.svg";

//MUI imports
import Typography from '@mui/material/Typography';
import PlaceIcon from '@mui/icons-material/Place';
import { Box } from '@mui/material';

import uniqid from "uniqid";


// useGeographic()

const center = [3922233, 3733889]

const zoom = 10

const mousePositionControl = new MousePosition({
    coordinateFormat: createStringXY(4),
    projection: 'EPSG:3857',
    className: 'custom-mouse-position',
});

const scaleLineControl = new ScaleLine({
    units: 'metric',
    // className: 'scale-line'
});

const vectorlayer = new VectorLayer()

const source = new VectorSource({
    features: [new Feature(new Point(center))]
})

const style = new Style()

const map = new Map({
    layers: [],
    view: new View({
        center,
        zoom,
        minZoom: 0,
        maxZoom: 18,

    }),
    controls: defaultControls().extend([scaleLineControl, mousePositionControl])
})









function BasicMap() {
    const [basicMap, setBasicMap] = useState<Map>(map) // הוספתי אחרי השיעור, היות שאפשר להוסיף שכבת על רק אחרי שכבת בסיס
    const mapRef = useRef<HTMLDivElement>(null)
    const mousePositionRef = useRef<HTMLDivElement>(null)

    // רנדור שכבת בסיס
    useEffect(() => {

        map.addLayer(new TileLayer({
            source: new OSM()
        }));

        map.setTarget(mapRef.current!);

        mousePositionControl.setTarget(mousePositionRef.current!)

        // הכנסת שכבת בסיס לסטייט
        setBasicMap(map)
        return () => map.setTarget("")
    }, [])

    // רנדור שכבת על
    useEffect(() => {

        const img: Icon = new Icon({
            anchor: [0, 0],
            width: 50,
            height: 50,
            src: location
        })

        style.setImage(img);

        vectorlayer.setSource(source);

        vectorlayer.setStyle(style);

        basicMap.addLayer(vectorlayer)

        const pointer = new Pointer({
            handleMoveEvent: (event) => {
                const pixel = map.getEventPixel(event.originalEvent);
                const hit = map.forEachFeatureAtPixel(pixel, feature => feature);
                hit ? map.getTargetElement().style.cursor = "pointer" : map.getTargetElement().style.cursor = ''
            },
        });


        map.addInteraction(pointer);
        console.log("foo");


        // תנאי לרנדור שכבת על בכפוף לשינוי שכבת בסיס
        return () => {
            map.removeInteraction(pointer)
            map.removeLayer(vectorlayer)
        }
    }, [basicMap])

    // יצירת סמן על המפה בלחיצה

    useEffect(() => {

        const fun = (e: MapBrowserEvent<any>) => {
            const pixel = map.getEventPixel(e.originalEvent);
            const hit = map.forEachFeatureAtPixel(pixel, feature => feature);
            if (hit) {
                source.removeFeature(hit as Feature<Point>)
            } else {
                const feature = new Feature({
                    geometry: new Point(e.coordinate),
                    id: uniqid()
                })
                source.addFeatures([feature]);
            }
        }
        map.on("singleclick", fun)

        return () => {
            map.un("singleclick", fun)
        }
    }, [])











    return (
        <>
            {/* הורדתי width:"100vh" כדי שהמפה תוצג על כל המסך */}
            <Box sx={{ height: "90vh" }} ref={mapRef}>
                <Typography ref={mousePositionRef} variant="h4" gutterBottom>

                </Typography>
            </Box>
        </>
    )
}

export default BasicMap
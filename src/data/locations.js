// Add your location here
export const MyLocations = {
    xiamen: {
        lat: 24.4797,
        lng: -118.0818
    },
    vancouver: {
        lat: 49.2462,
        lng: 123.1162
    },
    toronto: {
        lat: 43.6510,
        lng: 79.3470
    },
    banff: {
        lat: 51.1802,
        lng: 115.5657
    },
    jinbian: {
        lat: 11.5621,
        lng: -104.8885
    },
    la: {
        lat: 34.0523,
        lng: 118.2436
    },
    stoon: {
        lat: 52.1332,
        lng: 106.6700
    },
    tokyo: {
        lat: 35.6528,
        lng: -139.8394
    },
    osaka: {
        lat: 34.6723,
        lng: -135.4848
    },
    cancun: {
        lat: 21.1619,
        lng: 86.8515
    },
    cannon_beach: {
        lat: 45.8918,
        lng: 123.9615
    }

}

// returns a point with lat & lng to a vertor3 point
export function geoToXYZ(earth_r, location) {
    const p = {
        lat: location.lat * Math.PI / 180,
        lng: location.lng * Math.PI / 180
    }

    return {
        x: earth_r * Math.cos(p.lng) * Math.cos(p.lat),
        y: earth_r * Math.sin(p.lat),
        z: earth_r * Math.sin(p.lng) * Math.cos(p.lat)
    }
}
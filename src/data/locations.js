// Add your location here
export const MyLocations = {
    xiamen: {
        lat: 24.4797,
        lng: -118.0818
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
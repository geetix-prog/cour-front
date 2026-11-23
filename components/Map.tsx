import {LeafletMap, TileLayer, Marker} from 'leaflet';

interface Props{
    lat: number,
    lng: number
}

export default function Map({lat, lng}: Props){
    const map = new LeafletMap('map').setView([51.505, -0.159], 15);

    new TileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    new Marker([lat, lng]).addTo(map)
        .bindPopup('A pretty CSS popup.<br>Easily customizable.')
        .openPopup();

    return (
        <div id="map" className='h-100'></div>
    )
}
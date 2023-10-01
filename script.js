const GetElementById = (id) => {
    try {
        return document.getElementById(id);
    } catch (error) {
        alert(error.message);
    }
};

const AddEventListener = (htmlItem, eventType, functionBody) => {
    switch (eventType) {
        case 'click':
            htmlItem.addEventListener(eventType, functionBody);
            break
        case 'input':
            htmlItem.addEventListener(eventType, functionBody);
            break;
    }
};

const CheckIsNullOrUndefinedOrEmpty = (value) => {
    return value === undefined || value === null || value === '';
};
//<------------Constants Start-------------------->//

const errorTag = GetElementById('errorTag');
const latInput = GetElementById('latInput');
const lngInput = GetElementById('lngInput');
const buttonTag = GetElementById('buttonTag');
const mapSection = GetElementById('mapSection');
const buttonLocationTag = GetElementById('buttonLocationTag');

let map = undefined;
let osm = undefined;
let otherLat = 0;
let otherLng = 0;

//<------------Constants End-------------------->//

const InitializeMap = (latLngObj) => {

    if (map) {
        map.remove();
    }

    map = L.map('mapSection').setView([latLngObj.lat, latLngObj.lng], 13);
    osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 22,
        attribution:
            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    });
    osm.addTo(map);
    let marker = new L.marker([latLngObj.lat, latLngObj.lng]);
    marker.addTo(map);
    let circle = new L.circle([latLngObj.lat, latLngObj.lng], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.3,
        radius: 500,
    });
    circle.addTo(map);
    marker
        .bindPopup(`Your location coordinates is: <br>Lat: ${latLngObj.lat}<br>Lng: ${latLngObj.lng}`)
        .openPopup();
    
    let popup = new L.popup()
        .setLatLng([22.424140180440386, 88.4039354324341])
        .setContent(
            `The location coordinates is: <br>Lat: ${22.424140180440386}<br>Lng: ${88.4039354324341}`
        );
    let anotherMarker = new L.marker([22.424140180440386, 88.4039354324341]).bindPopup(popup);
    anotherMarker.addTo(map);
    map.on('click', (e) => {
        let popup = L.popup();
        otherLat = e.latlng.lat;
        otherLng = e.latlng.lng;
        popup
            .setLatLng(e.latlng)
            .setContent(
                `The location coordinates is:  <br>Lat: ${otherLat}<br>Lng: ${otherLng}`
            )
            .openOn(map);
    })
};

const ShowMap = (latLngObj) => {
    InitializeMap(latLngObj)
};

const showGeoLocationError = (error) => {
    const errorTag = GetElementById('errorTag');
    switch (error.code) {
        case error.PERMISSION_DENIED:
            errorTag.innerHTML =
                'User denied the request for Geolocation.<br>Opening default values based on UK';
            break
        case error.POSITION_UNAVAILABLE:
            errorTag.innerHTML =
                'Location information is unavailable.<br>Opening default values based on UK';
            break
        case error.TIMEOUT:
            errorTag.innerHTML =
                'The request to get user location timed out.<br>Opening default values based on UK';
            break
        case error.UNKNOWN_ERROR:
            errorTag.innerHTML =
                'An unknown error occurred.<br>Opening default values based on UK';
            break
    }
};

const GetLocation = (callback) => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latValue = position.coords.latitude
                const lngValue = position.coords.longitude
                const latlngObj = { lat: latValue, lng: lngValue }
                callback(latlngObj);
            },
            (error) => {
                showGeoLocationError(error)
                const latlngObj = { lat: 51.505, lng: -0.09 };
                callback(latlngObj);
            }
        )
    } else {
        const errorTag = GetElementById('errorTag');
        errorTag.innerHTML = 'Geolocation is not supported by this browser.<br>Opening default values based on UK';
        const latlngObj = { lat: 51.505, lng: -0.09 };
        callback(latlngObj);
    }
};

const ProcessButtonAction = () => {
    errorTag.innerText = '';

    if (CheckIsNullOrUndefinedOrEmpty(latInput.value) && CheckIsNullOrUndefinedOrEmpty(lngInput.value)) {
        GetLocation((latlngObj) => {
            if (latlngObj !== null) {
                latInput.value = latlngObj.lat
                lngInput.value = latlngObj.lng
                ShowMap(latlngObj)
            }
        });
    } else {
        const latlngObj = { lat: latInput.value, lng: lngInput.value }
        mapSection.innerHTML = null;
        ShowMap(latlngObj);
    }
};

const ProcessGetLocationButtonAction = () => {
    errorTag.innerText = ''
     GetLocation((latlngObj) => {
         if (latlngObj !== null) {
             latInput.value = latlngObj.lat;
             lngInput.value = latlngObj.lng;
         ShowMap(latlngObj)
       }
     })
}

const Main = () => {
    AddEventListener(buttonTag, 'click', ProcessButtonAction);
    AddEventListener(buttonLocationTag, 'click', ProcessGetLocationButtonAction)
};

Main();

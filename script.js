'use strict';

class Crime {
  date = new Date();
  id = (Date.now() + '').slice(-10);

  constructor(coords, suspectName, otherinfo) {
    this.coords = coords;
    this.suspectName = suspectName;
    this.otherinfo = otherinfo;
  }
}

// const run1 = new Crime([39, -12], 12, 123)
// console.log(run1)

const form = document.querySelector('.form');
const tcrimes = document.querySelector('.crimes');
const noOfPople = document.querySelector('.form__input--no_of_people');
const suspectname = document.querySelector('.form__input--suspect_name');
const vehicleplate = document.querySelector('.form__input--vehicle_plate');
const other_info = document.querySelector('.form__input--other_info');

class App {
  #map; // Properties created using instance of the class. Accessible to all
  #mapEvent;
  #mapzoom = 8;

  #crimes = [];
  constructor() {
    this._getPosition(); // calling the get position function

    // below code is ue=sed to submit the form and display the marker
    form.addEventListener('submit', this._newCrime.bind(this));
    tcrimes.addEventListener('click', this._moveToPopup.bind(this));
  }

  _getPosition() {
    // We get the current location of the user using the folowing code. We use the getcurrentpos function where we give two parameters as functions one for success and one for error.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this), // we bind this with loadmap because we need this afterwards

        function () {
          alert('Current Position not accessed successfully.');
        }
      );
    }
  }

  _loadMap(position) {
    {
      const { latitude } = position.coords;
      const { longitude } = position.coords;
      // Above we declare the longitue and longitude variables.
      console.log(`https://www.google.com/maps/@${latitude},${longitude}`);

      const coords = [latitude, longitude];

      this.#map = L.map('map').setView(coords, this.#mapzoom);
      // L is basically the main function that leaflet gives us as an entry point. L is a namespace. It has various methods such as map, marker etc.
      L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        // Map that we use is basically made up of amall tiles and hence the above ref is used.
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(this.#map);

      // The below code is used to get the click events so that we will be able to pinpoint locations.
      // on is a function from leaflet lib not from js lib
      // This on method is basically our event listener instead of the standard event listener.
      // Why we are not using the start event listener? Because  we will have to add the listener on the entire map and hence we would not know where we have clicked.
      this.#map.on('click', this._showForm.bind(this));
    }
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove('hidden'); // Used to add a form to the sidebar
    suspectname.focus();
  }

  _newCrime(e) {
    e.preventDefault();

    const totalPeople = noOfPople.value;
    const nameSuspect = suspectname.value;
    const vehiclePlate = vehicleplate.value;
    const info = other_info.value;
    const { lat, lng } = this.#mapEvent.latlng; // This latlng is a object which we use from leaflet itself. It contains latitude and longitude of the clicked function.
    const crimeadd = new Crime([lat, lng], nameSuspect, info);
    this.#crimes.push(crimeadd);

    this._renderCrimeMarker(crimeadd);
    this._renderCrime(crimeadd);
    suspectname.value = vehicleplate.value = other_info.value = ''; // refreshing the form to default

    // After clicking on a place on the map we will add a marker of our own.
  }

  _renderCrimeMarker(crimeadd) {
    L.marker(crimeadd.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 150,
          closeOnClick: false,
          className: `${noOfPople}-popup`,
        })
      )
      .setPopupContent(`${crimeadd.suspectName}`) // Passing the form option here..... which means creating a popup of our owm.
      .openPopup();
  }

  _renderCrime(crimeadd) {
    const html = `
       <li class="crime" data-id="${crimeadd.id}">
          <h2 class="crime__suspect">${crimeadd.suspectName}</h2>
          <div class="crime__details">
            <span class="crime__info">${crimeadd.otherinfo}</span>
          </div>
       
       `;

    form.insertAdjacentHTML('afterend', html);
  }
}

const app = new App(); // Object od APP class

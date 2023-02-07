import React, { Component } from 'react'
import Place from './components/Place'
import Horario from './components/Horario'
import Rating from './components/Rating'
import Reviews from './components/Reviews'
import NearbyPlace from './components/NearbyPlace'

export default class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      places:'',
      placeRating:'',
      placeHorarios:'',
      placeReviews:'',
      placeLocation:'',
      nearbyPlaces:'',
      showAllNearbyPlaces: false,
    }
  }

  map = ''

  componentDidMount() {
    const googlePlaceAPILoad = setInterval(() => {
      if (window.google) {
        this.google = window.google;
        clearInterval(googlePlaceAPILoad);
        console.log('Load Place API');
        this.directionsService = new this.google.maps.DirectionsService();
        this.directionsRenderer = new this.google.maps.DirectionsRenderer();
        const mapCenter = { lat: -33.8666, lng: 151.1958 }
        const mapOptions = { center: mapCenter, zoom: 15 }
        this.map = new this.google.maps.Map(document.getElementById('map'), mapOptions)
        var request = {
          location: this.map.getCenter(),
          radius: '500',
          query: 'Google Sydney'
        };
        var service = new this.google.maps.places.PlacesService(this.map);
        service.textSearch(request, (results, status) => {
          if (status === this.google.maps.places.PlacesServiceStatus.OK) {
            var marker = new this.google.maps.Marker({
              map: this.map,
              place: {
                placeId: results[0].place_id,
                location: results[0].geometry.location
              }
            });
          }
        });
      };
    }, 100);
  }

  mostrarMapa = (mapCenter) => {
    var mapOptions = {zoom: 15, center: mapCenter}
    var map = new window.google.maps.Map(document.getElementById('map'), mapOptions);
    this.directionsRenderer.setMap(map);
    var marker = new window.google.maps.Marker({position: mapCenter, map: map});
  }

  cambioDestino = (destino) => {
    document.getElementById('destino').value = destino;
    document.getElementById('btnBuscar').click();
  }

  obtenerLugaresCercanos = (e) => {
    let request = {
      location: this.state.placeLocation,
      radius: '10000',
    };
    this.service = new this.google.maps.places.PlacesService(this.map);
    this.service.nearbySearch(request, this.callbackLugaresCercanos)
  }

  callbackLugaresCercanos = (results, status) => {
    if (status == this.google.maps.places.PlacesServiceStatus.OK) {
      console.log("callback received " + results.length + " results");
      window.sitiosCercanos = results
      if (results.length) {
        let lugaresCercanos = results.map((place, index) =>
          <NearbyPlace
            key={index} placeData={place}
            chooseDestination={this.cambioDestino}
          />
        )
        this.setState({
          nearbyPlaces: lugaresCercanos
        })
      }
    } else console.log("callback status=" + status);
  }

  manejoOnClick = (e) => {
    const request = {
      query: document.getElementById('destino').value,
      fields: ['photos', 'formatted_address', 'name', 'place_id'],
    };
    this.service = new this.google.maps.places.PlacesService(this.map);
    this.service.findPlaceFromQuery(request, this.findPlaceResult);
  }

  findPlaceResult = (results, status) => {
    var placesTemp = []
    var placeId = ''
    if (status === 'OK') {
      results.map((place) => {
        var placePhotos = ['']
        const placeTemp = {
          id: place.place_id, name: place.name,
          address: place.formatted_address, photos: placePhotos
        }
        placeId = place.place_id;
        placesTemp.push(<Place placeData={placeTemp}/>);
      })
    }
    if (placesTemp.length > 0) this.findPlaceDetail(placeId);
    else {
      const placeTemp = {
        id: 'N/A', name: <div className='mt-5'><strong className='text-center'>
          No hay resultados</strong></div>,
        address: '', photos: ['']
      }
      placesTemp.push(<Place placeData={placeTemp}/>);
      this.setState({ places: placesTemp, showAllNearbyPlaces: false })
    }
  }

  findPlaceDetail = (placeIdFound) => {
    var request = {
      placeId: placeIdFound,
      fields: ['address_component', 'adr_address', 'alt_id', 'formatted_address', 'opening_hours',
       'icon', 'id', 'name', 'permanently_closed', 'photo', 'place_id', 'plus_code', 'scope', 
       'types', 'url', 'utc_offset', 'vicinity', 'geometry', 'rating', 'reviews', 'reference']
    };
    this.service.getDetails(request, this.foundPlaceDatail);
  }

  foundPlaceDatail = (place, status) => {
    if (status === 'OK') {
      window.lugar = place
      var placePhotos=['']
      if (place.photos) {
        place.photos.map((placePhoto, index) => {
          placePhotos[index] = placePhoto.getUrl({'maxWidth': 160, 'maxHeight': 120})
          if (index === 2) return;
        })
      }
      const placeTemp = {
        id: place.place_id, name: place.name,
        address: place.formatted_address, photos: placePhotos
      }
      const placesTemp = <Place placeData={placeTemp}/>
      const placeHorarios = <Horario horarios={place.opening_hours}/>
      const reviews = <Reviews placeReviews={place.reviews} />
      var rating=''
      if (place.rating){
        rating = <Rating placeRating={place.rating}/>
      }
      else{
        rating =
          <div key={1} className='row my-2' >
            <strong>El sitio encontrado no posee Rating</strong>
          </div>;
      }
      console.log(
        'id place: ' + place.place_id + '\n',
        'address_component: '+ place.address_component + '\n',
        'adr_address: '+ place.adr_address + '\n',
        'geometry: '+ place.geometry + '\n',
        'icon: '+ place.icon + '\n',
        'rating: '+ place.rating + '\n',
        'types: '+ place.type + '\n',
        'url: '+ place.url + '\n',
        'vicinity' + place.vicinity + '\n',
        'reference' + place.reference + '\n',
      )
      this.setState({
        places: placesTemp,
        placeRating: rating,
        placeReviews: reviews,
        placeHorarios: placeHorarios,
        nearbyPlaces: [],
        placeLocation: place.geometry.location,
        showAllNearbyPlaces: false,
      })
      this.mostrarMapa(place.geometry.location);
    }
  }

  obtenerRuta = (e) => {
    var start = document.getElementById('origen').value;
    var end = document.getElementById('destino').value;
    var travelMode = document.getElementById('mode').value;
    var request = {
      origin: start,
      destination: end,
      travelMode: travelMode
    };
    var that = this;
    this.directionsService.route(request, function (result, status) {
      if (status == 'OK') {
        that.directionsRenderer.setDirections(result);
      }
    });
  }

  render() {
    return (
    <div className="App">
      <div className="container bg-dark text-white text-center"><h2>Paseando ando</h2></div>
      <div className='container bg-light border rounded p-3 my-3' style={{width:'75%'}}>
        <div className='row'>
          <div className='col-4'></div>
          <div className='col-4 text-center'>
            <label><strong>Indica el lugar</strong></label>
          </div>
          <div className='col-4'></div>
        </div>
        <div className='row'>
          <div className='col-4'></div>
          <div className='col-4 py-2'><input id='destino' type='text' style={{width:'100%'}} /></div>
          <div className='col-4'></div>
        </div>
        <div className='row'>
          <div className='col-4'></div>
          <div className='col-4 text-center'>
            <div className='btn btn-primary text-center' id='btnBuscar' onClick={this.manejoOnClick}>Buscar Lugar</div>
          </div>
          <div className='col-4'></div>
        </div>
        {this.state.places}
        {this.state.placeHorarios}
        {this.state.placeRating}
        {this.state.placeReviews}
        {this.state.places &&
          <div className='row'>
            <div className="col-12">
              <button className="btn btn-primary text-center" onClick={this.obtenerLugaresCercanos}>Buscar lugares cercanos</button>
            </div>
          </div>
        }
        <div className="container my-2">
          {this.state.showAllNearbyPlaces ?
            this.state.nearbyPlaces :
            this.state.nearbyPlaces?.slice(0, 9)
          }
        </div>
        {this.state.nearbyPlaces &&
          <div className="container my-2">
            <div className="mb-3">
              <a href='#' onClick={(e) => {
                e.preventDefault();
                this.setState({ showAllNearbyPlaces: true });
              }}>
                Mostrar más lugares cercanos
              </a>
            </div>
            <div className="row">
              <div className="col">
                <input id='origen' className="form-control" type='text' placeholder="Origen" />
              </div>
              <div className="col">
                <select id="mode" className="form-control">
                  <option value="DRIVING">Conducción</option>
                  <option value="WALKING">Caminando</option>
                  <option value="BICYCLING">Bicicleta</option>
                  <option value="TRANSIT">Transito</option>
                </select>
              </div>
              <div className="col">
                <button className="btn btn-primary" onClick={this.obtenerRuta}>Ir al destino indicado</button>
              </div>
            </div>
          </div>
        }
        <div id='map' className='my-2' style={{ height: "500px" }}></div>
      </div>
    </div>
    )
  }
}

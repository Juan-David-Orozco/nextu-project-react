import React, { Component } from 'react'
import Rating from './Rating'

export default class NearbyPlace extends Component {
  render() {

    let photo = this.props.placeData.photos?.length &&
    (<img src={this.props.placeData.photos[0].getUrl()} className="card-img-top img-thumbnail" alt={this.props.placeData.name} />)

    let rating = this.props.placeData.rating &&
    (<Rating placeRating={this.props.placeData.rating}/>)

    return (
      <div className="row border rounded my-1 py-2 bg-dark text-white">
        <div className="col-sm-6 py-1">
          {photo}
        </div>
        <div className="col-sm-6 my-auto">
          <div className="row">
            <div className="col-md-12 ">
              { this.props.placeData.name }
            </div>
            <div className="col-md-12 ">
              {rating}
            </div>
          </div>
        </div>
        <div className="col my-1">
          <a
            href="#" className="btn btn-primary" style={{width:"100%"}}
            onClick={(e) => this.props.chooseDestination(this.props.placeData.name)}
          >Escoger como destino</a>
        </div>
      </div>
    )

  }
}

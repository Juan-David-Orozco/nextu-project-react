import React, { Component } from 'react'

export default class Place extends Component {
  render() {
    var cantPhotos = this.props.placeData.photos.length;
    if (cantPhotos > 6)
      cantPhotos = 6;
    else
      cantPhotos = 3;
    const colSize = 4
    var htmlPhotos=[];
    this.props.placeData.photos.map((photo, index) => {
      htmlPhotos.push(
        <div key={index} className={'col-'+colSize+' text-center'} >
          <img src={photo} alt={this.props.placeData.name} width='100%'/>
        </div>);
        if (index === (cantPhotos-1)) return
    })
    return (
      <div>
        <div className='row py-2'>
          <div className='col mx-auto text-center'>
            <i>{this.props.placeData.name}</i>
          </div>
        </div>
        <div className='row py-2'>
          {htmlPhotos.slice(0,3)}
        </div>
        <div className='row py-2'>
          {htmlPhotos.slice(3,6)}
        </div>
        <div className='row' >
          <div className='col-3'></div>
          <div className='col-6 text-center'>
            <b>{this.props.placeData.address}</b>
          </div>
          <div className='col-3'></div>
        </div>
      </div>
    )
  }
}

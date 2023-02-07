import React, { Component } from 'react'
import './Rating.css'

export default class Rating extends Component {
  render() {
    const maxStars = 5;
    const starPercentage = (this.props.placeRating / maxStars) * 100;
    const starPercentageRounded = Math.round(starPercentage);
    const StarStyles = () => {
      return {
        width: starPercentageRounded + "%"
      };
    };

    return (
      <div className='row mt-2 mb-1'>
        <div className='col-md-3 my-auto'><strong>Rating: </strong></div>
        <div className='col-md-1 my-auto'><strong>{this.props.placeRating}</strong></div>
        <div className='col-md-6'>
          <div className="stars-gray" >
            <div className="stars-yellow" style={StarStyles()}></div>
          </div>
        </div>
      </div>
    )
  }
}

import React, { Component } from 'react'

export default class Reviews extends Component {

  constructor(){
    super();
    this.state = { mostrarComentarios: false };
  }

  manejoOnClick = (e) => {
    e.preventDefault()
    if (e.target.id === 'btnComentarios') {
      this.setState((prevState) => {
        return { mostrarComentarios: !prevState.mostrarComentarios }
      })
    }
  }

  render() {
    var reviews
    if (this.props.placeReviews && this.props.placeReviews.length > 0){
      reviews = this.props.placeReviews.map((review,index) => {
        var comentario = review.text
        if (comentario == '') comentario = 'No existe comentario'
        return (
          <div key={index} className='card my-2'>
            <div className='card-header'><strong>{review.author_name}</strong></div>
            <div style={{ fontStyle: "italic", fontSize: "12px" }} className='card-body'>{comentario}</div>
          </div>
        )
      })
    }
    else {
      reviews =
        <div key={1} className='row my-2' >
          <strong>No hay comentarios</strong>
        </div>;
    }
    const btnName = this.state.mostrarComentarios ? 'Ocultar Comentarios' : 'Mostrar Comentarios';
    const mostrar = this.state.mostrarComentarios ? 'd-block' : 'd-none'
    return (
      <div className="container px-0">
        <div className='mb-3 '>
          <a className="btn btn-primary" href='#' id='btnComentarios' onClick={this.manejoOnClick}>{btnName}</a>
        </div>
        <div className={'container '+mostrar}>
          {reviews}
        </div>
      </div>
    )
  }

}

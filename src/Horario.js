import React, { Component } from 'react'

export default class Horario extends Component {

  constructor(){
    super();
    this.state = { mostrarHorario: false }
  }

  manejoOnClick = (e) => {
    e.preventDefault()
    if (e.target.id === 'horario'){
      this.setState((prevState) => {
        return { mostrarHorario: !prevState.mostrarHorario }
      })
    }
  }

  render() {
    var horarios = '';
    if (this.props.horarios) {
      const abierto = this.props.horarios.weekday_text.map((horario,index) => {
        return (
          <div key={index} className='card my-1'>
            <div className='card-body p-1' style={{fontSize:"12px"}}>
              {horario}
            </div>
          </div>
        )
      })
      horarios =
        <div className='row'>
          <div className='col-3'>
            <a id='horario' href="#" onClick={this.manejoOnClick}>Horario</a>
          </div>
          <div className={'col-7 '+(this.state.mostrarHorario ? 'd-block' : 'd-none')}>{abierto}</div>
        </div>
    }
    else {
      horarios =
        <div className='row'>
          <strong>Horario no disponible</strong>
        </div>;
    }

    return (<div className='container px-0 my-2' >{horarios}</div>)
  }

}

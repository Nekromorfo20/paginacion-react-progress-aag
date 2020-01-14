import React,{Fragment} from 'react'

const Paginacion = (props) => {
    return(
        <Fragment>
            <ul id="page-numbers" className="pagination justify-content-center">
                {props.renderPrevBtn}      {/* Desplegado de boton Prev */}
                {props.pageDecrementBtn}   {/* Desplegado de 3 puntos retroceso */}
                {props.renderPageNumbers}  {/* Desplegado de todas las papginas */}
                {props.pageIncrementBtn}   {/* Desplegado de 3 puntos siguientes */}
                {props.renderNextBtn}      {/* Desplegado de boton Next */}
            </ul>
      </Fragment>
    )
}

export default Paginacion
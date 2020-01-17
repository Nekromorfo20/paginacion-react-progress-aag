import React, {Fragment} from 'react'

const BarraBusqueda = (props) => {
    return(<Fragment>
            <h3>Informacion de la tabla:</h3>
            <hr className="mb-2" />
            <div className="row">
                <div className="col-9">
                    <div className="form-group row">
                        <div className="col-4">
                            <p className="text-muted h6">Buscar por:</p>
                            <select className="form-control" onChange={props.onChangeSelectSeachFor}>
                                <option value="">- Selecciona un tipo de dato -</option>
                                <option value="Name">Nombre</option>
                                <option value="Address">Direccion</option>
                                <option value="SalesRep">Reporte ventas</option>
                            </select>
                        </div>
                        <div className="col-7 col-offset-1">
                            <p className="text-muted h6">Ingresa el dato a buscar:</p>
                            <input type="text" id="textoBuscador" value={props.textoBuscador} className="form-control" placeholder="Ingresa un nombre" onChange={props.onChangeBarra} readOnly/>
                        </div>
                    </div>
                </div>
                <div className="col-3">
                    <p className="text-muted h6">Cantidad de resultados:</p>
                    <select className="form-control" onChange={props.onChangeSelectResults}>
                        <option value="30">30</option>
                        <option value="40">40</option>
                        <option value="50">50</option>
                    </select>
                </div>
          </div>
          </Fragment>)
}

export default BarraBusqueda
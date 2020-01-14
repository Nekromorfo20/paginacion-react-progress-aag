import React,{Fragment} from 'react'
import TablaItem from './TablaItem'

const Tabla = (props) => {
    return(
        <Fragment>
        <div className="row">
            <div className="col">
                <table className="table table-hover table-striped" id="resultado">
                    <tbody>
                    <tr className="bg-dark text-white">
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Direccion</th>
                        <th>Telefono</th>
                        <th>Reporte de ventas</th>
                    </tr>
                    <TablaItem
                      renderTodos={props.renderTodos}
                    />
                    </tbody>
              </table>
            </div>
        </div>
        </Fragment>
    )
}

export default Tabla
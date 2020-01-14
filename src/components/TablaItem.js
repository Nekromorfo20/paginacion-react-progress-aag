import React,{Fragment} from 'react'

const TablaItem = (props) => {
    return(
        <Fragment>
            {props.renderTodos}
        </Fragment>
    )
}

export default TablaItem
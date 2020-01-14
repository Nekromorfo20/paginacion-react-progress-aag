/* 
     ===== COMPONENTE DE RESPALDO PARA App.js ======
    Contienen toda la logica antes de los cambios realizados, donde la funcionalidad de la tabla y sus componentes funcionan
    correctamente, no modificar.
    ** Para utilizar este componente solo remplazar el contenido de App.js por el de este archivo
    ** Fecha de cambio: 10/01/2019 - autor: Alan Aguilar
*/

import React, {Component, Fragment} from 'react';
import CustomerService from './services/customer.service'
import 'bootstrap/dist/css/bootstrap.css'
import $ from 'jquery'

import BarraBusqueda from './components/BarraBusqueda'
import Tabla from './components/Tabla'
import Paginacion from './components/Paginacion'

class App extends Component{
/*  **********vvv   CODIGO FUNCIONAL, NO MODIFICAR   vvv***********  */
  constructor() {
    super()
    this.state = {
      todos: [],
      currentPage: 1,       /* Pagina desde donde se va a mostrar */
      todosPerPage: 30,     /* Cantidad de registros en la tabla */
      upperPageBound: 10,   /* Numero de botones en paginacion */
      lowerPageBound: 0,
      isPrevBtnActive: 'disabled',
      isNextBtnActive: '',
      pageBound: 10,        /* Cuantas paginas salta al hacer clic el los tres puntos */
      textoBuscador: ''
    }
    this.handleClick = this.handleClick.bind(this)
    this.btnDecrementClick = this.btnDecrementClick.bind(this)
    this.btnIncrementClick = this.btnIncrementClick.bind(this)
    this.btnNextClick = this.btnNextClick.bind(this)
    this.btnPrevClick = this.btnPrevClick.bind(this)
    this.setPrevAndNextBtnClass = this.setPrevAndNextBtnClass.bind(this)
  }

    async componentDidMount(){
    let customerService = new CustomerService()
    let customers = await customerService.getCustomers()
    if(!customers || customers === undefined){
      this.setState({
        customers: null
      })
      console.log('No se encontraron registros')
    } else {
      this.setState({
        todos: customers
        })
      }
    }

  componentDidUpdate() {
        $("ul li.active").removeClass('active')
        $('ul li#'+this.state.currentPage).addClass('active')
  }

  handleClick(event) {
    let listid = Number(event.target.id)
    this.setState({
      currentPage: listid
    })
    $("ul li.active").removeClass('active')
    $('ul li#'+listid).addClass('active')
    this.setPrevAndNextBtnClass(listid)
  }

  handleChange(event){
    this.setState({
      textoBuscador: event.target.value
    })

  }

  setPrevAndNextBtnClass(listid) {
    let totalPage = Math.ceil(this.state.todos.length / this.state.todosPerPage);
    this.setState({isNextBtnActive: 'disabled'})
    this.setState({isPrevBtnActive: 'disabled'})
    if(totalPage === listid && totalPage > 1){
        this.setState({isPrevBtnActive: ''})
    }
    else if(listid === 1 && totalPage > 1){
        this.setState({isNextBtnActive: ''})
    }
    else if(totalPage > 1){
        this.setState({isNextBtnActive: ''})
        this.setState({isPrevBtnActive: ''})
    }
  }

  btnIncrementClick() {
      this.setState({upperPageBound: this.state.upperPageBound + this.state.pageBound})
      this.setState({lowerPageBound: this.state.lowerPageBound + this.state.pageBound})
      let listid = this.state.upperPageBound + 1
      this.setState({ currentPage: listid})
      this.setPrevAndNextBtnClass(listid)
  }

  btnDecrementClick() {
    this.setState({upperPageBound: this.state.upperPageBound - this.state.pageBound})
    this.setState({lowerPageBound: this.state.lowerPageBound - this.state.pageBound})
    let listid = this.state.upperPageBound - this.state.pageBound
    this.setState({ currentPage: listid})
    this.setPrevAndNextBtnClass(listid)
  }

btnPrevClick() {
    if((this.state.currentPage -1)%this.state.pageBound === 0 ){
        this.setState({upperPageBound: this.state.upperPageBound - this.state.pageBound})
        this.setState({lowerPageBound: this.state.lowerPageBound - this.state.pageBound})
    }
    let listid = this.state.currentPage - 1
    this.setState({ currentPage : listid})
    this.setPrevAndNextBtnClass(listid)
  }

btnNextClick() {
    if((this.state.currentPage +1) > this.state.upperPageBound ){
        this.setState({upperPageBound: this.state.upperPageBound + this.state.pageBound})
        this.setState({lowerPageBound: this.state.lowerPageBound + this.state.pageBound})
    }
    let listid = this.state.currentPage + 1
    this.setState({ currentPage : listid})
    this.setPrevAndNextBtnClass(listid)
  }
  
  render() {
      const { todos, currentPage, todosPerPage,upperPageBound,lowerPageBound,isPrevBtnActive,isNextBtnActive } = this.state
      // Logic for displaying current todos
      const indexOfLastTodo = currentPage * todosPerPage
      const indexOfFirstTodo = indexOfLastTodo - todosPerPage
      const currentTodos = todos.slice(indexOfFirstTodo, indexOfLastTodo)
  
      const renderTodos = currentTodos.map((todo, index) => {
        return (
          <tr key={index}>
              <td>{todo.CustNum}</td>
              <td>{todo.Name}</td>
              <td>{todo.Address}</td>
              <td>{todo.Phone}</td>
          </tr>)
      })

    // Logic for displaying page numbers
      const pageNumbers = []
      for (let i = 1; i <= Math.ceil(todos.length / todosPerPage); i++) {
        pageNumbers.push(i)
      }
  
      const renderPageNumbers = pageNumbers.map(number => {
          if(number === 1 && currentPage === 1){
              return(
                  <li key={number} className='page-item active' id={number}><span className="page-link" id={number} onClick={this.handleClick}>{number}</span></li>
              )
          }
          else if((number < upperPageBound + 1) && number > lowerPageBound){
              return(
                  <li key={number} className='page-item' id={number}><span className="page-link" id={number} onClick={this.handleClick}>{number}</span></li>
              )
          }
      })
      let pageIncrementBtn = null
      if(pageNumbers.length > upperPageBound){
          pageIncrementBtn = <li className='page-item'><span className="page-link" onClick={this.btnIncrementClick}> &hellip; </span></li>
      }
      let pageDecrementBtn = null
      if(lowerPageBound >= 1){
          pageDecrementBtn = <li className='page-item'><span className="page-link" onClick={this.btnDecrementClick}> &hellip; </span></li>
      }
      let renderPrevBtn = null
      if(isPrevBtnActive === 'disabled') {
          renderPrevBtn = <li className="page-item disabled"><span id="btnPrev" className="page-link"> Prev </span></li>
      }
      else{
          renderPrevBtn = <li className={isPrevBtnActive}><span className="page-link" id="btnPrev" onClick={this.btnPrevClick}> Prev </span></li>
      }
      let renderNextBtn = null
      if(isNextBtnActive === 'disabled') {
          renderNextBtn = <li className="page-item disabled"><span id="btnNext" className="page-link"> Next </span></li>
      }
      else{
          renderNextBtn = <li className={isNextBtnActive}><span className="page-link" id="btnNext" onClick={this.btnNextClick}> Next </span></li>
      }

    return (
      <Fragment>
        <div className="container mt-3">
          <BarraBusqueda 
              onChange={this.handleChange.bind(this)}
          />
          <Tabla
            renderTodos={renderTodos} //se muestran 30 registros
          />
          <Paginacion
            renderPrevBtn={renderPrevBtn}
            pageDecrementBtn={pageDecrementBtn}
            renderPageNumbers={renderPageNumbers}
            pageIncrementBtn={pageIncrementBtn}
            renderNextBtn={renderNextBtn}
          />
        </div>
      </Fragment>
    )
  }
}

export default App

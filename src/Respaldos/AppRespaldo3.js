/*
    ===== COMPONENTE DE RESPALDO PARA App.js ======
    - Se modifico la logica de recorrido de la tabla para mostrar los datos filtrados.
    - Se modifico el archivo de BarraBusqueda para tomar datos en el state.
    ** Para utilizar este componente solo remplazar el contenido de App.js por el de este archivo
    ** Fecha de cambio: 14/01/2019 - autor: Alan Aguilar
*/

import React, { Component, Fragment } from 'react';
import CustomerService from './services/customer.service'
import 'bootstrap/dist/css/bootstrap.css'
// import $ from 'jquery'

import BarraBusqueda from './components/BarraBusqueda'
import Tabla from './components/Tabla'
import Paginacion from './components/Paginacion'

class App extends Component {
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
      textoBuscador: '',
      todosFiltrado: '',
      buscarPor: ''
    }

    this.handleClick = this.handleClick.bind(this)
    this.btnDecrementClick = this.btnDecrementClick.bind(this)
    this.btnIncrementClick = this.btnIncrementClick.bind(this)
    this.btnNextClick = this.btnNextClick.bind(this)
    this.btnPrevClick = this.btnPrevClick.bind(this)
    this.setPrevAndNextBtnClass = this.setPrevAndNextBtnClass.bind(this)
  }

  async componentDidMount() {
    let customerService = new CustomerService()
    let customers = await customerService.getCustomers()
    if (!customers || customers === undefined) {
      this.setState({
        todos: null
      })
      console.log('No se encontraron registros')
    } else {
      this.setState({
        todos: customers
      })
    }
  }

  componentDidUpdate() {
    /* INICIO - SE CAMBIO ESTA LINEA DE CODIGO DE JQUERY A ES6 13-01-2020 */
    // $("ul li.active").removeClass('active')     /* Funcion original de Jquery */
    let lista = document.querySelector("ul li .active")
    if(lista){
      lista.removeClass('active')
    }
    
    // $('ul li#' + this.state.currentPage).addClass('active')    /* Funcion original de Jquery */
    let dato = this.state.currentPage
    let activo = document.getElementById(`${dato}`)
    if(activo){
      activo.classList.add('active')
    }
    /* FIN - SE CAMBIO ESTA LINEA DE CODIGO DE JQUERY A ES6 13-01-2020 */
  }

  handleClick = (event) => {
    let listid = Number(event.target.id)
    this.setState({
      currentPage: listid
    })
    /* INICIO - SE CAMBIO ESTA LINEA DE CODIGO DE JQUERY A ES6 13-01-2020 */
    // $("ul li.active").removeClass('active') /* Funcion original de Jquery */
    let lista = document.getElementById(`${this.state.currentPage}`)
    if(lista){
      lista.classList.remove('active')
    }

    // $('ul li#' + listid).addClass('active') /* Funcion original de Jquery */
    let activo = document.getElementById(`${listid}`)
    if(activo){
      activo.classList.add('active')
    }
    /* FIN - SE CAMBIO ESTA LINEA DE CODIGO DE JQUERY A ES6 13-01-2020 */
    this.setPrevAndNextBtnClass(listid)
  }

  handleChange = (event) => {
    let newText = event.target.value
    let datosFiltrados = this.filtrar(this.state.todos, newText.toLowerCase())

    this.setState({
      textoBuscador: newText,
      todosFiltrado: datosFiltrados
    }, () => {
      this.setState({
        pageNumbers: this.cargarPageNumbers()
      })
    })
  }

  filtrar(elements, pattern) {
    return elements.filter(element => {
      if (element.Name.toLowerCase().match(pattern)) return true;
      return false
    })
  }

  handleSelectResults = (event) => {
    let cantidad = event.target.value
    this.setState({
      todosPerPage: cantidad
    })
  }

  handleSelectSeachFor = (event) => {
    let buscadoPor = event.target.value
    console.log(buscadoPor)
  }

  setPrevAndNextBtnClass = (listid) => {
    let totalPage = Math.ceil(this.state.todos.length / this.state.todosPerPage);
    this.setState({ isNextBtnActive: 'disabled' })
    this.setState({ isPrevBtnActive: 'disabled' })
    if (totalPage === listid && totalPage > 1) {
      this.setState({ isPrevBtnActive: '' })
    }
    else if (listid === 1 && totalPage > 1) {
      this.setState({ isNextBtnActive: '' })
    }
    else if (totalPage > 1) {
      this.setState({ isNextBtnActive: '' })
      this.setState({ isPrevBtnActive: '' })
    }
  }

  btnIncrementClick = () => {
    this.setState({ upperPageBound: this.state.upperPageBound + this.state.pageBound })
    this.setState({ lowerPageBound: this.state.lowerPageBound + this.state.pageBound })
    let listid = this.state.upperPageBound + 1
    this.setState({ currentPage: listid })
    this.setPrevAndNextBtnClass(listid)
  }

  btnDecrementClick = () => {
    this.setState({ upperPageBound: this.state.upperPageBound - this.state.pageBound })
    this.setState({ lowerPageBound: this.state.lowerPageBound - this.state.pageBound })
    let listid = this.state.upperPageBound - this.state.pageBound
    this.setState({ currentPage: listid })
    this.setPrevAndNextBtnClass(listid)
  }

  btnPrevClick = () => {
    if ((this.state.currentPage - 1) % this.state.pageBound === 0) {
      this.setState({ upperPageBound: this.state.upperPageBound - this.state.pageBound })
      this.setState({ lowerPageBound: this.state.lowerPageBound - this.state.pageBound })
    }
    let listid = this.state.currentPage - 1
    this.setState({ currentPage: listid })
    this.setPrevAndNextBtnClass(listid)

    /* INICIO - SE AGREGO ESTA LINEA DE CODIGO 13-01-2020 */
    let dato = document.getElementById(`${this.state.currentPage}`)
    if(dato.classList === 'page-item'){
      dato.classList = 'page-item active'
    } else {
      dato.classList = 'page-item'
    }
    /* FIN - SE AGREGO ESTA LINEA DE CODIGO 13-01-2020 */

  }

  btnNextClick = () => {
    if ((this.state.currentPage + 1) > this.state.upperPageBound) {
      this.setState({ upperPageBound: this.state.upperPageBound + this.state.pageBound })
      this.setState({ lowerPageBound: this.state.lowerPageBound + this.state.pageBound })
    }
    let listid = this.state.currentPage + 1
    this.setState({ currentPage: listid })
    this.setPrevAndNextBtnClass(listid)

    /* INICIO - SE AGREGO ESTA LINEA DE CODIGO 13-01-2020 */
    let dato = document.getElementById(`${this.state.currentPage}`)
    if(dato.classList === 'page-item'){
      dato.classList = 'page-item active'
    } else {
      dato.classList = 'page-item'
    }
    /* FIN - SE AGREGO ESTA LINEA DE CODIGO 13-01-2020 */
  }

  cargarRenderTodos() {
    const { todosFiltrado, currentPage, todosPerPage, todos } = this.state
    // Logica para el desplegado de todos y todosPerPage
    let arregloDatos = todosFiltrado ? todosFiltrado : todos
    const indexOfLastTodo = currentPage * todosPerPage
    const indexOfFirstTodo = indexOfLastTodo - todosPerPage
    const currentTodos = arregloDatos.slice(indexOfFirstTodo, indexOfLastTodo)

    let renderTodos = []
    currentTodos.forEach((todo, index) => {
      renderTodos.push(
        <tr key={index}>
          <td>{todo.CustNum}</td>
          <td>{todo.Name}</td>
          <td>{todo.Address}</td>
          <td>{todo.Phone}</td>
          <td>{todo.SalesRep}</td>
        </tr>)
    })
    return renderTodos
  }

  cargarPageNumbers() {
    let { todos, todosPerPage, todosFiltrado } = this.state
    const pageNumbers = []
    let finalTodos = todosFiltrado.length > 0 ? todosFiltrado : todos
    for (let i = 1; i <= Math.ceil(finalTodos.length / todosPerPage); i++) {
      pageNumbers.push(i)
    }
    return pageNumbers
  }

  render() {
    const { currentPage, upperPageBound, lowerPageBound, isPrevBtnActive, isNextBtnActive } = this.state
    let renderTodos = this.cargarRenderTodos() /* Cargar Tabla */
    let pageNumbers = this.cargarPageNumbers() /* Cargar Total de paginas */

    // Logica para intercalar activa y default en clases de botones
    const renderPageNumbers = pageNumbers.map(number => {
      if (number === 1 && currentPage === 1) {
        return (
          <li key={number} className='page-item active' id={number}><span className="page-link" id={number} onClick={this.handleClick}>{number}</span></li>
        )
      }
      else if ((number < upperPageBound + 1) && number > lowerPageBound) {
        return (
          <li key={number} className='page-item' id={number}><span className="page-link" id={number} onClick={this.handleClick}>{number}</span></li>
        )
      }
    })

    // Casos donde el boton sea disable
    let pageIncrementBtn = null
    if (pageNumbers.length > upperPageBound) {
      pageIncrementBtn = <li className='page-item'><span className="page-link" onClick={this.btnIncrementClick}> &hellip; </span></li>
    }
    let pageDecrementBtn = null
    if (lowerPageBound >= 1) {
      pageDecrementBtn = <li className='page-item'><span className="page-link" onClick={this.btnDecrementClick}> &hellip; </span></li>
    }
    let renderPrevBtn = null
    if (isPrevBtnActive === 'disabled') {
      renderPrevBtn = <li className="page-item disabled"><span id="btnPrev" className="page-link"> Prev </span></li>
    }
    else {
      renderPrevBtn = <li className={isPrevBtnActive}><span className="page-link" id="btnPrev" onClick={this.btnPrevClick}> Prev </span></li>
    }
    let renderNextBtn = null  
    if (isNextBtnActive === 'disabled') {
      renderNextBtn = <li className="page-item disabled"><span id="btnNext" className="page-link"> Next </span></li>
    }
    else {
      renderNextBtn = <li className={isNextBtnActive}><span className="page-link" id="btnNext" onClick={this.btnNextClick}> Next </span></li>
    }

    return (
      <Fragment>
        <div className="container mt-3">
          <BarraBusqueda
            onChangeBarra={this.handleChange}
            onChangeSelectResults={this.handleSelectResults}
            onChangeSelectSeachFor={this.handleSelectSeachFor}
            textoBuscador={this.state.textoBuscador}
          />
          <Tabla
            renderTodos={renderTodos}
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

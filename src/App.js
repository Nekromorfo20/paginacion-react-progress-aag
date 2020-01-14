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
      paginaActual: 1,             /* Pagina desde donde se va a mostrar */
      todosPorPagina: 30,          /* Cantidad de registros en la tabla */
      botonesPorPaginacion: 10,    /* Numero de botones en paginacion */
      botonInicialPorPagina: 0,
      esElBotonAnterior: 'disabled',
      esElBotonSiguiente: '',
      paginasSaltadas: 10,        /* Cuantas paginas salta al hacer clic el los tres puntos */
      textoBuscador: '',
      todosFiltrado: '',
      buscarPor: ''
    }

    this.handleClick = this.handleClick.bind(this)
    this.btnClickDecrementar = this.btnClickDecrementar.bind(this)
    this.btnClickIncrementar = this.btnClickIncrementar.bind(this)
    this.btnClickSiguiente = this.btnClickSiguiente.bind(this)
    this.btnClickAnterior = this.btnClickAnterior.bind(this)
    this.establecerClaseBtn = this.establecerClaseBtn.bind(this)
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
    // $("ul li.active").removeClass('active')     /* Funcion original de Jquery */
    let lista = document.getElementById(`${this.state.paginaActual}`)
    if(lista){
      lista.classList.remove('active')
    }
    // $('ul li#' + this.state.currentPage).addClass('active')    /* Funcion original de Jquery */
    let activo = document.getElementById(`${this.state.paginaActual}`)
    if(activo){
      activo.classList.add('active')
    }
  }

  handleClick = (event) => {
    let listid = Number(event.target.id)
    this.setState({
      paginaActual: listid
    })
    // $("ul li.active").removeClass('active') /* Funcion original de Jquery */
    let lista = document.getElementById(`${this.state.paginaActual}`)
    if(lista){
      lista.classList.remove('active')
    }
    // $('ul li#' + listid).addClass('active') /* Funcion original de Jquery */
    let activo = document.getElementById(`${listid}`)
    if(activo){
      activo.classList.add('active')
    }
    this.establecerClaseBtn(listid)
  }

  handleChange = (event) => {
    let { buscarPor, todos } = this.state
    let textoNuevo = event.target.value
    let datosFiltrados = this.filtrar(buscarPor, todos, textoNuevo.toLowerCase())
    this.setState({
      todosFiltrado: todos
    }, () => {
      this.setState({
        textoBuscador: textoNuevo,
        todosFiltrado: datosFiltrados
      }, () => {
        this.setState({
          pageNumbers: this.cargarPageNumbers()
        })
      })
    })
  }

  //Funcion de filtrado
  filtrar(tipo, elementos, texto) {
    switch(tipo){
      case 'Name':
        return elementos.filter(element => {
          if (element.Name.toLowerCase().match(texto)) return true;
          return false
        })
      case 'Address':
        return elementos.filter(element => {
          if (element.Address.toLowerCase().match(texto)) return true;
          return false
        })
      case 'SalesRep':
        return elementos.filter(element => {
          if (element.SalesRep.toLowerCase().match(texto)) return true;
          return false
        })
        default:
          console.log('No hay consulta')
    }
  }

  handleSelectResults = (event) => {
    let cantidad = event.target.value
    this.setState({
      todosPorPagina: cantidad
    })
  }

  handleSelectSeachFor = (event) => {
    let buscarPor = event.target.value
    let barraBusqueda = document.querySelector('#textoBuscador')
    this.setState({
      buscarPor: buscarPor
    }, () => {
      if(this.state.buscarPor !== ''){
        barraBusqueda.readOnly = false
      } else {
        barraBusqueda.readOnly = true
      }
    })
  }

  establecerClaseBtn = (listid) => {
    let totalPage = Math.ceil(this.state.todos.length / this.state.todosPorPagina);
    this.setState({ esElBotonSiguiente: 'disabled' })
    this.setState({ esElBotonAnterior: 'disabled' })
    if (totalPage === listid && totalPage > 1) {
      this.setState({ esElBotonAnterior: '' })
    }
    else if (listid === 1 && totalPage > 1) {
      this.setState({ esElBotonSiguiente: '' })
    }
    else if (totalPage > 1) {
      this.setState({ esElBotonSiguiente: '' })
      this.setState({ esElBotonAnterior: '' })
    }
  }

  btnClickIncrementar = () => {
    this.setState({ botonesPorPaginacion: this.state.botonesPorPaginacion + this.state.paginasSaltadas })
    this.setState({ botonInicialPorPagina: this.state.botonInicialPorPagina + this.state.paginasSaltadas })
    let listid = this.state.botonesPorPaginacion + 1
    this.setState({ paginaActual: listid })
    this.establecerClaseBtn(listid)
  }

  btnClickDecrementar = () => {
    this.setState({ botonesPorPaginacion: this.state.botonesPorPaginacion - this.state.paginasSaltadas })
    this.setState({ botonInicialPorPagina: this.state.botonInicialPorPagina - this.state.paginasSaltadas })
    let listid = this.state.botonesPorPaginacion - this.state.paginasSaltadas
    this.setState({ paginaActual: listid })
    this.establecerClaseBtn(listid)
  }

  btnClickAnterior = () => {
    if ((this.state.paginaActual - 1) % this.state.paginasSaltadas === 0) {
      this.setState({ botonesPorPaginacion: this.state.botonesPorPaginacion - this.state.paginasSaltadas })
      this.setState({ botonInicialPorPagina: this.state.botonInicialPorPagina - this.state.paginasSaltadas })
    }
    let listid = this.state.paginaActual - 1
    this.setState({ paginaActual: listid })
    this.establecerClaseBtn(listid)

    //Validar si el boton contiene la clase active y remplazarlo
    let dato = document.getElementById(`${this.state.paginaActual}`)
    if(dato.classList === 'page-item'){
      dato.classList = 'page-item active'
    } else {
      dato.classList = 'page-item'
    }
  }

  btnClickSiguiente = () => {
    if ((this.state.paginaActual + 1) > this.state.botonesPorPaginacion) {
      this.setState({ botonesPorPaginacion: this.state.botonesPorPaginacion + this.state.paginasSaltadas })
      this.setState({ botonInicialPorPagina: this.state.botonInicialPorPagina + this.state.paginasSaltadas })
    }
    let listid = this.state.paginaActual + 1
    this.setState({ paginaActual: listid })
    this.establecerClaseBtn(listid)

    //Validar si el boton contiene la clase active y remplazarlo
    let dato = document.getElementById(`${this.state.paginaActual}`)
    if(dato.classList === 'page-item'){
      dato.classList = 'page-item active'
    } else {
      dato.classList = 'page-item'
    }
  }

  // Logica para el desplegado de todos y todosPorPagina
  cargarRenderTodos() {
    const { todosFiltrado, paginaActual, todosPorPagina, todos } = this.state
    let arregloDatos = todosFiltrado ? todosFiltrado : todos
    const indexOfLastTodo = paginaActual * todosPorPagina
    const indexOfFirstTodo = indexOfLastTodo - todosPorPagina
    const currentTodos = arregloDatos.slice(indexOfFirstTodo, indexOfLastTodo)

    let renderTodos = []
    currentTodos.forEach((dato, index) => {
      renderTodos.push(
        <tr key={index}>
          <td>{dato.CustNum}</td>
          <td>{dato.Name}</td>
          <td>{dato.Address}</td>
          <td>{dato.Phone}</td>
          <td>{dato.SalesRep}</td>
        </tr>)
    })
    return renderTodos
  }

  //Logica para el calculo de paginas totales en la tabla
  cargarPageNumbers() {
    let { todos, todosPorPagina, todosFiltrado } = this.state
    const pageNumbers = []
    let finalTodos = todosFiltrado.length > 0 ? todosFiltrado : todos
    for (let i = 1; i <= Math.ceil(finalTodos.length / todosPorPagina); i++) {
      pageNumbers.push(i)
    }
    return pageNumbers
  }

  render() {
    const { paginaActual, botonesPorPaginacion, botonInicialPorPagina, esElBotonAnterior, esElBotonSiguiente } = this.state
    let renderTodos = this.cargarRenderTodos() /* Cargar Tabla */
    let pageNumbers = this.cargarPageNumbers() /* Cargar Total de paginas */

    // Logica para intercalar activa y default en clases de botones
    const renderPageNumbers = pageNumbers.map(number => {
      if (number === 1 && paginaActual === 1) {
        return (
          <li key={number} className='page-item active' id={number}><span className="page-link" id={number} onClick={this.handleClick}>{number}</span></li>
        )
      }
      else if ((number < botonesPorPaginacion + 1) && number > botonInicialPorPagina) {
        return (
          <li key={number} className='page-item' id={number}><span className="page-link" id={number} onClick={this.handleClick}>{number}</span></li>
        )
      }
    })

    // Casos donde el boton sea disabled
    let pageIncrementBtn = null
    if (pageNumbers.length > botonesPorPaginacion) {
      pageIncrementBtn = <li className='page-item'><span className="page-link" onClick={this.btnClickIncrementar}> &hellip; </span></li>
    }
    let pageDecrementBtn = null
    if (botonInicialPorPagina >= 1) {
      pageDecrementBtn = <li className='page-item'><span className="page-link" onClick={this.btnClickDecrementar}> &hellip; </span></li>
    }
    let renderPrevBtn = null
    if (esElBotonAnterior === 'disabled') {
      renderPrevBtn = <li className="page-item disabled"><span id="btnPrev" className="page-link"> Ant </span></li>
    }
    else {
      renderPrevBtn = <li className={esElBotonAnterior}><span className="page-link" id="btnPrev" onClick={this.btnClickAnterior}> Ant </span></li>
    }
    let renderNextBtn = null  
    if (esElBotonSiguiente === 'disabled') {
      renderNextBtn = <li className="page-item disabled"><span id="btnNext" className="page-link"> Sig </span></li>
    }
    else {
      renderNextBtn = <li className={esElBotonSiguiente}><span className="page-link" id="btnNext" onClick={this.btnClickSiguiente}> Sig </span></li>
    }

    //Depleplegado en pantalla mediante components
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

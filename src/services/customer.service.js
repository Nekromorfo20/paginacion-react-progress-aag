import axios from 'axios'

class CustomerService {
    async getCustomers(){
        try{
            let respuesta = await axios.get('http://localhost:8822/proyectoCursoOctavi/rest/proyectoCursoOctaviService/getbeCustomer')
            console.log(respuesta.data.response.dsCustomer.dsCustomer.ttCustomer)
            return respuesta.data.response.dsCustomer.dsCustomer.ttCustomer
        } catch(error){
            console.log(error)
            return undefined
        }
    }
}

export default CustomerService
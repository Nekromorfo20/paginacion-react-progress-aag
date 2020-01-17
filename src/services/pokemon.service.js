import axios from 'axios'

function obtenerPokemon(id){
    return new Promise(async(resolve, reject) => {
        const url = `https://pokeapi.co/api/v2/pokemon-form/${id}`
        let respuesta = await axios.get(url)
        if(!respuesta){
            reject('Ocurrio un error al obtener pokemons')
        } else {
            resolve(respuesta.data)
        }
    })
}
function llenarArreglo(mostrados) {
    let ids = []
    for(let i=1; i<=mostrados; i++){
        ids.push(i)
    }
    return ids
}

class PokemonService {
    async getPokemons(){
        try{
            const ids = llenarArreglo(300)  /* se pidieron los primeros 300 pokemons */
            let promesas = ids.map(id => obtenerPokemon(id))
            let pokemons = await Promise.all(promesas)
            console.log(pokemons)
            return pokemons
        } catch(error){
            console.log(error)
            return undefined
        }
    }
}

export default PokemonService
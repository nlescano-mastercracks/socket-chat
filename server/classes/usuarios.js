class Usuarios {

    constructor() {
        this.personas = [];
    }

    agregarPersona(id, nombre, sala) {
        let persona = {
            id,
            nombre,
            sala
        }
        this.personas.push(persona);
        return this.personas
    }
    getPersona(id) {
        let persona = this.personas.filter(per => {
            return per.id === id
        })[0]

        return persona;
    }
    getPersonas() {
        return this.personas
    }
    getPersonasPorSala(sala) {

        let personaEnSala = this.personas.filter(persona => {
            return persona.sala === sala
        })
        return personaEnSala;
    }
    borrarPersona(id) {
        let perBorrada = this.getPersona(id)
        this.personas.filter(per => {
            return per.id != id;
        })
        return perBorrada;
    }
}


module.exports = {
    Usuarios
}
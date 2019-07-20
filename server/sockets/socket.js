const { io } = require('../server');

const { Usuarios } = require('../classes/usuarios')
const { crearMensajes } = require('../utilidades/utilidades')
const usuario = new Usuarios()


io.on('connection', (client) => {
    client.on('entrarChat', (data, callback) => {
        if (!data.nombre || !data.sala) {
            return callback({
                error: true,
                mensaje: 'El nombre es necesario'
            })
        }
        client.join(data.sala)
        usuario.agregarPersona(client.id, data.nombre, data.sala)
        client.broadcast.to(data.sala).emit('listaPersona', usuario.getPersonasPorSala(data.sala))
        client.broadcast.to(data.sala).emit('crearMensajes', crearMensajes('Administrador', `${data.nombre} Entro`))

        callback(usuario.getPersonasPorSala(data.sala))
    });

    client.on('crearMensajes', (data, callback) => {

        console.log(data);
        let persona = usuario.getPersona(client.id)
        let mensaje = crearMensajes(persona.nombre, data.mensaje);
        client.broadcast.to(persona.sala).emit('crearMensajes', mensaje);
        callback(data)
    })

    client.on('disconnect', () => {
            let personaBorrada = usuario.borrarPersona(client.id);

            client.broadcast.to(personaBorrada.sala).emit('crearMensajes', crearMensajes('Administrador', `${personaBorrada.nombre} Salio`))
            client.broadcast.to(personaBorrada.sala).emit('listaPersona', usuario.getPersonasPorSala(personaBorrada.sala))
        })
        // Mensaje privados
    client.on('mensajePrivado', data => {
        let persona = usuario.getPersona(client.id)
        client.broadcast.to(data.para).emit('mensajePrivado', crearMensajes(persona.nombre, data.mensaje))

    })

});
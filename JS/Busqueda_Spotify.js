document.addEventListener("DOMContentLoaded", function() {
    // Obtener referencia al formulario de búsqueda
    const formBusqueda = document.querySelector('#formBusqueda'); // Cambia la selección

    // Agregar un event listener para el evento submit del formulario
    formBusqueda.addEventListener('submit', function(event) {
        // Prevenir el comportamiento por defecto del formulario (recargar la página)
        event.preventDefault();
        
        // Obtener el valor ingresado por el usuario en el campo de búsqueda
        const busqueda = document.querySelector('#inputBusqueda').value; // Cambia la selección
        
        // Realizar la búsqueda en la API de Spotify
        obtenerTokenDeSpotify()
            .then(token => cargarReproductorSpotify(busqueda, token))
            .catch(error => console.error('Error al obtener el token de acceso:', error));
    });

    // Función para obtener un token de acceso de Spotify utilizando OAuth 2.0
    function obtenerTokenDeSpotify() {
        const clientId = '7e98b5c889974ab49dea356f3f5d7997';
        const clientSecret = '97741782d19b4064af623c9c98350840';
        const tokenUrl = 'https://accounts.spotify.com/api/token';
        
        const body = 'grant_type=client_credentials';

        return fetch(tokenUrl, {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret),
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: body
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener el token de acceso');
            }
            return response.json();
        })
        .then(data => data.access_token);
    }

    // Función para cargar el reproductor de Spotify con la búsqueda especificada
    function cargarReproductorSpotify(busqueda, token) {
        // Realizar una solicitud GET a la API de Spotify para obtener los resultados de la búsqueda
        fetch(`https://api.spotify.com/v1/search?q=${busqueda}&type=track`, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al realizar la búsqueda');
            }
            return response.json();
        })
        .then(data => {
            // Verificar si se devolvieron resultados de la búsqueda
            if (data.tracks && data.tracks.items && data.tracks.items.length > 0) {
                // Obtener el primer resultado de la búsqueda
                const primeraCancion = data.tracks.items[0];
                
                // Obtener el ID de la canción
                const cancionId = primeraCancion.id;

                // Generar el código HTML para el reproductor de Spotify
                const reproductorHTML = `
                    <iframe src="https://open.spotify.com/embed/track/${cancionId}" width="800" height="880" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
                `;

                // Actualizar el contenido de la tercera card con el reproductor de Spotify
                const terceraCardBody = document.querySelector('#terceraCard .card-body');
                terceraCardBody.innerHTML = reproductorHTML;
            } else {
                console.log('No se encontraron resultados para la búsqueda.');
            }
        })
        .catch(error => console.error('Error:', error));
    }
});

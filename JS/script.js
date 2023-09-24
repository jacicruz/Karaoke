function mostrarOpciones() {
    const boton = document.getElementById('miBoton');
    const opciones = document.getElementById('opciones');
  
    // Oculta el botón
    boton.style.display = 'none';
    
    // Muestra las opciones
    opciones.classList.remove('oculto');
  }
  
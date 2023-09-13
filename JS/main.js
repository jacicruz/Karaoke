const audioElement = document.getElementById('audio');
const visualizador = document.getElementById('visualizador');
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioContext.createAnalyser();
const source = audioContext.createMediaElementSource(audioElement);

source.connect(analyser);
analyser.connect(audioContext.destination);

analyser.fftSize = 256;
const dataArray = new Uint8Array(analyser.frequencyBinCount);

function updateVisualization() {
  analyser.getByteFrequencyData(dataArray);

  // Calcula un valor de color basado en los datos de audio
  const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
  const hue = (average / 156) * 560; // Escala los valores a un rango de colores (0-360)

  // Convierte el valor de color en una cadena CSS hsl()
  const color = `hsl(${hue}, 100%, 50%)`;

  visualizador.style.backgroundColor = color;

  requestAnimationFrame(updateVisualization);
}

audioElement.addEventListener('play', () => {
  audioContext.resume().then(() => {
    updateVisualization();
  });
});

document.body.addEventListener('mousemove', (event) => {
    const { clientX, clientY } = event;
    const { innerWidth, innerHeight } = window;
    const centroX = innerWidth / 2;
    const centroY = innerHeight / 2;
  
    const distanciaX = clientX - centroX;
    const distanciaY = clientY - centroY;
  
    // Define un radio dentro del cual el movimiento no se activará
    const radioCentro = .8; // Ajusta el valor según tus preferencias
  
    if (Math.abs(distanciaX) < radioCentro && Math.abs(distanciaY) < radioCentro) {
      // El mouse está dentro del radio del centro, no aplicar movimiento
      document.body.style.backgroundPosition = 'center center';
    } else {
      const movimientoX = (distanciaX / centroX) * 1; // Ajusta la cantidad de movimiento aquí
      const movimientoY = (distanciaY / centroY) * 1; // Ajusta la cantidad de movimiento aquí
      document.body.style.backgroundPosition = `${movimientoX}px ${movimientoY}px`;
    }
  });
  
  document.body.addEventListener('mouseleave', () => {
    document.body.style.backgroundPosition = 'center center';
  });
  
  
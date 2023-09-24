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

  const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
  const hue = (average / 300) * 560;
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

  const radioCentro = .8;

  if (Math.abs(distanciaX) < radioCentro && Math.abs(distanciaY) < radioCentro) {
    document.body.style.backgroundPosition = 'center center';
  } else {
    const movimientoX = (distanciaX / centroX) * 1;
    const movimientoY = (distanciaY / centroY) * 1;
    document.body.style.backgroundPosition = `${movimientoX}px ${movimientoY}px`;
  }
});

document.body.addEventListener('mouseleave', () => {
  document.body.style.backgroundPosition = 'center center';
});

function cambiarCancion(source) {
  audioElement.src = source;
  audioElement.play();
}

const text = document.getElementById('text');

source.connect(analyser);
analyser.connect(audioContext.destination);

analyser.fftSize = 256;
const dataArray1 = new Uint8Array(analyser.frequencyBinCount);

function updateTextMovement() {
  analyser.getByteFrequencyData(dataArray1);
  
  // Calcula la amplitud promedio de los datos de audio
  const averageAmplitude = dataArray1.reduce((sum, value) => sum + value, 0) / dataArray1.length;
  
  // Ajusta la cantidad de movimiento del texto en función de la amplitud
  const movementAmount = averageAmplitude / 30; // Puedes ajustar este valor según tus preferencias
  
  // Aplica el movimiento al texto
  text.style.transform = `translateY(${movementAmount}px)`;

  requestAnimationFrame(updateTextMovement);
}

audio.addEventListener('play', () => {
  audioContext.resume().then(() => {
    analyser.connect(audioContext.destination);
    updateTextMovement();
  });
});
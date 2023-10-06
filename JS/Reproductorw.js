const audio = document.getElementById('audio');
const momentosDeCambio = [9,13,16,20,24,28,32,36,39,43,47,51,54,58,61,67,117,121,125,129,133,137,140,144,147,151,155,160,162,167,170,175,179,183,187,191]; 
const lineasLetra = [];
const letraLines = document.querySelectorAll('.letra p');
const video = document.getElementById('video-fondo');
const audioContext = new AudioContext();
const analyser = audioContext.createAnalyser();

const source = audioContext.createMediaElementSource(audio);
source.connect(analyser);
analyser.connect(audioContext.destination);

analyser.fftSize = 256;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');

audio.addEventListener('timeupdate', updateProgressBar);

// Cuando el usuario interactúa con la barra de progreso
progressBar.addEventListener('input', () => {
  const duration = audio.duration;
  const progressBarValue = parseFloat(progressBar.value);
  const currentTime = (progressBarValue / 100) * duration;
  
  // Actualiza el tiempo de reproducción del audio
  audio.currentTime = currentTime;
});

function updateProgressBar() {
  const duration = audio.duration;
  const currentTime = audio.currentTime;
  
  // Calcula el porcentaje de progreso
  const progressPercent = (currentTime / duration) * 100;

  // Actualiza el valor y el estilo del progreso
  progressBar.value = progressPercent;
  progressBar.style.background = `linear-gradient(to right, #ff4081 0%, #ff4081 ${progressPercent}%, #757575 ${progressPercent}%, #757575 100%)`;

  // Actualiza el texto de progreso
  progressText.innerText = `${formatTime(currentTime)} / ${formatTime(duration)}`;
}

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

analyser.getByteFrequencyData(dataArray);

audio.addEventListener('timeupdate', updateColor);

function updateColor() {
  analyser.getByteFrequencyData(dataArray);
  const average = getAverage(dataArray);
  const hue = map(average, 10, 150, 20, 550);
  
  // Aplicar el color a las líneas de la letra
  letraLines.forEach(line => {
    line.style.color = `hsl(${hue}, 100%, 55%)`;
  });
}

function getAverage(array) {
  let sum = 0;
  array.forEach(value => sum += value);
  return sum / array.length;
}

function map(value, inMin, inMax, outMin, outMax) {
  return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}


for (let i = 1; i <= 35; i++) {
  lineasLetra.push(document.getElementById('linea' + i));
}
function togglePlay() {
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
    video.play()
      .then(() => {
        console.log('Video iniciado correctamente');
      })
      .catch(error => {
        console.error('Error al iniciar el video:', error);
      });
  }
audio.addEventListener('timeupdate', actualizarLetra);

function actualizarLetra() {
    const tiempoActual = Math.floor(audio.currentTime);
  
    let lineaActual = -1;
  
    for (let i = 0; i < momentosDeCambio.length; i++) {
      if (tiempoActual >= momentosDeCambio[i]) {
        lineaActual = i;
      } else {
        break;  
      }
    }
  
    lineasLetra.forEach((linea) => {
      linea.style.fontWeight = 'normal';
      linea.style.display = 'none';
    });

    if (lineaActual !== -1) {
      lineasLetra[lineaActual].style.fontWeight = 'bold'; 
      lineasLetra[lineaActual].style.display = 'block';  
    }
  }
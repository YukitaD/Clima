//Elementos
const searchbox = document.querySelector(".search input");
const searchbtn = document.querySelector(".search button");
const iconoClima = document.querySelector(".icono-clima");
const cardClima = document.querySelector(".clima");
const mensajeError = document.querySelector(".error");
const displayHora = document.querySelector(".hora-local");
const tarjeta = document.querySelector(".card"); 

let intervalId; 

//Funcion para cambiar el estilo segund la hora
function actualizarEstiloNoche(fechaCiudad) {
    const hora = fechaCiudad.getHours();
    if (hora >= 18 || hora < 6) {
        displayHora.classList.add('noche');
        tarjeta.classList.add('noche-card');        
    } else {
        displayHora.classList.remove('noche');
        tarjeta.classList.remove('noche-card');    
    }
}

//Maneja el offset de horario
function iniciarRelojMundial(offsetSeconds) {
    if (intervalId) clearInterval(intervalId); 
    const calcularHora = () => {
        const now = new Date();
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        const horaCiudad = new Date(utc + (1000 * offsetSeconds));
        actualizarEstiloNoche(horaCiudad);
        const opciones = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
        displayHora.innerHTML = `Hora local: ${horaCiudad.toLocaleTimeString('es-ES', opciones)}`;
    };
    calcularHora(); 
    intervalId = setInterval(calcularHora, 1000); 
}


//Mostrar los datos de la ciudad
async function checkWeather(ciudad) {
    if (!ciudad) return; 

    try {
        const response = await fetch(`/api/clima?ciudad=${ciudad}`);
        const data = await response.json();

        if (response.status !== 200) {
            mensajeError.style.display = "block";
            cardClima.style.display = "none";
        } else {
            document.querySelector(".ciudad").innerHTML = data.name;
            document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
            document.querySelector(".humedad").innerHTML = data.main.humidity + "%";
            document.querySelector(".viento").innerHTML = data.wind.speed + " Km/h";

            actualizarIcono(data.weather[0].main);
            iniciarRelojMundial(data.timezone);

            cardClima.style.display = "block";
            mensajeError.style.display = "none";
        }
    } catch (error) {
        console.error("Error al obtener el clima:", error);
    }
}


//manejo de imagenes
function actualizarIcono(estado) {
    const rutas = {
        "Clouds": "imagenes/clouds.png",
        "Rain": "imagenes/rain.png",
        "Clear": "imagenes/clear.png",
        "Drizzle": "imagenes/drizzle.png",
        "Mist": "imagenes/mist.png"
    };
    iconoClima.src = rutas[estado] || "imagenes/clear.png";
}

searchbtn.addEventListener("click", () => checkWeather(searchbox.value));
searchbox.addEventListener("keypress", (e) => {
    if (e.key === "Enter") checkWeather(searchbox.value);
});
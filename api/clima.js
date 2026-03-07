//Funcion para manejar el apikey desde vercel
export default async function handler(request, response) {
    const { ciudad } = request.query;
    
    const apiKey = process.env.API_KEY; 


    //funcion para obtener la ciudad e ingresarla en el link junto a la apikey
    if (!ciudad) {
        return response.status(400).json({ error: "Ciudad es requerida" });
    }

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&units=metric&lang=es&appid=${apiKey}`;

    try {
        const res = await fetch(apiUrl);
        const data = await res.json();

        return response.status(res.status).json(data);
    } catch (error) {
        return response.status(500).json({ error: "Error en el servidor" });
    }
}
import axios from "axios";

const apiSave=()=>{

    const url="http://localhost:3000/readings";

    const getSave = async () => {
        try{
            const response = await axios.get(url);
            return response.data;
            } catch (error) {
                if (error.response) {
                    alert(`Error de la API (${error.response.status})`);
                } else if (error.request) {
                    alert("No se pudo conectar con la base de datos");
                } else {
                    alert("Ocurrió un error inesperado");
                }
                throw error;
            }
    }


    const saveReading = async (dataReading) => {
        const response = await axios.post(url, dataReading);
        return response.data;
}

    return{getSave, saveReading}
}

export default apiSave;
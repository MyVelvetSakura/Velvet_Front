import httpClient from "./httpClient";

const apiInterpretation = () => {
    const generate = async (question, pastCardId, presentCardId, futureCardId) => {
        const response = await httpClient.post("/interpretation", {
            question,
            pastCardId,
            presentCardId,
            futureCardId,
        });
        return response.data;
    };

    return { generate };
};

export default apiInterpretation;
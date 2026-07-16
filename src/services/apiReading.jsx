import httpClient from "./httpClient";

const apiReading = () => {
  const getByUserId = async (userId) => {
    const response = await httpClient.get("/readings", { params: { userId } });
    return response.data;
  };

  const createReading = async (dataReading) => {
    const response = await httpClient.post("/readings", dataReading);
    return response.data;
  };

  const editName = async (id, name) => {
    const response = await httpClient.patch(`/readings/${id}`, { name });
    return response.data;
  };

  const deleteReading = async (id) => {
    const response = await httpClient.delete(`/readings/${id}`);
    return response;
  };

  const deleteAllByUserId = async (userId) => {
    const response = await httpClient.delete("/readings", {
      params: { userId },
    });
    return response;
  };

  return {
    getByUserId,
    createReading,
    editName,
    deleteReading,
    deleteAllByUserId,
  };
};

export default apiReading;

import httpClient from "./httpClient";

const apiProgress = () => {
    const getProgress = async (accountId) => {
        const response = await httpClient.get(`/progress/${accountId}`);
        return response.data;
    };

    const getAchievements = async (accountId) => {
        const response = await httpClient.get(`/progress/${accountId}/achievements`);
        return response.data;
    };

    const spendForRetry = async (accountId) => {
        const response = await httpClient.post(`/progress/${accountId}/spend-retry`);
        return response.data; // boolean
    };

    return { getProgress, getAchievements, spendForRetry };
};

export default apiProgress;
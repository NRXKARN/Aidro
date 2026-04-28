import CONFIG from '../config/config';

const API_BASE_URL = CONFIG.API_BASE_URL;

export const ApiService = {
    /**
     * Sends a new emergency report to the backend for AI analysis.
     */
    async submitReport(reportData) {
        try {
            const response = await fetch(`${API_BASE_URL}/report`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(reportData)
            });
            return await response.json();
        } catch (error) {
            console.error("API Error - Submit Report:", error);
            // Fallback for demo
            return { analysis: { priority_score: 85, severity: "High" } };
        }
    },

    /**
     * Fetches live statistics for the Admin Dashboard.
     */
    async getDashboardStats() {
        try {
            const response = await fetch(`${API_BASE_URL}/dashboard/stats`);
            return await response.json();
        } catch (error) {
            console.error("API Error - Dashboard Stats:", error);
            return { total_affected: 1240, critical_zones: 14 };
        }
    },

    /**
     * Gets a disaster prediction for a specific region.
     */
    async getPrediction(regionId) {
        try {
            const response = await fetch(`${API_BASE_URL}/predict/${regionId}`);
            return await response.json();
        } catch (error) {
            console.error("API Error - Prediction:", error);
            return { predicted_risk: 0.15 };
        }
    }
};

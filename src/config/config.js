/**
 * Centralized Configuration for AIDRO Platform
 */

const isProd = import.meta.env.PROD;

export const CONFIG = {
    API_BASE_URL: import.meta.env.VITE_API_URL || "/api",
    
    // Feature Flags for mission-critical deployment
    FEATURES: {
        ENABLE_AI_ASSISTANT: true,
        ENABLE_OFFLINE_MODE: true,
        ENABLE_BATTERY_OPTIMIZATION: true,
        ENABLE_AUTO_SOS: true
    },
    
    // Deployment Metadata
    VERSION: "4.5.0",
    ENVIRONMENT: isProd ? "production" : "development",
    
    // Thresholds
    BATTERY_CRITICAL_LEVEL: 0.15,
    AUTO_SOS_COUNTDOWN: 15
};

export default CONFIG;

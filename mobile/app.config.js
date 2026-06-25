export default {
  "expo": {

    "extra": {
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_API_KEY: process.env.SUPABASE_API_KEY,
      FINNHUB_API_KEY: process.env.FINNHUB_API_KEY
    },

    "name": "my-expo-app",
    "slug": "my-expo-app",
    "version": "1.0.0",

    "web": {
      "favicon": "./assets/favicon.png"
    },

    "experiments": {
      "tsconfigPaths": true
    },

    "plugins": ["expo-router"],

    "orientation": "portrait",
    "icon": "./assets/icon.png",

    "userInterfaceStyle": "light",

    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      }
    }
  }
}
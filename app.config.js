const config = {
  plugins: [
    'expo-router',
    'expo-updates',
  ],
  expo: {
    name: "Lions' Den",
    slug: 'lions-den',
    scheme: 'lions-den',
    version: '1.0.0',
    owner: 'kiruse',
    orientation: 'portrait',
    icon: './assets/roar-logo.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/roar-logo.png',
      resizeMode: 'contain',
      backgroundColor: '#f3f410'
    },
    assetBundlePatterns: [
      '**/*'
    ],
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/roar-logo.png',
        backgroundColor: '#f3f410'
      },
    },
    extra: {
      eas: {
        projectId: '679adf60-9d57-4a8a-b216-4e4552059201',
      },
    },
  },
};

export default config;

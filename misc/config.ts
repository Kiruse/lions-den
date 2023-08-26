import * as Updates from 'expo-updates'

interface Config {
  cosmosLinkUri: string;
}

const cfg: Record<string, Config> = {
  development: {
    cosmosLinkUri: 'http://localhost:3000/',
  },
  preview: {
    cosmosLinkUri: 'https://cosmos-link.kiruse.dev/',
  },
  production: {
    cosmosLinkUri: 'https://cosmos-link.kiruse.dev/',
  },
}

// in production, remove any trailing version number from the channel name
export default cfg[Updates.channel?.replace(/\/v.*$/, '') || 'production'];

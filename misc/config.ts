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

export default cfg[Updates.channel || 'production'];

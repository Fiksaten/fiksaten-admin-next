import { client } from './openapi-client/client.gen';

client.setConfig({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
});

export { client };

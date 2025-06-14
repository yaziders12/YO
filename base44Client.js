import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "684daa939c33cc99d3c4e898", 
  requiresAuth: true // Ensure authentication is required for all operations
});

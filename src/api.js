/**
 * API functions for external service integration
 * 
 * Add your custom API functions here as needed for your widget.
 * This file provides a centralized location for all external API calls.
 */

// TODO: Add your custom API functions here
// Example:
/**
 * Fetch data from external API
 * @param {string} accessToken - OAuth access token
 * @param {string} orgId - Organization ID
 * @returns {Promise<Array>} Array of data items
 */
export const fetchCustomData = async (accessToken, orgId) => {
  const API_BASE_URL = 'https://your-api-endpoint.com/api';
  
  try {
    const response = await fetch(`${API_BASE_URL}/data`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Org-Id': orgId
      }
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }
    
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
};
// Typed API Client placeholder
export const api = {
  login: async (credentials: any) => {
    console.log('Login', credentials)
    return { token: 'sample-token' }
  },
  register: async (userData: any) => {
    console.log('Register', userData)
    return { success: true }
  },
  getProfile: async () => {
    return { name: 'Citizen Name', eligibleSchemes: 5 }
  }
}

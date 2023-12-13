import axios from 'axios'

const baseURL = 'https://brasilapi.com.br/'

const ApiClient = () => {
  const defaultOptions = {
    baseURL,
  }

  const instance = axios.create(defaultOptions)

  return instance
}

export default ApiClient()

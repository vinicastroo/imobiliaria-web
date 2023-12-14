import axios from 'axios'
// import { getSession } from 'next-auth/react'

const baseURL = process.env.SOME_API_URL || 'http://localhost:3333'
// const baseURL = 'https://imobiliaria-api.vercel.app'

const ApiClient = () => {
  const defaultOptions = {
    baseURL,
  }

  const instance = axios.create(defaultOptions)

  // instance.interceptors.request.use(async (request) => {
  //   const session = await getSession()
  //   if (session) {
  //     request.headers.userId = session.user.id
  //   }
  //   return request
  // })

  return instance
}

export default ApiClient()

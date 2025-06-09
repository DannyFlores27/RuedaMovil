import { Navigate } from 'react-router-dom'
import { type ReactElement } from 'react'

interface Props {
  children: ReactElement
}

export const PrivateRoute = ({ children }: Props) => {
  const token = localStorage.getItem('token')

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return children
}

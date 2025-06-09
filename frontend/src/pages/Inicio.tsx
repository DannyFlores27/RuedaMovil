// src/pages/Inicio.tsx
import { Typography, Box } from '@mui/material'
import { BiciLogo } from '../BiciLogo'

export const Inicio = () => {
  return (
    <Box>
      <Box sx={{ width: 150, mb: 2 }}>
        <BiciLogo />
      </Box>
      <Typography variant="h3" component="h1">
        RuedaMovil
      </Typography>
    </Box>
  )
}

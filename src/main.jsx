import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './biodata/custom.css';
import BiodataDiri from './Biodata/BiodataDiri.jsx'; 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BiodataDiri />
  </StrictMode>,
)


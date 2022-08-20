import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { TransactionProvide } from './context/TransactionContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <TransactionProvide>
  <React.StrictMode>
    <App />
  </React.StrictMode>
  </TransactionProvide>
)

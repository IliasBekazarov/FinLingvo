import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'

const qc = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30000 } },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={qc}>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#1a2133',
              color: '#fff',
              fontFamily: 'Nunito, sans-serif',
              fontWeight: 800,
              fontSize: '0.88rem',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '99px',
              padding: '0.7rem 1.3rem',
            },
            success: { iconTheme: { primary: '#58CC02', secondary: '#fff' } },
            error:   { iconTheme: { primary: '#FF4B4B', secondary: '#fff' } },
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
)

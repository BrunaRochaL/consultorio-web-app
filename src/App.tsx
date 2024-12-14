import { BrowserRouter } from 'react-router-dom'

import './App.css'
import Layout from './components/common/Layout/Layout'
import AppRoutes from './routes/AppRoutes'

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <AppRoutes />
      </Layout>
    </BrowserRouter>
  )
}

export default App

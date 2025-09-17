
import './App.css'
import Navbar from './layouts/Navbar'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SchedulePage from './components/SchedulerPage'

function App() {
    return (
      <BrowserRouter>
        <div>
          <Navbar/>
          <Routes>
            <Route path='/' element={<h1 className='text-3xl text-black'>App Page</h1>} />
            <Route path='/schedule' element={<SchedulePage/>} />
          </Routes>
        </div>
      </BrowserRouter>
    )
}
export default App

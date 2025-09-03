import './App.css'
import Footer from './components/Footer.jsx'
import Header from './components/Header.jsx'
import { Outlet } from 'react-router-dom'

function App() {

  return (
    <>
      <Header/>
      <Outlet/>
      <Footer/>
      {/* <h1 className='text-center text-primary-light text-4xl'>Jai Shree Ram</h1> */}
    </>
  )
}

export default App

import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import ModeTabs from './components/ModeTabs'
import BackBar from './components/BackBar'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import Login from './pages/Login'
import Register from './pages/Register'
import Cabinet from './pages/Cabinet'
import Landing from './pages/Landing'
import Favorites from './pages/Favorites'
import Requests from './pages/Requests'
import PostRequest from './pages/PostRequest'
import Board from './pages/Board'
import Privacy from './pages/Privacy'
import { getMode, setMode, type UserRole } from './store'

export default function App() {
  const [mode, setModeState] = useState<UserRole>(getMode())
  const changeMode = (m: UserRole) => { setMode(m); setModeState(m) }

  return (
    <>
      <Header />
      <ModeTabs mode={mode} onChange={changeMode} />
      <BackBar />
      <Routes>
        <Route path="/" element={<Home mode={mode} />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/start" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cabinet" element={<Cabinet mode={mode} />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/requests" element={<Requests />} />
        <Route path="/board" element={<Board />} />
        <Route path="/post" element={<PostRequest />} />
        <Route path="/privacy" element={<Privacy />} />
      </Routes>
    </>
  )
}

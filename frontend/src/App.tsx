import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import TabBar from './components/TabBar'
import Catalog from './pages/Catalog'
import Login from './pages/Login'
import Register from './pages/Register'
import Cabinet from './pages/Cabinet'
import Landing from './pages/Landing'
import Favorites from './pages/Favorites'
import Requests from './pages/Requests'
import PostRequest from './pages/PostRequest'

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Catalog />} />
        <Route path="/start" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cabinet" element={<Cabinet />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/requests" element={<Requests />} />
        <Route path="/post" element={<PostRequest />} />
      </Routes>
      <TabBar />
    </>
  )
}

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SplashScreen from './pages/SplashScreen'
import Home from './pages/Home'
import SearchPage from './pages/SearchPage'
import MapView from './pages/MapView'
import SavedPage from './pages/SavedPage'
import MessagesPage from './pages/MessagesPage'
import ListingDetail from './pages/ListingDetail'
import RegisterPage from './pages/RegisterPage'
import WebLayout from './layouts/WebLayout'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<WebLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/home/search" element={<SearchPage />} />
          <Route path="/home/map" element={<MapView />} />
          <Route path="/home/saved" element={<SavedPage />} />
          <Route path="/home/messages" element={<MessagesPage />} />
          <Route path="/home/listing/:id" element={<ListingDetail />} />
          <Route path="/home/profile" element={<Home />} />
          <Route path="/home/settings" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

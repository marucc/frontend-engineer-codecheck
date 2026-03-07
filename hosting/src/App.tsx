import { BrowserRouter, Route, Routes } from 'react-router-dom'

import styles from './App.module.css'
import { Footer } from './components/common/Footer'
import { Header } from './components/common/Header'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'

export const App = () => {
  return (
    <BrowserRouter>
      <div className={styles.container}>
        <Header />
        <main className={styles.main}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

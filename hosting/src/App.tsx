import { useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import styles from './App.module.css'
import { Footer } from './components/common/Footer'
import { Header } from './components/common/Header'
import { Sidebar } from './components/common/Sidebar'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'
import { POPULATION_TYPE_SLUGS } from './types'

const slugs = Object.values(POPULATION_TYPE_SLUGS)
const defaultSlug = slugs[0]

export const App = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <BrowserRouter>
      <div className={styles.container}>
        <Header onMenuOpen={() => setMenuOpen(true)} />
        <div className={styles.body}>
          <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
          <main className={styles.main}>
            <Routes>
              <Route
                path="/"
                element={<Navigate to={`/${defaultSlug}`} replace />}
              />
              {slugs.map((slug) => (
                <Route key={slug} path={`/${slug}`} element={<Home />} />
              ))}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

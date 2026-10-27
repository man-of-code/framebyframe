import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { shouldHydrate } from '@/lib/hydrate-guard'
import { STORAGE_KEY } from '@/lib/progress'

function storedProgress(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

const container = document.getElementById('root')
if (!container) throw new Error('#root is missing from index.html')
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// Prerendered pages (scripts/prerender.ts) hydrate only when the markup was rendered for this exact URL
// (see shouldHydrate); everything else is replaced by a fresh client render.
if (shouldHydrate(container.getAttribute('data-prerendered'), window.location, storedProgress())) {
  hydrateRoot(container, app, {
    onRecoverableError(error, info) {
      console.error('[hydration]', error, info.componentStack)
    },
  })
} else {
  container.removeAttribute('data-prerendered')
  container.replaceChildren()
  // The head tags prerendered for another page (title, description, canonical, Open Graph) would outlive it.
  for (const node of document.head.querySelectorAll('[data-prerendered-head]')) node.remove()
  createRoot(container).render(app)
}

if (import.meta.env.PROD && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    void navigator.serviceWorker.register("/sw.js");
  });
}

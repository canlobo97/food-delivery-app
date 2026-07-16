import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store/store'
import { AuthProvider } from './context/AuthContext'

document.addEventListener(
  "gesturestart",
  function (e) {
    e.preventDefault();
  },
  { passive: false }
);

let lastTouchEnd = 0;

document.addEventListener(
  "touchend",
  function (event) {
    const now = Date.now();

    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }

    lastTouchEnd = now;
  },
  false
);

ReactDOM.createRoot(document.getElementById('root')!).render(

    <Provider store={store}>
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </Provider>
)

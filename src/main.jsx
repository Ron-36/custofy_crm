import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import {router} from './routing/router.jsx'
import { ToastContainer } from "react-toastify";
import { store } from './store/store.js';
import AuthInitializer  from './store/AuthInitializer.js';
import "react-toastify/dist/ReactToastify.css";
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux';





createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <App />
    <AuthInitializer>
    <RouterProvider router={router}/>
    <ToastContainer position="top-right" autoClose={3000} />
    </AuthInitializer>
    </Provider>
   
  </StrictMode>,
)

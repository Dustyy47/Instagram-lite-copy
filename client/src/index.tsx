import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { App } from './App'
import './assets/fonts/Sansation_Bold.otf'
import './assets/fonts/Sansation_Regular.otf'
import './styles/index.scss'
import { store } from './store'

const root = ReactDOM.createRoot(document.getElementById('root') as Element)
root.render(
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>
)

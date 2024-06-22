import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {
  PersistQueryClientProvider,
  persistQueryClientRestore,
} from '@tanstack/react-query-persist-client'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import localForage from 'localforage'
import App from './App.jsx'
import './index.css'

localForage.config({
  name: 'fileGuard',
  storeName: 'reactQuery',
})

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 12,
    },
  },
})

const asyncStoragePersister = createAsyncStoragePersister({
  storage: localForage,
})

persistQueryClientRestore({
  queryClient,
  persister: asyncStoragePersister,
}).then(() => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister: asyncStoragePersister }}
      >
        <App />
        <ReactQueryDevtools initialIsOpen={false} />
      </PersistQueryClientProvider>
    </React.StrictMode>,
  )
})

import React from 'react'
import ReactDOM from 'react-dom'
import './styles/index.css'
import App from './components/App'
import { BrowserRouter } from 'react-router-dom'

import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

import { GC_AUTH_TOKEN } from './constants'
import { ApolloLink } from 'apollo-client-preset'

const httpLink = new HttpLink({ uri: 'https://api.graph.cool/simple/v1/cjba3y9oj2f9g0187q1otd606' })

const middlewareAuthLink = new ApolloLink((operation, forward) => {
    const token = localStorage.getItem(GC_AUTH_TOKEN)
    const authorizationHeader = token ? `Bearer ${token}` : null
    operation.setContext({
        headers: {
            authorization: authorizationHeader
        }
    })
    return forward(operation)
})

const httpLinkWithAuthToken = middlewareAuthLink.concat(httpLink)

const client = new ApolloClient({
    link: httpLinkWithAuthToken,
    cache: new InMemoryCache()
})

ReactDOM.render(
    <BrowserRouter>
        <ApolloProvider client={client}>
            <App />
        </ApolloProvider>
    </BrowserRouter>
    , document.getElementById('root')
)
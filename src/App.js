import React from 'react'
import { hot } from 'react-hot-loader'
import { Root } from './Root'
import './app.scss'

const App = hot(module)(props => <Root />)

export { App }

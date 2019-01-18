import React from 'react'
import './app.scss'
import { Engine } from './Engine'
import { Game } from './Game'

const App = props => <Engine gameRender={props => <Game {...props} />} />

export { App }

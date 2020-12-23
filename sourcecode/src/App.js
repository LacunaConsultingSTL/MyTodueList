import React, {useEffect, useState} from 'react'
import './App.css'
import HomePage from './app/screens/Home/index'
import SignIn from './app/screens/Login/index'
import Register from './app/screens/Register/index'
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles'
import { purple } from '@material-ui/core/colors';
import {CircularProgress, CssBaseline} from '@material-ui/core'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import firebase from './app/services/firebase'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#3dd19d'
    },
    secondary: {
      main: '#3dd19d'
    }
  }
});

export default function App() {
  
  const [firebaseInitialized, setFirebaseInitialized] = useState(false)
  
  function isInitialized() {
    return new Promise(resolve => {
      firebase.auth().onAuthStateChanged(resolve)
    })
  }
  
  useEffect(() => {
    isInitialized().then(val => {
      setFirebaseInitialized(val)
    })
  })
  
  
  return firebaseInitialized !== false ? (
    <MuiThemeProvider theme={theme}>
      <CssBaseline/>
      <Router>
        <Switch>
          <Route exact path="/" component={SignIn}/>
          <Route exact path="/register" component={Register}/>
          <Route exact path="/home" component={HomePage}/>
        </Switch>
      </Router>
    </MuiThemeProvider>
  ) : <div id="loader"><CircularProgress style={{color:"#3dd19d"}}/></div>
}

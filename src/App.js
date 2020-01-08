import React from 'react';
import {BrowserRouter as Router,Route,Redirect} from 'react-router-dom'
import Home from './pages/Home'
import City from './pages/City'
import Map from './pages/Map'
class App extends React.Component {
  render(){
    return (
      <Router>
        <div className="App">
          {/* 重定向 */}
          <Route exact path="/" render={(props)=>{
            return <Redirect to="/home/index"></Redirect>
          }}>
          </Route>
          <Route path="/home" component={Home}></Route>
          <Route exact path="/map" component={Map}></Route>
          <Route exact path="/city" component={City}></Route>
        </div>
      </Router>
    )
  }
}
export default App;

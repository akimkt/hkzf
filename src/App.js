import React from 'react';
import {BrowserRouter as Router,Route,Redirect} from 'react-router-dom'
import Home from './pages/Home'
import City from './pages/City'
import Map from './pages/Map'
import HouseDetail from './pages/HouseDetail'
import Login from './pages/Login'
import Registe from './pages/Registe'
import Profile from './pages/Profile'
import Rent from './pages/Rent'
import RentAdd from './pages/Rent/Add'
import RentSearch from './pages/Rent/Search'
import Favorate from './pages/Favorate'

import AuthRoute from './components/AuthRoute'
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
          <Route exact path="/home" render={(props)=>{
            return <Redirect to="/home/index"></Redirect>
          }}></Route>
          <Route exact path="/map" component={Map}></Route>
          <Route exact path="/city" component={City}></Route>
          <Route exact path="/hsdetail/:id" component={HouseDetail}></Route>
          <Route exact path="/login" component={Login}></Route>
          <Route exact path="/registe" component={Registe}></Route>
          <Route exact path="/profile" component={Profile}></Route>
          <AuthRoute exact={true} path="/rent" Page={Rent}></AuthRoute>
          <AuthRoute exact={true} path="/rent/add" Page={RentAdd}></AuthRoute>
          <AuthRoute exact={true} path="/rent/search" Page={RentSearch}></AuthRoute>
          <AuthRoute exact={true} path="/favorate" Page={Favorate}></AuthRoute>
        </div>
      </Router>
    )
  }
}
export default App;

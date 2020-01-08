import React, {Component} from 'react'

export default class Map extends Component {
    componentDidMount(){
        this.InitMap()
    }
    InitMap(){
        var map = new window.BMap.Map("container"); 
      var point  = new window.BMap.Point(116.404, 39.915); 
      map.centerAndZoom(point, 6); 
    }
    render(){
        return <div className="map">
            <div id="container">
            </div>
        </div>
    }
}
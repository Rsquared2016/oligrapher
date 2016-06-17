import React, { Component, PropTypes } from 'react';
import { DraggableCore } from 'react-draggable';
import BaseComponent from './BaseComponent';
import Graph from '../models/Graph';


export default class Lasso extends BaseComponent {
  constructor(props) {
    super(props);
    this.bindAll('_handleDragStart', '_handleDrag', '_handleDragStop');
    this.state = {
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      viewBoxWidth: +this.props.graph.state.viewBox.split(" ")[2],
      viewBoxHeight: +this.props.graph.state.viewBox.split(" ")[3],
      thisOffsetLeft: null,
      thisOffsetRight: null,
      thisOffsetTop: null,
      thisOffsetBottom: null,

    }
  }

  render() {

    return (
      <g>
        <DraggableCore
            onStart={this._handleDragStart}
            onDrag={this._handleDrag}
            onStop={this._handleDragStop}>
          <rect
            ref="lassoBg"
            x={-this.state.viewBoxWidth/2}
            y={-this.state.viewBoxHeight/2}
            width={this.state.viewBoxWidth}
            height={this.state.viewBoxHeight}
            opacity = {0.2}/>
        </DraggableCore>
        <rect
            x={this.state.x}
            y={this.state.y}
            width={this.state.width} 
            height={this.state.height} 
            fill={"orange"} 
            opacity={0.5}/>
      </g>
    )
  }

  componentDidMount(e, ui){
    /*will need to update offsets potentially at other points*/
    this.setState({thisOffsetLeft: this.refs.lassoBg.getBoundingClientRect()["left"]});
    this.setState({thisOffsetRight: this.refs.lassoBg.getBoundingClientRect()["right"]});
    this.setState({thisOffsetTop: this.refs.lassoBg.getBoundingClientRect()["top"]});
    this.setState({thisOffsetBottom: this.refs.lassoBg.getBoundingClientRect()["bottom"]});

  }

  _handleDragStart(e, ui) {

    var newX = (ui.position.clientX - e.target.getBoundingClientRect()["left"])/
               (e.target.getBoundingClientRect()["right"] - e.target.getBoundingClientRect()["left"]) *
               (this.state.viewBoxWidth) - this.state.viewBoxWidth/2;

    var newY = (ui.position.clientY - e.target.getBoundingClientRect()["top"])/
               (e.target.getBoundingClientRect()["bottom"] - e.target.getBoundingClientRect()["top"]) *
               (this.state.viewBoxHeight) - this.state.viewBoxHeight/2;
    
    this.setState({x: newX});
    this.setState({y: newY});
    this._startDrag = ui.position;
    this._startPosition = {
      x: this.state.x,
      y: this.state.y
    };

  }

  _handleDragStop(e, ui) {
     if (this._dragging) {
      console.log("hi");       
    }
    this.setState({ x : -500 });
    this.setState({ y : -500 });
    this.setState({ width : 0 });
    this.setState({ height : 0 });

  }

  _handleDrag(e, ui) {
    if (this.props.isLocked) return;
    

    this._dragging = true; // so that _handleClick knows it's not just a click

    let deltaX = (ui.position.clientX - this._startDrag.clientX) / this.props.graph.state.actualZoom;
    let deltaY = (ui.position.clientY - this._startDrag.clientY) / this.props.graph.state.actualZoom;
    
    let width = Math.abs(deltaX);
    let height = Math.abs(deltaY);
    this.setState({ width, height });
    if (deltaX < 0){
       var x = (ui.position.clientX - this.state.thisOffsetLeft)/
               (this.state.thisOffsetRight - this.state.thisOffsetLeft) *
               (this.state.viewBoxWidth) - this.state.viewBoxWidth/2;
      this.setState({ x });
    } 
    if (deltaY < 0){
      var y = (ui.position.clientY - this.state.thisOffsetTop)/
               (this.state.thisOffsetBottom - this.state.thisOffsetTop) *
               (this.state.viewBoxHeight) - this.state.viewBoxHeight/2;
               console.log(y);
      this.setState({ y });
    } 
  }

}
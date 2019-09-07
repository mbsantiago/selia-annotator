import React from 'react';
import VisualizerBase from './VisualizerBase';
import ImageVisualizerToolbar from './ImageVisualizerToolbar';
import { NAME, VERSION, DESCRIPTION, CONFIGURATION_SCHEMA } from './ImageVisualizerInfo';


class ImageVisualizer extends VisualizerBase {
  name = NAME;
  version = VERSION;
  description = DESCRIPTION;
  configuration_schema = CONFIGURATION_SCHEMA;

  centerImage() {
    this.setTransform(1, 0, 0, 1, 0, 0);
    this.factor = 1;

    let x = (this.canvas.width - this.image.width) / 2;
    let y = (this.canvas.height - this.image.height) / 2;
    let p = this.createPoint(x, y );

    this.translate(p);
    this.emitUpdateEvent();
    this.draw();
  }

  renderToolbar() {
    return (
      <
        ImageVisualizerToolbar
        active={this.active}
        activator={this.activator}
        home={() => this.centerImage()}
      />
    );
  }

  getItemUrl(){
    return this.itemInfo.url + 'download/';
  }

  getEvents() {
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseScroll = this.onMouseScroll.bind(this);

    return {
      'mousedown': this.onMouseDown,
      'mousemove': this.onMouseMove,
      'mouseup': this.onMouseUp,
      'DOMMouseScroll': this.onMouseScroll,
      'mousewheel': this.onMouseScroll,
    }
  }

  onMouseDown(event) {
    document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
    this.last = this.getMouseEventPosition(event);
    this.dragStart = this.canvasToPoint(this.last);
    this.dragged = false;
  }

  onMouseMove(event) {
    this.last = this.getMouseEventPosition(event);
    this.dragged = true;

    if (this.dragStart) {
      var pt = this.canvasToPoint(this.last);
      pt.x -= this.dragStart.x;
      pt.y -= this.dragStart.y;
      this.translate(pt);
      this.emitUpdateEvent()
      this.draw();
    }
  }

  onMouseUp(event) {
    this.dragStart = null;
    if (!this.dragged) this.zoom(event.shiftKey ? -1 : 1);
  }

  onMouseScroll(event) {
    var delta = event.wheelDelta ? event.wheelDelta / 40 : event.detail ? -event.detail : 0;
    if (delta) this.zoom(delta);

    return event.preventDefault() && false;
  }

  zoom(clicks) {
    var scaleFactor = 1.1;
    var factor = Math.pow(scaleFactor, clicks);

    if (this.factor * factor < 0.5) return;
    if (this.factor * factor > 5) return;

    this.factor = this.factor * factor;
    var pt = this.canvasToPoint(this.last);
    this.translate(pt);
    this.scale(factor, factor);
    this.translate({x: -pt.x, y: -pt.y});
    this.emitUpdateEvent()
    this.draw();
  }

  scale(x, y) {
    this.transformMatrix = this.transformMatrix.scaleNonUniform(x, y);
    this.ctx.scale(x, y);
  }

  translate(p) {
    this.transformMatrix = this.transformMatrix.translate(p.x, p.y);
    this.ctx.translate(p.x, p.y);
  }

  rotate(radians) {
    this.transformMatrix = this.transformMatrix.rotate(radians * 180 / Math.PI);
    this.ctx.rotate(radians);
  }

  transform(a, b, c, d, e, f) {
    var matrix = this.svg.createSVGMatrix();
    matrix.a = a;
    matrix.b = b;
    matrix.c = c;
    matrix.d = d;
    matrix.e = e;
    matrix.f = f;
    this.transformMatrix = this.transformMatrix.multiply(matrix);
    return this.ctx.transform(a, b, c, d, e, f);
  }

  setTransform(a, b, c, d, e, f) {
    this.transformMatrix.a = a;
    this.transformMatrix.b = b;
    this.transformMatrix.c = c;
    this.transformMatrix.d = d;
    this.transformMatrix.e = e;
    this.transformMatrix.f = f;

    this.ctx.setTransform(a, b, c, d, e, f);
  }

  canvasToPoint(p) {
    var pt = this.createPoint(p.x, p.y)
    return pt.matrixTransform(this.transformMatrix.inverse());
  }

  pointToCanvas(p) {
    var pt = this.createPoint(p.x, p.y)
    return pt.matrixTransform(this.transformMatrix);
  }

  draw() {
    this.save();
    this.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.restore();

    this.ctx.drawImage(this.image, 0, 0);
  }

  save() {
    this.transformHistory.push(this.transformMatrix.translate(0, 0));
    this.ctx.save();
  }

  restore() {
    this.transformMatrix = this.transformHistory.pop();
    this.ctx.restore();
  }

  validatePoints(p) {
    let x = Math.min(Math.max(p.x, 0), this.image.width);
    let y = Math.min(Math.max(p.y, 0), this.image.height);
    return this.createPoint(x, y);
  }

  getConfig() {
    return {
      transformMatrix: {
        a: this.transformMatrix.a,
        b: this.transformMatrix.b,
        c: this.transformMatrix.c,
        d: this.transformMatrix.d,
        e: this.transformMatrix.e,
        f: this.transformMatrix.f,
      }
    }
  }

  setConfig(config) {
    let matrix = config.transformMatrix;
    this.setTransform(
      matrix.a,
      matrix.b,
      matrix.c,
      matrix.d,
      matrix.e,
      matrix.f)

    this.factor = Math.sqrt(matrix.a * matrix.d - matrix.b * matrix.c);

    this.draw();
    this.emitUpdateEvent()
  }

  init() {
    this.canvas.style.cssText = '-moz-box-shadow: inset 0 0 7px #404040;' +
      '-webkit-box-shadow: inset 0 0 7px #404040;' +
      'box-shadow:         inset 0 0 7px #404040;' +
      'background-color: gray';

    this.ctx = this.canvas.getContext('2d');

    this.image = new Image();
    this.image.src = this.getItemUrl();

    this.transformMatrix = this.svg.createSVGMatrix();
    this.transformHistory = [];

    this.last = this.createPoint(this.canvas.width / 2, this.canvas.height / 2);
    this.factor = 1;

    this.dragStart = null;
    this.dragged = false;

    this.image.onload = () => {
      this.centerImage();
    }
  }
}


export default ImageVisualizer;

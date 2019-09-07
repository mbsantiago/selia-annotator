import AnnotatorBase from './AnnotatorBase';

class PointAnnotator extends AnnotatorBase {
  getEvents() {
    this.onMouseUp = this.onMouseUp.bind(this);

    return {
      mouseup: this.onMouseUp,
    };
  }

  onMouseUp(event) {
    let p = this.visualizer.canvasToPoint(this.getMouseEventPosition(event));
    this.annotation = this.createAnnotation(p);
    this.registerAnnotation(this.annotation);

    this.phase = this.DONE;
    this.draw();
  }

  drawAnnotation(annotation, style) {
    style = style ? style : {};

    let p = this.visualizer.pointToCanvas(annotation);
    let fillStyle = style.fillStyle || "yellow";
    let radius = style.radius || 3;

    this.ctx.fillStyle = fillStyle;
    this.ctx.fillRect(p.x - radius, p.y - radius, 2 * radius, 2 * radius);
  }

  createAnnotation(p) {
    p = this.visualizer.validatePoints(p);
    return {
      x: p.x,
      y: p.y
    }
  }
}

export default PointAnnotator

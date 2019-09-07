import React from 'react';


class VisualizerControler extends React.Component {
    render() {
      return (
        <div className="col">
          {this.renderVisualizerToolbar()}
          <div className="row">
            {this.renderCanvas()}
          </div>
        </div>
      );
    }

    renderVisualizerToolbar() {
      if (this.visualizer) {
        return (
          <div className="row">
          {this.visualizer.renderToolbar()}
          </div>
        );
      }
    }

    loadVisualizer() {
      let itemInfo = this.props.info.item;

      this.visualizer = new this.props.components.visualizer({
        canvas: this.visualizerCanvas,
        itemInfo: itemInfo
      });

      this.forceUpdate();
    }

    loadAnnotator() {
      if (this.props.annotator) {
        this.annotator = new this.props.annotator({
          canvas: this.annotatorCanvas,
          visualizer: this.visualizer,
          annotation: this.props.annotation,
        })
      }
    }

    componentDidMount() {
      this.loadVisualizer();
    }

    componentDidUpdate() {
      this.loadAnnotator();
    }
    
    componentWillUnmount() {
      if (this.visualizer) {
        this.visualizer.unmount();
        this.visualizer = null;
      }

      if (this.annotator) {
        this.annotator.unmount();
        this.annotator = null;
      }
    }

    renderCanvas() {
      return (
        <div className="col">
          <div className="row" style={{height: "30em", width: "100%", textAlign: 'center'}}>
            <canvas
              ref={(node) => {this.visualizerCanvas = node;}}
              style={{
                display: 'block',
                position: 'absolute',
              }}
            >
            </canvas>
            <canvas
              ref={(node) => {this.annotatorCanvas = node;}}
              style={{
                display: 'block',
                position: 'absolute',
                pointerEvents: 'none',
              }}
            >
            </canvas>
          </div>
        </div>
      );
    }
}


export default VisualizerControler;

import React from 'react';
import AnnotationToolBar from '../components/AnnotationToolBar';


class VisualizerControler extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        active: false,
        selectedAnnotationType: null,
      };
    }

    render() {
      return (
        <div className="col">
          <div className="row">
            <AnnotationToolBar
              info={this.props.info.annotationTypes}
              active={this.state.active}
              selected={this.state.selectedAnnotationType}
              select={(type) => this.selectAnnotationType(type)}
            />
          </div>
          {this.renderVisualizerToolbar()}
          <div className="row">
            {this.renderCanvas()}
          </div>
        </div>
      );
    }

    selectAnnotationType(type){
      if (this.visualizer) {
        this.visualizer.deactivate();
      }

      this.setState({
        selectedAnnotationType: type,
        active: true,
      }, () => {
        this.props.setAnnotationInfo({'annotationType': type})
        this.loadAnnotator()
      });
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
        itemInfo: itemInfo,
        active: !this.state.active,
        activator: () => this.activateVisualizer()
      });

      this.props.setAnnotationInfo({annotationTool: {
        name: this.visualizer.name,
        version: this.visualizer.version,
        description: this.visualizer.description,
        configuration_schema: this.visualizer.configuration_schema,
      }})
      this.forceUpdate();
    }

    activateVisualizer() {
      this.visualizer.activate();
      this.setState({active: false});
    }

    loadAnnotator() {
      let selected = this.state.selectedAnnotationType;
      if (selected && selected in this.props.components.annotators) {
        if (this.annotator) {
          this.annotator.unmount();
        }

        let annotationComponent = this.props.components.annotators[selected]
        this.annotator = new annotationComponent({
          canvas: this.annotatorCanvas,
          visualizer: this.visualizer,
          edit: true,
          registerAnnotation: (annotation) => this.registerAnnotation(annotation),
        });
      }
    }

    registerAnnotation(annotation) {
      this.props.setAnnotationInfo({
        annotation: annotation,
        annotationConfiguration: this.visualizer.getConfig()
      });
    }

    componentDidMount() {
      this.loadVisualizer();
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
                pointerEvents: this.state.active ? 'auto' : 'none',
              }}
            >
            </canvas>
          </div>
        </div>
      );
    }
}


export default VisualizerControler;

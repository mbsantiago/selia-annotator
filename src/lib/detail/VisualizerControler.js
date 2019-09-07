import React from 'react';


class VisualizerControler extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        active: false,
      };
    }

    render() {
      return (
        <div className="col">
          <div className="row">
            {this.renderEditButtons()}
          </div>
          {this.renderVisualizerToolbar()}
          <div className="row">
            {this.renderCanvas()}
          </div>
        </div>
      );
    }

    renderEditButtons() {
      let className = this.state.active ? "btn btn-primary m-1" : "btn btn-light m-1";
      return (
        <div className="col p-2">
          <div
            className={className}
            onClick={() => this.activateAnnotator()}>
            Editar <i className="fas fa-edit"></i>
          </div>
          <div
            className="btn btn-light m-1"
            onClick={() => this.restoreAnnotation()}
          >
            Restaurar <i className="fas fa-undo"></i>
          </div>
          <div
            className="btn btn-light m-1"
            onClick={() => this.focus()}
          >
            Enfocar <i className="far fa-eye"></i>
          </div>
        </div>
      );
    }

    focus() {
      if (!(this.visualizer)) return;

      this.visualizer.setConfig(this.props.initial.annotation_configuration);
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

      this.loadAnnotator();
    }

    activateVisualizer() {
      this.visualizer.activate();
      this.setState({active: false});
    }

    activateAnnotator() {
      this.visualizer.deactivate();
      this.setState({active: true});
    }

    loadAnnotator() {
      let annotation_type = this.props.initial.annotation_type;
      let annotationComponent = this.props.components.annotators[annotation_type];

      this.annotator = new annotationComponent({
        canvas: this.annotatorCanvas,
        visualizer: this.visualizer,
        annotation: this.props.initial.annotation,
        edit: true,
        registerAnnotation: (annotation) => this.registerAnnotation(annotation),
      });
    }

    restoreAnnotation() {
      if (!(this.annotator)) return;

      this.annotator.annotation = this.props.initial.annotation;
      this.annotator.draw();

      this.activateVisualizer();

      this.setAnnotationInfo({
        annotation: this.props.initial.annotation,
        annotationConfiguration: this.props.initial.annotation_configuration,
      })
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

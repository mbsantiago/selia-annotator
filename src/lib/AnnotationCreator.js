import React from 'react';

import FormControler from './components/FormControler';
import VisualizerControler from './create/VisualizerControler';


class AnnotatorCreator extends React.Component {
  constructor(props) {
    super(props);

    let visualizer = this.props.visualizer;
    this.annotationData = {
      item: props.info.item,
    };

    this.state = {
      ready: false,
    }
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="row p-2">
          <div className="col-7 p-2">
            <div className="container-fluid w-100 description_object">
              <VisualizerControler
                components={this.props.components}
                info={this.props.info}
                urls={this.props.urls}
                setAnnotationInfo={(data) => this.setAnnotationData(data)}
              />
            </div>
          </div>
          <div className="col-5 p-2">
            <div className="container-fluid w-100 description_object">
              <FormControler
                ready={this.state.ready}
                info={this.props.info}
                urls={this.props.urls}
                setFormInfo={(data) => this.setAnnotationData(data)}
                submit={() => this.submit()}
              />
            </div>
          </div>
        </div>
        {this.renderModals()}
      </div>
    );
  }

  renderModals() {
    let noPermissionModal = (
      <div className="modal fade" id="noPermissionModal" tabIndex="-1" role="dialog" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-body">
              <span className="text-center text-danger w-100">Lo sentimos. No tienes permiso para realizar esta acción.</span>
            </div>
          </div>
        </div>
      </div>
    );
    let successModal = (
      <div className="modal fade" id="sucessModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-body">
              <span className="text-center text-success w-100">Anotación registrada</span>
            </div>
          </div>
        </div>
      </div>
    );

    return (
      <div>
        {successModal}
        {noPermissionModal}
      </div>
    )
  }

  setAnnotationData(data) {
    if ('annotationType' in data) {
      this.annotationData['annotation_type'] = data['annotationType'];
    }

    if ('annotation' in data) {
      this.annotationData['annotation'] = data['annotation'];
    }

    if ('labels' in data) {
      this.annotationData['labels'] = data['labels'];
    }

    if ('commentaries' in data) {
      this.annotationData['commentaries'] = data['commentaries'];
    }

    if ('quality' in data) {
      this.annotationData['quality'] = data['quality'];
    }

    if ('certainty' in data) {
      this.annotationData['certainty'] = data['certainty'];
    }

    if ('eventType' in data) {
      this.annotationData['event_type'] = data['eventType'];
    }

    if ('annotationTool' in data) {
      this.annotationData['annotation_tool'] = data['annotationTool'];
    }

    if ('annotationConfiguration' in data) {
      this.annotationData['annotation_configuration'] = data['annotationConfiguration'];
    }

    this.checkIfReady();
  }

  checkIfReady(){
    let ready = true;
    if (!('annotation_type' in this.annotationData)) ready = false;
    if (!('annotation' in this.annotationData)) ready = false;
    if (!('event_type' in this.annotationData)) ready = false;
    if (!('labels' in this.annotationData) || this.annotationData.labels.size === 0) ready = false;

    if (!(this.state.ready) && ready) {
      this.setState({ready: true});
    }

    if (this.state.ready.submit && !(ready)) {
      this.setState({ready: false});
    }
  }

  submit() {
    $.ajax({
      type: "POST",
      url: this.props.urls.annotations,
      data: JSON.stringify(this.annotationData),
      contentType: 'application/json',
      success: () => this.createSuccess(),
    }).catch((error) => {
        if (error.status === 403) {
          this.showForbidden();
        }
    });
  }

  createSuccess(){
    $('#sucessModal').modal('show')
    setTimeout(() => {
      $('#sucessModal').modal('hide');
      setTimeout(() => this.props.changePhase(), 200);
    }, 800)
  }

  showForbidden() {
    $('#noPermissionModal').modal('show')
    setTimeout(() => {
      $('#noPermissionModal').modal('hide');
    }, 1200)
  }
}

export default AnnotatorCreator;

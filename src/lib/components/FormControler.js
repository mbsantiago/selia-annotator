import React from 'react';
import QualityAndCertaintyForm from './QualityAndCertainty';
import EventTypeBar from './EventTypeBar';
import CommentsForm from './Comments';
import LabelsForm from './Labels';


class FormControler extends React.Component {
  constructor(props) {
    super(props);

    this.initial = this.props.initial ? this.props.initial : {};
    this.selectType = (this.props.selectType === undefined) ? true : this.props.selectType;
    this.initialLabels = this.initial.labels || null;

    this.state = this.createInitialState();
  }

  createInitialState() {
    let labels = (this.initialLabels === null) ? null : this.initialLabels.map(element => element.id);

    let state = {
      eventType: this.initial.event_type || null,
      commentaries: this.initial.commentaries || '',
      quality: this.initial.quality || null,
      certainty: this.initial.certainty || null,
      labels: labels
    }

    return state;
  }

  renderSubmitButton() {
    if (this.props.ready) {
      return (
        <div className="d-flex w-100 justify-content-center">
          <div className="btn btn-link" onClick={() => this.props.submit()}>
            Crear
          </div>
        </div>
      );
    }

    return (
      <React.Fragment>
        <div className="d-flex w-100 justify-content-center">
          <span className="text-info">
          Llena toda la información antes de poder crear una anotación.
          </span>
        </div>
        <div className="d-flex w-100 justify-content-center">
          <div className="btn btn-link disabled">Crear</div>
        </div>
      </React.Fragment>
    );
  }

  renderLabelFormContent() {
    if (this.state.eventType) {
      return (
        <LabelsForm
          ref={node => {this.labelsNode = node;}}
          eventType={this.state.eventType}
          info={this.props.info}
          labels={this.state.labels}
          initialLabels={this.initialLabels}
          changeLabels={(labels) => this.changeLabels(labels)}
          urls={this.props.urls}
        />
      );
    }

    return (
      <div
        className="container rounded bg-light inner-shadow-sm m-2"
        style={{height: '10em'}}
      >
        <div className="w-100 h-100 d-flex flex-column justify-content-center">
          <h6 className="w-100 text-center text-info">
            Favor de seleccionar un tipo de evento a anotar
          </h6>
        </div>
      </div>
    );
  }

  changeLabels(labels) {
    let labelList = [];
    for (let termType in labels) labelList.push(labels[termType].id);

    this.setState({labels: labelList});
    this.props.setFormInfo({labels: labelList});
  }

  changeEventType(eventType) {
    this.setState({eventType: eventType});
    this.props.setFormInfo({eventType: eventType});
  }

  changeCertainty(certainty) {
    this.setState({certainty: certainty});
    this.props.setFormInfo({certainty: certainty});
  }

  changeQuality(quality) {
    this.setState({quality: quality});
    this.props.setFormInfo({quality: quality});
  }

  changeComment(comment) {
    this.setState({commentaries: comment});
    this.props.setFormInfo({commentaries: comment});
  }

  renderSelectTypeBar() {
    if (!(this.selectType)) return '';

    return (
      <div className="row">
        <EventTypeBar
          eventType={this.state.eventType}
          info={this.props.info}
          changeEventType={(eventType) => this.changeEventType(eventType)}
        />
      </div>
    );
  }

  renderExtra() {}

  render() {
    return (
      <React.Fragment>
        {this.renderExtra()}
        {this.renderSelectTypeBar()}
        <div className="row">
          {this.renderLabelFormContent()}
        </div>
        <div className="row">
          <QualityAndCertaintyForm
            certainty={this.state.certainty}
            quality={this.state.quality}
            changeCertainty={(certainty) => this.changeCertainty(certainty)}
            changeQuality={(quality) => this.changeQuality(quality)} />
        </div>
        <div className="row">
          <CommentsForm
            commentaries={this.state.commentaries}
            changeComment={(comment) => this.changeComment(comment)}/>
        </div>
        <div className="row">
          {this.renderSubmitButton()}
        </div>
      </React.Fragment>
    );
  }
}

export default FormControler

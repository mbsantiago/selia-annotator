import React from 'react';
import AutocompleteTermInput from './AutocompleteTermInput';


class LabelsForm extends React.Component {
  constructor(props) {
      super(props);

      this.initialLabels = this.props.initialLabels;

      this.state = {
        blocked: {},
        selected: {}
      }

      this.terms = {};
  }


  componentDidMount() {
    this.initLabels();
  }

  initLabels() {
    if (this.initialLabels === null) return;

    let terms = {};
    let termDictionary = {};
    let entailedTerms = new Set();
    this.initialLabels.forEach(element => {
      terms[element.id] = element;
      termDictionary[element.term_type] = element;

      element.entailments.forEach(parent => {
        entailedTerms.add(parent.id);
      })
    });

    let allTermIDs = new Set(Object.keys(terms));
    let unmentionedTermIds = [...allTermIDs].filter(x => !entailedTerms.has(parseInt(x)));
    let unmentionedTerms = unmentionedTermIds.map(id => terms[id]);

    unmentionedTerms.forEach(element => this.updateLabel(element));
    this.terms = termDictionary;
  }

  render() {
    return (
      <div className="col m-3">
        <div className="row mb-2">
          {this.renderHeader()}
        </div>
        <div className="row container-fluid border rounded inner-shadow-sm p-2">
          {this.renderLabelForms()}
        </div>
      </div>
    );
  }

  renderHeader() {
    return (
      <p className="mb-0">
      Posibles etiquetas para <span className="text-primary">{this.props.eventType}</span>:
      </p>
    );
  }

  getEventInfo() {
    let eventTypesInfo = this.props.info.itemType.event_types;
    for (var index = 0; index < eventTypesInfo.length; index++) {
      let eventType = eventTypesInfo[index];

      if (eventType.name === this.props.eventType) {
        return eventType
      }
    }
  }

  renderLabelForms() {
    let eventsTypeInfo = this.getEventInfo()
    let termTypes = eventsTypeInfo.term_types;
    let termInputs = termTypes.map((termTypeInfo) => {
      let selected = this.state.selected[termTypeInfo.name] || '';

      let selectedTerm = null;
      if (selected !== '') {
        selectedTerm = this.terms[termTypeInfo.name] || null
      }

      return (
        <AutocompleteTermInput
          info={termTypeInfo}
          termType={termTypeInfo.name}
          updateLabel={(data) => this.updateLabel(data)}
          cleanForm={(data) => this.cleanForm(data)}
          urls={this.props.urls}
          blocked={(this.state.blocked[termTypeInfo.name] || '') !== ''}
          selected={selected}
          selectedTerm={selectedTerm}
        />
      );
    })

    return (
      <div className="col p-1" style={{position: 'relative'}}>
        <div className="container-fluid p-0" style={{overflowX: 'hidden', overflowY: 'hidden'}}>
        {termInputs}
        </div>
      </div>
    );
  }

  cleanForm(data) {
    this.setState(state => {
      delete state.selected[data.term_type];

      data.entailments.forEach(termInfo => {
        state.blocked[termInfo.term_type] = '';
        delete state.selected[termInfo.term_type];
      });

      return state;
    }, () => this.props.changeLabels(this.state.selected));
  }

  updateLabel(data) {
    let eventsTypeInfo = this.getEventInfo()
    let validTermTypes = new Set(eventsTypeInfo.term_types.map((e) => e.name));

    this.setState(state => {
      state.selected[data.term_type] = {
        id: data.id,
        value: data.value
      };

      data.entailments.forEach(termInfo => {
        if (validTermTypes.has(termInfo.term_type)) {
          state.blocked[termInfo.term_type] = data.term_type;
          state.selected[termInfo.term_type] = {
            id: termInfo.id,
            value: termInfo.value
          };
        }
      });

      return state;
    }, () => this.props.changeLabels(this.state.selected));
  }
}

export default LabelsForm

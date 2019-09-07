import React from 'react';

const WAIT_TIME_MS = 200;
const MAX_LOADED_TERM_INFO = 20;


class AutocompleteTermInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dropdown: false,
      resolve: [],
      selected: '',
      value: '',
      loading: ''
    }

    this.selected = null;
    this.resolving = null;

    this.loadingQueue = [];
    this.options = {}
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidUpdate() {
    if (this.props.blocked && this.state.selected !== '') {
      this.setState({dropdown: false, resolve: [], selected: '', value: ''});
    }

    if (this.props.selectedTerm !== null && this.selected === null) {
      this.selected = this.props.selectedTerm;
    }
  }

  render() {
    let termTypeInfo = this.props.info;

    return (
      <div className="container-fluid p-0 my-2"
        ref={(node) => {this.dropdownContainer = node;}}
      >
        <div className="row m-0">
          <div className="input-group">
            <div className="input-group-prepend">
              <span className="input-group-text">{termTypeInfo.name}</span>
            </div>
            {this.renderFormContent()}
          </div>
        </div>
        {this.renderDropdown()}
      </div>
    );
  }

  renderFormContent() {
    if (this.props.blocked) {
      return this.renderBlockedContent();
    }

    if (this.state.selected !== '' || (this.props.selected.value || '') !== '') {
      return this.renderSelected();
    }

    if (this.state.resolve.length > 0) {
      return this.renderResolvingContent();
    }

    return (
      <input
        type="text"
        className="form-control"
        value={this.state.value}
        onClick={() => this.setState({dropdown: true})}
        onChange={(e) => this.handleChange(e.target.value)}
      />
    );
  }

  renderBlockedContent() {
    return (
      <div className="form-control" style={{backgroundColor: 'var(--lavander-dark)'}}>
        {this.props.selected.value}
        {this.renderSearchButton(this.props.selected.value)}
      </div>
    );
  }

  renderSearchButton(content) {
    return (
      <span className="float-right mx-2 btn btn-link p-0" onClick={() => {this.searchContent(content)}}>
        <i className="fas fa-search"></i>
      </span>
    )
  }

  searchContent(content) {
    window.open(`https://www.google.com/search?q=${content}`, '_blank');
  }

  renderSelected() {
    let selected = this.props.selected.value || this.state.selected;

    return (
        <div className="form-control" style={{backgroundColor: 'var(--lavander)'}}>
          {selected}
          {this.renderSearchButton(selected)}
          <span
            className="float-right btn btn-link p-0"
            onClick={() => this.resetForm()}
          >
            <i className="fas fa-times"></i>
          </span>
        </div>
    );
  }

  resetForm() {
    this.props.cleanForm(this.selected);
    this.selected = null;
    this.setState({dropdown: false, selected:'', value: ''});
  }

  renderResolvingDropdown() {
    let synonyms = this.state.resolve;
    return synonyms.map((termInfo) => {
      return (
        <div
          className="dropdown-item"
          onClick={() => this.resolveSynonym(termInfo.target)}
        >
          {termInfo.target.value}
        </div>
      );
    });
  }

  resolveSynonym(termInfo) {
    let value = `${this.resolving.value} => ${termInfo.value}`;
    this.selected = termInfo;
    this.props.updateLabel(termInfo);
    this.resolving = null;
    this.setState({selected: value, dropdown: false, resolve: []});
  }

  renderResolvingContent() {
    return (
        <div className="form-control bg-light text-danger">
          Multiples sinónimos encontrados. Favor de seleccionar uno
        </div>
    );
  }

  getOptionsList() {
    return this.options[this.state.value].results;
  }

  renderDropdownContents() {
    if (this.state.resolve.length > 0) {
      return this.renderResolvingDropdown()
    }

    if (this.state.value === '') {
      return this.renderInitialOption();
    }

    if (!(this.state.value in this.options) && (this.state.loading === this.state.value)) {
      return this.renderLoadingOption();
    }

    if (!(this.state.value in this.options)) {
      return this.renderWrittingOption();
    }

    let options = this.getOptionsList()
    if (options.length === 0) {
      return this.renderEmptyOption()
    }

    return this.renderOptionsList(options);
  }

  renderOptionsList(options) {
    let values = new Set();
    let repetitions = new Set();

    options.forEach((termInfo) => {
        if (values.has(termInfo.value)) {
          repetitions.add(termInfo.value);
        } else {
          values.add(termInfo.value);
        }
    })

    let html_options = options.map((termInfo) => {
      let extra = repetitions.has(termInfo.value) ? ` (${termInfo.scope})` : '';

      return (
        <div
          className="dropdown-item"
          onClick={() => this.selectOption(termInfo)}
        >
          {termInfo.value}{extra}
        </div>
      );
    });

    if (this.state.loading === this.state.value) {
      let loading_bar = (
        <div
          className="dropdown-item bg-light"
          onClick={() => this.loadMoreOptions()}
        >
          <span className="btn btn-link text-muted">Cargando información...</span>
        </div>
      );
      html_options.push(loading_bar);
    } else if (this.options[this.state.value].next) {
      let more_option = (
        <div
          className="dropdown-item"
          onClick={() => this.loadMoreOptions()}
        >
          <span className="btn btn-link">Cargar más opciones</span>
        </div>
      );
      html_options.push(more_option);
    }

    return html_options;
  }

  selectOption(termInfo) {
    let synonyms = termInfo.synonyms;
    let selected = termInfo;
    let selectedValue = selected.value;

    if (synonyms.length > 0) {
      if (synonyms.length > 1) {
        this.resolving = termInfo;
        this.setState({resolve: synonyms});
        return;
      }

      selected = synonyms[0].target;
      selectedValue = `${selectedValue} => ${selected.value}`;
    }

    this.props.updateLabel(selected);
    this.selected = selected;
    this.setState({selected: selectedValue, dropdown: false});
  }

  renderDropdown() {
    if (this.props.blocked) {
      return '';
    }

    if (this.state.dropdown) {
      return (
        <div className="row m-0">
          <div className="autocomplete-dropdown w-100 border bg-white rounded">
            {this.renderDropdownContents()}
          </div>
        </div>
      );
    }

    return '';
  }

  renderInitialOption() {
    return (
      <div className="dropdown-item bg-light text-muted">
        Escribe algo para empezar a buscar...
      </div>
    );
  }

  renderEmptyOption() {
    return (
      <div className="dropdown-item bg-light text-muted">
        Sin resultados.
      </div>
    );
  }

  renderLoadingOption() {
    return (
      <div className="dropdown-item bg-light text-muted">
        Cargando información...
      </div>
    );
  }

  renderWrittingOption() {
    return (
      <div className="dropdown-item bg-light">
      &nbsp;
      </div>
    );
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside(event) {
    if (this.dropdownContainer && !this.dropdownContainer.contains(event.target)) {
      this.setState({dropdown: false})
    }
  }

  handleChange(value) {
    this.setState({value: value}, () => {
      setTimeout(() => {
        if (this.state.value === value && value !== '') {
          this.queryTerms(value)
        }
      }, WAIT_TIME_MS)
    })
  }

  queryTerms(term) {
    if (term in this.options) {
      return;
    }

    this.loadingQueue.push(term);

    if (this.loadingQueue.length > MAX_LOADED_TERM_INFO) {
      let first = this.loadingQueue.shift(0);
      delete this.options[first];
    }

    this.setState({loading: term}, () => {
      let termType = this.props.termType;
      let url = this.props.urls['terms_autocomplete'];
      let fullUrl = url + encodeURI(`?term_type=${termType}&value__icontains=${term}`);

      fetch(fullUrl)
        .then(result => {
          return result.json();
        })
        .then(result => {
          this.options[term] = {
            count: result.count,
            next: result.next,
            results: result.results
          };

          if (term === this.state.value) {
            this.setState({loading: ''})
          }
        })
    })
  }

  loadMoreOptions() {
    let url = this.options[this.state.value].next;
    let currentValue = this.state.value;

    this.setState({loading: currentValue}, () => {
      fetch(url)
        .then(result => result.json())
        .then(result => {
          this.options[currentValue].next = result.next;
          this.options[currentValue].results = this.options[currentValue].results.concat(result.results);
          this.setState({loading: ''})
        })
    })
  }
}


export default AutocompleteTermInput

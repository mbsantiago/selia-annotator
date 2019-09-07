import React from 'react';
import Controler from './forms/Controler';
import VisualizerControler from './visualizer/Controler';


class Annotator extends React.Component {
  constructor(props) {
    super(props);

    this.urls = this.props.urls;

    this.downloading = {
      itemType: new Set(),
      eventType: new Set(),
      item: new Set(),
    }
    this.annotationData = {
      item: props.info.item,
    };

    this.state = {
      phase: 'list',
      ready: {
        downloads: false,
        submit: false,
      },
      info: {
        itemType: {},
        eventType: {},
        item: null,
        termType: {},
        mimeType: {},
        annotationTypes: {},
        annotations: {}
      },
      current: {
        item: props.info.item,
        itemType: props.info.itemType,
        annotation: null,
      },
    }
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="row p-2">
          <div className="col-7 p-2">
            <div className="container-fluid w-100 description_object">
              <VisualizerControler
                ready={this.state.ready}
                info={this.state.info}
                urls={this.props.urls}
                phase={this.state.phase}
                current={this.state.current}
                setAnnotationInfo={(data) => this.setAnnotationData(data)}
              />
            </div>
          </div>
          <div className="col-5 p-2">
            <div className="container-fluid w-100 description_object">
              <Controler
                ready={this.state.ready}
                info={this.state.info}
                urls={this.props.urls}
                phase={this.state.phase}
                setFormInfo={(data) => this.setAnnotationData(data)}
                submit={() => this.submit()}
              />
            </div>
          </div>
        </div>
      </div>
    );
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

    if ('comment' in data) {
      this.annotationData['commentaries'] = data['comment'];
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

    console.log(this.annotationData);

    this.checkIfReady();
  }

  checkIfReady(){
    let ready = true;
    if (!('annotation_type' in this.annotationData)) ready = false;
    if (!('annotation' in this.annotationData)) ready = false;
    if (!('event_type' in this.annotationData)) ready = false;
    if (!('labels' in this.annotationData) || this.annotationData.labels.size === 0) ready = false;

    if (!(this.state.ready.submit) && ready) {
      this.setState(state => {
        state.ready.submit = true;
        return state;
      })
    }

    if (this.state.ready.submit && !(ready)) {
      this.setState(state => {
        state.ready.submit = false;
        return state;
      })
    }
  }

  checkDoneDownloading() {
    return (
      this.downloading.item.size === 0 &
      this.downloading.itemType.size === 0 &
      this.downloading.eventType.size === 0
    )
  }

  getItemInfo(pk) {
    this.downloading.item.add(pk)
    let url = this.urls['item'].replace('item_pk', pk);

    return fetch(url)
      .then(result => {
          return result.json(); })
      .then(result => {
        this.setState((state) => {
          state.info.item[pk] = result;

          this.downloading.item.delete(pk)
          if (this.checkDoneDownloading()) {
            state.ready.downloads = true;
          }

          return state;
        });
      })
  }

  updateMimeTypeInfo(result, state) {
    let mimeTypes = result['mime_types'];
    mimeTypes.forEach((mimeType) => {
      let name = mimeType['mime_type'];
      if (!(name in state.info.mimeType)) {
        state.info.mimeType[mimeType['mime_type']] = mimeType;
      }
    });
  }

  getAnnotationTypesInfo() {
    let url = this.urls['annotation_types'] + '?page_size=99'

    fetch(url)
      .then(result => result.json())
      .then(result => {
        this.setState(state => {
          state.info.annotationTypes = result.results;
          return state;
        })
      })
  }

  getItemTypeInfo(pk) {
    this.downloading.itemType.add(pk)
    let url = this.urls['item_type'].replace('item_type_pk', pk);

    fetch(url)
      .then(result => {
          return result.json();})
      .then(result => {
        this.setState((state) => {
          state.info.itemType[pk] = result;
          this.updateMimeTypeInfo(result, state)

          this.downloading.itemType.delete(pk)
          if (this.checkDoneDownloading()) {
            state.ready.downloads = true;
          }

          return state;
        }, () => {
          this.updateEventInfo(pk);
        });
      })
  }

  getEventTypeInfo(info) {
    this.downloading.eventType.add(info.name)

    fetch(info.url)
      .then(result => {
        return result.json();})
      .then(result => {
        this.setState((state) => {
          state.info.eventType[info.name] = result;

          this.downloading.eventType.delete(info.name)
          if (this.checkDoneDownloading()) {
            state.ready.downloads = true;
          }

          return state;
        })
      })
  }

  submit() {
    $.ajax({
      type: "POST",
      url: this.urls.annotations,
      data: JSON.stringify(this.annotationData),
      contentType: 'application/json',
    }).then(
      console.log('DONE')
    )
  }

  updateEventInfo(pk) {
    let eventTypes = this.state.info.itemType[pk].event_types;
    eventTypes.forEach((eventTypeInfo) => {
      if (!(eventTypeInfo in this.state.info.eventType)) {
        this.getEventTypeInfo(eventTypeInfo)
      }
    })
  }

  componentDidMount() {
    let itemPk = this.props.info['item'];
    let itemTypePk = this.props.info['item_type'];

    this.getItemTypeInfo(itemTypePk);
    this.getItemInfo(itemPk);
    this.getAnnotations(itemPk, 1);
    this.getAnnotationTypesInfo();
  }
}

export default Annotator;

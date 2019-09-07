import React from 'react';


class EventTypeBar extends React.Component {
  renderButton(eventInfo) {
    let className = "btn selia-option-button mx-2 shadow"

    if (this.props.eventType === eventInfo.name) {
      className += ' btn-primary'
    } else {
      className += ' btn-light'
    }

    let image = ''
    if (eventInfo.icon) {
      image = (
        <img className="mb-1" src={eventInfo.icon} alt="Logo tipo de evento" style={{width: '100%'}}/>
      )
    }

    return (
      <div
        className={className}
        onClick={() => this.props.changeEventType(eventInfo.name)}
      >
        <div className="col" style={{width: '3em'}}>
          <div className="row">
            {image}
          </div>
          <div className="row">
            <small>
              {eventInfo.name}
            </small>
          </div>
        </div>
      </div>
    );
  }

  renderEventButtons() {
    let eventTypes = this.props.info.itemType.event_types;
    let eventButtons = eventTypes.map((info) => this.renderButton(info));

    return (
      <div>
        {eventButtons}
      </div>
    );
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col">
            <p>Selecciona el tipo de evento a anotar:</p>
          </div>
        </div>
        <div className="row">
          <div className="col">
          {this.renderEventButtons()}
          </div>
        </div>
      </div>
    );
  }
}

export default EventTypeBar

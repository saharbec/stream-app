import React from 'react';
import flv from 'flv.js';
import { connect } from 'react-redux';
import { fetchStream } from '../../actions';


class StreamShow extends React.Component {
  constructor(props) {
    super(props);

    this.videoRef = React.createRef();
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    
    this.props.fetchStream(id);
    this.buildPlayer();
  }
  
  componentDidUpdate() {
    this.buildPlayer();
  }

  componentWillUnmount() {
    this.player.destroy();
  }

  buildPlayer() {
    if(this.player || !this.props.stream) {
      return;
    }
    
    console.log(this.videoRef);
    const { id } = this.props.match.params;
    this.player = flv.createPlayer({
      type: 'flv',
      url: `http://localhost:8000/live/${id}.flv`
    });
    this.player.attachMediaElement(this.videoRef.current);
    this.player.load();
  }

  renderContent() {
    if(!this.props.stream) {
      return 'Loading...';
    }
    
    const { title,description } = this.props.stream;
    return (
      <div>
        <video ref={this.videoRef} style={{width:'100%'}} controls />
        <h4>Title</h4>
        {title}
        <h4>Description</h4>
        {description}
      </div>
    )
  }

  render() {
  return (
    <div> 
        {this.renderContent()}
    </div>
  )};
}

const mapStateToProps = (state, ownProps) => {
  return { stream: state.streams[ownProps.match.params.id] }
}

export default connect(mapStateToProps, {fetchStream })(StreamShow);
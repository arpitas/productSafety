import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';

export class ScorePage extends Component {
  static propTypes = {
    crawl: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    list: PropTypes.array,
  };

  static defaultProps = {
    list: [],
  };

  constructor(props) {
    super(props);
    this.state = {value: '', as: []};
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value, as: event.target.value.split(',').map(x=>x.trim())});
    this.props.crawl.ing = this.state.as;
  }

  render() {

    this.list = this.props.crawl.scoreList;
    return (
      <div className="crawl-score-page">
      <input type="text" value={this.props.crawl.ing} onChange={this.handleChange} />
      <input type="text" value={this.state.value} onChange={this.handleChange} />

      <button onClick={this.props.actions.scrape}>Submit
      {this.props.crawl.scrapePending ? 'Fetching...' : 'Fetch list'}
      </button>

      {this.props.crawl.scoreMap}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    crawl: state.crawl,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...actions }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ScorePage);

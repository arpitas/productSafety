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
    this.setState({value: event.target.value, as: event.target.value.split(',')});
    this.props.crawl.ing = this.state.as;
  }

  render() {
    return (
      <div className="crawl-score-page">
        <input type="text" value={this.props.crawl.ing} onChange={this.handleChange} />
        <input type="text" value={this.state.value} onChange={this.handleChange} />

        <button onClick={this.props.actions.scrape}>Submit</button>
        
        <ul className="crawl-score-list">
        {
          this.props.crawl.scoreList > 0 ?
            this.props.crawl.scoreList.map(item => <li key={item.data.id}><a href={item.data.url}>{item.data.title}</a></li>)
            : <li className="no-items-tip">No items yet.</li>
        }
      </ul>


      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    crawl: state.crawl,
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...actions }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ScorePage);

const React = require('react');
const PropTypes = require('prop-types');
const FontAwesome = require('react-fontawesome');

const Actions = require('../actions');
const BreadcrumbStore = require('../stores/breadcrumb-store');

const BEM_BASE = 'ag-header-breadcrumb';
const ICON_TYPE = {Array: '[ ]', Object: '{ }' };

class BreadcrumbComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = { path: [], types: [], collection: props.collection };
    this.onTabClicked = this.onTabClicked.bind(this);
    this.renderTabs = this.renderTabs.bind(this);
  }

  componentDidMount() {
    this.unsubscribeBreadcrumbStore = BreadcrumbStore.listen(this.breadcrumbStoreChanged.bind(this));
  }

  componentWillUnmount() {
    this.unsubscribeBreadcrumbStore();
  }

  onTabClicked(index) {
    Actions.pathChanged(
      this.state.path.slice(0, index + 1),
      this.state.types.slice(0, index + 1)
    );
  }

  onHomeClicked() {
    this.state.path = [];
    this.state.types = [];
    Actions.pathChanged([], []);
  }

  /**
   * When the BreadcrumbStore changes, update the state.
   *
   * @param {Object} params - Can contain collection, path, and/or types.
   *  collection {String} - The collection name.
   *  path {Array} - The array of field names/indexes.
   *  types {Array} - The array of types for each segment of the path array.
   */
  breadcrumbStoreChanged(params) {
    this.setState(params);
  }

  renderTabs() {
    return (
      <div>
      </div>
    );
  }

  render() {
    return (
      <div className={`${BEM_BASE}-container`}>
        <div onClick={this.onHomeClicked.bind(this)} className={`${BEM_BASE}-tab`}>
          <FontAwesome name="home" className={`${BEM_BASE}-home-icon`}/>
          {this.state.collection}
        </div>
        {this.state.path.map((name, i) => {
          return <span key={i} onClick={() => this.onTabClicked(i)} className={`${BEM_BASE}-tab`}>{name} {ICON_TYPE[this.state.types[i]]}</span>;
        })}
      </div>
    );
  }
}

BreadcrumbComponent.propTypes = {
  collection: PropTypes.string.isRequired
};

BreadcrumbComponent.defaultPropTypes = {
  collection: ''
};

BreadcrumbComponent.displayName = 'BreadcrumbComponent';

module.exports = BreadcrumbComponent;

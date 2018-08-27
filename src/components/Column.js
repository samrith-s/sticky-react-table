import PropTypes from 'prop-types';

import { ColumnDisplayName } from '../constants';

const Column = () => {
  return null;
};

Column.propTypes = {
  alwaysVisible: PropTypes.bool
};

Column.defaultProps = {
  alwaysVisible: false
};

Column.displayName = ColumnDisplayName;

export default Column;

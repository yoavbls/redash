/* eslint-disable no-console */
import PropTypes from 'prop-types';

export default function ShowExpression({ expression, children }) {
  try {
    if (eval(expression)) {
      return children;
    }
  } catch (e) {
    console.log('Error in expression evaluate', e);
  }
  return null;
}

ShowExpression.propTypes = {
  expression: PropTypes.string,
};

ShowExpression.defaultProps = {
  expression: false,
};

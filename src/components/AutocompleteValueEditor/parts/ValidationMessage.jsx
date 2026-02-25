import React from 'react';
import PropTypes from 'prop-types';

/**
 * Validation error message component
 */
const ValidationMessage = ({ error, fieldName }) => {
  if (!error) {
    return null;
  }

  return (
    <div 
      id={`validation-${fieldName || 'value'}`}
      className="autocomplete-value-editor__error-message"
      role="alert"
    >
      {error}
    </div>
  );
};

ValidationMessage.propTypes = {
  error: PropTypes.string,
  fieldName: PropTypes.string,
};

export default ValidationMessage;

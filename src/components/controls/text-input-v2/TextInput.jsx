/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import './TextInput.css'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faKey, faUser } from '@fortawesome/free-solid-svg-icons'
import classnames from 'classnames'

function TextInput({
  isPlaceholderFixed,
  placeholder,
  loginType,
  inputType,
  value,
  onChange,
  onKeyDown,
  disabled,
  readOnly,
  tabIndex,
  boxStyles,
  inputStyles,
  placeholderStyles,
  title,
  forwardedRef,
  autoFocus,
  maxLength
}) {
  return (
    <div className={classnames({
      'input-box-container-v2': true,
      disabled
    })} style={{ ...boxStyles }}>
      {
        loginType !== 'none'
          ? loginType === 'email'
            ? <div className="login-type-icon"><FontAwesomeIcon icon={faEnvelope} color='rgba(0,0,0,0.5)' /></div>
            : loginType === 'username'
              ? <div className="login-type-icon"><FontAwesomeIcon icon={faUser} color='rgba(0,0,0,0.5)' /></div>
              : loginType === 'password'
                ? <div className="login-type-icon"><FontAwesomeIcon icon={faKey} color='rgba(0,0,0,0.5)' /></div>
                : ''
          : ''
      }
      {
        isPlaceholderFixed &&
        <div className='fixed-placeholder' style={{ ...placeholderStyles }}>{placeholder}</div>
      }
      <input
        ref={forwardedRef}
        placeholder={isPlaceholderFixed ? '' : placeholder}
        type={inputType}
        style={{ ...inputStyles }}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        disabled={disabled}
        readOnly={readOnly}
        tabIndex={tabIndex}
        title={title}
        autoFocus={autoFocus}
        maxLength={maxLength}
      />
    </div>
  )
}

TextInput.propTypes = {
  isPlaceholderFixed: PropTypes.bool,
  placeholder: PropTypes.string,
  loginType: PropTypes.string,
  inputType: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  tabIndex: PropTypes.number,
  boxStyles: PropTypes.object,
  inputStyles: PropTypes.object,
  title: PropTypes.string,
  placeholderStyles: PropTypes.object,
  forwardedRef: PropTypes.oneOfType([PropTypes.object, PropTypes.any]),
  autoFocus: PropTypes.bool,
  maxLength: PropTypes.number
}

export default TextInput

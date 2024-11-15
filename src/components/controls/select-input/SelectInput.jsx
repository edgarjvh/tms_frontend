import React, { useState } from 'react'
import './SelectInput.css'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { useTransition, animated } from 'react-spring'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faCopy } from '@fortawesome/free-solid-svg-icons'
import Popup from '../popup/Popup'
import MaskedInput from 'react-text-mask'

function SelectInput({
  tabIndex = 1,
  placeholder = '',
  isPlaceholderFixed = false,
  readOnly = false,
  disabled = false,
  value = '',
  onChange = () => { },
  onEnter = () => { },
  onTab = () => { },
  onInput = () => { },
  onBlur = () => { },
  onDropdownClick = () => { },
  onPopupClick = () => { },
  boxStyles = {},
  inputStyles = {},
  popupStyles = { left: '0px' },
  popupPosition = 'vertical below right',
  popupId = '',
  placeholderStyles = {},
  title = '',
  autoFocus = false,
  maxLength = 500,
  refs = {},
  isDropdownEnabled = false,
  items = [],
  getItems = () => { },
  setItems = () => { },
  noStopPropagationOnEsc = false,
  avoidCheckItemsOnTab = true,
  validateToSave = () => { },
  labelType = 'default',
  showingHandler = 'array',
  showingValue = false,
  setShowingValue = () => { },
  triggerField = false,
  transitionFromTop = 'calc(100% + 7px)',
  transitionEnterTop = 'calc(100% + 12px)',
  transitionLeaveTop = 'calc(100% + 7px)',
  mode = 'default',
  isCopyEnabled = false,
  overridenEsc = false,
  onEscKey = () => { }
}) {
  const [showCopyButton, setShowCopyButton] = useState(false)

  const popupTransition = useTransition(isDropdownEnabled && (showingHandler === 'array' ? items.length > 0 : showingValue), {
    from: { opacity: 0, top: transitionFromTop },
    enter: { opacity: 1, top: transitionEnterTop },
    leave: { opacity: 0, top: transitionLeaveTop },
    config: { duration: 100 },
    reverse: isDropdownEnabled && (showingHandler === 'array' ? items.length > 0 : showingValue)
  })

  return (
    <div className={classnames({
      'select-box-container-current': true,
      disabled
    })}
      style={{ ...boxStyles }}
      onMouseEnter={() => { setShowCopyButton(true) }}
      onFocus={() => { setShowCopyButton(true) }}
      onBlur={() => { window.setTimeout(() => { setShowCopyButton(false) }, 500) }}
      onMouseLeave={() => { setShowCopyButton(false) }}
    >
      {
        isPlaceholderFixed &&
        <div className='fixed-placeholder' style={{ ...placeholderStyles }}>{placeholder}</div>
      }
      {
        labelType === 'phone'
          ? <MaskedInput
            mask={[/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
            guide={true}
            ref={refs?.refInput}
            placeholder={isPlaceholderFixed ? '' : placeholder}
            style={{ ...inputStyles }}
            disabled={disabled}
            readOnly={readOnly}
            tabIndex={tabIndex}
            title={title}
            autoFocus={autoFocus}
            maxLength={maxLength}
            value={value}
            onChange={onChange}
            onKeyDown={e => {
              const key = e.key.toLowerCase()

              switch (key) {
                // case 'arrowleft':
                case 'arrowup':
                  if (isDropdownEnabled) {
                    e.preventDefault()
                    if ((showingHandler !== 'array' && showingValue && items.length > 0) || (showingHandler === 'array' && items.length > 0)) {
                      const selectedIndex = items.findIndex(item => item.selected)

                      if (selectedIndex === -1) {
                        setItems(
                          items.map((item, index) => {
                            item.selected = index === 0
                            return item
                          })
                        )
                      } else {
                        setItems(
                          items.map((item, index) => {
                            if (selectedIndex === 0) {
                              item.selected = index === items.length - 1
                            } else {
                              item.selected = index === selectedIndex - 1
                            }
                            return item
                          })
                        )
                      }

                      refs.refPopupItems.current.map((r) => {
                        if (r && r.classList.contains('selected')) {
                          r.scrollIntoView({
                            behavior: 'auto',
                            block: 'center',
                            inline: 'nearest'
                          })
                        }
                        return true
                      })
                    } else {
                      getItems()

                      window.setTimeout(() => {
                        refs.refPopupItems.current.map((r) => {
                          if (r && r.classList.contains('selected')) {
                            r.scrollIntoView({
                              behavior: 'auto',
                              block: 'center',
                              inline: 'nearest'
                            })
                          }
                          return true
                        })
                      }, 50)
                    }
                  }
                  break

                // case 'arrowright':
                case 'arrowdown':
                  if (isDropdownEnabled) {
                    e.preventDefault()
                    if ((showingHandler !== 'array' && showingValue && items.length > 0) || (showingHandler === 'array' && items.length > 0)) {
                      const selectedIndex = items.findIndex(item => item.selected)

                      if (selectedIndex === -1) {
                        setItems(
                          items.map((item, index) => {
                            item.selected = index === 0
                            return item
                          })
                        )
                      } else {
                        setItems(
                          items.map((item, index) => {
                            if (selectedIndex === items.length - 1) {
                              item.selected = index === 0
                            } else {
                              item.selected = index === selectedIndex + 1
                            }
                            return item
                          })
                        )
                      }

                      refs.refPopupItems.current.map((r) => {
                        if (r && r.classList.contains('selected')) {
                          r.scrollIntoView({
                            behavior: 'auto',
                            block: 'center',
                            inline: 'nearest'
                          })
                        }
                        return true
                      })
                    } else {
                      getItems()

                      window.setTimeout(() => {
                        refs.refPopupItems.current.map((r) => {
                          if (r && r.classList.contains('selected')) {
                            r.scrollIntoView({
                              behavior: 'auto',
                              block: 'center',
                              inline: 'nearest'
                            })
                          }
                          return true
                        })
                      }, 50)
                    }
                  }
                  break

                case 'escape':
                  if (overridenEsc) {
                    onEscKey(e)
                  } else {
                    if (!noStopPropagationOnEsc) {
                      if (labelType === 'array') {
                        setItems([])
                      } else {
                        setShowingValue(false)
                      }
                      e.stopPropagation()
                    }
                  }

                  break

                case 'enter':
                  onEnter()
                  break

                case 'tab':
                  if (avoidCheckItemsOnTab) {
                    onTab(e)
                  } else {
                    if ((showingHandler === 'array' && items.length > 0) || showingValue) {
                      e.preventDefault()
                      onTab(e)
                    } else {
                      if (triggerField) {
                        validateToSave(e)
                      }
                    }
                  }
                  break

                default:
                  break
              }
            }}
            onBlur={onBlur}
            onInput={onInput}
          />
          : <input
            ref={refs?.refInput}
            placeholder={isPlaceholderFixed ? '' : placeholder}
            style={{ ...inputStyles }}
            disabled={disabled}
            readOnly={readOnly}
            tabIndex={tabIndex}
            title={title}
            autoFocus={autoFocus}
            maxLength={maxLength}
            value={value}
            onChange={onChange}
            onKeyDown={e => {
              const key = e.key.toLowerCase()

              switch (key) {
                // case 'arrowleft':
                case 'arrowup':
                  if (isDropdownEnabled) {
                    e.preventDefault()
                    if ((showingHandler !== 'array' && showingValue && items.length > 0) || (showingHandler === 'array' && items.length > 0)) {
                      const selectedIndex = items.findIndex(item => item.selected)

                      if (selectedIndex === -1) {
                        setItems(
                          items.map((item, index) => {
                            item.selected = index === 0
                            return item
                          })
                        )
                      } else {
                        setItems(
                          items.map((item, index) => {
                            if (selectedIndex === 0) {
                              item.selected = index === items.length - 1
                            } else {
                              item.selected = index === selectedIndex - 1
                            }
                            return item
                          })
                        )
                      }

                      refs.refPopupItems.current.map((r) => {
                        if (r && r.classList.contains('selected')) {
                          r.scrollIntoView({
                            behavior: 'auto',
                            block: 'center',
                            inline: 'nearest'
                          })
                        }
                        return true
                      })
                    } else {
                      getItems()

                      window.setTimeout(() => {
                        refs.refPopupItems.current.map((r) => {
                          if (r && r.classList.contains('selected')) {
                            r.scrollIntoView({
                              behavior: 'auto',
                              block: 'center',
                              inline: 'nearest'
                            })
                          }
                          return true
                        })
                      }, 50)
                    }
                  }
                  break

                // case 'arrowright':
                case 'arrowdown':
                  if (isDropdownEnabled) {
                    e.preventDefault()
                    if ((showingHandler !== 'array' && showingValue && items.length > 0) || (showingHandler === 'array' && items.length > 0)) {
                      const selectedIndex = items.findIndex(item => item.selected)

                      if (selectedIndex === -1) {
                        setItems(
                          items.map((item, index) => {
                            item.selected = index === 0
                            return item
                          })
                        )
                      } else {
                        setItems(
                          items.map((item, index) => {
                            if (selectedIndex === items.length - 1) {
                              item.selected = index === 0
                            } else {
                              item.selected = index === selectedIndex + 1
                            }
                            return item
                          })
                        )
                      }

                      refs.refPopupItems.current.map((r) => {
                        if (r && r.classList.contains('selected')) {
                          r.scrollIntoView({
                            behavior: 'auto',
                            block: 'center',
                            inline: 'nearest'
                          })
                        }
                        return true
                      })
                    } else {
                      getItems()

                      window.setTimeout(() => {
                        refs.refPopupItems.current.map((r) => {
                          if (r && r.classList.contains('selected')) {
                            r.scrollIntoView({
                              behavior: 'auto',
                              block: 'center',
                              inline: 'nearest'
                            })
                          }
                          return true
                        })
                      }, 50)
                    }
                  }
                  break

                case 'escape':
                  if (overridenEsc) {
                    onEscKey(e)
                  } else {
                    if (!noStopPropagationOnEsc) {
                      if (showingHandler === 'array') {
                        setItems([])
                      } else {
                        setShowingValue(false)
                      }
                      e.stopPropagation()
                    }
                  }

                  break

                case 'enter':
                  onEnter()
                  break

                case 'tab':
                  if (avoidCheckItemsOnTab) {
                    onTab(e)
                  } else {
                    if ((showingHandler === 'array' && items.length > 0) || showingValue) {
                      e.preventDefault()
                      onTab(e)
                    } else {
                      if (triggerField) {
                        validateToSave(e)
                      }
                    }
                  }
                  break

                default:
                  break
              }
            }}
            onBlur={onBlur}
            onInput={onInput}
          />
      }

      {(isCopyEnabled && showCopyButton && refs?.refInput?.current && value !== '') &&
        <FontAwesomeIcon className='copy-button' icon={faCopy} onClick={(e) => {
          e.stopPropagation()
          navigator.clipboard.writeText(refs.refInput.current.value)
        }} />}

      {mode !== 'default' && <div className="input-mode">{mode}</div>}

      {isDropdownEnabled && <FontAwesomeIcon
        className="dropdown-button"
        icon={faCaretDown}
        onClick={(e) => {
          window.setTimeout(() => {
            if (showingHandler === 'array') {
              if (items.length > 0) {
                setItems([])
              } else {
                onDropdownClick(e)
              }
            } else {
              if (showingValue) {
                setShowingValue(false)
              } else {
                onDropdownClick(e)
              }
            }

            if (labelType === 'phone') {
              refs.refInput.current.inputElement.focus()
            } else {
              refs.refInput.current.focus()
            }
          }, 100)
        }}
      />}

      {popupTransition(
        (style, item) =>
          item && <animated.div
            className="contextual-container"
            id={`contextual-container-${popupId}`}
            style={{
              ...style,
              // left: '-50%',
              // display: 'block',
              ...popupStyles
            }}
            ref={refs?.refDropdown}
          >
            <Popup
              items={items}
              labelType={labelType}
              onPopupClick={onPopupClick}
              popupPosition={popupPosition}
              popupStyles={popupStyles}
              refPopupItems={refs?.refPopupItems}
            />
          </animated.div>
      )}
    </div>
  )
}

SelectInput.propTypes = {
  tabIndex: PropTypes.number,
  placeholder: PropTypes.string,
  isPlaceholderFixed: PropTypes.bool,
  readOnly: PropTypes.bool,
  disabled: PropTypes.bool,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  onChange: PropTypes.func,
  onEnter: PropTypes.func,
  onTab: PropTypes.func,
  onInput: PropTypes.func,
  onBlur: PropTypes.func,
  onDropdownClick: PropTypes.func,
  onPopupClick: PropTypes.func,
  boxStyles: PropTypes.object,
  inputStyles: PropTypes.object,
  popupStyles: PropTypes.object,
  popupPosition: PropTypes.string,
  popupId: PropTypes.string,
  placeholderStyles: PropTypes.object,
  title: PropTypes.string,
  autoFocus: PropTypes.bool,
  maxLength: PropTypes.number,
  refs: PropTypes.object,
  isDropdownEnabled: PropTypes.bool,
  items: PropTypes.array,
  getItems: PropTypes.func,
  setItems: PropTypes.func,
  noStopPropagationOnEsc: PropTypes.bool,
  avoidCheckItemsOnTab: PropTypes.bool,
  validateToSave: PropTypes.func,
  labelType: PropTypes.string,
  showingHandler: PropTypes.string,
  showingValue: PropTypes.bool,
  setShowingValue: PropTypes.func,
  triggerField: PropTypes.bool,
  transitionFromTop: PropTypes.string,
  transitionEnterTop: PropTypes.string,
  transitionLeaveTop: PropTypes.string,
  mode: PropTypes.string,
  isCopyEnabled: PropTypes.bool,
  overridenEsc: PropTypes.bool,
  onEscKey: PropTypes.func
}

export default SelectInput

/* eslint-disable indent */
import React from 'react'
import './Popup.css'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretRight } from '@fortawesome/free-solid-svg-icons'

function Popup({
  popupPosition = 'vertical below',
  popupStyles = {},
  items = [],
  onPopupClick = () => { },
  refPopupItems = null,
  labelType = 'default'
}) {
  return (
    <div
      className={`contextual-popup ${popupPosition}`}
      style={{
        height: popupStyles?.height || 150
      }}
    >
      <div className="contextual-popup-content">
        <div className="contextual-popup-wrapper">
          {items.map((item, index) => {
            const mochiItemClasses = classnames({
              'contextual-popup-item': true,
              selected: item.selected
            })

            return (
              <div
                key={index}
                className={mochiItemClasses}
                id={item.id || ''}
                onClick={() => {
                  onPopupClick(item)
                }}
                ref={(element) => refPopupItems.current.push(element)}
              >
                {
                  (labelType || 'default') === 'name'
                    ? <span className='item-text' title={item?.name || ''}>{item?.name || ''}</span>
                    : (labelType || 'default') === 'contact_first_last'
                      ? <span className='item-text' title={`${(item?.first_name || '')} ${(item?.last_name || '')}`.trim()}>{`${(item?.first_name || '')} ${(item?.last_name || '')}`.trim()}</span>
                      : (labelType || 'default') === 'phone'
                        ? <><span className="item-text">{item?.phone || ''}</span><span className='item-type'>({item?.type || ''})</span></>
                        : (labelType || 'default') === 'email'
                          ? <><span className="item-text" title={item?.email || ''}>{item?.email || ''}</span><span className='item-type'>({item?.type || ''})</span></>
                          : <span className='item-text'>{item?.name || ''}</span>
                }
                {item.selected && <FontAwesomeIcon className="dropdown-selected"
                  icon={faCaretRight} />}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

Popup.propTypes = {
  popupPosition: PropTypes.string,
  popupStyles: PropTypes.object,
  items: PropTypes.array,
  onPopupClick: PropTypes.func,
  refPopupItems: PropTypes.any,
  labelType: PropTypes.string
}

export default Popup

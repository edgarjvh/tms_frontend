/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import './CarrierList.css';
import { useTransition, animated } from 'react-spring';
import Loader from 'react-loader-spinner';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import axios from 'axios';

const CarrierList = (props) => {
  const refCarrierListContainer = useRef();
  const [isLoading, setIsLoading] = useState(false)

  const loadingTransition = useTransition(isLoading, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    reverse: isLoading,
  });

  useEffect(() => {
    refCarrierListContainer.current.focus({ preventScroll: true });
  }, [])

  return (
    <div className="panel-content" tabIndex={0} ref={refCarrierListContainer} onKeyDown={e => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        props.closingCallback();
      }
    }}>
      <div className="drag-handler" onClick={e => e.stopPropagation()}></div>
      <div className="title">{props.title}</div><div className="side-title"><div>{props.title}</div></div>
      <div className="close-btn" title="Close" onClick={e => { props.closingCallback() }}><span className="fas fa-times"></span></div>

      {
        loadingTransition((style, item) => item &&
          <animated.div className='loading-container' style={style} >
            <div className="loading-container-wrapper">
              <Loader type="Circles" color="#009bdd" height={40} width={40} visible={item} />
            </div>
          </animated.div>
        )
      }
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
      scale: state.systemReducers.scale,
      serverUrl: state.systemReducers.serverUrl,
  }
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(CarrierList)
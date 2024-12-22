/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react'
import './MCNumbers.css';
import { connect } from 'react-redux';
import classnames from 'classnames';
import axios from 'axios';
import NumberFormat from "react-number-format";
import moment from 'moment';
import Loader from 'react-loader-spinner';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretRight, faCheck, faPencilAlt, faTrashAlt, faCopy } from '@fortawesome/free-solid-svg-icons';

const MCNumbers = (props) => {
    const refMcNumbersContainer = useRef();
    const [isLoading, setIsLoading] = useState(true);
    const [mcNumbers, setMcNumbers] = useState([]);
    const [filterText, setFilterText] = useState('');

    const refFilterText = useRef();

    useEffect(() => {
        setFilterText(props.filterText);

        let url = props.type === 'mc'
            ? '/getMcNumbers'
            : props.type === 'dot'
                ? '/getDotNumbers'
                : props.type === 'scac'
                    ? '/getScacNumbers'
                    : props.type === 'fid'
                        ? '/getFidNumbers'
                        : '/getMcNumbers'

        axios.post(props.serverUrl + url).then(res => {
            if (res.data.result === 'OK') {
                setMcNumbers(res.data.mc_numbers)
            }
        }).catch(e => {
            console.log(e)
        }).finally(() => {
            setIsLoading(false);
            refFilterText.current.focus({
                preventScroll: true
            });
        })
    }, [])

    const cancelButtonClasses = classnames({
        'mochi-button': true,
        'disabled': isLoading
    });

    return (
        <div className="mc-numbers-content" tabIndex={0} ref={refMcNumbersContainer} onKeyDown={(e) => {
            let key = e.keyCode || e.which;

            if (key === 27){
                e.stopPropagation();
                props.closeModal();
            }
        }}>
            <div className="mc-numbers-title" style={{ textAlign: 'center', marginBottom: 5 }}>
                {
                    props.type === 'mc'
                        ? 'MC Numbers'
                        : props.type === 'dot'
                            ? 'DOT Numbers'
                            : props.type === 'scac'
                                ? 'SCAC'
                                : props.type === 'fid'
                                    ? 'FID'
                                    : 'MC Numbers'
                }
            </div>

            <div style={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column'
            }}>
                <div className="input-box-container">
                    <input type="text"
                        ref={refFilterText}
                        placeholder='Filter'
                        onChange={(e) => { setFilterText(e.target.value) }}
                        value={filterText}
                    />
                </div>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    borderTop: '1px solid rgba(0,0,0,0.3)',
                    borderBottom: '1px solid rgba(0,0,0,0.3)',
                    marginTop: 5,
                    marginBottom: 5
                }}>
                    <div style={{ width: '100px' }}>Code</div>
                    <div style={{ flexGrow: 1 }}>Carrier</div>
                    <div style={{ width: '100px' }}>{
                        props.type === 'mc'
                            ? 'MC Number'
                            : props.type === 'dot'
                                ? 'DOT Number'
                                : props.type === 'scac'
                                    ? 'SCAC'
                                    : props.type === 'fid'
                                        ? 'FID'
                                        : 'MC Number'
                    }</div>
                </div>

                <div style={{
                    flexGrow: 1,
                    position: 'relative'
                }}>
                    <div style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        left: 0,
                        top: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        overflowY: 'auto'
                    }}>

                        {
                            (mcNumbers || []).filter(value => filterText === '' ||
                                (value?.code || '').toLowerCase().includes(filterText.toLowerCase()) ||
                                (value?.name || '').toLowerCase().includes(filterText.toLowerCase()) ||
                                (value?.mc_number || '').toLowerCase().includes(filterText.toLowerCase()) ||
                                (value?.dot_number || '').toLowerCase().includes(filterText.toLowerCase()) ||
                                (value?.scac || '').toLowerCase().includes(filterText.toLowerCase()) ||
                                (value?.fid || '').toLowerCase().includes(filterText.toLowerCase())).map((value, index) => {
                                    return (
                                        <div key={index} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            fontSize: '0.8rem',
                                            padding: '2px 0',
                                            cursor: 'pointer'
                                        }} className='mc-number-item' onClick={() => {
                                            props.callback(value?.id || 0);
                                        }}>
                                            <div style={{ width: '100px' }}>{(value?.code || '') + ((value?.code_number || 0) === 0 ? '' : value?.code_number)}</div>
                                            <div style={{ flexGrow: 1 }}>{value?.name || ''}</div>
                                            <div style={{ width: '100px' }}>{
                                                props.type === 'mc'
                                                    ? value?.mc_number || ''
                                                    : props.type === 'dot'
                                                        ? value?.dot_number || ''
                                                        : props.type === 'scac'
                                                            ? value?.scac || ''
                                                            : props.type === 'fid'
                                                                ? value?.fid || ''
                                                                : value?.mc_number || ''
                                            }</div>
                                        </div>
                                    )
                                })
                        }
                    </div>
                </div>
            </div>

            <div className="button-container" tabIndex={-1} onKeyDown={(e) => {
                let key = e.keyCode || e.which;

                if (key === 9) {
                    e.stopPropagation();
                    e.preventDefault();
                }
            }}>
                <div className={cancelButtonClasses} onClick={() => {
                    props.closeModal();
                }}>
                    <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                    <div className="mochi-button-base">Cancel</div>
                    <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        serverUrl: state.systemReducers.serverUrl
    }
}

export default connect(mapStateToProps, null)(MCNumbers)
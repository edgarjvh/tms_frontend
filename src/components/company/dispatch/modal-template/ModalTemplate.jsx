import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import './ModalTemplate.css';

const ModalTemplate = (props) => {
    const [name, setName] = useState('');

    useEffect(() => {
        if ((props.name || '') !== ''){
            setName(props.name)
        }
    }, []);

    return (
        <div className='modal-template-container'>
            <div className="modal-template-wrapper">
                <div className="modal-title">
                    <div>Save Template</div>
                    <div className="mochi-button">
                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                        <div className="mochi-button-base">Cancel</div>
                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                    </div>
                </div>

                <div className="modal-body">
                    <div className="input-box-container">
                        <input type="text" placeholder='Name' readOnly={(props.is_new_template || 0) === 0} value={name} onChange={(e) => {
                            setName(e.target.value)
                        }} />
                    </div>

                    {
                        (props.is_new_template || 0) === 0 &&
                        <div className='modal-prompt'>Are you sure do you want to proceed?</div>
                    }

                    {
                        (props.is_new_template || 0) === 1 &&
                        <div className='modal-prompt'>By saving as Template, do you want to keep the current order?</div>
                    }

                    <div className='modal-button-container'>
                        <div className="mochi-button" onClick={() => {
                            if ((name || '').trim() === '') {
                                window.alert('The name of the template is required!');
                                return;
                            }

                            props.cb({
                                name: name,
                                keep_order: 0
                            })
                        }}>
                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                            <div className="mochi-button-base">No</div>
                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                        </div>

                        <div className="mochi-button" onClick={() => {
                            if ((name || '').trim() === '') {
                                window.alert('The name of the template is required!');
                                return;
                            }

                            props.cb({
                                name: name,
                                keep_order: 1
                            })
                        }}>
                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                            <div className="mochi-button-base">Yes</div>
                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default connect(null, null)(ModalTemplate)
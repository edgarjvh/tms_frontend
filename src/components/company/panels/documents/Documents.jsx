import React, {useRef, useState, useEffect} from 'react';
import {connect} from 'react-redux';
import classnames from 'classnames';
import $ from 'jquery';
import jqueryForm from 'jquery-form';
import Draggable from 'react-draggable';
import './Documents.css';
import moment from 'moment';
import DocViewer from "react-doc-viewer";
import {useTransition, animated, useSpring} from 'react-spring';
import {Modal} from './../../panels';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
    faCaretDown,
    faCaretRight,
    faCalendarAlt,
    faPencilAlt,
    faCheck,
    faTrashAlt
} from '@fortawesome/free-solid-svg-icons';
import Loader from 'react-loader-spinner';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import axios from 'axios';
import {
    setCompanyOpenedPanels,
    setDispatchOpenedPanels,
    setCustomerOpenedPanels,
    setCarrierOpenedPanels,
    setLoadBoardOpenedPanels,
    setInvoiceOpenedPanels,
    setAdminCustomerOpenedPanels,
    setAdminCarrierOpenedPanels,
    setSelectedCustomer,
    setSelectedCarrier,
    setSelectedFactoringCompany,
    setSelectedEmployee,
    setSelectedAgent,
    setSelectedCompanyDriver,
    setSelectedOwnerOperator,
    setSelectedOrder
} from './../../../../actions';

const Documents = (props) => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    const [selectedOwner, setSelectedOwner] = useState({});
    const [selectedOwnerDocument, setSelectedOwnerDocument] = useState({});
    const [selectedOwnerDocumentNote, setSelectedOwnerDocumentNote] = useState({});
    const [selectedOwnerDocumentTags, setSelectedOwnerDocumentTags] = useState('');
    const [savingDocumentUrl, setSavingDocumentUrl] = useState('');
    const [deletingDocumentUrl, setDeletingDocumentUrl] = useState('');
    const [savingDocumentNoteUrl, setSavingDocumentNoteUrl] = useState('');
    const [serverDocumentsFolder, setServerDocumentsFolder] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [isSavingDocument, setIsSavingDocument] = useState(false);
    const [progressUploaded, setProgressUploaded] = useState(0);
    const [progressTotal, setProgressTotal] = useState(0);

    const refTitleInput = useRef();
    const refTagInput = useRef();
    const refDocumentInput = useRef();
    const refIframeImg = useRef(null);
    const modalTransitionProps = useSpring({opacity: (selectedOwnerDocumentNote.id !== undefined) ? 1 : 0});

    const loadingTransition = useTransition(isSavingDocument || isLoading, {
        from: {opacity: 0},
        enter: {opacity: 1},
        leave: {opacity: 0},
        reverse: isSavingDocument || isLoading,
    });

    useEffect(() => {
        // setSelectedOwner({ ...props.selectedOwner });
        setSelectedOwnerDocument({...props.selectedOwnerDocument});
        setSavingDocumentUrl(props.savingDocumentUrl);
        setDeletingDocumentUrl(props.deletingDocumentUrl);
        setSavingDocumentNoteUrl(props.savingDocumentNoteUrl);
        setServerDocumentsFolder(props.serverDocumentsFolder);

        let getDocumentsUrl = '';

        switch (props.suborigin) {
            case 'company-employee':
                getDocumentsUrl = '/getDocumentsByEmployee';
                break;
            case 'company-agent':
                getDocumentsUrl = '/getDocumentsByAgent';
                break;
            case 'company-driver':
                getDocumentsUrl = '/getDocumentsByDriver';
                break;
            case 'company-operator':
                getDocumentsUrl = '/getDocumentsByOperator';
                break;
            case 'customer':
                getDocumentsUrl = '/getDocumentsByCustomer';
                break;
            case 'carrier':
                getDocumentsUrl = '/getDocumentsByCarrier';
                break;
            case 'factoring-company':
                getDocumentsUrl = '/getDocumentsByFactoringCompany';
                break;
            case 'order':
                getDocumentsUrl = '/getDocumentsByOrder';
                break;
            case 'order-billing':
                getDocumentsUrl = '/getDocumentsByOrderBilling';
                break;
            case 'division':
                getDocumentsUrl = '/getDocumentsByDivision';
                break;
            default:
                break;
        }

        axios.post(props.serverUrl + getDocumentsUrl, {
            employee_id: props.selectedOwner.id,
            agent_id: props.selectedOwner.id,
            driver_id: props.selectedOwner.id,
            operator_id: props.selectedOwner.id,
            customer_id: props.selectedOwner.id,
            carrier_id: props.selectedOwner.id,
            factoring_company_id: props.selectedOwner.id,
            order_id: props.selectedOwner.id,
            order_billing_id: props.selectedOwner.id,
            division_id: props.selectedOwner.id,
        }).then(res => {
            if (res.data.result === 'OK') {
                setSelectedOwner({
                    ...props.selectedOwner,
                    documents: [...res.data.documents]
                })
            }
        });
    }, [])

    const getSizeUnit = (size) => {
        let unit = 'B';

        if (size > (1024 ** 4)) {
            unit = 'TB'
        } else if (size > (1024 ** 3)) {
            unit = 'GB'
        } else if (size > (1024 ** 2)) {
            unit = 'MB'
        } else if (size > (1024 * 1)) {
            unit = 'KB'
        }

        return unit;
    }

    const getFileSize = (size) => {
        let newSize = size;

        if (size > (1024 ** 4)) {
            newSize = (size / (1024 ** 4)).toFixed(2)
        } else if (size > (1024 ** 3)) {
            newSize = (size / (1024 ** 3)).toFixed(2)
        } else if (size > (1024 ** 2)) {
            newSize = (size / (1024 ** 2)).toFixed(2)
        } else if (size > (1024 * 1)) {
            newSize = (size / (1024 * 1)).toFixed(2)
        }

        return isNaN(newSize) ? 0 : newSize;
    }

    const tagsOnKeydown = (e) => {
        let keyCode = e.keyCode || e.which;

        if (keyCode === 13) {
            setSelectedOwnerDocument({
                ...selectedOwnerDocument,
                tags: (selectedOwnerDocument.tags || '') === '' ? selectedOwnerDocumentTags : selectedOwnerDocument.tags + '|' + selectedOwnerDocumentTags
            });
            setSelectedOwnerDocumentTags('');
            refTagInput.current.focus();
        }
        if (keyCode === 9) {
            e.preventDefault();
            setSelectedOwnerDocument({
                ...selectedOwnerDocument,
                tags: (selectedOwnerDocument.tags || '') === '' ? selectedOwnerDocumentTags : selectedOwnerDocument.tags + '|' + selectedOwnerDocumentTags
            });
            setSelectedOwnerDocumentTags('');
            refTagInput.current.focus();
        }
    }

    const validateDocumentToSave = (e) => {
        if ((selectedOwnerDocument.title || '').trim() === '') {
            window.alert('You must enter the title!');
            setIsSavingDocument(false);
            return;
        }

        if ((selectedOwnerDocument.subject || '').trim() === '') {
            window.alert('You must enter the subject!');
            setIsSavingDocument(false);
            return;
        }

        if ((selectedOwnerDocument.tags || '').trim() === '') {
            window.alert('You must enter the tags!');
            setIsSavingDocument(false);
            return;
        }

        selectedOwnerDocument.tags = selectedOwnerDocument.tags.replace(/  +/g, ' ');
        selectedOwnerDocument.tags = selectedOwnerDocument.tags.trim();

        let formData = new FormData();
        let files = e.target.files;

        formData.append("doc", files[0]);
        formData.append("employee_id", selectedOwner.id);
        formData.append("agent_id", selectedOwner.id);
        formData.append("driver_id", selectedOwner.id);
        formData.append("operator_id", selectedOwner.id);
        formData.append("customer_id", selectedOwner.id);
        formData.append("carrier_id", selectedOwner.id);
        formData.append("factoring_company_id", selectedOwner.id);
        formData.append("invoice_id", selectedOwner.id);
        formData.append("order_id", selectedOwner.id);
        formData.append("division_id", selectedOwner.id);
        formData.append("user_code_id", props.suborigin === 'company-agent' ? selectedOwner?.id : props.user.user_code);
        formData.append("date_entered", selectedOwnerDocument.date_entered);
        formData.append("title", selectedOwnerDocument.title);
        formData.append("subject", selectedOwnerDocument.subject);
        formData.append("tags", selectedOwnerDocument.tags);

        if (!isSavingDocument) {
            setIsSavingDocument(true);

            const options = {
                cancelToken: source.token,
                onUploadProgress: (progressEvent) => {
                    const {loaded, total} = progressEvent;

                    setProgressUploaded(isNaN(loaded) ? 0 : loaded);
                    setProgressTotal(isNaN(total) ? 0 : total);
                }
            }

            axios.post(props.serverUrl + savingDocumentUrl, formData, options)
                .then(res => {
                    if (res.data.result === "OK") {
                        if (props.suborigin === 'company-employee') {
                            setSelectedOwner(selectedOwner => {
                                return {
                                    ...selectedOwner,
                                    documents: res.data.documents
                                }
                            })

                            props.setSelectedEmployee({
                                id: selectedOwner.id,
                                documents: res.data.documents,
                                component_id: props.componentId
                            });
                        }

                        if (props.suborigin === 'company-agent') {
                            setSelectedOwner(selectedOwner => {
                                return {
                                    ...selectedOwner,
                                    documents: res.data.documents
                                }
                            })

                            props.setSelectedAgent({
                                id: selectedOwner.id,
                                documents: res.data.documents,
                                component_id: props.componentId
                            });
                        }

                        if (props.suborigin === 'company-driver') {
                            setSelectedOwner(selectedOwner => {
                                return {
                                    ...selectedOwner,
                                    documents: res.data.documents
                                }
                            })

                            props.setSelectedCompanyDriver({
                                id: selectedOwner.id,
                                documents: res.data.documents,
                                component_id: props.componentId
                            });
                        }

                        if (props.suborigin === 'company-operator') {
                            setSelectedOwner(selectedOwner => {
                                return {
                                    ...selectedOwner,
                                    documents: res.data.documents
                                }
                            })

                            props.setSelectedOwnerOperator({
                                id: selectedOwner.id,
                                documents: res.data.documents,
                                component_id: props.componentId
                            });
                        }

                        if (props.suborigin === 'customer') {
                            setSelectedOwner(selectedOwner => {
                                return {
                                    ...selectedOwner,
                                    documents: res.data.documents
                                }
                            })

                            props.setSelectedCustomer({
                                id: selectedOwner.id,
                                documents: res.data.documents,
                                component_id: props.componentId
                            });
                        }

                        if (props.suborigin === 'division') {
                            setSelectedOwner(selectedOwner => {
                                return {
                                    ...selectedOwner,
                                    documents: res.data.documents
                                }
                            })

                            props.setSelectedDivision({
                                ...selectedOwner,
                                documents: res.data.documents
                            });
                        }

                        if (props.suborigin === 'carrier') {
                            setSelectedOwner(selectedOwner => {
                                return {
                                    ...selectedOwner,
                                    documents: res.data.documents
                                }
                            })

                            props.setSelectedCarrier({
                                id: selectedOwner.id,
                                documents: res.data.documents,
                                component_id: props.componentId
                            });
                        }

                        if (props.suborigin === 'factoring-company') {
                            setSelectedOwner(selectedOwner => {
                                return {
                                    ...selectedOwner,
                                    documents: res.data.documents
                                }
                            })

                            props.setSelectedFactoringCompany({
                                id: selectedOwner.id,
                                documents: res.data.documents,
                                component_id: props.componentId
                            });
                        }

                        if (props.suborigin === 'order') {
                            setSelectedOwner(selectedOwner => {
                                return {
                                    ...selectedOwner,
                                    documents: res.data.documents
                                }
                            })

                            props.setSelectedOrder({
                                id: selectedOwner.id,
                                documents: res.data.documents,
                                component_id: props.componentId
                            });
                        }

                        if (props.suborigin === 'order-billing') {
                            setSelectedOwner(selectedOwner => {
                                return {
                                    ...selectedOwner,
                                    billing_documents: res.data.documents
                                }
                            })

                            props.setSelectedOrder({
                                id: selectedOwner.id,
                                billing_documents: res.data.documents,
                                component_id: props.componentId
                            });
                        }

                        setSelectedOwnerDocument({
                            id: 0,
                            user_code_id: props.user.user_code.id || null,
                            date_entered: moment().format('MM/DD/YYYY')
                        });

                        refTitleInput.current && refTitleInput.current.focus();
                    }
                    refDocumentInput.current.value = "";
                    setIsSavingDocument(false);
                })
                .catch((err) => {
                    console.log("error saving document", err);
                    setIsSavingDocument(false);
                    refDocumentInput.current.value = "";
                })
                .then(() => {
                    setProgressUploaded(0);
                    setProgressTotal(0);
                });
        }
    }

    const uploadDocumentBtnClick = () => {
        if ((selectedOwnerDocument.title || '') === '') {
            window.alert('You must enter the title!');
            return;
        }

        if ((selectedOwnerDocument.subject || '') === '') {
            window.alert('You must enter the subject!');
            return;
        }

        if ((selectedOwnerDocument.tags || '').trim() === '') {
            window.alert('You must enter one tag, at least!');
            return;
        }

        refDocumentInput.current.click();
    }

    const quickTypeLinkClasses = classnames({
        'quick-filling-btn': true,
        'disabled': (selectedOwnerDocument.id || 0) > 0
    });

    return (
        <div className="panel-content">
            <div className="drag-handler" onClick={e => e.stopPropagation()}></div>
            <div className="title">{props.title}</div>
            <div className="side-title">
                <div>{props.title}</div>
            </div>

            {
                loadingTransition((style, item) => item &&
                    <animated.div className='loading-container' style={style}>
                        <div className="loading-container-wrapper" style={{
                            position: 'absolute',
                            flexDirection: 'column'
                        }}>
                            <Loader type="Circles" color="#009bdd" height={40} width={40} visible={item}/>

                            {
                                isSavingDocument &&
                                <div className="progress-bar-container" style={{
                                    overflow: 'unset',
                                    width: '50%',
                                    marginTop: 10
                                }}>
                                    <div
                                        className="progress-bar-title">{getFileSize(progressUploaded)}{getSizeUnit(progressUploaded)} of {getFileSize(progressTotal)}{getSizeUnit(progressTotal)} | {isNaN(Math.floor((progressUploaded * 100) / progressTotal)) ? 0 : Math.floor((progressUploaded * 100) / progressTotal)}%
                                    </div>
                                    <div className="progress-bar-wrapper"
                                         style={{width: (isNaN(Math.floor((progressUploaded * 100) / progressTotal)) ? 0 : Math.floor((progressUploaded * 100) / progressTotal)) + '%'}}></div>
                                </div>
                            }
                        </div>
                    </animated.div>
                )
            }

            <div className="documents-fields">
                <div className="documents-left-side">
                    <div className="documents-fields-row">
                        <div className="input-box-container">
                            <input type="text" placeholder="Id" readOnly={true} value={
                                props.suborigin === 'company-agent'
                                    ? selectedOwner?.code || ''
                                    : selectedOwnerDocument.user_code?.code || props.user.user_code.code

                            }/>
                        </div>

                        <div className="input-box-container" style={{marginRight: 5}}>
                            <input type="text" placeholder="Date Entered" readOnly={true}
                                   value={selectedOwnerDocument.date_entered || moment().format('MM/DD/YYYY')}/>
                        </div>

                        <div className="mochi-button" onClick={() => {
                            setSelectedOwnerDocument({
                                id: 0,
                                user_id: Math.floor(Math.random() * (15 - 1)) + 1,
                                date_entered: moment().format('MM/DD/YYYY')
                            });

                            refDocumentInput.current.value = "";

                            refTitleInput.current.focus();
                        }}>
                            <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                            <div className="mochi-button-base">Clear</div>
                            <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                        </div>

                        <div style={{
                            margin: '0 0.5rem',
                            fontSize: '0.7rem',
                            color: 'rgba(0,0,0,0.7)'
                        }}>Quick type links:
                        </div>

                        {
                            (props.suborigin === 'company-employee' || props.suborigin === 'company-driver' || props.suborigin === 'company-operator' || props.suborigin === 'order' || props.suborigin === 'order-billing' || props.suborigin === 'customer' || props.suborigin === 'division') &&
                            <div className={quickTypeLinkClasses} onClick={() => {
                                setSelectedOwnerDocument({
                                    id: 0,
                                    user_id: Math.floor(Math.random() * (15 - 1)) + 1,
                                    date_entered: moment().format('MM/DD/YYYY'),
                                    title: 'Signed Bill of Lading',
                                    subject: 'Signed BOL',
                                    tags: 'Signed BOL|BOL|Delivery Receipt'
                                });
                                refTagInput.current.focus();
                            }}>Signed BOL</div>
                        }

                        {
                            (props.suborigin === 'company-employee' || props.suborigin === 'company-driver' || props.suborigin === 'company-operator' || props.suborigin === 'order' && props.origin === 'invoice') &&
                            <div className={quickTypeLinkClasses} onClick={() => {
                                setSelectedOwnerDocument({
                                    id: 0,
                                    user_id: Math.floor(Math.random() * (15 - 1)) + 1,
                                    date_entered: moment().format('MM/DD/YYYY'),
                                    title: 'Carrier Invoice',
                                    subject: 'Carrier Invoice',
                                    tags: 'Carrier|Invoice'
                                });
                                refTagInput.current.focus();
                            }}>Carrier Invoice</div>
                        }

                        {
                            (props.suborigin === 'company-employee' || props.suborigin === 'company-driver' || props.suborigin === 'company-operator' || props.suborigin === 'order-billing' && props.origin === 'invoice') &&
                            <div className={quickTypeLinkClasses} onClick={() => {
                                setSelectedOwnerDocument({
                                    id: 0,
                                    user_id: Math.floor(Math.random() * (15 - 1)) + 1,
                                    date_entered: moment().format('MM/DD/YYYY'),
                                    title: 'Customer Invoice',
                                    subject: 'Customer Invoice',
                                    tags: 'Customer|Invoice'
                                });
                                refTagInput.current.focus();
                            }}>Customer Invoice</div>
                        }

                        {
                            (props.suborigin === 'company-employee' || props.suborigin === 'company-driver' || props.suborigin === 'company-operator' || props.suborigin === 'order') &&
                            <div className={quickTypeLinkClasses} onClick={() => {
                                setSelectedOwnerDocument({
                                    id: 0,
                                    user_id: Math.floor(Math.random() * (15 - 1)) + 1,
                                    date_entered: moment().format('MM/DD/YYYY'),
                                    title: 'Signed Rate Confirmation',
                                    subject: 'Signed Rate Confirmation',
                                    tags: 'Signed Rate Confirmation|Rate Confirmation'
                                });
                                refTagInput.current.focus();
                            }}>Signed Rate Confirmation</div>
                        }

                        {
                            (props.suborigin === 'company-employee' || props.suborigin === 'company-agent' || props.suborigin === 'company-driver' || props.suborigin === 'company-operator' || props.suborigin === 'carrier') &&
                            <div className={quickTypeLinkClasses} onClick={() => {
                                setSelectedOwnerDocument({
                                    id: 0,
                                    user_id: Math.floor(Math.random() * (15 - 1)) + 1,
                                    date_entered: moment().format('MM/DD/YYYY'),
                                    title: 'W9',
                                    subject: 'W9',
                                    tags: 'W9|Federal EIN'
                                });
                                refTagInput.current.focus();
                            }}>W9</div>
                        }

                        {
                            (props.suborigin === 'company-employee' || props.suborigin === 'company-driver' || props.suborigin === 'company-operator' || props.suborigin === 'carrier') &&
                            <div className={quickTypeLinkClasses} onClick={() => {
                                setSelectedOwnerDocument({
                                    id: 0,
                                    user_id: Math.floor(Math.random() * (15 - 1)) + 1,
                                    date_entered: moment().format('MM/DD/YYYY'),
                                    title: 'MC Authority',
                                    subject: 'Authority',
                                    tags: 'MC#|ICC#|Motor Carrier Number'
                                });
                                refTagInput.current.focus();
                            }}>MC Authority</div>
                        }

                        {
                            (props.suborigin === 'company-employee' || props.suborigin === 'company-driver' || props.suborigin === 'company-operator' || props.suborigin === 'carrier') &&
                            <div className={quickTypeLinkClasses} onClick={() => {
                                setSelectedOwnerDocument({
                                    id: 0,
                                    user_id: Math.floor(Math.random() * (15 - 1)) + 1,
                                    date_entered: moment().format('MM/DD/YYYY'),
                                    title: 'Insurance',
                                    subject: 'Insurance',
                                    tags: 'Insurance'
                                });
                                refTagInput.current.focus();
                            }}>Insurance</div>
                        }

                        {
                            (props.suborigin === 'company-employee' || props.suborigin === 'company-agent' || props.suborigin === 'company-driver' || props.suborigin === 'company-operator' || props.suborigin === 'carrier') &&
                            <div className={quickTypeLinkClasses} onClick={() => {
                                setSelectedOwnerDocument({
                                    id: 0,
                                    user_id: Math.floor(Math.random() * (15 - 1)) + 1,
                                    date_entered: moment().format('MM/DD/YYYY'),
                                    title: props.suborigin === 'company-agent' ? 'Signed Agent Contract' : 'Signed Broker Contract',
                                    subject: props.suborigin === 'company-agent' ? 'Agent Contract' : 'Broker Contract',
                                    tags: props.suborigin === 'company-agent' ? 'Signed Contract|Signed Agent Contract' : 'Signed Contract|Signed Broker Contract'
                                });
                                refTagInput.current.focus();
                            }}>Signed Contract</div>
                        }

                        {
                            (props.suborigin === 'company-employee' || props.suborigin === 'company-driver' || props.suborigin === 'company-operator' || props.suborigin === 'carrier') &&
                            <div className={quickTypeLinkClasses} onClick={() => {
                                setSelectedOwnerDocument({
                                    id: 0,
                                    user_id: Math.floor(Math.random() * (15 - 1)) + 1,
                                    date_entered: moment().format('MM/DD/YYYY'),
                                    title: 'Carrier Information',
                                    subject: 'Carrier Information',
                                    tags: 'Carrier Packet|Carrier Information Packet'
                                });
                                refTagInput.current.focus();
                            }}>Carrier Information</div>
                        }

                        {
                            (props.suborigin === 'company-employee' || props.suborigin === 'company-driver' || props.suborigin === 'company-operator' || props.suborigin === 'carrier' || props.suborigin === 'factoring.company') &&
                            <div className={quickTypeLinkClasses} onClick={() => {
                                setSelectedOwnerDocument({
                                    id: 0,
                                    user_id: Math.floor(Math.random() * (15 - 1)) + 1,
                                    date_entered: moment().format('MM/DD/YYYY'),
                                    title: 'Notice of Assignment',
                                    subject: 'NOA',
                                    tags: 'Notice of Assignment|NOA'
                                });
                                refTagInput.current.focus();
                            }}>NOA</div>
                        }

                        {
                            (props.suborigin === 'company-employee' || props.suborigin === 'company-driver' || props.suborigin === 'company-operator' || props.suborigin === 'carrier') &&
                            <div className={quickTypeLinkClasses} onClick={() => {
                                setSelectedOwnerDocument({
                                    id: 0,
                                    user_id: Math.floor(Math.random() * (15 - 1)) + 1,
                                    date_entered: moment().format('MM/DD/YYYY'),
                                    title: 'Standard Carrier Alpha Code',
                                    subject: 'SCAC',
                                    tags: 'SCAC'
                                });
                                refTagInput.current.focus();
                            }}>SCAC</div>
                        }
                    </div>

                    <div className="documents-fields-row">
                        <div className="input-box-container">
                            <input
                                ref={refTitleInput}
                                type="text"
                                placeholder="Title"
                                value={selectedOwnerDocument.title || ''}
                                onChange={(e) => {
                                    setSelectedOwnerDocument({...selectedOwnerDocument, title: e.target.value})
                                }}
                                readOnly={(selectedOwnerDocument.id || 0) > 0}/>
                        </div>

                        <div className="input-box-container">
                            <input
                                type="text"
                                placeholder="Subject"
                                value={selectedOwnerDocument.subject || ''}
                                onChange={(e) => {
                                    setSelectedOwnerDocument({...selectedOwnerDocument, subject: e.target.value})
                                }}
                                readOnly={(selectedOwnerDocument.id || 0) > 0}/>
                        </div>

                        <div className="input-box-container tags" style={{
                            flexGrow: 1, marginRight: 10
                        }}>
                            {
                                (selectedOwnerDocument.tags || '').split('|').map((item, index) => {
                                    if (item.trim() !== '') {
                                        return (
                                            <div key={index} style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                fontSize: '0.7rem',
                                                backgroundColor: 'rgba(0,0,0,0.2)',
                                                padding: '2px 10px',
                                                borderRadius: '10px',
                                                marginRight: '2px',
                                                cursor: 'default'
                                            }} title={item}>
                                                {
                                                    (selectedOwnerDocument.id || 0) === 0 &&
                                                    <span className="fas fa-trash-alt"
                                                          style={{marginRight: '5px', cursor: 'pointer'}}
                                                          onClick={() => {
                                                              setSelectedOwnerDocument({
                                                                  ...selectedOwnerDocument,
                                                                  tags: (selectedOwnerDocument.tags || '').replace(item, '').trim()
                                                              })
                                                          }}></span>
                                                }

                                                <span className="automatic-email-inputted"
                                                      style={{whiteSpace: 'nowrap'}}>{item.toLowerCase()}</span>
                                            </div>
                                        )
                                    } else {
                                        return false;
                                    }
                                })
                            }
                            <input type="text" placeholder="Tags" ref={refTagInput}
                                   onKeyDown={tagsOnKeydown}
                                   value={selectedOwnerDocumentTags || ''}
                                   onChange={(e) => {
                                       setSelectedOwnerDocumentTags(e.target.value)
                                   }}
                                   onInput={(e) => {
                                       setSelectedOwnerDocumentTags(e.target.value)
                                   }}
                                   readOnly={(selectedOwnerDocument.id || 0) > 0}/>
                        </div>
                    </div>
                </div>

                <div className="documents-right-side">
                    <div className="mochi-button" style={{
                        fontSize: '1.5rem'
                    }}>
                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                        <div className="mochi-button-base">Search Documents</div>
                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                    </div>
                    <div className="mochi-button" style={{
                        fontSize: '1.5rem'
                    }}>
                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                        <div className="mochi-button-base">E-Mail Documents</div>
                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                    </div>
                    <div className="mochi-button" style={{
                        fontSize: '1.5rem',
                        pointerEvents: (selectedOwnerDocument.id || 0) > 0 ? 'none' : 'all'
                    }} onClick={uploadDocumentBtnClick}>
                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                        <div className="mochi-button-base"
                             style={{color: (selectedOwnerDocument.id || 0) > 0 ? 'rgba(0,0,0,0.3)' : '#323232'}}>Upload
                            Documents
                        </div>
                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                    </div>

                    <form encType='multipart/form-data' style={{display: 'none'}}>
                        <input type="file" ref={refDocumentInput} onChange={validateDocumentToSave}/>
                    </form>
                </div>
            </div>

            <div className="documents-list">
                <div className="form-bordered-box">
                    <div className="form-header">
                        <div className="top-border top-border-left"></div>
                        <div className="form-title">Documents</div>
                        <div className="top-border top-border-middle"></div>
                        <div className="top-border top-border-right"></div>
                    </div>

                    <div className="form-wrapper">
                        {
                            ((props.suborigin || '') === 'order-billing'
                                ? (selectedOwner.billing_documents || [])
                                : (selectedOwner.documents || [])).map((document, index) => {
                                let docIconClasses = classnames({
                                    'fas': true,
                                    'fa-file-image': ['jpg', 'jpeg', 'jpe', 'jif', 'jfif', 'jfi', 'png', 'gif', 'webp', 'tiff', 'tif', 'bmp', 'jp2', 'j2k', 'jpf', 'jpx', 'jpm', 'mj2', 'svg', 'svgz'].includes(document.doc_extension.toLowerCase()),
                                    'fa-file-word': ['doc', 'docx'].includes(document.doc_extension.toLowerCase()),
                                    'fa-file-excel': ['xls', 'xlsx'].includes(document.doc_extension.toLowerCase()),
                                    'fa-file-powerpoint': ['ppt', 'pptx'].includes(document.doc_extension.toLowerCase()),
                                    'fa-file-code': ['htm', 'html'].includes(document.doc_extension.toLowerCase()),
                                    'fa-file-video': ['webm', 'mpg', 'mp2', 'mpeg', 'mpe', 'mpv', 'ogg', 'mp4', 'm4p', 'm4v', 'avi', 'wmv', 'mov', 'qt', 'flv', 'swf', 'avchd'].includes(document.doc_extension.toLowerCase()),
                                    'fa-file-archive': ['7z', 'arc', 'arj', 'bz2', 'daa', 'gz', 'rar', 'tar', 'zim', 'zip'].includes(document.doc_extension.toLowerCase()),
                                    'fa-file-pdf': document.doc_extension.toLowerCase() === 'pdf',
                                    'fa-file-alt': ['txt', 'log'].includes(document.doc_extension.toLowerCase()),
                                    'fa-file': !['jpg', 'jpeg', 'jpe', 'jif', 'jfif', 'jfi', 'png', 'gif', 'webp', 'tiff', 'tif', 'bmp', 'jp2', 'j2k', 'jpf', 'jpx', 'jpm', 'mj2', 'svg', 'svgz', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'htm', 'html', 'webm', 'mpg', 'mp2', 'mpeg', 'mpe', 'mpv', 'ogg', 'mp4', 'm4p', 'm4v', 'avi', 'wmv', 'mov', 'qt', 'flv', 'swf', 'avchd', '7z', 'arc', 'arj', 'bz2', 'daa', 'gz', 'rar', 'tar', 'zim', 'zip', 'pdf', 'txt'].includes(document.doc_extension.toLowerCase())
                                });

                                let itemClasses = classnames({
                                    'documents-list-item': true,
                                    'selected': (selectedOwnerDocument.id || 0) === document.id
                                });

                                return (
                                    <div className={itemClasses} key={index} onClick={() => {
                                        let getDocumentNotesUrl = '';

                                        switch (props.suborigin) {
                                            case 'company-employee':
                                                getDocumentNotesUrl = '/getNotesByEmployeeDocument';
                                                break;
                                            case 'company-agent':
                                                getDocumentNotesUrl = '/getNotesByAgentDocument';
                                                break;
                                            case 'company-driver':
                                                getDocumentNotesUrl = '/getNotesByDriverDocument';
                                                break;
                                            case 'company-operator':
                                                getDocumentNotesUrl = '/getNotesByOperatorDocument';
                                                break;
                                            case 'customer':
                                                getDocumentNotesUrl = '/getNotesByCustomerDocument';
                                                break;
                                            case 'carrier':
                                                getDocumentNotesUrl = '/getNotesByCarrierDocument';
                                                break;
                                            case 'factoring-company':
                                                getDocumentNotesUrl = '/getNotesByFactoringCompanyDocument';
                                                break;
                                            case 'order':
                                                getDocumentNotesUrl = '/getNotesByOrderDocument';
                                                break;
                                            case 'order-billing':
                                                getDocumentNotesUrl = '/getNotesByOrderBillingDocument';
                                                break;
                                            case 'division':
                                                getDocumentNotesUrl = '/getNotesByDivisionDocument';
                                                break;
                                            default:
                                                break;
                                        }

                                        axios.post(props.serverUrl + getDocumentNotesUrl, {
                                            doc_id: document.id,
                                        }).then(res => {
                                            if (res.data.result === 'OK') {
                                                document.notes = [...res.data.notes]
                                            }

                                            setSelectedOwnerDocument(document);
                                        });
                                    }}>
                                        <div className="item-info">
                                            <span className={docIconClasses}></span>
                                            <span>{document.user_id}</span>
                                            <span>{document.date_entered}</span>
                                            <span>{document.title}</span>
                                            <span>{document.subject}</span>
                                        </div>

                                        <div className="documents-list-col tcol documents-selected">
                                            {
                                                (document.id === (selectedOwnerDocument?.id || 0)) &&
                                                <FontAwesomeIcon icon={faPencilAlt}/>
                                            }
                                        </div>
                                        <div className="item-btn" onClick={(e) => {
                                            e.stopPropagation();

                                            if (window.confirm('Are you sure to delete this document?')) {

                                                axios.post(props.serverUrl + deletingDocumentUrl, {
                                                    doc_id: document.doc_id,
                                                    order_id: selectedOwner.id,
                                                    employee_id: selectedOwner.id,
                                                    agent_id: selectedOwner.id,
                                                    driver_id: selectedOwner.id,
                                                    operator_id: selectedOwner.id,
                                                    division_id: selectedOwner.id,
                                                }).then(res => {
                                                    if (res.data.result === 'OK') {

                                                        if (props.suborigin === 'company-employee') {
                                                            setSelectedOwner(selectedOwner => {
                                                                return {...selectedOwner, documents: res.data.documents}
                                                            })

                                                            props.setSelectedEmployee({
                                                                id: selectedOwner.id,
                                                                documents: res.data.documents,
                                                                component_id: props.componentId
                                                            });
                                                        }

                                                        if (props.suborigin === 'company-agent') {
                                                            setSelectedOwner(selectedOwner => {
                                                                return {...selectedOwner, documents: res.data.documents}
                                                            })

                                                            props.setSelectedAgent({
                                                                id: selectedOwner.id,
                                                                documents: res.data.documents,
                                                                component_id: props.componentId
                                                            });
                                                        }

                                                        if (props.suborigin === 'company-driver') {
                                                            setSelectedOwner(selectedOwner => {
                                                                return {...selectedOwner, documents: res.data.documents}
                                                            })

                                                            props.setSelectedCompanyDriver({
                                                                id: selectedOwner.id,
                                                                documents: res.data.documents,
                                                                component_id: props.componentId
                                                            });
                                                        }

                                                        if (props.suborigin === 'company-operator') {
                                                            setSelectedOwner(selectedOwner => {
                                                                return {...selectedOwner, documents: res.data.documents}
                                                            })

                                                            props.setSelectedOwnerOperator({
                                                                id: selectedOwner.id,
                                                                documents: res.data.documents,
                                                                component_id: props.componentId
                                                            });
                                                        }

                                                        if (props.suborigin === 'customer') {
                                                            setSelectedOwner(selectedOwner => {
                                                                return {...selectedOwner, documents: res.data.documents}
                                                            })

                                                            props.setSelectedCustomer({
                                                                id: selectedOwner.id,
                                                                documents: res.data.documents,
                                                                component_id: props.componentId
                                                            });
                                                        }

                                                        if (props.suborigin === 'division') {
                                                            setSelectedOwner(selectedOwner => {
                                                                return {...selectedOwner, documents: res.data.documents}
                                                            })

                                                            props.setSelectedDivision({
                                                                ...selectedOwner,
                                                                documents: res.data.documents
                                                            });
                                                        }

                                                        if (props.suborigin === 'carrier') {
                                                            setSelectedOwner(selectedOwner => {
                                                                return {...selectedOwner, documents: res.data.documents}
                                                            })

                                                            props.setSelectedCarrier({
                                                                id: selectedOwner.id,
                                                                documents: res.data.documents,
                                                                component_id: props.componentId
                                                            });
                                                        }

                                                        if (props.suborigin === 'factoring-company') {
                                                            setSelectedOwner(selectedOwner => {
                                                                return {...selectedOwner, documents: res.data.documents}
                                                            })

                                                            props.setSelectedFactoringCompany({
                                                                id: selectedOwner.id,
                                                                documents: res.data.documents,
                                                                component_id: props.componentId
                                                            });
                                                        }

                                                        if (props.suborigin === 'order') {
                                                            setSelectedOwner(selectedOwner => {
                                                                return {...selectedOwner, documents: res.data.documents}
                                                            })

                                                            props.setSelectedOrder({
                                                                id: selectedOwner.id,
                                                                documents: res.data.documents,
                                                                component_id: props.componentId
                                                            });
                                                        }

                                                        if (props.suborigin === 'order-billing') {
                                                            setSelectedOwner(selectedOwner => {
                                                                return {
                                                                    ...selectedOwner,
                                                                    billing_documents: res.data.documents
                                                                }
                                                            })

                                                            props.setSelectedOrder({
                                                                id: selectedOwner.id,
                                                                billing_documents: res.data.documents,
                                                                component_id: props.componentId
                                                            });
                                                        }


                                                        if ((selectedOwnerDocument.id || 0) === document.id) {
                                                            setSelectedOwnerDocument({
                                                                id: 0,
                                                                user_id: Math.floor(Math.random() * (15 - 1)) + 1,
                                                                date_entered: moment().format('MM/DD/YYYY')
                                                            });

                                                            refTitleInput.current.focus();
                                                        }
                                                    }
                                                })
                                            }
                                        }}>

                                            <FontAwesomeIcon icon={faTrashAlt}/>

                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>

                <div className="form-separator"></div>

                <div className="form-bordered-box">
                    <div className="form-header">
                        <div className="top-border top-border-left"></div>
                        <div className="form-title">Notes</div>
                        <div className="top-border top-border-middle"></div>
                        <div className="form-buttons">
                            <div className="mochi-button" onClick={() => {
                                if ((selectedOwnerDocument.id || 0) > 0) {
                                    setSelectedOwnerDocumentNote({
                                        id: 0,
                                        customer_document_id: selectedOwnerDocument.id
                                    })
                                } else {
                                    window.alert('You must select a document first!');
                                }
                            }}
                                 style={{
                                     pointerEvents: (selectedOwnerDocument.id || 0) > 0 ? 'all' : 'none',
                                 }}>
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div className="mochi-button-base"
                                     style={{color: (selectedOwnerDocument.id || 0) > 0 ? '#323232' : 'rgba(0,0,0,0.3)'}}>Add
                                    Note
                                </div>
                                <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                            </div>
                        </div>
                        <div className="top-border top-border-right"></div>
                    </div>

                    <div className="form-wrapper">
                        {
                            (selectedOwnerDocument.notes || []).map((note, index) => {
                                return (
                                    <div className='documents-notes-list-item' key={index} onClick={() => {
                                        setSelectedOwnerDocumentNote(note);
                                    }}>
                                        <div className="documents-notes-list-col tcol note-text">{note.text}</div>
                                        <div className="documents-notes-list-col tcol documents-notes-selected">
                                            {
                                                (note.id === (selectedOwnerDocumentNote?.id || 0)) &&
                                                <FontAwesomeIcon icon={faPencilAlt}/>
                                            }
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>

            <div className="documents-preview">
                <div className="form-bordered-box">
                    <div className="form-header">
                        <div className="top-border top-border-left"></div>
                        <div className="form-title">Preview</div>
                        <div className="top-border top-border-middle"></div>
                        <div className="form-buttons">
                            <div className="mochi-button" onClick={(e, id = 'frame-preview') => {
                                const iframe = document.frames
                                    ? document.frames[id]
                                    : document.getElementById(id);
                                const iframeWindow = iframe.contentWindow || iframe;

                                iframe.focus();
                                iframeWindow.print();

                                return false;
                            }}>
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div className="mochi-button-base">Print</div>
                                <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                            </div>
                        </div>
                        <div className="top-border top-border-right"></div>
                    </div>

                    {
                        ((selectedOwnerDocument.id || 0) > 0 &&
                            (['pdf', 'txt', 'htm', 'html', 'tmf', 'log'].includes(selectedOwnerDocument.doc_extension.toLowerCase()))) &&
                        <iframe id="frame-preview"
                                src={(props.serverUrl + serverDocumentsFolder + selectedOwnerDocument.doc_id) + '#toolbar=1&navpanes=0&scrollbar=0'}
                                frameBorder={0} allowFullScreen={true} width="100%" height="100%"></iframe>
                    }

                    {
                        ((selectedOwnerDocument.id || 0) > 0 &&
                            (['webm', 'mpg', 'mp2', 'mpeg', 'mpe', 'mpv', 'ogg', 'mp4', 'm4p', 'm4v', 'avi', 'wmv', 'mov', 'qt', 'flv', 'swf', 'avchd'].includes(selectedOwnerDocument.doc_extension.toLowerCase()))) &&

                        <iframe id="frame-preview"
                                src={(props.serverUrl + serverDocumentsFolder + selectedOwnerDocument.doc_id) + '#toolbar=1&navpanes=0&scrollbar=0'}
                                frameBorder={0} allowFullScreen={true} width="100%" height="100%"></iframe>
                    }

                    {
                        ((selectedOwnerDocument.id || 0) > 0 &&
                            (['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(selectedOwnerDocument.doc_extension.toLowerCase()))) &&
                        <iframe id="frame-preview"
                                src={('https://view.officeapps.live.com/op/embed.aspx?src=' + props.serverUrl + serverDocumentsFolder + selectedOwnerDocument.doc_id) + '#toolbar=1&navpanes=0&scrollbar=0'}
                                frameBorder={0} allowFullScreen={true} width="100%" height="100%"></iframe>
                    }

                    {
                        ((selectedOwnerDocument.id || 0) > 0 &&
                            (['jpg', 'jpeg', 'jpe', 'jif', 'jfif', 'jfi', 'png', 'gif', 'webp', 'tiff', 'tif', 'bmp', 'jp2', 'j2k', 'jpf', 'jpx', 'jpm', 'mj2', 'svg', 'svgz'].includes(selectedOwnerDocument.doc_extension.toLowerCase()))) &&
                        // <div className="img-wrapper"><img src={props.serverUrl + serverDocumentsFolder + selectedOwnerDocument.doc_id} alt="" /></div>
                        <iframe id="frame-preview"
                                src={(props.serverUrl + serverDocumentsFolder + selectedOwnerDocument.doc_id) + '#toolbar=1&navpanes=0&scrollbar=0'}
                                frameBorder={0} allowFullScreen={true} width="100%" height="100%"></iframe>
                    }

                    {
                        ((selectedOwnerDocument.id || 0) > 0 &&
                            (!['jpg', 'jpeg', 'jpe', 'jif', 'jfif', 'jfi', 'png', 'gif', 'webp', 'tiff', 'tif', 'bmp', 'jp2', 'j2k', 'jpf', 'jpx', 'jpm', 'mj2', 'svg', 'svgz', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'htm', 'html', 'webm', 'mpg', 'mp2', 'mpeg', 'mpe', 'mpv', 'ogg', 'mp4', 'm4p', 'm4v', 'avi', 'wmv', 'mov', 'qt', 'flv', 'swf', 'avchd', '7z', 'arc', 'arj', 'bz2', 'daa', 'gz', 'rar', 'tar', 'zim', 'zip', 'pdf', 'txt', 'tmf', 'log'].includes(selectedOwnerDocument.doc_extension.toLowerCase()))) &&
                        <div className="preview-not-available">
                            <span>No preview available for this file</span> <a
                            href={props.serverUrl + serverDocumentsFolder + selectedOwnerDocument.doc_id}
                            download={true}>Download</a>
                        </div>
                    }
                </div>
            </div>

            {
                selectedOwnerDocumentNote.id !== undefined &&
                <animated.div style={modalTransitionProps}>
                    <Modal
                        selectedData={selectedOwnerDocumentNote}
                        setSelectedData={setSelectedOwnerDocumentNote}
                        selectedParent={selectedOwnerDocument}
                        setSelectedParent={(data) => {
                            setSelectedOwnerDocument({
                                ...selectedOwnerDocument,
                                notes: data.notes
                            });

                            setSelectedOwnerDocumentNote({});

                            switch (props.suborigin) {
                                case 'company-employee':
                                    props.setSelectedEmployee({
                                        id: selectedOwner.id,
                                        documents: props.selectedEmployee.documents.map((document, index) => {
                                            if (document.id === selectedOwnerDocument.id) {
                                                document.notes = data.notes;
                                            }
                                            return document;
                                        }),
                                        component_id: props.componentId
                                    });
                                    break;

                                case 'company-agent':
                                    props.setSelectedAgent({
                                        id: selectedOwner.id,
                                        documents: props.selectedAgent.documents.map((document, index) => {
                                            if (document.id === selectedOwnerDocument.id) {
                                                document.notes = data.notes;
                                            }
                                            return document;
                                        }),
                                        component_id: props.componentId
                                    });
                                    break;

                                case 'company-driver':
                                    props.setSelectedCompanyDriver({
                                        id: selectedOwner.id,
                                        documents: props.selectedDriver.documents.map((document, index) => {
                                            if (document.id === selectedOwnerDocument.id) {
                                                document.notes = data.notes;
                                            }
                                            return document;
                                        }),
                                        component_id: props.componentId
                                    });
                                    break;

                                case 'company-operator':
                                    props.setSelectedOwnerOperator({
                                        id: selectedOwner.id,
                                        documents: props.selectedOperator.documents.map((document, index) => {
                                            if (document.id === selectedOwnerDocument.id) {
                                                document.notes = data.notes;
                                            }
                                            return document;
                                        }),
                                        component_id: props.componentId
                                    });
                                    break;

                                case 'customer':
                                    props.setSelectedCustomer({
                                        id: selectedOwner.id,
                                        documents: props.selectedCustomer.documents.map((document, index) => {
                                            if (document.id === selectedOwnerDocument.id) {
                                                document.notes = data.notes;
                                            }
                                            return document;
                                        }),
                                        component_id: props.componentId
                                    });
                                    break;

                                case 'division':
                                    props.setSelectedDivision({
                                        ...selectedOwner,
                                        documents: selectedOwner.documents.map((document, index) => {
                                            if (document.id === selectedOwnerDocument.id) {
                                                document.notes = data.notes;
                                            }
                                            return document;
                                        })
                                    });
                                    break;

                                case 'carrier':
                                    props.setSelectedCarrier({
                                        id: selectedOwner.id,
                                        documents: props.selectedCarrier.documents.map((document, index) => {
                                            if (document.id === selectedOwnerDocument.id) {
                                                document.notes = data.notes;
                                            }
                                            return document;
                                        }),
                                        component_id: props.componentId
                                    });
                                    break;

                                case 'factoring-company':
                                    props.setSelectedFactoringCompany({
                                        id: selectedOwner.id,
                                        documents: props.selectedFactoringCompany.documents.map((document, index) => {
                                            if (document.id === selectedOwnerDocument.id) {
                                                document.notes = data.notes;
                                            }
                                            return document;
                                        }),
                                        component_id: props.componentId
                                    });
                                    break;

                                case 'order':
                                    props.setSelectedOrder({
                                        id: selectedOwner.id,
                                        documents: props.selected_order.documents.map((document, index) => {
                                            if (document.id === selectedOwnerDocument.id) {
                                                document.notes = data.notes;
                                            }
                                            return document;
                                        }),
                                        component_id: props.componentId
                                    });
                                    break;

                                case 'order-billing':
                                    props.setSelectedOrder({
                                        id: selectedOwner.id,
                                        billing_documents: props.selected_order.billing_documents.map((document, index) => {
                                            if (document.id === selectedOwnerDocument.id) {
                                                document.notes = data.notes;
                                            }
                                            return document;
                                        }),
                                        component_id: props.componentId
                                    });
                                    break;

                                default:
                                    break;
                            }


                        }}
                        savingDataUrl={savingDocumentNoteUrl}
                        deletingDataUrl=''
                        type='note'
                        isEditable={props.isAdmin}
                        isDeletable={props.isAdmin}
                        isAdding={selectedOwnerDocumentNote.id === 0}/>
                </animated.div>
            }

        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        scale: state.systemReducers.scale,
        serverUrl: state.systemReducers.serverUrl,
        user: state.systemReducers.user,
        dispatchOpenedPanels: state.dispatchReducers.dispatchOpenedPanels,
        customerOpenedPanels: state.customerReducers.customerOpenedPanels,
        carrierOpenedPanels: state.carrierReducers.carrierOpenedPanels,
        loadBoardOpenedPanels: state.loadBoardReducers.loadBoardOpenedPanels,
        invoiceOpenedPanels: state.invoiceReducers.invoiceOpenedPanels,
        selected_order: state.dispatchReducers.selected_order,
        selectedCustomer: state.customerReducers.selectedCustomer,
        selectedCarrier: state.carrierReducers.selectedCarrier,
        selectedFactoringCompany: state.carrierReducers.selectedFactoringCompany,
        selectedEmployee: state.companySetupReducers.selectedEmployee,
        selectedAgent: state.companySetupReducers.selectedAgent,
        selectedDriver: state.companySetupReducers.selectedDriver,
        selectedOperator: state.companySetupReducers.selectedOperator
    }
}

export default connect(mapStateToProps, {
    setCompanyOpenedPanels,
    setDispatchOpenedPanels,
    setCustomerOpenedPanels,
    setCarrierOpenedPanels,
    setLoadBoardOpenedPanels,
    setInvoiceOpenedPanels,
    setAdminCustomerOpenedPanels,
    setAdminCarrierOpenedPanels,
    setSelectedCustomer,
    setSelectedCarrier,
    setSelectedFactoringCompany,
    setSelectedOrder,
    setSelectedEmployee,
    setSelectedAgent,
    setSelectedCompanyDriver,
    setSelectedOwnerOperator
})(Documents)
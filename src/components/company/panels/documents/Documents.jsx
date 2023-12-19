import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import $ from 'jquery';
import jqueryForm from 'jquery-form';
import Draggable from 'react-draggable';
import './Documents.css';
import moment from 'moment';
import DocViewer from "react-doc-viewer";
import { useTransition, animated, useSpring } from 'react-spring';
import { Modal } from './../../panels';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
    setAdminHomePanels,
    setCompanyHomePanels,
    setAdminCarrierPanels,
    setCompanyCarrierPanels,
    setAdminCompanySetupPanels,
    setCompanyCompanySetupPanels,
    setAdminCustomerPanels,
    setCompanyCustomerPanels,
    setAdminDispatchPanels,
    setCompanyDispatchPanels,
    setAdminInvoicePanels,
    setCompanyInvoicePanels,
    setAdminLoadBoardPanels,
    setCompanyLoadBoardPanels,
    setAdminReportPanels,
    setCompanyReportPanels,

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
    const modalTransitionProps = useSpring({ opacity: (selectedOwnerDocumentNote.id !== undefined) ? 1 : 0 });

    const [currentQuickLink, setCurrentQuickLink] = useState('');

    const loadingTransition = useTransition(isSavingDocument || isLoading, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        reverse: isSavingDocument || isLoading,
    });

    useEffect(() => {
        // setSelectedOwner({ ...props.selectedOwner });
        setSelectedOwnerDocument({ ...props.selectedOwnerDocument });
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
                getDocumentsUrl = '/getOrderBillingDocumentsByOrder';
                break;
            case 'division':
                getDocumentsUrl = '/getDocumentsByDivision';
                break;
            case 'company-driver-license':
                getDocumentsUrl = '/getDocumentsByCompanyDriverLicense';
                break;
            case 'company-driver-medical-card':
                getDocumentsUrl = '/getDocumentsByCompanyDriverMedicalCard';
                break;
            case 'company-driver-tractor':
                getDocumentsUrl = '/getDocumentsByCompanyDriverTractor';
                break;
            case 'company-driver-trailer':
                getDocumentsUrl = '/getDocumentsByCompanyDriverTrailer';
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
            company_driver_license_id: props.selectedOwner.id,
            company_driver_medical_card_id: props.selectedOwner.id,
            company_driver_tractor_id: props.selectedOwner.id,
            company_driver_trailer_id: props.selectedOwner.id,
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
        } else if (size > 1024) {
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
        } else if (size > 1024) {
            newSize = (size / 1024).toFixed(2)
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
        let files = e.currentTarget.files;

        for (let i = 0; i < files.length; i++) {
            formData.append("files[]", files[i]);
        }

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
        formData.append("company_driver_license_id", selectedOwner.id);
        formData.append("company_driver_medical_card_id", selectedOwner.id);
        formData.append("company_driver_tractor_id", selectedOwner.id);
        formData.append("company_driver_trailer_id", selectedOwner.id);
        formData.append("user_code_id", props.user.user_code.id);
        formData.append("date_entered", selectedOwnerDocument.date_entered);
        formData.append("title", selectedOwnerDocument.title);
        formData.append("subject", selectedOwnerDocument.subject);
        formData.append("tags", selectedOwnerDocument.tags);
        formData.append("link", currentQuickLink);

        if (!isSavingDocument) {
            setIsSavingDocument(true);

            const options = {
                cancelToken: source.token,
                onUploadProgress: (progressEvent) => {
                    const { loaded, total } = progressEvent;

                    setProgressUploaded(isNaN(loaded) ? 0 : loaded);
                    setProgressTotal(isNaN(total) ? 0 : total);
                },
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }

            axios.post(props.serverUrl + savingDocumentUrl, formData, options)
                .then(res => {
                    if (res.data.result === "OK") {
                        if (props.suborigin === 'company-driver-license') {
                            setSelectedOwner(selectedOwner => {
                                return {
                                    ...selectedOwner,
                                    documents: res.data.documents
                                }
                            })
                        }

                        if (props.suborigin === 'company-driver-medical-card') {
                            setSelectedOwner(selectedOwner => {
                                return {
                                    ...selectedOwner,
                                    documents: res.data.documents
                                }
                            })
                        }

                        if (props.suborigin === 'company-driver-tractor') {
                            setSelectedOwner(selectedOwner => {
                                return {
                                    ...selectedOwner,
                                    documents: res.data.documents
                                }
                            })
                        }

                        if (props.suborigin === 'company-driver-trailer') {
                            setSelectedOwner(selectedOwner => {
                                return {
                                    ...selectedOwner,
                                    documents: res.data.documents
                                }
                            })
                        }

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
                                    documents: res.data.documents,
                                    billing_documents: res.data.billing_documents
                                }
                            })

                            props.setSelectedOrder({
                                id: selectedOwner.id,
                                documents: res.data.documents,
                                billing_documents: res.data.billing_documents,
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

    const openPanel = (panel, origin) => {
        if (origin === 'admin-home') {
            if (props.adminHomePanels.find(p => p.panelName === panel.panelName) === undefined) {
                props.setAdminHomePanels([...props.adminHomePanels, panel]);
            }
        }

        if (origin === 'admin-carrier') {
            if (props.adminCarrierPanels.find(p => p.panelName === panel.panelName) === undefined) {
                props.setAdminCarrierPanels([...props.adminCarrierPanels, panel]);
            }
        }

        if (origin === 'admin-company-setup') {
            if (props.adminCompanySetupPanels.find(p => p.panelName === panel.panelName) === undefined) {
                props.setAdminCompanySetupPanels([...props.adminCompanySetupPanels, panel]);
            }
        }

        if (origin === 'admin-customer') {
            if (props.adminCustomerPanels.find(p => p.panelName === panel.panelName) === undefined) {
                props.setAdminCustomerPanels([...props.adminCustomerPanels, panel]);
            }
        }

        if (origin === 'admin-dispatch') {
            if (props.adminDispatchPanels.find(p => p.panelName === panel.panelName) === undefined) {
                props.setAdminDispatchPanels([...props.adminDispatchPanels, panel]);
            }
        }

        if (origin === 'admin-invoice') {
            if (props.adminInvoicePanels.find(p => p.panelName === panel.panelName) === undefined) {
                props.setAdminInvoicePanels([...props.adminInvoicePanels, panel]);
            }
        }

        if (origin === 'admin-report') {
            if (props.adminReportPanels.find(p => p.panelName === panel.panelName) === undefined) {
                props.setAdminReportPanels([...props.adminReportPanels, panel]);
            }
        }

        if (origin === 'company-home') {
            if (props.companyHomePanels.find(p => p.panelName === panel.panelName) === undefined) {
                props.setCompanyHomePanels([...props.companyHomePanels, panel]);
            }
        }

        if (origin === 'company-carrier') {
            if (props.companyCarrierPanels.find(p => p.panelName === panel.panelName) === undefined) {
                props.setCompanyCarrierPanels([...props.companyCarrierPanels, panel]);
            }
        }

        if (origin === 'company-customer') {
            if (props.companyCustomerPanels.find(p => p.panelName === panel.panelName) === undefined) {
                props.setCompanyCustomerPanels([...props.companyCustomerPanels, panel]);
            }
        }

        if (origin === 'company-dispatch') {
            if (props.companyDispatchPanels.find(p => p.panelName === panel.panelName) === undefined) {
                props.setCompanyDispatchPanels([...props.companyDispatchPanels, panel]);
            }
        }

        if (origin === 'company-invoice') {
            if (props.companyInvoicePanels.find(p => p.panelName === panel.panelName) === undefined) {
                props.setCompanyInvoicePanels([...props.companyInvoicePanels, panel]);
            }
        }

        if (origin === 'company-load-board') {
            if (props.companyLoadBoardPanels.find(p => p.panelName === panel.panelName) === undefined) {
                props.setCompanyLoadBoardPanels([...props.companyLoadBoardPanels, panel]);
            }
        }

        if (origin === 'company-report') {
            if (props.companyReportPanels.find(p => p.panelName === panel.panelName) === undefined) {
                props.setCompanyReportPanels([...props.companyReportPanels, panel]);
            }
        }
    }

    const closePanel = (panelName, origin) => {
        if (origin === 'admin-home') {
            props.setAdminHomePanels(props.adminHomePanels.filter(panel => panel.panelName !== panelName));
        }

        if (origin === 'admin-carrier') {
            props.setAdminCarrierPanels(props.adminCarrierPanels.filter(panel => panel.panelName !== panelName));
        }

        if (origin === 'admin-company-setup') {
            props.setAdminCompanySetupPanels(props.adminCompanySetupPanels.filter(panel => panel.panelName !== panelName));
        }

        if (origin === 'admin-customer') {
            props.setAdminCustomerPanels(props.adminCustomerPanels.filter(panel => panel.panelName !== panelName));
        }

        if (origin === 'admin-dispatch') {
            props.setAdminDispatchPanels(props.adminDispatchPanels.filter(panel => panel.panelName !== panelName));
        }

        if (origin === 'admin-invoice') {
            props.setAdminInvoicePanels(props.adminInvoicePanels.filter(panel => panel.panelName !== panelName));
        }

        if (origin === 'admin-report') {
            props.setAdminReportPanels(props.adminReportPanels.filter(panel => panel.panelName !== panelName));
        }

        if (origin === 'company-home') {
            props.setCompanyHomePanels(props.companyHomePanels.filter(panel => panel.panelName !== panelName));
        }

        if (origin === 'company-carrier') {
            props.setCompanyCarrierPanels(props.companyCarrierPanels.filter(panel => panel.panelName !== panelName));
        }

        if (origin === 'company-customer') {
            props.setCompanyCustomerPanels(props.companyCustomerPanels.filter(panel => panel.panelName !== panelName));
        }

        if (origin === 'company-dispatch') {
            props.setCompanyDispatchPanels(props.companyDispatchPanels.filter(panel => panel.panelName !== panelName));
        }

        if (origin === 'company-invoice') {
            props.setCompanyInvoicePanels(props.companyInvoicePanels.filter(panel => panel.panelName !== panelName));
        }

        if (origin === 'company-load-board') {
            props.setCompanyLoadBoardPanels(props.companyLoadBoardPanels.filter(panel => panel.panelName !== panelName));
        }

        if (origin === 'company-report') {
            props.setCompanyReportPanels(props.companyReportPanels.filter(panel => panel.panelName !== panelName));
        }
    }

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
                            <Loader type="Circles" color="#009bdd" height={40} width={40} visible={item} />

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
                                        style={{ width: (isNaN(Math.floor((progressUploaded * 100) / progressTotal)) ? 0 : Math.floor((progressUploaded * 100) / progressTotal)) + '%' }}></div>
                                </div>
                            }
                        </div>
                    </animated.div>
                )
            }

            <div className="documents-owner-container">
                <div className="documents-owner-name">{
                    (props.suborigin === 'company-driver-license' ||
                        props.suborigin === 'company-driver-medical-card' ||
                        props.suborigin === 'company-driver-tractor' ||
                        props.suborigin === 'company-driver-trailer')
                        ? <div><span>Driver:</span><span>{((selectedOwner?.company_driver?.first_name || '') + ' ' + (selectedOwner?.company_driver?.last_name || '')).trim()}</span></div>
                        : props.suborigin === 'company-employee'
                            ? <div><span>Employee:</span><span>{((selectedOwner?.first_name || '') + ' ' + (selectedOwner?.last_name || '')).trim()}</span></div>
                            : props.suborigin === 'company-agent'
                                ? <div><span>Agent:</span><span>{(selectedOwner?.name || '')}</span></div>
                                : (props.suborigin === 'company-operator-license' ||
                                    props.suborigin === 'company-operator-medical-card' ||
                                    props.suborigin === 'company-operator-tractor' ||
                                    props.suborigin === 'company-operator-trailer')
                                    ? <div><span>Operator:</span><span>{((selectedOwner?.company_operator?.first_name || '') + ' ' + (selectedOwner?.company_operator?.last_name || '')).trim()}</span></div>
                                    : props.suborigin === 'customer'
                                        ? <div><span>Customer:</span><span>{(selectedOwner?.name || '')}</span></div>
                                        : props.suborigin === 'division'
                                            ? <div><span>Division:</span><span>{(selectedOwner?.name || '')}</span></div>
                                            : props.suborigin === 'carrier'
                                                ? <div><span>Carrier:</span><span>{(selectedOwner?.name || '')}</span></div>
                                                : props.suborigin === 'factoring-company'
                                                    ? <div><span>Factoring Company:</span><span>{(selectedOwner?.name || '')}</span></div>
                                                    : (props.suborigin === 'order' || props.suborigin === 'order-billing')
                                                        ? <div><span>Order:</span><span>{(selectedOwner?.order_number || '')}</span></div>
                                                        : ''
                }</div>
            </div>

            <div className="documents-fields">
                <div className="documents-left-side">

                    <div className="documents-fields-row">
                        <div className="input-box-container">
                            <input type="text" placeholder="Id" readOnly={true} value={
                                props.suborigin === 'company-agent'
                                    ? selectedOwner?.code || ''
                                    : selectedOwnerDocument.user_code?.code || props.user.user_code.code

                            } />
                        </div>

                        <div className="input-box-container" style={{ marginRight: 5 }}>
                            <input type="text" placeholder="Date Entered" readOnly={true}
                                value={selectedOwnerDocument.date_entered || moment().format('MM/DD/YYYY')} />
                        </div>

                        <div className="mochi-button" onClick={() => {
                            setSelectedOwnerDocument({
                                id: 0,
                                user_id: Math.floor(Math.random() * (15 - 1)) + 1,
                                date_entered: moment().format('MM/DD/YYYY')
                            });

                            refDocumentInput.current.value = "";

                            setCurrentQuickLink('');

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
                            (selectedOwner?.is_cancelled || 0) === 0 && ((props.suborigin === 'company-employee' || props.suborigin === 'company-driver' || props.suborigin === 'company-operator' || props.suborigin === 'order' || props.suborigin === 'order-billing' || props.suborigin === 'customer' || props.suborigin === 'division')) &&
                            <div className={quickTypeLinkClasses} style={{
                                pointerEvents: ((props.user?.user_code?.is_admin || 0) === 0 &&
                                    (((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.save || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.edit || 0) === 0))
                                    ? 'none' : 'all',
                                color: ((props.user?.user_code?.is_admin || 0) === 0 &&
                                    (((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.save || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.edit || 0) === 0))
                                    ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,1)'
                            }} onClick={() => {
                                setSelectedOwnerDocument({
                                    id: 0,
                                    user_id: Math.floor(Math.random() * (15 - 1)) + 1,
                                    date_entered: moment().format('MM/DD/YYYY'),
                                    title: 'Signed Bill of Lading',
                                    subject: 'Signed BOL',
                                    tags: 'Signed BOL|BOL|Delivery Receipt'
                                });
                                refTagInput.current.focus();

                                setCurrentQuickLink('Signed BOL');
                            }}>Signed BOL</div>
                        }

                        {
                            (selectedOwner?.is_cancelled || 0) === 0 && ((props.suborigin === 'company-employee' || props.suborigin === 'company-driver' || props.suborigin === 'company-operator' || (props.suborigin === 'order' && (props.origin === 'invoice' || props.origin === 'dispatch')))) &&
                            <div className={quickTypeLinkClasses} style={{
                                pointerEvents: ((props.user?.user_code?.is_admin || 0) === 0 &&
                                    (((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.save || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.edit || 0) === 0))
                                    ? 'none' : 'all',
                                color: ((props.user?.user_code?.is_admin || 0) === 0 &&
                                    (((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.save || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.edit || 0) === 0))
                                    ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,1)'
                            }} onClick={() => {
                                setSelectedOwnerDocument({
                                    id: 0,
                                    user_id: Math.floor(Math.random() * (15 - 1)) + 1,
                                    date_entered: moment().format('MM/DD/YYYY'),
                                    title: 'Carrier Invoice',
                                    subject: 'Carrier Invoice',
                                    tags: 'Carrier|Invoice'
                                });
                                refTagInput.current.focus();

                                setCurrentQuickLink('Carrier Invoice');
                            }}>Carrier Invoice</div>
                        }

                        {
                            (selectedOwner?.is_cancelled || 0) === 0 && ((props.suborigin === 'company-employee' || props.suborigin === 'company-driver' || props.suborigin === 'company-operator' || props.suborigin === 'order-billing' && props.origin === 'invoice')) &&
                            <div className={quickTypeLinkClasses} style={{
                                pointerEvents: ((props.user?.user_code?.is_admin || 0) === 0 &&
                                    (((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.save || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.edit || 0) === 0))
                                    ? 'none' : 'all',
                                color: ((props.user?.user_code?.is_admin || 0) === 0 &&
                                    (((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.save || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.edit || 0) === 0))
                                    ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,1)'
                            }} onClick={() => {
                                setSelectedOwnerDocument({
                                    id: 0,
                                    user_id: Math.floor(Math.random() * (15 - 1)) + 1,
                                    date_entered: moment().format('MM/DD/YYYY'),
                                    title: 'Customer Invoice',
                                    subject: 'Customer Invoice',
                                    tags: 'Customer|Invoice'
                                });
                                refTagInput.current.focus();

                                setCurrentQuickLink('Customer Invoice');
                            }}>Customer Invoice</div>
                        }

                        {
                            (selectedOwner?.is_cancelled || 0) === 0 && ((props.suborigin === 'company-employee' || props.suborigin === 'company-driver' || props.suborigin === 'company-operator' || props.suborigin === 'order')) &&
                            <div className={quickTypeLinkClasses} style={{
                                pointerEvents: ((props.user?.user_code?.is_admin || 0) === 0 &&
                                    (((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.save || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.edit || 0) === 0))
                                    ? 'none' : 'all',
                                color: ((props.user?.user_code?.is_admin || 0) === 0 &&
                                    (((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.save || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.edit || 0) === 0))
                                    ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,1)'
                            }} onClick={() => {
                                setSelectedOwnerDocument({
                                    id: 0,
                                    user_id: Math.floor(Math.random() * (15 - 1)) + 1,
                                    date_entered: moment().format('MM/DD/YYYY'),
                                    title: 'Signed Rate Confirmation',
                                    subject: 'Signed Rate Confirmation',
                                    tags: 'Signed Rate Confirmation|Rate Confirmation'
                                });
                                refTagInput.current.focus();

                                setCurrentQuickLink('Signed Rate Confirmation');
                            }}>Signed Rate Confirmation</div>
                        }

                        {
                            (selectedOwner?.is_cancelled || 0) === 0 && ((props.suborigin === 'company-employee' || props.suborigin === 'company-agent' || props.suborigin === 'company-driver' || props.suborigin === 'company-operator' || props.suborigin === 'carrier')) &&
                            <div className={quickTypeLinkClasses} style={{
                                pointerEvents: ((props.user?.user_code?.is_admin || 0) === 0 &&
                                    (((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.save || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.edit || 0) === 0))
                                    ? 'none' : 'all',
                                color: ((props.user?.user_code?.is_admin || 0) === 0 &&
                                    (((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.save || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.edit || 0) === 0))
                                    ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,1)'
                            }} onClick={() => {
                                setSelectedOwnerDocument({
                                    id: 0,
                                    user_id: Math.floor(Math.random() * (15 - 1)) + 1,
                                    date_entered: moment().format('MM/DD/YYYY'),
                                    title: 'W9',
                                    subject: 'W9',
                                    tags: 'W9|Federal EIN'
                                });
                                refTagInput.current.focus();

                                setCurrentQuickLink('W9');
                            }}>W9</div>
                        }

                        {
                            (selectedOwner?.is_cancelled || 0) === 0 && ((props.suborigin === 'company-employee' || props.suborigin === 'company-driver' || props.suborigin === 'company-operator' || props.suborigin === 'carrier')) &&
                            <div className={quickTypeLinkClasses} style={{
                                pointerEvents: ((props.user?.user_code?.is_admin || 0) === 0 &&
                                    (((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.save || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.edit || 0) === 0))
                                    ? 'none' : 'all',
                                color: ((props.user?.user_code?.is_admin || 0) === 0 &&
                                    (((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.save || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.edit || 0) === 0))
                                    ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,1)'
                            }} onClick={() => {
                                setSelectedOwnerDocument({
                                    id: 0,
                                    user_id: Math.floor(Math.random() * (15 - 1)) + 1,
                                    date_entered: moment().format('MM/DD/YYYY'),
                                    title: 'MC Authority',
                                    subject: 'Authority',
                                    tags: 'MC#|ICC#|Motor Carrier Number'
                                });
                                refTagInput.current.focus();

                                setCurrentQuickLink('Authority');
                            }}>MC Authority</div>
                        }

                        {
                            (selectedOwner?.is_cancelled || 0) === 0 && ((props.suborigin === 'company-employee' || props.suborigin === 'company-driver' || props.suborigin === 'company-operator' || props.suborigin === 'carrier')) &&
                            <div className={quickTypeLinkClasses} style={{
                                pointerEvents: ((props.user?.user_code?.is_admin || 0) === 0 &&
                                    (((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.save || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.edit || 0) === 0))
                                    ? 'none' : 'all',
                                color: ((props.user?.user_code?.is_admin || 0) === 0 &&
                                    (((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.save || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.edit || 0) === 0))
                                    ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,1)'
                            }} onClick={() => {
                                setSelectedOwnerDocument({
                                    id: 0,
                                    user_id: Math.floor(Math.random() * (15 - 1)) + 1,
                                    date_entered: moment().format('MM/DD/YYYY'),
                                    title: 'Insurance',
                                    subject: 'Insurance',
                                    tags: 'Insurance'
                                });
                                refTagInput.current.focus();

                                setCurrentQuickLink('Insurance');
                            }}>Insurance</div>
                        }

                        {
                            (selectedOwner?.is_cancelled || 0) === 0 && ((props.suborigin === 'company-employee' || props.suborigin === 'company-agent' || props.suborigin === 'company-driver' || props.suborigin === 'company-operator' || props.suborigin === 'carrier')) &&
                            <div className={quickTypeLinkClasses} style={{
                                pointerEvents: ((props.user?.user_code?.is_admin || 0) === 0 &&
                                    (((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.save || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.edit || 0) === 0))
                                    ? 'none' : 'all',
                                color: ((props.user?.user_code?.is_admin || 0) === 0 &&
                                    (((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.save || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.edit || 0) === 0))
                                    ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,1)'
                            }} onClick={() => {
                                setSelectedOwnerDocument({
                                    id: 0,
                                    user_id: Math.floor(Math.random() * (15 - 1)) + 1,
                                    date_entered: moment().format('MM/DD/YYYY'),
                                    title: props.suborigin === 'company-agent' ? 'Signed Agent Contract' : 'Signed Broker Contract',
                                    subject: props.suborigin === 'company-agent' ? 'Agent Contract' : 'Broker Contract',
                                    tags: props.suborigin === 'company-agent' ? 'Signed Contract|Signed Agent Contract' : 'Signed Contract|Signed Broker Contract'
                                });
                                refTagInput.current.focus();

                                setCurrentQuickLink(props.suborigin === 'company-agent' ? 'Agent Contract' : 'Broker Contract');
                            }}>Signed Contract</div>
                        }

                        {
                            (selectedOwner?.is_cancelled || 0) === 0 && ((props.suborigin === 'company-employee' || props.suborigin === 'company-driver' || props.suborigin === 'company-operator' || props.suborigin === 'carrier')) &&
                            <div className={quickTypeLinkClasses} style={{
                                pointerEvents: ((props.user?.user_code?.is_admin || 0) === 0 &&
                                    (((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.save || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.edit || 0) === 0))
                                    ? 'none' : 'all',
                                color: ((props.user?.user_code?.is_admin || 0) === 0 &&
                                    (((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.save || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.edit || 0) === 0))
                                    ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,1)'
                            }} onClick={() => {
                                setSelectedOwnerDocument({
                                    id: 0,
                                    user_id: Math.floor(Math.random() * (15 - 1)) + 1,
                                    date_entered: moment().format('MM/DD/YYYY'),
                                    title: 'Carrier Information',
                                    subject: 'Carrier Information',
                                    tags: 'Carrier Packet|Carrier Information Packet'
                                });
                                refTagInput.current.focus();

                                setCurrentQuickLink('Carrier Information');
                            }}>Carrier Information</div>
                        }

                        {
                            (selectedOwner?.is_cancelled || 0) === 0 && ((props.suborigin === 'company-employee' || props.suborigin === 'company-driver' || props.suborigin === 'company-operator' || props.suborigin === 'carrier' || props.suborigin === 'factoring-company')) &&
                            <div className={quickTypeLinkClasses} style={{
                                pointerEvents: ((props.user?.user_code?.is_admin || 0) === 0 &&
                                    (((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.save || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.edit || 0) === 0))
                                    ? 'none' : 'all',
                                color: ((props.user?.user_code?.is_admin || 0) === 0 &&
                                    (((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.save || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.edit || 0) === 0))
                                    ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,1)'
                            }} onClick={() => {
                                setSelectedOwnerDocument({
                                    id: 0,
                                    user_id: Math.floor(Math.random() * (15 - 1)) + 1,
                                    date_entered: moment().format('MM/DD/YYYY'),
                                    title: 'Notice of Assignment',
                                    subject: 'NOA',
                                    tags: 'Notice of Assignment|NOA'
                                });
                                refTagInput.current.focus();

                                setCurrentQuickLink('NOA');
                            }}>NOA</div>
                        }

                        {
                            (selectedOwner?.is_cancelled || 0) === 0 && ((props.suborigin === 'company-employee' || props.suborigin === 'company-driver' || props.suborigin === 'company-operator' || props.suborigin === 'carrier')) &&
                            <div className={quickTypeLinkClasses} style={{
                                pointerEvents: ((props.user?.user_code?.is_admin || 0) === 0 &&
                                    (((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.save || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.edit || 0) === 0))
                                    ? 'none' : 'all',
                                color: ((props.user?.user_code?.is_admin || 0) === 0 &&
                                    (((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.save || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.edit || 0) === 0))
                                    ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,1)'
                            }} onClick={() => {
                                setSelectedOwnerDocument({
                                    id: 0,
                                    user_id: Math.floor(Math.random() * (15 - 1)) + 1,
                                    date_entered: moment().format('MM/DD/YYYY'),
                                    title: 'Standard Carrier Alpha Code',
                                    subject: 'SCAC',
                                    tags: 'SCAC'
                                });
                                refTagInput.current.focus();

                                setCurrentQuickLink('SCAC');
                            }}>SCAC</div>
                        }

                        {
                            (selectedOwner?.is_cancelled || 0) === 0 && ((props.suborigin === 'carrier' || props.suborigin === 'factoring-company')) &&
                            <div className={quickTypeLinkClasses} style={{
                                pointerEvents: ((props.user?.user_code?.is_admin || 0) === 0 &&
                                    (((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.save || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.edit || 0) === 0))
                                    ? 'none' : 'all',
                                color: ((props.user?.user_code?.is_admin || 0) === 0 &&
                                    (((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.save || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.edit || 0) === 0))
                                    ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,1)'
                            }} onClick={() => {
                                setSelectedOwnerDocument({
                                    id: 0,
                                    user_id: Math.floor(Math.random() * (15 - 1)) + 1,
                                    date_entered: moment().format('MM/DD/YYYY'),
                                    title: 'ACH',
                                    subject: 'Signed ACH Form',
                                    tags: 'ACH'
                                });
                                refTagInput.current.focus();

                                setCurrentQuickLink('Signed ACH Form');
                            }}>ACH</div>
                        }

                        {
                            (selectedOwner?.is_cancelled || 0) === 0 && (props.suborigin === 'order') &&
                            <div className={quickTypeLinkClasses} style={{
                                pointerEvents: ((props.user?.user_code?.is_admin || 0) === 0 &&
                                    (((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.save || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.edit || 0) === 0))
                                    ? 'none' : 'all',
                                color: ((props.user?.user_code?.is_admin || 0) === 0 &&
                                    (((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.save || 0) === 0 &&
                                        ((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.edit || 0) === 0))
                                    ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,1)'
                            }} onClick={() => {
                                setSelectedOwnerDocument({
                                    id: 0,
                                    user_id: Math.floor(Math.random() * (15 - 1)) + 1,
                                    date_entered: moment().format('MM/DD/YYYY'),
                                    title: 'Carrier Invoice',
                                    subject: 'Carrier Invoice',
                                    tags: 'Carrier|Invoice'
                                });
                                refTagInput.current.focus();

                                setCurrentQuickLink('Signed Rate Confirmation');
                            }}>Carrier Invoice</div>
                        }
                    </div>

                    <div className="documents-fields-row">
                        <div className="input-box-container">
                            <input
                                readOnly={
                                    (selectedOwner?.is_cancelled || 0) === 1 ||
                                    (selectedOwnerDocument.id || 0) > 0 ||
                                    ((props.user?.user_code?.is_admin || 0) === 0 &&
                                        (((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.save || 0) === 0 &&
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.edit || 0) === 0))
                                }
                                ref={refTitleInput}
                                type="text"
                                placeholder="Title"
                                value={selectedOwnerDocument.title || ''}
                                onChange={(e) => {
                                    setSelectedOwnerDocument({ ...selectedOwnerDocument, title: e.target.value })
                                }} />

                        </div>

                        <div className="input-box-container">
                            <input
                                type="text"
                                placeholder="Subject"
                                value={selectedOwnerDocument.subject || ''}
                                onChange={(e) => {
                                    setSelectedOwnerDocument({ ...selectedOwnerDocument, subject: e.target.value })
                                }}
                                readOnly={
                                    (selectedOwner?.is_cancelled || 0) === 1 ||
                                    (selectedOwnerDocument.id || 0) > 0 ||
                                    ((props.user?.user_code?.is_admin || 0) === 0 &&
                                        (((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.save || 0) === 0 &&
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.edit || 0) === 0))
                                } />
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
                                                        style={{ marginRight: '5px', cursor: 'pointer' }}
                                                        onClick={() => {
                                                            setSelectedOwnerDocument({
                                                                ...selectedOwnerDocument,
                                                                tags: (selectedOwnerDocument.tags || '').replace(item, '').trim()
                                                            })
                                                        }}></span>
                                                }

                                                <span className="automatic-email-inputted"
                                                    style={{ whiteSpace: 'nowrap' }}>{item.toLowerCase()}</span>
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
                                readOnly={
                                    (selectedOwner?.is_cancelled || 0) === 1 ||
                                    (selectedOwnerDocument.id || 0) > 0 ||
                                    ((props.user?.user_code?.is_admin || 0) === 0 &&
                                        (((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.save || 0) === 0 &&
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.edit || 0) === 0))
                                } />
                        </div>
                    </div>
                </div>

                <div className="documents-right-side">
                    <div className={
                        (selectedOwner?.is_cancelled || 0) === 1 ||
                            ((props.user?.user_code?.is_admin || 0) === 0 &&
                                (((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.save || 0) === 0 &&
                                    ((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.edit || 0) === 0))
                            ? 'mochi-button disabled' : 'mochi-button'
                    } style={{
                        fontSize: '1.5rem'
                    }}>
                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                        <div className="mochi-button-base">Search Documents</div>
                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                    </div>
                    <div className={
                        (selectedOwner?.is_cancelled || 0) === 1 ||
                            ((props.user?.user_code?.is_admin || 0) === 0 &&
                                (((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.save || 0) === 0 &&
                                    ((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.edit || 0) === 0))
                            ? 'mochi-button disabled' : 'mochi-button'
                    } style={{
                        fontSize: '1.5rem'
                    }}>
                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                        <div className="mochi-button-base">E-Mail Documents</div>
                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                    </div>
                    <div className={
                        (selectedOwner?.is_cancelled || 0) === 1 ||
                            ((props.user?.user_code?.is_admin || 0) === 0 &&
                                (((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.save || 0) === 0 &&
                                    ((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.edit || 0) === 0))
                            ? 'mochi-button disabled' : 'mochi-button'
                    } style={{
                        fontSize: '1.5rem',
                        pointerEvents: (selectedOwner?.is_cancelled || 0) === 1 || (selectedOwnerDocument.id || 0) > 0 ||
                            ((props.user?.user_code?.is_admin || 0) === 0 &&
                                (((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.save || 0) === 0 &&
                                    ((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.edit || 0) === 0))
                            ? 'none' : 'all'

                    }} onClick={uploadDocumentBtnClick}>
                        <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                        <div className="mochi-button-base"
                            style={{ color: (selectedOwnerDocument.id || 0) > 0 ? 'rgba(0,0,0,0.3)' : '#323232' }}>Upload
                            Documents
                        </div>
                        <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                    </div>

                    <form encType='multipart/form-data' style={{ display: 'none' }}>
                        <input type="file" multiple={true} ref={refDocumentInput} onChange={validateDocumentToSave} />
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
                                            if ((selectedOwner?.is_cancelled || 0) === 0) {
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

                                                    case 'company-driver-license':
                                                        getDocumentNotesUrl = '/getNotesByCompanyDriverLicenseDocument';
                                                        break;

                                                    case 'company-driver-medical-card':
                                                        getDocumentNotesUrl = '/getNotesByCompanyDriverMedicalCardDocument';
                                                        break;

                                                    case 'company-driver-tractor':
                                                        getDocumentNotesUrl = '/getNotesByCompanyDriverTractorDocument';
                                                        break;

                                                    case 'company-driver-trailer':
                                                        getDocumentNotesUrl = '/getNotesByCompanyDriverTrailerDocument';
                                                        break;

                                                    default:
                                                        break;
                                                }

                                                axios.post(props.serverUrl + getDocumentNotesUrl, {
                                                    doc_id: document.id,
                                                }).then(res => {
                                                    if (res.data.result === 'OK') {
                                                        document.notes = [...res.data.documentNotes]
                                                    }

                                                    setSelectedOwnerDocument(document);
                                                });
                                            }
                                        }}>
                                            <div className="item-info">
                                                <span className={docIconClasses}></span>
                                                <span>{document.user_id}</span>
                                                <span>{document.date_entered}</span>
                                                <span>{document.title}</span>
                                                <span>{document.subject}</span>
                                                <span style={{ color: '#1b73cb', flexGrow: 1, textOverflow: 'ellipsis' }} title={document.doc_name}>({document.doc_name})</span>
                                            </div>

                                            <div className="documents-list-col tcol documents-selected">
                                                {
                                                    (document.id === (selectedOwnerDocument?.id || 0)) &&
                                                    <FontAwesomeIcon icon={faPencilAlt} />
                                                }
                                            </div>
                                            {
                                                ((selectedOwner?.is_cancelled || 0) === 0 && ((props.user?.user_code?.is_admin || 0) === 1 ||
                                                    (((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.delete || 0) === 1))) &&
                                                <div className="item-btn" style={{ marginLeft: 5 }} onClick={(e) => {
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
                                                            customer_id: selectedOwner.id,
                                                            carrier_id: selectedOwner.id,
                                                            factoring_company_id: selectedOwner.id,
                                                            company_driver_license_id: selectedOwner.id,
                                                            company_driver_medical_card_id: selectedOwner.id,
                                                            company_driver_tractor_id: selectedOwner.id,
                                                            company_driver_trailer_id: selectedOwner.id,
                                                        }).then(res => {
                                                            if (res.data.result === 'OK') {
                                                                if (props.suborigin === 'company-driver-license') {
                                                                    setSelectedOwner(selectedOwner => {
                                                                        return { ...selectedOwner, documents: res.data.documents }
                                                                    })
                                                                }

                                                                if (props.suborigin === 'company-driver-medical-card') {
                                                                    setSelectedOwner(selectedOwner => {
                                                                        return { ...selectedOwner, documents: res.data.documents }
                                                                    })
                                                                }

                                                                if (props.suborigin === 'company-driver-tractor') {
                                                                    setSelectedOwner(selectedOwner => {
                                                                        return { ...selectedOwner, documents: res.data.documents }
                                                                    })
                                                                }

                                                                if (props.suborigin === 'company-driver-trailer') {
                                                                    setSelectedOwner(selectedOwner => {
                                                                        return { ...selectedOwner, documents: res.data.documents }
                                                                    })
                                                                }

                                                                if (props.suborigin === 'company-employee') {
                                                                    setSelectedOwner(selectedOwner => {
                                                                        return { ...selectedOwner, documents: res.data.documents }
                                                                    })

                                                                    props.setSelectedEmployee({
                                                                        id: selectedOwner.id,
                                                                        documents: res.data.documents,
                                                                        component_id: props.componentId
                                                                    });
                                                                }

                                                                if (props.suborigin === 'company-agent') {
                                                                    setSelectedOwner(selectedOwner => {
                                                                        return { ...selectedOwner, documents: res.data.documents }
                                                                    })

                                                                    props.setSelectedAgent({
                                                                        id: selectedOwner.id,
                                                                        documents: res.data.documents,
                                                                        component_id: props.componentId
                                                                    });
                                                                }

                                                                if (props.suborigin === 'company-driver') {
                                                                    setSelectedOwner(selectedOwner => {
                                                                        return { ...selectedOwner, documents: res.data.documents }
                                                                    })

                                                                    props.setSelectedCompanyDriver({
                                                                        id: selectedOwner.id,
                                                                        documents: res.data.documents,
                                                                        component_id: props.componentId
                                                                    });
                                                                }

                                                                if (props.suborigin === 'company-operator') {
                                                                    setSelectedOwner(selectedOwner => {
                                                                        return { ...selectedOwner, documents: res.data.documents }
                                                                    })

                                                                    props.setSelectedOwnerOperator({
                                                                        id: selectedOwner.id,
                                                                        documents: res.data.documents,
                                                                        component_id: props.componentId
                                                                    });
                                                                }

                                                                if (props.suborigin === 'customer') {
                                                                    setSelectedOwner(selectedOwner => {
                                                                        return { ...selectedOwner, documents: res.data.documents }
                                                                    })

                                                                    props.setSelectedCustomer({
                                                                        id: selectedOwner.id,
                                                                        documents: res.data.documents,
                                                                        component_id: props.componentId
                                                                    });
                                                                }

                                                                if (props.suborigin === 'division') {
                                                                    setSelectedOwner(selectedOwner => {
                                                                        return { ...selectedOwner, documents: res.data.documents }
                                                                    })

                                                                    props.setSelectedDivision({
                                                                        ...selectedOwner,
                                                                        documents: res.data.documents
                                                                    });
                                                                }

                                                                if (props.suborigin === 'carrier') {
                                                                    setSelectedOwner(selectedOwner => {
                                                                        return { ...selectedOwner, documents: res.data.documents }
                                                                    })

                                                                    props.setSelectedCarrier({
                                                                        id: selectedOwner.id,
                                                                        documents: res.data.documents,
                                                                        component_id: props.componentId
                                                                    });
                                                                }

                                                                if (props.suborigin === 'factoring-company') {
                                                                    setSelectedOwner(selectedOwner => {
                                                                        return { ...selectedOwner, documents: res.data.documents }
                                                                    })

                                                                    props.setSelectedFactoringCompany({
                                                                        id: selectedOwner.id,
                                                                        documents: res.data.documents,
                                                                        component_id: props.componentId
                                                                    });
                                                                }

                                                                if (props.suborigin === 'order') {
                                                                    setSelectedOwner(selectedOwner => {
                                                                        return { ...selectedOwner, documents: res.data.documents }
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

                                                    <FontAwesomeIcon icon={faTrashAlt} />

                                                </div>
                                            }
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
                            <div className={
                                (selectedOwner?.is_cancelled || 0) === 1 ||
                                    ((props.user?.user_code?.is_admin || 0) === 0 &&
                                        (((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.save || 0) === 0 &&
                                            ((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.edit || 0) === 0))
                                    ? 'mochi-button disabled' : 'mochi-button'
                            } onClick={() => {
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
                                    pointerEvents: (selectedOwnerDocument.id || 0) > 0 &&
                                        ((props.user?.user_code?.is_admin || 0) === 1 ||
                                            (((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.save || 0) === 1 &&
                                                ((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.edit || 0) === 1))
                                        ? 'all' : 'none'
                                }}>
                                <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                                <div className="mochi-button-base" style={{ color: (selectedOwnerDocument.id || 0) > 0 ? '#323232' : 'rgba(0,0,0,0.3)' }}>
                                    Add Note
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
                                                <FontAwesomeIcon icon={faPencilAlt} />
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
                            src={((props.serverUrl.replace('/api', '')) + serverDocumentsFolder + selectedOwnerDocument.doc_id) + '#toolbar=1&navpanes=0&scrollbar=0'}
                            frameBorder={0} allowFullScreen={true} width="100%" height="100%"></iframe>
                    }

                    {
                        ((selectedOwnerDocument.id || 0) > 0 &&
                            (['webm', 'mpg', 'mp2', 'mpeg', 'mpe', 'mpv', 'ogg', 'mp4', 'm4p', 'm4v', 'avi', 'wmv', 'mov', 'qt', 'flv', 'swf', 'avchd'].includes(selectedOwnerDocument.doc_extension.toLowerCase()))) &&

                        <iframe id="frame-preview"
                            src={((props.serverUrl.replace('/api', '')) + serverDocumentsFolder + selectedOwnerDocument.doc_id) + '#toolbar=1&navpanes=0&scrollbar=0'}
                            frameBorder={0} allowFullScreen={true} width="100%" height="100%"></iframe>
                    }

                    {
                        ((selectedOwnerDocument.id || 0) > 0 &&
                            (['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(selectedOwnerDocument.doc_extension.toLowerCase()))) &&
                        <iframe id="frame-preview"
                            src={('https://view.officeapps.live.com/op/embed.aspx?src=' + (props.serverUrl.replace('/api', '')) + serverDocumentsFolder + selectedOwnerDocument.doc_id) + '#toolbar=1&navpanes=0&scrollbar=0'}
                            frameBorder={0} allowFullScreen={true} width="100%" height="100%"></iframe>
                    }

                    {
                        ((selectedOwnerDocument.id || 0) > 0 &&
                            (['jpg', 'jpeg', 'jpe', 'jif', 'jfif', 'jfi', 'png', 'gif', 'webp', 'tiff', 'tif', 'bmp', 'jp2', 'j2k', 'jpf', 'jpx', 'jpm', 'mj2', 'svg', 'svgz'].includes(selectedOwnerDocument.doc_extension.toLowerCase()))) &&
                        // <div className="img-wrapper"><img src={props.serverUrl + serverDocumentsFolder + selectedOwnerDocument.doc_id} alt="" /></div>
                        <iframe id="frame-preview"
                            src={((props.serverUrl.replace('/api', '')) + serverDocumentsFolder + selectedOwnerDocument.doc_id) + '#toolbar=1&navpanes=0&scrollbar=0'}
                            frameBorder={0} allowFullScreen={true} width="100%" height="100%"></iframe>
                    }

                    {
                        ((selectedOwnerDocument.id || 0) > 0 &&
                            (!['jpg', 'jpeg', 'jpe', 'jif', 'jfif', 'jfi', 'png', 'gif', 'webp', 'tiff', 'tif', 'bmp', 'jp2', 'j2k', 'jpf', 'jpx', 'jpm', 'mj2', 'svg', 'svgz', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'htm', 'html', 'webm', 'mpg', 'mp2', 'mpeg', 'mpe', 'mpv', 'ogg', 'mp4', 'm4p', 'm4v', 'avi', 'wmv', 'mov', 'qt', 'flv', 'swf', 'avchd', '7z', 'arc', 'arj', 'bz2', 'daa', 'gz', 'rar', 'tar', 'zim', 'zip', 'pdf', 'txt', 'tmf', 'log'].includes(selectedOwnerDocument.doc_extension.toLowerCase()))) &&
                        <div className="preview-not-available">
                            <span>No preview available for this file</span> <a
                                href={(props.serverUrl.replace('/api', '')) + serverDocumentsFolder + selectedOwnerDocument.doc_id}
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
                        selectedParent={{ ...selectedOwnerDocument, is_cancelled: selectedOwner?.is_cancelled || 0 }}

                        setSelectedParent={(data) => {
                            setSelectedOwnerDocument({
                                ...selectedOwnerDocument,
                                notes: data.data
                            });

                            setSelectedOwnerDocumentNote({});

                            switch (props.suborigin) {
                                case 'company-employee':
                                    props.setSelectedEmployee({
                                        id: selectedOwner.id,
                                        documents: props.selectedEmployee.documents.map((document, index) => {
                                            if (document.id === selectedOwnerDocument.id) {
                                                document.notes = data.data;
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
                                                document.notes = data.data;
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
                                                document.notes = data.data;
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
                                                document.notes = data.data;
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
                                                document.notes = data.data;
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
                                                document.notes = data.data;
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
                                                document.notes = data.data;
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
                                                document.notes = data.data;
                                            }
                                            return document;
                                        }),
                                        component_id: props.componentId
                                    });
                                    break;

                                case 'order':
                                    props.setSelectedOrder({
                                        id: selectedOwner.id,
                                        documents: (props.selected_order.documents || []).map((document, index) => {
                                            if (document.id === selectedOwnerDocument.id) {
                                                document.notes = data.data;
                                            }
                                            return document;
                                        }),
                                        component_id: props.componentId
                                    });
                                    break;

                                case 'order-billing':
                                    props.setSelectedOrder({
                                        id: selectedOwner.id,
                                        billing_documents: (props.selected_order.billing_documents || []).map((document, index) => {
                                            if (document.id === selectedOwnerDocument.id) {
                                                document.notes = data.data;
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
                        deletingDataUrl={props.deletingDocumentNoteUrl || ''}
                        type='note'
                        isEditable={
                            ((props.user?.user_code?.is_admin || 0) === 1 ||
                                (((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.save || 0) === 1 &&
                                    ((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.edit || 0) === 1))
                        }
                        isDeletable={
                            ((props.user?.user_code?.is_admin || 0) === 1 ||
                                (((props.user?.user_code?.permissions || []).find(x => x.name === props.permissionName)?.pivot?.delete || 0) === 1))
                        }
                        isAdding={selectedOwnerDocumentNote.id === 0} />
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

        adminHomePanels: state.adminReducers.adminHomePanels,
        companyHomePanels: state.companyReducers.companyHomePanels,
        adminCompanySetupPanels: state.companySetupReducers.adminCompanySetupPanels,
        companyCompanySetupPanels: state.companySetupReducers.companyCompanySetupPanels,
        adminCarrierPanels: state.carrierReducers.adminCarrierPanels,
        companyCarrierPanels: state.carrierReducers.companyCarrierPanels,
        adminCustomerPanels: state.customerReducers.adminCustomerPanels,
        companyCustomerPanels: state.customerReducers.companyCustomerPanels,
        adminDispatchPanels: state.dispatchReducers.adminDispatchPanels,
        companyDispatchPanels: state.dispatchReducers.companyDispatchPanels,
        adminInvoicePanels: state.invoiceReducers.adminInvoicePanels,
        companyInvoicePanels: state.invoiceReducers.companyInvoicePanels,
        adminLoadBoardPanels: state.loadBoardReducers.adminLoadBoardPanels,
        companyLoadBoardPanels: state.loadBoardReducers.companyLoadBoardPanels,
        adminReportPanels: state.reportReducers.adminReportPanels,
        companyReportPanels: state.reportReducers.companyReportPanels,

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
    setAdminHomePanels,
    setCompanyHomePanels,
    setAdminCarrierPanels,
    setCompanyCarrierPanels,
    setAdminCompanySetupPanels,
    setCompanyCompanySetupPanels,
    setAdminCustomerPanels,
    setCompanyCustomerPanels,
    setAdminDispatchPanels,
    setCompanyDispatchPanels,
    setAdminInvoicePanels,
    setCompanyInvoicePanels,
    setAdminLoadBoardPanels,
    setCompanyLoadBoardPanels,
    setAdminReportPanels,
    setCompanyReportPanels,

    setSelectedCustomer,
    setSelectedCarrier,
    setSelectedFactoringCompany,
    setSelectedOrder,
    setSelectedEmployee,
    setSelectedAgent,
    setSelectedCompanyDriver,
    setSelectedOwnerOperator
})(Documents)
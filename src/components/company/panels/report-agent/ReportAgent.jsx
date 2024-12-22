/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from 'react'
import './ReportAgent.css'
import { connect } from "react-redux";
import Loader from 'react-loader-spinner';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import axios from 'axios';
import { useTransition, animated } from 'react-spring';
import { TextInputV2 } from '../../../controls';
import Agents from '../../../admin/panels/agents/Agents';
import moment from 'moment';
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
  setCompanyReportPanels
} from './../../../../actions'

const ReportAgent = (props) => {
  const refReportAgentContainer = useRef()
  const [isLoading, setIsLoading] = useState(false)
  const [list, setList] = useState([])
  const [filteredList, setFilteredList] = useState([])

  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [address1, setAddress1] = useState('')
  const [address2, setAddress2] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zip, setZip] = useState('')
  const [contactName, setContactName] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [contactEmail, setContactEmail] = useState('')

  const refCode = useRef()
  const refName = useRef()
  const refAddress1 = useRef()
  const refAddress2 = useRef()
  const refCity = useRef()
  const refState = useRef()
  const refZip = useRef()
  const refContactName = useRef()
  const refContactPhone = useRef()
  const refContactEmail = useRef()

  const loadingTransition = useTransition(isLoading, {
    from: { opacity: 0, display: 'block' },
    enter: { opacity: 1, display: 'block' },
    leave: { opacity: 0, display: 'none' },
    reverse: isLoading,
  });

  useEffect(() => {
    setIsLoading(true)

    axios.post(props.serverUrl + '/getAgentReport').then(res => {
      if (res.data.result === 'OK') {
        setList(res.data.agents)
        setFilteredList(res.data.agents)
      }
    }).catch(e => {
      console.log('Error getting agents');
    }).finally(() => {
      setIsLoading(false)
    })
  }, [])

  useEffect(() => {
    if (refCode?.current) {
      refCode.current.focus({ preventScroll: true })
    }
  }, [refCode?.current])

  useEffect(() => {
    setFilteredList(list.filter(x => {
      return (x?.code || '').toLowerCase().includes(code.toLowerCase()) &&
        (x?.name || '').toLowerCase().includes(name.toLowerCase()) &&
        (x?.name || '').toLowerCase().includes(name.toLowerCase()) &&
        (x?.address1 || '').toLowerCase().includes(address1.toLowerCase()) &&
        (x?.address2 || '').toLowerCase().includes(address2.toLowerCase()) &&
        (x?.city || '').toLowerCase().includes(city.toLowerCase()) &&
        (x?.state || '').toLowerCase().includes(state.toLowerCase()) &&
        (x?.zip || '').toLowerCase().includes(zip.toLowerCase()) &&
        (x?.contact_name || '').toLowerCase().includes(contactName.toLowerCase()) &&
        (x?.phone || '').toLowerCase().includes(contactPhone.toLowerCase()) &&
        (x?.email || '').toLowerCase().includes(contactEmail.toLowerCase())
    }))
  }, [
    code,
    name,
    address1,
    address2,
    city,
    state,
    zip,
    contactName,
    contactPhone,
    contactEmail
  ])

  const onInputKeydown = (e) => {
    if (e.key.toLowerCase() === 'escape') {
      e.stopPropagation()
      if (code.trim() !== '' ||
        name.trim() !== '' ||
        address1.trim() !== '' ||
        address2.trim() !== '' ||
        city.trim() !== '' ||
        state.trim() !== '' ||
        zip.trim() !== '' ||
        contactName.trim() !== '' ||
        contactPhone.trim() !== '' ||
        contactEmail.trim() !== '') {
        setCode('')
        setName('')
        setAddress1('')
        setAddress2('')
        setCity('')
        setState('')
        setZip('')
        setContactName('')
        setContactPhone('')
        setContactEmail('')

        refCode.current.focus({ preventScroll: true })
      } else {
        props.closingCallback();
      }
    }
  }

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
    <div className='panel-content reports-main-container-agent' ref={refReportAgentContainer} tabIndex={props.tabTimes + 0} onKeyDown={onInputKeydown}>
      <div className="drag-handler" onClick={e => e.stopPropagation()}></div>
      <div className="title">{props.title} <span className="list-count">{filteredList.length}</span></div>
      <div className="close-btn" title="Close" onClick={e => { props.closingCallback() }}><span className="fas fa-times"></span></div>
      <div className="side-title"><div>{props.title}</div></div>

      {
        loadingTransition((style, item) => item &&
          <animated.div className='loading-container' style={{ ...style, zIndex: 0 }}>
            <div className="loading-container-wrapper">
              <Loader type="Circles" color="#009bdd" height={40} width={40} visible={item} />
            </div>
          </animated.div>
        )
      }

      <div className="reports-container-wrapper">
        <div className="reports-container">
          <div className="report-table-header">
            <div className="report-table-header-wrapper">
              <div className="report-table-cell code">
                <TextInputV2
                  placeholder='Code'
                  inputStyles={{ fontSize: 12 }}
                  tabIndex={props.tabTimes + 1}
                  forwardedRef={refCode}
                  value={code}
                  onChange={(e) => { setCode(e.target.value) }}
                  onKeyDown={onInputKeydown}
                />
              </div>
              <div className="report-table-cell name">
                <TextInputV2
                  placeholder='Name'
                  inputStyles={{ fontSize: 12 }}
                  tabIndex={props.tabTimes + 2}
                  forwardedRef={refName}
                  value={name}
                  onChange={(e) => { setName(e.target.value) }}
                  onKeyDown={onInputKeydown}
                />
              </div>
              <div className="report-table-cell address1">
                <TextInputV2
                  placeholder='Address 1'
                  inputStyles={{ fontSize: 12 }}
                  tabIndex={props.tabTimes + 3}
                  forwardedRef={refAddress1}
                  value={address1}
                  onChange={(e) => { setAddress1(e.target.value) }}
                  onKeyDown={onInputKeydown}
                />
              </div>
              <div className="report-table-cell address2">
                <TextInputV2
                  placeholder='Address 2'
                  inputStyles={{ fontSize: 12 }}
                  tabIndex={props.tabTimes + 4}
                  forwardedRef={refAddress2}
                  value={address2}
                  onChange={(e) => { setAddress2(e.target.value) }}
                  onKeyDown={onInputKeydown}
                />
              </div>
              <div className="report-table-cell city">
                <TextInputV2
                  placeholder='City'
                  inputStyles={{ fontSize: 12 }}
                  tabIndex={props.tabTimes + 5}
                  forwardedRef={refCity}
                  value={city}
                  onChange={(e) => { setCity(e.target.value) }}
                  onKeyDown={onInputKeydown}
                />
              </div>
              <div className="report-table-cell state">
                <TextInputV2
                  placeholder='State'
                  tabIndex={props.tabTimes + 6}
                  forwardedRef={refState}
                  inputStyles={{ textTranform: 'uppercase', fontSize: 12 }}
                  maxLength={2}
                  value={state}
                  onChange={(e) => { setState(e.target.value) }}
                  onKeyDown={onInputKeydown}
                />
              </div>
              <div className="report-table-cell zip">
                <TextInputV2
                  placeholder='Postal Code'
                  inputStyles={{ fontSize: 12 }}
                  tabIndex={props.tabTimes + 7}
                  forwardedRef={refZip}
                  value={zip}
                  onChange={(e) => { setZip(e.target.value) }}
                  onKeyDown={onInputKeydown}
                />
              </div>
              <div className="report-table-cell contact-name">
                <TextInputV2
                  placeholder='Contact Name'
                  inputStyles={{ fontSize: 12 }}
                  tabIndex={props.tabTimes + 8}
                  forwardedRef={refContactName}
                  value={contactName}
                  onChange={(e) => { setContactName(e.target.value) }}
                  onKeyDown={onInputKeydown}
                />
              </div>
              <div className="report-table-cell contact-phone">
                <TextInputV2
                  placeholder='Contact Phone'
                  inputStyles={{ fontSize: 12 }}
                  tabIndex={props.tabTimes + 9}
                  forwardedRef={refContactPhone}
                  value={contactPhone}
                  onChange={(e) => { setContactPhone(e.target.value) }}
                  onKeyDown={onInputKeydown}
                />
              </div>
              <div className="report-table-cell contact-email">
                <TextInputV2
                  placeholder='Contact E-Mail'
                  inputStyles={{ fontSize: 12 }}
                  tabIndex={props.tabTimes + 10}
                  forwardedRef={refContactEmail}
                  value={contactEmail}
                  onChange={(e) => { setContactEmail(e.target.value) }}
                  onKeyDown={onInputKeydown}
                />
              </div>
            </div>
          </div>
          <div className="report-table-body">
            <div className="report-table-body-wrapper">
              {
                filteredList.map((item) => {
                  item.name = (item.name || '').toLowerCase()
                  item.address1 = (item.address1 || '').toLowerCase()
                  item.address2 = (item.address2 || '').toLowerCase()
                  item.city = (item.city || '').toLowerCase()
                  item.contact_name = (item.contact_name || '').toLowerCase()
                  return (
                    <div className="report-table-row" key={item.id} onClick={() => {
                      let panel = {
                        panelName: `${props.panelName}-agents`,
                        component: <Agents
                          title='Agent'
                          tabTimes={222280 + props.tabTimes}
                          panelName={`${props.panelName}-agents`}
                          origin={props.origin}
                          componentId={moment().format('x')}
                          isAdmin={props.isAdmin}
                          setSelectedCompany={() => { }}
                          selectedCompany={{ id: item.company_id }}
                          selectedAgent={{ id: item.id }}
                          closingCallback={() => {
                            closePanel(`${props.panelName}-agents`, props.origin);
                            refCode.current.focus({ preventScroll: true })
                          }}
                        />
                      }

                      openPanel(panel, props.origin);
                    }}>
                      <div className="report-table-cell code">{item?.code || ''}</div>
                      <div className="report-table-cell name">{item?.name || ''}</div>
                      <div className="report-table-cell address1">{item?.address1 || ''}</div>
                      <div className="report-table-cell address2">{item?.address2 || ''}</div>
                      <div className="report-table-cell city">{item?.city || ''}</div>
                      <div className="report-table-cell state">{item?.state || ''}</div>
                      <div className="report-table-cell zip">{item?.zip || ''}</div>
                      <div className="report-table-cell contact-name">{item?.contact_name || ''}</div>
                      <div className="report-table-cell contact-phone">{item?.phone || ''}</div>
                      <div className="report-table-cell contact-email">{item?.email || ''}</div>
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
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
    companyReportPanels: state.reportReducers.companyReportPanels
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
  setCompanyReportPanels
})(ReportAgent)
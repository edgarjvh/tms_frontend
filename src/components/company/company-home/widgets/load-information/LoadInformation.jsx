import React, { useState, useEffect } from 'react'
import './LoadInformation.css'
import moment from 'moment'
import { connect } from 'react-redux';
import { formatNumber } from 'accounting';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
} from "./../../../../../actions";

import LoadBoard from '../../../load-board/LoadBoard';
import { faExpandArrowsAlt } from '@fortawesome/free-solid-svg-icons';

function LoadInformation(props) {
  const [availableRevenue, setAvailableRevenue] = useState(0)
  const [bookedRevenue, setBookedRevenue] = useState(0)
  const [inTransitRevenue, setInTransitRevenue] = useState(0)
  const [deliveredRevenue, setDeliveredRevenue] = useState(0)
  const [availableProfit, setAvailableProfit] = useState(0)
  const [bookedProfit, setBookedProfit] = useState(0)
  const [inTransitProfit, setInTransitProfit] = useState(0)
  const [deliveredProfit, setDeliveredProfit] = useState(0)

  useEffect(() => {
    if ((props.availableOrders || []).length > 0) {
      const total_customer_rating = props.availableOrders.reduce((a, b) => {
        return a + (b.total_customer_rating || 0)
      }, 0) || 0;

      const total_carrier_rating = props.availableOrders.reduce((a, b) => {
        return a + (b.total_carrier_rating || 0)
      }, 0) || 0;

      setAvailableRevenue(total_customer_rating)
      setAvailableProfit(total_customer_rating - total_carrier_rating)
    } else {
      setAvailableRevenue(0)
      setAvailableProfit(0)
    }
  }, [props.availableOrders])

  useEffect(() => {
    if ((props.bookedOrders || []).length > 0) {
      const total_customer_rating = props.bookedOrders.reduce((a, b) => {
        return a + (b.total_customer_rating || 0)
      }, 0) || 0;

      const total_carrier_rating = props.bookedOrders.reduce((a, b) => {
        return a + (b.total_carrier_rating || 0)
      }, 0) || 0;

      setBookedRevenue(total_customer_rating)
      setBookedProfit(total_customer_rating - total_carrier_rating)
    } else {
      setBookedRevenue(0)
      setBookedProfit(0)
    }
  }, [props.bookedOrders])

  useEffect(() => {
    if ((props.inTransitOrders || []).length > 0) {
      const total_customer_rating = props.inTransitOrders.reduce((a, b) => {
        return a + (b.total_customer_rating || 0)
      }, 0) || 0;

      const total_carrier_rating = props.inTransitOrders.reduce((a, b) => {
        return a + (b.total_carrier_rating || 0)
      }, 0) || 0;

      setInTransitRevenue(total_customer_rating)
      setInTransitProfit(total_customer_rating - total_carrier_rating)
    } else {
      setInTransitRevenue(0)
      setInTransitProfit(0)
    }
  }, [props.inTransitOrders])

  useEffect(() => {
    if ((props.deliveredNotInvoiced || []).length > 0) {
      const total_customer_rating = props.deliveredNotInvoiced.reduce((a, b) => {
        return a + (b.total_customer_rating || 0)
      }, 0) || 0;

      const total_carrier_rating = props.deliveredNotInvoiced.reduce((a, b) => {
        return a + (b.total_carrier_rating || 0)
      }, 0) || 0;

      setDeliveredRevenue(total_customer_rating)
      setDeliveredProfit(total_customer_rating - total_carrier_rating)
    } else {
      setDeliveredRevenue(0)
      setDeliveredProfit(0)
    }
  }, [props.deliveredNotInvoiced])

  const openLoadBoardPanel = () => {
    let panel = {
      panelName: `${props.panelName}-load-board`,
      component: (
        <LoadBoard
          pageName={"Load Board"}
          title={"Load Board"}
          panelName={"load-board"}
          tabTimes={445000 + props.tabTimes}
          screenFocused={props.loadBoardScreenFocused}
          componentId={moment().format("x")}
          isOnPanel={true}
          isAdmin={props.isAdmin}
          origin={props.origin}
        />
      ),
    };

    openPanel(panel, props.origin);
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
    <div className='widget widget-load-information'>
      <div className="widget-header">
        <div className="date-info">
          {moment().format('MM/DD/YYYY')}
        </div>
        <div className="title">
          <span title='Open the Load Board panel' onClick={() => { openLoadBoardPanel() }}>Load Information</span>
          <FontAwesomeIcon forwardedRef={props.refGrab} className='drag-widget' icon={faExpandArrowsAlt} />
        </div>
      </div>

      <div className="load-data">
        <div className="load-data-header">
          <div></div>
          <div className="revenue">Total Revenue</div>
          <div className="profit">Net Profit</div>
        </div>
        <div className="category-info">
          <div className="name">Available Loads <span className='category-count'>{(props.availableOrders || []).length}</span></div>
          <div className="revenue">{`$ ${formatNumber(availableRevenue, 2, ',', '.')}`}</div>
          <div className="profit">{`$ ${formatNumber(availableProfit, 2, ',', '.')}`}</div>
        </div>
        <div className="category-info">
          <div className="name">Booked Loads <span className='category-count'>{(props.bookedOrders || []).length}</span></div>
          <div className="revenue">{`$ ${formatNumber(bookedRevenue, 2, ',', '.')}`}</div>
          <div className="profit">{`$ ${formatNumber(bookedProfit, 2, ',', '.')}`}</div>
        </div>
        <div className="category-info">
          <div className="name">In Transit Loads <span className='category-count'>{(props.inTransitOrders || []).length}</span></div>
          <div className="revenue">{`$ ${formatNumber(inTransitRevenue, 2, ',', '.')}`}</div>
          <div className="profit">{`$ ${formatNumber(inTransitProfit, 2, ',', '.')}`}</div>
        </div>
        <div className="category-info">
          <div className="name">Delivered Not Invoiced <span className='category-count'>{(props.deliveredNotInvoiced || []).length}</span></div>
          <div className="revenue">{`$ ${formatNumber(deliveredRevenue, 2, ',', '.')}`}</div>
          <div className="profit">{`$ ${formatNumber(deliveredProfit, 2, ',', '.')}`}</div>
        </div>
        <div className="totals-info">
          <div className="name">Totals</div>
          <div className="revenue">{`$ ${formatNumber(availableRevenue + bookedRevenue + inTransitRevenue + deliveredRevenue, 2, ',', '.')}`}</div>
          <div className="profit">{`$ ${formatNumber(availableProfit + bookedProfit + inTransitProfit + deliveredProfit, 2, ',', '.')}`}</div>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    availableOrders: state.loadBoardReducers.availableOrders,
    bookedOrders: state.loadBoardReducers.bookedOrders,
    inTransitOrders: state.loadBoardReducers.inTransitOrders,
    deliveredNotInvoiced: state.loadBoardReducers.deliveredNotInvoiced,
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
    isLoadingWidget: state.loadBoardReducers.isLoadingWidget,
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
})(LoadInformation)
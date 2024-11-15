/* eslint-disable react/style-prop-object */
/* eslint-disable jsx-a11y/iframe-has-title */
import React, { useState, useEffect } from 'react'
import './FuelPrices.css'
import moment from 'moment'
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
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

import { faExpandArrowsAlt, faLongArrowAltUp, faLongArrowAltDown } from '@fortawesome/free-solid-svg-icons';

function FuelPrices(props) {
  const [isLoading, setIsLoading] = useState(false)
  const [us, setUs] = useState([])
  const [eastCoast, setEastCoast] = useState([])
  const [newEngland, setNewEngland] = useState([])
  const [centralAtlantic, setCentralAtlantic] = useState([])
  const [lowerAtlantic, setLowerAtlantic] = useState([])
  const [midwest, setMidwest] = useState([])
  const [gulfCoast, setGulfCoast] = useState([])
  const [rockyMountain, setRockyMountain] = useState([])
  const [westCoast, setWestCoast] = useState([])
  const [westCoastLessCalifornia, setWestCoastLessCalifornia] = useState([])
  const [california, setCalifornia] = useState([])

  useEffect(() => {
    setIsLoading(true)
    const startDate = moment().add(-53, 'week').format('YYYY-MM-DD')

    const url = `https://api.eia.gov/v2/petroleum/pri/gnd/data/?frequency=weekly&data[0]=value&facets[series][]=EMD_EPD2D_PTE_NUS_DPG&facets[series][]=EMD_EPD2D_PTE_R10_DPG&facets[series][]=EMD_EPD2D_PTE_R1X_DPG&facets[series][]=EMD_EPD2D_PTE_R1Y_DPG&facets[series][]=EMD_EPD2D_PTE_R1Z_DPG&facets[series][]=EMD_EPD2D_PTE_R20_DPG&facets[series][]=EMD_EPD2D_PTE_R30_DPG&facets[series][]=EMD_EPD2D_PTE_R40_DPG&facets[series][]=EMD_EPD2D_PTE_R50_DPG&facets[series][]=EMD_EPD2D_PTE_R5XCA_DPG&facets[series][]=EMD_EPD2D_PTE_SCA_DPG&start=${startDate}&sort[0][column]=period&sort[0][direction]=desc&offset=0&length=5000&api_key=w010T1VdbF9Hq5cXqB7F1N5LLD2jgvie7fSdUCia`

    fetchData(url)
  }, [])

  const fetchData = async (url) => {
    const response = await fetch(url)
    const jsonData = await response.json()

    const data = (jsonData?.response?.data || []).map(x => {
      x.value = Number(x.value)
      return x
    })

    setUs(data.filter(x => (x?.series || '').toUpperCase() === 'EMD_EPD2D_PTE_NUS_DPG'))
    setEastCoast(data.filter(x => (x?.series || '').toUpperCase() === 'EMD_EPD2D_PTE_R10_DPG'))
    setNewEngland(data.filter(x => (x?.series || '').toUpperCase() === 'EMD_EPD2D_PTE_R1X_DPG'))
    setCentralAtlantic(data.filter(x => (x?.series || '').toUpperCase() === 'EMD_EPD2D_PTE_R1Y_DPG'))
    setLowerAtlantic(data.filter(x => (x?.series || '').toUpperCase() === 'EMD_EPD2D_PTE_R1Z_DPG'))
    setMidwest(data.filter(x => (x?.series || '').toUpperCase() === 'EMD_EPD2D_PTE_R20_DPG'))
    setGulfCoast(data.filter(x => (x?.series || '').toUpperCase() === 'EMD_EPD2D_PTE_R30_DPG'))
    setRockyMountain(data.filter(x => (x?.series || '').toUpperCase() === 'EMD_EPD2D_PTE_R40_DPG'))
    setWestCoast(data.filter(x => (x?.series || '').toUpperCase() === 'EMD_EPD2D_PTE_R50_DPG'))
    setWestCoastLessCalifornia(data.filter(x => (x?.series || '').toUpperCase() === 'EMD_EPD2D_PTE_R5XCA_DPG'))
    setCalifornia(data.filter(x => (x?.series || '').toUpperCase() === 'EMD_EPD2D_PTE_SCA_DPG'))

    setIsLoading(false)
  }

  return (
    <div className='widget widget-fuel-prices'>
      <div className="widget-header">
        <div className="date-info">
          {moment().format('MM/DD/YYYY')}
        </div>
        <div className="title">
          <span title='https://www.eia.gov/petroleum/gasdiesel/' onClick={() => {
            window.open('https://www.eia.gov/petroleum/gasdiesel/', '_blank').focus();
          }}>U.S. On-Highway Diesel Fuel Prices ($/Gal)</span>
          <FontAwesomeIcon forwardedRef={props.refGrab} className='drag-widget' icon={faExpandArrowsAlt} />
        </div>
      </div>

      {
        isLoading
          ? <div className="loading-container-wrapper">
            <Loader type="Circles" color="#009bdd" height={20} width={20} visible={isLoading} />
          </div>
          : <div className="fuel-data">
            <div className="fuel-data-header">
              <div></div>
              <div className="third-week">{moment((us[2]?.period || ''), 'YYYY-MM-DD').format('MM/DD/YY') || ''}</div>
              <div className="last-week">{moment((us[1]?.period || ''), 'YYYY-MM-DD').format('MM/DD/YY') || ''}</div>
              <div className="current-week">{moment((us[0]?.period || ''), 'YYYY-MM-DD').format('MM/DD/YY') || ''}</div>
              <div className="week-ago">Week Ago</div>
              <div className="year-ago">Year Ago</div>
            </div>
            <div className="category-info">
              <div className="name">U.S.</div>
              <div className="third-week">{(us[2]?.value || 0).toFixed(3)}</div>
              <div className="last-week">{(us[1]?.value || 0).toFixed(3)}</div>
              <div className="current-week">{(us[0]?.value || 0).toFixed(3)}</div>
              <div className="week-ago">
                {((us[0]?.value || 0) - (us[1]?.value || 0)) < 0
                  ? <FontAwesomeIcon icon={faLongArrowAltDown} color='green' />
                  : ((us[0]?.value || 0) - (us[1]?.value || 0)) > 0
                    ? <FontAwesomeIcon icon={faLongArrowAltUp} color='red' />
                    : ''}
                {((us[0]?.value || 0) - (us[1]?.value || 0)).toFixed(3)}
              </div>
              <div className="year-ago">
                {((us[0]?.value || 0) - (us[us.length - 1]?.value || 0)) < 0
                  ? <FontAwesomeIcon icon={faLongArrowAltDown} color='green' />
                  : ((us[0]?.value || 0) - (us[us.length - 1]?.value || 0)) > 0
                    ? <FontAwesomeIcon icon={faLongArrowAltUp} color='red' />
                    : ''}
                {((us[0]?.value || 0) - (us[us.length - 1]?.value || 0)).toFixed(3)}
              </div>
            </div>
            <div className="category-info">
              <div className="name">East Coast (PADD1)</div>
              <div className="third-week">{(eastCoast[2]?.value || 0).toFixed(3)}</div>
              <div className="last-week">{(eastCoast[1]?.value || 0).toFixed(3)}</div>
              <div className="current-week">{(eastCoast[0]?.value || 0).toFixed(3)}</div>
              <div className="week-ago">
                {((eastCoast[0]?.value || 0) - (eastCoast[1]?.value || 0)) < 0
                  ? <FontAwesomeIcon icon={faLongArrowAltDown} color='green' />
                  : ((eastCoast[0]?.value || 0) - (eastCoast[1]?.value || 0)) > 0
                    ? <FontAwesomeIcon icon={faLongArrowAltUp} color='red' />
                    : ''}
                {((eastCoast[0]?.value || 0) - (eastCoast[1]?.value || 0)).toFixed(3)}
              </div>
              <div className="year-ago">
                {((eastCoast[0]?.value || 0) - (eastCoast[eastCoast.length - 1]?.value || 0)) < 0
                  ? <FontAwesomeIcon icon={faLongArrowAltDown} color='green' />
                  : ((eastCoast[0]?.value || 0) - (eastCoast[eastCoast.length - 1]?.value || 0)) > 0
                    ? <FontAwesomeIcon icon={faLongArrowAltUp} color='red' />
                    : ''}
                {((eastCoast[0]?.value || 0) - (eastCoast[eastCoast.length - 1]?.value || 0)).toFixed(3)}
              </div>
            </div>
            <div className="category-info">
              <div className="name indented">New England (PADD1A)</div>
              <div className="third-week">{(newEngland[2]?.value || 0).toFixed(3)}</div>
              <div className="last-week">{(newEngland[1]?.value || 0).toFixed(3)}</div>
              <div className="current-week">{(newEngland[0]?.value || 0).toFixed(3)}</div>
              <div className="week-ago">
                {((newEngland[0]?.value || 0) - (newEngland[1]?.value || 0)) < 0
                  ? <FontAwesomeIcon icon={faLongArrowAltDown} color='green' />
                  : ((newEngland[0]?.value || 0) - (newEngland[1]?.value || 0)) > 0
                    ? <FontAwesomeIcon icon={faLongArrowAltUp} color='red' />
                    : ''}
                {((newEngland[0]?.value || 0) - (newEngland[1]?.value || 0)).toFixed(3)}
              </div>
              <div className="year-ago">
                {((newEngland[0]?.value || 0) - (newEngland[eastCoast.length - 1]?.value || 0)) < 0
                  ? <FontAwesomeIcon icon={faLongArrowAltDown} color='green' />
                  : ((newEngland[0]?.value || 0) - (newEngland[newEngland.length - 1]?.value || 0)) > 0
                    ? <FontAwesomeIcon icon={faLongArrowAltUp} color='red' />
                    : ''}
                {((newEngland[0]?.value || 0) - (newEngland[newEngland.length - 1]?.value || 0)).toFixed(3)}
              </div>
            </div>
            <div className="category-info">
              <div className="name indented">Central Atlantic (PADD1B)</div>
              <div className="third-week">{(centralAtlantic[2]?.value || 0).toFixed(3)}</div>
              <div className="last-week">{(centralAtlantic[1]?.value || 0).toFixed(3)}</div>
              <div className="current-week">{(centralAtlantic[0]?.value || 0).toFixed(3)}</div>
              <div className="week-ago">
                {((centralAtlantic[0]?.value || 0) - (centralAtlantic[1]?.value || 0)) < 0
                  ? <FontAwesomeIcon icon={faLongArrowAltDown} color='green' />
                  : ((centralAtlantic[0]?.value || 0) - (centralAtlantic[1]?.value || 0)) > 0
                    ? <FontAwesomeIcon icon={faLongArrowAltUp} color='red' />
                    : ''}
                {((centralAtlantic[0]?.value || 0) - (centralAtlantic[1]?.value || 0)).toFixed(3)}
              </div>
              <div className="year-ago">
                {((centralAtlantic[0]?.value || 0) - (centralAtlantic[eastCoast.length - 1]?.value || 0)) < 0
                  ? <FontAwesomeIcon icon={faLongArrowAltDown} color='green' />
                  : ((centralAtlantic[0]?.value || 0) - (centralAtlantic[centralAtlantic.length - 1]?.value || 0)) > 0
                    ? <FontAwesomeIcon icon={faLongArrowAltUp} color='red' />
                    : ''}
                {((centralAtlantic[0]?.value || 0) - (centralAtlantic[centralAtlantic.length - 1]?.value || 0)).toFixed(3)}
              </div>
            </div>
            <div className="category-info">
              <div className="name indented">Lower Atlantic (PADD1C)</div>
              <div className="third-week">{(lowerAtlantic[2]?.value || 0).toFixed(3)}</div>
              <div className="last-week">{(lowerAtlantic[1]?.value || 0).toFixed(3)}</div>
              <div className="current-week">{(lowerAtlantic[0]?.value || 0).toFixed(3)}</div>
              <div className="week-ago">
                {((lowerAtlantic[0]?.value || 0) - (lowerAtlantic[1]?.value || 0)) < 0
                  ? <FontAwesomeIcon icon={faLongArrowAltDown} color='green' />
                  : ((lowerAtlantic[0]?.value || 0) - (lowerAtlantic[1]?.value || 0)) > 0
                    ? <FontAwesomeIcon icon={faLongArrowAltUp} color='red' />
                    : ''}
                {((lowerAtlantic[0]?.value || 0) - (lowerAtlantic[1]?.value || 0)).toFixed(3)}
              </div>
              <div className="year-ago">
                {((lowerAtlantic[0]?.value || 0) - (lowerAtlantic[eastCoast.length - 1]?.value || 0)) < 0
                  ? <FontAwesomeIcon icon={faLongArrowAltDown} color='green' />
                  : ((lowerAtlantic[0]?.value || 0) - (lowerAtlantic[lowerAtlantic.length - 1]?.value || 0)) > 0
                    ? <FontAwesomeIcon icon={faLongArrowAltUp} color='red' />
                    : ''}
                {((lowerAtlantic[0]?.value || 0) - (lowerAtlantic[lowerAtlantic.length - 1]?.value || 0)).toFixed(3)}
              </div>
            </div>
            <div className="category-info">
              <div className="name">Midwest (PADD2)</div>
              <div className="third-week">{(midwest[2]?.value || 0).toFixed(3)}</div>
              <div className="last-week">{(midwest[1]?.value || 0).toFixed(3)}</div>
              <div className="current-week">{(midwest[0]?.value || 0).toFixed(3)}</div>
              <div className="week-ago">
                {((midwest[0]?.value || 0) - (midwest[1]?.value || 0)) < 0
                  ? <FontAwesomeIcon icon={faLongArrowAltDown} color='green' />
                  : ((midwest[0]?.value || 0) - (midwest[1]?.value || 0)) > 0
                    ? <FontAwesomeIcon icon={faLongArrowAltUp} color='red' />
                    : ''}
                {((midwest[0]?.value || 0) - (midwest[1]?.value || 0)).toFixed(3)}
              </div>
              <div className="year-ago">
                {((midwest[0]?.value || 0) - (midwest[eastCoast.length - 1]?.value || 0)) < 0
                  ? <FontAwesomeIcon icon={faLongArrowAltDown} color='green' />
                  : ((midwest[0]?.value || 0) - (midwest[midwest.length - 1]?.value || 0)) > 0
                    ? <FontAwesomeIcon icon={faLongArrowAltUp} color='red' />
                    : ''}
                {((midwest[0]?.value || 0) - (midwest[midwest.length - 1]?.value || 0)).toFixed(3)}
              </div>
            </div>
            <div className="category-info">
              <div className="name">Gulf Coast (PADD3)</div>
              <div className="third-week">{(gulfCoast[2]?.value || 0).toFixed(3)}</div>
              <div className="last-week">{(gulfCoast[1]?.value || 0).toFixed(3)}</div>
              <div className="current-week">{(gulfCoast[0]?.value || 0).toFixed(3)}</div>
              <div className="week-ago">
                {((gulfCoast[0]?.value || 0) - (gulfCoast[1]?.value || 0)) < 0
                  ? <FontAwesomeIcon icon={faLongArrowAltDown} color='green' />
                  : ((gulfCoast[0]?.value || 0) - (gulfCoast[1]?.value || 0)) > 0
                    ? <FontAwesomeIcon icon={faLongArrowAltUp} color='red' />
                    : ''}
                {((gulfCoast[0]?.value || 0) - (gulfCoast[1]?.value || 0)).toFixed(3)}
              </div>
              <div className="year-ago">
                {((gulfCoast[0]?.value || 0) - (gulfCoast[eastCoast.length - 1]?.value || 0)) < 0
                  ? <FontAwesomeIcon icon={faLongArrowAltDown} color='green' />
                  : ((gulfCoast[0]?.value || 0) - (gulfCoast[gulfCoast.length - 1]?.value || 0)) > 0
                    ? <FontAwesomeIcon icon={faLongArrowAltUp} color='red' />
                    : ''}
                {((gulfCoast[0]?.value || 0) - (gulfCoast[gulfCoast.length - 1]?.value || 0)).toFixed(3)}
              </div>
            </div>
            <div className="category-info">
              <div className="name">Rocky Mountain (PADD4)</div>
              <div className="third-week">{(rockyMountain[2]?.value || 0).toFixed(3)}</div>
              <div className="last-week">{(rockyMountain[1]?.value || 0).toFixed(3)}</div>
              <div className="current-week">{(rockyMountain[0]?.value || 0).toFixed(3)}</div>
              <div className="week-ago">
                {((rockyMountain[0]?.value || 0) - (rockyMountain[1]?.value || 0)) < 0
                  ? <FontAwesomeIcon icon={faLongArrowAltDown} color='green' />
                  : ((rockyMountain[0]?.value || 0) - (rockyMountain[1]?.value || 0)) > 0
                    ? <FontAwesomeIcon icon={faLongArrowAltUp} color='red' />
                    : ''}
                {((rockyMountain[0]?.value || 0) - (rockyMountain[1]?.value || 0)).toFixed(3)}
              </div>
              <div className="year-ago">
                {((rockyMountain[0]?.value || 0) - (rockyMountain[eastCoast.length - 1]?.value || 0)) < 0
                  ? <FontAwesomeIcon icon={faLongArrowAltDown} color='green' />
                  : ((rockyMountain[0]?.value || 0) - (rockyMountain[rockyMountain.length - 1]?.value || 0)) > 0
                    ? <FontAwesomeIcon icon={faLongArrowAltUp} color='red' />
                    : ''}
                {((rockyMountain[0]?.value || 0) - (rockyMountain[rockyMountain.length - 1]?.value || 0)).toFixed(3)}
              </div>
            </div>
            <div className="category-info">
              <div className="name">West Coast (PADD5)</div>
              <div className="third-week">{(westCoast[2]?.value || 0).toFixed(3)}</div>
              <div className="last-week">{(westCoast[1]?.value || 0).toFixed(3)}</div>
              <div className="current-week">{(westCoast[0]?.value || 0).toFixed(3)}</div>
              <div className="week-ago">
                {((westCoast[0]?.value || 0) - (westCoast[1]?.value || 0)) < 0
                  ? <FontAwesomeIcon icon={faLongArrowAltDown} color='green' />
                  : ((westCoast[0]?.value || 0) - (westCoast[1]?.value || 0)) > 0
                    ? <FontAwesomeIcon icon={faLongArrowAltUp} color='red' />
                    : ''}
                {((westCoast[0]?.value || 0) - (westCoast[1]?.value || 0)).toFixed(3)}
              </div>
              <div className="year-ago">
                {((westCoast[0]?.value || 0) - (westCoast[eastCoast.length - 1]?.value || 0)) < 0
                  ? <FontAwesomeIcon icon={faLongArrowAltDown} color='green' />
                  : ((westCoast[0]?.value || 0) - (westCoast[westCoast.length - 1]?.value || 0)) > 0
                    ? <FontAwesomeIcon icon={faLongArrowAltUp} color='red' />
                    : ''}
                {((westCoast[0]?.value || 0) - (westCoast[westCoast.length - 1]?.value || 0)).toFixed(3)}
              </div>
            </div>
            <div className="category-info">
              <div className="name indented">West Coast less California</div>
              <div className="third-week">{(westCoastLessCalifornia[2]?.value || 0).toFixed(3)}</div>
              <div className="last-week">{(westCoastLessCalifornia[1]?.value || 0).toFixed(3)}</div>
              <div className="current-week">{(westCoastLessCalifornia[0]?.value || 0).toFixed(3)}</div>
              <div className="week-ago">
                {((westCoastLessCalifornia[0]?.value || 0) - (westCoastLessCalifornia[1]?.value || 0)) < 0
                  ? <FontAwesomeIcon icon={faLongArrowAltDown} color='green' />
                  : ((westCoastLessCalifornia[0]?.value || 0) - (westCoastLessCalifornia[1]?.value || 0)) > 0
                    ? <FontAwesomeIcon icon={faLongArrowAltUp} color='red' />
                    : ''}
                {((westCoastLessCalifornia[0]?.value || 0) - (westCoastLessCalifornia[1]?.value || 0)).toFixed(3)}
              </div>
              <div className="year-ago">
                {((westCoastLessCalifornia[0]?.value || 0) - (westCoastLessCalifornia[eastCoast.length - 1]?.value || 0)) < 0
                  ? <FontAwesomeIcon icon={faLongArrowAltDown} color='green' />
                  : ((westCoastLessCalifornia[0]?.value || 0) - (westCoastLessCalifornia[westCoastLessCalifornia.length - 1]?.value || 0)) > 0
                    ? <FontAwesomeIcon icon={faLongArrowAltUp} color='red' />
                    : ''}
                {((westCoastLessCalifornia[0]?.value || 0) - (westCoastLessCalifornia[westCoastLessCalifornia.length - 1]?.value || 0)).toFixed(3)}
              </div>
            </div>
            <div className="category-info">
              <div className="name indented">California</div>
              <div className="third-week">{(california[2]?.value || 0).toFixed(3)}</div>
              <div className="last-week">{(california[1]?.value || 0).toFixed(3)}</div>
              <div className="current-week">{(california[0]?.value || 0).toFixed(3)}</div>
              <div className="week-ago">
                {((california[0]?.value || 0) - (california[1]?.value || 0)) < 0
                  ? <FontAwesomeIcon icon={faLongArrowAltDown} color='green' />
                  : ((california[0]?.value || 0) - (california[1]?.value || 0)) > 0
                    ? <FontAwesomeIcon icon={faLongArrowAltUp} color='red' />
                    : ''}
                {((california[0]?.value || 0) - (california[1]?.value || 0)).toFixed(3)}
              </div>
              <div className="year-ago">
                {((california[0]?.value || 0) - (california[eastCoast.length - 1]?.value || 0)) < 0
                  ? <FontAwesomeIcon icon={faLongArrowAltDown} color='green' />
                  : ((california[0]?.value || 0) - (california[california.length - 1]?.value || 0)) > 0
                    ? <FontAwesomeIcon icon={faLongArrowAltUp} color='red' />
                    : ''}
                {((california[0]?.value || 0) - (california[california.length - 1]?.value || 0)).toFixed(3)}
              </div>
            </div>
          </div>
      }


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
})(FuelPrices)
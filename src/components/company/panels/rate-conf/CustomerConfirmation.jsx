import React, { Component } from 'react'
import moment from 'moment';
import './CustomerConfirmation.css';
import NumberFormat from 'react-number-format';


export default class CustomerConfirmation extends Component {
    constructor(props) {
        super(props)
    }

    styleFlexRow = {
        display: 'flex',
        flexDirection: 'row'
    }
    styleFlexCol = {
        display: 'flex',
        flexDirection: 'column'
    }
    styleFieldName = {
        color: 'black',
        fontWeight: 'bold',
        fontSize: '0.9rem',
        fontStyle: 'normal'
    }
    styleFieldData = {
        color: 'red',
        fontSize: '0.9rem',
        fontStyle: 'italic'
    }
    styleTitleBackground = {
        backgroundColor: 'lightgray'
    }
    styleFieldDataBold = {
        color: 'red',
        fontWeight: 'bold',
        fontSize: '0.9rem'
    }

    render() {
        return (
            <div className="content-page" style={{
                minWidth: '245.5mm',
                maxWidth: '245.5mm',
                display: 'block',
                fontSize: '0.9rem',
                // fontFamily: 'Lato',
                // fontStyle: 'italic'
            }}>
                {/* <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin='true' />
                <link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Play:wght@400;700&display=swap" rel="stylesheet" /> */}


                <div className="container-sheet">
                    {/* PAGE BLOCK */}
                    <div className="page-block" style={{ paddingTop: '2rem' }}>

                        <div style={{
                            ...this.styleFlexRow
                        }}>
                            <span style={{ ...this.styleFieldName, marginRight: 10 }}>DATE AND TIME SENT:</span> <span style={{ ...this.styleFieldDataBold }}>{moment().format('MM/DD/YYYY')} @ {moment().format('HHmm')}</span>
                        </div>
                        <div style={{
                            ...this.styleFlexRow
                        }}>
                            <span style={{ ...this.styleFieldName, marginRight: 10 }}>ATTN:</span> <span style={{ ...this.styleFieldDataBold }}>
                                {this.props.selectedCustomerInfoContact?.first_name || ''} {this.props.selectedCustomerInfoContact?.last_name || ''}
                            </span>
                        </div>
                        <div style={{
                            ...this.styleFlexRow,
                            marginBottom: '1.5rem'
                        }}>
                            <span style={{ ...this.styleFieldName, marginRight: 10 }}>E-mail:</span> <span style={{ ...this.styleFieldDataBold }}>
                                {
                                    (this.props.selectedCustomerInfoContact?.primary_email || 'work') === 'work'
                                        ? this.props.selectedCustomerInfoContact?.email_work || ''
                                        : (this.props.selectedCustomerInfoContact?.primary_email || 'work') === 'personal'
                                            ? this.props.selectedCustomerInfoContact?.email_personal || ''
                                            : (this.props.selectedCustomerInfoContact?.primary_email || 'work') === 'other'
                                                ? this.props.selectedCustomerInfoContact?.email_other || ''
                                                : ''
                                }
                            </span>
                        </div>

                        <div style={{ ...this.styleFieldName, textAlign: 'center', fontSize: '1rem' }}>
                            CUSTOMER CONFIRMATION
                        </div>
                    </div>

                    {/* PAGE BLOCK */}
                    <div className="page-block" style={{ paddingTop: '2rem' }}>
                        <div style={{ ...this.styleFieldName, fontWeight: 'normal', fontStyle: 'italic', textAlign: 'center', fontSize: '1rem' }}>
                            Thank you for allowing <span style={{ ...this.styleFieldDataBold, fontSize: '1rem' }}>ET3 Logistics, LLC</span> to handle your transportation needs. <br />
                            Please see the information below pertaining to the order you have scheduled. <br />
                            Don’t hesitate to contact <span style={{ ...this.styleFieldDataBold, fontSize: '1rem' }}>Byron Doss</span> at <span style={{ ...this.styleFieldDataBold, fontSize: '1rem' }}>972-906-7242</span> if you have any questions.
                        </div>

                        <div style={{
                            ...this.styleFlexRow,
                            marginTop: 30
                        }}>
                            <span style={{ ...this.styleFieldName, marginRight: 10, fontSize: '1rem' }}>Order Number:</span> <span style={{ ...this.styleFieldDataBold, fontSize: '1rem' }}>
                                {this.props.selected_order?.order_number}
                            </span>
                        </div>
                    </div>

                    {
                        (this.props.selected_order?.routing || []).map((route, index) => {
                            let pickup = route.type === 'pickup' ? (this.props.selected_order?.pickups || []).find(p => p.id === route.pickup_id) : {};
                            let delivery = route.type === 'delivery' ? (this.props.selected_order?.deliveries || []).find(d => d.id === route.delivery_id) : {};
                            let customer = route.type === 'pickup' ? pickup.customer : delivery.customer;

                            return (
                                // PAGE BLOCK
                                <div key={index} className="page-block" style={{ paddingTop: '2rem' }}>
                                    <div style={{
                                        ...this.styleFlexRow,
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr 1fr'
                                    }}>
                                        <div style={{
                                            ...this.styleFlexCol,
                                            minWidth: '16rem'
                                        }}>
                                            <div style={{ ...this.styleFieldName }}>{route.type === 'pickup' ? 'Pick-Up' : 'Delivery'} Information</div>
                                            <div style={{ ...this.styleFieldData }}>
                                                {customer.name} <br />
                                                {customer.address1} <br />
                                                {customer.city}, {customer.state} {customer.zip}
                                            </div>
                                        </div>

                                        <div style={{
                                            ...this.styleFlexCol,
                                            minWidth: '16rem'
                                        }}>
                                            <div style={{ ...this.styleFlexRow }}>
                                                <div style={{ ...this.styleFieldName, width: '6rem' }}>Earliest Time:</div>
                                                <div style={{ ...this.styleFieldData }}>
                                                    {route.type === 'pickup' ? (pickup.pu_date1 || '') : (delivery.delivery_date1 || '')} @ {route.type === 'pickup' ? (pickup.pu_time1 || '') : (delivery.delivery_time1 || '')}
                                                </div>
                                            </div>
                                            <div style={{ ...this.styleFlexRow }}>
                                                <div style={{ ...this.styleFieldName, width: '6rem' }}>Latest Time:</div>
                                                <div style={{ ...this.styleFieldData }}>
                                                    {route.type === 'pickup' ? (pickup.pu_date2 || '') : (delivery.delivery_date2 || '')} @ {route.type === 'pickup' ? (pickup.pu_time2 || '') : (delivery.delivery_time2 || '')}
                                                </div>
                                            </div>
                                            <div style={{ ...this.styleFlexRow }}>
                                                <div style={{ ...this.styleFieldName, width: '6rem' }}>Phone:</div>
                                                <div style={{ ...this.styleFieldData }}>
                                                    {
                                                        (customer?.contacts || []).find(c => c.is_primary === 1) === undefined
                                                            ? ''
                                                            : (customer.contacts.find(c => c.is_primary === 1).primary_phone || 'work') === 'work'
                                                                ? customer.contacts.find(c => c.is_primary === 1).phone_work
                                                                : (customer.contacts.find(c => c.is_primary === 1).primary_phone || 'work') === 'fax'
                                                                    ? customer.contacts.find(c => c.is_primary === 1).phone_work_fax
                                                                    : (customer.contacts.find(c => c.is_primary === 1).primary_phone || 'work') === 'mobile'
                                                                        ? customer.contacts.find(c => c.is_primary === 1).phone_mobile
                                                                        : (customer.contacts.find(c => c.is_primary === 1).primary_phone || 'work') === 'direct'
                                                                            ? customer.contacts.find(c => c.is_primary === 1).phone_direct
                                                                            : (customer.contacts.find(c => c.is_primary === 1).primary_phone || 'work') === 'other'
                                                                                ? customer.contacts.find(c => c.is_primary === 1).phone_other
                                                                                : ''
                                                    }
                                                </div>
                                            </div>
                                            <div style={{ ...this.styleFlexRow }}>
                                                <div style={{ ...this.styleFieldName, width: '6rem' }}>Contact:</div>
                                                <div style={{ ...this.styleFieldData }}>
                                                    {
                                                        (customer?.contacts || []).find(c => c.is_primary === 1) === undefined
                                                            ? ''
                                                            : customer?.contacts.find(c => c.is_primary === 1).first_name + ' ' + customer?.contacts.find(c => c.is_primary === 1).last_name
                                                    }
                                                </div>
                                            </div>

                                        </div>

                                        <div style={{
                                            ...this.styleFlexCol,
                                            minWidth: '16rem'
                                        }}>
                                            {
                                                route.type === 'pickup' &&
                                                <div style={{ ...this.styleFlexRow }}>
                                                    <div style={{ ...this.styleFieldName, width: '6.5rem' }}>BOL Numbers:</div>
                                                    <div style={{ ...this.styleFieldData }}>
                                                        {pickup.bol_numbers}
                                                    </div>
                                                </div>
                                            }

                                            {
                                                route.type === 'pickup' &&
                                                <div style={{ ...this.styleFlexRow }}>
                                                    <div style={{ ...this.styleFieldName, width: '6.5rem' }}>PO Numbers:</div>
                                                    <div style={{ ...this.styleFieldData }}>
                                                        {pickup.po_numbers}
                                                    </div>
                                                </div>
                                            }

                                            {
                                                route.type === 'pickup' &&
                                                <div style={{ ...this.styleFlexRow }}>
                                                    <div style={{ ...this.styleFieldName, width: '6.5rem' }}>REF Numbers:</div>
                                                    <div style={{ ...this.styleFieldData }}>
                                                        {pickup.ref_numbers}
                                                    </div>
                                                </div>
                                            }

                                            {
                                                route.type === 'pickup' &&
                                                <div style={{ ...this.styleFlexRow }}>
                                                    <div style={{ ...this.styleFieldName, width: '6.5rem' }}>SEAL Number:</div>
                                                    <div style={{ ...this.styleFieldData }}>
                                                        {pickup.seal_number}
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }

                    {/* PAGE BLOCK */}
                    <div className="page-block" style={{ paddingTop: '2rem', paddingBottom: '1.5rem' }}>

                        <div style={{
                            ...this.styleFlexRow,
                            marginTop: 20
                        }}>
                            <span style={{ ...this.styleFieldName, marginRight: 10, fontSize: '1rem' }}>Carrier Assigned:</span> <span style={{ ...this.styleFieldDataBold, fontSize: '1rem' }}>
                                {this.props.selectedCarrierInfo?.name || ''}
                            </span>
                        </div>

                        <div style={{
                            ...this.styleFlexRow,
                            marginTop: 5
                        }}>
                            <span style={{ ...this.styleFieldName, marginRight: 10, fontSize: '1rem' }}>Total Charges:</span> 
                            <NumberFormat
                                style={{ ...this.styleFieldDataBold, fontSize: '1rem', color: "#4682B4" }}
                                value={
                                    this.props.selected_order?.total_customer_rating || 0
                                }
                                thousandsGroupStyle="thousand"
                                thousandSeparator={true}
                                decimalScale={2}
                                fixedDecimalScale={true}
                                prefix={'$ '}
                                type="text"
                                displayType={'text'}
                            />
                        </div>
                    </div>
                </div>

                <div className="no-print" style={{ height: '2rem' }}></div>
            </div>
        )
    }
}

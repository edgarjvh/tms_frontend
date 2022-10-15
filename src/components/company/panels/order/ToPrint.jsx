import React, { Component } from 'react'
import moment from 'moment';
import './ToPrint.css';
import NumberFormat from 'react-number-format';
import { Invoice } from "../../index";


export default class ToPrint extends Component {
    constructor(props) {
        super(props)
    }

    styleFlexRow = {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    }
    styleFlexCol = {
        display: 'flex',
        flexDirection: 'column'
    }
    styleFieldName = {
        color: 'black',
        fontWeight: 'bold',
        fontSize: '0.8rem',
        fontStyle: 'normal',
        whiteSpace: 'nowrap'
    }
    styleFieldData = {
        color: 'red',
        fontSize: '0.8rem',
        fontStyle: 'italic'
    }
    styleTitleBackground = {
        backgroundColor: 'lightgray'
    }
    styleFieldDataBold = {
        color: 'red',
        fontWeight: 'bold',
        fontSize: '0.8rem'
    }

    render() {
        return (
            <div className="content-page" style={{
                minWidth: '245.5mm',
                maxWidth: '245.5mm',
                display: 'block',
                fontSize: '0.8rem',
                fontFamily: 'Lato',
                fontStyle: 'italic'
            }}>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Play:wght@400;700&display=swap"
                    rel="stylesheet" />


                <div className="container-sheet">
                    {/* PAGE BLOCK */}
                    <div className="page-block" style={{ paddingTop: '1.5rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>

                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{ ...this.styleFieldName, fontSize: '0.9rem', marginRight: 10 }}>Date:</span>
                                <span style={{
                                    ...this.styleFieldData,
                                    fontSize: '0.9rem'
                                }}>{moment().format('MM/DD/YYYY @ HH:mm')}</span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{
                                    ...this.styleFieldData,
                                    fontWeight: 'bold',
                                    fontSize: '1.2rem'
                                }}>{this.props.selectedCompany?.name || ''}</span>
                            </div>

                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-end',
                                justifyContent: 'center'
                            }}>
                                <div style={{
                                    marginBottom: 5,
                                    width: '110px',
                                    display: 'flex',
                                    justifyContent: 'space-between'
                                }}><span
                                    style={{ ...this.styleFieldName, fontSize: '0.9rem', marginRight: 10 }}>ORDER#</span>
                                    <span style={{
                                        ...this.styleFieldData,
                                        fontSize: '0.9rem'
                                    }}>{this.props.selectedOrder?.order_number}</span></div>
                                <div style={{ width: '110px', display: 'flex', justifyContent: 'space-between' }}><span
                                    style={{ ...this.styleFieldName, fontSize: '0.9rem', marginRight: 10 }}>TRIP#</span>
                                    <span style={{
                                        ...this.styleFieldData,
                                        fontSize: '0.9rem'
                                    }}>{this.props.selectedOrder?.trip_number}</span></div>
                            </div>
                        </div>
                    </div>

                    {/* PAGE BLOCK */}
                    <div className="page-block" style={{
                        paddingTop: '1.5rem',
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gridGap: '1rem'
                    }}>
                        <div className="form-bordered-box" style={{
                            border: '1px solid rgba(0,0,0,0.1)',
                            boxShadow: '1px 1px 1px 0 rgba(0,0,0,0.8)',
                            padding: 10
                        }}>
                            <div className="form-title" style={{
                                position: 'absolute',
                                backgroundColor: 'white',
                                top: -10,
                                left: 10,
                                padding: '0 10px'
                            }}>Bill To
                            </div>

                            <div style={{
                                ...this.styleFlexRow,
                                marginBottom: '2px',
                                marginTop: '2px'
                            }}>
                                <span style={{ ...this.styleFieldName, marginRight: 10 }}>CODE:</span> <span
                                    style={{ ...this.styleFieldDataBold }}>{((this.props.selectedOrder?.bill_to_company?.code_number || 0) === 0 ? (this.props.selectedOrder?.bill_to_company?.code || '') : this.props.selectedOrder?.bill_to_company?.code + this.props.selectedOrder?.bill_to_company?.code_number).toUpperCase()}</span>
                            </div>

                            <div style={{
                                ...this.styleFlexRow,
                                marginBottom: '2px'
                            }}>
                                <span style={{ ...this.styleFieldName, marginRight: 10 }}>NAME:</span> <span
                                    style={{ ...this.styleFieldDataBold }}>{(this.props.selectedOrder?.bill_to_company?.name || '')}</span>
                            </div>

                            <div style={{
                                ...this.styleFlexRow,
                                marginBottom: '2px',
                                alignItems: 'flex-start'
                            }}>
                                <span style={{ ...this.styleFieldName, marginRight: 10 }}>ADDRESS 1:</span> <span
                                    style={{ ...this.styleFieldDataBold }}>{(this.props.selectedOrder?.bill_to_company?.address1 || '')}</span>
                            </div>

                            <div style={{
                                ...this.styleFlexRow,
                                marginBottom: '2px',
                                alignItems: 'flex-start'
                            }}>
                                <span style={{ ...this.styleFieldName, marginRight: 10 }}>ADDRESS 2:</span> <span
                                    style={{ ...this.styleFieldDataBold }}>{(this.props.selectedOrder?.bill_to_company?.address2 || '')}</span>
                            </div>

                            <div style={{
                                ...this.styleFlexRow,
                                display: 'grid',
                                gridTemplateColumns: '2fr 1fr 1fr',
                                marginBottom: '2px'
                            }}>
                                <div style={{
                                    ...this.styleFlexRow
                                }}>
                                    <span style={{ ...this.styleFieldName, marginRight: 10 }}>CITY:</span> <span
                                        style={{ ...this.styleFieldDataBold }}>{(this.props.selectedOrder?.bill_to_company?.city || '')}</span>
                                </div>

                                <div style={{
                                    ...this.styleFlexRow
                                }}>
                                    <span style={{ ...this.styleFieldName, marginRight: 10 }}>STATE:</span> <span
                                        style={{ ...this.styleFieldDataBold }}>{(this.props.selectedOrder?.bill_to_company?.state || '')}</span>
                                </div>

                                <div style={{
                                    ...this.styleFlexRow
                                }}>
                                    <span style={{ ...this.styleFieldName, marginRight: 10 }}>ZIP:</span> <span
                                        style={{ ...this.styleFieldDataBold }}>{(this.props.selectedOrder?.bill_to_company?.zip || '')}</span>
                                </div>
                            </div>

                            <div style={{
                                ...this.styleFlexRow,
                                marginBottom: '2px'
                            }}>
                                <span style={{ ...this.styleFieldName, marginRight: 10 }}>CONTACT NAME:</span> <span
                                    style={{ ...this.styleFieldDataBold }}>{
                                        (this.props.selectedOrder?.bill_to_company?.contacts || []).find(c => c.is_primary === 1) === undefined
                                            ? (this.props.selectedOrder?.bill_to_company?.contact_name || '')
                                            : this.props.selectedOrder?.bill_to_company?.contacts.find(c => c.is_primary === 1).first_name + ' ' + this.props.selectedOrder?.bill_to_company?.contacts.find(c => c.is_primary === 1).last_name
                                    }</span>
                            </div>

                            <div style={{
                                ...this.styleFlexRow,
                                display: 'grid',
                                gridTemplateColumns: '3fr 1fr',
                                marginBottom: '2px'
                            }}>
                                <div style={{
                                    ...this.styleFlexRow
                                }}>
                                    <span style={{ ...this.styleFieldName, marginRight: 10 }}>CONTACT PHONE:</span> <span
                                        style={{ ...this.styleFieldDataBold }}>{
                                            (this.props.selectedOrder?.bill_to_company?.contacts || []).find(c => c.is_primary === 1) === undefined
                                                ? (this.props.selectedOrder?.bill_to_company?.contact_phone || '')
                                                : this.props.selectedOrder?.bill_to_company?.contacts.find(c => c.is_primary === 1).primary_phone === 'work'
                                                    ? this.props.selectedOrder?.bill_to_company?.contacts.find(c => c.is_primary === 1).phone_work
                                                    : this.props.selectedOrder?.bill_to_company?.contacts.find(c => c.is_primary === 1).primary_phone === 'fax'
                                                        ? this.props.selectedOrder?.bill_to_company?.contacts.find(c => c.is_primary === 1).phone_work_fax
                                                        : this.props.selectedOrder?.bill_to_company?.contacts.find(c => c.is_primary === 1).primary_phone === 'mobile'
                                                            ? this.props.selectedOrder?.bill_to_company?.contacts.find(c => c.is_primary === 1).phone_mobile
                                                            : this.props.selectedOrder?.bill_to_company?.contacts.find(c => c.is_primary === 1).primary_phone === 'direct'
                                                                ? this.props.selectedOrder?.bill_to_company?.contacts.find(c => c.is_primary === 1).phone_direct
                                                                : this.props.selectedOrder?.bill_to_company?.contacts.find(c => c.is_primary === 1).primary_phone === 'other'
                                                                    ? this.props.selectedOrder?.bill_to_company?.contacts.find(c => c.is_primary === 1).phone_other
                                                                    : ''
                                        }</span>
                                </div>

                                <div style={{
                                    ...this.styleFlexRow
                                }}>
                                    <span style={{ ...this.styleFieldName, marginRight: 10 }}>EXT:</span> <span
                                        style={{ ...this.styleFieldDataBold }}>{
                                            (this.props.selectedOrder?.bill_to_company?.contacts || []).find(c => c.is_primary === 1) === undefined
                                                ? (this.props.selectedOrder?.bill_to_company?.ext || '')
                                                : this.props.selectedOrder?.bill_to_company?.contacts.find(c => c.is_primary === 1).phone_ext
                                        }</span>
                                </div>
                            </div>

                            <div style={{
                                ...this.styleFlexRow,
                                marginBottom: '2px'
                            }}>
                                <span style={{ ...this.styleFieldName, marginRight: 10 }}>E-MAIL:</span> <span
                                    style={{ ...this.styleFieldDataBold }}>{
                                        (this.props.selectedOrder?.bill_to_company?.contacts || []).find(c => c.is_primary === 1) === undefined
                                            ? (this.props.selectedOrder?.bill_to_company?.email || '')
                                            : this.props.selectedOrder?.bill_to_company?.contacts.find(c => c.is_primary === 1).primary_email === 'work'
                                                ? this.props.selectedOrder?.bill_to_company?.contacts.find(c => c.is_primary === 1).email_work
                                                : this.props.selectedOrder?.bill_to_company?.contacts.find(c => c.is_primary === 1).primary_email === 'personal'
                                                    ? this.props.selectedOrder?.bill_to_company?.contacts.find(c => c.is_primary === 1).email_personal
                                                    : this.props.selectedOrder?.bill_to_company?.contacts.find(c => c.is_primary === 1).primary_email === 'other'
                                                        ? this.props.selectedOrder?.bill_to_company?.contacts.find(c => c.is_primary === 1).email_other
                                                        : ''
                                    }</span>
                            </div>
                        </div>

                        <div className="form-bordered-box" style={{
                            border: '1px solid rgba(0,0,0,0.1)',
                            boxShadow: '1px 1px 1px 0 rgba(0,0,0,0.8)',
                            padding: 10
                        }}>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr',
                                gridTemplateRows: '1fr 1fr 1fr 1fr 1fr',
                                gridGap: '0.3rem',
                                flexGrow: 1
                            }}>

                                {
                                    (this.props.selectedOrder?.order_invoiced || 0) === 1 &&
                                    <div className="order-invoiced-btn" style={{
                                        position: 'absolute',
                                        top: 10,
                                        right: 10,
                                        backgroundColor: 'lightgreen',
                                        borderRadius: 15,
                                        height: 25,
                                        width: 110,
                                        padding: 5,
                                        fontSize: '0.8rem',
                                        fontWeight: 'bold',
                                        border: 'solid 1px rgba(0, 0, 0, 0.5)',
                                        cursor: 'pointer',
                                        transition: 'ease 0.3s',
                                        display: "flex",
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }} onClick={() => {
                                        let panel = {
                                            panelName: `${this.props.panelName}-invoice`,
                                            component: <Invoice
                                                pageName={'Invoice'}
                                                title={'Invoice'}
                                                panelName={`${this.props.panelName}-invoice`}
                                                tabTimes={500046 + this.props.tabTimes}
                                                screenFocused={this.props.invoiceScreenFocused}
                                                componentId={moment().format('x')}
                                                isOnPanel={true}
                                                origin={this.props.origin}
                                                openPanel={this.props.openPanel}
                                                closePanel={this.props.closePanel}
                                                order_id={(this.props.selectedOrder?.id || 0)}
                                            />
                                        }

                                        this.props.openPanel(panel, this.props.origin);
                                    }}>Invoiced</div>
                                }
                                {/* <div style={{ ...this.styleFlexRow }}><span style={{ ...this.styleFieldName, marginRight: 5 }}>PO NUMBERS:</span>
                                    {
                                        (this.props.selectedOrder?.pickups || []).map((pickup, index) => {
                                            return (
                                                <span key={index} style={{
                                                    ...this.styleFieldDataBold,
                                                    marginRight: index < (this.props.selectedOrder.pickups.length - 1) ? 3 : 0
                                                }}>
                                                    {pickup.po_numbers}
                                                </span>
                                            )
                                        })
                                    }
                                </div> */}

                                <div style={{
                                    ...this.styleFlexRow,
                                    gridColumn: '1 / 3'
                                }}><span style={{ ...this.styleFieldName, marginRight: 5 }}>DIVISION:</span> <span
                                    style={{ ...this.styleFieldDataBold }}>{(this.props.selectedOrder?.division?.name || '')}</span>
                                </div>

                                {/*<div></div>*/}

                                {/* <div style={{ ...this.styleFlexRow }}><span style={{ ...this.styleFieldName, marginRight: 5 }}>BOL NUMBERS:</span>
                                    {
                                        (this.props.selectedOrder?.pickups || []).map((pickup, index) => {
                                            return (
                                                <span key={index} style={{
                                                    ...this.styleFieldDataBold,
                                                    marginRight: index < (this.props.selectedOrder.pickups.length - 1) ? 3 : 0
                                                }}>
                                                    {pickup.bol_numbers}
                                                </span>
                                            )
                                        })
                                    }
                                </div> */}

                                <div style={{
                                    ...this.styleFlexRow,
                                    gridColumn: '1 / 3'
                                }}><span style={{ ...this.styleFieldName, marginRight: 5 }}>LOAD TYPE:</span> <span
                                    style={{ ...this.styleFieldDataBold }}>{(this.props.selectedOrder?.load_type?.name || '')}</span>
                                </div>

                                {/*<div></div>*/}

                                {/* <div style={{ ...this.styleFlexRow }}><span style={{ ...this.styleFieldName, marginRight: 5 }}>REF NUMBER:</span>
                                    {
                                        (this.props.selectedOrder?.pickups || []).map((pickup, index) => {
                                            return (
                                                <span key={index} style={{
                                                    ...this.styleFieldDataBold,
                                                    marginRight: index < (this.props.selectedOrder.pickups.length - 1) ? 3 : 0
                                                }}>
                                                    {pickup.ref_numbers}
                                                </span>
                                            )
                                        })
                                    }

                                </div> */}

                                <div style={{
                                    ...this.styleFlexRow,
                                    gridColumn: '1 / 3'
                                }}><span style={{ ...this.styleFieldName, marginRight: 5 }}>TOTAL CHARGES:</span>
                                    <NumberFormat
                                        style={{ ...this.styleFieldDataBold, color: '#4682B4' }}
                                        value={
                                            new Intl.NumberFormat('en-US', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            }).format(Number(((this.props.selectedOrder?.order_customer_ratings || []).reduce((a, b) => {
                                                return { total_charges: Number(a.total_charges) + Number(b.total_charges) }
                                            }, { total_charges: '' })?.total_charges || '').toString().replace(',', '')))
                                        }
                                        thousandsGroupStyle="thousand"
                                        thousandSeparator={true}
                                        decimalScale={2}
                                        fixedDecimalScale={true}
                                        prefix={'$ '}
                                        type="text"
                                        onValueChange={(values) => {
                                        }}
                                        displayType={'text'}
                                        readOnly={true}
                                    />
                                </div>

                                {/*<div></div>*/}

                                {/* <div style={{ ...this.styleFlexRow }}><span style={{ ...this.styleFieldName, marginRight: 5 }}>SEAL NUMBER:</span>
                                    {
                                        (this.props.selectedOrder?.pickups || []).map((pickup, index) => {
                                            return (
                                                <span key={index} style={{
                                                    ...this.styleFieldDataBold,
                                                    marginRight: index < (this.props.selectedOrder.pickups.length - 1) ? 3 : 0
                                                }}>
                                                    {pickup.seal_number}
                                                </span>
                                            )
                                        })
                                    }
                                </div> */}

                                <div style={{
                                    ...this.styleFlexRow,
                                    alignItems: 'center',
                                    gridColumn: '1 / 3'
                                }}>
                                    <span style={{ ...this.styleFieldName, marginRight: 5 }}>SHIPPER:</span>
                                    {
                                        (this.props.selectedOrder?.pickups || []).map((pickup, index) => {
                                            return (
                                                <span key={index} style={{
                                                    ...this.styleFieldDataBold,
                                                    marginRight: index < (this.props.selectedOrder.pickups.length - 1) ? 3 : 0
                                                }}>
                                                    {pickup.special_instructions}
                                                </span>
                                            )
                                        })
                                    }
                                </div>

                                <div style={{
                                    ...this.styleFlexRow,
                                    alignItems: 'center',
                                    gridColumn: '1 / 3',

                                }}>
                                    <span style={{ ...this.styleFieldName, marginRight: 5 }}>CONSIGNEE:</span>
                                    {
                                        (this.props.selectedOrder?.deliveries || []).map((delivery, index) => {
                                            return (
                                                <span key={index} style={{
                                                    ...this.styleFieldDataBold,
                                                    marginRight: index < (this.props.selectedOrder.deliveries.length - 1) ? 3 : 0
                                                }}>
                                                    {delivery.special_instructions}
                                                </span>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* PAGE BLOCK */}
                    <div className="page-block"
                        style={{ paddingTop: '1.5rem', display: 'grid', gridTemplateColumns: '1fr' }}>
                        <div className="form-bordered-box" style={{
                            border: '1px solid rgba(0,0,0,0.1)',
                            boxShadow: '1px 1px 1px 0 rgba(0,0,0,0.8)',
                            padding: 10
                        }}>
                            <div className="form-title" style={{
                                position: 'absolute',
                                backgroundColor: 'white',
                                top: -10,
                                left: 10,
                                padding: '0 10px'
                            }}>Order Information
                            </div>


                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr',
                                // gridTemplateRows: '1fr 1fr 1fr 1fr',
                            }}>

                                <div style={{ ...this.styleFlexRow, justifyContent: 'space-evenly', marginBottom: 15 }}>
                                    <div style={{ ...this.styleFlexRow }}><span
                                        style={{ ...this.styleFieldName, marginRight: 5 }}>EQUIPMENT:</span> <span
                                            style={{ ...this.styleFieldData }}>{(this.props.selectedOrder?.equipment?.name || '').toUpperCase()}</span>
                                    </div>
                                    <div style={{ ...this.styleFlexRow }}><span
                                        style={{ ...this.styleFieldName, marginRight: 5 }}>EXPEDITED:</span> <span
                                            style={{ ...this.styleFieldData }}>{this.props.selectedOrder?.expedited === 1 ? 'YES' : 'NO'}</span>
                                    </div>
                                    <div style={{ ...this.styleFlexRow }}><span
                                        style={{ ...this.styleFieldName, marginRight: 5 }}>HAZ-MAT:</span> <span
                                            style={{ ...this.styleFieldData }}>{this.props.selectedOrder?.haz_mat === 1 ? 'YES' : 'NO'}</span>
                                    </div>
                                </div>

                                {
                                    (this.props.selectedOrder?.order_customer_ratings || []).length > 0 &&
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: '5rem 5rem 1fr 7rem',
                                        marginBottom: 7
                                    }}>
                                        {
                                            ((this.props.selectedOrder?.order_customer_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'flat') !== undefined ||
                                                (this.props.selectedOrder?.order_customer_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'linehaul') !== undefined) &&
                                            <span style={{
                                                ...this.styleFieldName,
                                                textDecoration: 'underline',
                                                textAlign: 'center'
                                            }}>Pieces/Skids</span>
                                        }

                                        {
                                            ((this.props.selectedOrder?.order_customer_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'flat') !== undefined ||
                                                (this.props.selectedOrder?.order_customer_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'linehaul') !== undefined) &&
                                            <span style={{
                                                ...this.styleFieldName,
                                                textDecoration: 'underline',
                                                textAlign: 'center'
                                            }}>Weight</span>
                                        }

                                        <span style={{
                                            ...this.styleFieldName,
                                            textDecoration: 'underline',
                                            paddingLeft: 8
                                        }}>Description</span>

                                        <span style={{
                                            ...this.styleFieldName,
                                            textDecoration: 'underline',
                                            textAlign: 'right'
                                        }}>Charges</span>

                                    </div>
                                }

                                {
                                    (this.props.selectedOrder?.order_customer_ratings || []).map((rating, index) => {
                                        return (
                                            <div style={{
                                                display: 'grid',
                                                gridTemplateColumns: '5rem 5rem 1fr 7rem',
                                                marginBottom: index < ((this.props.selectedOrder?.order_customer_ratings || []).length - 1) ? 7 : 0
                                            }} key={index}>
                                                {
                                                    ((this.props.selectedOrder?.order_customer_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'flat') !== undefined ||
                                                        (this.props.selectedOrder?.order_customer_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'linehaul') !== undefined) &&
                                                    <NumberFormat
                                                        style={{
                                                            ...this.styleFieldData,
                                                            color: '#4682B4',
                                                            fontWeight: 'bold',
                                                            textAlign: 'center'
                                                        }}
                                                        value={rating.pieces > 0 ? rating.pieces : ''}
                                                        thousandsGroupStyle="thousand"
                                                        thousandSeparator={true}
                                                        decimalScale={Number.isInteger(rating.pieces) ? 0 : 2}
                                                        fixedDecimalScale={true}
                                                        prefix={''}
                                                        suffix={(rating.pieces_unit || '') === 'pc' ? ' Pieces' : (rating.pieces_unit || '') === 'sk' ? ' Skids' : ''}
                                                        type="text"
                                                        displayType={'text'}
                                                    />
                                                }

                                                {
                                                    ((this.props.selectedOrder?.order_customer_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'flat') !== undefined ||
                                                        (this.props.selectedOrder?.order_customer_ratings || []).find(r => (r.rate_type?.name || '').toLowerCase() === 'linehaul') !== undefined) &&
                                                    <NumberFormat
                                                        style={{
                                                            ...this.styleFieldData,
                                                            color: '#4682B4',
                                                            fontWeight: 'bold',
                                                            textAlign: 'center'
                                                        }}
                                                        value={rating.weight > 0 ? rating.weight : ''}
                                                        thousandsGroupStyle="thousand"
                                                        thousandSeparator={true}
                                                        decimalScale={Number.isInteger(rating.weight) ? 0 : 2}
                                                        fixedDecimalScale={true}
                                                        prefix={''}
                                                        type="text"
                                                        displayType={'text'}
                                                    />
                                                }

                                                <span style={{
                                                    ...this.styleFieldData,
                                                    color: '#4682B4',
                                                    fontWeight: 'bold',
                                                    paddingLeft: 8
                                                }}>{rating.description}</span>

                                                <div style={{
                                                    ...this.styleFieldData,
                                                    textAlign: 'right',
                                                    color: '#4682B4',
                                                    fontWeight: 'bold'
                                                }}>
                                                    <NumberFormat
                                                        value={rating.total_charges > 0 ? rating.total_charges : ''}
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
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>

                    <div className="page-block"
                        style={{ paddingTop: '1.5rem', display: 'grid', gridTemplateColumns: '1fr' }}>
                        <div className="form-bordered-box" style={{
                            border: '1px solid rgba(0,0,0,0.1)',
                            boxShadow: '1px 1px 1px 0 rgba(0,0,0,0.8)',
                            padding: 10
                        }}>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr',
                                gridGap: '1rem'
                            }}>

                                {
                                    (this.props.selectedOrder?.routing || []).map((route, index) => {
                                        let pickup = route.type === 'pickup' ? (this.props.selectedOrder?.pickups || []).find(p => p.id === route.pickup_id) : {};
                                        let delivery = route.type === 'delivery' ? (this.props.selectedOrder?.deliveries || []).find(d => d.id === route.delivery_id) : {};
                                        let customer = route.type === 'pickup' ? pickup.customer : delivery.customer;

                                        return (
                                            // PAGE BLOCK
                                            <div key={index} className="page-block">
                                                <div style={{
                                                    ...this.styleFlexRow,
                                                    display: 'grid',
                                                    gridTemplateColumns: '1fr 1fr 0.8fr'
                                                }}>
                                                    <div style={{
                                                        ...this.styleFlexCol,
                                                        minWidth: '16rem'
                                                    }}>
                                                        <div
                                                            style={{ ...this.styleFieldName }}>{route.type === 'pickup' ? 'Pick-Up' : 'Delivery'} Information
                                                        </div>
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
                                                            <div
                                                                style={{ ...this.styleFieldName, width: '6rem' }}>Earliest
                                                                Time:
                                                            </div>
                                                            <div style={{ ...this.styleFieldData }}>
                                                                {route.type === 'pickup' ? (pickup.pu_date1 || '') : (delivery.delivery_date1 || '')}{' @ '}{route.type === 'pickup' ? (pickup.pu_time1 || '') : (delivery.delivery_time1 || '')}
                                                            </div>
                                                        </div>
                                                        <div style={{ ...this.styleFlexRow }}>
                                                            <div style={{ ...this.styleFieldName, width: '6rem' }}>Latest
                                                                Time:
                                                            </div>
                                                            <div style={{ ...this.styleFieldData }}>
                                                                {route.type === 'pickup' ? (pickup.pu_date2 || '') : (delivery.delivery_date2 || '')}{' @ '}{route.type === 'pickup' ? (pickup.pu_time2 || '') : (delivery.delivery_time2 || '')}
                                                            </div>
                                                        </div>
                                                        <div style={{ ...this.styleFlexRow }}>
                                                            <div
                                                                style={{ ...this.styleFieldName, width: '6rem' }}>Phone:
                                                            </div>
                                                            <div style={{ ...this.styleFieldData }}>
                                                                {
                                                                    (route?.type || '') === 'pickup'
                                                                        ? (pickup?.contact_id || 0) > 0
                                                                            ? (pickup?.contact_primary_phone || 'work') === 'work'
                                                                                ? ((customer?.contacts || []).find(x => x.id === pickup.contact_id)?.phone_work || '')
                                                                                : (pickup?.contact_primary_phone || 'work') === 'fax'
                                                                                    ? ((customer?.contacts || []).find(x => x.id === pickup.contact_id)?.phone_work_fax || '')
                                                                                    : (pickup?.contact_primary_phone || 'work') === 'mobile'
                                                                                        ? ((customer?.contacts || []).find(x => x.id === pickup.contact_id)?.phone_mobile || '')
                                                                                        : (pickup?.contact_primary_phone || 'work') === 'direct'
                                                                                            ? ((customer?.contacts || []).find(x => x.id === pickup.contact_id)?.phone_direct || '')
                                                                                            : (pickup?.contact_primary_phone || 'work') === 'other'
                                                                                                ? ((customer?.contacts || []).find(x => x.id === pickup.contact_id)?.phone_other || '')
                                                                                                : ''
                                                                            : (customer?.contacts || []).find(x => x.is_primary === 1)
                                                                                ? (pickup?.contact_primary_phone || 'work') === 'work'
                                                                                    ? (customer.contacts.find(x => x.is_primary === 1)?.phone_work || '')
                                                                                    : (pickup?.contact_primary_phone || 'work') === 'fax'
                                                                                        ? (customer.contacts.find(x => x.is_primary === 1)?.phone_work_fax || '')
                                                                                        : (pickup?.contact_primary_phone || 'work') === 'mobile'
                                                                                            ? (customer.contacts.find(x => x.is_primary === 1)?.phone_mobile || '')
                                                                                            : (pickup?.contact_primary_phone || 'work') === 'direct'
                                                                                                ? (customer.contacts.find(x => x.is_primary === 1)?.phone_direct || '')
                                                                                                : (pickup?.contact_primary_phone || 'work') === 'other'
                                                                                                    ? (customer.contacts.find(x => x.is_primary === 1)?.phone_other || '')
                                                                                                    : ''
                                                                                : (pickup?.contact_phone || '')
                                                                        : (route?.type || '') === 'delivery'
                                                                            ? (delivery?.contact_id || 0) > 0
                                                                                ? (delivery?.contact_primary_phone || 'work') === 'work'
                                                                                    ? ((customer?.contacts || []).find(x => x.id === delivery.contact_id)?.phone_work || '')
                                                                                    : (delivery?.contact_primary_phone || 'work') === 'fax'
                                                                                        ? ((customer?.contacts || []).find(x => x.id === delivery.contact_id)?.phone_work_fax || '')
                                                                                        : (delivery?.contact_primary_phone || 'work') === 'mobile'
                                                                                            ? ((customer?.contacts || []).find(x => x.id === delivery.contact_id)?.phone_mobile || '')
                                                                                            : (delivery?.contact_primary_phone || 'work') === 'direct'
                                                                                                ? ((customer?.contacts || []).find(x => x.id === delivery.contact_id)?.phone_direct || '')
                                                                                                : (delivery?.contact_primary_phone || 'work') === 'other'
                                                                                                    ? ((customer?.contacts || []).find(x => x.id === delivery.contact_id)?.phone_other || '')
                                                                                                    : ''
                                                                                : (customer?.contacts || []).find(x => x.is_primary === 1)
                                                                                    ? (delivery?.contact_primary_phone || 'work') === 'work'
                                                                                        ? (customer.contacts.find(x => x.is_primary === 1)?.phone_work || '')
                                                                                        : (delivery?.contact_primary_phone || 'work') === 'fax'
                                                                                            ? (customer.contacts.find(x => x.is_primary === 1)?.phone_work_fax || '')
                                                                                            : (delivery?.contact_primary_phone || 'work') === 'mobile'
                                                                                                ? (customer.contacts.find(x => x.is_primary === 1)?.phone_mobile || '')
                                                                                                : (delivery?.contact_primary_phone || 'work') === 'direct'
                                                                                                    ? (customer.contacts.find(x => x.is_primary === 1)?.phone_direct || '')
                                                                                                    : (delivery?.contact_primary_phone || 'work') === 'other'
                                                                                                        ? (customer.contacts.find(x => x.is_primary === 1)?.phone_other || '')
                                                                                                        : ''
                                                                                    : (delivery?.contact_phone || '')
                                                                            : ''

                                                                }
                                                            </div>
                                                        </div>
                                                        <div style={{ ...this.styleFlexRow }}>
                                                            <div
                                                                style={{ ...this.styleFieldName, width: '6rem' }}>Contact:
                                                            </div>
                                                            <div style={{ ...this.styleFieldData }}>
                                                                {
                                                                    (route?.type || '') === 'pickup'
                                                                        ? (pickup?.contact_id || 0) > 0
                                                                            ? (((customer?.contacts || []).find(x => x.id === pickup.contact_id)?.first_name || '') + ' ' +
                                                                                ((customer?.contacts || []).find(x => x.id === pickup.contact_id)?.last_name || '')).trim()
                                                                            : (customer?.contacts || []).find(x => x.is_primary === 1)
                                                                                ? (((customer?.contacts || []).find(x => x.is_primary === 1)?.first_name || '') + ' ' +
                                                                                    ((customer?.contacts || []).find(x => x.is_primary === 1)?.last_name || '')).trim()
                                                                                : (pickup?.contact_name || '')
                                                                        : (route?.type || '') === 'delivery'
                                                                            ? (delivery?.contact_id || 0) > 0
                                                                                ? (((customer?.contacts || []).find(x => x.id === delivery.contact_id)?.first_name || '') + ' ' +
                                                                                    ((customer?.contacts || []).find(x => x.id === delivery.contact_id)?.last_name || '')).trim()
                                                                                : (customer?.contacts || []).find(x => x.is_primary === 1)
                                                                                    ? (((customer?.contacts || []).find(x => x.is_primary === 1)?.first_name || '') + ' ' +
                                                                                        ((customer?.contacts || []).find(x => x.is_primary === 1)?.last_name || '')).trim()
                                                                                    : (delivery?.contact_name || '')
                                                                            : ''

                                                                }
                                                            </div>
                                                        </div>

                                                    </div>

                                                    <div style={{
                                                        ...this.styleFlexCol,
                                                        minWidth: '16rem'
                                                    }}>
                                                        <div style={{ ...this.styleFlexRow }}>
                                                            <div style={{ ...this.styleFieldName, width: '6.5rem' }}>BOL
                                                                Numbers:
                                                            </div>
                                                            <div style={{ ...this.styleFieldData }}>
                                                                {route.type === 'pickup' ? pickup.bol_numbers : delivery.bol_numbers}
                                                            </div>
                                                        </div>

                                                        <div style={{ ...this.styleFlexRow }}>
                                                            <div style={{ ...this.styleFieldName, width: '6.5rem' }}>PO
                                                                Numbers:
                                                            </div>
                                                            <div style={{ ...this.styleFieldData }}>
                                                                {route.type === 'pickup' ? pickup.po_numbers : delivery.po_numbers}
                                                            </div>
                                                        </div>

                                                        <div style={{ ...this.styleFlexRow }}>
                                                            <div style={{ ...this.styleFieldName, width: '6.5rem' }}>REF
                                                                Numbers:
                                                            </div>
                                                            <div style={{ ...this.styleFieldData }}>
                                                                {route.type === 'pickup' ? pickup.ref_numbers : delivery.ref_numbers}
                                                            </div>
                                                        </div>

                                                        <div style={{ ...this.styleFlexRow }}>
                                                            <div style={{ ...this.styleFieldName, width: '6.5rem' }}>SEAL
                                                                Number:
                                                            </div>
                                                            <div style={{ ...this.styleFieldData }}>
                                                                {route.type === 'pickup' ? pickup.seal_number : delivery.seal_number}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>

                    {/* PAGE BLOCK */}
                    <div className="page-block" style={{
                        paddingTop: '1.5rem',
                        display: 'grid',
                        gridTemplateColumns: '3fr 2fr',
                        gridGap: '1rem'
                    }}>
                        <div className="form-bordered-box" style={{
                            border: '1px solid rgba(0,0,0,0.1)',
                            boxShadow: '1px 1px 1px 0 rgba(0,0,0,0.8)',
                            padding: 10
                        }}>
                            <div className="form-title" style={{
                                position: 'absolute',
                                backgroundColor: 'white',
                                top: -10,
                                left: 10,
                                padding: '0 10px'
                            }}>Carrier Information
                            </div>

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gridGap: '0.5rem'
                            }}>
                                <div style={{
                                    ...this.styleFlexCol,
                                    justifyContent: 'center',
                                    flexGrow: 1,
                                    flexBasis: '100%'
                                }}>
                                    <span style={{ ...this.styleFieldData, color: '#4682B4', marginBottom: 5 }}>{
                                        ((this.props.selectedOrder?.carrier?.code_number || 0) === 0 ? (this.props.selectedOrder?.carrier?.code || '') : this.props.selectedOrder?.carrier?.code + this.props.selectedOrder?.carrier?.code_number).toUpperCase()
                                    }</span>
                                    <span style={{
                                        ...this.styleFieldData,
                                        marginBottom: 5
                                    }}>{(this.props.selectedOrder?.carrier?.name || '')}</span>
                                    <span style={{
                                        ...this.styleFieldData,
                                        marginBottom: 5
                                    }}>{(this.props.selectedOrder?.carrier?.address1 || '')}</span>
                                    <span
                                        style={{ ...this.styleFieldData }}>{(this.props.selectedOrder?.carrier?.city || '')}, {(this.props.selectedOrder?.carrier?.state || '').toUpperCase()} {(this.props.selectedOrder?.carrier?.zip || '')}</span>
                                </div>

                                <div style={{
                                    ...this.styleFlexCol,
                                    justifyContent: 'center',
                                    flexGrow: 1,
                                    flexBasis: '100%'
                                }}>
                                    <div style={{ ...this.styleFlexRow, marginBottom: 5 }}><span
                                        style={{ ...this.styleFieldName, width: '4rem' }}>CONTACT:</span> <span
                                            style={{ ...this.styleFieldData }}>{
                                                (this.props.selectedOrder?.carrier?.contacts || []).find(c => c.is_primary === 1) === undefined
                                                    ? (this.props.selectedOrder?.carrier?.contact_name || '').toUpperCase()
                                                    : (this.props.selectedOrder?.carrier?.contacts.find(c => c.is_primary === 1).first_name + ' ' + this.props.selectedOrder?.carrier?.contacts.find(c => c.is_primary === 1).last_name).toUpperCase()
                                            }</span></div>
                                    <div style={{ ...this.styleFlexRow, marginBottom: 5 }}>
                                        <span style={{ ...this.styleFieldName, width: '4rem' }}>PHONE:</span><span
                                            style={{ ...this.styleFieldData, marginRight: 5 }}>{
                                                (this.props.selectedOrder?.carrier?.contacts || []).find(c => c.is_primary === 1) === undefined
                                                    ? (this.props.selectedOrder?.carrier?.contact_phone || '')
                                                    : this.props.selectedOrder?.carrier?.contacts.find(c => c.is_primary === 1).primary_phone === 'work'
                                                        ? this.props.selectedOrder?.carrier?.contacts.find(c => c.is_primary === 1).phone_work
                                                        : this.props.selectedOrder?.carrier?.contacts.find(c => c.is_primary === 1).primary_phone === 'fax'
                                                            ? this.props.selectedOrder?.carrier?.contacts.find(c => c.is_primary === 1).phone_work_fax
                                                            : this.props.selectedOrder?.carrier?.contacts.find(c => c.is_primary === 1).primary_phone === 'mobile'
                                                                ? this.props.selectedOrder?.carrier?.contacts.find(c => c.is_primary === 1).phone_mobile
                                                                : this.props.selectedOrder?.carrier?.contacts.find(c => c.is_primary === 1).primary_phone === 'direct'
                                                                    ? this.props.selectedOrder?.carrier?.contacts.find(c => c.is_primary === 1).phone_direct
                                                                    : this.props.selectedOrder?.carrier?.contacts.find(c => c.is_primary === 1).primary_phone === 'other'
                                                                        ? this.props.selectedOrder?.carrier?.contacts.find(c => c.is_primary === 1).phone_other
                                                                        : ''
                                            }</span>
                                        <span style={{ ...this.styleFieldName, width: '1.5rem' }}>Ext:</span><span
                                            style={{ ...this.styleFieldData }}>{
                                                (this.props.selectedOrder?.carrier?.contacts || []).find(c => c.is_primary === 1) === undefined
                                                    ? (this.props.selectedOrder?.carrier?.ext || '')
                                                    : this.props.selectedOrder?.carrier?.contacts.find(c => c.is_primary === 1).phone_ext
                                            }</span>
                                    </div>
                                    <div style={{ ...this.styleFlexRow }}><span
                                        style={{ ...this.styleFieldName, width: '4rem' }}>E-MAIL:</span> <span
                                            style={{ ...this.styleFieldData }}>{(
                                                (this.props.selectedOrder?.carrier?.contacts || []).find(c => c.is_primary === 1) === undefined
                                                    ? (this.props.selectedOrder?.carrier?.contact_phone || '')
                                                    : this.props.selectedOrder?.carrier?.contacts.find(c => c.is_primary === 1).primary_email === 'work'
                                                        ? this.props.selectedOrder?.carrier?.contacts.find(c => c.is_primary === 1).email_work
                                                        : this.props.selectedOrder?.carrier?.contacts.find(c => c.is_primary === 1).primary_email === 'personal'
                                                            ? this.props.selectedOrder?.carrier?.contacts.find(c => c.is_primary === 1).email_personal
                                                            : this.props.selectedOrder?.carrier?.contacts.find(c => c.is_primary === 1).primary_email === 'other'
                                                                ? this.props.selectedOrder?.carrier?.contacts.find(c => c.is_primary === 1).email_other
                                                                : ''
                                            ).toLowerCase()}</span></div>
                                </div>
                            </div>
                        </div>

                        <div className="form-bordered-box" style={{
                            border: '1px solid rgba(0,0,0,0.1)',
                            boxShadow: '1px 1px 1px 0 rgba(0,0,0,0.8)',
                            padding: 10
                        }}>
                            <div className="form-title" style={{
                                position: 'absolute',
                                backgroundColor: 'white',
                                top: -10,
                                left: 10,
                                padding: '0 10px'
                            }}>Driver Information
                            </div>

                            <div style={{
                                ...this.styleFlexCol,
                                justifyContent: 'center',
                                flexGrow: 1,
                                flexBasis: '100%'
                            }}>
                                <div style={{ ...this.styleFlexRow, marginBottom: 5 }}><span
                                    style={{ ...this.styleFieldName, width: '4rem' }}>NAME:</span> <span
                                        style={{ ...this.styleFieldData }}>{(this.props.selectedOrder?.driver?.first_name || '').toUpperCase()} {(this.props.selectedOrder?.driver?.last_name || '').toUpperCase()}</span>
                                </div>
                                <div style={{ ...this.styleFlexRow, marginBottom: 5 }}><span
                                    style={{ ...this.styleFieldName, width: '4rem' }}>PHONE:</span> <span
                                        style={{ ...this.styleFieldData }}>{(this.props.selectedOrder?.driver?.phone || '').toUpperCase()}</span>
                                </div>
                                <div style={{ ...this.styleFlexRow, marginBottom: 5 }}><span
                                    style={{ ...this.styleFieldName, width: '4rem' }}>UNIT:</span> <span
                                        style={{ ...this.styleFieldData }}>{(this.props.selectedOrder?.driver?.truck || '').toUpperCase()}</span>
                                </div>
                                <div style={{ ...this.styleFlexRow, marginBottom: 5 }}><span
                                    style={{ ...this.styleFieldName, width: '4rem' }}>TRAILER:</span> <span
                                        style={{ ...this.styleFieldData }}>{(this.props.selectedOrder?.driver?.trailer || '').toUpperCase()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {
                        (this.props.selectedOrder?.notes_for_carrier || []).length > 0
                            ?
                            //* PAGE BLOCK */
                            < div className="page-block"
                                style={{ paddingTop: '1.5rem', display: 'grid', gridTemplateColumns: '1fr' }}>
                                <div className="form-bordered-box" style={{
                                    border: '1px solid rgba(0,0,0,0.1)',
                                    boxShadow: '1px 1px 1px 0 rgba(0,0,0,0.8)',
                                    padding: 10
                                }}>
                                    <div className="form-title" style={{
                                        position: 'absolute',
                                        backgroundColor: 'white',
                                        top: -10,
                                        left: 10,
                                        padding: '0 10px'
                                    }}>Notes for Carrier
                                    </div>

                                    {
                                        (this.props.selectedOrder?.notes_for_carrier || []).map((note, index) => {
                                            return (
                                                <div key={index} style={{ ...this.styleFieldData, marginTop: '0.5rem' }}>
                                                    {note.text.split(/\r?\n/).map((text, index) => (
                                                        <div key={index}>{text.toUpperCase()}</div>
                                                    ))}
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                            :
                            //* PAGE BLOCK */
                            < div className="page-block"
                                style={{ paddingTop: '1.5rem', display: 'grid', gridTemplateColumns: '1fr' }}>
                                <div className="form-bordered-box" style={{
                                    border: '1px solid rgba(0,0,0,0.1)',
                                    boxShadow: '1px 1px 1px 0 rgba(0,0,0,0.8)',
                                    padding: 10,
                                    minHeight: 100
                                }}>
                                    <div className="form-title" style={{
                                        position: 'absolute',
                                        backgroundColor: 'white',
                                        top: -10,
                                        left: 10,
                                        padding: '0 10px'
                                    }}>Notes for Carrier
                                    </div>

                                </div>
                            </div>
                    }


                    {/* PAGE BLOCK */}
                    <div className="page-block"
                        style={{ paddingTop: '1.5rem', display: 'grid', gridTemplateColumns: '1fr' }}>
                        <div className="form-bordered-box" style={{
                            border: '1px solid rgba(0,0,0,0.1)',
                            boxShadow: '1px 1px 1px 0 rgba(0,0,0,0.8)',
                            padding: 10
                        }}>
                            <div className="form-title" style={{
                                position: 'absolute',
                                backgroundColor: 'white',
                                top: -10,
                                left: 10,
                                padding: '0 10px'
                            }}>Events
                            </div>

                            <div style={{ ...this.styleFlexRow, justifyContent: 'space-between', marginBottom: 10 }}>
                                <span style={{
                                    ...this.styleFieldName,
                                    minWidth: '8rem',
                                    maxWidth: '8rem',
                                    textDecoration: 'underline'
                                }}>Date & Time</span>
                                <span style={{
                                    ...this.styleFieldName,
                                    minWidth: '12rem',
                                    maxWidth: '12rem',
                                    textDecoration: 'underline'
                                }}>Event</span>
                                <span style={{
                                    ...this.styleFieldName,
                                    minWidth: '8rem',
                                    maxWidth: '8rem',
                                    textDecoration: 'underline'
                                }}>Event Location</span>
                                <span style={{ ...this.styleFieldName, flexGrow: 1, textDecoration: 'underline' }}>Event Notes</span>
                                <span style={{
                                    ...this.styleFieldName,
                                    minWidth: '3rem',
                                    maxWidth: '8rem',
                                    textDecoration: 'underline',
                                    textAlign: 'center'
                                }}>User</span>
                            </div>

                            {
                                (this.props.selectedOrder?.events || []).map((item, index) => {
                                    return (
                                        <div key={index} style={{
                                            ...this.styleFlexRow,
                                            justifyContent: 'space-between',
                                            marginBottom: 5
                                        }}>
                                            <span style={{ ...this.styleFieldData, minWidth: '8rem', maxWidth: '8rem' }}>
                                                {item.event_date}{(item.event_date === '' && item.event_time === '') ? '' : ' @ '}{item.event_time}
                                            </span>
                                            <span style={{
                                                ...this.styleFieldData,
                                                minWidth: '12rem',
                                                maxWidth: '12rem'
                                            }}>{(item.event_type?.name || '').toUpperCase()}</span>
                                            <span style={{
                                                ...this.styleFieldData,
                                                minWidth: '8rem',
                                                maxWidth: '8rem'
                                            }}>{item.event_location}</span>
                                            <span
                                                style={{ ...this.styleFieldData, flexGrow: 1 }}>{item.event_notes}</span>
                                            <span style={{
                                                ...this.styleFieldData,
                                                minWidth: '3rem',
                                                maxWidth: '8rem',
                                                textAlign: 'center'
                                            }}>{item.user_id}</span>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>


                    {/* PAGE BLOCK */}
                    <div className="page-block" style={{
                        paddingTop: '1.5rem',
                        paddingBottom: '1.5rem',
                        display: 'grid',
                        gridTemplateColumns: '1fr'
                    }}>
                        <div className="form-bordered-box" style={{
                            border: '1px solid rgba(0,0,0,0.1)',
                            boxShadow: '1px 1px 1px 0 rgba(0,0,0,0.8)',
                            padding: 10
                        }}>
                            <div className="form-title" style={{
                                position: 'absolute',
                                backgroundColor: 'white',
                                top: -10,
                                left: 10,
                                padding: '0 10px'
                            }}>Totals
                            </div>

                            <div style={{
                                ...this.styleFlexRow,
                                marginBottom: 10,
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr'
                            }}>
                                <span style={{
                                    ...this.styleFieldName,
                                    textDecoration: 'underline',
                                    textAlign: 'center'
                                }}>Pieces/Skids</span>
                                <span style={{
                                    ...this.styleFieldName,
                                    textDecoration: 'underline',
                                    textAlign: 'center'
                                }}>Weight</span>
                                <span style={{
                                    ...this.styleFieldName,
                                    textDecoration: 'underline',
                                    textAlign: 'center'
                                }}>Charges</span>
                                <span
                                    style={{ ...this.styleFieldName, textDecoration: 'underline', textAlign: 'center' }}>Order Cost</span>
                                <span style={{
                                    ...this.styleFieldName,
                                    textDecoration: 'underline',
                                    textAlign: 'center'
                                }}>Profit</span>
                                <span style={{
                                    ...this.styleFieldName,
                                    textDecoration: 'underline',
                                    textAlign: 'center'
                                }}>Percentage</span>
                                <span style={{
                                    ...this.styleFieldName,
                                    textDecoration: 'underline',
                                    textAlign: 'center'
                                }}>Miles</span>
                            </div>

                            <div style={{
                                ...this.styleFlexRow,
                                marginBottom: 10,
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr'
                            }}>
                                {/* PIECES-SKIDS */}
                                <NumberFormat
                                    style={{
                                        ...this.styleFieldData,
                                        textAlign: 'center',
                                        fontWeight: 'bold',
                                        color: '#4682B4'
                                    }}
                                    value={
                                        // new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(((this.props.selectedOrder?.order_customer_ratings || []).reduce((a, b) => {
                                        //     return { pieces: Number(a.pieces) + Number(b.pieces) }
                                        // }, { pieces: '' })?.pieces || '').toString().replace(',', ''))) === 0 
                                        // ? '' 
                                        // : new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(((this.props.selectedOrder?.order_customer_ratings || []).reduce((a, b) => {
                                        //     return { pieces: Number(a.pieces) + Number(b.pieces) }
                                        // }, { pieces: '' })?.pieces || '').toString().replace(',', '')))
                                        ((this.props.selectedOrder?.order_customer_ratings || []).reduce((a, b) => {
                                            return { pieces: Number(a.pieces) + Number(b.pieces) }
                                        }, { pieces: '' })?.pieces || '')
                                    }
                                    thousandsGroupStyle="thousand"
                                    thousandSeparator={true}
                                    decimalScale={Number.isInteger(Number(((this.props.selectedOrder?.order_customer_ratings || []).reduce((a, b) => {
                                        return { pieces: Number(a.pieces) + Number(b.pieces) }
                                    }, { pieces: '' })?.pieces || '').toString().replace(',', ''))) ? 0 : 2}
                                    fixedDecimalScale={true}
                                    prefix={''}
                                    suffix={
                                        ((this.props.selectedOrder?.order_customer_ratings || []).find(r => r.pieces_unit === 'pc') !== undefined &&
                                            (this.props.selectedOrder?.order_customer_ratings || []).find(r => r.pieces_unit === 'sk') !== undefined)
                                            ? ''
                                            : (this.props.selectedOrder?.order_customer_ratings || []).find(r => r.pieces_unit === 'pc') !== undefined
                                                ? ' Pieces'
                                                : (this.props.selectedOrder?.order_customer_ratings || []).find(r => r.pieces_unit === 'sk') !== undefined
                                                    ? ' Skids'
                                                    : ''
                                    }
                                    type="text"
                                    onValueChange={(values) => {
                                    }}
                                    displayType={'text'}
                                    readOnly={true}
                                />

                                {/* WEIGHT */}
                                <NumberFormat
                                    style={{
                                        ...this.styleFieldData,
                                        textAlign: 'center',
                                        fontWeight: 'bold',
                                        color: '#4682B4'
                                    }}
                                    value={
                                        // new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(((this.props.selectedOrder?.order_customer_ratings || []).reduce((a, b) => {
                                        //     return { weight: Number(a.weight) + Number(b.weight) }
                                        // }, { weight: '' })?.weight || '').toString().replace(',', '')))
                                        ((this.props.selectedOrder?.order_customer_ratings || []).reduce((a, b) => {
                                            return { weight: Number(a.weight) + Number(b.weight) }
                                        }, { weight: '' })?.weight || '')
                                    }
                                    thousandsGroupStyle="thousand"
                                    thousandSeparator={true}
                                    decimalScale={Number.isInteger(Number(((this.props.selectedOrder?.order_customer_ratings || []).reduce((a, b) => {
                                        return { weight: Number(a.weight) + Number(b.weight) }
                                    }, { weight: '' })?.weight || '').toString().replace(',', ''))) ? 0 : 2}
                                    fixedDecimalScale={true}
                                    prefix={''}
                                    type="text"
                                    onValueChange={(values) => {
                                    }}
                                    displayType={'text'}
                                    readOnly={true}
                                />

                                {/* CUSTOMER CHARGES */}
                                <NumberFormat
                                    style={{
                                        ...this.styleFieldData,
                                        textAlign: 'center',
                                        fontWeight: 'bold',
                                        color: '#4682B4'
                                    }}
                                    value={
                                        new Intl.NumberFormat('en-US', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        }).format(Number(((this.props.selectedOrder?.order_customer_ratings || []).reduce((a, b) => {
                                            return { total_charges: Number(a.total_charges) + Number(b.total_charges) }
                                        }, { total_charges: '' })?.total_charges || '').toString().replace(',', '')))
                                    }
                                    thousandsGroupStyle="thousand"
                                    thousandSeparator={true}
                                    decimalScale={2}
                                    fixedDecimalScale={true}
                                    prefix={'$ '}
                                    type="text"
                                    onValueChange={(values) => {
                                    }}
                                    displayType={'text'}
                                    readOnly={true}
                                />

                                {/* ORDER COST */}
                                <NumberFormat
                                    style={{
                                        ...this.styleFieldData,
                                        textAlign: 'center',
                                        fontWeight: 'bold',
                                        color: '#4682B4'
                                    }}
                                    value={
                                        new Intl.NumberFormat('en-US', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        }).format(Number(((this.props.selectedOrder?.order_carrier_ratings || []).reduce((a, b) => {
                                            return { total_charges: Number(a.total_charges) + Number(b.total_charges) }
                                        }, { total_charges: '' })?.total_charges || '').toString().replace(',', '')))
                                    }
                                    thousandsGroupStyle="thousand"
                                    thousandSeparator={true}
                                    decimalScale={2}
                                    fixedDecimalScale={true}
                                    prefix={'$ '}
                                    type="text"
                                    onValueChange={(values) => {
                                    }}
                                    displayType={'text'}
                                    readOnly={true}
                                />

                                {/* PROFIT */}
                                <NumberFormat
                                    style={{
                                        ...this.styleFieldData,
                                        textAlign: 'center',
                                        fontWeight: 'bold',
                                        color: Number(((this.props.selectedOrder?.order_customer_ratings || []).reduce((a, b) => {
                                            return { total_charges: Number((a.total_charges || '').toString().replace(',', '')) + Number((b.total_charges || '').toString().replace(',', '')) }
                                        }, { total_charges: '' })?.total_charges || '').toString().replace(',', '')) - Number(((this.props.selectedOrder?.order_carrier_ratings || []).reduce((a, b) => {
                                            return { total_charges: Number((a.total_charges || '').toString().replace(',', '')) + Number((b.total_charges || '').toString().replace(',', '')) }
                                        }, { total_charges: '' })?.total_charges || '').toString().replace(',', '')) < 0 ? 'red' : '#4682B4'
                                    }}
                                    value={
                                        new Intl.NumberFormat('en-US', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        }).format(Number(((this.props.selectedOrder?.order_customer_ratings || []).reduce((a, b) => {
                                            return { total_charges: Number((a.total_charges || '').toString().replace(',', '')) + Number((b.total_charges || '').toString().replace(',', '')) }
                                        }, { total_charges: '' })?.total_charges || '').toString().replace(',', '')) - Number(((this.props.selectedOrder?.order_carrier_ratings || []).reduce((a, b) => {
                                            return { total_charges: Number((a.total_charges || '').toString().replace(',', '')) + Number((b.total_charges || '').toString().replace(',', '')) }
                                        }, { total_charges: '' })?.total_charges || '').toString().replace(',', '')))
                                    }
                                    thousandsGroupStyle="thousand"
                                    thousandSeparator={true}
                                    decimalScale={2}
                                    fixedDecimalScale={true}
                                    prefix={'$ '}
                                    type="text"
                                    onValueChange={(values) => {
                                    }}
                                    displayType={'text'}
                                    readOnly={true}
                                />

                                {/* PERCENTAGE */}
                                <NumberFormat
                                    style={{
                                        ...this.styleFieldData, textAlign: 'center', fontWeight: 'bold', color: Number((
                                            Number(((this.props.selectedOrder?.order_customer_ratings || []).reduce((a, b) => {
                                                return { total_charges: Number((a.total_charges || '').toString().replace(',', '')) + Number((b.total_charges || '').toString().replace(',', '')) }
                                            }, { total_charges: '' })?.total_charges || '').toString().replace(',', '')) > 0
                                            ||
                                            Number(((this.props.selectedOrder?.order_carrier_ratings || []).reduce((a, b) => {
                                                return { total_charges: Number((a.total_charges || '').toString().replace(',', '')) + Number((b.total_charges || '').toString().replace(',', '')) }
                                            }, { total_charges: '' })?.total_charges || '').toString().replace(',', '')) > 0
                                        )
                                            ?
                                            (
                                                (
                                                    Number(((this.props.selectedOrder?.order_customer_ratings || []).reduce((a, b) => {
                                                        return { total_charges: Number((a.total_charges || '').toString().replace(',', '')) + Number((b.total_charges || '').toString().replace(',', '')) }
                                                    }, { total_charges: '' })?.total_charges || '').toString().replace(',', '')) - Number(((this.props.selectedOrder?.order_carrier_ratings || []).reduce((a, b) => {
                                                        return { total_charges: Number((a.total_charges || '').toString().replace(',', '')) + Number((b.total_charges || '').toString().replace(',', '')) }
                                                    }, { total_charges: '' })?.total_charges || '').toString().replace(',', ''))
                                                )
                                                * 100
                                            )
                                            /
                                            (
                                                Number(((this.props.selectedOrder?.order_customer_ratings || []).reduce((a, b) => {
                                                    return { total_charges: Number((a.total_charges || '').toString().replace(',', '')) + Number((b.total_charges || '').toString().replace(',', '')) }
                                                }, { total_charges: '' })?.total_charges || '').toString().replace(',', '')) > 0
                                                    ? Number(((this.props.selectedOrder?.order_customer_ratings || []).reduce((a, b) => {
                                                        return { total_charges: Number((a.total_charges || '').toString().replace(',', '')) + Number((b.total_charges || '').toString().replace(',', '')) }
                                                    }, { total_charges: '' })?.total_charges || '').toString().replace(',', ''))
                                                    : Number(((this.props.selectedOrder?.order_carrier_ratings || []).reduce((a, b) => {
                                                        return { total_charges: Number((a.total_charges || '').toString().replace(',', '')) + Number((b.total_charges || '').toString().replace(',', '')) }
                                                    }, { total_charges: '' })?.total_charges || '').toString().replace(',', ''))
                                            )
                                            : 0) < 0 ? 'red' : '#4682B4'
                                    }}
                                    value={
                                        (
                                            Number(((this.props.selectedOrder?.order_customer_ratings || []).reduce((a, b) => {
                                                return { total_charges: Number((a.total_charges || '').toString().replace(',', '')) + Number((b.total_charges || '').toString().replace(',', '')) }
                                            }, { total_charges: '' })?.total_charges || '').toString().replace(',', '')) > 0
                                            ||
                                            Number(((this.props.selectedOrder?.order_carrier_ratings || []).reduce((a, b) => {
                                                return { total_charges: Number((a.total_charges || '').toString().replace(',', '')) + Number((b.total_charges || '').toString().replace(',', '')) }
                                            }, { total_charges: '' })?.total_charges || '').toString().replace(',', '')) > 0
                                        )
                                            ?
                                            (
                                                (
                                                    Number(((this.props.selectedOrder?.order_customer_ratings || []).reduce((a, b) => {
                                                        return { total_charges: Number((a.total_charges || '').toString().replace(',', '')) + Number((b.total_charges || '').toString().replace(',', '')) }
                                                    }, { total_charges: '' })?.total_charges || '').toString().replace(',', '')) - Number(((this.props.selectedOrder?.order_carrier_ratings || []).reduce((a, b) => {
                                                        return { total_charges: Number((a.total_charges || '').toString().replace(',', '')) + Number((b.total_charges || '').toString().replace(',', '')) }
                                                    }, { total_charges: '' })?.total_charges || '').toString().replace(',', ''))
                                                )
                                                * 100
                                            )
                                            /
                                            (
                                                Number(((this.props.selectedOrder?.order_customer_ratings || []).reduce((a, b) => {
                                                    return { total_charges: Number((a.total_charges || '').toString().replace(',', '')) + Number((b.total_charges || '').toString().replace(',', '')) }
                                                }, { total_charges: '' })?.total_charges || '').toString().replace(',', '')) > 0
                                                    ? Number(((this.props.selectedOrder?.order_customer_ratings || []).reduce((a, b) => {
                                                        return { total_charges: Number((a.total_charges || '').toString().replace(',', '')) + Number((b.total_charges || '').toString().replace(',', '')) }
                                                    }, { total_charges: '' })?.total_charges || '').toString().replace(',', ''))
                                                    : Number(((this.props.selectedOrder?.order_carrier_ratings || []).reduce((a, b) => {
                                                        return { total_charges: Number((a.total_charges || '').toString().replace(',', '')) + Number((b.total_charges || '').toString().replace(',', '')) }
                                                    }, { total_charges: '' })?.total_charges || '').toString().replace(',', ''))
                                            )
                                            : 0
                                    }
                                    thousandsGroupStyle="thousand"
                                    thousandSeparator={true}
                                    decimalScale={2}
                                    fixedDecimalScale={true}
                                    prefix={''}
                                    suffix={'%'}
                                    type="text"
                                    onValueChange={(values) => {
                                    }}
                                    displayType={'text'}
                                    readOnly={true}
                                />

                                {/* MILES */}
                                <NumberFormat
                                    style={{
                                        ...this.styleFieldData,
                                        textAlign: 'center',
                                        fontWeight: 'bold',
                                        color: '#4682B4'
                                    }}
                                    value={((this.props.selectedOrder?.miles || 0) / 1609.34).toFixed(0)}
                                    thousandsGroupStyle="thousand"
                                    thousandSeparator={true}
                                    decimalScale={0}
                                    fixedDecimalScale={true}
                                    prefix={''}
                                    type="text"
                                    isNumericString={true}
                                    onValueChange={(values) => {
                                    }}
                                    displayType={'text'}
                                    readOnly={true}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

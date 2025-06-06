import React, { Component } from 'react';
import moment from 'moment';
import './ToPrint.css';
import NumberFormat from 'react-number-format';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

export default class ToPrint extends Component {
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
        color: 'black',
        fontSize: '0.8rem',
        fontStyle: 'italic'
    }
    styleTitleBackground = {
        backgroundColor: 'lightgray'
    }
    styleFieldDataBold = {
        color: 'black',
        fontWeight: 'bold',
        fontSize: '0.8rem'
    }

    pad = (num, size) => {
        var s = "000000000" + num;
        return s.substr(s.length - size);
    }

    render() {
        const totalRows = 5;
        let fillRows = [];

        for (let i = 0; i < totalRows - (this.props.selectedOrder?.order_customer_ratings || []).filter(
            x => (x.rate_type?.name || '').toLowerCase() === 'flat' || (x.rate_type?.name || '').toLowerCase() === 'linehaul' || (x.rate_type?.id || 0) === 0
        ).length; i++) {
            fillRows.push({});
        }
        return (
            <div className="content-page" style={{
                minWidth: '245.5mm',
                maxWidth: '245.5mm',
                display: 'block',
                fontSize: '0.9rem',
                fontFamily: 'Lato',
                fontStyle: 'italic'
            }}>

                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                <link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Play:wght@400;700&display=swap" rel="stylesheet" />

                <div className="container-sheet" style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gridTemplateRows: 'auto auto 1fr auto'
                }}>
                    {/* CANCELLED WATERMARK */}
                    {
                        (this.props.selectedOrder?.is_cancelled || 0) === 1 &&
                        <div className='watermark-container'>
                            <p>CANCELLED</p>
                        </div>
                    }

                    <div style={{
                        marginTop: '2rem',
                        display: 'flex',
                        flexDirection: 'column',
                        border: '1px solid rgba(0,0,0,0.3)',
                        borderRadius: 5
                    }}>
                        <div style={{
                            borderBottom: '1px solid rgba(0,0,0,0.3)',
                            ...this.styleFlexRow,
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: 10
                        }}>
                            <div style={{ ...this.styleFlexCol, width: '10rem', alignItems: 'center', justifyContent: 'space-evenly' }}>
                                <div style={{ ...this.styleFieldName, marginBottom: 5 }}>PICK-UP DATE</div>
                                <div style={{ ...this.styleFieldData }}>
                                    {
                                        ((this.props.selectedOrder?.routing || []).length > 0 && this.props.selectedOrder?.routing[0].type === 'pickup') &&
                                        <span>
                                            {
                                                (this.props.selectedOrder?.ship_from?.pu_date1 || '') === ''
                                                    ? ''
                                                    : moment(this.props.selectedOrder?.ship_from?.pu_date1, 'MM/DD/YYYY').format('MMMM DD, YYYY')
                                            }
                                        </span>
                                    }
                                </div>
                            </div>

                            <div style={{ ...this.styleFlexCol, flexGrow: 1, flexBasis: '100%', alignItems: 'center' }}>
                                <div style={{ ...this.styleFieldName, fontSize: '1rem' }}>BILL OF LADING – SHORT FORM – NOT NEGOTIABLE</div>
                            </div>

                            <div style={{ ...this.styleFlexCol, width: '10rem', alignItems: 'center', justifyContent: 'space-evenly' }}>
                                <div style={{ ...this.styleFieldName, marginBottom: 5 }}>DELIVERY DATE</div>
                                <div style={{ ...this.styleFieldData }}>
                                    {
                                        ((this.props.selectedOrder?.routing || []).length > 0 && this.props.selectedOrder?.routing[this.props.selectedOrder?.routing.length - 1].type === 'delivery') &&
                                        <span>
                                            {
                                                (this.props.selectedOrder?.ship_to?.delivery_date2 || '') === ''
                                                    ? ''
                                                    : moment(this.props.selectedOrder?.ship_to?.delivery_date2, 'MM/DD/YYYY').format('MMMM DD, YYYY')
                                            }
                                        </span>
                                    }
                                </div>
                            </div>
                        </div>

                        <div style={{
                            borderBottom: '1px solid rgba(0,0,0,0.3)',
                            ...this.styleFlexRow
                        }}>
                            <div style={{ flexGrow: 1, flexBasis: '100%', borderRight: '1px solid rgba(0,0,0,0.3)', ...this.styleFlexCol }}>
                                <div style={{
                                    ...this.styleTitleBackground,
                                    ...this.styleFlexRow,
                                    ...this.styleFieldName,
                                    borderBottom: '1px solid rgba(0,0,0,0.3)',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    padding: 5
                                }}>
                                    SHIP FROM
                                </div>
                                <div style={{ ...this.styleFieldData, padding: 10 }}>
                                    <div>
                                        {
                                            <span style={{ textTransform: 'capitalize' }}>
                                                {
                                                    (this.props.selectedOrder?.ship_from?.original_name || '')
                                                }
                                            </span>
                                        }
                                    </div>
                                    <div>
                                        {
                                            <span style={{ textTransform: 'capitalize' }}>
                                                {
                                                    (this.props.selectedOrder?.ship_from?.address1 || '')
                                                }
                                            </span>
                                        }
                                    </div>
                                    <div>
                                        {
                                            <span style={{ textTransform: 'capitalize' }}>
                                                {
                                                    (this.props.selectedOrder?.ship_from?.address2 || '')
                                                }
                                            </span>
                                        }
                                    </div>
                                    {
                                        <div>
                                            <span style={{ textTransform: 'capitalize' }}>
                                                {
                                                    (this.props.selectedOrder?.ship_from?.city || '')
                                                }
                                            </span>, <span>
                                                {
                                                    (this.props.selectedOrder?.ship_from?.state || '').toUpperCase()
                                                }
                                            </span> <span>
                                                {
                                                    (this.props.selectedOrder?.ship_from?.zip || '').toUpperCase()
                                                }
                                            </span>
                                        </div>
                                    }
                                </div>
                            </div>

                            <div style={{ flexGrow: 1, flexBasis: '100%' }}>

                            </div>
                        </div>

                        <div style={{
                            borderBottom: '1px solid rgba(0,0,0,0.3)',
                            ...this.styleFlexRow
                        }}>
                            <div style={{ flexGrow: 1, flexBasis: '100%', borderRight: '1px solid rgba(0,0,0,0.3)', ...this.styleFlexCol }}>
                                <div style={{
                                    ...this.styleTitleBackground,
                                    ...this.styleFlexRow,
                                    ...this.styleFieldName,
                                    borderBottom: '1px solid rgba(0,0,0,0.3)',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    padding: 5
                                }}>
                                    SHIP TO
                                </div>
                                <div style={{ ...this.styleFieldData, padding: 10 }}>
                                    <div>
                                        {
                                            <span style={{ textTransform: 'capitalize' }}>
                                                {
                                                    (this.props.selectedOrder?.ship_to?.original_name || '')
                                                }
                                            </span>
                                        }
                                    </div>
                                    <div>
                                        {
                                            <span style={{ textTransform: 'capitalize' }}>
                                                {
                                                    (this.props.selectedOrder?.ship_to?.address1 || '')
                                                }
                                            </span>
                                        }
                                    </div>
                                    <div>
                                        {
                                            <span style={{ textTransform: 'capitalize' }}>
                                                {
                                                    (this.props.selectedOrder?.ship_to?.address2 || '')
                                                }
                                            </span>
                                        }
                                    </div>
                                    {
                                        <div>
                                            <span style={{ textTransform: 'capitalize' }}>
                                                {
                                                    (this.props.selectedOrder?.ship_to?.city || '')
                                                }
                                            </span>, <span>
                                                {
                                                    (this.props.selectedOrder?.ship_to?.state || '').toUpperCase()
                                                }
                                            </span> <span>
                                                {
                                                    (this.props.selectedOrder?.ship_to?.zip || '').toUpperCase()
                                                }
                                            </span>
                                        </div>
                                    }
                                </div>
                            </div>

                            <div style={{ flexGrow: 1, flexBasis: '100%' }}>
                                <div style={{
                                    ...this.styleFlexRow,
                                    ...this.styleFieldName,
                                    borderBottom: '1px solid rgba(0,0,0,0.3)',
                                    justifyContent: 'flex-start',
                                    alignItems: 'center',
                                    padding: 5
                                }}>
                                    <span style={{ marginRight: 5 }}>Shipping Order Number: </span> <span style={{ fontWeight: 'normal' }}>{this.pad((this.props.selectedOrder?.order_number || 0), 5)}</span>
                                </div>

                                <div style={{
                                    ...this.styleFieldData,
                                    padding: 10,
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gridTemplateRows: '1fr 1fr'
                                }}>
                                    <div style={{ marginBottom: 5 }}><span style={{ marginRight: 5, fontWeight: 'bold', marginBottom: 5 }}>BOL Number: </span> {
                                        <span style={{ fontWeight: 'normal' }}>{
                                            (this.props.selectedOrder?.ship_from?.bol_numbers || '').split('|').map((item, index) => {
                                                return (<span style={{ color: index % 2 === 0 ? 'black' : '#535252' }}>{item} </span>)
                                            })
                                        }</span>
                                    }</div>
                                    <div style={{ marginBottom: 5 }}><span style={{ marginRight: 5, fontWeight: 'bold', marginBottom: 5 }}>PO Numbers: </span> {
                                        <span style={{ fontWeight: 'normal' }}>{
                                            (this.props.selectedOrder?.ship_from?.po_numbers || '').split('|').map((item, index) => {
                                                return (<span style={{ color: index % 2 === 0 ? 'black' : '#535252' }}>{item} </span>)
                                            })
                                        }</span>
                                    }</div>
                                    <div style={{ marginBottom: 5 }}><span style={{ marginRight: 5, fontWeight: 'bold', marginBottom: 5 }}>REF Numbers: </span> {
                                        <span style={{ fontWeight: 'normal' }}>{
                                            (this.props.selectedOrder?.ship_from?.ref_numbers || '').split('|').map((item, index) => {
                                                return (<span style={{ color: index % 2 === 0 ? 'black' : '#535252' }}>{item} </span>)
                                            })
                                        }</span>
                                    }</div>
                                    <div style={{ marginBottom: 5 }}><span style={{ marginRight: 5, fontWeight: 'bold', marginBottom: 5 }}>SEAL Number: </span> {
                                        <span style={{ fontWeight: 'normal' }}>{
                                            <span style={{ color: 'black' }}>{(this.props.selectedOrder?.ship_from?.seal_number || '')} </span>
                                        }</span>
                                    }</div>
                                </div>
                            </div>
                        </div>



                        <div style={{
                            borderBottom: '1px solid rgba(0,0,0,0.3)',
                            ...this.styleFlexRow
                        }}>
                            <div style={{ flexGrow: 1, flexBasis: '100%', borderRight: '1px solid rgba(0,0,0,0.3)', ...this.styleFlexCol }}>
                                <div style={{
                                    ...this.styleTitleBackground,
                                    ...this.styleFlexRow,
                                    ...this.styleFieldName,
                                    borderBottom: '1px solid rgba(0,0,0,0.3)',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    padding: 5
                                }}>
                                    THIRD PARTY FREIGHT CHARGES BILL TO
                                </div>
                                <div style={{ ...this.styleFieldData, padding: 10 }}>
                                    {
                                        this.props.freightChargeTerms3rdParty &&
                                        <div>
                                            <div>
                                                {(this.props.selectedCompany?.mailing_address?.name || '')}
                                            </div>
                                            <div>
                                                {(this.props.selectedCompany?.mailing_address?.address1 || '')}
                                            </div>
                                            <div>
                                                {(this.props.selectedCompany?.mailing_address?.address2 || '')}
                                            </div>
                                            <div>
                                                <span>
                                                    {(this.props.selectedCompany?.mailing_address?.city || '')}
                                                </span>, <span>
                                                    {(this.props.selectedCompany?.mailing_address?.state || '').toUpperCase()}
                                                </span> <span>
                                                    {(this.props.selectedCompany?.mailing_address?.zip || '')}
                                                </span>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>

                            <div style={{ flexGrow: 1, flexBasis: '100%' }}>
                                <div style={{
                                    ...this.styleFlexRow,
                                    ...this.styleFieldName,
                                    borderBottom: '1px solid rgba(0,0,0,0.3)',
                                    justifyContent: 'flex-start',
                                    alignItems: 'center',
                                    padding: 5
                                }}>
                                    <span style={{ marginRight: 5 }}>Carrier Name: </span>
                                    <span style={{ fontWeight: 'normal' }}>{(this.props.selectedOrder?.carrier?.name || '')}</span>
                                    {
                                        (this.props.selectedOrder?.carrier?.mc_number || '') !== ''
                                            ? <span style={{ marginLeft: 5, fontWeight: 'normal', fontStyle: 'italic' }}>MC# {this.props.selectedOrder?.carrier?.mc_number}</span>
                                            : (this.props.selectedOrder?.carrier?.dot_number || '') !== ''
                                                ? <span style={{ marginLeft: 5, fontWeight: 'normal', fontStyle: 'italic' }}>DOT# {this.props.selectedOrder?.carrier?.dot_number}</span>
                                                : ''
                                    }
                                </div>
                                <div style={{ ...this.styleFieldData, padding: 10 }}>
                                    <div style={{ marginBottom: 5, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <div style={{ flexGrow: 1 }}><span style={{ fontWeight: 'bold', marginRight: 5 }}>Truck Number: </span> <span>{(this.props.selectedOrder?.driver?.tractor?.number || '')}</span></div>
                                        <div style={{ flexGrow: 1 }}><span style={{ fontWeight: 'bold', marginRight: 5 }}>Trailer Number: </span> <span>{(this.props.selectedOrder?.driver?.trailer?.number || '')}</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>



                        <div style={{
                            borderBottom: '1px solid rgba(0,0,0,0.3)',
                            ...this.styleFlexRow
                        }}>
                            <div style={{ flexGrow: 1, flexBasis: '100%', borderRight: '1px solid rgba(0,0,0,0.3)', ...this.styleFlexCol }}>
                                <div style={{
                                    ...this.styleFlexRow,
                                    ...this.styleFieldName,
                                    justifyContent: 'flex-start',
                                    alignItems: 'center',
                                    padding: 5
                                }}>
                                    Special Instructions:
                                </div>
                                <div style={{ ...this.styleFieldData, padding: 10 }}>
                                    {
                                        (this.props.selectedOrder?.ship_from?.special_instructions || '')
                                    }
                                </div>
                            </div>

                            <div style={{ flexGrow: 1, flexBasis: '100%' }}>
                                <div style={{
                                    ...this.styleFlexRow,
                                    ...this.styleFieldName,
                                    justifyContent: 'flex-start',
                                    alignItems: 'center',
                                    padding: 5
                                }}>
                                    Freight Charge Terms:
                                </div>
                                <div style={{
                                    ...this.styleFlexRow,
                                    ...this.styleFieldName,
                                    justifyContent: 'flex-start',
                                    alignItems: 'center',
                                    padding: 5,
                                    fontSize: '0.5rem'
                                }}>
                                    (Freight charges are prepaid unless marked otherwise)
                                </div>
                                <div style={{ ...this.styleFieldData, ...this.styleFlexRow, padding: 10, alignItems: 'center', justifyContent: 'space-evenly' }}>
                                    <div style={{ ...this.styleFlexRow, alignItems: 'center' }}>
                                        <label htmlFor="freight-charge-terms-prepaid">Prepaid</label>
                                        <input type="checkbox" id="freight-charge-terms-prepaid" checked={this.props.freightChargeTermsPrepaid} onChange={(e) => {
                                            this.props.setFreightChargeTermsPrepaid(e.target.checked);
                                        }} />
                                    </div>
                                    <div style={{ ...this.styleFlexRow, alignItems: 'center' }}>
                                        <label htmlFor="freight-charge-terms-collect">Collect</label>
                                        <input type="checkbox" id="freight-charge-terms-collect" checked={this.props.freightChargeTermsCollect} onChange={(e) => {
                                            this.props.setFreightChargeTermsCollect(e.target.checked);
                                        }} />
                                    </div>
                                    <div style={{ ...this.styleFlexRow, alignItems: 'center' }}>
                                        <label htmlFor="freight-charge-terms-3rd-party">3rd Party</label>
                                        <input type="checkbox" id="freight-charge-terms-3rd-party" checked={this.props.freightChargeTerms3rdParty} onChange={(e) => {
                                            this.props.setFreightChargeTerms3rdParty(e.target.checked);
                                        }} />
                                    </div>
                                </div>
                                <div style={{

                                }}>
                                    <div style={{ ...this.styleFlexRow, ...this.styleFieldData, alignItems: 'center', justifyContent: 'center', padding: 5, borderTop: '1px solid rgba(0,0,0,0.3)' }}>
                                        <input type="checkbox" id="freight-charge-terms-master" checked={this.props.freightChargeTermsMaster} onChange={(e) => {
                                            this.props.setFreightChargeTermsMaster(e.target.checked);
                                        }} />
                                        <label htmlFor="freight-charge-terms-master">Master bill of lading with attached underlying bills of lading.</label>
                                    </div>
                                </div>
                            </div>
                        </div>




                        <div style={{
                            ...this.styleFlexCol
                        }}>
                            <div style={{
                                ...this.styleFieldName,
                                ...this.styleTitleBackground,
                                padding: 5,
                                justifyContent: 'center',
                                display: 'flex',
                                borderBottom: '1px solid rgba(0,0,0,0.3)'
                            }}>
                                CUSTOMER ORDER INFORMATION
                            </div>

                            <div style={{
                                ...this.styleFlexRow,
                                borderBottom: '1px solid rgba(0,0,0,0.3)'
                            }}>

                                <div style={{
                                    borderRight: '1px solid rgba(0,0,0,0.3)',
                                    ...this.styleFieldName,
                                    padding: 5,
                                    ...this.styleFlexCol,
                                    justifyContent: 'center',
                                    textAlign: 'center',
                                    minWidth: '5rem',
                                    maxWidth: '5rem'
                                }}>
                                    Quantity or Piece Count
                                </div>

                                <div style={{
                                    borderRight: '1px solid rgba(0,0,0,0.3)',
                                    ...this.styleFieldName,
                                    padding: 5,
                                    ...this.styleFlexCol,
                                    justifyContent: 'center',
                                    textAlign: 'center',
                                    minWidth: '5rem',
                                    maxWidth: '5rem'
                                }}>
                                    Type (Skids, Bundles)
                                </div>

                                <div style={{
                                    borderRight: '1px solid rgba(0,0,0,0.3)',
                                    ...this.styleFieldName,
                                    padding: 5,
                                    ...this.styleFlexCol,
                                    justifyContent: 'center',
                                    textAlign: 'center',
                                    minWidth: '4.5rem',
                                    maxWidth: '4.5rem'
                                }}>
                                    Weight
                                </div>

                                <div style={{
                                    borderRight: '1px solid rgba(0,0,0,0.3)',
                                    ...this.styleFieldName,
                                    padding: 5,
                                    ...this.styleFlexCol,
                                    justifyContent: 'center',
                                    textAlign: 'center',
                                    minWidth: '4.5rem',
                                    maxWidth: '4.5rem'
                                }}>
                                    HazMat (X)
                                </div>

                                <div style={{
                                    ...this.styleFieldName,
                                    padding: 5,
                                    ...this.styleFlexCol,
                                    justifyContent: 'center',
                                    flexGrow: 1
                                }}>
                                    Commodity Description <br />
                                    <span style={{
                                        fontSize: '0.5rem'
                                    }}>
                                        Commodities requiring special or additional care or attention in handling or stowing must be so marked and packaged as to ensure safe transportation with ordinary care. See Section 2(e) of NMFC item 360
                                    </span>
                                </div>
                            </div>

                            {
                                (this.props.ratingItems || []).map((rating, index) => {
                                    return (
                                        <div key={index} style={{
                                            ...this.styleFlexRow,
                                            minHeight: '1.5rem',
                                            borderBottom: '1px solid rgba(0,0,0,0.3)'
                                        }}>

                                            <div style={{
                                                borderRight: '1px solid rgba(0,0,0,0.3)',
                                                ...this.styleFieldData,
                                                padding: 5,
                                                ...this.styleFlexCol,
                                                justifyContent: 'center',
                                                textAlign: 'center',
                                                minWidth: '5rem',
                                                maxWidth: '5rem'
                                            }}>
                                                {/* <NumberFormat
                                                    value={rating.pieces > 0 ? rating.pieces : ''}
                                                    thousandsGroupStyle="thousand"
                                                    thousandSeparator={true}
                                                    decimalScale={Number.isInteger(rating.pieces) ? 0 : 2}
                                                    fixedDecimalScale={true}
                                                    prefix={''}
                                                    type="text"
                                                    displayType={'text'}
                                                    
                                                /> */}
                                                <input
                                                    type="text"
                                                    style={{
                                                        border: 0,
                                                        textAlign: 'center',
                                                        fontStyle: 'italic'
                                                    }}
                                                    onChange={(e) => {
                                                        let _items = [...this.props.ratingItems];
                                                        let newItem = { ..._items[index] };
                                                        newItem.pieces = e.target.value;
                                                        _items[index] = { ...newItem };

                                                        this.props.setRatingItems([..._items]);
                                                    }}
                                                    value={rating?.pieces || ''}
                                                />
                                            </div>

                                            <div style={{
                                                borderRight: '1px solid rgba(0,0,0,0.3)',
                                                ...this.styleFieldData,
                                                padding: 5,
                                                ...this.styleFlexCol,
                                                justifyContent: 'center',
                                                textAlign: 'center',
                                                minWidth: '5rem',
                                                maxWidth: '5rem'
                                            }}>
                                                {/* {rating?.pieces_name || ''} */}

                                                <input
                                                    type="text"
                                                    style={{
                                                        border: 0,
                                                        textAlign: 'center',
                                                        fontStyle: 'italic'
                                                    }}
                                                    onChange={(e) => {
                                                        let _items = [...this.props.ratingItems];
                                                        let newItem = { ..._items[index] };
                                                        newItem.pieces_name = e.target.value;
                                                        _items[index] = { ...newItem };

                                                        this.props.setRatingItems([..._items]);
                                                    }}
                                                    value={rating?.pieces_name || ''}
                                                />

                                            </div>

                                            <div style={{
                                                borderRight: '1px solid rgba(0,0,0,0.3)',
                                                ...this.styleFieldData,
                                                padding: 5,
                                                ...this.styleFlexCol,
                                                justifyContent: 'center',
                                                textAlign: 'center',
                                                minWidth: '4.5rem',
                                                maxWidth: '4.5rem'
                                            }}>
                                                {/* <NumberFormat
                                                    value={rating.weight > 0 ? rating.weight : ''}
                                                    thousandsGroupStyle="thousand"
                                                    thousandSeparator={true}
                                                    decimalScale={Number.isInteger(rating.weight) ? 0 : 2}
                                                    fixedDecimalScale={true}
                                                    prefix={''}
                                                    type="text"
                                                    displayType={'text'}
                                                /> */}

                                                <input
                                                    type="text"
                                                    style={{
                                                        border: 0,
                                                        textAlign: 'center',
                                                        fontStyle: 'italic'
                                                    }}
                                                    onChange={(e) => {
                                                        let _items = [...this.props.ratingItems];
                                                        let newItem = { ..._items[index] };
                                                        newItem.weight = e.target.value;
                                                        _items[index] = { ...newItem };

                                                        this.props.setRatingItems([..._items]);
                                                    }}
                                                    value={rating?.weight || ''}
                                                />
                                            </div>

                                            <div style={{
                                                borderRight: '1px solid rgba(0,0,0,0.3)',
                                                ...this.styleFieldData,
                                                padding: 5,
                                                ...this.styleFlexCol,
                                                justifyContent: 'center',
                                                textAlign: 'center',
                                                minWidth: '4.5rem',
                                                maxWidth: '4.5rem'
                                            }}>

                                            </div>

                                            <div style={{
                                                ...this.styleFieldData,
                                                ...this.styleFlexRow,
                                                justifyContent: 'center',
                                                flexGrow: 1
                                            }}>
                                                <div style={{ flexGrow: 1, borderRight: '1px solid rgba(0,0,0,0.3)', padding: 5 }}>
                                                    {/* {rating.description} */}
                                                    <input
                                                        type="text"
                                                        style={{
                                                            border: 0,
                                                            textAlign: 'left',
                                                            fontStyle: 'italic',
                                                            width: '100%'
                                                        }}
                                                        onChange={(e) => {
                                                            let _items = [...this.props.ratingItems];
                                                            let newItem = { ..._items[index] };
                                                            newItem.description = e.target.value;
                                                            _items[index] = { ...newItem };

                                                            this.props.setRatingItems([..._items]);
                                                        }}
                                                        value={rating?.description || ''}
                                                    />
                                                </div>
                                                <div style={{ minWidth: '4rem', maxWidth: '4rem', borderRight: '1px solid rgba(0,0,0,0.3)' }}>

                                                </div>
                                                <div style={{ minWidth: '4rem', maxWidth: '4rem' }}>

                                                </div>

                                            </div>
                                        </div>
                                    )
                                })
                            }

                            {/* {
                                fillRows.map((row, index) => {
                                    return (
                                        <div key={index} style={{
                                            ...this.styleFlexRow,
                                            minHeight: '1.5rem',
                                            borderBottom: '1px solid rgba(0,0,0,0.3)'
                                        }}>

                                            <div style={{
                                                borderRight: '1px solid rgba(0,0,0,0.3)',
                                                ...this.styleFieldData,
                                                padding: 5,
                                                ...this.styleFlexCol,
                                                justifyContent: 'center',
                                                textAlign: 'center',
                                                minWidth: '5rem',
                                                maxWidth: '5rem'
                                            }}>

                                            </div>

                                            <div style={{
                                                borderRight: '1px solid rgba(0,0,0,0.3)',
                                                ...this.styleFieldData,
                                                padding: 5,
                                                ...this.styleFlexCol,
                                                justifyContent: 'center',
                                                textAlign: 'center',
                                                minWidth: '5rem',
                                                maxWidth: '5rem'
                                            }}>

                                            </div>

                                            <div style={{
                                                borderRight: '1px solid rgba(0,0,0,0.3)',
                                                ...this.styleFieldData,
                                                padding: 5,
                                                ...this.styleFlexCol,
                                                justifyContent: 'center',
                                                textAlign: 'center',
                                                minWidth: '4.5rem',
                                                maxWidth: '4.5rem'
                                            }}>

                                            </div>

                                            <div style={{
                                                borderRight: '1px solid rgba(0,0,0,0.3)',
                                                ...this.styleFieldData,
                                                padding: 5,
                                                ...this.styleFlexCol,
                                                justifyContent: 'center',
                                                textAlign: 'center',
                                                minWidth: '4.5rem',
                                                maxWidth: '4.5rem'
                                            }}>

                                            </div>

                                            <div style={{
                                                ...this.styleFieldData,
                                                ...this.styleFlexRow,
                                                justifyContent: 'center',
                                                flexGrow: 1
                                            }}>
                                                <div style={{ flexGrow: 1, borderRight: '1px solid rgba(0,0,0,0.3)', padding: 5 }}>

                                                </div>
                                                <div style={{ minWidth: '4rem', maxWidth: '4rem', borderRight: '1px solid rgba(0,0,0,0.3)' }}>

                                                </div>
                                                <div style={{ minWidth: '4rem', maxWidth: '4rem' }}>

                                                </div>

                                            </div>
                                        </div>
                                    )
                                })
                            } */}


                        </div>
                    </div>


                    <div style={{
                        ...this.styleFlexCol,
                        border: '1px solid rgba(0,0,0,0.3)',
                        borderRadius: 5,
                        marginTop: 15
                    }}>


                        <div style={{
                            ...this.styleFlexRow,
                            borderBottom: '1px solid rgba(0,0,0,0.3)'
                        }}>

                            <div style={{
                                ...this.styleFlexCol,
                                padding: 5,
                                borderRight: '1px solid rgba(0,0,0,0.3)',
                                flexGrow: 1,
                                flexBasis: '100%',
                                justifyContent: 'center'
                            }}>
                                <span style={{ fontSize: '0.6rem' }}>Where the rate is dependent on value, shippers are required to state specifically in writing the agreed or declared value of the property as follows: “The agreed or declared value of the property is specifically stated by the shipper to be not exceeding _______________ per _______________.</span>
                            </div>

                            <div style={{
                                ...this.styleFlexCol,
                                padding: 5,
                                flexGrow: 1,
                                flexBasis: '100%',
                                ...this.styleFieldData,
                                justifyContent: 'space-between'
                            }}>
                                <div style={{
                                    ...this.styleFlexRow,
                                    marginBottom: 5
                                }}>
                                    <span>COD Amount: $</span><span style={{ flexGrow: 1, borderBottom: '1px solid rgba(0,0,0,0.3)' }}></span>
                                </div>

                                <div style={{
                                    ...this.styleFlexRow,
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <b>Fee Terms:</b>
                                    <div style={{ ...this.styleFlexRow, alignItems: 'center' }}>
                                        <label htmlFor="fee-terms-collect">Collet</label>
                                        <input type="checkbox" id="fee-terms-collect" checked={this.props.feeTermsCollect} onChange={(e) => {
                                            this.props.setFeeTermsCollect(e.target.checked);
                                        }} />
                                    </div>
                                    <div style={{ ...this.styleFlexRow, alignItems: 'center' }}>
                                        <label htmlFor="fee-terms-prepaid">Prepaid</label>
                                        <input type="checkbox" id="fee-terms-prepaid" checked={this.props.feeTermsPrepaid} onChange={(e) => {
                                            this.props.setFeeTermsPrepaid(e.target.checked);
                                        }} />
                                    </div>
                                    <div style={{ ...this.styleFlexRow, alignItems: 'center' }}>
                                        <label htmlFor="fee-terms-check">Customer check acceptable</label>
                                        <input type="checkbox" id="fee-terms-check" checked={this.props.feeTermsCheck} onChange={(e) => {
                                            this.props.setFeeTermsCheck(e.target.checked);
                                        }} />
                                    </div>
                                </div>
                            </div>

                        </div>



                        <div style={{
                            ...this.styleFlexRow,
                            borderBottom: '1px solid rgba(0,0,0,0.3)',
                            padding: 5,
                            justifyContent: 'center'
                        }}>
                            <b>Note: Liability limitation for loss or damage in this shipment may be applicable. See 49 USC § 14706(c)(1)(A) and (B).</b>
                        </div>

                        <div style={{
                            ...this.styleFlexRow,
                            borderBottom: '1px solid rgba(0,0,0,0.3)'
                        }}>
                            <div style={{
                                ...this.styleFlexCol,
                                padding: 5,
                                borderRight: '1px solid rgba(0,0,0,0.3)',
                                flexGrow: 1,
                                flexBasis: '100%',
                                justifyContent: 'center'
                            }}>
                                <span style={{ fontSize: '0.6rem' }}>Received, subject to individually determined rates or contracts that have been agreed upon in writing between the carrier and shipper, if applicable, otherwise to the rates, classifications, and rules that have been established by the carrier and are available to the shipper, on request, and to all applicable state and federal regulations.</span>
                            </div>

                            <div style={{
                                ...this.styleFlexCol,
                                padding: 5,
                                flexGrow: 1,
                                flexBasis: '100%',
                                ...this.styleFieldData,
                                justifyContent: 'space-between'
                            }}>
                                <div style={{ fontSize: '0.6rem' }}>The carrier shall not make delivery of this shipment without payment of charges and all other lawful fees.</div>

                                <div style={{
                                    ...this.styleFlexRow,
                                    marginBottom: 5
                                }}>
                                    <b><span>Shipper Signature</span></b> <span style={{ flexGrow: 1, borderBottom: '1px solid rgba(0,0,0,0.3)' }}></span>
                                </div>
                            </div>
                        </div>

                        <div style={{
                            ...this.styleFlexRow
                        }}>

                            <div style={{
                                padding: 5,
                                borderRight: '1px solid rgba(0,0,0,0.3)',
                                ...this.styleFlexCol,
                                flexGrow: 3,
                                flexBasis: '100%'
                            }}>
                                <div style={{ ...this.styleFieldName, marginBottom: 20 }}>Shipper Signature/Date</div>
                                <div style={{ borderBottom: '1px solid rgba(0,0,0,0.3)' }}></div>
                                <div style={{ fontSize: '0.6rem' }}>This is to certify that the above named materials are properly classified, packaged, marked, and labeled, and are in proper condition for transportation according to the applicable regulations of the DOT.</div>
                            </div>

                            <div style={{
                                padding: 5,
                                borderRight: '1px solid rgba(0,0,0,0.3)',
                                flexGrow: 2,
                                flexBasis: '100%',
                                ...this.styleFlexCol
                            }}>
                                <div style={{ ...this.styleFieldName, marginBottom: 5 }}>Trailer Loaded:</div>
                                <div style={{ ...this.styleFlexRow, alignItems: 'center', ...this.styleFieldData }}>
                                    <input type="checkbox" id="trailer-loaded-by-shipper" checked={this.props.trailerLoadedByShipper} onChange={(e) => {
                                        this.props.setTrailerLoadedByShipper(e.target.checked);
                                    }} />
                                    <label htmlFor="trailer-loaded-by-shipper">By shipper</label>
                                </div>

                                <div style={{ ...this.styleFlexRow, alignItems: 'center', ...this.styleFieldData }}>
                                    <input type="checkbox" id="trailer-loaded-by-driver" checked={this.props.trailerLoadedByDriver} onChange={(e) => {
                                        this.props.setTrailerLoadedByDriver(e.target.checked);
                                    }} />
                                    <label htmlFor="trailer-loaded-by-driver">By driver</label>
                                </div>
                            </div>

                            <div style={{
                                padding: 5,
                                borderRight: '1px solid rgba(0,0,0,0.3)',
                                flexGrow: 2,
                                flexBasis: '100%',
                                ...this.styleFlexCol
                            }}>
                                <div style={{ ...this.styleFieldName, marginBottom: 5 }}>Freight Counted::</div>
                                <div style={{ ...this.styleFlexRow, alignItems: 'center', ...this.styleFieldData }}>
                                    <input type="checkbox" id="freight-counted-by-shipper" checked={this.props.freightCountedByShipper} onChange={(e) => {
                                        this.props.setFreightCountedByShipper(e.target.checked);
                                    }} />
                                    <label htmlFor="freight-counted-by-shipper">By shipper</label>
                                </div>
                                <div style={{ ...this.styleFlexRow, alignItems: 'center', ...this.styleFieldData }}>
                                    <input type="checkbox" id="freight-counted-by-driver-pallets" checked={this.props.freightCountedByDriverPallets} onChange={(e) => {
                                        this.props.setFreightCountedByDriverPallets(e.target.checked);
                                    }} />
                                    <label htmlFor="freight-counted-by-driver-pallets">By driver/pallets said to contain</label>
                                </div>
                                <div style={{ ...this.styleFlexRow, alignItems: 'center', ...this.styleFieldData }}>
                                    <input type="checkbox" id="freight-counted-by-driver-pieces" checked={this.props.freightCountedByDriverPieces} onChange={(e) => {
                                        this.props.setFreightCountedByDriverPieces(e.target.checked);
                                    }} />
                                    <label htmlFor="freight-counted-by-driver-pieces">By driver/pieces</label>
                                </div>
                            </div>

                            <div style={{
                                padding: 5,
                                ...this.styleFlexCol,
                                flexGrow: 3,
                                flexBasis: '100%'
                            }}>
                                <div style={{ ...this.styleFieldName, marginBottom: 20 }}>Carrier Signature/PickupDate</div>
                                <div style={{ borderBottom: '1px solid rgba(0,0,0,0.3)' }}></div>
                                <div style={{ fontSize: '0.6rem' }}>Carrier acknowledges receipt of packages and required placards. Carrier certifies emergency response information was made available and/or carrier has the DOT emergency response guidebook or equivalent documentation in the vehicle. Property described above is received in good order, except as noted.</div>
                            </div>

                        </div>
                    </div>

                    <div style={{
                        ...this.styleFlexCol,
                        border: '1px solid rgba(0,0,0,0.3)',
                        borderRadius: 5,
                        marginTop: 15,
                        marginBottom: 20
                    }}>

                        <div style={{ ...this.styleFieldName, textAlign: 'center', fontSize: '1rem', fontWeight: 'bold', marginTop: 10, marginBottom: 30 }}>
                            Consignee/Receiver Signature
                        </div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'auto 0.7fr auto 1fr auto 1fr',
                            paddingLeft: 40,
                            paddingRight: 40,
                            marginBottom: 10
                        }}>
                            <span style={{ marginRight: 5 }}>Date:</span>
                            <span style={{ marginRight: 5, borderBottom: '1px solid rgba(0,0,0,1)' }}></span>
                            <span style={{ marginRight: 5 }}>Print Name:</span>
                            <span style={{ marginRight: 5, borderBottom: '1px solid rgba(0,0,0,1)' }}></span>
                            <span style={{ marginRight: 5 }}>Signature:</span>
                            <span style={{ borderBottom: '1px solid rgba(0,0,0,1)' }}></span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

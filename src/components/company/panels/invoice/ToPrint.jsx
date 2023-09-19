import React, { Component } from 'react'
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

    pad = (num, size) => {
        var s = "000000000" + num;
        return s.substr(s.length - size);
    }

    render() {
        const totalRows = 25;
        let fillRows = [];

        for (let i = 0; i < totalRows - (this.props.selectedOrder?.routing || []).length - (this.props.selectedOrder?.order_customer_ratings || []).length - 1; i++) {
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

                    {/* PAGE BLOCK */}
                    <div className="page-block" style={{ paddingTop: '2rem', pageBreakBefore: 'always' }}>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr 1fr',
                        }}>

                            <img src={((this.props.selectedCompany?.id || 0) > 0 && (this.props.selectedCompany?.logo || '') !== '') ? this.props.serverUrl + '/company-logo/' + this.props.selectedCompany.logo : 'img/company-logo-default.png'} alt="" style={{
                                maxWidth: 270,
                                maxHeight: 180
                            }} />
                            <div>
                                <div style={{ ...this.styleFieldName, textAlign: 'center', fontSize: '1rem', fontFamily: 'Play', fontWeight: 'bold' }}>{this.props.selectedCompany?.name || 'Company Name'}</div>
                                <div style={{ ...this.styleFieldName, textAlign: 'center', fontSize: '0.8rem' }}>{this.props.selectedCompany?.address1 || 'Company Address 1'}</div>
                                {
                                    (this.props.selectedCompany?.address2 || '') !== '' &&
                                    <div style={{ ...this.styleFieldName, textAlign: 'center', fontSize: '0.8rem' }}>{this.props.selectedCompany.address2}</div>
                                }
                                <div style={{ ...this.styleFieldName, textAlign: 'center', fontSize: '0.8rem' }}>{this.props.selectedCompany?.city || 'City'}, {this.props.selectedCompany?.state || 'State'} {this.props.selectedCompany?.zip || 'Zip'}</div>
                            </div>
                            <div>
                                <div style={{ ...this.styleFieldName, textAlign: 'right', fontSize: '1.3rem', fontFamily: 'Play', fontWeight: 'bold', marginBottom: 10 }}>
                                    INVOICE
                                </div>

                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gridGap: 5

                                }}>
                                    <div style={{
                                        // borderLeft: '1px solid rgba(0,0,0,0.7)',
                                        // borderRight: '1px solid rgba(0,0,0,0.7)',
                                        // borderTop: '1px solid rgba(0,0,0,0.7)',
                                        // borderBottom: '1px solid rgba(0,0,0,0.7)',
                                        display: 'grid',
                                        gridTemplateColumns: '1fr',
                                        gridTemplateRows: 'auto 1fr',
                                        boxShadow: '1px 1px 2px 1px rgba(0,0,0,0.5)'
                                    }}>
                                        <div style={{
                                            backgroundColor: 'rgba(0,0,0,0.1)',
                                            textAlign: 'center',
                                            padding: 3,
                                            fontWeight: 'bold'
                                        }}>Date</div>
                                        <div style={{
                                            // backgroundColor: 'rgba(0,0,0,0.1)',
                                            textAlign: 'center',
                                            padding: 3,
                                        }}>{moment().format('MM/DD/YYYY')}</div>
                                    </div>

                                    <div style={{
                                        // // borderLeft: '1px solid rgba(0,0,0,0.7)',
                                        // borderRight: '1px solid rgba(0,0,0,0.7)',
                                        // borderTop: '1px solid rgba(0,0,0,0.7)',
                                        // borderBottom: '1px solid rgba(0,0,0,0.7)',
                                        display: 'grid',
                                        gridTemplateColumns: '1fr',
                                        gridTemplateRows: 'auto 1fr',
                                        boxShadow: '1px 1px 2px 1px rgba(0,0,0,0.5)'
                                    }}>
                                        <div style={{
                                            backgroundColor: 'rgba(0,0,0,0.1)',
                                            textAlign: 'center',
                                            padding: 3,
                                            fontWeight: 'bold'
                                        }}>Invoice Nº</div>
                                        <div style={{
                                            // backgroundColor: 'rgba(0,0,0,0.1)',
                                            textAlign: 'center',
                                            padding: 3,
                                        }}>{this.pad((this.props.selectedOrder?.order_number || 0), 5)}</div>
                                    </div>

                                    <div style={{
                                        // borderLeft: '1px solid rgba(0,0,0,0.7)',
                                        // borderRight: '1px solid rgba(0,0,0,0.7)',
                                        // // borderTop: '1px solid rgba(0,0,0,0.7)',
                                        // borderBottom: '1px solid rgba(0,0,0,0.7)',
                                        display: 'grid',
                                        gridTemplateColumns: '1fr',
                                        gridTemplateRows: 'auto 1fr',
                                        boxShadow: '1px 1px 2px 1px rgba(0,0,0,0.5)'
                                    }}>
                                        <div style={{
                                            backgroundColor: 'rgba(0,0,0,0.1)',
                                            textAlign: 'center',
                                            padding: 3,
                                            fontWeight: 'bold'
                                        }}>Ship Date</div>
                                        <div style={{
                                            // backgroundColor: 'rgba(0,0,0,0.1)',
                                            textAlign: 'center',
                                            padding: 3,
                                        }}>{
                                                (this.props.selectedOrder?.pickups || []).length > 0
                                                    ? (this.props.selectedOrder?.pickups[0]?.pu_date1 || '')
                                                    : ''
                                            }</div>
                                    </div>
                                    <div style={{
                                        // // borderLeft: '1px solid rgba(0,0,0,0.7)',
                                        // borderRight: '1px solid rgba(0,0,0,0.7)',
                                        // // borderTop: '1px solid rgba(0,0,0,0.7)',
                                        // borderBottom: '1px solid rgba(0,0,0,0.7)',
                                        display: 'grid',
                                        gridTemplateColumns: '1fr',
                                        gridTemplateRows: 'auto 1fr',
                                        boxShadow: '1px 1px 2px 1px rgba(0,0,0,0.5)'
                                    }}>
                                        <div style={{
                                            backgroundColor: 'rgba(0,0,0,0.1)',
                                            textAlign: 'center',
                                            padding: 3,
                                            fontWeight: 'bold'
                                        }}>Terms</div>
                                        <div style={{
                                            // backgroundColor: 'rgba(0,0,0,0.1)',
                                            textAlign: 'center',
                                            padding: 3,
                                        }}>{this.props.selectedOrder?.bill_to_company?.term?.name || ''}</div>
                                    </div>
                                    <div style={{
                                        // borderLeft: '1px solid rgba(0,0,0,0.7)',
                                        // borderRight: '1px solid rgba(0,0,0,0.7)',
                                        // // borderTop: '1px solid rgba(0,0,0,0.7)',
                                        // borderBottom: '1px solid rgba(0,0,0,0.7)',
                                        display: 'grid',
                                        gridTemplateColumns: '1fr',
                                        gridTemplateRows: 'auto 1fr',
                                        boxShadow: '1px 1px 2px 1px rgba(0,0,0,0.5)'
                                    }}>
                                        <div style={{
                                            backgroundColor: 'rgba(0,0,0,0.1)',
                                            textAlign: 'center',
                                            padding: 3,
                                            fontWeight: 'bold'
                                        }}>P.O. Number</div>
                                        <div style={{
                                            // backgroundColor: 'rgba(0,0,0,0.1)',
                                            textAlign: 'center',
                                            padding: 3,
                                            minHeight: 23,
                                            overflow: 'hidden'
                                        }}>
                                            {
                                                (this.props.selectedOrder?.pickups || []).map((item, index) => {
                                                    return (
                                                        <div>
                                                            {
                                                                (item.po_numbers || '').split('|').map((_item, _index) => {
                                                                    return (
                                                                        <span
                                                                            key={_index}
                                                                            style={{
                                                                                fontWeight: _index % 2 === 0 ? 'bold' : 'normal',
                                                                                marginLeft: _index === 0 ? 0 : ((_item || '') === '' ? 0 : 5)
                                                                            }}
                                                                        >
                                                                            {_item}
                                                                        </span>
                                                                    )
                                                                })
                                                            }
                                                        </div>

                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                    <div></div>
                                </div>
                            </div>

                        </div>


                    </div>


                    {/* PAGE BLOCK */}
                    <div className="page-block" style={{
                        paddingTop: '2rem',
                        pageBreakBefore: 'auto',
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr',
                        minHeight: 135
                    }}>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr',
                            gridTemplateRows: 'auto 1fr',
                            boxShadow: '1px 1px 2px 1px rgba(0,0,0,0.5)'
                        }}>
                            <div style={{
                                backgroundColor: 'rgba(0,0,0,0.1)',
                                textAlign: 'left',
                                padding: 3,
                                fontWeight: 'bold'
                            }}>Bill To</div>
                            <div style={{
                                // backgroundColor: 'rgba(0,0,0,0.1)',
                                textAlign: 'left',
                                padding: 3,
                                minHeight: 23
                            }}>
                                <div>{this.props.selectedOrder?.bill_to_company?.name || ''}</div>
                                <div>{this.props.selectedOrder?.bill_to_company?.address1 || ''}</div>
                                <div>{this.props.selectedOrder?.bill_to_company?.address2 || ''}</div>
                                <div>
                                    <span>{this.props.selectedOrder?.bill_to_company?.city || ''}</span>, <span>{this.props.selectedOrder?.bill_to_company?.state || ''}</span> <span>{this.props.selectedOrder?.bill_to_company?.zip || ''}</span>
                                </div>
                            </div>
                        </div>

                        <div></div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr',
                            gridTemplateRows: 'auto 1fr',
                            boxShadow: '1px 1px 2px 1px rgba(0,0,0,0.5)'
                        }}>
                            <div style={{
                                backgroundColor: 'rgba(0,0,0,0.1)',
                                textAlign: 'left',
                                padding: 3,
                                fontWeight: 'bold'
                            }}>Ship To</div>
                            <div style={{
                                // backgroundColor: 'rgba(0,0,0,0.1)',
                                textAlign: 'left',
                                padding: 3,
                                minHeight: 23
                            }}>
                                <div>
                                    {
                                        (this.props.selectedOrder?.routing || []).length > 0
                                            ? this.props.selectedOrder?.routing[this.props.selectedOrder?.routing.length - 1]?.type === 'delivery'
                                                ? this.props.selectedOrder?.deliveries.find(d => d.id === this.props.selectedOrder?.routing[this.props.selectedOrder?.routing.length - 1].delivery_id)?.customer?.name || ''
                                                : ''
                                            : ''
                                    }
                                </div>
                                <div>
                                    {
                                        (this.props.selectedOrder?.routing || []).length > 0
                                            ? this.props.selectedOrder?.routing[this.props.selectedOrder?.routing.length - 1]?.type === 'delivery'
                                                ? this.props.selectedOrder?.deliveries.find(d => d.id === this.props.selectedOrder?.routing[this.props.selectedOrder?.routing.length - 1].delivery_id)?.customer?.address1 || ''
                                                : ''
                                            : ''
                                    }
                                </div>
                                <div>
                                    {
                                        (this.props.selectedOrder?.routing || []).length > 0
                                            ? this.props.selectedOrder?.routing[this.props.selectedOrder?.routing.length - 1]?.type === 'delivery'
                                                ? this.props.selectedOrder?.deliveries.find(d => d.id === this.props.selectedOrder?.routing[this.props.selectedOrder?.routing.length - 1].delivery_id)?.customer?.address2 || ''
                                                : ''
                                            : ''
                                    }
                                </div>
                                <div>
                                    <span>
                                        {
                                            (this.props.selectedOrder?.routing || []).length > 0
                                                ? this.props.selectedOrder?.routing[this.props.selectedOrder?.routing.length - 1]?.type === 'delivery'
                                                    ? this.props.selectedOrder?.deliveries.find(d => d.id === this.props.selectedOrder?.routing[this.props.selectedOrder?.routing.length - 1].delivery_id)?.customer?.city || ''
                                                    : ''
                                                : ''
                                        }
                                    </span>, <span>
                                        {
                                            (this.props.selectedOrder?.routing || []).length > 0
                                                ? this.props.selectedOrder?.routing[this.props.selectedOrder?.routing.length - 1]?.type === 'delivery'
                                                    ? this.props.selectedOrder?.deliveries.find(d => d.id === this.props.selectedOrder?.routing[this.props.selectedOrder?.routing.length - 1].delivery_id)?.customer?.state || ''
                                                    : ''
                                                : ''
                                        }
                                    </span> <span>
                                        {
                                            (this.props.selectedOrder?.routing || []).length > 0
                                                ? this.props.selectedOrder?.routing[this.props.selectedOrder?.routing.length - 1]?.type === 'delivery'
                                                    ? this.props.selectedOrder?.deliveries.find(d => d.id === this.props.selectedOrder?.routing[this.props.selectedOrder?.routing.length - 1].delivery_id)?.customer?.zip || ''
                                                    : ''
                                                : ''
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* PAGE BLOCK */}
                    <div className="page-block body-table" style={{
                        marginTop: 10,
                        pageBreakBefore: 'auto',
                        display: 'grid',
                        gridTemplateColumns: '1fr',
                        boxShadow: '1px 1px 2px 1px rgba(0,0,0,0.5)'
                    }}>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '0.5fr 1fr 0.5fr',
                            gridGap: 2,
                            minHeight: 26.72,
                            maxHeight: 26.72,
                        }}>
                            <div style={{
                                textAlign: 'center',
                                padding: 3,
                                fontWeight: 'bold',
                                borderRight: '1px solid rgba(0,0,0,0.3)'
                            }}>Item</div>

                            <div style={{
                                textAlign: 'center',
                                padding: 3,
                                fontWeight: 'bold',
                                borderRight: '1px solid rgba(0,0,0,0.3)'
                            }}>Description</div>

                            <div style={{
                                textAlign: 'center',
                                padding: 3,
                                fontWeight: 'bold'
                            }}>Amount</div>
                        </div>

                        {
                            (this.props.selectedOrder?.routing || []).map((route, index) => {
                                return (
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: '0.5fr 1fr 0.5fr',
                                        gridGap: 2,
                                        minHeight: 26.72,
                                    }} key={index}>
                                        <div style={{
                                            // backgroundColor: 'rgba(0,0,0,0.1)',
                                            textAlign: 'left',
                                            padding: 3,
                                            // fontWeight: 'bold',
                                            borderRight: '1px solid rgba(0,0,0,0.3)'
                                        }}>
                                            {
                                                route.type === 'pickup'
                                                    ? 'Pick Up'
                                                    : route.type === 'delivery'
                                                        ? 'Delivery'
                                                        : ''
                                            }
                                        </div>

                                        <div style={{
                                            // backgroundColor: 'rgba(0,0,0,0.1)',
                                            textAlign: 'left',
                                            padding: 3,
                                            // fontWeight: 'bold',
                                            borderRight: '1px solid rgba(0,0,0,0.3)'
                                        }}>
                                            {
                                                route.type === 'pickup'
                                                    ? <div><span>{(this.props.selectedOrder?.pickups || []).find(p => p.id === route.pickup_id)?.customer?.name}</span> - <span>
                                                        {(this.props.selectedOrder?.pickups || []).find(p => p.id === route.pickup_id)?.customer?.city}
                                                    </span>, <span>
                                                            {(this.props.selectedOrder?.pickups || []).find(p => p.id === route.pickup_id)?.customer?.state}
                                                        </span></div>
                                                    : route.type === 'delivery'
                                                        ? <div><span>{(this.props.selectedOrder?.deliveries || []).find(d => d.id === route.delivery_id)?.customer?.name}</span> - <span>
                                                            {(this.props.selectedOrder?.deliveries || []).find(d => d.id === route.delivery_id)?.customer?.city}
                                                        </span>, <span>
                                                                {(this.props.selectedOrder?.deliveries || []).find(d => d.id === route.delivery_id)?.customer?.state}
                                                            </span></div>
                                                        : ''
                                            }
                                        </div>

                                        <div style={{
                                            // backgroundColor: 'rgba(0,0,0,0.1)',
                                            textAlign: 'left',
                                            padding: 3,
                                            // fontWeight: 'bold'
                                        }}></div>
                                    </div>
                                )
                            })
                        }

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '0.5fr 1fr 0.5fr',
                            gridGap: 2,
                            minHeight: 26.72,
                        }}>
                            <div style={{
                                // backgroundColor: 'rgba(0,0,0,0.1)',
                                textAlign: 'center',
                                padding: 3,
                                fontWeight: 'bold',
                                borderRight: '1px solid rgba(0,0,0,0.3)'
                            }}></div>

                            <div style={{
                                // backgroundColor: 'rgba(0,0,0,0.1)',
                                textAlign: 'center',
                                padding: 3,
                                fontWeight: 'bold',
                                borderRight: '1px solid rgba(0,0,0,0.3)'
                            }}></div>

                            <div style={{
                                // backgroundColor: 'rgba(0,0,0,0.1)',
                                textAlign: 'center',
                                padding: 3,
                                fontWeight: 'bold'
                            }}></div>
                        </div>

                        {
                            (this.props.selectedOrder?.order_customer_ratings || []).map((rating, index) => {
                                return (
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: '0.5fr 1fr 0.5fr',
                                        gridGap: 2,
                                        minHeight: 26.72,
                                    }} key={index}>
                                        <div style={{
                                            // backgroundColor: 'rgba(0,0,0,0.1)',
                                            textAlign: 'left',
                                            padding: 3,
                                            // fontWeight: 'bold',
                                            borderRight: '1px solid rgba(0,0,0,0.3)'
                                        }}>
                                            {
                                                (rating.rate_type?.name || '').toLowerCase() === 'comment' ? '' : (rating.rate_type?.name || '')
                                            }
                                        </div>

                                        <div style={{
                                            // backgroundColor: 'rgba(0,0,0,0.1)',
                                            textAlign: 'left',
                                            padding: 3,
                                            // fontWeight: 'bold',
                                            borderRight: '1px solid rgba(0,0,0,0.3)'
                                        }}>
                                            {
                                                rating.description || ''
                                            }
                                        </div>

                                        <div style={{
                                            // backgroundColor: 'rgba(0,0,0,0.1)',
                                            textAlign: 'right',
                                            padding: 3,
                                            // fontWeight: 'bold'
                                        }}>
                                            {
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
                                            }
                                        </div>
                                    </div>
                                )
                            })
                        }

                        {
                            fillRows.map((row, index) => {
                                return (
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: '0.5fr 1fr 0.5fr',
                                        gridGap: 2,
                                        minHeight: 26.72,
                                    }} key={index}>
                                        <div style={{
                                            // backgroundColor: 'rgba(0,0,0,0.1)',
                                            textAlign: 'center',
                                            padding: 3,
                                            fontWeight: 'bold',
                                            borderRight: '1px solid rgba(0,0,0,0.3)'
                                        }}></div>

                                        <div style={{
                                            // backgroundColor: 'rgba(0,0,0,0.1)',
                                            textAlign: 'center',
                                            padding: 3,
                                            fontWeight: 'bold',
                                            borderRight: '1px solid rgba(0,0,0,0.3)'
                                        }}></div>

                                        <div style={{
                                            // backgroundColor: 'rgba(0,0,0,0.1)',
                                            textAlign: 'center',
                                            padding: 3,
                                            fontWeight: 'bold'
                                        }}></div>
                                    </div>
                                )
                            })
                        }
                    </div>

                    {/* PAGE BLOCK */}
                    <div className="page-block" style={{
                        pageBreakBefore: 'auto',
                        display: 'grid',
                        gridTemplateColumns: '1.5fr 0.5fr',
                        boxShadow: '1px 1px 2px 1px rgba(0,0,0,0.5)',
                        marginTop: 10,
                        marginBottom: 40
                    }}>
                        <div style={{
                            backgroundColor: 'rgba(0,0,0,0.1)',
                            textAlign: 'right',
                            padding: 3,
                            fontWeight: 'bold',
                        }}>TOTAL </div>

                        <div style={{
                            // backgroundColor: 'rgba(0,0,0,0.1)',
                            textAlign: 'right',
                            padding: 3,
                            fontWeight: 'bold'
                        }}>
                            {
                                <NumberFormat
                                    value={
                                        ((this.props.selectedOrder?.order_customer_ratings || []).reduce((a, b) => {
                                            return { total_charges: Number(a.total_charges) + Number(b.total_charges) }
                                        }, { total_charges: '' })?.total_charges || '').toString().replace(',', '')
                                    }
                                    thousandsGroupStyle="thousand"
                                    thousandSeparator={true}
                                    decimalScale={2}
                                    fixedDecimalScale={true}
                                    prefix={'$ '}
                                    type="text"
                                    displayType={'text'}
                                />
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

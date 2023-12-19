import React, { Component } from 'react';
import moment from 'moment';
import './ToPrint.css';
import NumberFormat from 'react-number-format';
import classnames from 'classnames';

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

                <div className="container-sheet order-history" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'start'
                    // gridTemplateRows: 'auto auto 1fr auto'
                }}>

                    <div className="page-block" style={{ textAlign: 'center', fontSize: '1.2rem', paddingBottom: '1.5rem' }}>
                        Order History
                    </div>

                    <div className='page-block header-title' style={{ display: 'flex' }}>
                        <div className='order-info date' style={{
                            width: 'calc(100% / 6)',
                            fontWeight: 'bold',
                            fontSize: '0.9rem',
                            paddingBottom: '0.3rem',
                            textAlign: 'center'
                        }}>Order Date</div>
                        <div className='order-info order-number' style={{
                            width: 'calc(100% / 6)',
                            fontWeight: 'bold',
                            fontSize: '0.9rem',
                            paddingBottom: '0.3rem',
                            textAlign: 'center'
                        }}>Order Number</div>
                        <div className='order-info customer-charges' style={{
                            width: 'calc(100% / 6)',
                            fontWeight: 'bold',
                            fontSize: '0.9rem',
                            paddingBottom: '0.3rem',
                            textAlign: 'center'
                        }}>Customer Charges</div>
                        <div className='order-info carrier-costs' style={{
                            width: 'calc(100% / 6)',
                            fontWeight: 'bold',
                            fontSize: '0.9rem',
                            paddingBottom: '0.3rem',
                            textAlign: 'center'
                        }}>Carrier Costs</div>
                        <div className='order-info profit' style={{
                            width: 'calc(100% / 6)',
                            fontWeight: 'bold',
                            fontSize: '0.9rem',
                            paddingBottom: '0.3rem',
                            textAlign: 'center'
                        }}>Profit</div>
                        <div className='order-info percentage' style={{
                            width: 'calc(100% / 6)',
                            fontWeight: 'bold',
                            fontSize: '0.9rem',
                            paddingBottom: '0.3rem',
                            textAlign: 'center'
                        }}>Percentage</div>
                    </div>

                    {
                        (this.props.orders || []).map((item1, index1) => {
                            const { months } = item1;
                            return (
                                <div className='year-container' key={index1}>
                                    <div className="year-info" style={{
                                        padding: '0.25rem 0.7rem',
                                        borderTop: '2px solid rgba(0,0,0,0.7)',
                                        borderBottom: '2px solid rgba(0,0,0,0.7)',
                                        fontWeight: 'bold',
                                        backgroundColor: 'rgba(0,0,0,0.2)'
                                    }}>
                                        <span>{item1.year || ''}</span>
                                    </div>

                                    {
                                        (months || []).map((item3, index3) => {
                                            const { orders } = item3;

                                            return (
                                                <div className='month-container' key={index3}>
                                                    <div className="page-block month-info" style={{
                                                        padding: '0.25rem 0.7rem',
                                                        borderTop: '2px solid rgba(0,0,0,0.7)',
                                                        borderBottom: '2px solid rgba(0,0,0,0.7)',
                                                        textAlign: 'center',
                                                        fontWeight: 'bold',
                                                        backgroundColor: 'rgba(0,0,0,0.1)'
                                                    }}>
                                                        <span>{item3.month || ''}</span>
                                                    </div>

                                                    {
                                                        (orders || []).map((order, index4) => {
                                                            return (
                                                                <div className='page-block order-container' key={index4} style={{
                                                                    display: 'flex',
                                                                    flexDirection: 'column',
                                                                    borderTop: '1px solid rgba(0,0,0,0.1)',
                                                                    borderBottom: '1px solid rgba(0,0,0,0.1)',
                                                                }}>
                                                                    <div className="order-info-origin" style={{
                                                                        backgroundColor: 'rgba(0,0,0,0.05)',
                                                                        display: 'flex',
                                                                        justifyContent: 'center',
                                                                        gap: 10,
                                                                        fontSize: '0.65rem'
                                                                    }}>
                                                                        {
                                                                            order.isOnBillTo &&
                                                                            <div>Bill To</div>
                                                                        }
                                                                        {
                                                                            order.isOnShipper &&
                                                                            <div>Shipper</div>
                                                                        }
                                                                        {
                                                                            order.isOnConsignee &&
                                                                            <div>Consignee</div>
                                                                        }
                                                                    </div>
                                                                    <div className="order-info-row" style={{
                                                                        display: 'flex',
                                                                        padding: '0.2rem 0rem'
                                                                    }}>
                                                                        <div className='order-info date' style={{
                                                                            width: 'calc(100% / 6)',
                                                                            textAlign: 'center'
                                                                        }}>
                                                                            {moment(order.order_date_time, 'YYYY-MM-DD HH:mm:ss').format('MM/DD/YYYY')}
                                                                        </div>

                                                                        <div className='order-info order-number' style={{
                                                                            width: 'calc(100% / 6)',
                                                                            textAlign: 'center'
                                                                        }}>
                                                                            {order.order_number}
                                                                        </div>

                                                                        <div className='order-info customer-charges' style={{
                                                                            width: 'calc(100% / 6)',
                                                                            textAlign: 'center'
                                                                        }}>
                                                                            <NumberFormat
                                                                                className={classnames({
                                                                                    'negative-number': order.total_customer_rating < 0
                                                                                })}
                                                                                value={order.total_customer_rating}
                                                                                thousandsGroupStyle="thousand"
                                                                                thousandSeparator={true}
                                                                                decimalScale={2}
                                                                                fixedDecimalScale={true}
                                                                                prefix={'$'}
                                                                                type="text"
                                                                                displayType={'text'}
                                                                                readOnly={true}
                                                                            />
                                                                        </div>

                                                                        <div className='order-info carrier-costs' style={{
                                                                            width: 'calc(100% / 6)',
                                                                            textAlign: 'center'
                                                                        }}>
                                                                            <NumberFormat
                                                                                className={classnames({
                                                                                    'negative-number': order.total_carrier_rating < 0
                                                                                })}
                                                                                value={order.total_carrier_rating}
                                                                                thousandsGroupStyle="thousand"
                                                                                thousandSeparator={true}
                                                                                decimalScale={2}
                                                                                fixedDecimalScale={true}
                                                                                prefix={'$'}
                                                                                type="text"
                                                                                displayType={'text'}
                                                                                readOnly={true}
                                                                            />
                                                                        </div>

                                                                        <div className='order-info profit' style={{
                                                                            width: 'calc(100% / 6)',
                                                                            textAlign: 'center'
                                                                        }}>
                                                                            <NumberFormat
                                                                                className={classnames({
                                                                                    'negative-number': (order.total_customer_rating - order.total_carrier_rating) < 0
                                                                                })}
                                                                                value={(order.total_customer_rating - order.total_carrier_rating)}
                                                                                thousandsGroupStyle="thousand"
                                                                                thousandSeparator={true}
                                                                                decimalScale={2}
                                                                                fixedDecimalScale={true}
                                                                                prefix={'$'}
                                                                                type="text"
                                                                                displayType={'text'}
                                                                                readOnly={true}
                                                                            />
                                                                        </div>

                                                                        <div className='order-info percentage' style={{
                                                                            width: 'calc(100% / 6)',
                                                                            textAlign: 'center'
                                                                        }}>
                                                                            <NumberFormat
                                                                                className={classnames({
                                                                                    'negative-number': (
                                                                                        (order.total_customer_rating > 0 || order.total_carrier_rating > 0)
                                                                                            ?
                                                                                            ((order.total_customer_rating - order.total_carrier_rating) * 100)
                                                                                            /
                                                                                            (
                                                                                                order.total_customer_rating > 0
                                                                                                    ? order.total_customer_rating
                                                                                                    : order.total_carrier_rating
                                                                                            )
                                                                                            : 0) < 0
                                                                                })}
                                                                                value={
                                                                                    (
                                                                                        (order.total_customer_rating > 0 || order.total_carrier_rating > 0)
                                                                                            ?
                                                                                            ((order.total_customer_rating - order.total_carrier_rating) * 100)
                                                                                            /
                                                                                            (
                                                                                                order.total_customer_rating > 0
                                                                                                    ? order.total_customer_rating
                                                                                                    : order.total_carrier_rating
                                                                                            )
                                                                                            : 0)
                                                                                }
                                                                                thousandsGroupStyle="thousand"
                                                                                thousandSeparator={true}
                                                                                decimalScale={2}
                                                                                fixedDecimalScale={true}
                                                                                prefix={''}
                                                                                suffix={'%'}
                                                                                type="text"
                                                                                displayType={'text'}
                                                                                readOnly={true}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            )
                        })
                    }

                    {
                        (this.props.orders || []).length > 0 &&
                        <div className='page-block footer-title' style={{
                            display: 'flex',
                            padding: '0.2rem 0rem',
                            borderTop: '2px solid rgba(0,0,0,0.7)',
                            borderBottom: '2px solid rgba(0,0,0,0.7)',
                        }}>
                            <div className='order-info date' style={{
                                width: 'calc(100% / 6)',
                                textAlign: 'center',
                                fontWeight: 'bold',
                                fontSize: '0.9rem'
                            }}>Totals</div>
                            <div className='order-info order-number' style={{
                                width: 'calc(100% / 6)',
                                textAlign: 'center',
                                fontWeight: 'bold',
                                fontSize: '0.9rem'
                            }}>
                                <span style={{
                                    fontWeight: 'bold',
                                    color: 'rgba(0, 0, 0, 0.7)',
                                    marginRight: 10
                                }}>Orders:</span>
                                {
                                    this.props.orders.reduce((a, b) => {
                                        return a + b.totals.orderCount
                                    }, 0)
                                }
                            </div>
                            <div className='order-info customer-charges' style={{
                                width: 'calc(100% / 6)',
                                textAlign: 'center',
                                fontWeight: 'bold',
                                fontSize: '0.9rem'
                            }}>
                                <NumberFormat
                                    className={classnames({
                                        'negative-number': (this.props.orders.reduce((a, b) => {
                                            return a + b.totals.customerCharges
                                        }, 0)) < 0
                                    })}
                                    value={
                                        new Intl.NumberFormat('en-US', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        }).format(
                                            this.props.orders.reduce((a, b) => {
                                                return a + b.totals.customerCharges
                                            }, 0)
                                        )
                                    }
                                    thousandsGroupStyle="thousand"
                                    thousandSeparator={true}
                                    decimalScale={2}
                                    fixedDecimalScale={true}
                                    prefix={'$'}
                                    type="text"
                                    onValueChange={(values) => {
                                    }}
                                    displayType={'text'}
                                    readOnly={true}
                                />
                            </div>
                            <div className='order-info carrier-costs' style={{
                                width: 'calc(100% / 6)',
                                textAlign: 'center',
                                fontWeight: 'bold',
                                fontSize: '0.9rem'
                            }}>
                                <NumberFormat
                                    className={classnames({
                                        'negative-number': (this.props.orders.reduce((a, b) => {
                                            return a + b.totals.carrierCosts
                                        }, 0)) < 0
                                    })}
                                    value={
                                        new Intl.NumberFormat('en-US', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        }).format(
                                            this.props.orders.reduce((a, b) => {
                                                return a + b.totals.carrierCosts
                                            }, 0)
                                        )
                                    }
                                    thousandsGroupStyle="thousand"
                                    thousandSeparator={true}
                                    decimalScale={2}
                                    fixedDecimalScale={true}
                                    prefix={'$'}
                                    type="text"
                                    onValueChange={(values) => {
                                    }}
                                    displayType={'text'}
                                    readOnly={true}
                                />
                            </div>
                            <div className='order-info profit' style={{
                                width: 'calc(100% / 6)',
                                textAlign: 'center',
                                fontWeight: 'bold',
                                fontSize: '0.9rem'
                            }}>
                                <NumberFormat
                                    className={classnames({
                                        'negative-number': (this.props.orders.reduce((a, b) => {
                                            return a + b.totals.customerCharges
                                        }, 0) - this.props.orders.reduce((a, b) => {
                                            return a + b.totals.carrierCosts
                                        }, 0)) < 0
                                    })}
                                    value={
                                        new Intl.NumberFormat('en-US', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        }).format(
                                            this.props.orders.reduce((a, b) => {
                                                return a + b.totals.customerCharges
                                            }, 0) - this.props.orders.reduce((a, b) => {
                                                return a + b.totals.carrierCosts
                                            }, 0)
                                        )
                                    }
                                    thousandsGroupStyle="thousand"
                                    thousandSeparator={true}
                                    decimalScale={2}
                                    fixedDecimalScale={true}
                                    prefix={'$'}
                                    type="text"
                                    onValueChange={(values) => {
                                    }}
                                    displayType={'text'}
                                    readOnly={true}
                                />
                            </div>
                            <div className='order-info percentage' style={{
                                width: 'calc(100% / 6)',
                                textAlign: 'center',
                                fontWeight: 'bold',
                                fontSize: '0.9rem'
                            }}>
                                <NumberFormat
                                    className={classnames({
                                        'negative-number': (
                                            (this.props.orders.reduce((a, b) => {
                                                return a + b.totals.customerCharges
                                            }, 0) > 0 || this.props.orders.reduce((a, b) => {
                                                return a + b.totals.carrierCosts
                                            }, 0) > 0)
                                                ? ((this.props.orders.reduce((a, b) => {
                                                    return a + b.totals.customerCharges
                                                }, 0) - this.props.orders.reduce((a, b) => {
                                                    return a + b.totals.carrierCosts
                                                }, 0)) * 100)
                                                /
                                                (
                                                    this.props.orders.reduce((a, b) => {
                                                        return a + b.totals.customerCharges
                                                    }, 0) > 0
                                                        ? this.props.orders.reduce((a, b) => {
                                                            return a + b.totals.customerCharges
                                                        }, 0)
                                                        : this.props.orders.reduce((a, b) => {
                                                            return a + b.totals.carrierCosts
                                                        }, 0)
                                                )
                                                : 0
                                        ) < 0
                                    })}
                                    value={
                                        (this.props.orders.reduce((a, b) => {
                                            return a + b.totals.customerCharges
                                        }, 0) > 0 || this.props.orders.reduce((a, b) => {
                                            return a + b.totals.carrierCosts
                                        }, 0) > 0)
                                            ? ((this.props.orders.reduce((a, b) => {
                                                return a + b.totals.customerCharges
                                            }, 0) - this.props.orders.reduce((a, b) => {
                                                return a + b.totals.carrierCosts
                                            }, 0)) * 100)
                                            /
                                            (
                                                this.props.orders.reduce((a, b) => {
                                                    return a + b.totals.customerCharges
                                                }, 0) > 0
                                                    ? this.props.orders.reduce((a, b) => {
                                                        return a + b.totals.customerCharges
                                                    }, 0)
                                                    : this.props.orders.reduce((a, b) => {
                                                        return a + b.totals.carrierCosts
                                                    }, 0)
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
                            </div>
                        </div>
                    }
                </div>
            </div>
        )
    }
}

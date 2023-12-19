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

                <div className="container-sheet" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'start'
                    // gridTemplateRows: 'auto auto 1fr auto'
                }}>
                    <div className="page-block" style={{ textAlign: 'center', fontSize: '1.2rem', paddingBottom: '1.5rem' }}>
                        Revenue Information
                    </div>

                    <div className='page-block header-title'>
                        <div className='order-info date'>Order Date</div>
                        <div className='order-info order-number'>Order Number</div>
                        <div className='order-info customer-charges'>Customer Charges</div>
                        <div className='order-info carrier-costs'>Carrier Costs</div>
                        <div className='order-info profit'>Profit</div>
                        <div className='order-info percentage'>Percentage</div>
                    </div>
                    {
                        (this.props.orders || []).map((item1, index1) => {
                            const { id, code, code_number, name, city, state } = item1.billToCustomer;
                            const { dateGroup } = item1;

                            return (
                                <div className="customer-container" key={index1}>
                                    <div className="page-block customer info" style={{ backgroundColor: 'rgba(0,0,0,0.1)', padding: '0.3rem 0.7rem', display: 'flex', gap: 10 }}>
                                        <span>Bill To:</span>
                                        <span style={{ fontWeight: 'bold' }}>{code}{(code_number || 0) === 0 ? '' : code_number}</span>-
                                        <span style={{ fontWeight: 'bold' }}>{name}</span>-
                                        <span style={{ fontWeight: 'bold' }}>{city}, {state}</span>
                                    </div>

                                    {
                                        (dateGroup || []).map((item2, index2) => {
                                            const { months } = item2;
                                            return (
                                                <div className='year-container' key={index2}>
                                                    <div className="page-block year-info" style={{
                                                        padding: '0.25rem 0.7rem',
                                                        borderTop: '2px solid rgba(0,0,0,0.7)',
                                                        borderBottom: '2px solid rgba(0,0,0,0.7)',
                                                        fontWeight: 'bold'
                                                    }}>
                                                        <span>{item2.year || ''}</span>
                                                    </div>

                                                    {
                                                        (months || []).map((item3, index3) => {
                                                            const { orders } = item3;

                                                            return (
                                                                <div className='page-block month-container' key={index3}>
                                                                    <div className="month-info" style={{
                                                                        padding: '0.25rem 0.7rem',
                                                                        borderTop: '2px solid rgba(0,0,0,0.7)',
                                                                        borderBottom: '2px solid rgba(0,0,0,0.7)',
                                                                        textAlign: 'center',
                                                                        fontWeight: 'bold'
                                                                    }}>
                                                                        <span>{item3.month || ''}</span>
                                                                    </div>

                                                                    {
                                                                        (orders || []).map((order, index4) => {
                                                                            return (
                                                                                <div className='order-container' key={index4}>
                                                                                    <div className='page-block order-info date'>
                                                                                        {moment(order.order_date_time, 'YYYY-MM-DD HH:mm:ss').format('MM/DD/YYYY')}
                                                                                    </div>

                                                                                    <div className='order-info order-number'>
                                                                                        {order.order_number}
                                                                                    </div>

                                                                                    <div className='order-info customer-charges'>
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

                                                                                    <div className='order-info carrier-costs'>
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

                                                                                    <div className='order-info profit'>
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

                                                                                    <div className='order-info percentage'>
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
                                </div>
                            )
                        })
                    }

                    {
                        (this.props.orders || []).length > 0 &&
                        <div className='page-block footer-title'>
                            <div className='order-info date'>Totals</div>
                            <div className='order-info order-number'>
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
                            <div className='order-info customer-charges'>
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
                            <div className='order-info carrier-costs'>
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
                            <div className='order-info profit'>
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
                            <div className='order-info percentage'>
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
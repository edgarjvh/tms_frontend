import React, { Component } from "react";
import moment from "moment";
import "./CarrierConfirmation.css";
import NumberFormat from "react-number-format";
import QRCode from 'react-qr-code';

export default class CarrierConfirmation extends Component {
    constructor(props) {
        super(props);
    }

    styleFlexRow = {
        display: "flex", flexDirection: "row",
    };
    styleFlexCol = {
        display: "flex", flexDirection: "column",
    };
    styleFieldName = {
        color: "black", fontWeight: "bold", fontSize: "0.9rem", fontStyle: "normal",
    };
    styleFieldData = {
        color: "red", fontSize: "0.9rem", fontStyle: "italic",
    };
    styleTitleBackground = {
        backgroundColor: "lightgray",
    };
    styleFieldDataBold = {
        color: "red", fontWeight: "bold", fontSize: "0.9rem",
    };

    render() {
        return (<div
            className="content-page"
            style={{
                minWidth: "245.5mm",
                maxWidth: "245.5mm",
                display: "block",
                fontSize: "0.9rem", //   fontFamily: "Lato",
                //   fontStyle: "italic",
            }}
        >
            {/* <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Play:wght@400;700&display=swap"
          rel="stylesheet"
        /> */}

            <div className="container-sheet">
                {/* CANCELLED WATERMARK */}
                {
                    (this.props.selected_order?.is_cancelled || 0) === 1 &&
                    <div className='watermark-container'>
                        <p>CANCELLED</p>
                    </div>
                }

                {/* PAGE BLOCK */}
                <div className="page-block" style={{ paddingTop: "2rem", position: 'relative' }}>
                    <div
                        style={{
                            ...this.styleFlexRow,
                        }}
                    >
                        <span style={{ ...this.styleFieldName, marginRight: 10 }}>
                            DATE AND TIME SENT:
                        </span>{" "}
                        <span style={{ ...this.styleFieldDataBold }}>
                            {moment().format("MM/DD/YYYY")} @ {moment().format("HHmm")}
                        </span>
                    </div>
                    <div
                        style={{
                            ...this.styleFlexRow,
                        }}
                    >
                        <span style={{ ...this.styleFieldName, marginRight: 10 }}>
                            ATTN:
                        </span>{" "}
                        <span style={{ ...this.styleFieldDataBold }}>
                            {this.props.selectedCarrierInfoContact?.first_name || ""}{" "}
                            {this.props.selectedCarrierInfoContact?.last_name || ""}
                        </span>
                    </div>
                    <div
                        style={{
                            ...this.styleFlexRow, marginBottom: "1.5rem",
                        }}
                    >
                        <span style={{ ...this.styleFieldName, marginRight: 10 }}>
                            E-mail:
                        </span>{" "}
                        <span style={{ ...this.styleFieldDataBold }}>
                            {(this.props.selectedCarrierInfoContact?.primary_email || "work") === "work" ? this.props.selectedCarrierInfoContact?.email_work || "" : (this.props.selectedCarrierInfoContact?.primary_email || "work") === "personal" ? this.props.selectedCarrierInfoContact?.email_personal || "" : (this.props.selectedCarrierInfoContact?.primary_email || "work") === "other" ? this.props.selectedCarrierInfoContact?.email_other || "" : ""}
                        </span>
                    </div>

                    <div
                        style={{
                            ...this.styleFieldName, textAlign: "center", fontSize: "1rem", // fontFamily: "Play",
                            // fontWeight: "bold",
                        }}
                    >
                        LOAD CONFIRMATION AND RATE AGREEMENT
                    </div>

                    {
                        !this.props.isLoading &&
                        <div style={{
                            position: "absolute",
                            right: 0,
                            top: 50
                        }}>
                            <QRCode value={
                                `Order Number: ${(this.props.selected_order?.order_number || '')}\nCarrier Assigned: ${(this.props.selectedCarrierInfo?.name || '')}\nPay Rate: ${new Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency: 'USD'
                                }).format(Number(((this.props.selected_order?.order_carrier_ratings || []).reduce((a, b) => {
                                    return {
                                        total_charges: Number(a.total_charges) + Number(b.total_charges),
                                    };
                                }, { total_charges: "" })?.total_charges || "")
                                    .toString()
                                    .replace(",", "")))}`} size={100} />
                        </div>
                    }

                </div>

                {/* PAGE BLOCK */}
                <div className="page-block" style={{ paddingTop: "2rem" }}>
                    <div
                        style={{
                            ...this.styleFlexRow,
                        }}
                    >
                        <span style={{ ...this.styleFieldName, marginRight: 10 }}>
                            Order Number:
                        </span>{" "}
                        <span style={{ ...this.styleFieldDataBold }}>
                            {this.props.selected_order?.order_number}
                        </span>
                    </div>
                    <div
                        style={{
                            ...this.styleFlexRow, marginBottom: "1.5rem",
                        }}
                    >
                        <span style={{ ...this.styleFieldName, marginRight: 10 }}>
                            Total Payment to the Carrier – Inclusive of all Accessorial
                            charges:
                        </span>
                        <NumberFormat
                            style={{ ...this.styleFieldDataBold, color: "#4682B4" }}
                            value={Number(((this.props.selected_order?.order_carrier_ratings || []).reduce((a, b) => {
                                return {
                                    total_charges: Number(a.total_charges) + Number(b.total_charges),
                                };
                            }, { total_charges: "" })?.total_charges || "")
                                .toString()
                                .replace(",", ""))}
                            thousandsGroupStyle="thousand"
                            thousandSeparator={true}
                            decimalScale={2}
                            fixedDecimalScale={true}
                            prefix={"$ "}
                            type="text"
                            displayType={"text"}
                        />
                    </div>

                    <div
                        style={{
                            ...this.styleFieldName, fontWeight: "normal", fontStyle: "italic",
                        }}
                    >
                        This rate confirmation sheet issued on{" "}
                        <span style={{ ...this.styleFieldDataBold }}>
                            {moment().format("MM/DD/YYYY")}
                        </span>{" "}
                        serves to supplement the Master Brokerage Agreement between{" "}
                        <span style={{ ...this.styleFieldDataBold }}>
                            {(this.props.selectedCompany?.name || '')}
                        </span>
                        , an ICC Property Broker (MC{" "}
                        <span style={{ ...this.styleFieldData }}>780648</span>) and:{" "}
                        <span style={{ ...this.styleFieldDataBold }}>
                            {this.props.selectedCarrierInfo?.name}
                        </span>{" "}
                        a Permitted Carrier (MC{" "}
                        <span style={{ ...this.styleFieldData }}>
                            {this.props.selectedCarrierInfo?.mc_number}
                        </span>
                        ), do hereby agree to enter into a mutual agreement on the
                        following load.
                    </div>
                </div>

                {(this.props.selected_order?.routing || []).map((route, index) => {
                    let pickup = route.type === "pickup" ? (this.props.selected_order?.pickups || []).find((p) => p.id === route.pickup_id) : {};
                    let delivery = route.type === "delivery" ? (this.props.selected_order?.deliveries || []).find((d) => d.id === route.delivery_id) : {};
                    let customer = route.type === "pickup" ? pickup.customer : delivery.customer;

                    return (// PAGE BLOCK
                        <div
                            key={index}
                            className="page-block"
                            style={{ paddingTop: "2rem" }}
                        >
                            <div
                                style={{
                                    ...this.styleFlexRow, display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
                                }}
                            >
                                <div
                                    style={{
                                        ...this.styleFlexCol, minWidth: "16rem",
                                    }}
                                >
                                    <div style={{ ...this.styleFieldName }}>
                                        {route.type === "pickup" ? "Pick-Up" : "Delivery"}{" "}
                                        Information
                                    </div>
                                    <div style={{ ...this.styleFieldData }}>
                                        {customer.name} <br />
                                        {customer.address1} <br />
                                        {customer.city}, {customer.state} {customer.zip}
                                    </div>
                                </div>

                                <div
                                    style={{
                                        ...this.styleFlexCol, minWidth: "16rem",
                                    }}
                                >
                                    <div style={{ ...this.styleFlexRow }}>
                                        <div style={{ ...this.styleFieldName, width: "6rem" }}>
                                            Earliest Time:
                                        </div>
                                        <div style={{ ...this.styleFieldData }}>
                                            {route.type === "pickup" ? pickup.pu_date1 || "" : delivery.delivery_date1 || ""}{" "}
                                            @{" "}
                                            {route.type === "pickup" ? pickup.pu_time1 || "" : delivery.delivery_time1 || ""}
                                        </div>
                                    </div>
                                    <div style={{ ...this.styleFlexRow }}>
                                        <div style={{ ...this.styleFieldName, width: "6rem" }}>
                                            Latest Time:
                                        </div>
                                        <div style={{ ...this.styleFieldData }}>
                                            {route.type === "pickup" ? pickup.pu_date2 || "" : delivery.delivery_date2 || ""}{" "}
                                            @{" "}
                                            {route.type === "pickup" ? pickup.pu_time2 || "" : delivery.delivery_time2 || ""}
                                        </div>
                                    </div>
                                    <div style={{ ...this.styleFlexRow }}>
                                        <div style={{ ...this.styleFieldName, width: "6rem" }}>
                                            Phone:
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
                                                            : (customer?.contact_phone || '')
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
                                                                : (customer?.contact_phone || '')
                                                        : ''

                                            }
                                        </div>
                                    </div>
                                    <div style={{ ...this.styleFlexRow }}>
                                        <div style={{ ...this.styleFieldName, width: "6rem" }}>
                                            Contact:
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

                                <div
                                    style={{
                                        ...this.styleFlexCol, minWidth: "16rem",
                                    }}
                                >
                                    {route.type === "pickup" && (<div style={{ ...this.styleFlexRow }}>
                                        <div
                                            style={{ ...this.styleFieldName, width: "6.5rem" }}
                                        >
                                            BOL Numbers:
                                        </div>
                                        <div style={{ ...this.styleFieldData }}>
                                            {(pickup.bol_numbers || '').split('|').map((item, index) => {
                                                return (<span style={{ color: index % 2 === 0 ? 'red' : 'darkred' }}>{item} </span>)
                                            })}
                                        </div>
                                    </div>)}

                                    {route.type === "pickup" && (<div style={{ ...this.styleFlexRow }}>
                                        <div
                                            style={{ ...this.styleFieldName, width: "6.5rem" }}
                                        >
                                            PO Numbers:
                                        </div>
                                        <div style={{ ...this.styleFieldData }}>
                                            {(pickup.po_numbers || '').split('|').map((item, index) => {
                                                return (<span style={{ color: index % 2 === 0 ? 'red' : 'darkred' }}>{item} </span>)
                                            })}
                                        </div>
                                    </div>)}

                                    {route.type === "pickup" && (<div style={{ ...this.styleFlexRow }}>
                                        <div
                                            style={{ ...this.styleFieldName, width: "6.5rem" }}
                                        >
                                            REF Numbers:
                                        </div>
                                        <div style={{ ...this.styleFieldData }}>
                                            {(pickup.ref_numbers || '').split('|').map((item, index) => {
                                                return (<span style={{ color: index % 2 === 0 ? 'red' : 'darkred' }}>{item} </span>)
                                            })}
                                        </div>
                                    </div>)}

                                    {route.type === "pickup" && (<div style={{ ...this.styleFlexRow }}>
                                        <div
                                            style={{ ...this.styleFieldName, width: "6.5rem" }}
                                        >
                                            SEAL Number:
                                        </div>
                                        <div style={{ ...this.styleFieldData }}>
                                            {pickup.seal_number}
                                        </div>
                                    </div>)}

                                    {route.type === "delivery" && (<div style={{ ...this.styleFlexRow }}>
                                        <div
                                            style={{ ...this.styleFieldName, width: "6.5rem" }}
                                        >
                                            BOL Numbers:
                                        </div>
                                        <div style={{ ...this.styleFieldData }}>
                                            {(delivery.bol_numbers || '').split('|').map((item, index) => {
                                                return (<span style={{ color: index % 2 === 0 ? 'red' : 'darkred' }}>{item} </span>)
                                            })}
                                        </div>
                                    </div>)}

                                    {route.type === "delivery" && (<div style={{ ...this.styleFlexRow }}>
                                        <div
                                            style={{ ...this.styleFieldName, width: "6.5rem" }}
                                        >
                                            PO Numbers:
                                        </div>
                                        <div style={{ ...this.styleFieldData }}>
                                            {(delivery.po_numbers || '').split('|').map((item, index) => {
                                                return (<span style={{ color: index % 2 === 0 ? 'red' : 'darkred' }}>{item} </span>)
                                            })}
                                        </div>
                                    </div>)}

                                    {route.type === "delivery" && (<div style={{ ...this.styleFlexRow }}>
                                        <div
                                            style={{ ...this.styleFieldName, width: "6.5rem" }}
                                        >
                                            REF Numbers:
                                        </div>
                                        <div style={{ ...this.styleFieldData }}>
                                            {(delivery.ref_numbers || '').split('|').map((item, index) => {
                                                return (<span style={{ color: index % 2 === 0 ? 'red' : 'darkred' }}>{item} </span>)
                                            })}
                                        </div>
                                    </div>)}

                                    {route.type === "delivery" && (<div style={{ ...this.styleFlexRow }}>
                                        <div
                                            style={{ ...this.styleFieldName, width: "6.5rem" }}
                                        >
                                            SEAL Number:
                                        </div>
                                        <div style={{ ...this.styleFieldData }}>
                                            {delivery.seal_number}
                                        </div>
                                    </div>)}
                                </div>
                            </div>
                        </div>);
                })}

                {/* PAGE BLOCK */}
                {((this.props.selected_order?.order_carrier_ratings || []).find((r) => (r.rate_type?.name || "").toLowerCase() === "linehaul") !== undefined || (this.props.selected_order?.order_carrier_ratings || []).find((r) => (r.rate_type?.name || "").toLowerCase() === "flat") !== undefined) && (
                    <div className="page-block" style={{ paddingTop: "2rem" }}>
                        <div
                            style={{
                                ...this.styleFlexCol,
                            }}
                        >
                            <div
                                style={{
                                    display: "grid", gridTemplateColumns: "5rem 8rem 1fr", padding: "0.2rem 0",
                                }}
                            >
                                <div
                                    style={{
                                        ...this.styleFieldName, textDecoration: "underline", textAlign: "center",
                                    }}
                                >
                                    Pieces/Skids
                                </div>
                                <div
                                    style={{
                                        ...this.styleFieldName, textDecoration: "underline", textAlign: "center",
                                    }}
                                >
                                    Weight
                                </div>
                                <div
                                    style={{
                                        ...this.styleFieldName, textDecoration: "underline",
                                    }}
                                >
                                    Description
                                </div>
                            </div>

                            {(this.props.selected_order.order_carrier_ratings || []).map((rating, index) => {
                                if ((rating.rate_type?.name || "").toLowerCase() === "linehaul" || (rating.rate_type?.name || "").toLowerCase() === "flat") {
                                    return (<div
                                        key={index}
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns: "5rem 8rem 1fr",
                                            padding: "0.2rem 0",
                                        }}
                                    >
                                        <div
                                            style={{
                                                ...this.styleFieldData, color: "#4682B4", textAlign: "center",
                                            }}
                                        >
                                            <NumberFormat
                                                value={rating.pieces > 0 ? rating.pieces : ""}
                                                thousandsGroupStyle="thousand"
                                                thousandSeparator={true}
                                                decimalScale={Number.isInteger(rating.pieces) ? 0 : 2}
                                                fixedDecimalScale={true}
                                                prefix={""}
                                                suffix={(rating.pieces_unit || "") === "pc" ? " Pieces" : (rating.pieces_unit || "") === "sk" ? " Skids" : ""}
                                                type="text"
                                                displayType={"text"}
                                            />
                                        </div>
                                        <div
                                            style={{
                                                ...this.styleFieldData, color: "#4682B4", textAlign: "center",
                                            }}
                                        >
                                            <NumberFormat
                                                value={rating.weight > 0 ? rating.weight : ""}
                                                thousandsGroupStyle="thousand"
                                                thousandSeparator={true}
                                                decimalScale={Number.isInteger(rating.weight) ? 0 : 2}
                                                fixedDecimalScale={true}
                                                prefix={""}
                                                type="text"
                                                displayType={"text"}
                                            />
                                        </div>
                                        <div
                                            style={{ ...this.styleFieldData, color: "#4682B4" }}
                                        >
                                            {rating.description}
                                        </div>
                                    </div>);
                                } else {
                                    return "";
                                }
                            })}
                        </div>

                        <div
                            style={{
                                ...this.styleFieldName,
                                textAlign: "left",
                                marginTop: "2rem",
                                textDecoration: "underline",
                            }}
                        >
                            SPECIAL INSTRUCTIONS
                        </div>

                        {(this.props.selected_order?.notes_for_carrier || []).map((note, index) => {
                            return (<div
                                key={index}
                                style={{ ...this.styleFieldData, marginTop: "1rem" }}
                            >
                                {note.text.split(/\r?\n/).map((text, index) => (
                                    <div key={index}>{text.toUpperCase()}</div>))}
                            </div>);
                        })}
                    </div>)}

                {/* PAGE BLOCK */}
                <div
                    className="page-block"
                    style={{ paddingBottom: "1.5rem", paddingTop: "2rem" }}
                >
                    <div
                        style={{
                            ...this.styleFieldName,
                            fontStyle: "italic",
                            fontWeight: "normal",
                            pageBreakInside: "avoid",
                        }}
                    >
                        Carrier agrees that this reflects the entire amount due for all
                        services provided and that no other amount will be billed to{" "}
                        <span style={{ ...this.styleFieldDataBold }}>
                            {(this.props.selectedCompany?.name || '')}
                        </span>
                        . Broker will remit payment to carrier within 30 days of receipt of signed bills
                        of lading and signed delivery receipts, completed W-9
                        forms, signed Master Carrier Agreement, Rate confirmation,
                        Contract Authority, and original certificates of Insurance naming{" "}
                        <span style={{ ...this.styleFieldDataBold }}>
                            {(this.props.selectedCompany?.name || '')}
                        </span>{" "}
                        as certificate holder.
                    </div>

                    <div style={{ ...this.styleFieldData, marginTop: "1.5rem", display: 'flex', flexDirection: "row", gap: 40 }}>
                        <div>
                            <div>
                                <b>
                                    {(this.props.selectedCarrierInfo?.name || "").toUpperCase()}
                                </b>
                            </div>
                            <div>
                                {(this.props.selectedCarrierInfo?.address1 || "").toUpperCase()}{" "}
                            </div>
                            <div>
                                {(this.props.selectedCarrierInfo?.address2 || "").toUpperCase()}
                            </div>
                            <div>
                                {(this.props.selectedCarrierInfo?.city || "").toUpperCase()},{" "}
                                {(this.props.selectedCarrierInfo?.state || "").toUpperCase()}{" "}
                                {this.props.selectedCarrierInfo?.zip || ""}
                            </div>
                        </div>

                        <div style={{ position: 'relative' }}>
                            {
                                !this.props.isLoading &&
                                <div style={{ position: 'absolute', top: '50%', left: '0px', transform: 'translateY(-50%)' }}>
                                    <QRCode value={
                                        `Order Number: ${(this.props.selected_order?.order_number || '')}\nCarrier Assigned: ${(this.props.selectedCarrierInfo?.name || '')}\nPay Rate: ${new Intl.NumberFormat('en-US', {
                                            style: 'currency',
                                            currency: 'USD'
                                        }).format(Number(((this.props.selected_order?.order_carrier_ratings || []).reduce((a, b) => {
                                            return {
                                                total_charges: Number(a.total_charges) + Number(b.total_charges),
                                            };
                                        }, { total_charges: "" })?.total_charges || "")
                                            .toString()
                                            .replace(",", "")))}`} size={100} />
                                </div>
                            }
                        </div>

                    </div>

                    <div
                        style={{
                            ...this.styleFlexRow, width: "20rem", marginTop: "1.5rem",
                        }}
                    >
                        <span style={{ ...this.styleFieldName, marginRight: "0.2rem" }}>
                            By:{" "}
                        </span>
                        <span
                            style={{
                                flexGrow: 1, borderBottom: "1px solid rgba(0,0,0,0.5)",
                            }}
                        ></span>
                    </div>

                    <div
                        style={{
                            ...this.styleFlexRow, width: "20rem", marginTop: "1.5rem",
                        }}
                    >
                        <span style={{ ...this.styleFieldName, marginRight: "0.2rem" }}>
                            Print Name:{" "}
                        </span>
                        <span
                            style={{
                                flexGrow: 1, borderBottom: "1px solid rgba(0,0,0,0.5)",
                            }}
                        ></span>
                    </div>

                    <div
                        style={{
                            ...this.styleFlexRow, marginTop: "1.5rem",
                        }}
                    >
                        <span style={{ ...this.styleFieldName, marginRight: "0.2rem" }}>
                            Date:{" "}
                        </span>
                        <span style={{ ...this.styleFieldData }}>
                            {moment().format("MM/DD/YYYY")} @ {moment().format("HHmm")}
                        </span>
                    </div>
                </div>
            </div>

            <div className="no-print" style={{ height: "2rem" }}></div>

            <div className="container-sheet" style={{ pageBreakBefore: 'always' }}>
                {/* CANCELLED WATERMARK */}
                {
                    (this.props.selected_order?.is_cancelled || 0) === 1 &&
                    <div className='watermark-container'>
                        <p>CANCELLED</p>
                    </div>
                }
                {/* PAGE BLOCK */}
                <div
                    className="page-block"
                    style={{ paddingTop: "2rem", pageBreakBefore: "always" }}
                >
                    <div
                        style={{
                            ...this.styleFieldName, textAlign: "center", fontSize: "1rem", // fontFamily: "Play",
                            // fontWeight: "bold",
                        }}
                    >
                        DRIVER INFORMATION SHEET
                    </div>
                </div>

                {(this.props.selected_order?.routing || []).map((route, index) => {
                    let pickup = route.type === "pickup" ? (this.props.selected_order?.pickups || []).find((p) => p.id === route.pickup_id) : {};
                    let delivery = route.type === "delivery" ? (this.props.selected_order?.deliveries || []).find((d) => d.id === route.delivery_id) : {};
                    let customer = route.type === "pickup" ? pickup.customer : delivery.customer;

                    return (// PAGE BLOCK
                        <div
                            className="page-block"
                            key={index}
                            style={{ paddingTop: "2rem" }}
                        >
                            <div
                                style={{
                                    ...this.styleFlexRow, display: "grid", gridTemplateColumns: "1fr 1fr",
                                }}
                            >
                                <div
                                    style={{
                                        ...this.styleFlexCol, minWidth: "16rem",
                                    }}
                                >
                                    <div style={{ ...this.styleFieldName }}>
                                        {route.type === "pickup" ? "Pick-Up" : "Delivery"}{" "}
                                        Information
                                    </div>
                                    <div style={{ ...this.styleFieldData }}>
                                        {customer.name} <br />
                                        {customer.address1} <br />
                                        {customer.city}, {customer.state} {customer.zip}
                                    </div>
                                </div>

                                <div
                                    style={{
                                        ...this.styleFlexCol, minWidth: "16rem",
                                    }}
                                >
                                    <div style={{ ...this.styleFlexRow }}>
                                        <div style={{ ...this.styleFieldName, width: "6rem" }}>
                                            Earliest Time:
                                        </div>
                                        <div style={{ ...this.styleFieldData }}>
                                            {route.type === "pickup" ? pickup.pu_date1 || "" : delivery.delivery_date1 || ""}{" "}
                                            @{" "}
                                            {route.type === "pickup" ? pickup.pu_time1 || "" : delivery.delivery_time1 || ""}
                                        </div>
                                    </div>
                                    <div style={{ ...this.styleFlexRow }}>
                                        <div style={{ ...this.styleFieldName, width: "6rem" }}>
                                            Latest Time:
                                        </div>
                                        <div style={{ ...this.styleFieldData }}>
                                            {route.type === "pickup" ? pickup.pu_date2 || "" : delivery.delivery_date2 || ""}{" "}
                                            @{" "}
                                            {route.type === "pickup" ? pickup.pu_time2 || "" : delivery.delivery_time2 || ""}
                                        </div>
                                    </div>
                                    <div style={{ ...this.styleFlexRow }}>
                                        <div style={{ ...this.styleFieldName, width: "6rem" }}>
                                            Phone:
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
                                                            : (customer?.contact_phone || '')
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
                                                                : (customer?.contact_phone || '')
                                                        : ''

                                            }
                                        </div>
                                    </div>
                                    <div style={{ ...this.styleFlexRow }}>
                                        <div style={{ ...this.styleFieldName, width: "6rem" }}>
                                            Contact:
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
                            </div>
                        </div>);
                })}

                {/* PAGE BLOCK */}
                {((this.props.selected_order?.order_carrier_ratings || []).find((r) => (r.rate_type?.name || "").toLowerCase() === "linehaul") !== undefined || (this.props.selected_order?.order_carrier_ratings || []).find((r) => (r.rate_type?.name || "").toLowerCase() === "flat") !== undefined) && (
                    <div className="page-block" style={{ paddingTop: "2rem" }}>
                        <div
                            style={{
                                ...this.styleFlexCol,
                            }}
                        >
                            <div
                                style={{
                                    display: "grid", gridTemplateColumns: "5rem 8rem 1fr", padding: "0.2rem 0",
                                }}
                            >
                                <div
                                    style={{
                                        ...this.styleFieldName, textDecoration: "underline", textAlign: "center",
                                    }}
                                >
                                    Pieces/Skids
                                </div>
                                <div
                                    style={{
                                        ...this.styleFieldName, textDecoration: "underline", textAlign: "center",
                                    }}
                                >
                                    Weight
                                </div>
                                <div
                                    style={{
                                        ...this.styleFieldName, textDecoration: "underline",
                                    }}
                                >
                                    Description
                                </div>
                            </div>

                            {(this.props.selected_order.order_carrier_ratings || []).map((rating, index) => {
                                if ((rating.rate_type?.name || "").toLowerCase() === "linehaul" || (rating.rate_type?.name || "").toLowerCase() === "flat") {
                                    return (<div
                                        key={index}
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns: "5rem 8rem 1fr",
                                            padding: "0.2rem 0",
                                        }}
                                    >
                                        <div
                                            style={{
                                                ...this.styleFieldData, color: "#4682B4", textAlign: "center",
                                            }}
                                        >
                                            <NumberFormat
                                                value={rating.pieces > 0 ? rating.pieces : ""}
                                                thousandsGroupStyle="thousand"
                                                thousandSeparator={true}
                                                decimalScale={Number.isInteger(rating.pieces) ? 0 : 2}
                                                fixedDecimalScale={true}
                                                prefix={""}
                                                suffix={(rating.pieces_unit || "") === "pc" ? " Pieces" : (rating.pieces_unit || "") === "sk" ? " Skids" : ""}
                                                type="text"
                                                displayType={"text"}
                                            />
                                        </div>
                                        <div
                                            style={{
                                                ...this.styleFieldData, color: "#4682B4", textAlign: "center",
                                            }}
                                        >
                                            <NumberFormat
                                                value={rating.weight > 0 ? rating.weight : ""}
                                                thousandsGroupStyle="thousand"
                                                thousandSeparator={true}
                                                decimalScale={Number.isInteger(rating.weight) ? 0 : 2}
                                                fixedDecimalScale={true}
                                                prefix={""}
                                                type="text"
                                                displayType={"text"}
                                            />
                                        </div>
                                        <div
                                            style={{ ...this.styleFieldData, color: "#4682B4" }}
                                        >
                                            {rating.description}
                                        </div>
                                    </div>);
                                } else {
                                    return "";
                                }
                            })}
                        </div>

                        {/* <div style={{ ...this.styleFieldName, textAlign: 'left', marginTop: '2rem', textDecoration: 'underline' }}>SPECIAL INSTRUCTIONS</div>

                            {
                                (this.props.selected_order?.notes_for_carrier || []).map((note, index) => {
                                    return (
                                        <div key={index} style={{ ...this.styleFieldData, marginTop: '1rem' }}>
                                            {note.text.split(/\r?\n/).map((text, index) => (
                                                <div key={index}>{text.toUpperCase()}</div>
                                            ))}
                                        </div>
                                    )
                                })
                            } */}
                    </div>)}

                {/* PAGE BLOCK */}
                <div
                    className="page-block"
                    style={{ paddingTop: "2rem" }}
                >
                    <div
                        style={{ ...this.styleFieldName, textDecoration: "underline" }}
                    >
                        Special Instructions
                    </div>

                    {(this.props.selected_order?.notes_for_driver || []).map((note, index) => {
                        return (<div
                            key={index}
                            style={{ ...this.styleFieldData, marginBottom: "5px" }}
                        >
                            {note.text.split(/\r?\n/).map((text, index) => (
                                <div key={index}>{text.toUpperCase()}</div>))}
                        </div>);
                    })}
                </div>

                {/* PAGE BLOCK */}
                {(this.props.selected_order?.routing || []).map((route, index) => {
                    let pickup = route.type === "pickup" ? (this.props.selected_order?.pickups || []).find((p) => p.id === route.pickup_id) : {};
                    let delivery = route.type === "delivery" ? (this.props.selected_order?.deliveries || []).find((d) => d.id === route.delivery_id) : {};
                    let customer = route.type === "pickup" ? pickup.customer : delivery.customer;

                    if ((customer.directions || []).length > 0) {
                        return (// PAGE BLOCK
                            <div
                                key={index}
                                className="page-block"
                                style={{ paddingTop: "2rem" }}
                            >
                                <div
                                    style={{
                                        ...this.styleFieldName, textDecoration: "underline",
                                    }}
                                >
                                    Directions to {customer.name} - {customer.city},{" "}
                                    {customer.state.toUpperCase()}
                                </div>
                                {customer.directions.map((direction, index) => {
                                    return (<div
                                        key={index}
                                        style={{ ...this.styleFieldData, marginBottom: "5px" }}
                                    >
                                        {direction.text.split(/\r?\n/).map((text, index) => (
                                            <div key={index}>{text.toUpperCase()}</div>))}
                                    </div>);
                                })}
                            </div>);
                    } else {
                        return "";
                    }
                })}

                {/* PAGE BLOCK */}
                <div className="page-block" style={{ paddingBottom: "2rem" }}></div>
            </div>
        </div>);
    }
}

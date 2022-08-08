import React, { Component } from 'react'
import moment from 'moment';
import './ToPrint.css';

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
        fontStyle: 'normal',
        whiteSpace: 'nowrap'
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
                fontFamily: 'Lato',
                fontStyle: 'italic'
            }}>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
                <link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Play:wght@400;700&display=swap" rel="stylesheet" />

                <div className="container-sheet">
                    {/* PAGE BLOCK */}
                    <div className="page-block" style={{ paddingTop: '2rem' }}>
                        <div style={{ ...this.styleFieldName, textAlign: 'center', fontSize: '1rem', fontFamily: 'Play', fontWeight: 'bold' }}>
                            CUSTOMER INFORMATION
                        </div>
                    </div>

                    {/* PAGE BLOCK */}
                    <div className="page-block" style={{ paddingTop: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '1rem' }}>
                        <div className="form-bordered-box" style={{ border: '1px solid rgba(0,0,0,0.1)', boxShadow: '1px 1px 1px 0 rgba(0,0,0,0.8)', padding: 10 }}>
                            <div className="form-title" style={{
                                position: 'absolute',
                                backgroundColor: 'white',
                                top: -10,
                                left: 10,
                                padding: '0 10px'
                            }}>Division</div>

                            <div style={{
                                ...this.styleFlexRow,
                                marginBottom: '2px',
                                marginTop: '2px'
                            }}>
                                <span style={{ ...this.styleFieldName, marginRight: 10 }}>CODE:</span> <span style={{ ...this.styleFieldDataBold }}>{((this.props.selectedDivision.code_number || 0) === 0 ? (this.props.selectedDivision.code || '') : this.props.selectedDivision.code + this.props.selectedDivision.code_number).toUpperCase()}</span>
                            </div>

                            <div style={{
                                ...this.styleFlexRow,
                                marginBottom: '2px'
                            }}>
                                <span style={{ ...this.styleFieldName, marginRight: 10 }}>NAME:</span> <span style={{ ...this.styleFieldDataBold }}>{this.props.selectedDivision.name}</span>
                            </div>

                            <div style={{
                                ...this.styleFlexRow,
                                marginBottom: '2px'
                            }}>
                                <span style={{ ...this.styleFieldName, marginRight: 10 }}>ADDRESS 1:</span> <span style={{ ...this.styleFieldDataBold }}>{this.props.selectedDivision.address1}</span>
                            </div>

                            <div style={{
                                ...this.styleFlexRow,
                                marginBottom: '2px'
                            }}>
                                <span style={{ ...this.styleFieldName, marginRight: 10 }}>ADDRESS 2:</span> <span style={{ ...this.styleFieldDataBold }}>{this.props.selectedDivision.address2}</span>
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
                                    <span style={{ ...this.styleFieldName, marginRight: 10 }}>CITY:</span> <span style={{ ...this.styleFieldDataBold }}>{this.props.selectedDivision.city}</span>
                                </div>

                                <div style={{
                                    ...this.styleFlexRow
                                }}>
                                    <span style={{ ...this.styleFieldName, marginRight: 10 }}>STATE:</span> <span style={{ ...this.styleFieldDataBold }}>{this.props.selectedDivision.state}</span>
                                </div>

                                <div style={{
                                    ...this.styleFlexRow
                                }}>
                                    <span style={{ ...this.styleFieldName, marginRight: 10 }}>ZIP:</span> <span style={{ ...this.styleFieldDataBold }}>{this.props.selectedDivision.zip}</span>
                                </div>
                            </div>

                            <div style={{
                                ...this.styleFlexRow,
                                marginBottom: '2px'
                            }}>
                                <span style={{ ...this.styleFieldName, marginRight: 10 }}>CONTACT NAME:</span> <span style={{ ...this.styleFieldDataBold }}>{
                                    (this.props.selectedDivision?.contacts || []).find(c => c.is_primary === 1) === undefined
                                        ? (this.props.selectedDivision?.contact_name || '')
                                        : this.props.selectedDivision?.contacts.find(c => c.is_primary === 1).first_name + ' ' + this.props.selectedDivision?.contacts.find(c => c.is_primary === 1).last_name
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
                                    <span style={{ ...this.styleFieldName, marginRight: 10 }}>CONTACT PHONE:</span> <span style={{ ...this.styleFieldDataBold }}>{
                                        (this.props.selectedDivision?.contacts || []).find(c => c.is_primary === 1) === undefined
                                            ? (this.props.selectedDivision?.contact_phone || '')
                                            : this.props.selectedDivision?.contacts.find(c => c.is_primary === 1).primary_phone === 'work'
                                                ? this.props.selectedDivision?.contacts.find(c => c.is_primary === 1).phone_work
                                                : this.props.selectedDivision?.contacts.find(c => c.is_primary === 1).primary_phone === 'fax'
                                                    ? this.props.selectedDivision?.contacts.find(c => c.is_primary === 1).phone_work_fax
                                                    : this.props.selectedDivision?.contacts.find(c => c.is_primary === 1).primary_phone === 'mobile'
                                                        ? this.props.selectedDivision?.contacts.find(c => c.is_primary === 1).phone_mobile
                                                        : this.props.selectedDivision?.contacts.find(c => c.is_primary === 1).primary_phone === 'direct'
                                                            ? this.props.selectedDivision?.contacts.find(c => c.is_primary === 1).phone_direct
                                                            : this.props.selectedDivision?.contacts.find(c => c.is_primary === 1).primary_phone === 'other'
                                                                ? this.props.selectedDivision?.contacts.find(c => c.is_primary === 1).phone_other
                                                                : ''
                                    }</span>
                                </div>

                                <div style={{
                                    ...this.styleFlexRow
                                }}>
                                    <span style={{ ...this.styleFieldName, marginRight: 10 }}>EXT:</span> <span style={{ ...this.styleFieldDataBold }}>{
                                        (this.props.selectedDivision?.contacts || []).find(c => c.is_primary === 1) === undefined
                                            ? (this.props.selectedDivision?.ext || '')
                                            : this.props.selectedDivision?.contacts.find(c => c.is_primary === 1).phone_ext
                                    }</span>
                                </div>
                            </div>

                            <div style={{
                                ...this.styleFlexRow,
                                marginBottom: '2px'
                            }}>
                                <span style={{ ...this.styleFieldName, marginRight: 10 }}>E-MAIL:</span> <span style={{ ...this.styleFieldDataBold }}>{
                                    (this.props.selectedDivision?.contacts || []).find(c => c.is_primary === 1) === undefined
                                        ? (this.props.selectedDivision?.email || '')
                                        : this.props.selectedDivision?.contacts.find(c => c.is_primary === 1).primary_email === 'work'
                                            ? this.props.selectedDivision?.contacts.find(c => c.is_primary === 1).email_work
                                            : this.props.selectedDivision?.contacts.find(c => c.is_primary === 1).primary_email === 'personal'
                                                ? this.props.selectedDivision?.contacts.find(c => c.is_primary === 1).email_personal
                                                : this.props.selectedDivision?.contacts.find(c => c.is_primary === 1).primary_email === 'other'
                                                    ? this.props.selectedDivision?.contacts.find(c => c.is_primary === 1).email_other
                                                    : ''
                                }</span>
                            </div>
                        </div>

                        <div className="form-bordered-box" style={{ border: '1px solid rgba(0,0,0,0.1)', boxShadow: '1px 1px 1px 0 rgba(0,0,0,0.8)', padding: 10 }}>
                            <div className="form-title" style={{
                                position: 'absolute',
                                backgroundColor: 'white',
                                top: -10,
                                left: 10,
                                padding: '0 10px'
                            }}>Billing Address</div>

                            <div style={{
                                ...this.styleFlexRow,
                                marginBottom: '2px',
                                marginTop: '2px'
                            }}>
                                <span style={{ ...this.styleFieldName, marginRight: 10 }}>CODE:</span>
                                {this.props.selectedDivision.mailing_address?.bill_to_contact
                                    ? <span style={{ ...this.styleFieldDataBold }}>{((this.props.selectedDivision.mailing_address?.bill_to_contact.code_number || 0) === 0 ? (this.props.selectedDivision.mailing_address?.bill_to_contact.code || '') : this.props.selectedDivision.mailing_address?.bill_to_contact.code + this.props.selectedDivision.mailing_address?.bill_to_contact.code_number).toUpperCase()}</span>
                                    : <span style={{ ...this.styleFieldDataBold }}>{((this.props.selectedDivision.mailing_address?.code_number || 0) === 0 ? (this.props.selectedDivision.mailing_address?.code || '') : this.props.selectedDivision.mailing_address?.code + this.props.selectedDivision.mailing_address?.code_number).toUpperCase()}</span>
                                }
                            </div>

                            <div style={{
                                ...this.styleFlexRow,
                                marginBottom: '2px'
                            }}>
                                <span style={{ ...this.styleFieldName, marginRight: 10 }}>NAME:</span>
                                {this.props.selectedDivision.mailing_address?.bill_to_contact
                                    ? <span style={{ ...this.styleFieldDataBold }}>{this.props.selectedDivision.mailing_address?.bill_to_contact.name}</span>
                                    : <span style={{ ...this.styleFieldDataBold }}>{this.props.selectedDivision.mailing_address?.name}</span>
                                }
                            </div>

                            <div style={{
                                ...this.styleFlexRow,
                                marginBottom: '2px'
                            }}>
                                <span style={{ ...this.styleFieldName, marginRight: 10 }}>ADDRESS 1:</span>
                                {this.props.selectedDivision.mailing_address?.bill_to_contact
                                    ? <span style={{ ...this.styleFieldDataBold }}>{this.props.selectedDivision.mailing_address?.bill_to_contact.address1}</span>
                                    : <span style={{ ...this.styleFieldDataBold }}>{this.props.selectedDivision.mailing_address?.address1}</span>
                                }
                            </div>

                            <div style={{
                                ...this.styleFlexRow,
                                marginBottom: '2px'
                            }}>
                                <span style={{ ...this.styleFieldName, marginRight: 10 }}>ADDRESS 2:</span>
                                {this.props.selectedDivision.mailing_address?.bill_to_contact
                                    ? <span style={{ ...this.styleFieldDataBold }}>{this.props.selectedDivision.mailing_address?.bill_to_contact.address2}</span>
                                    : <span style={{ ...this.styleFieldDataBold }}>{this.props.selectedDivision.mailing_address?.address2}</span>
                                }
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
                                    <span style={{ ...this.styleFieldName, marginRight: 10 }}>CITY:</span>
                                    {this.props.selectedDivision.mailing_address?.bill_to_contact
                                        ? <span style={{ ...this.styleFieldDataBold }}>{this.props.selectedDivision.mailing_address?.bill_to_contact.city}</span>
                                        : <span style={{ ...this.styleFieldDataBold }}>{this.props.selectedDivision.mailing_address?.city}</span>
                                    }
                                </div>

                                <div style={{
                                    ...this.styleFlexRow
                                }}>
                                    <span style={{ ...this.styleFieldName, marginRight: 10 }}>STATE:</span>
                                    {this.props.selectedDivision.mailing_address?.bill_to_contact
                                        ? <span style={{ ...this.styleFieldDataBold }}>{this.props.selectedDivision.mailing_address?.bill_to_contact.state}</span>
                                        : <span style={{ ...this.styleFieldDataBold }}>{this.props.selectedDivision.mailing_address?.state}</span>
                                    }
                                </div>

                                <div style={{
                                    ...this.styleFlexRow
                                }}>
                                    <span style={{ ...this.styleFieldName, marginRight: 10 }}>ZIP:</span>
                                    {this.props.selectedDivision.mailing_address?.bill_to_contact
                                        ? <span style={{ ...this.styleFieldDataBold }}>{this.props.selectedDivision.mailing_address?.bill_to_contact.zip}</span>
                                        : <span style={{ ...this.styleFieldDataBold }}>{this.props.selectedDivision.mailing_address?.zip}</span>
                                    }
                                </div>
                            </div>

                            <div style={{
                                ...this.styleFlexRow,
                                marginBottom: '2px'
                            }}>
                                <span style={{ ...this.styleFieldName, marginRight: 10 }}>CONTACT NAME:</span>

                                {this.props.selectedDivision.mailing_address?.bill_to_contact
                                    ? <span style={{ ...this.styleFieldDataBold }}>{
                                        ((this.props.selectedDivision?.mailing_address?.bill_to_contact.contacts || []).find(c => c.is_primary === 1)?.first_name || '') +
                                        ((this.props.selectedDivision?.mailing_address?.bill_to_contact.contacts || [].find(c => c.is_primary === 1)?.last_name || '') === ''
                                            ? ''
                                            : ' ' + (this.props.selectedDivision?.mailing_address?.bill_to_contact.contacts || []).find(c => c.is_primary === 1)?.last_name)
                                    }</span>
                                    : <span style={{ ...this.styleFieldDataBold }}>{
                                        (this.props.selectedDivision?.mailing_address?.mailing_contact?.first_name || '') +
                                        ((this.props.selectedDivision?.mailing_address?.mailing_contact?.last_name || '') === ''
                                            ? ''
                                            : ' ' + this.props.selectedDivision?.mailing_address?.mailing_contact?.last_name)
                                    }</span>
                                }
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
                                    <span style={{ ...this.styleFieldName, marginRight: 10 }}>CONTACT PHONE:</span>
                                    {this.props.selectedDivision.mailing_address?.bill_to_contact
                                        ?
                                        <span style={{ ...this.styleFieldDataBold }}>{
                                            ((this.props.selectedDivision?.mailing_address?.bill_to_contact.contacts || []).find(c => c.is_primary === 1)?.primary_phone || '') === 'work'
                                                ? ((this.props.selectedDivision?.mailing_address?.bill_to_contact.contacts || []).find(c => c.is_primary === 1)?.phone_work || '')
                                                : ((this.props.selectedDivision?.mailing_address?.bill_to_contact.contacts || []).find(c => c.is_primary === 1)?.primary_phone || '') === 'fax'
                                                    ? ((this.props.selectedDivision?.mailing_address?.bill_to_contact.contacts || []).find(c => c.is_primary === 1)?.phone_work_fax || '')
                                                    : ((this.props.selectedDivision?.mailing_address?.bill_to_contact.contacts || []).find(c => c.is_primary === 1)?.primary_phone || '') === 'mobile'
                                                        ? ((this.props.selectedDivision?.mailing_address?.bill_to_contact.contacts || []).find(c => c.is_primary === 1)?.phone_mobile || '')
                                                        : ((this.props.selectedDivision?.mailing_address?.bill_to_contact.contacts || []).find(c => c.is_primary === 1)?.primary_phone || '') === 'direct'
                                                            ? ((this.props.selectedDivision?.mailing_address?.bill_to_contact.contacts || []).find(c => c.is_primary === 1)?.phone_direct || '')
                                                            : ((this.props.selectedDivision?.mailing_address?.bill_to_contact.contacts || []).find(c => c.is_primary === 1)?.primary_phone || '') === 'other'
                                                                ? ((this.props.selectedDivision?.mailing_address?.bill_to_contact.contacts || []).find(c => c.is_primary === 1)?.phone_other || '')
                                                                : ''
                                        }</span>

                                        : <span style={{ ...this.styleFieldDataBold }}>{
                                            (this.props.selectedDivision?.mailing_address?.mailing_contact_primary_phone || '') === 'work'
                                                ? (this.props.selectedDivision?.mailing_address?.mailing_contact?.phone_work || '')
                                                : (this.props.selectedDivision?.mailing_address?.mailing_contact_primary_phone || '') === 'fax'
                                                    ? (this.props.selectedDivision?.mailing_address?.mailing_contact?.phone_work_fax || '')
                                                    : (this.props.selectedDivision?.mailing_address?.mailing_contact_primary_phone || '') === 'mobile'
                                                        ? (this.props.selectedDivision?.mailing_address?.mailing_contact?.phone_mobile || '')
                                                        : (this.props.selectedDivision?.mailing_address?.mailing_contact_primary_phone || '') === 'direct'
                                                            ? (this.props.selectedDivision?.mailing_address?.mailing_contact?.phone_direct || '')
                                                            : (this.props.selectedDivision?.mailing_address?.mailing_contact_primary_phone || '') === 'other'
                                                                ? (this.props.selectedDivision?.mailing_address?.mailing_contact?.phone_other || '')
                                                                : ''
                                        }</span>
                                    }
                                </div>

                                <div style={{
                                    ...this.styleFlexRow
                                }}>
                                    <span style={{ ...this.styleFieldName, marginRight: 10 }}>EXT:</span>
                                    {this.props.selectedDivision.mailing_address?.bill_to_contact
                                        ? <span style={{ ...this.styleFieldDataBold }}>{
                                            ((this.props.selectedDivision?.mailing_address?.bill_to_contact.contacts || []).find(c => c.is_primary === 1)?.phone_ext || '')
                                        }</span>
                                        : <span style={{ ...this.styleFieldDataBold }}>{
                                            this.props.selectedDivision?.mailing_address?.mailing_contact?.phone_ext || ''
                                        }</span>
                                    }
                                </div>
                            </div>

                            <div style={{
                                ...this.styleFlexRow,
                                marginBottom: '2px'
                            }}>
                                <span style={{ ...this.styleFieldName, marginRight: 10 }}>E-MAIL:</span>
                                {this.props.selectedDivision.mailing_address?.bill_to_contact
                                    ? <span style={{ ...this.styleFieldDataBold }}>{
                                        ((this.props.selectedDivision?.mailing_address?.bill_to_contact.contacts || []).find(c => c.is_primary === 1)?.primary_email || '') === 'work'
                                            ? ((this.props.selectedDivision?.mailing_address?.bill_to_contact.contacts || []).find(c => c.is_primary === 1)?.email_work || '')
                                            : ((this.props.selectedDivision?.mailing_address?.bill_to_contact.contacts || []).find(c => c.is_primary === 1)?.primary_email || '') === 'personal'
                                                ? ((this.props.selectedDivision?.mailing_address?.bill_to_contact.contacts || []).find(c => c.is_primary === 1)?.email_personal || '')
                                                : ((this.props.selectedDivision?.mailing_address?.bill_to_contact.contacts || []).find(c => c.is_primary === 1)?.primary_email || '') === 'other'
                                                    ? ((this.props.selectedDivision?.mailing_address?.bill_to_contact.contacts || []).find(c => c.is_primary === 1)?.email_other || '')
                                                    : ''
                                    }</span>

                                    : <span style={{ ...this.styleFieldDataBold }}>{
                                        (this.props.selectedDivision?.mailing_address?.mailing_contact_primary_email || '') === 'work'
                                            ? (this.props.selectedDivision?.mailing_address?.mailing_contact?.email_work || '')
                                            : (this.props.selectedDivision?.mailing_address?.mailing_contact_primary_email || '') === 'personal'
                                                ? (this.props.selectedDivision?.mailing_address?.mailing_contact?.email_personal || '')
                                                : (this.props.selectedDivision?.mailing_address?.mailing_contact_primary_email || '') === 'other'
                                                    ? (this.props.selectedDivision?.mailing_address?.mailing_contact?.email_other || '')
                                                    : ''
                                    }</span>
                                }
                            </div>
                        </div>
                    </div>

                    {/* PAGE BLOCK */}
                    {
                        (this.props.selectedDivision?.contacts || []).length > 0 &&
                        <div className="page-block" style={{ paddingTop: '2rem' }}>
                            <div className="form-bordered-box" style={{ border: '1px solid rgba(0,0,0,0.1)', boxShadow: '1px 1px 1px 0 rgba(0,0,0,0.8)', padding: 10 }}>
                                <div className="form-title" style={{
                                    position: 'absolute',
                                    backgroundColor: 'white',
                                    top: -10,
                                    left: 10,
                                    padding: '0 10px'
                                }}>Contacts</div>

                                <div style={{
                                    ...this.styleFlexRow,
                                    display: 'grid',
                                    gridTemplateColumns: '3fr 2fr 1fr 4fr',
                                    marginBottom: '2px'
                                }}>
                                    <div style={{
                                        ...this.styleFlexRow
                                    }}>
                                        <span style={{ ...this.styleFieldName }}>NAME</span>
                                    </div>

                                    <div style={{
                                        ...this.styleFlexRow
                                    }}>
                                        <span style={{ ...this.styleFieldName }}>PHONE</span>
                                    </div>

                                    <div style={{
                                        ...this.styleFlexRow
                                    }}>
                                        <span style={{ ...this.styleFieldName }}>EXT</span>
                                    </div>

                                    <div style={{
                                        ...this.styleFlexRow
                                    }}>
                                        <span style={{ ...this.styleFieldName }}>E-MAIL</span>
                                    </div>
                                </div>

                                {
                                    this.props.selectedDivision.contacts.map((contact, index) => {
                                        return (
                                            <div key={index} style={{
                                                ...this.styleFlexRow,
                                                display: 'grid',
                                                gridTemplateColumns: '3fr 2fr 1fr 4fr',
                                                marginBottom: '2px'
                                            }}>
                                                <div style={{
                                                    ...this.styleFlexRow
                                                }}>
                                                    <span style={{ ...this.styleFieldDataBold }}>{contact.first_name} {contact.last_name}</span>
                                                </div>

                                                <div style={{
                                                    ...this.styleFlexRow
                                                }}>
                                                    <span style={{ ...this.styleFieldDataBold }}>{
                                                        contact.primary_phone === 'work' ? contact.phone_work
                                                            : contact.primary_phone === 'fax' ? contact.phone_work_fax
                                                                : contact.primary_phone === 'mobile' ? contact.phone_mobile
                                                                    : contact.primary_phone === 'direct' ? contact.phone_direct
                                                                        : contact.primary_phone === 'other' ? contact.phone_other
                                                                            : ''
                                                    }</span>
                                                </div>

                                                <div style={{
                                                    ...this.styleFlexRow
                                                }}>
                                                    <span style={{ ...this.styleFieldDataBold }}>{contact.phone_ext}</span>
                                                </div>

                                                <div style={{
                                                    ...this.styleFlexRow
                                                }}>
                                                    <span style={{ ...this.styleFieldDataBold }}>{
                                                        contact.primary_email === 'work' ? contact.email_work
                                                            : contact.primary_email === 'personal' ? contact.email_personal
                                                                : contact.primary_email === 'other' ? contact.email_other
                                                                    : ''
                                                    }</span>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    }

                    {/* PAGE BLOCK */}
                    {
                        (this.props.selectedDivision.notes || []).length > 0
                            ?
                            <div className="page-block" style={{ paddingTop: '2rem' }}>
                                <div className="form-bordered-box" style={{ border: '1px solid rgba(0,0,0,0.1)', boxShadow: '1px 1px 1px 0 rgba(0,0,0,0.8)', padding: 10 }}>
                                    <div className="form-title" style={{
                                        position: 'absolute',
                                        backgroundColor: 'white',
                                        top: -10,
                                        left: 10,
                                        padding: '0 10px'
                                    }}>Notes</div>

                                    {
                                        this.props.selectedDivision.notes.map((note, index) => {
                                            return (
                                                <div key={index} style={{ ...this.styleFieldData, marginBottom: '5px' }}>
                                                    {note.text.split(/\r?\n/).map((text, i) => (
                                                        <div key={i}>{text.toUpperCase()}</div>
                                                    ))}
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                            :
                            <div className="page-block" style={{ paddingTop: '2rem' }}>
                                <div className="form-bordered-box" style={{ border: '1px solid rgba(0,0,0,0.1)', boxShadow: '1px 1px 1px 0 rgba(0,0,0,0.8)', height: 200 }}>
                                    <div className="form-title" style={{
                                        position: 'absolute',
                                        backgroundColor: 'white',
                                        top: -10,
                                        left: 10,
                                        padding: '0 10px'
                                    }}>Notes</div>
                                </div>
                            </div>
                    }
                </div>
            </div>
        )
    }
}

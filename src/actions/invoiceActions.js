import {invoiceConstants} from './../constants';

export const setInvoicePanels = panels => {
    return {
        type: invoiceConstants.SET_INVOICE_PANELS,
        payload: panels
    }
}
export const setSelectedDocument = document => {
    return {
        type: invoiceConstants.SET_SELECTED_DOCUMENT,
        payload: document
    }
}
export const setDocumentTags = tags => {
    return {
        type: invoiceConstants.SET_DOCUMENT_TAGS,
        payload: tags
    }
}
export const setSelectedDocumentNote = note => {
    return {
        type: invoiceConstants.SET_SELECTED_DOCUMENT_NOTE,
        payload: note
    }
}
export const setInvoiceOpenedPanels = panels => {
    return {
        type: invoiceConstants.SET_INVOICE_OPENED_PANELS,
        payload: panels
    }
}
export const setInvoiceSelectedOrder = order => {
    return {
        type: invoiceConstants.SET_INVOICE_SELECTED_ORDER,
        payload: order
    }
}
export const setInvoiceOrderNumber = number => {
    return {
        type: invoiceConstants.SET_INVOICE_ORDER_NUMBER,
        payload: number
    }
}
export const setInvoiceTripNumber = number => {
    return {
        type: invoiceConstants.SET_INVOICE_TRIP_NUMBER,
        payload: number
    }
}
export const setInvoiceInternalNotes = notes => {
    return {
        type: invoiceConstants.SET_INVOICE_INTERNAL_NOTES,
        payload: notes
    }
}
export const setInvoiceSelectedInternalNote = note => {
    return {
        type: invoiceConstants.SET_INVOICE_SELECTED_INTERNAL_NOTE,
        payload: note
    }
}
export const setSelectedOrderInvoiceCustomerDocument = document => {
    return {
        type: invoiceConstants.SET_SELECTED_ORDER_INVOICE_CUSTOMER_DOCUMENT,
        payload: document
    }
}
export const setSelectedOrderInvoiceCustomerDocumentNote = note => {
    return {
        type: invoiceConstants.SET_SELECTED_ORDER_INVOICE_CUSTOMER_DOCUMENT_NOTE,
        payload: note
    }
}
export const setSelectedOrderInvoiceCustomerDocumentTags = tags => {
    return {
        type: invoiceConstants.SET_SELECTED_ORDER_INVOICE_CUSTOMER_DOCUMENT_TAGS,
        payload: tags
    }
}
export const setSelectedOrderInvoiceCarrierDocument = document => {
    return {
        type: invoiceConstants.SET_SELECTED_ORDER_INVOICE_CARRIER_DOCUMENT,
        payload: document
    }
}
export const setSelectedOrderInvoiceCarrierDocumentNote = note => {
    return {
        type: invoiceConstants.SET_SELECTED_ORDER_INVOICE_CARRIER_DOCUMENT_NOTE,
        payload: note
    }
}
export const setSelectedOrderInvoiceCarrierDocumentTags = tags => {
    return {
        type: invoiceConstants.SET_SELECTED_ORDER_INVOICE_CARRIER_DOCUMENT_TAGS,
        payload: tags
    }
}
export const setSelectedOrderInvoiceInternalNote = note => {
    return {
        type: invoiceConstants.SET_SELECTED_ORDER_INVOICE_INTERNAL_NOTE,
        payload: note
    }
}
export const setSelectedOrderInvoiceBillingNote = note => {
    return {
        type: invoiceConstants.SET_SELECTED_ORDER_INVOICE_BILLING_NOTE,
        payload: note
    }
}

export const setLbInvoiceSelectedOrder = order => {
    return {
        type: invoiceConstants.SET_LB_INVOICE_SELECTED_ORDER,
        payload: order
    }
}
export const setLbInvoiceOrderNumber = number => {
    return {
        type: invoiceConstants.SET_LB_INVOICE_ORDER_NUMBER,
        payload: number
    }
}
export const setLbInvoiceTripNumber = number => {
    return {
        type: invoiceConstants.SET_LB_INVOICE_TRIP_NUMBER,
        payload: number
    }
}
export const setLbInvoiceInternalNotes = notes => {
    return {
        type: invoiceConstants.SET_LB_INVOICE_INTERNAL_NOTES,
        payload: notes
    }
}
export const setLbInvoiceSelectedInternalNote = note => {
    return {
        type: invoiceConstants.SET_LB_INVOICE_SELECTED_INTERNAL_NOTE,
        payload: note
    }
}
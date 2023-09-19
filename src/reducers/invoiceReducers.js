import { invoiceConstants } from './../constants';

export const invoiceReducers = (state = {
    invoiceOpenedPanels: [],
    selected_order: {},
    order_number: '',
    trip_number: '',

    internalNotes: [],
    selectedInternalNote: {},

    lb_selected_order: {},
    lb_order_number: '',
    lb_trip_number: '',

    lbInternalNotes: [],
    lbSelectedInternalNote: {},

    selectedOrderInvoiceCustomerDocument: {},
    selectedOrderInvoiceCustomerDocumentTags: '',
    selectedOrderInvoiceCustomerDocumentNote: {},
    selectedOrderInvoiceCarrierDocument: {},
    selectedOrderInvoiceCarrierDocumentTags: '',
    selectedOrderInvoiceCarrierDocumentNote: {},
    selectedOrderInvoiceInternalNote: {},
    selectedOrderInvoiceBillingNote: {},

    adminInvoicePanels: [],
    companyInvoicePanels: []
}, action) => {
    switch (action.type) {
        case invoiceConstants.SET_SELECTED_DOCUMENT:
            state = {
                ...state,
                selectedDocument: action.payload
            }
            break;
        case invoiceConstants.SET_DOCUMENT_TAGS:
            state = {
                ...state,
                documentTags: action.payload
            }
            break;
        case invoiceConstants.SET_SELECTED_DOCUMENT_NOTE:
            state = {
                ...state,
                selectedDocumentNote: action.payload
            }
            break;
        case invoiceConstants.SET_INVOICE_OPENED_PANELS:
            state = {
                ...state,
                invoiceOpenedPanels: action.payload
            }
            break;

        case invoiceConstants.SET_INVOICE_SELECTED_ORDER:
            state = {
                ...state,
                selected_order: action.payload
            }
            break;
        case invoiceConstants.SET_INVOICE_ORDER_NUMBER:
            state = {
                ...state,
                order_number: action.payload
            }
            break;
        case invoiceConstants.SET_INVOICE_TRIP_NUMBER:
            state = {
                ...state,
                trip_number: action.payload
            }
            break;
        case invoiceConstants.SET_INVOICE_OPENED_PANELS:
            state = {
                ...state,
                invoiceOpenedPanels: action.payload
            }
            break;
        case invoiceConstants.SET_INVOICE_INTERNAL_NOTES:
            state = {
                ...state,
                internalNotes: action.payload
            }
            break;
        case invoiceConstants.SET_INVOICE_SELECTED_INTERNAL_NOTE:
            state = {
                ...state,
                selectedInternalNote: action.payload
            }
            break;

        case invoiceConstants.SET_LB_INVOICE_SELECTED_ORDER:
            state = {
                ...state,
                lb_selected_order: action.payload
            }
            break;
        case invoiceConstants.SET_LB_INVOICE_ORDER_NUMBER:
            state = {
                ...state,
                lb_order_number: action.payload
            }
            break;
        case invoiceConstants.SET_LB_INVOICE_TRIP_NUMBER:
            state = {
                ...state,
                lb_trip_number: action.payload
            }
            break;
        case invoiceConstants.SET_INVOICE_OPENED_PANELS:
            state = {
                ...state,
                invoiceOpenedPanels: action.payload
            }
            break;
        case invoiceConstants.SET_LB_INVOICE_INTERNAL_NOTES:
            state = {
                ...state,
                lbInternalNotes: action.payload
            }
            break;
        case invoiceConstants.SET_LB_INVOICE_SELECTED_INTERNAL_NOTE:
            state = {
                ...state,
                lbSelectedInternalNote: action.payload
            }
            break;


        case invoiceConstants.SET_SELECTED_ORDER_INVOICE_CUSTOMER_DOCUMENT:
            state = {
                ...state,
                selectedOrderInvoiceCustomerDocument: action.payload
            }
            break;
        case invoiceConstants.SET_SELECTED_ORDER_INVOICE_CUSTOMER_DOCUMENT_TAGS:
            state = {
                ...state,
                selectedOrderInvoiceCustomerDocumentTags: action.payload
            }
            break;
        case invoiceConstants.SET_SELECTED_ORDER_INVOICE_CUSTOMER_DOCUMENT_NOTE:
            state = {
                ...state,
                selectedOrderInvoiceCustomerDocumentNote: action.payload
            }
            break;

        case invoiceConstants.SET_SELECTED_ORDER_INVOICE_CARRIER_DOCUMENT:
            state = {
                ...state,
                selectedOrderInvoiceCarrierDocument: action.payload
            }
            break;
        case invoiceConstants.SET_SELECTED_ORDER_INVOICE_CARRIER_DOCUMENT_TAGS:
            state = {
                ...state,
                selectedOrderInvoiceCarrierDocumentTags: action.payload
            }
            break;
        case invoiceConstants.SET_SELECTED_ORDER_INVOICE_CARRIER_DOCUMENT_NOTE:
            state = {
                ...state,
                selectedOrderInvoiceCarrierDocumentNote: action.payload
            }
            break;
        case invoiceConstants.SET_SELECTED_ORDER_INVOICE_INTERNAL_NOTE:
            state = {
                ...state,
                selectedOrderInvoiceInternalNote: action.payload
            }
            break;
        case invoiceConstants.SET_SELECTED_ORDER_INVOICE_BILLING_NOTE:
            state = {
                ...state,
                selectedOrderInvoiceBillingNote: action.payload
            }
            break;

        case invoiceConstants.SET_INVOICE_PANELS:
            let count = -1;

            state = {
                ...state,
                panels: action.payload.map((p, i) => {
                    if (p.isOpened) {
                        count++;
                        p.pos = count;
                    } else {
                        p.pos = -1;
                    }
                    return p;
                })
            }
            break;
        case invoiceConstants.SET_ADMIN_INVOICE_PANELS:
            state = {
                ...state,
                adminInvoicePanels: action.payload
            }
            break;
            
        case invoiceConstants.SET_COMPANY_INVOICE_PANELS:
            state = {
                ...state,
                companyInvoicePanels: action.payload
            }
            break;
        default:
            break;
    }

    return state;
}
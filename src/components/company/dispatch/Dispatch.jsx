import React, { useState, useRef, useEffect } from "react";
import { connect } from "react-redux";
import classnames from "classnames";
import "./Dispatch.css";
import MaskedInput from "react-text-mask";
import axios from "axios";
// import DispatchModal from './modal/Modal.jsx';
import Highlighter from "react-highlight-words";
import moment from "moment";
import "react-multi-carousel/lib/styles.css";
import "loaders.css";
import NumberFormat from "react-number-format";
import { useTransition, animated } from "react-spring";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretDown,
  faCaretRight,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useDetectClickOutside } from "react-detect-click-outside";
import SwiperCore, { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { Calendar, RatingScreen } from "./../panels";

import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import {
  setCompanyOpenedPanels,
  setDispatchOpenedPanels,
  setCustomerOpenedPanels,
  setCarrierOpenedPanels,
  setLoadBoardOpenedPanels,
  setInvoiceOpenedPanels,
  setAdminCustomerOpenedPanels,
  setAdminCarrierOpenedPanels,
  setSelectedOrder,
  setSelectedCustomer,
  setSelectedContact,
  setSelectedCarrier,
  setSelectedCarrierContact,
  setSelectedDriver as setSelectedCarrierDriver,
  setSelectedInsurance as setSelectedCarrierInsurance,
} from "./../../../actions";
import {
  ChangeCarrier,
  CustomerSearch,
  Documents,
  Routing,
  RateConf,
  Order,
  Bol,
  Modal as DispatchModal,
  OrderImport
} from "./../panels";

import {
  Customers,
  Carriers,
  Invoice,
  LoadBoard,
  Dispatch as DispatchPanel,
} from "./../../company";

var delayTimer;

const Dispatch = (props) => {
  const [selectedOrder, setSelectedOrder] = useState({});
  const [selectedBillToCustomer, setSelectedBillToCustomer] = useState({});
  const [selectedBillToCustomerContact, setSelectedBillToCustomerContact] = useState({});
  const [selectedShipperCustomer, setSelectedShipperCustomer] = useState({});
  const [selectedShipperCustomerContact, setSelectedShipperCustomerContact] = useState({});
  const [selectedConsigneeCustomer, setSelectedConsigneeCustomer] = useState({});
  const [selectedConsigneeCustomerContact, setSelectedConsigneeCustomerContact,] = useState({});
  const [selectedCarrier, setSelectedCarrier] = useState({});
  const [selectedCarrierContact, setSelectedCarrierContact] = useState({});
  const [selectedCarrierDriver, setSelectedCarrierDriver] = useState({});
  const [selectedCarrierInsurance, setSelectedCarrierInsurance] = useState({});
  const [selectedOrderDocument, setSelectedOrderDocument] = useState({});
  const [selectedInternalNote, setSelectedInternalNote] = useState({});
  const [selectedNoteForCarrier, setSelectedNoteForCarrier] = useState({});
  const [selectedNoteForDriver, setSelectedNoteForDriver] = useState({});

  const [shipperBolNumber, setShipperBolNumber] = useState("");
  const [shipperPoNumber, setShipperPoNumber] = useState("");
  const [shipperRefNumber, setShipperRefNumber] = useState("");
  const [mileageLoaderVisible, setMileageLoaderVisible] = useState(false);
  const [isShowingShipperSecondPage, setIsShowingShipperSecondPage] = useState(false);
  const [isShowingConsigneeSecondPage, setIsShowingConsigneeSecondPage] = useState(false);

  const [dispatchEvent, setDispatchEvent] = useState({});
  const [dispatchEventLocation, setDispatchEventLocation] = useState("");
  const [dispatchEventNotes, setDispatchEventNotes] = useState("");
  const [dispatchEventDate, setDispatchEventDate] = useState("");
  const [dispatchEventTime, setDispatchEventTime] = useState("");

  const [driverItems, setDriverItems] = useState([]);
  SwiperCore.use([Navigation]);

  const refOrderNumber = useRef(null);

  useEffect(() => {
    if ((props.order_id || 0) > 0) {
      setIsLoading(true);

      axios.post(props.serverUrl + "/getOrderById", { id: props.order_id }).then((res) => {
        if (res.data.result === "OK") {
          let order = JSON.parse(JSON.stringify(res.data.order));
          setSelectedOrder({});
          setSelectedOrder(order);

          setSelectedBillToCustomer({ ...order.bill_to_company });
          setSelectedBillToCustomerContact({ ...(order.bill_to_company?.contacts || []).find((c) => c.is_primary === 1), });

          let pickup_id = (order.routing || []).find((r) => r.type === "pickup")?.pickup_id || 0;
          let pickup = { ...((order.pickups || []).find((p) => p.id === pickup_id) || (order.pickups || [])[0]), };

          setSelectedShipperCustomer(pickup.id === undefined
            ? {}
            : {
              ...pickup.customer,
              pickup_id: pickup.id,
              pu_date1: pickup.pu_date1,
              pu_date2: pickup.pu_date2,
              pu_time1: pickup.pu_time1,
              pu_time2: pickup.pu_time2,
              bol_numbers: pickup.bol_numbers,
              po_numbers: pickup.po_numbers,
              ref_numbers: pickup.ref_numbers,
              seal_number: pickup.seal_number,
              special_instructions: pickup.special_instructions,
              type: pickup.type,
            }
          );
          setSelectedShipperCustomerContact({
            ...(pickup.contacts || []).find((c) => c.is_primary === 1),
          });

          let delivery_id = (order.routing || []).find((r) => r.type === "delivery")?.delivery_id || 0;
          let delivery = {
            ...((order.deliveries || []).find((d) => d.id === delivery_id) ||
              (order.deliveries || [])[0]),
          };

          setSelectedConsigneeCustomer(
            delivery.id === undefined
              ? {}
              : {
                ...delivery.customer,
                delivery_id: delivery.id,
                delivery_date1: delivery.delivery_date1,
                delivery_date2: delivery.delivery_date2,
                delivery_time1: delivery.delivery_time1,
                delivery_time2: delivery.delivery_time2,
                special_instructions: delivery.special_instructions,
                type: delivery.type,
              }
          );
          setSelectedConsigneeCustomerContact({
            ...(delivery.contacts || []).find((c) => c.is_primary === 1),
          });

          setSelectedCarrier({ ...order.carrier });
          setSelectedCarrierContact({
            ...(order.carrier?.contacts || []).find(
              (c) => c.is_primary === 1
            ),
          });
          setSelectedCarrierDriver({
            ...order.driver,
            name:
              (order.driver?.first_name || "") +
              ((order.driver?.last_name || "").trim() === ""
                ? ""
                : " " + (order.driver?.last_name || "")),
          });

          setIsLoading(false);

          refOrderNumber.current.focus({
            preventScroll: true,
          });
        }
      })
        .catch((e) => {
          console.log("error getting order by id", e);
          setIsLoading(false);
        });
    } else {
      refOrderNumber.current.focus({
        preventScroll: true,
      });
    }

    updateSystemDateTime();
  }, []);

  useEffect(() => {
    if (props.screenFocused) {
      refOrderNumber.current.focus({
        preventScroll: true,
      });
    }
  }, [props.screenFocused]);

  useEffect(() => {
    if ((props.selectedOrder?.component_id || "") !== props.componentId) {
      if (
        (selectedOrder?.id || 0) > 0 &&
        (props.selectedOrder?.id || 0) > 0 &&
        selectedOrder.id === props.selectedOrder.id
      ) {
        setSelectedOrder((selectedOrder) => {
          return {
            ...selectedOrder,
            ...props.selectedOrder,
          };
        });
      }
    }
  }, [props.selectedOrder]);

  useEffect(() => {
    if ((props.selectedCustomer?.component_id || "") !== props.componentId) {
      if (
        (selectedBillToCustomer?.id || 0) > 0 &&
        (props.selectedCustomer?.id || 0) > 0 &&
        selectedBillToCustomer.id === props.selectedCustomer.id
      ) {
        setSelectedBillToCustomer((selectedBillToCustomer) => {
          return {
            ...selectedBillToCustomer,
            ...props.selectedCustomer,
          };
        });
      }

      if (
        (selectedShipperCustomer?.id || 0) > 0 &&
        (props.selectedCustomer?.id || 0) > 0 &&
        selectedShipperCustomer.id === props.selectedCustomer.id
      ) {
        setSelectedShipperCustomer((selectedShipperCustomer) => {
          return {
            ...selectedShipperCustomer,
            ...props.selectedCustomer,
          };
        });

        setSelectedOrder((selectedOrder) => {
          return {
            ...selectedOrder,
            pickups: (selectedOrder.pickups || []).map((item) => {
              if (item.customer?.id === props.selectedCustomer.id) {
                item.customer = props.selectedCustomer;
              }

              return item;
            }),
          };
        });
      }

      if (
        (selectedConsigneeCustomer?.id || 0) > 0 &&
        (props.selectedCustomer?.id || 0) > 0 &&
        selectedConsigneeCustomer.id === props.selectedCustomer.id
      ) {
        setSelectedConsigneeCustomer((selectedConsigneeCustomer) => {
          return {
            ...selectedConsigneeCustomer,
            ...props.selectedCustomer,
          };
        });

        setSelectedOrder((selectedOrder) => {
          return {
            ...selectedOrder,
            deliveries: (selectedOrder.deliveries || []).map((item) => {
              if (item.customer?.id === props.selectedCustomer.id) {
                item.customer = props.selectedCustomer;
              }

              return item;
            }),
          };
        });
      }
    }
  }, [props.selectedCustomer]);

  useEffect(() => {
    if (
      (props.selectedCustomerContact?.component_id || "") !== props.componentId
    ) {
      if (
        (selectedBillToCustomerContact?.id || 0) > 0 &&
        (props.selectedCustomerContact?.id || 0) > 0 &&
        selectedBillToCustomerContact.id === props.selectedCustomerContact.id
      ) {
        setSelectedBillToCustomerContact((selectedBillToCustomerContact) => {
          return {
            ...selectedBillToCustomerContact,
            ...props.selectedCustomerContact,
          };
        });
      }

      if (
        (selectedShipperCustomerContact?.id || 0) > 0 &&
        (props.selectedCustomerContact?.id || 0) > 0 &&
        selectedShipperCustomerContact.id === props.selectedCustomerContact.id
      ) {
        setSelectedShipperCustomerContact((selectedShipperCustomerContact) => {
          return {
            ...selectedShipperCustomerContact,
            ...props.selectedCustomerContact,
          };
        });
      }

      if (
        (selectedConsigneeCustomerContact?.id || 0) > 0 &&
        (props.selectedCustomerContact?.id || 0) > 0 &&
        selectedConsigneeCustomerContact.id === props.selectedCustomerContact.id
      ) {
        setSelectedConsigneeCustomerContact(
          (selectedConsigneeCustomerContact) => {
            return {
              ...selectedConsigneeCustomerContact,
              ...props.selectedCustomerContact,
            };
          }
        );
      }
    }
  }, [props.selectedCustomerContact]);

  useEffect(() => {
    if (props.selectedCarrier?.change_carrier || false) {
      setSelectedCarrier({
        ...props.selectedCarrier,
      });
    } else {
      if ((props.selectedCarrier?.component_id || "") !== props.componentId) {
        if (
          (selectedCarrier?.id || 0) > 0 &&
          (props.selectedCarrier?.id || 0) > 0 &&
          selectedCarrier.id === props.selectedCarrier.id
        ) {
          setSelectedCarrier((selectedCarrier) => {
            return {
              ...selectedCarrier,
              ...props.selectedCarrier,
            };
          });
        }
      }
    }
  }, [props.selectedCarrier]);

  useEffect(() => {
    if (props.selectedCarrierContact?.change_carrier || false) {
      setSelectedCarrierContact({
        ...props.selectedCarrierContact,
      });
    } else {
      if (
        (props.selectedCarrierContact?.component_id || "") !== props.componentId
      ) {
        if (
          (selectedCarrierContact?.id || 0) > 0 &&
          (props.selectedCarrierContact?.id || 0) > 0 &&
          selectedCarrierContact.id === props.selectedCarrierContact.id
        ) {
          setSelectedCarrierContact((selectedCarrierContact) => {
            return {
              ...selectedCarrierContact,
              ...props.selectedCarrierContact,
            };
          });
        }
      }
    }
  }, [props.selectedCarrierContact]);

  useEffect(() => {
    if (props.selectedCarrierDriver?.change_carrier || false) {
      setSelectedCarrierDriver({
        ...props.selectedCarrierDriver,
      });
    } else {
      if (
        (props.selectedCarrierDriver?.component_id || "") !== props.componentId
      ) {
        if (
          (selectedCarrierDriver?.id || 0) > 0 &&
          (props.selectedCarrierDriver?.id || 0) > 0 &&
          selectedCarrierDriver.id === props.selectedCarrierDriver.id
        ) {
          setSelectedCarrierDriver((selectedCarrierDriver) => {
            return {
              ...selectedCarrierDriver,
              ...props.selectedCarrierDriver,
            };
          });
        }
      }
    }
  }, [props.selectedCarrierDriver]);

  const [currentSystemDateTime, setCurrentSystemDateTime] = useState(moment());

  const updateSystemDateTime = () => {
    window.setTimeout(() => {
      setCurrentSystemDateTime(moment());
      updateSystemDateTime();
    }, 1000);
  };

  const [puTime1KeyCode, setPuTime1KeyCode] = useState(0);
  const [puTime2KeyCode, setPuTime2KeyCode] = useState(0);
  const [puDate1KeyCode, setPuDate1KeyCode] = useState(0);
  const [puDate2KeyCode, setPuDate2KeyCode] = useState(0);
  const [dispatchEventTimeKeyCode, setDispatchEvebtTimeKeyCode] = useState(0);
  const [deliveryTime1KeyCode, setDeliveryTime1KeyCode] = useState(0);
  const [deliveryTime2KeyCode, setDeliveryTime2KeyCode] = useState(0);
  const [deliveryDate1KeyCode, setDeliveryDate1KeyCode] = useState(0);
  const [deliveryDate2KeyCode, setDeliveryDate2KeyCode] = useState(0);

  const [preSelectedPickupDate1, setPreSelectedPickupDate1] = useState(
    moment()
  );
  const [preSelectedPickupDate2, setPreSelectedPickupDate2] = useState(
    moment()
  );
  const [preSelectedDeliveryDate1, setPreSelectedDeliveryDate1] = useState(
    moment()
  );
  const [preSelectedDeliveryDate2, setPreSelectedDeliveryDate2] = useState(
    moment()
  );

  const [isPickupDate1CalendarShown, setIsPickupDate1CalendarShown] =
    useState(false);
  const [isPickupDate2CalendarShown, setIsPickupDate2CalendarShown] =
    useState(false);
  const [isDeliveryDate1CalendarShown, setIsDeliveryDate1CalendarShown] =
    useState(false);
  const [isDeliveryDate2CalendarShown, setIsDeliveryDate2CalendarShown] =
    useState(false);

  const refPickupDate1CalendarDropDown = useDetectClickOutside({
    onTriggered: async () => {
      await setIsPickupDate1CalendarShown(false);
    },
  });
  const refPickupDate2CalendarDropDown = useDetectClickOutside({
    onTriggered: async () => {
      await setIsPickupDate2CalendarShown(false);
    },
  });
  const refDeliveryDate1CalendarDropDown = useDetectClickOutside({
    onTriggered: async () => {
      await setIsDeliveryDate1CalendarShown(false);
    },
  });
  const refDeliveryDate2CalendarDropDown = useDetectClickOutside({
    onTriggered: async () => {
      await setIsDeliveryDate2CalendarShown(false);
    },
  });

  const refPickupDate1 = useRef();
  const refPickupDate2 = useRef();
  const refDeliveryDate1 = useRef();
  const refDeliveryDate2 = useRef();

  const refPickupTime1 = useRef();
  const refPickupTime2 = useRef();
  const refDeliveryTime1 = useRef();
  const refDeliveryTime2 = useRef();

  const refCalendarPickupDate1 = useRef();
  const refCalendarPickupDate2 = useRef();
  const refCalendarDeliveryDate1 = useRef();
  const refCalendarDeliveryDate2 = useRef();

  const refEventDate = useRef();
  const [
    isDispatchEventDateCalendarShown,
    setIsDispatchEventDateCalendarShown,
  ] = useState(false);
  const [preSelectedDispatchEventDate, setPreSelectedDispatchEventDate] =
    useState(moment());
  const refDispatchEventDateCalendarDropDown = useDetectClickOutside({
    onTriggered: () => {
      setIsDispatchEventDateCalendarShown(false);
    },
  });

  const [selectedOrderEvent, setSelectedOrderEvent] = useState({});

  const H = window.H;
  const platform = new H.service.Platform({
    apikey: "_aKHLFzgJTYQLzsSzVqRKyiKk8iuywH3jbtV8Mxw5Gs",
    app_id: "X4qy0Sva14BQxJCbVqXL",
  });
  const routingService = platform.getRoutingService();
  // const routingService = {};

  const refBolNumbers = useRef();
  const refPoNumbers = useRef();
  const refRefNumbers = useRef();

  const [isLoading, setIsLoading] = useState(false);
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const [isSavingBillToCompanyInfo, setIsSavingBillToCompanyInfo] =
    useState(false);
  const [isSavingBillToCompanyContact, setIsSavingBillToCompanyContact] =
    useState(false);
  const [isSavingShipperCompanyInfo, setIsSavingShipperCompanyInfo] =
    useState(false);
  const [isSavingShipperCompanyContact, setIsSavingShipperCompanyContact] =
    useState(false);
  const [isSavingConsigneeCompanyInfo, setIsSavingConsigneeCompanyInfo] =
    useState(false);
  const [isSavingConsigneeCompanyContact, setIsSavingConsigneeCompanyContact] =
    useState(false);
  const [isSavingRouting, setIsSavingRouting] = useState(false);
  const [isSavingPickupId, setIsSavingPickupId] = useState(-1);
  const [isSavingDeliveryId, setIsSavingDeliveryId] = useState(-1);

  const [isSavingCarrierInfo, setIsSavingCarrierInfo] = useState(false);
  const [isSavingCarrierContact, setIsSavingCarrierContact] = useState(false);
  const [isSavingCarrierDriver, setIsSavingCarrierDriver] = useState(false);

  const [showingChangeCarrier, setShowingChangeCarrier] = useState(false);

  const refDivision = useRef();
  const refLoadType = useRef();
  const refTemplate = useRef();
  const refCarrierCode = useRef();
  const refEquipment = useRef();
  const refDriverName = useRef();
  const refDriverPhone = useRef();
  const refDispatchEvents = useRef();
  const refEventTime = useRef();

  const [divisionItems, setDivisionItems] = useState([]);
  const refDivisionDropDown = useDetectClickOutside({
    onTriggered: async () => {
      await setDivisionItems([]);
    },
  });
  const refDivisionPopupItems = useRef([]);

  const [loadTypeItems, setLoadTypeItems] = useState([]);
  const refLoadTypeDropDown = useDetectClickOutside({
    onTriggered: async () => {
      await setLoadTypeItems([]);
    },
  });
  const refLoadTypePopupItems = useRef([]);

  const [templateItems, setTemplateItems] = useState([]);
  const refTemplateDropDown = useDetectClickOutside({
    onTriggered: async () => {
      await setTemplateItems([]);
    },
  });
  const refTemplatePopupItems = useRef([]);

  const [equipmentItems, setEquipmentItems] = useState([]);
  const refEquipmentDropDown = useDetectClickOutside({
    onTriggered: async () => {
      await setEquipmentItems([]);
    },
  });
  const refEquipmentPopupItems = useRef([]);

  const refDriverDropDown = useDetectClickOutside({
    onTriggered: async () => {
      await setDriverItems([]);
    },
  });
  const refDriverPopupItems = useRef([]);

  const refBillToCompanyCode = useRef();
  const refShipperCompanyCode = useRef();
  const refConsigneeCompanyCode = useRef();

  const [dispatchEventItems, setDispatchEventItems] = useState([]);

  const [tempDispatchEventItems, setTempDispatchEventItems] = useState([]);

  const [dispatchEventSecondPageItems, setDispatchEventSecondPageItems] =
    useState([]);
  const [showDispatchEventItems, setShowDispatchEventItems] = useState(false);
  const [
    showDispatchEventSecondPageItems,
    setShowDispatchEventSecondPageItems,
  ] = useState(false);
  const refDispatchEventDropDown = useDetectClickOutside({
    onTriggered: () => {
      setDispatchEventItems([]);
    },
  });
  const refDispatchEventPopupItems = useRef([]);
  const refDispatchEventSecondPagePopupItems = useRef([]);

  const loadingTransition = useTransition(isLoading, {
    from: { opacity: 0, display: "block" },
    enter: { opacity: 1, display: "block" },
    leave: { opacity: 0, display: "none" },
    reverse: isLoading,
  });

  const divisionTransition = useTransition(divisionItems.length > 0, {
    from: { opacity: 0, top: "calc(100% + 7px)" },
    enter: { opacity: 1, top: "calc(100% + 12px)" },
    leave: { opacity: 0, top: "calc(100% + 7px)" },
    config: { duration: 100 },
    reverse: divisionItems.length > 0,
  });

  const loadTypeTransition = useTransition(loadTypeItems.length > 0, {
    from: { opacity: 0, top: "calc(100% + 7px)" },
    enter: { opacity: 1, top: "calc(100% + 12px)" },
    leave: { opacity: 0, top: "calc(100% + 7px)" },
    config: { duration: 100 },
    reverse: loadTypeItems.length > 0,
  });

  const templateTransition = useTransition(templateItems.length > 0, {
    from: { opacity: 0, top: "calc(100% + 7px)" },
    enter: { opacity: 1, top: "calc(100% + 12px)" },
    leave: { opacity: 0, top: "calc(100% + 7px)" },
    config: { duration: 100 },
    reverse: templateItems.length > 0,
  });

  const equipmentTransition = useTransition(equipmentItems.length > 0, {
    from: { opacity: 0, top: "calc(100% + 7px)" },
    enter: { opacity: 1, top: "calc(100% + 12px)" },
    leave: { opacity: 0, top: "calc(100% + 7px)" },
    config: { duration: 100 },
    reverse: equipmentItems.length > 0,
  });

  const driverTransition = useTransition(driverItems.length > 0, {
    from: { opacity: 0, top: "calc(100% + 7px)" },
    enter: { opacity: 1, top: "calc(100% + 12px)" },
    leave: { opacity: 0, top: "calc(100% + 7px)" },
    config: { duration: 100 },
    reverse: driverItems.length > 0,
  });

  const shipperFirstPageTransition = useTransition(
    !isShowingShipperSecondPage,
    {
      from: { opacity: 0, left: "0%", width: "0%" },
      enter: { opacity: 1, left: "0%", width: "100%" },
      leave: { opacity: 0, left: "0%", width: "0%" },
      config: { duration: 300 },
      reverse: !isShowingShipperSecondPage,
    }
  );

  const shipperSecondPageTransition = useTransition(
    isShowingShipperSecondPage,
    {
      from: { opacity: 0, left: "100%", width: "0%" },
      enter: { opacity: 1, left: "0%", width: "100%" },
      leave: { opacity: 0, left: "100%", width: "0%" },
      config: { duration: 300 },
      reverse: isShowingShipperSecondPage,
    }
  );

  const consigneeFirstPageTransition = useTransition(
    !isShowingConsigneeSecondPage,
    {
      from: { opacity: 0, left: "0%", width: "0%" },
      enter: { opacity: 1, left: "0%", width: "100%" },
      leave: { opacity: 0, left: "0%", width: "0%" },
      config: { duration: 300 },
      reverse: !isShowingConsigneeSecondPage,
    }
  );

  const consigneeSecondPageTransition = useTransition(
    isShowingConsigneeSecondPage,
    {
      from: { opacity: 0, left: "100%", width: "0%" },
      enter: { opacity: 1, left: "0%", width: "100%" },
      leave: { opacity: 0, left: "100%", width: "0%" },
      config: { duration: 300 },
      reverse: isShowingConsigneeSecondPage,
    }
  );

  const puDate1Transition = useTransition(isPickupDate1CalendarShown, {
    from: { opacity: 0, display: "block", top: "calc(100% + 7px)" },
    enter: { opacity: 1, display: "block", top: "calc(100% + 12px)" },
    leave: { opacity: 0, display: "none", top: "calc(100% + 7px)" },
    reverse: isPickupDate1CalendarShown,
    config: { duration: 100 },
  });

  const puDate2Transition = useTransition(isPickupDate2CalendarShown, {
    from: { opacity: 0, display: "block", top: "calc(100% + 7px)" },
    enter: { opacity: 1, display: "block", top: "calc(100% + 12px)" },
    leave: { opacity: 0, display: "none", top: "calc(100% + 7px)" },
    reverse: isPickupDate2CalendarShown,
    config: { duration: 100 },
  });

  const deliveryDate1Transition = useTransition(isDeliveryDate1CalendarShown, {
    from: { opacity: 0, display: "block", top: "calc(100% + 7px)" },
    enter: { opacity: 1, display: "block", top: "calc(100% + 12px)" },
    leave: { opacity: 0, display: "none", top: "calc(100% + 7px)" },
    reverse: isDeliveryDate1CalendarShown,
    config: { duration: 100 },
  });

  const deliveryDate2Transition = useTransition(isDeliveryDate2CalendarShown, {
    from: { opacity: 0, display: "block", top: "calc(100% + 7px)" },
    enter: { opacity: 1, display: "block", top: "calc(100% + 12px)" },
    leave: { opacity: 0, display: "none", top: "calc(100% + 7px)" },
    reverse: isDeliveryDate2CalendarShown,
    config: { duration: 100 },
  });

  const eventTransition = useTransition(dispatchEventItems.length > 0, {
    from: { opacity: 0, top: "calc(100% + 7px)" },
    enter: { opacity: 1, top: "calc(100% + 12px)" },
    leave: { opacity: 0, top: "calc(100% + 7px)" },
    config: { duration: 100 },
    reverse: dispatchEventItems.length > 0,
  });

  const dateEventTransition = useTransition(isDispatchEventDateCalendarShown, {
    from: { opacity: 0, display: "block", top: "calc(100% + 7px)" },
    enter: { opacity: 1, display: "block", top: "calc(100% + 12px)" },
    leave: { opacity: 0, display: "none", top: "calc(100% + 7px)" },
    reverse: isDispatchEventDateCalendarShown,
    config: { duration: 100 },
  });

  const changeCarrierTransition = useTransition(showingChangeCarrier, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    reverse: showingChangeCarrier,
    config: { duration: 100 },
  });

  const noteForDriverTransition = useTransition(
    selectedNoteForDriver?.id !== undefined,
    {
      from: { opacity: 0 },
      enter: { opacity: 1 },
      leave: { opacity: 0 },
      reverse: selectedNoteForDriver?.id !== undefined,
      config: { duration: 100 },
    }
  );

  const noteForCarrierTransition = useTransition(
    selectedNoteForCarrier?.id !== undefined,
    {
      from: { opacity: 0 },
      enter: { opacity: 1 },
      leave: { opacity: 0 },
      reverse: selectedNoteForCarrier?.id !== undefined,
      config: { duration: 100 },
    }
  );

  const internalNoteTransition = useTransition(
    selectedInternalNote?.id !== undefined,
    {
      from: { opacity: 0 },
      enter: { opacity: 1 },
      leave: { opacity: 0 },
      reverse: selectedInternalNote?.id !== undefined,
      config: { duration: 100 },
    }
  );

  useEffect(() => {
    if (dispatchEventItems.length === 0) {
      setShowDispatchEventSecondPageItems(false);
      setDispatchEventSecondPageItems([]);
    }
  }, [dispatchEventItems]);

  const dispatchClearBtnClick = () => {
    setSelectedOrder({});

    setSelectedBillToCustomer({});
    setSelectedBillToCustomerContact({});
    setSelectedShipperCustomer({});
    setSelectedShipperCustomerContact({});
    setSelectedConsigneeCustomer({});
    setSelectedConsigneeCustomerContact({});

    setShipperBolNumber("");
    setShipperPoNumber("");
    setShipperRefNumber("");

    setDispatchEvent({});
    setSelectedOrderEvent({});
    setDispatchEventLocation("");
    setDispatchEventNotes("");

    setSelectedNoteForCarrier({});
    setSelectedInternalNote({});
    setIsShowingShipperSecondPage(false);
    setIsShowingConsigneeSecondPage(false);

    setSelectedCarrier({});
    setSelectedCarrierDriver({});
    setSelectedCarrierInsurance({});
    setSelectedCarrierContact({});

    refOrderNumber.current.focus();
  };

  const getBillToCompanyByCode = (e) => {
    let key = e.keyCode || e.which;

    if (key === 9) {
      if (e.target.value !== "") {
        axios
          .post(props.serverUrl + "/customers", {
            code: e.target.value.toLowerCase(),
          })
          .then(async (res) => {
            if (res.data.result === "OK") {
              if (res.data.customers.length > 0) {
                setSelectedBillToCustomer(res.data.customers[0]);
                setSelectedBillToCustomerContact(
                  (res.data.customers[0].contacts || []).find(
                    (c) => c.is_primary === 1
                  ) || {}
                );

                let selected_order = { ...selectedOrder } || {
                  order_number: 0,
                };
                selected_order.bill_to_customer_id = res.data.customers[0].id;

                setSelectedOrder(selected_order);

                validateOrderForSaving({ keyCode: 9 });
              } else {
                setSelectedBillToCustomer({});
                setSelectedBillToCustomerContact({});
              }
            } else {
              setSelectedBillToCustomer({});
              setSelectedBillToCustomerContact({});
            }
          })
          .catch((e) => {
            console.log("error getting customers", e);
          });
      } else {
        setSelectedBillToCustomer({});
        setSelectedBillToCustomerContact({});
      }
    }
  };

  const getShipperCompanyByCode = (e) => {
    let key = e.keyCode || e.which;

    if (key === 9) {
      if (e.target.value !== "") {
        axios
          .post(props.serverUrl + "/customers", {
            code: e.target.value.toLowerCase(),
          })
          .then((res) => {
            if (res.data.result === "OK") {
              if (res.data.customers.length > 0) {
                if ((selectedOrder?.id || 0) > 0) {
                  setSelectedOrder((selectedOrder) => {
                    return {
                      ...selectedOrder,
                      pickups: (selectedOrder?.pickups || []).map((p, i) => {
                        if (
                          p.id === (selectedShipperCustomer?.pickup_id || 0)
                        ) {
                          p.order_id = selectedOrder.id;
                          p.customer = res.data.customers[0];
                          p.customer_id = res.data.customers[0].id;

                          setSelectedShipperCustomer({
                            ...res.data.customers[0],
                            ...p,
                            customer: {},
                            pickup_id: p.id,
                          });

                          setSelectedShipperCustomerContact(
                            (res.data.customers[0].contacts || []).find(
                              (c) => c.is_primary === 1
                            ) || {}
                          );

                          setIsSavingPickupId(p.id);
                        }
                        return p;
                      }),
                    };
                  });

                  new Promise((resolve, reject) => {
                    setIsShowingShipperSecondPage(true);
                    resolve("OK");
                  })
                    .then((response) => {
                      refPickupDate1.current.inputElement.focus();
                    })
                    .catch((e) => {
                      console.log(e);
                    });
                } else {
                  setSelectedOrder((selectedOrder) => {
                    return {
                      ...selectedOrder,
                      pickups: (selectedOrder?.pickups || []).map((p, i) => {
                        if (
                          p.id === (selectedShipperCustomer?.pickup_id || 0)
                        ) {
                          p.customer = res.data.customers[0];
                          p.customer_id = res.data.customers[0].id;

                          setSelectedShipperCustomer({
                            ...res.data.customers[0],
                            ...p,
                            customer: {},
                            pickup_id: p.id,
                          });

                          setSelectedShipperCustomerContact(
                            (res.data.customers[0].contacts || []).find(
                              (c) => c.is_primary === 1
                            ) || {}
                          );
                        }
                        return p;
                      }),
                    };
                  });

                  if (
                    (selectedOrder?.pickups || []).length <= 1 &&
                    (selectedBillToCustomer?.id || 0) === 0
                  ) {
                    if (
                      (res.data.customers[0].mailing_address?.bill_to_code ||
                        "") !== ""
                    ) {
                      axios
                        .post(props.serverUrl + "/customers", {
                          code:
                            (res.data.customers[0].mailing_address
                              ?.bill_to_code || "") +
                            ((res.data.customers[0].mailing_address
                              ?.bill_to_code_number || 0) === 0
                              ? ""
                              : res.data.customers[0].mailing_address
                                .bill_to_code_number),
                        })
                        .then((res) => {
                          if (res.data.result === "OK") {
                            if (res.data.customers.length > 0) {
                              setSelectedBillToCustomer(res.data.customers[0]);
                              setSelectedBillToCustomerContact(
                                (res.data.customers[0].contacts || []).find(
                                  (c) => c.is_primary === 1
                                ) || {}
                              );

                              setSelectedOrder({
                                ...selectedOrder,
                                ae_number:
                                  (selectedOrder?.ae_number || "") === ""
                                    ? getRandomInt(1, 100)
                                    : selectedOrder.ae_number,
                                bill_to_customer_id: res.data.customers[0].id,
                                pickups: (selectedOrder?.pickups || []).map(
                                  (pickup) => {
                                    pickup.toSave = pickup.id === 0;
                                    return pickup;
                                  }
                                ),
                              });

                              validateOrderForSaving({ keyCode: 9 });
                            }

                            refPickupDate1.current.inputElement.focus();
                          }
                        })
                        .catch((e) => {
                          console.log("error getting customers", e);
                        });
                    } else {
                      refPickupDate1.current.inputElement.focus();
                    }
                  } else {
                    refPickupDate1.current.inputElement.focus();
                  }
                }
              } else {
                setSelectedShipperCustomer({});
                setSelectedShipperCustomerContact({});
              }
            } else {
              setSelectedShipperCustomer({});
              setSelectedShipperCustomerContact({});
            }
          })
          .catch((e) => {
            console.log("error getting customers", e);
          });
      }
    }
  };

  const getConsigneeCompanyByCode = (e) => {
    let key = e.keyCode || e.which;

    if (key === 9) {
      if (e.target.value !== "") {
        if ((selectedOrder?.id || 0) === 0) {
          e.preventDefault();
          window.alert("You must create or load an order first!");
          setSelectedConsigneeCustomer({});
          setSelectedConsigneeCustomerContact({});
          setSelectedOrder((selectedOrder) => {
            return { ...selectedOrder, deliveries: [] };
          });
          return;
        }

        setIsLoading(true);
        axios
          .post(props.serverUrl + "/customers", {
            code: e.target.value.toLowerCase(),
          })
          .then(async (res) => {
            if (res.data.result === "OK") {
              if (res.data.customers.length > 0) {
                let delivery_id = -1;

                setSelectedOrder({
                  ...selectedOrder,
                  deliveries: (selectedOrder?.deliveries || []).map((d, i) => {
                    if (
                      d.id === (selectedConsigneeCustomer?.delivery_id || 0)
                    ) {
                      d.order_id = selectedOrder.id;
                      d.customer = res.data.customers[0];
                      d.customer_id = res.data.customers[0].id;

                      let consignee = { ...res.data.customers[0] };
                      consignee = { ...consignee, ...d };
                      consignee.customer = {};
                      consignee.delivery_id = d.id;

                      setSelectedConsigneeCustomer(consignee);
                      setSelectedConsigneeCustomerContact(
                        (consignee.contacts || []).find(
                          (c) => c.is_primary === 1
                        ) || {}
                      );

                      delivery_id = d.id;
                    }
                    return d;
                  }),
                });

                setIsSavingDeliveryId(delivery_id);

                new Promise((resolve, reject) => {
                  setIsShowingConsigneeSecondPage(true);
                })
                  .then((response) => {
                    refDeliveryDate1.current.inputElement.focus();
                  })
                  .catch((e) => {
                    console.log(e);
                  });
              } else {
                setSelectedConsigneeCustomer({});
                setSelectedConsigneeCustomerContact({});
              }
            } else {
              setSelectedConsigneeCustomer({});
              setSelectedConsigneeCustomerContact({});
            }

            setIsLoading(false);
          })
          .catch((e) => {
            console.log("error getting customers", e);
            setIsLoading(false);
          });
      }
    }
  };

  const billToCompanySearch = () => {
    let companySearch = [
      {
        field: "Name",
        data: (selectedBillToCustomer.name || "").toLowerCase(),
      },
      {
        field: "City",
        data: (selectedBillToCustomer.city || "").toLowerCase(),
      },
      {
        field: "State",
        data: (selectedBillToCustomer.state || "").toLowerCase(),
      },
      {
        field: "Postal Code",
        data: selectedBillToCustomer.zip || "",
      },
      {
        field: "Contact Name",
        data: (selectedBillToCustomer.contact_name || "").toLowerCase(),
      },
      {
        field: "Contact Phone",
        data: selectedBillToCustomer.contact_phone || "",
      },
      {
        field: "E-Mail",
        data: (selectedBillToCustomer.email || "").toLowerCase(),
      },
    ];

    let panel = {
      panelName: `${props.panelName}-customer-search`,
      component: (
        <CustomerSearch
          title="Customer Search Results"
          tabTimes={29000}
          panelName={`${props.panelName}-customer-search`}
          origin={props.origin}
          openPanel={props.openPanel}
          closePanel={props.closePanel}
          componentId={moment().format("x")}
          customerSearch={companySearch}
          callback={(customer) => {
            new Promise((resolve, reject) => {
              if (customer) {
                setSelectedBillToCustomer(customer);
                setSelectedBillToCustomerContact(
                  (customer.contacts || []).find((c) => c.is_primary === 1) ||
                  {}
                );

                let selected_order = { ...selectedOrder } || {
                  order_number: 0,
                };
                selected_order.bill_to_customer_id = customer.id;

                setSelectedOrder(selected_order);

                setIsLoading(true);
                validateOrderForSaving({ keyCode: 9 });
                refShipperCompanyCode.current.focus();

                resolve("OK");
              } else {
                reject("no customer");
              }
            })
              .then((response) => {
                if (response === "OK") {
                  props.closePanel(
                    `${props.panelName}-customer-search`,
                    props.origin
                  );
                }
              })
              .catch((e) => {
                props.closePanel(
                  `${props.panelName}-customer-search`,
                  props.origin
                );
                setSelectedBillToCustomer({});
                setSelectedBillToCustomerContact({});
                refBillToCompanyCode.current.focus();
              });
          }}
        />
      ),
    };

    props.openPanel(panel, props.origin);
  };

  const shipperCompanySearch = () => {
    let companySearch = [
      {
        field: "Name",
        data: (selectedShipperCustomer.name || "").toLowerCase(),
      },
      {
        field: "City",
        data: (selectedShipperCustomer.city || "").toLowerCase(),
      },
      {
        field: "State",
        data: (selectedShipperCustomer.state || "").toLowerCase(),
      },
      {
        field: "Postal Code",
        data: selectedShipperCustomer.zip || "",
      },
      {
        field: "Contact Name",
        data: (selectedShipperCustomer.contact_name || "").toLowerCase(),
      },
      {
        field: "Contact Phone",
        data: selectedShipperCustomer.contact_phone || "",
      },
      {
        field: "E-Mail",
        data: (selectedShipperCustomer.email || "").toLowerCase(),
      },
    ];

    let panel = {
      panelName: `${props.panelName}-customer-search`,
      component: (
        <CustomerSearch
          title="Customer Search Results"
          tabTimes={29000}
          panelName={`${props.panelName}-customer-search`}
          origin={props.origin}
          openPanel={props.openPanel}
          closePanel={props.closePanel}
          componentId={moment().format("x")}
          customerSearch={companySearch}
          callback={(customer) => {
            new Promise((resolve, reject) => {
              if (customer) {
                if ((selectedOrder?.id || 0) > 0) {
                  setSelectedOrder((selectedOrder) => {
                    return {
                      ...selectedOrder,
                      pickups: (selectedOrder?.pickups || []).map((p, i) => {
                        if (
                          p.id === (selectedShipperCustomer?.pickup_id || 0)
                        ) {
                          p.order_id = selectedOrder.id;
                          p.customer = customer;
                          p.customer_id = customer.id;

                          setSelectedShipperCustomer({
                            ...customer,
                            ...p,
                            customer: {},
                            pickup_id: p.id,
                          });

                          setSelectedShipperCustomerContact(
                            (customer.contacts || []).find(
                              (c) => c.is_primary === 1
                            ) || {}
                          );

                          setIsSavingPickupId(p.id);
                        }
                        return p;
                      }),
                    };
                  });

                  setIsShowingShipperSecondPage(true);
                } else {
                  if ((selectedOrder?.pickups || []).length === 0) {
                    setSelectedOrder((selectedOrder) => {
                      return {
                        ...selectedOrder,
                        pickups: [
                          {
                            id: 0,
                            customer: { ...customer },
                            customer_id: customer.id,
                          },
                        ],
                      };
                    });

                    setSelectedShipperCustomer({
                      ...customer,
                      customer: {},
                      pickup_id: 0,
                    });

                    setSelectedShipperCustomerContact(
                      (customer.contacts || []).find(
                        (c) => c.is_primary === 1
                      ) || {}
                    );
                  } else {
                    setSelectedOrder((selectedOrder) => {
                      return {
                        ...selectedOrder,
                        pickups: (selectedOrder?.pickups || []).map((p, i) => {
                          if (
                            p.id === (selectedShipperCustomer?.pickup_id || 0)
                          ) {
                            p.customer = customer;
                            p.customer_id = customer.id;

                            setSelectedShipperCustomer({
                              ...customer,
                              ...p,
                              customer: {},
                              pickup_id: p.id,
                            });

                            setSelectedShipperCustomerContact(
                              (customer.contacts || []).find(
                                (c) => c.is_primary === 1
                              ) || {}
                            );
                          }
                          return p;
                        }),
                      };
                    });
                  }

                  if (
                    (selectedOrder?.pickups || []).length <= 1 &&
                    (selectedBillToCustomer?.id || 0) === 0
                  ) {
                    if ((customer.mailing_address?.bill_to_code || "") !== "") {
                      setIsLoading(true);
                      axios
                        .post(props.serverUrl + "/customers", {
                          code:
                            (customer.mailing_address?.bill_to_code || "") +
                            ((customer.mailing_address?.bill_to_code_number ||
                              0) === 0
                              ? ""
                              : customer.mailing_address.bill_to_code_number),
                        })
                        .then((res) => {
                          if (res.data.result === "OK") {
                            if (res.data.customers.length > 0) {
                              setSelectedBillToCustomer(res.data.customers[0]);
                              setSelectedBillToCustomerContact(
                                (res.data.customers[0].contacts || []).find(
                                  (c) => c.is_primary === 1
                                ) || {}
                              );

                              setSelectedOrder((selectedOrder) => {
                                return {
                                  ...selectedOrder,
                                  ae_number:
                                    (selectedOrder?.ae_number || "") === ""
                                      ? getRandomInt(1, 100)
                                      : selectedOrder.ae_number,
                                  bill_to_customer_id: res.data.customers[0].id,
                                  pickups: (selectedOrder?.pickups || []).map(
                                    (pickup) => {
                                      pickup.toSave = pickup.id === 0;
                                      return pickup;
                                    }
                                  ),
                                };
                              });

                              validateOrderForSaving({ keyCode: 9 });
                            }

                            setIsShowingShipperSecondPage(true);
                          }
                          setIsLoading(false);
                        })
                        .catch((e) => {
                          console.log("error getting customers", e);
                          setIsLoading(false);
                        });
                    } else {
                      setIsShowingShipperSecondPage(true);
                    }
                  } else {
                    setIsShowingShipperSecondPage(true);
                  }
                }

                resolve("OK");
              } else {
                reject("no customer");
              }
            })
              .then((response) => {
                props.closePanel(
                  `${props.panelName}-customer-search`,
                  props.origin
                );
              })
              .catch((e) => {
                setSelectedShipperCustomer({});
                setSelectedShipperCustomerContact({});
                refShipperCompanyCode.current.focus();
              });
          }}
        />
      ),
    };

    props.openPanel(panel, props.origin);
  };

  const consigneeCompanySearch = () => {
    if ((selectedOrder?.id || 0) === 0) {
      window.alert("You must create or load an order first!");
      setSelectedConsigneeCustomer({});
      setSelectedConsigneeCustomerContact({});
      setSelectedOrder((selectedOrder) => {
        return { ...selectedOrder, deliveries: [] };
      });
      return;
    }

    let companySearch = [
      {
        field: "Name",
        data: (selectedConsigneeCustomer.name || "").toLowerCase(),
      },
      {
        field: "City",
        data: (selectedConsigneeCustomer.city || "").toLowerCase(),
      },
      {
        field: "State",
        data: (selectedConsigneeCustomer.state || "").toLowerCase(),
      },
      {
        field: "Postal Code",
        data: selectedConsigneeCustomer.zip || "",
      },
      {
        field: "Contact Name",
        data: (selectedConsigneeCustomer.contact_name || "").toLowerCase(),
      },
      {
        field: "Contact Phone",
        data: selectedConsigneeCustomer.contact_phone || "",
      },
      {
        field: "E-Mail",
        data: (selectedConsigneeCustomer.email || "").toLowerCase(),
      },
    ];

    let panel = {
      panelName: `${props.panelName}-customer-search`,
      component: (
        <CustomerSearch
          title="Customer Search Results"
          tabTimes={29000}
          panelName={`${props.panelName}-customer-search`}
          origin={props.origin}
          openPanel={props.openPanel}
          closePanel={props.closePanel}
          suborigin={"customer"}
          componentId={moment().format("x")}
          customerSearch={companySearch}
          callback={(customer) => {
            new Promise((resolve, reject) => {
              if (customer) {
                let delivery_id = -1;

                setSelectedOrder({
                  ...selectedOrder,
                  deliveries: (selectedOrder?.deliveries || []).map((d, i) => {
                    if (
                      d.id === (selectedConsigneeCustomer?.delivery_id || 0)
                    ) {
                      d.order_id = selectedOrder.id;
                      d.customer = customer;
                      d.customer_id = customer.id;

                      let consignee = { ...customer };
                      consignee = { ...consignee, ...d };
                      consignee.customer = {};
                      consignee.delivery_id = d.id;

                      setSelectedConsigneeCustomer(consignee);
                      setSelectedConsigneeCustomerContact(
                        (consignee.contacts || []).find(
                          (c) => c.is_primary === 1
                        ) || {}
                      );

                      delivery_id = d.id;
                    }
                    return d;
                  }),
                });

                setIsSavingDeliveryId(delivery_id);

                refDeliveryDate1.current.inputElement.focus();

                resolve("OK");
              } else {
                reject("no customer");
              }
            })
              .then((response) => {
                if (response === "OK") {
                  props.closePanel(
                    `${props.panelName}-customer-search`,
                    props.origin
                  );
                }
              })
              .catch((e) => {
                props.closePanel(
                  `${props.panelName}-customer-search`,
                  props.origin
                );
                setSelectedConsigneeCustomer({});
                setSelectedConsigneeCustomerContact({});
                refConsigneeCompanyCode.current.focus();
              });
          }}
        />
      ),
    };

    props.openPanel(panel, props.origin);
  };

  const getCarrierInfoByCode = (e) => {
    let keyCode = e.keyCode || e.which;

    if (keyCode === 9) {
      if (e.target.value.trim() !== "") {
        if ((selectedOrder?.id || 0) === 0) {
          e.preventDefault();
          window.alert("You must create or load an order first!");
          setSelectedCarrier({});
          setSelectedCarrierContact({});
          setSelectedCarrierDriver({});
          return;
        }

        axios.post(props.serverUrl + "/carriers", {code: e.target.value.toLowerCase()}).then((res) => {
            if (res.data.result === "OK") {
              if (res.data.carriers.length > 0) {
                setSelectedCarrier(res.data.carriers[0]);

                res.data.carriers[0].contacts.map((c) => {
                  if (c.is_primary === 1) {
                    setSelectedCarrierContact(c);
                  }
                  return true;
                });

                setSelectedCarrierInsurance({});

                let selected_order = { ...selectedOrder } || {
                  order_number: 0,
                };

                selected_order.bill_to_customer_id =
                  selectedBillToCustomer?.id || 0;
                selected_order.shipper_customer_id =
                  selectedShipperCustomer?.id || 0;
                selected_order.consignee_customer_id =
                  selectedConsigneeCustomer?.id || 0;
                selected_order.carrier_id = res.data.carriers[0].id;

                if (res.data.carriers[0].drivers.length > 0) {
                  setSelectedCarrierDriver({
                    ...res.data.carriers[0].drivers[0],
                    name:
                      res.data.carriers[0].drivers[0].first_name +
                      (res.data.carriers[0].drivers[0].last_name.trim() === ""
                        ? ""
                        : " " + res.data.carriers[0].drivers[0].last_name),
                  });
                  selected_order.carrier_driver_id = res.data.carriers[0].drivers[0].id;
                  selected_order.equipment = res.data.carriers[0].drivers[0].equipment;
                  selected_order.equipment_id = res.data.carriers[0].drivers[0].equipment_id;
                }

                if ((selected_order.ae_number || "") === "") {
                  selected_order.ae_number = getRandomInt(1, 100);
                }

                if (
                  (selected_order.events || []).find(
                    (el) => el.event_type === "carrier asigned"
                  ) === undefined
                ) {
                  let event_parameters = {
                    order_id: selected_order.id,
                    time: moment().format("HHmm"),
                    event_time: moment().format("HHmm"),
                    date: moment().format("MM/DD/YYYY"),
                    event_date: moment().format("MM/DD/YYYY"),
                    user_id: selected_order.ae_number,
                    event_location: "",
                    event_notes:
                      "Assigned Carrier " +
                      res.data.carriers[0].code +
                      (res.data.carriers[0].code_number === 0
                        ? ""
                        : res.data.carriers[0].code_number) +
                      " - " +
                      res.data.carriers[0].name,
                    event_type_id: 2,
                    new_carrier_id: res.data.carriers[0].id,
                  };

                  axios
                    .post(props.serverUrl + "/saveOrderEvent", event_parameters)
                    .then(async (res) => {
                      if (res.data.result === "OK") {
                        axios
                          .post(props.serverUrl + "/saveOrder", selected_order)
                          .then((res) => {
                            if (res.data.result === "OK") {
                              setSelectedOrder(res.data.order);

                              props.setSelectedOrder({
                                ...res.data.order,
                                component_id: props.componentId,
                              });
                            }

                            setIsSavingOrder(false);
                          })
                          .catch((e) => {
                            console.log("error saving order", e);
                            setIsSavingOrder(false);
                          });
                      } else if (res.data.result === "ORDER ID NOT VALID") {
                        window.alert("The order number is not valid!");
                        goToTabindex((74 + props.tabTimes).toString());
                      }
                    })
                    .catch((e) => {
                      console.log("error saving order event", e);
                    });
                } else {
                  if (!isSavingOrder) {
                    setIsSavingOrder(true);
                    axios
                      .post(props.serverUrl + "/saveOrder", selected_order)
                      .then((res) => {
                        if (res.data.result === "OK") {
                          setSelectedOrder(res.data.order);

                          props.setSelectedOrder({
                            ...res.data.order,
                            component_id: props.componentId,
                          });
                        }

                        setIsSavingOrder(false);
                      })
                      .catch((e) => {
                        console.log("error saving order", e);
                        setIsSavingOrder(false);
                      });
                  }
                }
              } else {
                setSelectedCarrier({});
                setSelectedCarrierDriver({});
                setSelectedCarrierInsurance({});
                setSelectedCarrierContact({});
              }
            } else {
              setSelectedCarrier({});
              setSelectedCarrierDriver({});
              setSelectedCarrierInsurance({});
              setSelectedCarrierContact({});
            }
          })
          .catch((e) => {
            console.log("error getting carriers", e);
          });
      } else {
        setSelectedCarrier({});
        setSelectedCarrierDriver({});
        setSelectedCarrierInsurance({});
        setSelectedCarrierContact({});
      }
    }
  };

  const insuranceStatusClasses = () => {
    let classes = "input-box-container insurance-status";
    let curDate = moment().startOf("day");
    let curDate2 = moment();
    let futureMonth = curDate2.add(1, "M");
    let statusClass = "";

    (selectedCarrier.insurances || []).map((insurance, index) => {
      let expDate = moment(insurance.expiration_date, "MM/DD/YYYY");

      if (expDate < curDate) {
        statusClass = "expired";
      } else if (expDate >= curDate && expDate <= futureMonth) {
        if (statusClass !== "expired") {
          statusClass = "warning";
        }
      } else {
        if (statusClass !== "expired" && statusClass !== "warning") {
          statusClass = "active";
        }
      }
    });

    return classes + " " + statusClass;
  };

  const goToTabindex = (index) => {
    let elems = document.getElementsByTagName("input");

    for (var i = elems.length; i--;) {
      if (
        elems[i].getAttribute("tabindex") &&
        elems[i].getAttribute("tabindex") === index
      ) {
        elems[i].focus();
        break;
      }
    }
  };

  const getFormattedDates = (date) => {
    let formattedDate = date;

    try {
      if (moment(date.trim(), "MM/DD/YY").format("MM/DD/YY") === date.trim()) {
        formattedDate = moment(date.trim(), "MM/DD/YY").format("MM/DD/YYYY");
      }

      if (moment(date.trim(), "MM/DD/").format("MM/DD/") === date.trim()) {
        formattedDate = moment(date.trim(), "MM/DD/").format("MM/DD/YYYY");
      }

      if (moment(date.trim(), "MM/DD").format("MM/DD") === date.trim()) {
        formattedDate = moment(date.trim(), "MM/DD").format("MM/DD/YYYY");
      }

      if (moment(date.trim(), "MM/").format("MM/") === date.trim()) {
        formattedDate = moment(date.trim(), "MM/").format("MM/DD/YYYY");
      }

      if (moment(date.trim(), "MM").format("MM") === date.trim()) {
        formattedDate = moment(date.trim(), "MM").format("MM/DD/YYYY");
      }

      if (moment(date.trim(), "M/D/Y").format("M/D/Y") === date.trim()) {
        formattedDate = moment(date.trim(), "M/D/Y").format("MM/DD/YYYY");
      }

      if (moment(date.trim(), "MM/D/Y").format("MM/D/Y") === date.trim()) {
        formattedDate = moment(date.trim(), "MM/D/Y").format("MM/DD/YYYY");
      }

      if (moment(date.trim(), "MM/DD/Y").format("MM/DD/Y") === date.trim()) {
        formattedDate = moment(date.trim(), "MM/DD/Y").format("MM/DD/YYYY");
      }

      if (moment(date.trim(), "M/DD/Y").format("M/DD/Y") === date.trim()) {
        formattedDate = moment(date.trim(), "M/DD/Y").format("MM/DD/YYYY");
      }

      if (moment(date.trim(), "M/D/YY").format("M/D/YY") === date.trim()) {
        formattedDate = moment(date.trim(), "M/D/YY").format("MM/DD/YYYY");
      }

      if (moment(date.trim(), "M/D/YYYY").format("M/D/YYYY") === date.trim()) {
        formattedDate = moment(date.trim(), "M/D/YYYY").format("MM/DD/YYYY");
      }

      if (
        moment(date.trim(), "MM/D/YYYY").format("MM/D/YYYY") === date.trim()
      ) {
        formattedDate = moment(date.trim(), "MM/D/YYYY").format("MM/DD/YYYY");
      }

      if (
        moment(date.trim(), "MM/DD/YYYY").format("MM/DD/YYYY") === date.trim()
      ) {
        formattedDate = moment(date.trim(), "MM/DD/YYYY").format("MM/DD/YYYY");
      }

      if (
        moment(date.trim(), "M/DD/YYYY").format("M/DD/YYYY") === date.trim()
      ) {
        formattedDate = moment(date.trim(), "M/DD/YYYY").format("MM/DD/YYYY");
      }

      if (moment(date.trim(), "M/D/").format("M/D/") === date.trim()) {
        formattedDate = moment(date.trim(), "M/D/").format("MM/DD/YYYY");
      }

      if (moment(date.trim(), "M/D").format("M/D") === date.trim()) {
        formattedDate = moment(date.trim(), "M/D").format("MM/DD/YYYY");
      }

      if (moment(date.trim(), "MM/D").format("MM/D") === date.trim()) {
        formattedDate = moment(date.trim(), "MM/D").format("MM/DD/YYYY");
      }

      if (moment(date.trim(), "M").format("M") === date.trim()) {
        formattedDate = moment(date.trim(), "M").format("MM/DD/YYYY");
      }
    } catch (e) {
      console.log(e);
    }

    return formattedDate;
  };

  const getFormattedHours = (hour) => {
    let formattedHour = hour;

    try {
      if (moment(hour.trim(), "HH:mm").format("HH:mm") === hour.trim()) {
        formattedHour = moment(hour.trim(), "HH:mm").format("HHmm");
      }

      if (moment(hour.trim(), "H:mm").format("H:mm") === hour.trim()) {
        formattedHour = moment(hour.trim(), "H:mm").format("HHmm");
      }

      if (moment(hour.trim(), "Hmm").format("Hmm") === hour.trim()) {
        formattedHour = moment(hour.trim(), "Hmm").format("HHmm");
      }

      if (moment(hour.trim(), "hh:mm a").format("hh:mm a") === hour.trim()) {
        formattedHour = moment(hour.trim(), "hh:mm a").format("HHmm");
      }

      if (moment(hour.trim(), "h:mm a").format("h:mm a") === hour.trim()) {
        formattedHour = moment(hour.trim(), "h:mm a").format("HHmm");
      }

      if (moment(hour.trim(), "hh:mma").format("hh:mma") === hour.trim()) {
        formattedHour = moment(hour.trim(), "hh:mma").format("HHmm");
      }

      if (moment(hour.trim(), "h:mma").format("h:mma") === hour.trim()) {
        formattedHour = moment(hour.trim(), "h:mma").format("HHmm");
      }

      if (moment(hour.trim(), "hhmm a").format("hhmm a") === hour.trim()) {
        formattedHour = moment(hour.trim(), "hhmm a").format("HHmm");
      }

      if (moment(hour.trim(), "hmm a").format("hmm a") === hour.trim()) {
        formattedHour = moment(hour.trim(), "hmm a").format("HHmm");
      }

      if (moment(hour.trim(), "hhmma").format("hhmma") === hour.trim()) {
        formattedHour = moment(hour.trim(), "hhmma").format("HHmm");
      }

      if (moment(hour.trim(), "hmma").format("hmma") === hour.trim()) {
        formattedHour = moment(hour.trim(), "hmma").format("HHmm");
      }

      if (moment(hour.trim(), "H").format("H") === hour.trim()) {
        formattedHour = moment(hour.trim(), "H").format("HHmm");
      }

      if (moment(hour.trim(), "HH").format("HH") === hour.trim()) {
        formattedHour = moment(hour.trim(), "HH").format("HHmm");
      }

      if (moment(hour.trim(), "h a").format("h a") === hour.trim()) {
        formattedHour = moment(hour.trim(), "h a").format("HHmm");
      }

      if (moment(hour.trim(), "hh a").format("hh a") === hour.trim()) {
        formattedHour = moment(hour.trim(), "hh a").format("HHmm");
      }

      if (moment(hour.trim(), "ha").format("ha") === hour.trim()) {
        formattedHour = moment(hour.trim(), "ha").format("HHmm");
      }

      if (moment(hour.trim(), "hha").format("hha") === hour.trim()) {
        formattedHour = moment(hour.trim(), "hha").format("HHmm");
      }

      if (moment(hour.trim(), "h:ma").format("h:ma") === hour.trim()) {
        formattedHour = moment(hour.trim(), "h:ma").format("HHmm");
      }

      if (moment(hour.trim(), "H:m").format("H:m") === hour.trim()) {
        formattedHour = moment(hour.trim(), "H:m").format("HHmm");
      }
    } catch (e) {
      console.log(e);
    }

    return formattedHour;
  };

  const searchCarrierBtnClick = () => {
    if ((selectedOrder?.id || 0) === 0) {
      window.alert("You must create or load an order first!");
      return;
    }

    let carrierSearch = [
      {
        field: "Name",
        data: (selectedCarrier.name || "").toLowerCase(),
      },
      {
        field: "City",
        data: (selectedCarrier.city || "").toLowerCase(),
      },
      {
        field: "State",
        data: (selectedCarrier.state || "").toLowerCase(),
      },
      {
        field: "Postal Code",
        data: selectedCarrier.zip || "",
      },
      {
        field: "Contact Name",
        data: (selectedCarrier.contact_name || "").toLowerCase(),
      },
      {
        field: "Contact Phone",
        data: selectedCarrier.contact_phone || "",
      },
      {
        field: "E-Mail",
        data: (selectedCarrier.email || "").toLowerCase(),
      },
    ];

    let panel = {
      panelName: `${props.panelName}-carrier-search`,
      component: (
        <CustomerSearch
          title="Carrier Search Results"
          tabTimes={69000}
          panelName={`${props.panelName}-carrier-search`}
          origin={props.origin}
          openPanel={props.openPanel}
          closePanel={props.closePanel}
          suborigin={"carrier"}
          componentId={moment().format("x")}
          customerSearch={carrierSearch}
          callback={(carrier) => {
            new Promise((resolve, reject) => {
              if (carrier) {
                setSelectedCarrier({ ...carrier });
                setSelectedCarrierContact(
                  (carrier.contacts || []).find((c) => c.is_primary === 1) || {}
                );
                setSelectedCarrierInsurance({});

                let selected_order = { ...selectedOrder } || {
                  order_number: 0,
                };

                selected_order.bill_to_customer_id =
                  selectedBillToCustomer?.id || 0;
                selected_order.shipper_customer_id =
                  selectedShipperCustomer?.id || 0;
                selected_order.consignee_customer_id =
                  selectedConsigneeCustomer?.id || 0;
                selected_order.carrier_id = carrier.id;

                if (carrier.drivers.length > 0) {
                  setSelectedCarrierDriver({
                    ...carrier.drivers[0],
                    name:
                      carrier.drivers[0].first_name +
                      (carrier.drivers[0].last_name.trim() === ""
                        ? ""
                        : " " + carrier.drivers[0].last_name),
                  });
                  selected_order.carrier_driver_id = carrier.drivers[0].id;
                }

                if ((selected_order.ae_number || "") === "") {
                  selected_order.ae_number = getRandomInt(1, 100);
                }

                if (
                  (selected_order.events || []).find(
                    (el) => el.event_type === "carrier asigned"
                  ) === undefined
                ) {
                  let event_parameters = {
                    order_id: selected_order.id,
                    time: moment().format("HHmm"),
                    event_time: moment().format("HHmm"),
                    date: moment().format("MM/DD/YYYY"),
                    event_date: moment().format("MM/DD/YYYY"),
                    user_id: selected_order.ae_number,
                    event_location: "",
                    event_notes:
                      "Assigned Carrier " +
                      carrier.code +
                      (carrier.code_number === 0 ? "" : carrier.code_number) +
                      " - " +
                      carrier.name,
                    event_type_id: 2,
                    new_carrier_id: carrier.id,
                  };

                  setIsLoading(true);

                  axios
                    .post(props.serverUrl + "/saveOrderEvent", event_parameters)
                    .then(async (res) => {
                      if (res.data.result === "OK") {
                        axios
                          .post(props.serverUrl + "/saveOrder", selected_order)
                          .then((res) => {
                            if (res.data.result === "OK") {
                              setSelectedOrder(res.data.order);

                              props.setSelectedOrder({
                                ...res.data.order,
                                component_id: props.componentId,
                              });
                            }

                            setIsSavingOrder(false);
                          })
                          .catch((e) => {
                            console.log("error saving order", e);
                            setIsSavingOrder(false);
                          });
                      } else if (res.data.result === "ORDER ID NOT VALID") {
                        window.alert("The order number is not valid!");
                        goToTabindex((74 + props.tabTimes).toString());
                      }
                      setIsLoading(false);
                    })
                    .catch((e) => {
                      console.log("error saving order event", e);
                      setIsLoading(false);
                    });
                } else {
                  if (!isSavingOrder) {
                    setIsSavingOrder(true);
                    setIsLoading(true);
                    axios
                      .post(props.serverUrl + "/saveOrder", selected_order)
                      .then(async (res) => {
                        if (res.data.result === "OK") {
                          setSelectedOrder({ ...res.data.order });

                          props.setSelectedOrder({
                            ...res.data.order,
                            component_id: props.componentId,
                          });
                        }

                        setIsSavingOrder(false);
                        setIsLoading(false);
                      })
                      .catch((e) => {
                        console.log("error saving order", e);
                        setIsSavingOrder(false);
                        setIsLoading(false);
                      });
                  }
                }
                resolve("OK");
              } else {
                reject("no carrier");
              }
            })
              .then((response) => {
                if (response === "OK") {
                  props.closePanel(
                    `${props.panelName}-carrier-search`,
                    props.origin
                  );
                }
              })
              .catch((e) => {
                props.closePanel(
                  `${props.panelName}-carrier-search`,
                  props.origin
                );
                refCarrierCode.current.focus();
              });
          }}
        />
      ),
    };

    props.openPanel(panel, props.origin);
  };

  const validateBillToCompanyInfoForSaving = (e) => {
    let keyCode = e.keyCode || e.which;

    if (keyCode === 9) {
      clearTimeout(delayTimer);
      delayTimer = null;

      if ((selectedBillToCustomer.id || 0) === 0) {
        return;
      }

      delayTimer = window.setTimeout(() => {
        let selectedBillToCompanyInfo = selectedBillToCustomer;

        if (
          selectedBillToCompanyInfo.id === undefined ||
          selectedBillToCompanyInfo.id === -1
        ) {
          selectedBillToCompanyInfo.id = 0;
          setSelectedBillToCustomer({ ...selectedBillToCustomer, id: 0 });
        }

        if (
          (selectedBillToCompanyInfo.name || "")
            .trim()
            .replace(/\s/g, "")
            .replace("&", "A") !== "" &&
          (selectedBillToCompanyInfo.city || "").trim().replace(/\s/g, "") !==
          "" &&
          (selectedBillToCompanyInfo.state || "").trim().replace(/\s/g, "") !==
          "" &&
          (selectedBillToCompanyInfo.address1 || "").trim() !== "" &&
          (selectedBillToCompanyInfo.zip || "").trim() !== ""
        ) {
          let parseCity = selectedBillToCompanyInfo.city
            .trim()
            .replace(/\s/g, "")
            .substring(0, 3);

          if (parseCity.toLowerCase() === "ft.") {
            parseCity = "FO";
          }
          if (parseCity.toLowerCase() === "mt.") {
            parseCity = "MO";
          }
          if (parseCity.toLowerCase() === "st.") {
            parseCity = "SA";
          }

          let mailingParseCity = (selectedBillToCompanyInfo.mailing_city || "")
            .trim()
            .replace(/\s/g, "")
            .substring(0, 3);

          if (mailingParseCity.toLowerCase() === "ft.") {
            mailingParseCity = "FO";
          }
          if (mailingParseCity.toLowerCase() === "mt.") {
            mailingParseCity = "MO";
          }
          if (mailingParseCity.toLowerCase() === "st.") {
            mailingParseCity = "SA";
          }

          let newCode =
            (selectedBillToCompanyInfo.name || "")
              .trim()
              .replace(/\s/g, "")
              .replace("&", "A")
              .substring(0, 3) +
            parseCity.substring(0, 2) +
            (selectedBillToCompanyInfo.state || "")
              .trim()
              .replace(/\s/g, "")
              .substring(0, 2);
          let mailingNewCode =
            (selectedBillToCompanyInfo.mailing_name || "")
              .trim()
              .replace(/\s/g, "")
              .replace("&", "A")
              .substring(0, 3) +
            mailingParseCity.substring(0, 2) +
            (selectedBillToCompanyInfo.mailing_state || "")
              .trim()
              .replace(/\s/g, "")
              .substring(0, 2);

          selectedBillToCompanyInfo.code = newCode.toUpperCase();
          selectedBillToCompanyInfo.mailing_code = mailingNewCode.toUpperCase();

          if (!isSavingBillToCompanyInfo) {
            setIsSavingBillToCompanyInfo(true);

            axios
              .post(
                props.serverUrl + "/saveCustomer",
                selectedBillToCompanyInfo
              )
              .then((res) => {
                if (res.data.result === "OK") {
                  if (
                    selectedBillToCustomer.id === undefined ||
                    (selectedBillToCustomer.id || 0) === 0
                  ) {
                    setSelectedBillToCustomer((selectedBillToCustomer) => {
                      return {
                        ...selectedBillToCustomer,
                        id: res.data.customer.id,
                      };
                    });
                  }

                  setSelectedBillToCustomerContact(
                    res.data.customer.contacts ||
                    [].find((c) => c.is_primary === 1) ||
                    {}
                  );

                  if (
                    selectedShipperCustomer?.id !== undefined &&
                    selectedShipperCustomer.id > 0 &&
                    selectedShipperCustomer.id === res.data.customer.id
                  ) {
                    setSelectedShipperCustomer({
                      ...selectedBillToCustomer,
                      id: res.data.customer.id,
                    });
                    setSelectedShipperCustomerContact(
                      res.data.customer.contacts ||
                      [].find((c) => c.is_primary === 1) ||
                      {}
                    );
                  }

                  if (
                    selectedConsigneeCustomer?.id !== undefined &&
                    selectedConsigneeCustomer.id > 0 &&
                    selectedConsigneeCustomer.id === res.data.customer.id
                  ) {
                    setSelectedConsigneeCustomer({
                      ...selectedBillToCustomer,
                      id: res.data.customer.id,
                    });
                    setSelectedConsigneeCustomerContact(
                      res.data.customer.contacts ||
                      [].find((c) => c.is_primary === 1) ||
                      {}
                    );
                  }

                  setSelectedOrder((selectedOrder) => {
                    return {
                      ...selectedOrder,
                      pickups: selectedOrder.pickups.map((p, i) => {
                        if ((p.customer?.id || 0) === res.data.customer.id) {
                          p.customer = { ...res.data.customer };
                        }
                        return p;
                      }),
                      deliveries: selectedOrder.deliveries.map((d, i) => {
                        if ((d.customer?.id || 0) === res.data.customer.id) {
                          d.customer = { ...res.data.customer };
                        }
                        return d;
                      }),
                    };
                  });

                  props.setSelectedCustomer({
                    ...res.data.customer,
                    component_id: props.componentId,
                  });

                  props.setSelectedCustomer({
                    ...selectedOrder,
                    pickups: selectedOrder.pickups.map((p, i) => {
                      if ((p.customer?.id || 0) === res.data.customer.id) {
                        p.customer = { ...res.data.customer };
                      }
                      return p;
                    }),
                    deliveries: selectedOrder.deliveries.map((d, i) => {
                      if ((d.customer?.id || 0) === res.data.customer.id) {
                        d.customer = { ...res.data.customer };
                      }
                      return d;
                    }),
                    component_id: props.componentId,
                  });
                }

                setIsSavingBillToCompanyInfo(false);
              })
              .catch((e) => {
                console.log("error saving customer", e);
              });
          }
        }
      }, 300);
    }
  };

  const validateBillToCompanyContactForSaving = (e) => {
    let keyCode = e.keyCode || e.which;

    if (keyCode === 9) {
      if (selectedBillToCustomer.id === undefined) {
        return;
      }

      let contact = selectedBillToCustomerContact;

      if (contact.customer_id === undefined || contact.customer_id === 0) {
        contact.customer_id = selectedBillToCustomer.id;
      }

      if (
        (contact.first_name || "").trim() === "" ||
        (contact.last_name || "").trim() === "" ||
        (contact.phone_work || "").trim() === ""
      ) {
        return;
      }

      if (
        (contact.address1 || "").trim() === "" &&
        (contact.address2 || "").trim() === ""
      ) {
        contact.address1 = selectedBillToCustomer.address1;
        contact.address2 = selectedBillToCustomer.address2;
        contact.city = selectedBillToCustomer.city;
        contact.state = selectedBillToCustomer.state;
        contact.zip_code = selectedBillToCustomer.zip;
      }

      if (!isSavingBillToCompanyContact) {
        setIsSavingBillToCompanyContact(true);

        axios
          .post(props.serverUrl + "/saveContact", contact)
          .then(async (res) => {
            if (res.data.result === "OK") {
              await setSelectedBillToCustomer({
                ...selectedBillToCustomer,
                contacts: res.data.contacts,
              });
              await setSelectedBillToCustomerContact(res.data.contact);
            }

            setIsSavingBillToCompanyContact(false);
          })
          .catch((e) => {
            console.log("error saving contact", e);
          });
      }
    }
  };

  useEffect(() => {
    if (isSavingShipperCompanyInfo) {
      if ((selectedShipperCustomer.id || 0) === 0) {
        setIsSavingShipperCompanyInfo(false);
        return;
      }

      let selectedShipperCompanyInfo = selectedShipperCustomer;

      if (
        selectedShipperCompanyInfo.id === undefined ||
        selectedShipperCompanyInfo.id === -1
      ) {
        selectedShipperCompanyInfo.id = 0;
        setSelectedShipperCustomer({ ...selectedShipperCustomer, id: 0 });
      }

      if (
        (selectedShipperCompanyInfo.name || "")
          .trim()
          .replace(/\s/g, "")
          .replace("&", "A") !== "" &&
        (selectedShipperCompanyInfo.city || "").trim().replace(/\s/g, "") !==
        "" &&
        (selectedShipperCompanyInfo.state || "").trim().replace(/\s/g, "") !==
        "" &&
        (selectedShipperCompanyInfo.address1 || "").trim() !== "" &&
        (selectedShipperCompanyInfo.zip || "").trim() !== ""
      ) {
        let parseCity = selectedShipperCompanyInfo.city
          .trim()
          .replace(/\s/g, "")
          .substring(0, 3);

        if (parseCity.toLowerCase() === "ft.") {
          parseCity = "FO";
        }
        if (parseCity.toLowerCase() === "mt.") {
          parseCity = "MO";
        }
        if (parseCity.toLowerCase() === "st.") {
          parseCity = "SA";
        }

        let mailingParseCity = (selectedShipperCompanyInfo.mailing_city || "")
          .trim()
          .replace(/\s/g, "")
          .substring(0, 3);

        if (mailingParseCity.toLowerCase() === "ft.") {
          mailingParseCity = "FO";
        }
        if (mailingParseCity.toLowerCase() === "mt.") {
          mailingParseCity = "MO";
        }
        if (mailingParseCity.toLowerCase() === "st.") {
          mailingParseCity = "SA";
        }

        let newCode =
          (selectedShipperCompanyInfo.name || "")
            .trim()
            .replace(/\s/g, "")
            .replace("&", "A")
            .substring(0, 3) +
          parseCity.substring(0, 2) +
          (selectedShipperCompanyInfo.state || "")
            .trim()
            .replace(/\s/g, "")
            .substring(0, 2);
        let mailingNewCode =
          (selectedShipperCompanyInfo.mailing_name || "")
            .trim()
            .replace(/\s/g, "")
            .replace("&", "A")
            .substring(0, 3) +
          mailingParseCity.substring(0, 2) +
          (selectedShipperCompanyInfo.mailing_state || "")
            .trim()
            .replace(/\s/g, "")
            .substring(0, 2);

        selectedShipperCompanyInfo.code = newCode.toUpperCase();
        selectedShipperCompanyInfo.mailing_code = mailingNewCode.toUpperCase();

        axios
          .post(props.serverUrl + "/saveCustomer", selectedShipperCompanyInfo)
          .then((res) => {
            if (res.data.result === "OK") {
              if (
                selectedShipperCustomer.id === undefined ||
                (selectedShipperCustomer.id || 0) === 0
              ) {
                setSelectedShipperCustomer((selectedShipperCustomer) => {
                  return {
                    ...selectedShipperCustomer,
                    id: res.data.customer.id,
                  };
                });
                setSelectedShipperCustomerContact(
                  res.data.customer.contacts.find((c) => c.is_primary === 1) ||
                  {}
                );

                setSelectedOrder((selectedOrder) => {
                  return {
                    ...selectedOrder,
                    pickups: selectedOrder.pickups.map((p, i) => {
                      if ((p.id || 0) === 0) {
                        p.customer = { ...res.data.customer };
                      }
                      return p;
                    }),
                    deliveries: selectedOrder.deliveries.map((d, i) => {
                      if (d.id === res.data.customer.id) {
                        d.customer = { ...res.data.customer };
                      }
                      return d;
                    }),
                  };
                });
              } else {
                setSelectedOrder((selectedOrder) => {
                  return {
                    ...selectedOrder,
                    pickups: selectedOrder.pickups.map((p, i) => {
                      if (p.id === res.data.customer.id) {
                        p.customer = { ...res.data.customer };
                      }
                      return p;
                    }),
                    deliveries: selectedOrder.deliveries.map((d, i) => {
                      if (d.id === res.data.customer.id) {
                        d.customer = { ...res.data.customer };
                      }
                      return d;
                    }),
                  };
                });
              }

              if (
                selectedBillToCustomer?.id !== undefined &&
                selectedBillToCustomer.id > 0 &&
                selectedBillToCustomer.id === res.data.customer.id
              ) {
                setSelectedBillToCustomer({
                  ...selectedShipperCustomer,
                  id: res.data.customer.id,
                });
                setSelectedBillToCustomerContact(
                  res.data.customer.contacts ||
                  [].find((c) => c.is_primary === 1) ||
                  {}
                );
              }

              if (
                selectedConsigneeCustomer?.id !== undefined &&
                selectedConsigneeCustomer.id > 0 &&
                selectedConsigneeCustomer.id === res.data.customer.id
              ) {
                setSelectedConsigneeCustomer({
                  ...selectedShipperCustomer,
                  id: res.data.customer.id,
                });
                setSelectedConsigneeCustomerContact(
                  res.data.customer.contacts ||
                  [].find((c) => c.is_primary === 1) ||
                  {}
                );
              }

              props.setSelectedCustomer({
                ...res.data.customer,
                component_id: props.componentId,
              });

              props.setSelectedOrder({
                ...selectedOrder,
                pickups: selectedOrder.pickups.map((p, i) => {
                  if (p.id === res.data.customer.id) {
                    p.customer = { ...res.data.customer };
                  }
                  return p;
                }),
                deliveries: selectedOrder.deliveries.map((d, i) => {
                  if (d.id === res.data.customer.id) {
                    d.customer = { ...res.data.customer };
                  }
                  return d;
                }),
                component_id: props.componentId,
              });

              // validate postal code for calculating miles
              let doCalculateMiles = false;

              if (
                (selectedShipperCompanyInfo.zip_code || "") !== "" &&
                selectedShipperCompanyInfo.zip_code !==
                res.data.customer.zip_code
              ) {
                (selectedOrder?.routing || []).map((route, index) => {
                  if (route.type === "pickup") {
                    if (
                      selectedOrder?.pickups ||
                      [].find((p) => p.customer.id === res.data.customer.id) !==
                      undefined
                    ) {
                      doCalculateMiles = true;
                    }
                  }

                  return false;
                });
              }

              if (doCalculateMiles) {
                let selected_order = selectedOrder || {};

                if ((selected_order?.id || 0) > 0) {
                  selected_order.pickups =
                    selected_order.pickups ||
                    [].map((p, i) => {
                      if ((p.customer?.id || 0) === res.data.customer.id) {
                        p.customer = { ...res.data.customer };
                      }

                      return p;
                    });

                  let params = {
                    mode: "fastest;car;traffic:disabled",
                    routeAttributes: "summary",
                  };

                  let waypointCount = 0;

                  (selected_order.routing || []).map((item, i) => {
                    if (item.type === "pickup") {
                      (selected_order.pickups || []).map((p, i) => {
                        if (p.id === item.pickup_id) {
                          if ((p.customer?.zip_data || "") !== "") {
                            params["waypoint" + waypointCount] =
                              "geo!" +
                              p.customer.zip_data.latitude.toString() +
                              "," +
                              p.customer.zip_data.longitude.toString();
                            waypointCount += 1;
                          }
                        }
                        return false;
                      });
                    } else {
                      (selected_order.deliveries || []).map((d, i) => {
                        if (d.id === item.delivery_id) {
                          if ((d.customer?.zip_data || "") !== "") {
                            params["waypoint" + waypointCount] =
                              "geo!" +
                              d.customer.zip_data.latitude.toString() +
                              "," +
                              d.customer.zip_data.longitude.toString();
                            waypointCount += 1;
                          }
                        }
                        return false;
                      });
                    }

                    return true;
                  });

                  routingService.calculateRoute(
                    params,
                    (result) => {
                      let miles =
                        result.response.route[0].summary.distance || 0;

                      selected_order.miles = miles;

                      setSelectedOrder(selected_order);
                      setMileageLoaderVisible(false);

                      axios
                        .post(props.serverUrl + "/saveOrder", selected_order)
                        .then((res) => {
                          if (res.data.result === "OK") {
                            setSelectedOrder({
                              ...selected_order,
                              order_customer_ratings:
                                res.data.order.order_customer_ratings,
                              order_carrier_ratings:
                                res.data.order.order_carrier_ratings,
                            });

                            props.setSelectedOrder({
                              ...selected_order,
                              order_customer_ratings:
                                res.data.order.order_customer_ratings,
                              order_carrier_ratings:
                                res.data.order.order_carrier_ratings,
                              component_id: props.componentId,
                            });
                          }
                        })
                        .catch((e) => {
                          console.log("error on saving order miles", e);
                          setMileageLoaderVisible(false);
                        });
                    },
                    (error) => {
                      console.log("error getting mileage", error);
                      selected_order.miles = 0;

                      setSelectedOrder(selected_order);
                      setMileageLoaderVisible(false);

                      axios
                        .post(props.serverUrl + "/saveOrder", selected_order)
                        .then((res) => {
                          if (res.data.result === "OK") {
                            setSelectedOrder({
                              ...selected_order,
                              order_customer_ratings:
                                res.data.order.order_customer_ratings,
                              order_carrier_ratings:
                                res.data.order.order_carrier_ratings,
                            });

                            props.setSelectedOrder({
                              ...selected_order,
                              order_customer_ratings:
                                res.data.order.order_customer_ratings,
                              order_carrier_ratings:
                                res.data.order.order_carrier_ratings,
                              component_id: props.componentId,
                            });
                          }
                        })
                        .catch((e) => {
                          console.log("error on saving order miles", e);
                          setMileageLoaderVisible(false);
                        });
                    }
                  );
                }
              }
            }

            setIsSavingShipperCompanyInfo(false);
          })
          .catch((e) => {
            console.log("error saving customer", e);
            setIsSavingShipperCompanyInfo(false);
          });
      } else {
        setIsSavingShipperCompanyInfo(false);
      }
    }
  }, [isSavingShipperCompanyInfo]);

  const validateShipperCompanyInfoForSaving = (e) => {
    let key = e.keyCode || e.which;

    if (key === 9) {
      if (!isSavingShipperCompanyInfo) {
        setIsSavingShipperCompanyInfo(true);
      }
    }
  };

  const validateShipperCompanyContactForSaving = (e) => {
    let keyCode = e.keyCode || e.which;

    if (keyCode === 9) {
      e.preventDefault();
      setIsShowingShipperSecondPage(true);
      // if (selectedShipperCustomer.id === undefined) {
      //     return;
      // }

      // let contact = selectedShipperCustomerContact;

      // if (contact.customer_id === undefined || contact.customer_id === 0) {
      //     contact.customer_id = selectedShipperCustomer.id;
      // }

      // if ((contact.first_name || '').trim() === '' || (contact.last_name || '').trim() === '' || (contact.phone_work || '').trim() === '') {
      //     return;
      // }

      // if ((contact.address1 || '').trim() === '' && (contact.address2 || '').trim() === '') {
      //     contact.address1 = selectedShipperCustomer.address1;
      //     contact.address2 = selectedShipperCustomer.address2;
      //     contact.city = selectedShipperCustomer.city;
      //     contact.state = selectedShipperCustomer.state;
      //     contact.zip_code = selectedShipperCustomer.zip;
      // }

      // if (!isSavingShipperCompanyContact) {
      //     setIsSavingShipperCompanyContact(true);

      //     axios.post(props.serverUrl + '/saveContact', contact).then(async res => {
      //         if (res.data.result === 'OK') {
      //             await setSelectedShipperCustomer({ ...selectedShipperCustomer, contacts: res.data.contacts });
      //             await setSelectedShipperCustomerContact(res.data.contact);
      //         }

      //         setIsSavingShipperCompanyContact(false);
      //     }).catch(e => {
      //         console.log('error saving contact', e);
      //     });
      // }
    }
  };

  useEffect(() => {
    if (isSavingConsigneeCompanyInfo) {
      if ((selectedConsigneeCustomer.id || 0) === 0) {
        setIsSavingConsigneeCompanyInfo(false);
        return;
      }

      let selectedConsigneeCompanyInfo = selectedConsigneeCustomer;

      if (
        selectedConsigneeCompanyInfo.id === undefined ||
        selectedConsigneeCompanyInfo.id === -1
      ) {
        selectedConsigneeCompanyInfo.id = 0;
        setSelectedConsigneeCustomer({ ...selectedConsigneeCustomer, id: 0 });
      }

      if (
        (selectedConsigneeCompanyInfo.name || "")
          .trim()
          .replace(/\s/g, "")
          .replace("&", "A") !== "" &&
        (selectedConsigneeCompanyInfo.city || "").trim().replace(/\s/g, "") !==
        "" &&
        (selectedConsigneeCompanyInfo.state || "").trim().replace(/\s/g, "") !==
        "" &&
        (selectedConsigneeCompanyInfo.address1 || "").trim() !== "" &&
        (selectedConsigneeCompanyInfo.zip || "").trim() !== ""
      ) {
        let parseCity = selectedConsigneeCompanyInfo.city
          .trim()
          .replace(/\s/g, "")
          .substring(0, 3);

        if (parseCity.toLowerCase() === "ft.") {
          parseCity = "FO";
        }
        if (parseCity.toLowerCase() === "mt.") {
          parseCity = "MO";
        }
        if (parseCity.toLowerCase() === "st.") {
          parseCity = "SA";
        }

        let mailingParseCity = (selectedConsigneeCompanyInfo.mailing_city || "")
          .trim()
          .replace(/\s/g, "")
          .substring(0, 3);

        if (mailingParseCity.toLowerCase() === "ft.") {
          mailingParseCity = "FO";
        }
        if (mailingParseCity.toLowerCase() === "mt.") {
          mailingParseCity = "MO";
        }
        if (mailingParseCity.toLowerCase() === "st.") {
          mailingParseCity = "SA";
        }

        let newCode =
          (selectedConsigneeCompanyInfo.name || "")
            .trim()
            .replace(/\s/g, "")
            .replace("&", "A")
            .substring(0, 3) +
          parseCity.substring(0, 2) +
          (selectedConsigneeCompanyInfo.state || "")
            .trim()
            .replace(/\s/g, "")
            .substring(0, 2);
        let mailingNewCode =
          (selectedConsigneeCompanyInfo.mailing_name || "")
            .trim()
            .replace(/\s/g, "")
            .replace("&", "A")
            .substring(0, 3) +
          mailingParseCity.substring(0, 2) +
          (selectedConsigneeCompanyInfo.mailing_state || "")
            .trim()
            .replace(/\s/g, "")
            .substring(0, 2);

        selectedConsigneeCompanyInfo.code = newCode.toUpperCase();
        selectedConsigneeCompanyInfo.mailing_code =
          mailingNewCode.toUpperCase();

        axios
          .post(props.serverUrl + "/saveCustomer", selectedConsigneeCompanyInfo)
          .then((res) => {
            if (res.data.result === "OK") {
              if (
                selectedConsigneeCustomer.id === undefined ||
                (selectedConsigneeCustomer.id || 0) === 0
              ) {
                setSelectedConsigneeCustomer((selectedConsigneeCustomer) => {
                  return {
                    ...selectedConsigneeCustomer,
                    id: res.data.customer.id,
                  };
                });
                setSelectedConsigneeCustomerContact(
                  res.data.customer.contacts.find((c) => c.is_primary === 1) ||
                  {}
                );

                setSelectedOrder((selectedOrder) => {
                  return {
                    ...selectedOrder,
                    deliveries: selectedOrder.deliveries.map((d, i) => {
                      if ((d.id || 0) === 0) {
                        d.customer = { ...res.data.customer };
                      }
                      return d;
                    }),
                    pickups: selectedOrder.pickups.map((p, i) => {
                      if (p.id === res.data.customer.id) {
                        p.customer = { ...res.data.customer };
                      }
                      return p;
                    }),
                  };
                });
              } else {
                setSelectedOrder((selectedOrder) => {
                  return {
                    ...selectedOrder,
                    pickups: selectedOrder.pickups.map((p, i) => {
                      if (p.id === res.data.customer.id) {
                        p.customer = { ...res.data.customer };
                      }
                      return p;
                    }),
                    deliveries: selectedOrder.deliveries.map((d, i) => {
                      if (d.id === res.data.customer.id) {
                        d.customer = { ...res.data.customer };
                      }
                      return d;
                    }),
                  };
                });
              }

              if (
                selectedBillToCustomer?.id !== undefined &&
                selectedBillToCustomer.id > 0 &&
                selectedBillToCustomer.id === res.data.customer.id
              ) {
                setSelectedBillToCustomer({
                  ...selectedShipperCustomer,
                  id: res.data.customer.id,
                });
                setSelectedBillToCustomerContact(
                  res.data.customer.contacts ||
                  [].find((c) => c.is_primary === 1) ||
                  {}
                );
              }

              if (
                selectedShipperCustomer?.id !== undefined &&
                selectedShipperCustomer.id > 0 &&
                selectedShipperCustomer.id === res.data.customer.id
              ) {
                setSelectedShipperCustomer({
                  ...selectedConsigneeCustomer,
                  id: res.data.customer.id,
                });
                setSelectedShipperCustomerContact(
                  res.data.customer.contacts ||
                  [].find((c) => c.is_primary === 1) ||
                  {}
                );
              }

              props.setSelectedCustomer({
                ...res.data.customer,
                component_id: props.componentId,
              });

              props.setSelectedOrder({
                ...selectedOrder,
                pickups: selectedOrder.pickups.map((p, i) => {
                  if (p.id === res.data.customer.id) {
                    p.customer = { ...res.data.customer };
                  }
                  return p;
                }),
                deliveries: selectedOrder.deliveries.map((d, i) => {
                  if (d.id === res.data.customer.id) {
                    d.customer = { ...res.data.customer };
                  }
                  return d;
                }),
                component_id: props.componentId,
              });

              // validate postal code for calculating miles
              let doCalculateMiles = false;

              if (
                (selectedConsigneeCompanyInfo.zip_code || "") !== "" &&
                selectedConsigneeCompanyInfo.zip_code !==
                res.data.customer.zip_code
              ) {
                (selectedOrder?.routing || []).map((route, index) => {
                  if (route.type === "delivery") {
                    if (
                      selectedOrder?.deliveries ||
                      [].find((d) => d.customer.id === res.data.customer.id) !==
                      undefined
                    ) {
                      doCalculateMiles = true;
                    }
                  }

                  return false;
                });
              }

              if (doCalculateMiles) {
                let selected_order = selectedOrder || {};

                if ((selected_order?.id || 0) > 0) {
                  selected_order.deliveries =
                    selected_order.deliveries ||
                    [].map((d, i) => {
                      if ((d.customer?.id || 0) === res.data.customer.id) {
                        d.customer = { ...res.data.customer };
                      }

                      return d;
                    });

                  let params = {
                    mode: "fastest;car;traffic:disabled",
                    routeAttributes: "summary",
                  };

                  let waypointCount = 0;

                  (selected_order.routing || []).map((item, i) => {
                    if (item.type === "pickup") {
                      (selected_order.pickups || []).map((p, i) => {
                        if (p.id === item.pickup_id) {
                          if ((p.customer?.zip_data || "") !== "") {
                            params["waypoint" + waypointCount] =
                              "geo!" +
                              p.customer.zip_data.latitude.toString() +
                              "," +
                              p.customer.zip_data.longitude.toString();
                            waypointCount += 1;
                          }
                        }
                        return false;
                      });
                    } else {
                      (selected_order.deliveries || []).map((d, i) => {
                        if (d.id === item.delivery_id) {
                          if ((d.customer?.zip_data || "") !== "") {
                            params["waypoint" + waypointCount] =
                              "geo!" +
                              d.customer.zip_data.latitude.toString() +
                              "," +
                              d.customer.zip_data.longitude.toString();
                            waypointCount += 1;
                          }
                        }
                        return false;
                      });
                    }

                    return true;
                  });

                  routingService.calculateRoute(
                    params,
                    (result) => {
                      let miles =
                        result.response.route[0].summary.distance || 0;

                      selected_order.miles = miles;

                      setSelectedOrder(selected_order);
                      setMileageLoaderVisible(false);

                      axios
                        .post(props.serverUrl + "/saveOrder", selected_order)
                        .then((res) => {
                          if (res.data.result === "OK") {
                            setSelectedOrder({
                              ...selected_order,
                              order_customer_ratings:
                                res.data.order.order_customer_ratings,
                              order_carrier_ratings:
                                res.data.order.order_carrier_ratings,
                            });

                            props.setSelectedOrder({
                              ...selected_order,
                              order_customer_ratings:
                                res.data.order.order_customer_ratings,
                              order_carrier_ratings:
                                res.data.order.order_carrier_ratings,
                              component_id: props.componentId,
                            });
                          }
                        })
                        .catch((e) => {
                          console.log("error on saving order miles", e);
                          setMileageLoaderVisible(false);
                        });
                    },
                    (error) => {
                      console.log("error getting mileage", error);
                      selected_order.miles = 0;

                      setSelectedOrder(selected_order);
                      setMileageLoaderVisible(false);

                      axios
                        .post(props.serverUrl + "/saveOrder", selected_order)
                        .then((res) => {
                          if (res.data.result === "OK") {
                            setSelectedOrder({
                              ...selected_order,
                              order_customer_ratings:
                                res.data.order.order_customer_ratings,
                              order_carrier_ratings:
                                res.data.order.order_carrier_ratings,
                            });

                            props.setSelectedOrder({
                              ...selected_order,
                              order_customer_ratings:
                                res.data.order.order_customer_ratings,
                              order_carrier_ratings:
                                res.data.order.order_carrier_ratings,
                              component_id: props.componentId,
                            });
                          }
                        })
                        .catch((e) => {
                          console.log("error on saving order miles", e);
                          setMileageLoaderVisible(false);
                        });
                    }
                  );
                }
              }
            }

            setIsSavingConsigneeCompanyInfo(false);
          })
          .catch((e) => {
            console.log("error saving customer", e);
            setIsSavingConsigneeCompanyInfo(false);
          });
      }
    }
  }, [isSavingConsigneeCompanyInfo]);

  const validateConsigneeCompanyInfoForSaving = (e) => {
    let key = e.keyCode || e.which;

    if (key === 9) {
      if (!isSavingConsigneeCompanyInfo) {
        setIsSavingConsigneeCompanyInfo(true);
      }
    }
  };

  const validateConsigneeCompanyContactForSaving = (e) => {
    let keyCode = e.keyCode || e.which;

    if (keyCode === 9) {
      // if (selectedConsigneeCustomer.id === undefined) {
      //     return;
      // }

      // let contact = selectedConsigneeCustomerContact;

      // if (contact.customer_id === undefined || contact.customer_id === 0) {
      //     contact.customer_id = selectedConsigneeCustomer.id;
      // }

      // if ((contact.first_name || '').trim() === '' || (contact.last_name || '').trim() === '' || (contact.phone_work || '').trim() === '') {
      //     return;
      // }

      // if ((contact.address1 || '').trim() === '' && (contact.address2 || '').trim() === '') {
      //     contact.address1 = selectedConsigneeCustomer.address1;
      //     contact.address2 = selectedConsigneeCustomer.address2;
      //     contact.city = selectedConsigneeCustomer.city;
      //     contact.state = selectedConsigneeCustomer.state;
      //     contact.zip_code = selectedConsigneeCustomer.zip;
      // }

      // if (!isSavingConsigneeCompanyContact) {
      //     setIsSavingConsigneeCompanyContact(true);

      //     axios.post(props.serverUrl + '/saveContact', contact).then(async res => {
      //         if (res.data.result === 'OK') {
      //             await setSelectedConsigneeCustomer({ ...selectedConsigneeCustomer, contacts: res.data.contacts });
      //             await setSelectedConsigneeCustomerContact(res.data.contact);
      //         }

      //         setIsSavingConsigneeCompanyContact(false);
      //     }).catch(e => {
      //         console.log('error saving contact', e);
      //     });
      // }

      e.preventDefault();
      setIsShowingConsigneeSecondPage(true);
    }
  };

  const validateCarrierInfoForSaving = (e) => {
    let keyCode = e.keyCode || e.which;

    if (keyCode === 9) {
      clearTimeout(delayTimer);
      delayTimer = null;

      if ((selectedCarrier.id || 0) === 0) {
        return;
      }

      delayTimer = window.setTimeout(() => {
        let selectedDispatchCarrierInfoCarrier = selectedCarrier;

        if (
          selectedDispatchCarrierInfoCarrier.id === undefined ||
          selectedDispatchCarrierInfoCarrier.id === -1
        ) {
          selectedDispatchCarrierInfoCarrier.id = 0;
        }

        if (
          (selectedDispatchCarrierInfoCarrier.name || "")
            .trim()
            .replace(/\s/g, "")
            .replace("&", "A") !== "" &&
          (selectedDispatchCarrierInfoCarrier.city || "")
            .trim()
            .replace(/\s/g, "") !== "" &&
          (selectedDispatchCarrierInfoCarrier.state || "")
            .trim()
            .replace(/\s/g, "") !== "" &&
          (selectedDispatchCarrierInfoCarrier.address1 || "").trim() !== "" &&
          (selectedDispatchCarrierInfoCarrier.zip || "").trim() !== ""
        ) {
          let parseCity = selectedDispatchCarrierInfoCarrier.city
            .trim()
            .replace(/\s/g, "")
            .substring(0, 3);

          if (parseCity.toLowerCase() === "ft.") {
            parseCity = "FO";
          }
          if (parseCity.toLowerCase() === "mt.") {
            parseCity = "MO";
          }
          if (parseCity.toLowerCase() === "st.") {
            parseCity = "SA";
          }

          let newCode =
            (selectedDispatchCarrierInfoCarrier.name || "")
              .trim()
              .replace(/\s/g, "")
              .replace("&", "A")
              .substring(0, 3) +
            parseCity.substring(0, 2) +
            (selectedDispatchCarrierInfoCarrier.state || "")
              .trim()
              .replace(/\s/g, "")
              .substring(0, 2);

          selectedDispatchCarrierInfoCarrier.code = newCode.toUpperCase();

          if (!isSavingCarrierInfo) {
            setIsSavingCarrierInfo(true);

            axios
              .post(
                props.serverUrl + "/saveCarrier",
                selectedDispatchCarrierInfoCarrier
              )
              .then((res) => {
                if (res.data.result === "OK") {
                  if (
                    selectedCarrier.id === undefined &&
                    (selectedCarrier.id || 0) === 0
                  ) {
                    setSelectedCarrier((selectedCarrier) => {
                      return { ...selectedCarrier, id: res.data.carrier.id };
                    });
                  }

                  setSelectedCarrierContact(
                    (res.data.carrier.contacts || []).find(
                      (c) => c.is_primary === 1
                    ) || {}
                  );

                  props.setSelectedCarrier({
                    ...res.data.carrier,
                    component_id: props.componentId,
                  });

                  props.setSelectedCarrierContact({
                    ...((res.data.carrier.contacts || []).find(
                      (c) => c.is_primary === 1
                    ) || {}),
                    component_id: props.componentId,
                  });
                }

                setIsSavingCarrierInfo(false);
              })
              .catch((e) => {
                console.log("error saving carrier", e);
              });
          }
        }
      }, 300);
    }
  };

  const validateCarrierContactForSaving = (e) => {
    let keyCode = e.keyCode || e.which;

    if (keyCode === 9) {
      if ((selectedCarrier.id || 0) === 0) {
        return;
      }

      if ((selectedCarrierContact.id || 0) === 0) {
        return;
      }

      let contact = selectedCarrierContact;

      if (contact.carrier_id === undefined || contact.carrier_id === 0) {
        contact.carrier_id = selectedCarrier.id;
      }

      if (
        (contact.first_name || "").trim() === "" ||
        (contact.last_name || "").trim() === "" ||
        (contact.phone_work || "").trim() === ""
      ) {
        return;
      }

      if (
        (contact.address1 || "").trim() === "" &&
        (contact.address2 || "").trim() === ""
      ) {
        contact.address1 = selectedCarrier.address1;
        contact.address2 = selectedCarrier.address2;
        contact.city = selectedCarrier.city;
        contact.state = selectedCarrier.state;
        contact.zip_code = selectedCarrier.zip;
      }

      if (!isSavingCarrierContact) {
        setIsSavingCarrierContact(true);

        axios
          .post(props.serverUrl + "/saveCarrierContact", contact)
          .then(async (res) => {
            if (res.data.result === "OK") {
              await setSelectedCarrier({
                ...selectedCarrier,
                contacts: res.data.contacts,
              });
              await setSelectedCarrierContact(res.data.contact);
            }

            setIsSavingCarrierContact(false);
          })
          .catch((e) => {
            console.log("error saving carrier contact", e);
          });
      }
    }
  };

  const validateCarrierDriverForSaving = async (e) => {
    let key = e.keyCode || e.which;

    if (key === 9) {
      if (!isSavingCarrierDriver) {
        setIsSavingCarrierDriver(true);
      }
    }
  };

  useEffect(() => {
    if (isSavingCarrierDriver) {
      let driver = {
        ...selectedCarrierDriver,
        id: selectedCarrierDriver?.id || 0,
        carrier_id: selectedCarrier.id,
      };

      if ((selectedCarrier?.id || 0) > 0) {
        if ((driver.first_name || "").trim() !== "") {
          axios
            .post(props.serverUrl + "/saveCarrierDriver", driver)
            .then((res) => {
              if (res.data.result === "OK") {
                setSelectedCarrier((selectedCarrier) => {
                  return { ...selectedCarrier, drivers: res.data.drivers };
                });
                setSelectedCarrierDriver({ ...driver, id: res.data.driver.id });

                props.setSelectedCarrier({
                  ...selectedCarrier,
                  drivers: res.data.drivers,
                  component_id: props.componentId,
                });

                props.setSelectedCarrierDriver({
                  ...driver,
                  component_id: props.componentId,
                });

                axios
                  .post(props.serverUrl + "/saveOrder", {
                    ...selectedOrder,
                    carrier_driver_id: res.data.driver.id,
                  })
                  .then((res) => {
                    if (res.data.result === "OK") {
                      setSelectedOrder({
                        ...res.data.order,
                      });

                      props.setSelectedOrder({
                        ...res.data.order,
                        component_id: props.componentId,
                      });
                    } else {
                      console.log(res.data.result);
                    }

                    setIsSavingOrder(false);
                  })
                  .catch((e) => {
                    console.log("error saving order", e);
                    setIsSavingOrder(false);
                  });
              }

              setIsSavingCarrierDriver(false);
            })
            .catch((e) => {
              console.log("error saving carrier driver", e);
              setIsSavingCarrierDriver(false);
            });
        } else {
          setIsSavingCarrierDriver(false);
        }
      } else {
        setIsSavingCarrierDriver(false);
      }
    }
  }, [isSavingCarrierDriver]);

  const validateOrderForSaving = (e) => {
    let key = e.keyCode || e.which;

    if (key === 9) {
      if (!isSavingOrder) {
        setIsSavingOrder(true);
      }
    }
  };

  useEffect(() => {
    if (isSavingOrder) {
      let selected_order = { ...selectedOrder } || { order_number: 0 };

      // check if there's a bill-to-company loaded
      if ((selectedBillToCustomer?.id || 0) === 0) {
        setIsSavingOrder(false);
        setMileageLoaderVisible(false);
        setIsLoading(false);
        return;
      }

      selected_order.bill_to_customer_id =
        (selectedBillToCustomer?.id || 0) === 0
          ? null
          : selectedBillToCustomer.id;
      selected_order.carrier_id =
        (selectedCarrier?.id || 0) === 0 ? null : selectedCarrier.id;
      selected_order.carrier_driver_id =
        (selectedCarrierDriver?.id || 0) === 0
          ? null
          : selectedCarrierDriver.id;

      if ((selected_order.ae_number || "") === "") {
        selected_order.ae_number = getRandomInt(1, 100);
      }

      if (
        (selected_order?.id || 0) === 0 &&
        (selected_order.pickups || []).length === 1 &&
        selected_order.pickups[0].id === 0 &&
        (selected_order.pickups[0].customer_id || 0) > 0
      ) {
        selected_order.pickups = (selected_order.pickups || []).map((pu, i) => {
          pu.pu_date1 = getFormattedDates(pu.pu_date1 || "");
          pu.pu_date2 = getFormattedDates(pu.pu_date2 || "");
          pu.pu_time1 = getFormattedHours(pu.pu_time1 || "");
          pu.pu_time2 = getFormattedHours(pu.pu_time2 || "");
          return pu;
        });
      } else {
        selected_order.pickups = []; // se envia vacio para no tocarlo
      }

      if (
        (selected_order?.id || 0) === 0 &&
        (selected_order.deliveries || []).length === 1 &&
        selected_order.deliveries[0].id === 0 &&
        (selected_order.deliveries[0].customer_id || 0) > 0
      ) {
        selected_order.deliveries = (selected_order.deliveries || []).map(
          (delivery, i) => {
            delivery.delivery_date1 = getFormattedDates(
              delivery.delivery_date1 || ""
            );
            delivery.delivery_date2 = getFormattedDates(
              delivery.delivery_date2 || ""
            );
            delivery.delivery_time1 = getFormattedHours(
              delivery.delivery_time1 || ""
            );
            delivery.delivery_time2 = getFormattedHours(
              delivery.delivery_time2 || ""
            );
            return delivery;
          }
        );
      } else {
        selected_order.deliveries = []; // se envia vacio para no tocarlo
      }

      let toSavePickup =
        (selected_order.pickups || []).find(
          (p) => (p.toSave || false) === true
        ) !== undefined;

      axios
        .post(props.serverUrl + "/saveOrder", selected_order)
        .then((res) => {
          if (res.data.result === "OK") {
            setSelectedOrder({ ...res.data.order });

            props.setSelectedOrder({
              ...res.data.order,
              component_id: props.componentId,
            });

            if (toSavePickup) {
              setSelectedShipperCustomer((selectedShipperCustomer) => {
                return {
                  ...selectedShipperCustomer,
                  pickup_id: res.data.order.pickups[0].id,
                };
              });
            }

            if ((selected_order?.id || 0) === 0 && res.data.order.id > 0) {
              refShipperCompanyCode.current.focus();
            }
          } else {
            console.log(res.data.result);
          }

          setIsSavingOrder(false);
          setIsLoading(false);
        })
        .catch((e) => {
          console.log("error saving order", e);
          setIsSavingOrder(false);
          setIsLoading(false);
        });
    }
  }, [isSavingOrder]);

  useEffect(() => {
    if (isSavingPickupId > -1) {
      if ((selectedOrder?.id || 0) > 0) {
        let pickup = (selectedOrder?.pickups || []).find(
          (p) => p.id === isSavingPickupId
        );

        if (pickup !== undefined) {
          if ((pickup.customer?.id || 0) > 0) {
            axios
              .post(props.serverUrl + "/saveOrderPickup", {
                id: isSavingPickupId,
                order_id: selectedOrder?.id || 0,
                customer_id: pickup.customer.id,
                pu_date1: pickup.pu_date1 || "",
                pu_date2: pickup.pu_date2 || "",
                pu_time1: pickup.pu_time1 || "",
                pu_time2: pickup.pu_time2 || "",
                bol_numbers: pickup.bol_numbers || "",
                po_numbers: pickup.po_numbers || "",
                ref_numbers: pickup.ref_numbers || "",
                seal_number: pickup.seal_number || "",
                special_instructions: pickup.special_instructions || "",
                type: "pickup",
              })
              .then((res) => {
                if (res.data.result === "OK") {
                  setSelectedOrder((selectedOrder) => {
                    return {
                      ...selectedOrder,
                      pickups: (selectedOrder.pickups || []).map((p, i) => {
                        if (p.id === isSavingPickupId) {
                          p = res.data.pickup;

                          setSelectedShipperCustomer({
                            ...selectedShipperCustomer,
                            pickup_id: res.data.pickup.id,
                          });
                        }
                        return p;
                      }),
                    };
                  });

                  if (
                    res.data.order.pickups.length === 1 &&
                    res.data.order.deliveries.length === 1
                  ) {
                    let routing = [
                      {
                        id: 0,
                        pickup_id: res.data.order.pickups[0].id,
                        delivery_id: null,
                        type: "pickup",
                      },
                      {
                        id: 0,
                        pickup_id: null,
                        delivery_id: res.data.order.deliveries[0].id,
                        type: "delivery",
                      },
                    ];

                    let selected_order = selectedOrder;

                    axios
                      .post(props.serverUrl + "/saveOrderRouting", {
                        order_id: selectedOrder?.id || 0,
                        routing: routing,
                      })
                      .then((res) => {
                        if (res.data.result === "OK") {
                          selected_order = res.data.order;
                          setSelectedOrder(selected_order);

                          setMileageLoaderVisible(true);

                          let params = {
                            mode: "fastest;car;traffic:disabled",
                            routeAttributes: "summary",
                          };

                          let waypointCount = 0;

                          selected_order.routing.map((item, i) => {
                            if (item.type === "pickup") {
                              selected_order.pickups.map((p, i) => {
                                if (p.id === item.pickup_id) {
                                  if ((p.customer?.zip_data || "") !== "") {
                                    params["waypoint" + waypointCount] =
                                      "geo!" +
                                      p.customer.zip_data.latitude.toString() +
                                      "," +
                                      p.customer.zip_data.longitude.toString();
                                    waypointCount += 1;
                                  }
                                }
                                return false;
                              });
                            } else {
                              selected_order.deliveries.map((d, i) => {
                                if (d.id === item.delivery_id) {
                                  if ((d.customer?.zip_data || "") !== "") {
                                    params["waypoint" + waypointCount] =
                                      "geo!" +
                                      d.customer.zip_data.latitude.toString() +
                                      "," +
                                      d.customer.zip_data.longitude.toString();
                                    waypointCount += 1;
                                  }
                                }
                                return false;
                              });
                            }

                            return true;
                          });

                          routingService.calculateRoute(
                            params,
                            (result) => {
                              let miles =
                                result.response.route[0].summary.distance || 0;

                              selected_order.miles = miles;

                              setSelectedOrder(selected_order);
                              setMileageLoaderVisible(false);

                              axios
                                .post(
                                  props.serverUrl + "/saveOrder",
                                  selected_order
                                )
                                .then((res) => {
                                  if (res.data.result === "OK") {
                                    setSelectedOrder({
                                      ...selected_order,
                                      order_customer_ratings:
                                        res.data.order.order_customer_ratings,
                                      order_carrier_ratings:
                                        res.data.order.order_carrier_ratings,
                                    });

                                    props.setSelectedOrder({
                                      ...selected_order,
                                      order_customer_ratings:
                                        res.data.order.order_customer_ratings,
                                      order_carrier_ratings:
                                        res.data.order.order_carrier_ratings,
                                      component_id: props.componentId,
                                    });
                                  }
                                })
                                .catch((e) => {
                                  console.log("error on saving order miles", e);
                                  setMileageLoaderVisible(false);
                                });
                            },
                            (error) => {
                              console.log("error getting mileage", error);
                              selected_order.miles = 0;

                              setSelectedOrder(selected_order);
                              setMileageLoaderVisible(false);

                              axios
                                .post(
                                  props.serverUrl + "/saveOrder",
                                  selected_order
                                )
                                .then((res) => {
                                  if (res.data.result === "OK") {
                                    setSelectedOrder({
                                      ...selected_order,
                                      order_customer_ratings:
                                        res.data.order.order_customer_ratings,
                                      order_carrier_ratings:
                                        res.data.order.order_carrier_ratings,
                                    });

                                    props.setSelectedOrder({
                                      ...selected_order,
                                      order_customer_ratings:
                                        res.data.order.order_customer_ratings,
                                      order_carrier_ratings:
                                        res.data.order.order_carrier_ratings,
                                      component_id: props.componentId,
                                    });
                                  }
                                })
                                .catch((e) => {
                                  console.log("error on saving order miles", e);
                                  setMileageLoaderVisible(false);
                                });
                            }
                          );
                        } else {
                          console.log(res.data.result);

                          selected_order.miles = 0;
                          setSelectedOrder(selected_order);
                          setMileageLoaderVisible(false);

                          axios
                            .post(
                              props.serverUrl + "/saveOrder",
                              selected_order
                            )
                            .then((res) => {
                              if (res.data.result === "OK") {
                                setSelectedOrder({
                                  ...selected_order,
                                  order_customer_ratings:
                                    res.data.order.order_customer_ratings,
                                  order_carrier_ratings:
                                    res.data.order.order_carrier_ratings,
                                });

                                props.setSelectedOrder({
                                  ...selected_order,
                                  order_customer_ratings:
                                    res.data.order.order_customer_ratings,
                                  order_carrier_ratings:
                                    res.data.order.order_carrier_ratings,
                                  component_id: props.componentId,
                                });
                              }
                            })
                            .catch((e) => {
                              console.log("error on saving order miles", e);
                              setMileageLoaderVisible(false);
                            });
                        }
                      })
                      .catch((e) => {
                        console.log("error on saving order routing", e);
                        setMileageLoaderVisible(false);
                      });
                  }
                } else {
                  console.log(res.data.result);
                }
                setIsSavingPickupId(-1);
              })
              .catch((e) => {
                console.log("error on saving pickup", e);
                setIsSavingPickupId(-1);
              });
          } else {
            console.log("saving pickup customer undefined");
            setIsSavingPickupId(-1);
          }
        } else {
          console.log("saving pickup undefined");
          setIsSavingPickupId(-1);
        }
      } else {
        console.log("no order selected");
        setIsSavingPickupId(-1);
      }
    }
  }, [isSavingPickupId]);

  useEffect(() => {
    if (isSavingDeliveryId > -1) {
      if ((selectedOrder?.id || 0) > 0) {
        let delivery = (selectedOrder?.deliveries || []).find(
          (d) => d.id === isSavingDeliveryId
        );

        if (delivery !== undefined) {
          if ((delivery.customer?.id || 0) > 0) {
            axios
              .post(props.serverUrl + "/saveOrderDelivery", {
                id: isSavingDeliveryId,
                order_id: selectedOrder?.id || 0,
                customer_id: delivery.customer.id,
                delivery_date1: delivery.delivery_date1 || "",
                delivery_date2: delivery.delivery_date2 || "",
                delivery_time1: delivery.delivery_time1 || "",
                delivery_time2: delivery.delivery_time2 || "",
                special_instructions: delivery.special_instructions || "",
                type: "delivery",
              })
              .then((res) => {
                if (res.data.result === "OK") {
                  setSelectedOrder({
                    ...selectedOrder,
                    deliveries: (selectedOrder.deliveries || []).map((d, i) => {
                      if (d.id === isSavingDeliveryId) {
                        d = res.data.delivery;

                        setSelectedConsigneeCustomer({
                          ...selectedConsigneeCustomer,
                          delivery_id: res.data.delivery.id,
                        });
                      }
                      return d;
                    }),
                  });

                  if (
                    res.data.order.pickups.length === 1 &&
                    res.data.order.deliveries.length === 1
                  ) {
                    if (
                      !(
                        (selectedOrder?.routing || []).length >= 2 &&
                        selectedOrder.routing[0].pickup_id ===
                        res.data.order.pickups[0].id &&
                        selectedOrder.routing[1].delivery_id ===
                        res.data.order.deliveries[0].id
                      )
                    ) {
                      let routing = [
                        {
                          id: 0,
                          pickup_id: res.data.order.pickups[0].id,
                          delivery_id: null,
                          type: "pickup",
                        },
                        {
                          id: 0,
                          pickup_id: null,
                          delivery_id: res.data.order.deliveries[0].id,
                          type: "delivery",
                        },
                      ];

                      let selected_order = selectedOrder;

                      axios
                        .post(props.serverUrl + "/saveOrderRouting", {
                          order_id: selectedOrder?.id || 0,
                          routing: routing,
                        })
                        .then((res) => {
                          if (res.data.result === "OK") {
                            selected_order = res.data.order;
                            setSelectedOrder(selected_order);

                            setMileageLoaderVisible(true);

                            let params = {
                              mode: "fastest;car;traffic:disabled",
                              routeAttributes: "summary",
                            };

                            let waypointCount = 0;

                            selected_order.routing.map((item, i) => {
                              if (item.type === "pickup") {
                                selected_order.pickups.map((p, i) => {
                                  if (p.id === item.pickup_id) {
                                    if ((p.customer?.zip_data || "") !== "") {
                                      params["waypoint" + waypointCount] =
                                        "geo!" +
                                        p.customer.zip_data.latitude.toString() +
                                        "," +
                                        p.customer.zip_data.longitude.toString();
                                      waypointCount += 1;
                                    }
                                  }
                                  return false;
                                });
                              } else {
                                selected_order.deliveries.map((d, i) => {
                                  if (d.id === item.delivery_id) {
                                    if ((d.customer?.zip_data || "") !== "") {
                                      params["waypoint" + waypointCount] =
                                        "geo!" +
                                        d.customer.zip_data.latitude.toString() +
                                        "," +
                                        d.customer.zip_data.longitude.toString();
                                      waypointCount += 1;
                                    }
                                  }
                                  return false;
                                });
                              }

                              return true;
                            });

                            routingService.calculateRoute(
                              params,
                              (result) => {
                                let miles =
                                  result.response.route[0].summary.distance ||
                                  0;

                                selected_order.miles = miles;

                                setSelectedOrder(selected_order);
                                setMileageLoaderVisible(false);

                                axios
                                  .post(
                                    props.serverUrl + "/saveOrder",
                                    selected_order
                                  )
                                  .then((res) => {
                                    if (res.data.result === "OK") {
                                      setSelectedOrder({
                                        ...selected_order,
                                        order_customer_ratings:
                                          res.data.order.order_customer_ratings,
                                        order_carrier_ratings:
                                          res.data.order.order_carrier_ratings,
                                      });

                                      props.setSelectedOrder({
                                        ...selected_order,
                                        order_customer_ratings:
                                          res.data.order.order_customer_ratings,
                                        order_carrier_ratings:
                                          res.data.order.order_carrier_ratings,
                                        component_id: props.componentId,
                                      });
                                    }
                                  })
                                  .catch((e) => {
                                    console.log(
                                      "error on saving order miles",
                                      e
                                    );
                                    setMileageLoaderVisible(false);
                                  });
                              },
                              (error) => {
                                console.log("error getting mileage", error);
                                selected_order.miles = 0;

                                setSelectedOrder(selected_order);
                                setMileageLoaderVisible(false);

                                axios
                                  .post(
                                    props.serverUrl + "/saveOrder",
                                    selected_order
                                  )
                                  .then((res) => {
                                    if (res.data.result === "OK") {
                                      setSelectedOrder({
                                        ...selected_order,
                                        order_customer_ratings:
                                          res.data.order.order_customer_ratings,
                                        order_carrier_ratings:
                                          res.data.order.order_carrier_ratings,
                                      });

                                      props.setSelectedOrder({
                                        ...selected_order,
                                        order_customer_ratings:
                                          res.data.order.order_customer_ratings,
                                        order_carrier_ratings:
                                          res.data.order.order_carrier_ratings,
                                        component_id: props.componentId,
                                      });
                                    }
                                  })
                                  .catch((e) => {
                                    console.log(
                                      "error on saving order miles",
                                      e
                                    );
                                    setMileageLoaderVisible(false);
                                  });
                              }
                            );
                          } else {
                            selected_order.miles = 0;
                            setSelectedOrder(selected_order);
                            setMileageLoaderVisible(false);

                            axios
                              .post(
                                props.serverUrl + "/saveOrder",
                                selected_order
                              )
                              .then((res) => {
                                if (res.data.result === "OK") {
                                  setSelectedOrder({
                                    ...selected_order,
                                    order_customer_ratings:
                                      res.data.order.order_customer_ratings,
                                    order_carrier_ratings:
                                      res.data.order.order_carrier_ratings,
                                  });

                                  props.setSelectedOrder({
                                    ...selected_order,
                                    order_customer_ratings:
                                      res.data.order.order_customer_ratings,
                                    order_carrier_ratings:
                                      res.data.order.order_carrier_ratings,
                                    component_id: props.componentId,
                                  });
                                }
                              })
                              .catch((e) => {
                                console.log("error on saving order miles", e);
                                setMileageLoaderVisible(false);
                              });
                          }
                        })
                        .catch((e) => {
                          console.log("error on saving order routing", e);
                          setMileageLoaderVisible(false);
                        });
                    }
                  }
                } else {
                  console.log(res.data.result);
                }
                setIsSavingDeliveryId(-1);
              })
              .catch((e) => {
                console.log("error on saving delivery", e);
                setIsSavingDeliveryId(-1);
              });
          } else {
            console.log("saving delivery customer undefined");
            setIsSavingDeliveryId(-1);
          }
        } else {
          console.log("saving delivery undefined");
          setIsSavingDeliveryId(-1);
        }
      } else {
        console.log("no order selected");
        setIsSavingDeliveryId(-1);
      }
    }
  }, [isSavingDeliveryId]);

  const getOrderByOrderNumber = (e) => {
    let key = e.keyCode || e.which;

    if (key === 9) {
      if ((selectedOrder.order_number || "") !== "") {
        setIsLoading(true);
        axios
          .post(props.serverUrl + "/getOrderByOrderNumber", {
            order_number: selectedOrder.order_number,
          })
          .then((res) => {
            if (res.data.result === "OK") {
              let order = JSON.parse(JSON.stringify(res.data.order));

              setSelectedOrder({});
              setSelectedOrder(order);
              // await setTempRouting(order.routing);

              setSelectedBillToCustomer({ ...order.bill_to_company });
              setSelectedBillToCustomerContact({
                ...(order.bill_to_company?.contacts || []).find(
                  (c) => c.is_primary === 1
                ),
              });

              let pickup_id =
                (order.routing || []).find((r) => r.type === "pickup")
                  ?.pickup_id || 0;
              let pickup = {
                ...((order.pickups || []).find((p) => p.id === pickup_id) ||
                  (order.pickups || [])[0]),
              };

              setSelectedShipperCustomer(
                pickup.id === undefined
                  ? {}
                  : {
                    ...pickup.customer,
                    pickup_id: pickup.id,
                    pu_date1: pickup.pu_date1,
                    pu_date2: pickup.pu_date2,
                    pu_time1: pickup.pu_time1,
                    pu_time2: pickup.pu_time2,
                    bol_numbers: pickup.bol_numbers,
                    po_numbers: pickup.po_numbers,
                    ref_numbers: pickup.ref_numbers,
                    seal_number: pickup.seal_number,
                    special_instructions: pickup.special_instructions,
                    type: pickup.type,
                  }
              );
              setSelectedShipperCustomerContact({
                ...(pickup.contacts || []).find((c) => c.is_primary === 1),
              });

              let delivery_id =
                (order.routing || []).find((r) => r.type === "delivery")
                  ?.delivery_id || 0;
              let delivery = {
                ...((order.deliveries || []).find(
                  (d) => d.id === delivery_id
                ) || (order.deliveries || [])[0]),
              };

              setSelectedConsigneeCustomer(
                delivery.id === undefined
                  ? {}
                  : {
                    ...delivery.customer,
                    delivery_id: delivery.id,
                    delivery_date1: delivery.delivery_date1,
                    delivery_date2: delivery.delivery_date2,
                    delivery_time1: delivery.delivery_time1,
                    delivery_time2: delivery.delivery_time2,
                    special_instructions: delivery.special_instructions,
                    type: delivery.type,
                  }
              );
              setSelectedConsigneeCustomerContact({
                ...(delivery.contacts || []).find((c) => c.is_primary === 1),
              });

              setSelectedCarrier({ ...order.carrier });
              setSelectedCarrierContact({
                ...(order.carrier?.contacts || []).find(
                  (c) => c.is_primary === 1
                ),
              });
              setSelectedCarrierDriver({
                ...order.driver,
                name:
                  (order.driver?.first_name || "") +
                  ((order.driver?.last_name || "").trim() === ""
                    ? ""
                    : " " + (order.driver?.last_name || "")),
              });

              setIsLoading(false);
            } else {
              setIsLoading(false);
              refOrderNumber.current.focus();
            }
          })
          .catch((e) => {
            console.log("error getting order by order number", e);
            setIsLoading(false);
          });
      }
    }
  };

  const getOrderByTripNumber = (e) => {
    let key = e.keyCode || e.which;

    if (key === 9) {
      if ((props.trip_number || "") !== "") {
        setIsLoading(true);
        axios
          .post(props.serverUrl + "/getOrderByTripNumber", {
            trip_number: props.trip_number,
          })
          .then((res) => {
            if (res.data.result === "OK") {
              let order = JSON.parse(JSON.stringify(res.data.order));

              setSelectedOrder({});
              setSelectedOrder(order);
              // await setTempRouting(order.routing);

              setSelectedBillToCustomer({ ...order.bill_to_company });

              setSelectedBillToCustomerContact({
                ...(order.bill_to_company?.contacts || []).find(
                  (c) => c.is_primary === 1
                ),
              });

              let pickup_id =
                (order.routing || []).find((r) => r.type === "pickup")
                  ?.pickup_id || 0;
              let pickup = {
                ...((order.pickups || []).find((p) => p.id === pickup_id) ||
                  (order.pickups || [])[0]),
              };

              setSelectedShipperCustomer(
                pickup.id === undefined
                  ? {}
                  : {
                    ...pickup.customer,
                    pickup_id: pickup.id,
                    pu_date1: pickup.pu_date1,
                    pu_date2: pickup.pu_date2,
                    pu_time1: pickup.pu_time1,
                    pu_time2: pickup.pu_time2,
                    bol_numbers: pickup.bol_numbers,
                    po_numbers: pickup.po_numbers,
                    ref_numbers: pickup.ref_numbers,
                    seal_number: pickup.seal_number,
                    special_instructions: pickup.special_instructions,
                    type: pickup.type,
                  }
              );

              setSelectedShipperCustomerContact({
                ...(pickup.contacts || []).find((c) => c.is_primary === 1),
              });

              let delivery_id =
                (order.routing || []).find((r) => r.type === "delivery")
                  ?.delivery_id || 0;
              let delivery = {
                ...((order.deliveries || []).find(
                  (d) => d.id === delivery_id
                ) || (order.deliveries || [])[0]),
              };

              setSelectedConsigneeCustomer(
                delivery.id === undefined
                  ? {}
                  : {
                    ...delivery.customer,
                    delivery_id: delivery.id,
                    delivery_date1: delivery.pu_date1,
                    delivery_date2: delivery.pu_date2,
                    delivery_time1: delivery.pu_time1,
                    delivery_time2: delivery.pu_time2,
                    special_instructions: delivery.special_instructions,
                    type: delivery.type,
                  }
              );

              setSelectedConsigneeCustomerContact({
                ...(delivery.contacts || []).find((c) => c.is_primary === 1),
              });

              setSelectedCarrier({ ...order.carrier });
              setSelectedCarrierContact({
                ...(order.carrier?.contacts || []).find(
                  (c) => c.is_primary === 1
                ),
              });

              setSelectedCarrierDriver({
                ...order.driver,
                name:
                  (order.driver?.first_name || "") +
                  ((order.driver?.last_name || "").trim() === ""
                    ? ""
                    : " " + (order.driver?.last_name || "")),
              });

              setIsLoading(false);
            }
          })
          .catch((e) => {
            console.log("error getting order by trip number", e);
            setIsLoading(false);
          });
      }
    }
  };

  const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const bolNumbersOnKeydown = async (e) => {
    let keyCode = e.keyCode || e.which;

    if (keyCode === 32) {
      e.preventDefault();

      await setSelectedShipperCustomer({
        ...selectedShipperCustomer,
        bol_numbers: ((selectedShipperCustomer?.bol_numbers || "") + " " + shipperBolNumber).trim(),
      });

      await setSelectedOrder({
        ...selectedOrder,
        pickups: (selectedOrder?.pickups || []).map((pu, i) => {
          if (pu.id === selectedShipperCustomer.pickup_id) {
            pu.bol_numbers = (
              (selectedShipperCustomer?.bol_numbers || "") +
              " " +
              shipperBolNumber
            ).trim();
          }
          return pu;
        }),
      });
      await setShipperBolNumber("");
      refBolNumbers.current.focus();

      setIsSavingPickupId(selectedShipperCustomer?.pickup_id || 0);
    }
    if (keyCode === 9) {
      if (shipperBolNumber || "" !== "") {
        e.preventDefault();
        e.stopPropagation();
      }

      await setSelectedShipperCustomer({
        ...selectedShipperCustomer,
        bol_numbers: (
          (selectedShipperCustomer?.bol_numbers || "") +
          " " +
          shipperBolNumber
        ).trim(),
      });

      let pickups = (selectedOrder?.pickups || []).map((pu, i) => {
        if (pu.id === selectedShipperCustomer.pickup_id) {
          pu.bol_numbers = (
            (selectedShipperCustomer?.bol_numbers || "") +
            " " +
            shipperBolNumber
          ).trim();
        }
        return pu;
      });

      await setSelectedOrder({ ...selectedOrder, pickups: pickups });
      await setShipperBolNumber("");
      refBolNumbers.current.focus();

      setIsSavingPickupId(selectedShipperCustomer?.pickup_id || 0);
    }
  };

  const poNumbersOnKeydown = async (e) => {
    let keyCode = e.keyCode || e.which;

    if (keyCode === 32) {
      e.preventDefault();

      await setSelectedShipperCustomer({
        ...selectedShipperCustomer,
        po_numbers: (
          (selectedShipperCustomer?.po_numbers || "") +
          " " +
          shipperPoNumber
        ).trim(),
      });

      await setSelectedOrder({
        ...selectedOrder,
        pickups: (selectedOrder?.pickups || []).map((pu, i) => {
          if (pu.id === selectedShipperCustomer.pickup_id) {
            pu.po_numbers = (
              (selectedShipperCustomer?.po_numbers || "") +
              " " +
              shipperPoNumber
            ).trim();
          }
          return pu;
        }),
      });
      await setShipperPoNumber("");
      refPoNumbers.current.focus();

      setIsSavingPickupId(selectedShipperCustomer?.pickup_id || 0);
    }
    if (keyCode === 9) {
      if (shipperPoNumber || "" !== "") {
        e.preventDefault();
        e.stopPropagation();
      }

      await setSelectedShipperCustomer({
        ...selectedShipperCustomer,
        po_numbers: (
          (selectedShipperCustomer?.po_numbers || "") +
          " " +
          shipperPoNumber
        ).trim(),
      });

      let pickups = (selectedOrder?.pickups || []).map((pu, i) => {
        if (pu.id === selectedShipperCustomer.pickup_id) {
          pu.po_numbers = (
            (selectedShipperCustomer?.po_numbers || "") +
            " " +
            shipperPoNumber
          ).trim();
        }
        return pu;
      });

      await setSelectedOrder({ ...selectedOrder, pickups: pickups });
      await setShipperPoNumber("");
      refPoNumbers.current.focus();

      setIsSavingPickupId(selectedShipperCustomer?.pickup_id || 0);
    }
  };

  const refNumbersOnKeydown = async (e) => {
    let keyCode = e.keyCode || e.which;

    if (keyCode === 32) {
      e.preventDefault();

      await setSelectedShipperCustomer({
        ...selectedShipperCustomer,
        ref_numbers: (
          (selectedShipperCustomer?.ref_numbers || "") +
          " " +
          shipperRefNumber
        ).trim(),
      });

      await setSelectedOrder({
        ...selectedOrder,
        pickups: (selectedOrder?.pickups || []).map((pu, i) => {
          if (pu.id === selectedShipperCustomer.pickup_id) {
            pu.ref_numbers = (
              (selectedShipperCustomer?.ref_numbers || "") +
              " " +
              shipperRefNumber
            ).trim();
          }
          return pu;
        }),
      });
      await setShipperRefNumber("");
      refRefNumbers.current.focus();

      setIsSavingPickupId(selectedShipperCustomer?.pickup_id || 0);
    }
    if (keyCode === 9) {
      if (shipperRefNumber || "" !== "") {
        e.preventDefault();
        e.stopPropagation();
      }

      await setSelectedShipperCustomer({
        ...selectedShipperCustomer,
        ref_numbers: (
          (selectedShipperCustomer?.ref_numbers || "") +
          " " +
          shipperRefNumber
        ).trim(),
      });

      let pickups = (selectedOrder?.pickups || []).map((pu, i) => {
        if (pu.id === selectedShipperCustomer.pickup_id) {
          pu.ref_numbers = (
            (selectedShipperCustomer?.ref_numbers || "") +
            " " +
            shipperRefNumber
          ).trim();
        }
        return pu;
      });

      await setSelectedOrder({ ...selectedOrder, pickups: pickups });
      await setShipperRefNumber("");
      refRefNumbers.current.focus();

      setIsSavingPickupId(selectedShipperCustomer?.pickup_id || 0);
    }
  };

  const printWindow = (data) => {
    let mywindow = window.open("", "new div", "height=400,width=600");
    mywindow.document.write("<html><head><title></title>");
    mywindow.document.write(
      '<link rel="stylesheet" href="../../css/index.css" type="text/css" media="all" />'
    );
    mywindow.document.write(
      "<style>@media print {@page {margin: 0;}body {margin:0;padding: 15mm 10mm;}}</style>"
    );
    mywindow.document.write("</head><body >");
    mywindow.document.write(data);
    mywindow.document.write("</body></html>");
    mywindow.document.close();
    mywindow.focus();
    setTimeout(function () {
      mywindow.print();
    }, 1000);

    return true;
  };

  const getPickupsOnRouting = () => {
    let pickups = [];

    try {
      (selectedOrder?.routing || []).map((r, i) => {
        if (r.type === "pickup") {
          pickups.push(selectedOrder.pickups.find((p) => p.id === r.pickup_id));
        }
        return false;
      });
    } catch (e) {
      console.log(selectedOrder);
    }

    return pickups;
  };

  const getDeliveriesOnRouting = () => {
    let deliveries = [];

    (selectedOrder?.routing || []).map((r, i) => {
      if (r.type === "delivery") {
        deliveries.push(
          selectedOrder.deliveries.find((d) => d.id === r.delivery_id)
        );
      }
      return false;
    });

    return deliveries;
  };

  const importOrdersBtnClick = () => {
    let panel = {
      panelName: `${props.panelName}-order-import`,
      component: <OrderImport
        title='Import Orders'
        tabTimes={95000 + props.tabTimes}
        panelName={`${props.panelName}-order-import`}
        origin={props.origin}
        openPanel={props.openPanel}
        closePanel={props.closePanel}
        componentId={moment().format('x')}
      />
    }

    props.openPanel(panel, props.origin);
  }

  return (
    <div
      className="dispatch-main-container"
      style={{
        borderRadius: props.scale === 1 ? 0 : "20px",
        background: props.isOnPanel ? "transparent" : "rgb(250, 250, 250)",
        background: props.isOnPanel
          ? "transparent"
          : "-moz-radial-gradient(center, ellipse cover, rgba(250, 250, 250, 1) 0%, rgba(200, 200, 200, 1) 100%)",
        background: props.isOnPanel
          ? "transparent"
          : "-webkit-radial-gradient(center, ellipse cover, rgba(250, 250, 250, 1) 0%, rgba(200, 200, 200, 1) 100%)",
        background: props.isOnPanel
          ? "transparent"
          : "radial-gradient(ellipse at center, rgba(250, 250, 250, 1) 0%, rgba(200, 200, 200, 1) 100%)",
        padding: props.isOnPanel ? "10px 0" : 10,
        position: props.isOnPanel ? "unset" : "relative",
      }}
    >
      <div className="fields-container-row">
        <div
          className="fields-container-col"
          style={{
            minWidth: "91%",
            maxWidth: "91%",
            display: "flex",
            flexDirection: "column",
            marginRight: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              marginBottom: 10,
              flexGrow: 1,
              flexBasis: "100%",
              alignItems: "center",
            }}
          >
            <div style={{ minWidth: "38%", maxWidth: "38%", marginRight: 10 }}>
              <div className="form-borderless-box">
                <div
                  className="form-row"
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div
                    className="input-box-container"
                    style={{
                      width: "9rem",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.7rem",
                        color: "rgba(0,0,0,0.7)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      A/E Number:
                    </div>
                    <input
                      style={{ textAlign: "right", fontWeight: "bold" }}
                      type="text"
                      readOnly={true}
                      onChange={(e) => { }}
                      value={selectedOrder?.ae_number || ""}
                    />
                  </div>

                  <div
                    className="input-box-container"
                    style={{
                      width: "9rem",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.7rem",
                        color: "rgba(0,0,0,0.7)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Order Number
                    </div>
                    <input
                      style={{ textAlign: "right", fontWeight: "bold" }}
                      tabIndex={1 + props.tabTimes}
                      type="text"
                      ref={refOrderNumber}
                      onKeyDown={getOrderByOrderNumber}
                      onChange={(e) => {
                        setSelectedOrder({
                          ...selectedOrder,
                          order_number: e.target.value,
                        });
                      }}
                      value={selectedOrder?.order_number || ""}
                    />
                  </div>

                  <div
                    className="input-box-container"
                    style={{
                      width: "9rem",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.7rem",
                        color: "rgba(0,0,0,0.7)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Trip Number
                    </div>
                    <input
                      style={{ textAlign: "right", fontWeight: "bold" }}
                      tabIndex={2 + props.tabTimes}
                      type="text"
                      onKeyDown={getOrderByTripNumber}
                      onChange={(e) => {
                        setSelectedOrder({
                          ...selectedOrder,
                          trip_number: e.target.value,
                        });
                      }}
                      value={
                        (selectedCarrier?.id || 0) === 0
                          ? ""
                          : (selectedOrder?.trip_number || 0) === 0
                            ? ""
                            : selectedOrder?.trip_number
                      }
                    />
                  </div>
                  <div className="mochi-button" onClick={dispatchClearBtnClick}>
                    <div className="mochi-button-decorator mochi-button-decorator-left">
                      (
                    </div>
                    <div className="mochi-button-base">Clear</div>
                    <div className="mochi-button-decorator mochi-button-decorator-right">
                      )
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ minWidth: "38%", maxWidth: "38%", marginRight: 10 }}>
              <div className="form-borderless-box">
                <div
                  className="form-row"
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div
                    className="select-box-container"
                    style={{ width: "9rem" }}
                  >
                    <div className="select-box-wrapper">
                      <input
                        type="text"
                        tabIndex={3 + props.tabTimes}
                        placeholder="Division"
                        ref={refDivision}
                        onKeyDown={async (e) => {
                          let key = e.keyCode || e.which;

                          switch (key) {
                            case 37:
                            case 38: // arrow left | arrow up
                              e.preventDefault();
                              if (divisionItems.length > 0) {
                                let selectedIndex = divisionItems.findIndex(
                                  (item) => item.selected
                                );

                                if (selectedIndex === -1) {
                                  await setDivisionItems(
                                    divisionItems.map((item, index) => {
                                      item.selected = index === 0;
                                      return item;
                                    })
                                  );
                                } else {
                                  await setDivisionItems(
                                    divisionItems.map((item, index) => {
                                      if (selectedIndex === 0) {
                                        item.selected =
                                          index === divisionItems.length - 1;
                                      } else {
                                        item.selected =
                                          index === selectedIndex - 1;
                                      }
                                      return item;
                                    })
                                  );
                                }

                                refDivisionPopupItems.current.map((r, i) => {
                                  if (r && r.classList.contains("selected")) {
                                    r.scrollIntoView({
                                      behavior: "auto",
                                      block: "center",
                                      inline: "nearest",
                                    });
                                  }
                                  return true;
                                });
                              } else {
                                axios
                                  .post(props.serverUrl + "/getDivisions")
                                  .then(async (res) => {
                                    if (res.data.result === "OK") {
                                      await setDivisionItems(
                                        res.data.divisions.map(
                                          (item, index) => {
                                            item.selected =
                                              (selectedOrder?.division?.id ||
                                                0) === 0
                                                ? index === 0
                                                : item.id ===
                                                selectedOrder.division.id;
                                            return item;
                                          }
                                        )
                                      );

                                      refDivisionPopupItems.current.map(
                                        (r, i) => {
                                          if (
                                            r &&
                                            r.classList.contains("selected")
                                          ) {
                                            r.scrollIntoView({
                                              behavior: "auto",
                                              block: "center",
                                              inline: "nearest",
                                            });
                                          }
                                          return true;
                                        }
                                      );
                                    }
                                  })
                                  .catch(async (e) => {
                                    console.log("error getting divisions", e);
                                  });
                              }
                              break;

                            case 39:
                            case 40: // arrow right | arrow down
                              e.preventDefault();
                              if (divisionItems.length > 0) {
                                let selectedIndex = divisionItems.findIndex(
                                  (item) => item.selected
                                );

                                if (selectedIndex === -1) {
                                  await setDivisionItems(
                                    divisionItems.map((item, index) => {
                                      item.selected = index === 0;
                                      return item;
                                    })
                                  );
                                } else {
                                  await setDivisionItems(
                                    divisionItems.map((item, index) => {
                                      if (
                                        selectedIndex ===
                                        divisionItems.length - 1
                                      ) {
                                        item.selected = index === 0;
                                      } else {
                                        item.selected =
                                          index === selectedIndex + 1;
                                      }
                                      return item;
                                    })
                                  );
                                }

                                refDivisionPopupItems.current.map((r, i) => {
                                  if (r && r.classList.contains("selected")) {
                                    r.scrollIntoView({
                                      behavior: "auto",
                                      block: "center",
                                      inline: "nearest",
                                    });
                                  }
                                  return true;
                                });
                              } else {
                                axios
                                  .post(props.serverUrl + "/getDivisions")
                                  .then(async (res) => {
                                    if (res.data.result === "OK") {
                                      await setDivisionItems(
                                        res.data.divisions.map(
                                          (item, index) => {
                                            item.selected =
                                              (selectedOrder?.division?.id ||
                                                0) === 0
                                                ? index === 0
                                                : item.id ===
                                                selectedOrder.division.id;
                                            return item;
                                          }
                                        )
                                      );

                                      refDivisionPopupItems.current.map(
                                        (r, i) => {
                                          if (
                                            r &&
                                            r.classList.contains("selected")
                                          ) {
                                            r.scrollIntoView({
                                              behavior: "auto",
                                              block: "center",
                                              inline: "nearest",
                                            });
                                          }
                                          return true;
                                        }
                                      );
                                    }
                                  })
                                  .catch(async (e) => {
                                    console.log("error getting divisions", e);
                                  });
                              }
                              break;

                            case 27: // escape
                              setDivisionItems([]);
                              break;

                            case 13: // enter
                              if (
                                divisionItems.length > 0 &&
                                divisionItems.findIndex(
                                  (item) => item.selected
                                ) > -1
                              ) {
                                await setSelectedOrder({
                                  ...selectedOrder,
                                  division:
                                    divisionItems[
                                    divisionItems.findIndex(
                                      (item) => item.selected
                                    )
                                    ],
                                  division_id:
                                    divisionItems[
                                      divisionItems.findIndex(
                                        (item) => item.selected
                                      )
                                    ].id,
                                });

                                validateOrderForSaving({ keyCode: 9 });
                                setDivisionItems([]);
                                refDivision.current.focus();
                              }
                              break;

                            case 9: // tab
                              if (divisionItems.length > 0) {
                                e.preventDefault();
                                await setSelectedOrder({
                                  ...selectedOrder,
                                  division:
                                    divisionItems[
                                    divisionItems.findIndex(
                                      (item) => item.selected
                                    )
                                    ],
                                  division_id:
                                    divisionItems[
                                      divisionItems.findIndex(
                                        (item) => item.selected
                                      )
                                    ].id,
                                });
                                validateOrderForSaving({ keyCode: 9 });
                                setDivisionItems([]);
                                refDivision.current.focus();
                              }
                              break;

                            default:
                              break;
                          }
                        }}
                        onBlur={async () => {
                          if ((selectedOrder?.division?.id || 0) === 0) {
                            await setSelectedOrder({
                              ...selectedOrder,
                              division: {},
                            });
                          }
                        }}
                        onInput={async (e) => {
                          let division = selectedOrder?.division || {};
                          division.id = 0;
                          division.name = e.target.value;
                          await setSelectedOrder({
                            ...selectedOrder,
                            division: division,
                            division_id: division.id,
                          });

                          if (e.target.value.trim() === "") {
                            setDivisionItems([]);
                          } else {
                            axios
                              .post(props.serverUrl + "/getDivisions", {
                                name: e.target.value.trim(),
                              })
                              .then(async (res) => {
                                if (res.data.result === "OK") {
                                  await setDivisionItems(
                                    res.data.divisions.map((item, index) => {
                                      item.selected =
                                        (selectedOrder?.division?.id || 0) === 0
                                          ? index === 0
                                          : item.id ===
                                          selectedOrder.division.id;
                                      return item;
                                    })
                                  );
                                }
                              })
                              .catch(async (e) => {
                                console.log("error getting divisions", e);
                              });
                          }
                        }}
                        onChange={async (e) => {
                          let division = selectedOrder?.division || {};
                          division.id = 0;
                          division.name = e.target.value;
                          await setSelectedOrder({
                            ...selectedOrder,
                            division: division,
                            division_id: division.id,
                          });
                        }}
                        value={selectedOrder?.division?.name || ""}
                      />
                      <FontAwesomeIcon
                        className="dropdown-button"
                        icon={faCaretDown}
                        onClick={() => {
                          if (divisionItems.length > 0) {
                            setDivisionItems([]);
                          } else {
                            if (
                              (selectedOrder?.division?.id || 0) === 0 &&
                              (selectedOrder?.division?.name || "") !== ""
                            ) {
                              axios
                                .post(props.serverUrl + "/getDivisions", {
                                  name: selectedOrder?.division.name,
                                })
                                .then(async (res) => {
                                  if (res.data.result === "OK") {
                                    await setDivisionItems(
                                      res.data.divisions.map((item, index) => {
                                        item.selected =
                                          (selectedOrder?.division?.id || 0) ===
                                            0
                                            ? index === 0
                                            : item.id ===
                                            selectedOrder.division.id;
                                        return item;
                                      })
                                    );

                                    refDivisionPopupItems.current.map(
                                      (r, i) => {
                                        if (
                                          r &&
                                          r.classList.contains("selected")
                                        ) {
                                          r.scrollIntoView({
                                            behavior: "auto",
                                            block: "center",
                                            inline: "nearest",
                                          });
                                        }
                                        return true;
                                      }
                                    );
                                  }
                                })
                                .catch(async (e) => {
                                  console.log("error getting divisions", e);
                                });
                            } else {
                              axios
                                .post(props.serverUrl + "/getDivisions")
                                .then(async (res) => {
                                  if (res.data.result === "OK") {
                                    await setDivisionItems(
                                      res.data.divisions.map((item, index) => {
                                        item.selected =
                                          (selectedOrder?.division?.id || 0) ===
                                            0
                                            ? index === 0
                                            : item.id ===
                                            selectedOrder.division.id;
                                        return item;
                                      })
                                    );

                                    refDivisionPopupItems.current.map(
                                      (r, i) => {
                                        if (
                                          r &&
                                          r.classList.contains("selected")
                                        ) {
                                          r.scrollIntoView({
                                            behavior: "auto",
                                            block: "center",
                                            inline: "nearest",
                                          });
                                        }
                                        return true;
                                      }
                                    );
                                  }
                                })
                                .catch(async (e) => {
                                  console.log("error getting divisions", e);
                                });
                            }
                          }

                          refDivision.current.focus();
                        }}
                      />
                    </div>

                    {divisionTransition(
                      (style, item) =>
                        item && (
                          <animated.div
                            className="mochi-contextual-container"
                            id="mochi-contextual-container-division"
                            style={{
                              ...style,
                              left: "-50%",
                              display: "block",
                            }}
                            ref={refDivisionDropDown}
                          >
                            <div
                              className="mochi-contextual-popup vertical below"
                              style={{ height: 150 }}
                            >
                              <div className="mochi-contextual-popup-content">
                                <div className="mochi-contextual-popup-wrapper">
                                  {divisionItems.map((item, index) => {
                                    const mochiItemClasses = classnames({
                                      "mochi-item": true,
                                      selected: item.selected,
                                    });

                                    const searchValue =
                                      (selectedOrder?.division?.id || 0) ===
                                        0 &&
                                        (selectedOrder?.division?.name || "") !==
                                        ""
                                        ? selectedOrder?.division?.name
                                        : undefined;

                                    return (
                                      <div
                                        key={index}
                                        className={mochiItemClasses}
                                        id={item.id}
                                        onClick={() => {
                                          setSelectedOrder({
                                            ...selectedOrder,
                                            division: item,
                                            division_id: item.id,
                                          });

                                          window.setTimeout(() => {
                                            validateOrderForSaving({
                                              keyCode: 9,
                                            });
                                            setDivisionItems([]);
                                            refDivision.current.focus();
                                          }, 0);
                                        }}
                                        ref={(ref) =>
                                          refDivisionPopupItems.current.push(
                                            ref
                                          )
                                        }
                                      >
                                        {searchValue === undefined ? (
                                          item.name
                                        ) : (
                                          <Highlighter
                                            highlightClassName="mochi-item-highlight-text"
                                            searchWords={[searchValue]}
                                            autoEscape={true}
                                            textToHighlight={item.name}
                                          />
                                        )}
                                        {item.selected && (
                                          <FontAwesomeIcon
                                            className="dropdown-selected"
                                            icon={faCaretRight}
                                          />
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </animated.div>
                        )
                    )}
                  </div>

                  <div
                    className="select-box-container"
                    style={{ width: "9rem" }}
                  >
                    <div className="select-box-wrapper">
                      <input
                        type="text"
                        tabIndex={4 + props.tabTimes}
                        placeholder="Load Type"
                        ref={refLoadType}
                        onKeyDown={async (e) => {
                          let key = e.keyCode || e.which;

                          switch (key) {
                            case 37:
                            case 38: // arrow left | arrow up
                              e.preventDefault();
                              if (loadTypeItems.length > 0) {
                                let selectedIndex = loadTypeItems.findIndex(
                                  (item) => item.selected
                                );

                                if (selectedIndex === -1) {
                                  await setLoadTypeItems(
                                    loadTypeItems.map((item, index) => {
                                      item.selected = index === 0;
                                      return item;
                                    })
                                  );
                                } else {
                                  await setLoadTypeItems(
                                    loadTypeItems.map((item, index) => {
                                      if (selectedIndex === 0) {
                                        item.selected =
                                          index === loadTypeItems.length - 1;
                                      } else {
                                        item.selected =
                                          index === selectedIndex - 1;
                                      }
                                      return item;
                                    })
                                  );
                                }

                                refLoadTypePopupItems.current.map((r, i) => {
                                  if (r && r.classList.contains("selected")) {
                                    r.scrollIntoView({
                                      behavior: "auto",
                                      block: "center",
                                      inline: "nearest",
                                    });
                                  }
                                  return true;
                                });
                              } else {
                                axios
                                  .post(props.serverUrl + "/getLoadTypes")
                                  .then(async (res) => {
                                    if (res.data.result === "OK") {
                                      await setLoadTypeItems(
                                        res.data.load_types.map(
                                          (item, index) => {
                                            item.selected =
                                              (selectedOrder?.load_type?.id ||
                                                0) === 0
                                                ? index === 0
                                                : item.id ===
                                                selectedOrder.load_type.id;
                                            return item;
                                          }
                                        )
                                      );

                                      refLoadTypePopupItems.current.map(
                                        (r, i) => {
                                          if (
                                            r &&
                                            r.classList.contains("selected")
                                          ) {
                                            r.scrollIntoView({
                                              behavior: "auto",
                                              block: "center",
                                              inline: "nearest",
                                            });
                                          }
                                          return true;
                                        }
                                      );
                                    }
                                  })
                                  .catch(async (e) => {
                                    console.log("error getting load types", e);
                                  });
                              }
                              break;

                            case 39:
                            case 40: // arrow right | arrow down
                              e.preventDefault();
                              if (loadTypeItems.length > 0) {
                                let selectedIndex = loadTypeItems.findIndex(
                                  (item) => item.selected
                                );

                                if (selectedIndex === -1) {
                                  await setLoadTypeItems(
                                    loadTypeItems.map((item, index) => {
                                      item.selected = index === 0;
                                      return item;
                                    })
                                  );
                                } else {
                                  await setLoadTypeItems(
                                    loadTypeItems.map((item, index) => {
                                      if (
                                        selectedIndex ===
                                        loadTypeItems.length - 1
                                      ) {
                                        item.selected = index === 0;
                                      } else {
                                        item.selected =
                                          index === selectedIndex + 1;
                                      }
                                      return item;
                                    })
                                  );
                                }

                                refLoadTypePopupItems.current.map((r, i) => {
                                  if (r && r.classList.contains("selected")) {
                                    r.scrollIntoView({
                                      behavior: "auto",
                                      block: "center",
                                      inline: "nearest",
                                    });
                                  }
                                  return true;
                                });
                              } else {
                                axios
                                  .post(props.serverUrl + "/getLoadTypes")
                                  .then(async (res) => {
                                    if (res.data.result === "OK") {
                                      await setLoadTypeItems(
                                        res.data.load_types.map(
                                          (item, index) => {
                                            item.selected =
                                              (selectedOrder?.load_type?.id ||
                                                0) === 0
                                                ? index === 0
                                                : item.id ===
                                                selectedOrder.load_type.id;
                                            return item;
                                          }
                                        )
                                      );

                                      refLoadTypePopupItems.current.map(
                                        (r, i) => {
                                          if (
                                            r &&
                                            r.classList.contains("selected")
                                          ) {
                                            r.scrollIntoView({
                                              behavior: "auto",
                                              block: "center",
                                              inline: "nearest",
                                            });
                                          }
                                          return true;
                                        }
                                      );
                                    }
                                  })
                                  .catch(async (e) => {
                                    console.log("error getting load types", e);
                                  });
                              }
                              break;

                            case 27: // escape
                              setLoadTypeItems([]);
                              break;

                            case 13: // enter
                              if (
                                loadTypeItems.length > 0 &&
                                loadTypeItems.findIndex(
                                  (item) => item.selected
                                ) > -1
                              ) {
                                await setSelectedOrder({
                                  ...selectedOrder,
                                  load_type:
                                    loadTypeItems[
                                    loadTypeItems.findIndex(
                                      (item) => item.selected
                                    )
                                    ],
                                  load_type_id:
                                    loadTypeItems[
                                      loadTypeItems.findIndex(
                                        (item) => item.selected
                                      )
                                    ].id,
                                });
                                validateOrderForSaving({ keyCode: 9 });
                                setLoadTypeItems([]);
                                refLoadType.current.focus();
                              }
                              break;

                            case 9: // tab
                              if (loadTypeItems.length > 0) {
                                e.preventDefault();
                                await setSelectedOrder({
                                  ...selectedOrder,
                                  load_type:
                                    loadTypeItems[
                                    loadTypeItems.findIndex(
                                      (item) => item.selected
                                    )
                                    ],
                                  load_type_id:
                                    loadTypeItems[
                                      loadTypeItems.findIndex(
                                        (item) => item.selected
                                      )
                                    ].id,
                                });
                                validateOrderForSaving({ keyCode: 9 });
                                setLoadTypeItems([]);
                                refLoadType.current.focus();
                              }
                              break;

                            default:
                              break;
                          }
                        }}
                        onBlur={async () => {
                          if ((selectedOrder?.load_type?.id || 0) === 0) {
                            await setSelectedOrder({
                              ...selectedOrder,
                              load_type: {},
                            });
                          }
                        }}
                        onInput={async (e) => {
                          let load_type = selectedOrder?.load_type || {};
                          load_type.id = 0;
                          load_type.name = e.target.value;
                          await setSelectedOrder({
                            ...selectedOrder,
                            load_type: load_type,
                            load_type_id: load_type.id,
                          });

                          if (e.target.value.trim() === "") {
                            setLoadTypeItems([]);
                          } else {
                            axios
                              .post(props.serverUrl + "/getLoadTypes", {
                                name: e.target.value.trim(),
                              })
                              .then(async (res) => {
                                if (res.data.result === "OK") {
                                  await setLoadTypeItems(
                                    res.data.load_types.map((item, index) => {
                                      item.selected =
                                        (selectedOrder?.load_type?.id || 0) ===
                                          0
                                          ? index === 0
                                          : item.id ===
                                          selectedOrder.load_type.id;
                                      return item;
                                    })
                                  );
                                }
                              })
                              .catch(async (e) => {
                                console.log("error getting load types", e);
                              });
                          }
                        }}
                        onChange={async (e) => {
                          let load_type = selectedOrder?.load_type || {};
                          load_type.id = 0;
                          load_type.name = e.target.value;
                          await setSelectedOrder({
                            ...selectedOrder,
                            load_type: load_type,
                            load_type_id: load_type.id,
                          });
                        }}
                        value={selectedOrder?.load_type?.name || ""}
                      />
                      <FontAwesomeIcon
                        className="dropdown-button"
                        icon={faCaretDown}
                        onClick={() => {
                          if (loadTypeItems.length > 0) {
                            setLoadTypeItems([]);
                          } else {
                            if (
                              (selectedOrder?.load_type?.id || 0) === 0 &&
                              (selectedOrder?.load_type?.name || "") !== ""
                            ) {
                              axios
                                .post(props.serverUrl + "/getLoadTypes", {
                                  name: selectedOrder?.load_type.name,
                                })
                                .then(async (res) => {
                                  if (res.data.result === "OK") {
                                    await setLoadTypeItems(
                                      res.data.load_types.map((item, index) => {
                                        item.selected =
                                          (selectedOrder?.load_type?.id ||
                                            0) === 0
                                            ? index === 0
                                            : item.id ===
                                            selectedOrder.load_type.id;
                                        return item;
                                      })
                                    );

                                    refLoadTypePopupItems.current.map(
                                      (r, i) => {
                                        if (
                                          r &&
                                          r.classList.contains("selected")
                                        ) {
                                          r.scrollIntoView({
                                            behavior: "auto",
                                            block: "center",
                                            inline: "nearest",
                                          });
                                        }
                                        return true;
                                      }
                                    );
                                  }
                                })
                                .catch(async (e) => {
                                  console.log("error getting load types", e);
                                });
                            } else {
                              axios
                                .post(props.serverUrl + "/getLoadTypes")
                                .then(async (res) => {
                                  if (res.data.result === "OK") {
                                    await setLoadTypeItems(
                                      res.data.load_types.map((item, index) => {
                                        item.selected =
                                          (selectedOrder?.load_type?.id ||
                                            0) === 0
                                            ? index === 0
                                            : item.id ===
                                            selectedOrder.load_type.id;
                                        return item;
                                      })
                                    );

                                    refLoadTypePopupItems.current.map(
                                      (r, i) => {
                                        if (
                                          r &&
                                          r.classList.contains("selected")
                                        ) {
                                          r.scrollIntoView({
                                            behavior: "auto",
                                            block: "center",
                                            inline: "nearest",
                                          });
                                        }
                                        return true;
                                      }
                                    );
                                  }
                                })
                                .catch(async (e) => {
                                  console.log("error getting load types", e);
                                });
                            }
                          }

                          refLoadType.current.focus();
                        }}
                      />
                    </div>

                    {loadTypeTransition(
                      (style, item) =>
                        item && (
                          <animated.div
                            className="mochi-contextual-container"
                            id="mochi-contextual-container-load-type"
                            style={{
                              ...style,
                              left: "-50%",
                              display: "block",
                            }}
                            ref={refLoadTypeDropDown}
                          >
                            <div
                              className="mochi-contextual-popup vertical below"
                              style={{ height: 150 }}
                            >
                              <div className="mochi-contextual-popup-content">
                                <div className="mochi-contextual-popup-wrapper">
                                  {loadTypeItems.map((item, index) => {
                                    const mochiItemClasses = classnames({
                                      "mochi-item": true,
                                      selected: item.selected,
                                    });

                                    const searchValue =
                                      (selectedOrder?.load_type?.id || 0) ===
                                        0 &&
                                        (selectedOrder?.load_type?.name || "") !==
                                        ""
                                        ? selectedOrder?.load_type?.name
                                        : undefined;

                                    return (
                                      <div
                                        key={index}
                                        className={mochiItemClasses}
                                        id={item.id}
                                        onClick={() => {
                                          setSelectedOrder({
                                            ...selectedOrder,
                                            load_type: item,
                                            load_type_id: item.id,
                                          });

                                          window.setTimeout(() => {
                                            validateOrderForSaving({
                                              keyCode: 9,
                                            });
                                            setLoadTypeItems([]);
                                            refLoadType.current.focus();
                                          }, 0);
                                        }}
                                        ref={(ref) =>
                                          refLoadTypePopupItems.current.push(
                                            ref
                                          )
                                        }
                                      >
                                        {searchValue === undefined ? (
                                          item.name
                                        ) : (
                                          <Highlighter
                                            highlightClassName="mochi-item-highlight-text"
                                            searchWords={[searchValue]}
                                            autoEscape={true}
                                            textToHighlight={item.name}
                                          />
                                        )}
                                        {item.selected && (
                                          <FontAwesomeIcon
                                            className="dropdown-selected"
                                            icon={faCaretRight}
                                          />
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </animated.div>
                        )
                    )}
                  </div>

                  <div
                    className="select-box-container"
                    style={{ width: "9rem" }}
                  >
                    <div className="select-box-wrapper">
                      <input
                        type="text"
                        tabIndex={5 + props.tabTimes}
                        placeholder="Template"
                        ref={refTemplate}
                        onKeyDown={async (e) => {
                          let key = e.keyCode || e.which;

                          switch (key) {
                            case 37:
                            case 38: // arrow left | arrow up
                              e.preventDefault();
                              if (templateItems.length > 0) {
                                let selectedIndex = templateItems.findIndex(
                                  (item) => item.selected
                                );

                                if (selectedIndex === -1) {
                                  await setTemplateItems(
                                    templateItems.map((item, index) => {
                                      item.selected = index === 0;
                                      return item;
                                    })
                                  );
                                } else {
                                  await setTemplateItems(
                                    templateItems.map((item, index) => {
                                      if (selectedIndex === 0) {
                                        item.selected =
                                          index === templateItems.length - 1;
                                      } else {
                                        item.selected =
                                          index === selectedIndex - 1;
                                      }
                                      return item;
                                    })
                                  );
                                }

                                refTemplatePopupItems.current.map((r, i) => {
                                  if (r && r.classList.contains("selected")) {
                                    r.scrollIntoView({
                                      behavior: "auto",
                                      block: "center",
                                      inline: "nearest",
                                    });
                                  }
                                  return true;
                                });
                              } else {
                                axios
                                  .post(props.serverUrl + "/getTemplates")
                                  .then(async (res) => {
                                    if (res.data.result === "OK") {
                                      await setTemplateItems(
                                        res.data.templates.map(
                                          (item, index) => {
                                            item.selected =
                                              (selectedOrder?.template?.id ||
                                                0) === 0
                                                ? index === 0
                                                : item.id ===
                                                selectedOrder.template.id;
                                            return item;
                                          }
                                        )
                                      );

                                      refTemplatePopupItems.current.map(
                                        (r, i) => {
                                          if (
                                            r &&
                                            r.classList.contains("selected")
                                          ) {
                                            r.scrollIntoView({
                                              behavior: "auto",
                                              block: "center",
                                              inline: "nearest",
                                            });
                                          }
                                          return true;
                                        }
                                      );
                                    }
                                  })
                                  .catch(async (e) => {
                                    console.log("error getting templates", e);
                                  });
                              }
                              break;

                            case 39:
                            case 40: // arrow right | arrow down
                              e.preventDefault();
                              if (templateItems.length > 0) {
                                let selectedIndex = templateItems.findIndex(
                                  (item) => item.selected
                                );

                                if (selectedIndex === -1) {
                                  await setTemplateItems(
                                    templateItems.map((item, index) => {
                                      item.selected = index === 0;
                                      return item;
                                    })
                                  );
                                } else {
                                  await setTemplateItems(
                                    templateItems.map((item, index) => {
                                      if (
                                        selectedIndex ===
                                        templateItems.length - 1
                                      ) {
                                        item.selected = index === 0;
                                      } else {
                                        item.selected =
                                          index === selectedIndex + 1;
                                      }
                                      return item;
                                    })
                                  );
                                }

                                refTemplatePopupItems.current.map((r, i) => {
                                  if (r && r.classList.contains("selected")) {
                                    r.scrollIntoView({
                                      behavior: "auto",
                                      block: "center",
                                      inline: "nearest",
                                    });
                                  }
                                  return true;
                                });
                              } else {
                                axios
                                  .post(props.serverUrl + "/getTemplates")
                                  .then(async (res) => {
                                    if (res.data.result === "OK") {
                                      await setTemplateItems(
                                        res.data.templates.map(
                                          (item, index) => {
                                            item.selected =
                                              (selectedOrder?.template?.id ||
                                                0) === 0
                                                ? index === 0
                                                : item.id ===
                                                selectedOrder.template.id;
                                            return item;
                                          }
                                        )
                                      );

                                      refTemplatePopupItems.current.map(
                                        (r, i) => {
                                          if (
                                            r &&
                                            r.classList.contains("selected")
                                          ) {
                                            r.scrollIntoView({
                                              behavior: "auto",
                                              block: "center",
                                              inline: "nearest",
                                            });
                                          }
                                          return true;
                                        }
                                      );
                                    }
                                  })
                                  .catch(async (e) => {
                                    console.log("error getting templates", e);
                                  });
                              }
                              break;

                            case 27: // escape
                              setTemplateItems([]);
                              break;

                            case 13: // enter
                              if (
                                templateItems.length > 0 &&
                                templateItems.findIndex(
                                  (item) => item.selected
                                ) > -1
                              ) {
                                await setSelectedOrder({
                                  ...selectedOrder,
                                  template:
                                    templateItems[
                                    templateItems.findIndex(
                                      (item) => item.selected
                                    )
                                    ],
                                  template_id:
                                    templateItems[
                                      templateItems.findIndex(
                                        (item) => item.selected
                                      )
                                    ].id,
                                });
                                validateOrderForSaving({ keyCode: 9 });
                                setTemplateItems([]);
                                refTemplate.current.focus();
                              }
                              break;

                            case 9: // tab
                              if (templateItems.length > 0) {
                                e.preventDefault();
                                await setSelectedOrder({
                                  ...selectedOrder,
                                  template:
                                    templateItems[
                                    templateItems.findIndex(
                                      (item) => item.selected
                                    )
                                    ],
                                  template_id:
                                    templateItems[
                                      templateItems.findIndex(
                                        (item) => item.selected
                                      )
                                    ].id,
                                });
                                validateOrderForSaving({ keyCode: 9 });
                                setTemplateItems([]);
                                refTemplate.current.focus();
                              }
                              break;

                            default:
                              break;
                          }
                        }}
                        onBlur={async () => {
                          if ((selectedOrder?.template?.id || 0) === 0) {
                            await setSelectedOrder({
                              ...selectedOrder,
                              template: {},
                            });
                          }
                        }}
                        onInput={async (e) => {
                          let template = selectedOrder?.template || {};
                          template.id = 0;
                          template.name = e.target.value;
                          await setSelectedOrder({
                            ...selectedOrder,
                            template: template,
                            template_id: template.id,
                          });

                          if (e.target.value.trim() === "") {
                            setTemplateItems([]);
                          } else {
                            axios
                              .post(props.serverUrl + "/getTemplates", {
                                name: e.target.value.trim(),
                              })
                              .then(async (res) => {
                                if (res.data.result === "OK") {
                                  await setTemplateItems(
                                    res.data.templates.map((item, index) => {
                                      item.selected =
                                        (selectedOrder?.template?.id || 0) === 0
                                          ? index === 0
                                          : item.id ===
                                          selectedOrder.template.id;
                                      return item;
                                    })
                                  );
                                }
                              })
                              .catch(async (e) => {
                                console.log("error getting templates", e);
                              });
                          }
                        }}
                        onChange={async (e) => {
                          let template = selectedOrder?.template || {};
                          template.id = 0;
                          template.name = e.target.value;
                          await setSelectedOrder({
                            ...selectedOrder,
                            template: template,
                            template_id: template.id,
                          });
                        }}
                        value={selectedOrder?.template?.name || ""}
                      />
                      <FontAwesomeIcon
                        className="dropdown-button"
                        icon={faCaretDown}
                        onClick={() => {
                          if (templateItems.length > 0) {
                            setTemplateItems([]);
                          } else {
                            if (
                              (selectedOrder?.template?.id || 0) === 0 &&
                              (selectedOrder?.template?.name || "") !== ""
                            ) {
                              axios
                                .post(props.serverUrl + "/getTemplates", {
                                  name: selectedOrder?.template.name,
                                })
                                .then(async (res) => {
                                  if (res.data.result === "OK") {
                                    await setTemplateItems(
                                      res.data.templates.map((item, index) => {
                                        item.selected =
                                          (selectedOrder?.template?.id || 0) ===
                                            0
                                            ? index === 0
                                            : item.id ===
                                            selectedOrder.template.id;
                                        return item;
                                      })
                                    );

                                    refTemplatePopupItems.current.map(
                                      (r, i) => {
                                        if (
                                          r &&
                                          r.classList.contains("selected")
                                        ) {
                                          r.scrollIntoView({
                                            behavior: "auto",
                                            block: "center",
                                            inline: "nearest",
                                          });
                                        }
                                        return true;
                                      }
                                    );
                                  }
                                })
                                .catch(async (e) => {
                                  console.log("error getting templates", e);
                                });
                            } else {
                              axios
                                .post(props.serverUrl + "/getTemplates")
                                .then(async (res) => {
                                  if (res.data.result === "OK") {
                                    await setTemplateItems(
                                      res.data.templates.map((item, index) => {
                                        item.selected =
                                          (selectedOrder?.template?.id || 0) ===
                                            0
                                            ? index === 0
                                            : item.id ===
                                            selectedOrder.template.id;
                                        return item;
                                      })
                                    );

                                    refTemplatePopupItems.current.map((r, i) => {
                                      if (r && r.classList.contains("selected")) {
                                        r.scrollIntoView({
                                          behavior: "auto",
                                          block: "center",
                                          inline: "nearest",
                                        });
                                      }
                                      return true;
                                    }
                                    );
                                  }
                                })
                                .catch(async (e) => {
                                  console.log("error getting templates", e);
                                });
                            }
                          }

                          refTemplate.current.focus();
                        }}
                      />
                    </div>
                    {templateTransition(
                      (style, item) =>
                        item && (
                          <animated.div
                            className="mochi-contextual-container"
                            id="mochi-contextual-container-template"
                            style={{
                              ...style,
                              left: "-50%",
                              display: "block",
                            }}
                            ref={refTemplateDropDown}
                          >
                            <div className="mochi-contextual-popup vertical below" style={{ height: 150 }}>
                              <div className="mochi-contextual-popup-content">
                                <div className="mochi-contextual-popup-wrapper">
                                  {templateItems.map((item, index) => {
                                    const mochiItemClasses = classnames({
                                      "mochi-item": true,
                                      selected: item.selected,
                                    });

                                    const searchValue = (selectedOrder?.template?.id || 0) === 0 && (selectedOrder?.template?.name || "") !== ""
                                      ? selectedOrder?.template?.name
                                      : undefined;

                                    return (
                                      <div
                                        key={index}
                                        className={mochiItemClasses}
                                        id={item.id}
                                        onClick={() => {
                                          setSelectedOrder({
                                            ...selectedOrder,
                                            template: item,
                                            template_id: item.id,
                                          });

                                          window.setTimeout(() => {
                                            validateOrderForSaving({
                                              keyCode: 9,
                                            });
                                            setTemplateItems([]);
                                            refTemplate.current.focus();
                                          });
                                        }}
                                        ref={(ref) =>
                                          refTemplatePopupItems.current.push(
                                            ref
                                          )
                                        }
                                      >
                                        {searchValue === undefined ? (
                                          item.name
                                        ) : (
                                          <Highlighter
                                            highlightClassName="mochi-item-highlight-text"
                                            searchWords={[searchValue]}
                                            autoEscape={true}
                                            textToHighlight={item.name}
                                          />
                                        )}
                                        {item.selected && (
                                          <FontAwesomeIcon
                                            className="dropdown-selected"
                                            icon={faCaretRight}
                                          />
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </animated.div>
                        )
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div style={{ flexGrow: 1 }}>
              <div className="form-borderless-box" style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
              }}>
                <div className="mochi-button">
                  <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                  <div className="mochi-button-base">New Template</div>
                  <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                </div>

                <div className="mochi-button" style={{ marginLeft: 5 }} onClick={() => {
                  if ((selectedOrder?.id || 0) === 0) {
                    window.alert("You must create or load an order first!");
                    return;
                  }

                  if (window.confirm("Do you wish to replicate this order?")) {
                    setIsLoading(true);

                    let selected_order = JSON.parse(
                      JSON.stringify(selectedOrder)
                    );

                    selected_order.id = 0;
                    selected_order.order_number = 0;
                    selected_order.trip_number = 0;
                    selected_order.carrier_id = null;
                    selected_order.carrier_driver_id = null;

                    axios.post(props.serverUrl + "/saveOrder", selected_order).then(async (res) => {
                      if (res.data.result === "OK") {
                        await setSelectedOrder({ ...res.data.order });
                        await props.setSelectedOrder({
                          ...res.data.order,
                          component_id: props.componentId,
                        });
                        await setSelectedCarrier({});
                        await setSelectedCarrierContact({});
                        await setSelectedCarrierDriver({});

                        new Promise((resolve, reject) => {
                          if ((selected_order?.internal_notes || []).length > 0) {
                            (selected_order?.internal_notes || []).map(
                              async (note, index) => {
                                await axios.post(props.serverUrl + "/saveInternalNotes",
                                  {
                                    order_id: res.data.order.id,
                                    text: note.text,
                                    user: note.user,
                                    date_time: note.date_time,
                                  }
                                ).then((res) => {
                                  if (index === selected_order.internal_notes.length - 1) {
                                    resolve("done");
                                  }
                                });

                                return false;
                              }
                            );
                          } else {
                            resolve("done");
                          }
                        }).then((response) => {
                          new Promise((resolve, reject) => {
                            if ((selected_order?.notes_for_carrier || []).length > 0) {
                              (selected_order?.notes_for_carrier || []).map(
                                async (note, index) => {
                                  await axios.post(props.serverUrl + "/saveNotesForCarrier",
                                    {
                                      order_id: res.data.order.id,
                                      text: note.text,
                                      user: note.user,
                                      date_time: note.date_time,
                                    }
                                  ).then((res) => {
                                    if (index === selected_order.notes_for_carrier.length - 1) {
                                      resolve("done");
                                    }
                                  });

                                  return false;
                                }
                              );
                            } else {
                              resolve("done");
                            }
                          }).then((response) => {
                            new Promise((resolve, reject) => {
                              if ((selected_order?.order_customer_ratings || []).length > 0) {
                                (selected_order?.order_customer_ratings || []).map(async (rating, index) => {
                                  await axios.post(props.serverUrl + "/saveOrderCustomerRating",
                                    {
                                      order_id: res.data.order.id,
                                      rate_type: rating.rate_type,
                                      description: rating.description,
                                      rate_subtype: rating.rate_subtype,
                                      pieces: rating.pieces,
                                      pieces_unit: rating.pieces_unit,
                                      weight: rating.weight,
                                      weight_unit: rating.weight_unit,
                                      feet_required: rating.feet_required,
                                      feet_required_unit:
                                        rating.feet_required_unit,
                                      rate: rating.rate,
                                      percentage: rating.percentage,
                                      days: rating.days,
                                      hours: rating.hours,
                                      total_charges: rating.total_charges,
                                    }
                                  ).then((res) => {
                                    if (index === selected_order.order_customer_ratings.length - 1) {
                                      resolve("done");
                                    }
                                  });

                                  return false;
                                });
                              } else {
                                resolve("done");
                              }
                            }).then((response) => {
                              new Promise((resolve, reject) => {
                                if ((selected_order?.pickups || []).length > 0) {
                                  (selected_order?.pickups || []).map(
                                    async (pickup, index) => {
                                      await axios.post(props.serverUrl + "/saveOrderPickup",
                                        {
                                          id: 0,
                                          order_id: res.data.order.id,
                                          customer_id: pickup.customer.id,
                                          pu_date1: "",
                                          pu_date2: "",
                                          pu_time1: "",
                                          pu_time2: "",
                                          bol_numbers: pickup.bol_numbers || "",
                                          po_numbers: pickup.po_numbers || "",
                                          ref_numbers: pickup.ref_numbers || "",
                                          seal_number: pickup.seal_number || "",
                                          special_instructions: pickup.special_instructions || "",
                                          type: "pickup",
                                        }
                                      ).then((res) => {
                                        if (index === selected_order.pickups.length - 1) {
                                          resolve("done");
                                        }
                                      });

                                      return false;
                                    }
                                  );
                                } else {
                                  resolve("done");
                                }
                              }).then((response) => {
                                new Promise((resolve, reject) => {
                                  if ((selected_order?.deliveries || []).length > 0) {
                                    (selected_order?.deliveries || []).map(
                                      async (delivery, index) => {
                                        await axios.post(props.serverUrl + "/saveOrderDelivery",
                                          {
                                            id: 0,
                                            order_id: res.data.order.id,
                                            customer_id: delivery.customer.id,
                                            delivery_date1: "",
                                            delivery_date2: "",
                                            delivery_time1: "",
                                            delivery_time2: "",
                                            special_instructions: delivery.special_instructions || "",
                                            type: "delivery",
                                          }
                                        ).then((res) => {
                                          if (index === selected_order.deliveries.length - 1) {
                                            resolve("done");
                                          }
                                        });

                                        return false;
                                      }
                                    );
                                  } else {
                                    resolve("done");
                                  }
                                }).then(async (response) => {
                                  await axios.post(props.serverUrl + "/getOrderByOrderNumber",
                                    {
                                      order_number: res.data.order.order_number,
                                    }
                                  ).then(async (res) => {
                                    if (res.data.result === "OK") {
                                      let oldPickups = selected_order.pickups || [];
                                      let oldDeliveries = selected_order.deliveries || [];
                                      let oldRouting = selected_order.routing || [];
                                      let newPickups = res.data.order.pickups;
                                      let newDeliveries = res.data.order.deliveries;
                                      let newRouting = [];

                                      oldRouting.map((route) => {
                                        if (route.type === "pickup") {
                                          let pickupIndex = oldPickups.findIndex((p) => p.id === route.pickup_id);

                                          newRouting.push({
                                            ...route,
                                            pickup_id: newPickups[pickupIndex].id,
                                          });
                                        } else {
                                          let deliveryIndex = oldDeliveries.findIndex((d) => d.id === route.delivery_id);

                                          newRouting.push({
                                            ...route,
                                            delivery_id: newDeliveries[deliveryIndex].id,
                                          });
                                        }

                                        return false;
                                      });

                                      await axios.post(props.serverUrl + "/saveOrderRouting",
                                        {
                                          order_id: res.data.order.id,
                                          routing: newRouting,
                                        }
                                      ).then((res) => {
                                        if (res.data.result === "OK") {
                                          axios.post(props.serverUrl + "/getOrderByOrderNumber",
                                            {
                                              order_number: res.data.order.order_number,
                                            }
                                          ).then((res) => {
                                            if (res.data.result === "OK") {
                                              setSelectedOrder(res.data.order);

                                              let pickup_id = (res.data.order.routing || []).find((r) => r.type === "pickup")?.pickup_id || 0;
                                              let pickup = {
                                                ...((res.data.order.pickups || []).find((p) => p.id === pickup_id) || (res.data.order.pickups || [])[0]),
                                              };

                                              setSelectedShipperCustomer(
                                                pickup.id === undefined
                                                  ? {}
                                                  : {
                                                    ...pickup.customer,
                                                    pickup_id: pickup.id,
                                                    pu_date1: pickup.pu_date1,
                                                    pu_date2: pickup.pu_date2,
                                                    pu_time1: pickup.pu_time1,
                                                    pu_time2: pickup.pu_time2,
                                                    bol_numbers: pickup.bol_numbers,
                                                    po_numbers: pickup.po_numbers,
                                                    ref_numbers: pickup.ref_numbers,
                                                    seal_number: pickup.seal_number,
                                                    special_instructions: pickup.special_instructions,
                                                    type: pickup.type,
                                                  }
                                              );
                                              setSelectedShipperCustomerContact(
                                                {
                                                  ...(pickup.contacts || []).find((c) => c.is_primary === 1),
                                                }
                                              );

                                              let delivery_id = (res.data.order.routing || []).find((r) => r.type === "delivery")?.delivery_id || 0;
                                              let delivery = {
                                                ...((res.data.order.deliveries || []).find((d) => d.id === delivery_id) || (res.data.order.deliveries || [])[0]),
                                              };

                                              setSelectedConsigneeCustomer(
                                                delivery.id === undefined
                                                  ? {}
                                                  : {
                                                    ...delivery.customer,
                                                    delivery_id: delivery.id,
                                                    delivery_date1: delivery.delivery_date1,
                                                    delivery_date2: delivery.delivery_date2,
                                                    delivery_time1: delivery.delivery_time1,
                                                    delivery_time2: delivery.delivery_time2,
                                                    special_instructions: delivery.special_instructions,
                                                    type: delivery.type,
                                                  }
                                              );
                                              setSelectedConsigneeCustomerContact(
                                                {
                                                  ...(delivery.contacts || []).find((c) => c.is_primary === 1),
                                                }
                                              );
                                            }
                                          }).catch((e) => {
                                            console.log("error saving order miles", e);
                                          }).then(() => {
                                            setIsLoading(false);
                                            refCarrierCode.current.focus();
                                          });
                                        }
                                      }).catch((e) => {
                                        console.log("error saving order miles", e);
                                      });
                                    }
                                  }).catch((e) => {
                                    console.log("error saving order miles", e);
                                  });
                                });
                              });
                            });
                          });
                        });
                      } else {
                        console.log(res.data.result);
                      }
                    }).catch((e) => {
                      console.log("error saving order", e);
                    });
                  }
                }}>
                  <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                  <div className="mochi-button-base">Replicate Order</div>
                  <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                </div>

                {
                  (props.isAdmin || false) &&
                  <div className="mochi-button" style={{ marginLeft: 5 }} onClick={importOrdersBtnClick}>
                    <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                    <div className="mochi-button-base">Import</div>
                    <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                  </div>
                }

              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              marginBottom: 10,
              flexGrow: 1,
              flexBasis: "100%",
            }}
          >
            <div
              className="form-bordered-box"
              style={{ minWidth: "38%", maxWidth: "38%", marginRight: 10 }}
              onKeyDown={validateOrderForSaving}
            >
              <div className="form-header">
                <div className="top-border top-border-left"></div>
                <div className="form-title">Bill To</div>
                <div className="top-border top-border-middle"></div>
                <div className="form-buttons">
                  <div className="mochi-button" onClick={billToCompanySearch}>
                    <div className="mochi-button-decorator mochi-button-decorator-left">
                      (
                    </div>
                    <div className="mochi-button-base">Search</div>
                    <div className="mochi-button-decorator mochi-button-decorator-right">
                      )
                    </div>
                  </div>
                  <div
                    className="mochi-button"
                    onClick={() => {
                      if ((selectedBillToCustomer.id || 0) === 0) {
                        window.alert("You must select a customer first!");
                        return;
                      }

                      let panel = {
                        panelName: `${props.panelName}-customer`,
                        component: (
                          <Customers
                            pageName={"Customer"}
                            title={"Bill-To Company"}
                            panelName={`${props.panelName}-customer`}
                            tabTimes={2000 + props.tabTimes}
                            componentId={moment().format("x")}
                            isOnPanel={true}
                            origin={props.origin}
                            openPanel={props.openPanel}
                            closePanel={props.closePanel}
                            customer_id={selectedBillToCustomer.id}
                          />
                        ),
                      };

                      props.openPanel(panel, props.origin);
                    }}
                  >
                    <div className="mochi-button-decorator mochi-button-decorator-left">
                      (
                    </div>
                    <div className="mochi-button-base">Company info</div>
                    <div className="mochi-button-decorator mochi-button-decorator-right">
                      )
                    </div>
                  </div>
                  <div
                    className="mochi-button"
                    onClick={() => {
                      if ((selectedOrder?.id || 0) === 0) {
                        window.alert("You must create or load an order first!");
                        return;
                      }

                      if ((selectedOrder?.load_type_id || 0) === 0) {
                        window.alert("You must select a load type first!");
                        return;
                      }

                      let panel = {
                        panelName: `${props.panelName}-rating`,
                        component: (
                          <RatingScreen
                            panelName={`${props.panelName}-rating`}
                            title="Rating Screen"
                            tabTimes={34000 + props.tabTimes}
                            componentId={moment().format("x")}
                            origin={props.origin}
                            selectedOrder={selectedOrder}
                          />
                        ),
                      };

                      props.openPanel(panel, props.origin);
                    }}
                  >
                    <div className="mochi-button-decorator mochi-button-decorator-left">
                      (
                    </div>
                    <div className="mochi-button-base">Rate load</div>
                    <div className="mochi-button-decorator mochi-button-decorator-right">
                      )
                    </div>
                  </div>
                </div>
                <div className="top-border top-border-right"></div>
              </div>

              <div className="form-row">
                <div className="input-box-container input-code">
                  <input
                    tabIndex={6 + props.tabTimes}
                    type="text"
                    placeholder="Code"
                    maxLength="8"
                    ref={refBillToCompanyCode}
                    onKeyDown={getBillToCompanyByCode}
                    onInput={(e) => {
                      setSelectedBillToCustomer({
                        ...selectedBillToCustomer,
                        code: e.target.value,
                        code_number: 0,
                      });
                    }}
                    onChange={(e) => {
                      setSelectedBillToCustomer({
                        ...selectedBillToCustomer,
                        code: e.target.value,
                        code_number: 0,
                      });
                    }}
                    value={
                      (selectedBillToCustomer.code_number || 0) === 0
                        ? selectedBillToCustomer.code || ""
                        : selectedBillToCustomer.code +
                        selectedBillToCustomer.code_number
                    }
                  />
                </div>
                <div className="form-h-sep"></div>
                <div className="input-box-container grow">
                  <input
                    tabIndex={7 + props.tabTimes}
                    type="text"
                    placeholder="Name"
                    // onKeyDown={validateBillToCompanyInfoForSaving}
                    onInput={(e) => {
                      setSelectedBillToCustomer({
                        ...selectedBillToCustomer,
                        name: e.target.value,
                      });
                    }}
                    onChange={(e) => {
                      setSelectedBillToCustomer({
                        ...selectedBillToCustomer,
                        name: e.target.value,
                      });
                    }}
                    value={selectedBillToCustomer.name || ""}
                  />
                </div>
              </div>
              <div className="form-v-sep"></div>
              <div className="form-row">
                <div className="input-box-container grow">
                  <input
                    tabIndex={8 + props.tabTimes}
                    type="text"
                    placeholder="Address 1"
                    // onKeyDown={validateBillToCompanyInfoForSaving}
                    onInput={(e) => {
                      setSelectedBillToCustomer({
                        ...selectedBillToCustomer,
                        address1: e.target.value,
                      });
                    }}
                    onChange={(e) => {
                      setSelectedBillToCustomer({
                        ...selectedBillToCustomer,
                        address1: e.target.value,
                      });
                    }}
                    value={selectedBillToCustomer.address1 || ""}
                  />
                </div>
              </div>
              <div className="form-v-sep"></div>
              <div className="form-row">
                <div className="input-box-container grow">
                  <input
                    tabIndex={9 + props.tabTimes}
                    type="text"
                    placeholder="Address 2"
                    // onKeyDown={validateBillToCompanyInfoForSaving}
                    onInput={(e) => {
                      setSelectedBillToCustomer({
                        ...selectedBillToCustomer,
                        address2: e.target.value,
                      });
                    }}
                    onChange={(e) => {
                      setSelectedBillToCustomer({
                        ...selectedBillToCustomer,
                        address2: e.target.value,
                      });
                    }}
                    value={selectedBillToCustomer.address2 || ""}
                  />
                </div>
              </div>
              <div className="form-v-sep"></div>
              <div className="form-row">
                <div className="input-box-container grow">
                  <input
                    tabIndex={10 + props.tabTimes}
                    type="text"
                    placeholder="City"
                    // onKeyDown={validateBillToCompanyInfoForSaving}
                    onInput={(e) => {
                      setSelectedBillToCustomer({
                        ...selectedBillToCustomer,
                        city: e.target.value,
                      });
                    }}
                    onChange={(e) => {
                      setSelectedBillToCustomer({
                        ...selectedBillToCustomer,
                        city: e.target.value,
                      });
                    }}
                    value={selectedBillToCustomer.city || ""}
                  />
                </div>
                <div className="form-h-sep"></div>
                <div className="input-box-container input-state">
                  <input
                    tabIndex={11 + props.tabTimes}
                    type="text"
                    placeholder="State"
                    maxLength="2"
                    // onKeyDown={validateBillToCompanyInfoForSaving}
                    onInput={(e) => {
                      setSelectedBillToCustomer({
                        ...selectedBillToCustomer,
                        state: e.target.value,
                      });
                    }}
                    onChange={(e) => {
                      setSelectedBillToCustomer({
                        ...selectedBillToCustomer,
                        state: e.target.value,
                      });
                    }}
                    value={selectedBillToCustomer.state || ""}
                  />
                </div>
                <div className="form-h-sep"></div>
                <div className="input-box-container input-zip-code">
                  <input
                    tabIndex={12 + props.tabTimes}
                    type="text"
                    placeholder="Postal Code"
                    onKeyDown={validateBillToCompanyInfoForSaving}
                    onInput={(e) => {
                      setSelectedBillToCustomer({
                        ...selectedBillToCustomer,
                        zip: e.target.value,
                      });
                    }}
                    onChange={(e) => {
                      setSelectedBillToCustomer({
                        ...selectedBillToCustomer,
                        zip: e.target.value,
                      });
                    }}
                    value={selectedBillToCustomer.zip || ""}
                  />
                </div>
              </div>
              <div className="form-v-sep"></div>
              <div className="form-row">
                <div className="input-box-container grow">
                  <input
                    tabIndex={13 + props.tabTimes}
                    type="text"
                    placeholder="Contact Name"
                    // onKeyDown={validateBillToCompanyContactForSaving}
                    onChange={(e) => {
                      // let splitted = e.target.value.split(' ');
                      // let first_name = splitted[0];

                      // if (splitted.length > 1) {
                      //     first_name += ' ';
                      // }

                      // let last_name = '';

                      // splitted.map((item, index) => {
                      //     if (index > 0) {
                      //         last_name += item;
                      //     }
                      //     return true;
                      // })

                      // setSelectedBillToCustomerContact({ ...selectedBillToCustomerContact, first_name: first_name, last_name: last_name });

                      if (
                        (selectedBillToCustomer?.contacts || []).length === 0
                      ) {
                        setSelectedBillToCustomer({
                          ...selectedBillToCustomer,
                          contact_name: e.target.value,
                        });
                      }
                    }}
                    onInput={(e) => {
                      // let splitted = e.target.value.split(' ');
                      // let first_name = splitted[0];

                      // if (splitted.length > 1) {
                      //     first_name += ' ';
                      // }

                      // let last_name = '';

                      // splitted.map((item, index) => {
                      //     if (index > 0) {
                      //         last_name += item;
                      //     }
                      //     return true;
                      // })

                      // setSelectedBillToCustomerContact({ ...selectedBillToCustomerContact, first_name: first_name, last_name: last_name });

                      if (
                        (selectedBillToCustomer?.contacts || []).length === 0
                      ) {
                        setSelectedBillToCustomer({
                          ...selectedBillToCustomer,
                          contact_name: e.target.value,
                        });
                      }
                    }}
                    value={
                      (selectedBillToCustomer?.contacts || []).find(
                        (c) => c.is_primary === 1
                      ) === undefined
                        ? selectedBillToCustomer?.contact_name || ""
                        : selectedBillToCustomer?.contacts.find(
                          (c) => c.is_primary === 1
                        ).first_name +
                        " " +
                        selectedBillToCustomer?.contacts.find(
                          (c) => c.is_primary === 1
                        ).last_name
                    }
                  />
                </div>
                <div className="form-h-sep"></div>
                <div
                  className="input-box-container input-phone"
                  style={{ position: "relative" }}
                >
                  <MaskedInput
                    tabIndex={14 + props.tabTimes}
                    mask={[
                      /[0-9]/,
                      /\d/,
                      /\d/,
                      "-",
                      /\d/,
                      /\d/,
                      /\d/,
                      "-",
                      /\d/,
                      /\d/,
                      /\d/,
                      /\d/,
                    ]}
                    guide={true}
                    type="text"
                    placeholder="Contact Phone"
                    // onKeyDown={validateBillToCompanyContactForSaving}
                    onInput={(e) => {
                      if (
                        (selectedBillToCustomer?.contacts || []).length === 0
                      ) {
                        setSelectedBillToCustomer({
                          ...selectedBillToCustomer,
                          contact_phone: e.target.value,
                        });
                      }
                    }}
                    onChange={(e) => {
                      if (
                        (selectedBillToCustomer?.contacts || []).length === 0
                      ) {
                        setSelectedBillToCustomer({
                          ...selectedBillToCustomer,
                          contact_phone: e.target.value,
                        });
                      }
                    }}
                    value={
                      (selectedBillToCustomer?.contacts || []).find(
                        (c) => c.is_primary === 1
                      ) === undefined
                        ? selectedBillToCustomer?.contact_phone || ""
                        : selectedBillToCustomer?.contacts.find(
                          (c) => c.is_primary === 1
                        ).primary_phone === "work"
                          ? selectedBillToCustomer?.contacts.find(
                            (c) => c.is_primary === 1
                          ).phone_work
                          : selectedBillToCustomer?.contacts.find(
                            (c) => c.is_primary === 1
                          ).primary_phone === "fax"
                            ? selectedBillToCustomer?.contacts.find(
                              (c) => c.is_primary === 1
                            ).phone_work_fax
                            : selectedBillToCustomer?.contacts.find(
                              (c) => c.is_primary === 1
                            ).primary_phone === "mobile"
                              ? selectedBillToCustomer?.contacts.find(
                                (c) => c.is_primary === 1
                              ).phone_mobile
                              : selectedBillToCustomer?.contacts.find(
                                (c) => c.is_primary === 1
                              ).primary_phone === "direct"
                                ? selectedBillToCustomer?.contacts.find(
                                  (c) => c.is_primary === 1
                                ).phone_direct
                                : selectedBillToCustomer?.contacts.find(
                                  (c) => c.is_primary === 1
                                ).primary_phone === "other"
                                  ? selectedBillToCustomer?.contacts.find(
                                    (c) => c.is_primary === 1
                                  ).phone_other
                                  : ""
                    }
                  />

                  {(selectedBillToCustomer?.contacts || []).find(
                    (c) => c.is_primary === 1
                  ) !== undefined && (
                      <div
                        className={classnames({
                          "selected-customer-contact-primary-phone": true,
                          pushed: false,
                        })}
                      >
                        {
                          selectedBillToCustomer?.contacts.find(
                            (c) => c.is_primary === 1
                          ).primary_phone
                        }
                      </div>
                    )}
                </div>
                <div className="form-h-sep"></div>
                <div className="input-box-container input-phone-ext">
                  <input
                    tabIndex={15 + props.tabTimes}
                    type="text"
                    placeholder="Ext"
                    onKeyDown={validateBillToCompanyContactForSaving}
                    onInput={(e) => {
                      if (
                        (selectedBillToCustomer?.contacts || []).length === 0
                      ) {
                        setSelectedBillToCustomer({
                          ...selectedBillToCustomer,
                          ext: e.target.value,
                        });
                      }
                    }}
                    onChange={(e) => {
                      if (
                        (selectedBillToCustomer?.contacts || []).length === 0
                      ) {
                        setSelectedBillToCustomer({
                          ...selectedBillToCustomer,
                          ext: e.target.value,
                        });
                      }
                    }}
                    value={
                      (selectedBillToCustomer?.contacts || []).find(
                        (c) => c.is_primary === 1
                      ) === undefined
                        ? selectedBillToCustomer?.ext || ""
                        : selectedBillToCustomer?.contacts.find(
                          (c) => c.is_primary === 1
                        ).phone_ext
                    }
                  />
                </div>
              </div>
            </div>

            <div
              className="form-bordered-box"
              style={{ minWidth: "38%", maxWidth: "38%", marginRight: 10 }}
              onKeyDown={validateOrderForSaving}
            >
              <div className="form-header">
                <div className="top-border top-border-left"></div>
                <div className="form-title">Carrier</div>
                <div className="top-border top-border-middle"></div>
                <div className="form-buttons">
                  {(selectedCarrier?.id || 0) === 0 && (
                    <div
                      className="mochi-button"
                      onClick={searchCarrierBtnClick}
                    >
                      <div className="mochi-button-decorator mochi-button-decorator-left">
                        (
                      </div>
                      <div className="mochi-button-base">Search</div>
                      <div className="mochi-button-decorator mochi-button-decorator-right">
                        )
                      </div>
                    </div>
                  )}

                  <div
                    className="mochi-button"
                    onClick={() => {
                      if ((selectedCarrier.id || 0) === 0) {
                        window.alert("You must select a carrier first!");
                        return;
                      }

                      let panel = {
                        panelName: `${props.panelName}-carrier`,
                        component: (
                          <Carriers
                            pageName={"Carrier"}
                            title={"Carrier"}
                            panelName={"carrier"}
                            tabTimes={3000 + props.tabTimes}
                            screenFocused={props.carrierScreenFocused}
                            componentId={moment().format("x")}
                            isOnPanel={true}
                            origin={props.origin}
                            openPanel={props.openPanel}
                            closePanel={props.closePanel}
                            carrier_id={selectedCarrier.id}
                          />
                        ),
                      };

                      props.openPanel(panel, props.origin);
                    }}
                  >
                    <div className="mochi-button-decorator mochi-button-decorator-left">
                      (
                    </div>
                    <div className="mochi-button-base">Carrier info</div>
                    <div className="mochi-button-decorator mochi-button-decorator-right">
                      )
                    </div>
                  </div>
                </div>
                <div className="top-border top-border-right"></div>
              </div>

              <div className="form-row">
                <div className="input-box-container input-code">
                  <input
                    tabIndex={50 + props.tabTimes}
                    type="text"
                    placeholder="Code"
                    maxLength="8"
                    ref={refCarrierCode}
                    onKeyDown={getCarrierInfoByCode}
                    onInput={(e) => {
                      setSelectedCarrier({
                        ...selectedCarrier,
                        code: e.target.value,
                        code_number: 0,
                      });
                    }}
                    onChange={(e) => {
                      setSelectedCarrier({
                        ...selectedCarrier,
                        code: e.target.value,
                        code_number: 0,
                      });
                    }}
                    value={
                      (selectedCarrier.code_number || 0) === 0
                        ? selectedCarrier.code || ""
                        : selectedCarrier.code + selectedCarrier.code_number
                    }
                  />
                </div>
                <div className="form-h-sep"></div>
                <div className="input-box-container grow">
                  <input
                    tabIndex={51 + props.tabTimes}
                    type="text"
                    placeholder="Name"
                    onKeyDown={validateCarrierInfoForSaving}
                    onInput={(e) => {
                      setSelectedCarrier({
                        ...selectedCarrier,
                        name: e.target.value,
                      });
                    }}
                    onChange={(e) => {
                      setSelectedCarrier({
                        ...selectedCarrier,
                        name: e.target.value,
                      });
                    }}
                    value={selectedCarrier?.name || ""}
                  />
                </div>
                <div className="form-h-sep"></div>
                <div
                  className={insuranceStatusClasses()}
                  style={{ width: "7rem" }}
                >
                  <input type="text" placeholder="Insurance" readOnly={true} />
                </div>
              </div>
              <div className="form-v-sep"></div>
              <div className="form-row">
                <div className="input-box-container grow">
                  <input
                    tabIndex={52 + props.tabTimes}
                    type="text"
                    placeholder="Carrier Load - Starting City State - Destination City State"
                    readOnly={true}
                    value={
                      (selectedOrder?.routing || []).length >= 2 &&
                        (selectedOrder?.carrier?.id || 0) > 0
                        ? selectedOrder.routing[0].type === "pickup"
                          ? (selectedOrder.pickups.find(
                            (p) => p.id === selectedOrder.routing[0].pickup_id
                          ).customer?.city || "") +
                          ", " +
                          (selectedOrder.pickups.find(
                            (p) => p.id === selectedOrder.routing[0].pickup_id
                          ).customer?.state || "") +
                          " - " +
                          (selectedOrder.routing[
                            selectedOrder.routing.length - 1
                          ].type === "pickup"
                            ? (selectedOrder.pickups.find(
                              (p) =>
                                p.id ===
                                selectedOrder.routing[
                                  selectedOrder.routing.length - 1
                                ].pickup_id
                            ).customer?.city || "") +
                            ", " +
                            (selectedOrder.pickups.find(
                              (p) =>
                                p.id ===
                                selectedOrder.routing[
                                  selectedOrder.routing.length - 1
                                ].pickup_id
                            ).customer?.state || "")
                            : (selectedOrder.deliveries.find(
                              (d) =>
                                d.id ===
                                selectedOrder.routing[
                                  selectedOrder.routing.length - 1
                                ].delivery_id
                            ).customer?.city || "") +
                            ", " +
                            (selectedOrder.deliveries.find(
                              (d) =>
                                d.id ===
                                selectedOrder.routing[
                                  selectedOrder.routing.length - 1
                                ].delivery_id
                            ).customer?.state || ""))
                          : (selectedOrder.deliveries.find(
                            (d) =>
                              d.id === selectedOrder.routing[0].delivery_id
                          ).customer?.city || "") +
                          ", " +
                          (selectedOrder.deliveries.find(
                            (d) =>
                              d.id === selectedOrder.routing[0].delivery_id
                          ).customer?.state || "") +
                          " - " +
                          (selectedOrder.routing[
                            selectedOrder.routing.length - 1
                          ].type === "pickup"
                            ? (selectedOrder.pickups.find(
                              (p) =>
                                p.id ===
                                selectedOrder.routing[
                                  selectedOrder.routing.length - 1
                                ].pickup_id
                            ).customer?.city || "") +
                            ", " +
                            (selectedOrder.pickups.find(
                              (p) =>
                                p.id ===
                                selectedOrder.routing[
                                  selectedOrder.routing.length - 1
                                ].pickup_id
                            ).customer?.state || "")
                            : (selectedOrder.deliveries.find(
                              (d) =>
                                d.id ===
                                selectedOrder.routing[
                                  selectedOrder.routing.length - 1
                                ].delivery_id
                            ).customer?.city || "") +
                            ", " +
                            (selectedOrder.deliveries.find(
                              (d) =>
                                d.id ===
                                selectedOrder.routing[
                                  selectedOrder.routing.length - 1
                                ].delivery_id
                            ).customer?.state || ""))
                        : ""
                    }
                  />
                </div>
              </div>
              <div className="form-v-sep"></div>
              <div className="form-row">
                <div className="input-box-container grow">
                  <input
                    tabIndex={53 + props.tabTimes}
                    type="text"
                    placeholder="Contact Name"
                    // onKeyDown={validateCarrierContactForSaving}
                    onChange={(e) => {
                      if ((selectedCarrier?.contacts || []).length === 0) {
                        setSelectedCarrier({
                          ...selectedCarrier,
                          contact_name: e.target.value,
                        });
                      }
                    }}
                    onInput={(e) => {
                      if ((selectedCarrier?.contacts || []).length === 0) {
                        setSelectedCarrier({
                          ...selectedCarrier,
                          contact_name: e.target.value,
                        });
                      }
                    }}
                    value={
                      (selectedCarrier?.contacts || []).find((c) => c.is_primary === 1) === undefined
                        ? selectedCarrier?.contact_name || ""
                        : selectedCarrier?.contacts.find((c) => c.is_primary === 1).first_name + " " + selectedCarrier?.contacts.find((c) => c.is_primary === 1).last_name
                    } />
                </div>
                <div className="form-h-sep"></div>
                <div className="input-box-container grow" style={{ position: "relative" }}>
                  <MaskedInput
                    tabIndex={54 + props.tabTimes}
                    mask={[/[0-9]/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/,]}
                    guide={true}
                    type="text"
                    placeholder="Contact Phone"
                    // onKeyDown={validateCarrierContactForSaving}
                    onInput={(e) => {
                      if ((selectedCarrier?.contacts || []).length === 0) {
                        setSelectedCarrier({
                          ...selectedCarrier,
                          contact_phone: e.target.value,
                        });
                      }
                    }}
                    onChange={(e) => {
                      if ((selectedCarrier?.contacts || []).length === 0) {
                        setSelectedCarrier({
                          ...selectedCarrier,
                          contact_phone: e.target.value,
                        });
                      }
                    }}
                    value={
                      (selectedCarrier?.contacts || []).find(
                        (c) => c.is_primary === 1
                      ) === undefined
                        ? selectedCarrier?.contact_phone || ""
                        : selectedCarrier?.contacts.find(
                          (c) => c.is_primary === 1
                        ).primary_phone === "work"
                          ? selectedCarrier?.contacts.find(
                            (c) => c.is_primary === 1
                          ).phone_work
                          : selectedCarrier?.contacts.find(
                            (c) => c.is_primary === 1
                          ).primary_phone === "fax"
                            ? selectedCarrier?.contacts.find(
                              (c) => c.is_primary === 1
                            ).phone_work_fax
                            : selectedCarrier?.contacts.find(
                              (c) => c.is_primary === 1
                            ).primary_phone === "mobile"
                              ? selectedCarrier?.contacts.find(
                                (c) => c.is_primary === 1
                              ).phone_mobile
                              : selectedCarrier?.contacts.find(
                                (c) => c.is_primary === 1
                              ).primary_phone === "direct"
                                ? selectedCarrier?.contacts.find(
                                  (c) => c.is_primary === 1
                                ).phone_direct
                                : selectedCarrier?.contacts.find(
                                  (c) => c.is_primary === 1
                                ).primary_phone === "other"
                                  ? selectedCarrier?.contacts.find(
                                    (c) => c.is_primary === 1
                                  ).phone_other
                                  : ""
                    }
                  />

                  {(selectedCarrier?.contacts || []).find(
                    (c) => c.is_primary === 1
                  ) !== undefined && (
                      <div
                        className={classnames({
                          "selected-carrier-contact-primary-phone": true,
                          pushed: false,
                        })}
                      >
                        {
                          selectedCarrier?.contacts.find(
                            (c) => c.is_primary === 1
                          ).primary_phone
                        }
                      </div>
                    )}
                </div>
                <div className="form-h-sep"></div>
                <div className="input-box-container input-phone-ext">
                  <input
                    tabIndex={55 + props.tabTimes}
                    type="text"
                    placeholder="Ext"
                    onKeyDown={validateCarrierContactForSaving}
                    onInput={(e) => {
                      if ((selectedCarrier?.contacts || []).length === 0) {
                        setSelectedCarrier({
                          ...selectedCarrier,
                          ext: e.target.value,
                        });
                      }
                    }}
                    onChange={(e) => {
                      if ((selectedCarrier?.contacts || []).length === 0) {
                        setSelectedCarrier({
                          ...selectedCarrier,
                          ext: e.target.value,
                        });
                      }
                    }}
                    value={
                      (selectedCarrier?.contacts || []).find(
                        (c) => c.is_primary === 1
                      ) === undefined
                        ? selectedCarrier?.ext || ""
                        : selectedCarrier?.contacts.find(
                          (c) => c.is_primary === 1
                        ).phone_ext
                    }
                  />
                </div>
                <div className="form-h-sep"></div>
                <div className="select-box-container" style={{ width: "9rem" }}>
                  <div className="select-box-wrapper">
                    <input
                      type="text"
                      tabIndex={56 + props.tabTimes}
                      placeholder="Equipment"
                      ref={refEquipment}
                      onKeyDown={(e) => {
                        let key = e.keyCode || e.which;

                        switch (key) {
                          case 37:
                          case 38: // arrow left | arrow up
                            e.preventDefault();
                            if (equipmentItems.length > 0) {
                              let selectedIndex = equipmentItems.findIndex(
                                (item) => item.selected
                              );

                              if (selectedIndex === -1) {
                                setEquipmentItems(
                                  equipmentItems.map((item, index) => {
                                    item.selected = index === 0;
                                    return item;
                                  })
                                );
                              } else {
                                setEquipmentItems(
                                  equipmentItems.map((item, index) => {
                                    if (selectedIndex === 0) {
                                      item.selected =
                                        index === equipmentItems.length - 1;
                                    } else {
                                      item.selected =
                                        index === selectedIndex - 1;
                                    }
                                    return item;
                                  })
                                );
                              }

                              refEquipmentPopupItems.current.map((r, i) => {
                                if (r && r.classList.contains("selected")) {
                                  r.scrollIntoView({
                                    behavior: "auto",
                                    block: "center",
                                    inline: "nearest",
                                  });
                                }
                                return true;
                              });
                            } else {
                              axios
                                .post(props.serverUrl + "/getEquipments")
                                .then((res) => {
                                  if (res.data.result === "OK") {
                                    setEquipmentItems(
                                      res.data.equipments.map((item, index) => {
                                        item.selected =
                                          (selectedOrder?.equipment?.id ||
                                            0) === 0
                                            ? index === 0
                                            : item.id ===
                                            selectedOrder.equipment.id;
                                        return item;
                                      })
                                    );

                                    refEquipmentPopupItems.current.map(
                                      (r, i) => {
                                        if (
                                          r &&
                                          r.classList.contains("selected")
                                        ) {
                                          r.scrollIntoView({
                                            behavior: "auto",
                                            block: "center",
                                            inline: "nearest",
                                          });
                                        }
                                        return true;
                                      }
                                    );
                                  }
                                })
                                .catch(async (e) => {
                                  console.log("error getting equipments", e);
                                });
                            }
                            break;

                          case 39:
                          case 40: // arrow right | arrow down
                            e.preventDefault();
                            if (equipmentItems.length > 0) {
                              let selectedIndex = equipmentItems.findIndex(
                                (item) => item.selected
                              );

                              if (selectedIndex === -1) {
                                setEquipmentItems(
                                  equipmentItems.map((item, index) => {
                                    item.selected = index === 0;
                                    return item;
                                  })
                                );
                              } else {
                                setEquipmentItems(
                                  equipmentItems.map((item, index) => {
                                    if (
                                      selectedIndex ===
                                      equipmentItems.length - 1
                                    ) {
                                      item.selected = index === 0;
                                    } else {
                                      item.selected =
                                        index === selectedIndex + 1;
                                    }
                                    return item;
                                  })
                                );
                              }

                              refEquipmentPopupItems.current.map((r, i) => {
                                if (r && r.classList.contains("selected")) {
                                  r.scrollIntoView({
                                    behavior: "auto",
                                    block: "center",
                                    inline: "nearest",
                                  });
                                }
                                return true;
                              });
                            } else {
                              axios
                                .post(props.serverUrl + "/getEquipments")
                                .then((res) => {
                                  if (res.data.result === "OK") {
                                    setEquipmentItems(
                                      res.data.equipments.map((item, index) => {
                                        item.selected =
                                          (selectedOrder?.equipment?.id ||
                                            0) === 0
                                            ? index === 0
                                            : item.id ===
                                            selectedOrder.equipment.id;
                                        return item;
                                      })
                                    );

                                    refEquipmentPopupItems.current.map(
                                      (r, i) => {
                                        if (
                                          r &&
                                          r.classList.contains("selected")
                                        ) {
                                          r.scrollIntoView({
                                            behavior: "auto",
                                            block: "center",
                                            inline: "nearest",
                                          });
                                        }
                                        return true;
                                      }
                                    );
                                  }
                                })
                                .catch((e) => {
                                  console.log("error getting equipments", e);
                                });
                            }
                            break;

                          case 27: // escape
                            setEquipmentItems([]);
                            break;

                          case 13: // enter
                            if (
                              equipmentItems.length > 0 &&
                              equipmentItems.findIndex(
                                (item) => item.selected
                              ) > -1
                            ) {
                              new Promise((resolve, reject) => {
                                setSelectedOrder((selectedOrder) => {
                                  return {
                                    ...selectedOrder,
                                    equipment:
                                      equipmentItems[
                                      equipmentItems.findIndex(
                                        (item) => item.selected
                                      )
                                      ],
                                    equipment_id:
                                      equipmentItems[
                                        equipmentItems.findIndex(
                                          (item) => item.selected
                                        )
                                      ].id,
                                  };
                                });

                                resolve("OK");
                              })
                                .then((response) => {
                                  validateOrderForSaving({ keyCode: 9 });
                                  setEquipmentItems([]);
                                  refDriverName.current.focus();
                                })
                                .catch((e) => {
                                  console.log(e);
                                });
                            }
                            break;

                          case 9: // tab
                            if (
                              equipmentItems.length > 0 &&
                              equipmentItems.findIndex(
                                (item) => item.selected
                              ) > -1
                            ) {
                              e.preventDefault();

                              new Promise((resolve, reject) => {
                                setSelectedOrder((selectedOrder) => {
                                  return {
                                    ...selectedOrder,
                                    equipment:
                                      equipmentItems[
                                      equipmentItems.findIndex(
                                        (item) => item.selected
                                      )
                                      ],
                                    equipment_id:
                                      equipmentItems[
                                        equipmentItems.findIndex(
                                          (item) => item.selected
                                        )
                                      ].id,
                                  };
                                });

                                resolve("OK");
                              })
                                .then((response) => {
                                  validateOrderForSaving({ keyCode: 9 });
                                  setEquipmentItems([]);
                                  refDriverName.current.focus();
                                })
                                .catch((e) => {
                                  console.log(e);
                                });
                            }
                            break;

                          default:
                            break;
                        }
                      }}
                      onBlur={() => {
                        if ((selectedOrder?.equipment?.id || 0) === 0) {
                          setSelectedOrder((selectedOrder) => {
                            return {
                              ...selectedOrder,
                              equipment_id: null,
                              equipment: {},
                            };
                          });
                        }
                      }}
                      onInput={(e) => {
                        let equipment = selectedOrder?.equipment || {};
                        equipment.id = 0;
                        equipment.name = e.target.value;
                        setSelectedOrder((selectedOrder) => {
                          return {
                            ...selectedOrder,
                            equipment: equipment,
                            equipment_id: equipment.id,
                          };
                        });

                        if (e.target.value.trim() === "") {
                          setEquipmentItems([]);
                        } else {
                          axios
                            .post(props.serverUrl + "/getEquipments", {
                              name: e.target.value.trim(),
                            })
                            .then((res) => {
                              if (res.data.result === "OK") {
                                setEquipmentItems(
                                  res.data.equipments.map((item, index) => {
                                    item.selected =
                                      (selectedOrder?.equipment?.id || 0) === 0
                                        ? index === 0
                                        : item.id ===
                                        selectedOrder.equipment.id;
                                    return item;
                                  })
                                );
                              }
                            })
                            .catch((e) => {
                              console.log("error getting equipments", e);
                            });
                        }
                      }}
                      onChange={(e) => {
                        let equipment = selectedOrder?.equipment || {};
                        equipment.id = 0;
                        equipment.name = e.target.value;
                        setSelectedOrder((selectedOrder) => {
                          return {
                            ...selectedOrder,
                            equipment: equipment,
                            equipment_id: equipment.id,
                          };
                        });
                      }}
                      value={selectedOrder?.equipment?.name || ""}
                    />
                    <FontAwesomeIcon
                      className="dropdown-button"
                      icon={faCaretDown}
                      onClick={() => {
                        if (equipmentItems.length > 0) {
                          setEquipmentItems([]);
                        } else {
                          if (
                            (selectedOrder?.equipment?.id || 0) === 0 &&
                            (selectedOrder?.equipment?.name || "") !== ""
                          ) {
                            axios.post(props.serverUrl + "/getEquipments", {
                              name: selectedOrder?.equipment.name,
                            }).then((res) => {
                              if (res.data.result === "OK") {
                                setEquipmentItems(
                                  res.data.equipments.map((item, index) => {
                                    item.selected =
                                      (selectedOrder?.equipment?.id || 0) ===
                                        0
                                        ? index === 0
                                        : item.id ===
                                        selectedOrder.equipment.id;
                                    return item;
                                  })
                                );

                                refEquipmentPopupItems.current.map((r, i) => {
                                  if (r && r.classList.contains("selected")) {
                                    r.scrollIntoView({
                                      behavior: "auto",
                                      block: "center",
                                      inline: "nearest",
                                    });
                                  }
                                  return true;
                                });
                              }
                            }).catch((e) => {
                              console.log("error getting equipments", e);
                            });
                          } else {
                            axios.post(props.serverUrl + "/getEquipments").then((res) => {
                              if (res.data.result === "OK") {
                                setEquipmentItems(
                                  res.data.equipments.map((item, index) => {
                                    item.selected =
                                      (selectedOrder?.equipment?.id || 0) ===
                                        0
                                        ? index === 0
                                        : item.id ===
                                        selectedOrder.equipment.id;
                                    return item;
                                  })
                                );

                                refEquipmentPopupItems.current.map((r, i) => {
                                  if (r && r.classList.contains("selected")) {
                                    r.scrollIntoView({
                                      behavior: "auto",
                                      block: "center",
                                      inline: "nearest",
                                    });
                                  }
                                  return true;
                                });
                              }
                            }).catch(async (e) => {
                              console.log("error getting equipments", e);
                            });
                          }
                        }

                        refEquipment.current.focus();
                      }}
                    />
                  </div>
                  {equipmentTransition(
                    (style, item) =>
                      item && (
                        <animated.div
                          className="mochi-contextual-container"
                          id="mochi-contextual-container-equipment"
                          style={{
                            ...style,
                            left: "-50%",
                            display: "block",
                          }}
                          ref={refEquipmentDropDown}
                        >
                          <div className="mochi-contextual-popup vertical below" style={{ height: 150 }}>
                            <div className="mochi-contextual-popup-content">
                              <div className="mochi-contextual-popup-wrapper">
                                {equipmentItems.map((item, index) => {
                                  const mochiItemClasses = classnames({
                                    "mochi-item": true,
                                    selected: item.selected,
                                  });

                                  const searchValue =
                                    (selectedOrder?.equipment?.id || 0) === 0 &&
                                      (selectedOrder?.equipment?.name || "") !==
                                      ""
                                      ? selectedOrder?.equipment?.name
                                      : undefined;

                                  return (
                                    <div
                                      key={index}
                                      className={mochiItemClasses}
                                      id={item.id}
                                      onClick={() => {
                                        new Promise((resolve, reject) => {
                                          setSelectedOrder((selectedOrder) => {
                                            return {
                                              ...selectedOrder,
                                              equipment: item,
                                              equipment_id: item.id,
                                            };
                                          });

                                          resolve("OK");
                                        })
                                          .then((response) => {
                                            validateOrderForSaving({
                                              keyCode: 9,
                                            });
                                            setEquipmentItems([]);
                                            refDriverName.current.focus();
                                          })
                                          .catch((e) => {
                                            console.log(e);
                                          });
                                      }}
                                      ref={(ref) =>
                                        refEquipmentPopupItems.current.push(ref)
                                      }
                                    >
                                      {searchValue === undefined ? (
                                        item.name
                                      ) : (
                                        <Highlighter
                                          highlightClassName="mochi-item-highlight-text"
                                          searchWords={[searchValue]}
                                          autoEscape={true}
                                          textToHighlight={item.name}
                                        />
                                      )}
                                      {item.selected && (
                                        <FontAwesomeIcon
                                          className="dropdown-selected"
                                          icon={faCaretRight}
                                        />
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </animated.div>
                      )
                  )}
                </div>
              </div>
              <div className="form-v-sep"></div>
              <div className="form-row">
                <div className="select-box-container" style={{ width: "9rem" }}>
                  <div className="select-box-wrapper">
                    <input
                      type="text"
                      tabIndex={57 + props.tabTimes}
                      placeholder="Driver Name"
                      ref={refDriverName}
                      onKeyDown={async (e) => {
                        let key = e.keyCode || e.which;

                        switch (key) {
                          case 37:
                          case 38: // arrow left | arrow up
                            e.preventDefault();
                            if (driverItems.length > 0) {
                              let selectedIndex = driverItems.findIndex(
                                (item) => item.selected
                              );

                              if (selectedIndex === -1) {
                                await setDriverItems(
                                  driverItems.map((item, index) => {
                                    item.selected = index === 0;
                                    return item;
                                  })
                                );
                              } else {
                                await setDriverItems(
                                  driverItems.map((item, index) => {
                                    if (selectedIndex === 0) {
                                      item.selected =
                                        index === driverItems.length - 1;
                                    } else {
                                      item.selected =
                                        index === selectedIndex - 1;
                                    }
                                    return item;
                                  })
                                );
                              }

                              refDriverPopupItems.current.map((r, i) => {
                                if (r && r.classList.contains("selected")) {
                                  r.scrollIntoView({
                                    behavior: "auto",
                                    block: "center",
                                    inline: "nearest",
                                  });
                                }
                                return true;
                              });
                            } else {
                              if ((selectedCarrier?.id || 0) > 0) {
                                axios.post(props.serverUrl + "/getDriversByCarrierId",
                                  {
                                    carrier_id: selectedCarrier.id,
                                  }
                                )
                                  .then(async (res) => {
                                    if (res.data.result === "OK") {
                                      if (res.data.count > 0) {
                                        await setDriverItems([
                                          ...[
                                            {
                                              first_name: "Clear",
                                              id: null,
                                            },
                                          ],
                                          ...res.data.drivers.map(
                                            (item, index) => {
                                              item.selected =
                                                (selectedCarrierDriver?.id ||
                                                  0) === 0
                                                  ? index === 0
                                                  : item.id ===
                                                  selectedCarrierDriver.id;

                                              item.name =
                                                item.first_name +
                                                (item.last_name.trim() === ""
                                                  ? ""
                                                  : " " + item.last_name);
                                              return item;
                                            }
                                          ),
                                        ]);
                                      } else {
                                        await setDriverItems([
                                          ...[
                                            {
                                              first_name: "Clear",
                                              id: null,
                                            },
                                          ],
                                        ]);
                                      }

                                      refDriverPopupItems.current.map(
                                        (r, i) => {
                                          if (
                                            r &&
                                            r.classList.contains("selected")
                                          ) {
                                            r.scrollIntoView({
                                              behavior: "auto",
                                              block: "center",
                                              inline: "nearest",
                                            });
                                          }
                                          return true;
                                        }
                                      );
                                    }
                                  })
                                  .catch(async (e) => {
                                    console.log(
                                      "error getting carrier drivers",
                                      e
                                    );
                                  });
                              }
                            }
                            break;

                          case 39:
                          case 40: // arrow right | arrow down
                            e.preventDefault();
                            if (driverItems.length > 0) {
                              let selectedIndex = driverItems.findIndex(
                                (item) => item.selected
                              );

                              if (selectedIndex === -1) {
                                await setDriverItems(
                                  driverItems.map((item, index) => {
                                    item.selected = index === 0;
                                    return item;
                                  })
                                );
                              } else {
                                await setDriverItems(
                                  driverItems.map((item, index) => {
                                    if (
                                      selectedIndex ===
                                      driverItems.length - 1
                                    ) {
                                      item.selected = index === 0;
                                    } else {
                                      item.selected =
                                        index === selectedIndex + 1;
                                    }
                                    return item;
                                  })
                                );
                              }

                              refDriverPopupItems.current.map((r, i) => {
                                if (r && r.classList.contains("selected")) {
                                  r.scrollIntoView({
                                    behavior: "auto",
                                    block: "center",
                                    inline: "nearest",
                                  });
                                }
                                return true;
                              });
                            } else {
                              if ((selectedCarrier?.id || 0) > 0) {
                                axios.post(props.serverUrl + "/getDriversByCarrierId",
                                  {
                                    carrier_id: selectedCarrier.id,
                                  }
                                ).then(async (res) => {
                                  if (res.data.result === "OK") {
                                    if (res.data.count > 0) {
                                      await setDriverItems([
                                        ...[
                                          {
                                            first_name: "Clear",
                                            id: null,
                                          },
                                        ],
                                        ...res.data.drivers.map(
                                          (item, index) => {
                                            item.selected =
                                              (selectedCarrierDriver?.id ||
                                                0) === 0
                                                ? index === 0
                                                : item.id ===
                                                selectedCarrierDriver.id;

                                            item.name =
                                              item.first_name +
                                              (item.last_name.trim() === ""
                                                ? ""
                                                : " " + item.last_name);
                                            return item;
                                          }
                                        ),
                                      ]);
                                    } else {
                                      await setDriverItems([
                                        ...[
                                          {
                                            first_name: "Clear",
                                            id: null,
                                          },
                                        ],
                                      ]);
                                    }

                                    refDriverPopupItems.current.map(
                                      (r, i) => {
                                        if (
                                          r &&
                                          r.classList.contains("selected")
                                        ) {
                                          r.scrollIntoView({
                                            behavior: "auto",
                                            block: "center",
                                            inline: "nearest",
                                          });
                                        }
                                        return true;
                                      }
                                    );
                                  }
                                })
                                  .catch(async (e) => {
                                    console.log(
                                      "error getting carrier drivers",
                                      e
                                    );
                                  });
                              }
                            }
                            break;

                          case 27: // escape
                            setDriverItems([]);
                            break;

                          case 13: // enter
                            if (driverItems.length > 0 && driverItems.findIndex((item) => item.selected) > -1) {
                              if (driverItems[driverItems.findIndex((item) => item.selected)].id === null) {
                                await setSelectedCarrierDriver({ name: "" });

                                axios.post(props.serverUrl + "/saveOrder", {
                                  ...selectedOrder,
                                  carrier_driver_id: null,
                                }).then(async (res) => {
                                  if (res.data.result === "OK") {
                                    await setSelectedOrder({
                                      ...res.data.order,
                                    });
                                    await props.setSelectedOrder({
                                      ...res.data.order,
                                      component_id: props.componentId,
                                    });
                                  } else {
                                    console.log(res.data.result);
                                  }

                                  setIsSavingOrder(false);
                                }).catch((e) => {
                                  console.log("error saving order", e);
                                  setIsSavingOrder(false);
                                });

                                refDriverName.current.focus();
                              } else {
                                await setSelectedCarrierDriver(driverItems[driverItems.findIndex((item) => item.selected)]);
                                await setSelectedOrder({
                                  ...selectedOrder,
                                  equipment: driverItems[driverItems.findIndex((item) => item.selected)].equipment,
                                  equipment_id: driverItems[driverItems.findIndex((item) => item.selected)].equipment_id
                                })
                                validateCarrierDriverForSaving({ keyCode: 9 });
                                refDriverPhone.current.inputElement.focus();
                              }

                              setDriverItems([]);
                            }
                            break;

                          case 9: // tab
                            if (driverItems.length > 0) {
                              e.preventDefault();
                              if (driverItems[driverItems.findIndex((item) => item.selected)].id === null) {
                                await setSelectedCarrierDriver({ name: "" });

                                axios.post(props.serverUrl + "/saveOrder", {
                                  ...selectedOrder,
                                  carrier_driver_id: null,
                                }).then(async (res) => {
                                  if (res.data.result === "OK") {
                                    await setSelectedOrder({
                                      ...res.data.order,
                                    });

                                    await props.setSelectedOrder({
                                      ...res.data.order,
                                      component_id: props.componentId,
                                    });
                                  } else {
                                    console.log(res.data.result);
                                  }

                                  setIsSavingOrder(false);
                                }).catch((e) => {
                                  console.log("error saving order", e);
                                  setIsSavingOrder(false);
                                });

                                refDriverName.current.focus();
                              } else {
                                await setSelectedCarrierDriver(driverItems[driverItems.findIndex((item) => item.selected)]);

                                await setSelectedOrder({
                                  ...selectedOrder,
                                  equipment: driverItems[driverItems.findIndex((item) => item.selected)].equipment,
                                  equipment_id: driverItems[driverItems.findIndex((item) => item.selected)].equipment_id
                                })

                                refDriverPhone.current.inputElement.focus();
                              }

                              setDriverItems([]);
                            }

                            await validateCarrierDriverForSaving({
                              keyCode: 9,
                            });
                            break;

                          default:
                            break;
                        }
                      }}
                      onBlur={(e) => {
                        if ((selectedCarrierDriver?.id || 0) > 0) {
                          if (e.target.value.trim() === "") {
                            setSelectedCarrierDriver({ name: "" });
                          }
                        }
                      }}
                      onInput={async (e) => {
                        let driver = selectedCarrierDriver || {};

                        let splitted = e.target.value.split(" ");
                        let first_name = splitted[0];

                        let last_name = "";

                        splitted.map((item, index) => {
                          if (index > 0) {
                            last_name +=
                              item + (index < splitted.length - 1 ? " " : "");
                          }
                          return true;
                        });

                        setSelectedCarrierDriver({
                          ...driver,
                          name: e.target.value,
                          first_name: first_name,
                          last_name: last_name,
                        });
                      }}
                      onChange={async (e) => {
                        let driver = selectedCarrierDriver || {};

                        let splitted = e.target.value.split(" ");
                        let first_name = splitted[0];

                        let last_name = "";

                        splitted.map((item, index) => {
                          if (index > 0) {
                            last_name +=
                              item + (index < splitted.length - 1 ? " " : "");
                          }
                          return true;
                        });

                        setSelectedCarrierDriver({
                          ...driver,
                          name: e.target.value,
                          first_name: first_name,
                          last_name: last_name,
                        });
                      }}
                      value={selectedCarrierDriver?.name || ""}
                    />
                    {(selectedCarrier?.drivers || []).length >= 0 && (
                      <FontAwesomeIcon
                        className="dropdown-button"
                        icon={faCaretDown}
                        onClick={() => {
                          if (driverItems.length > 0) {
                            setDriverItems([]);
                          } else {
                            window.setTimeout(async () => {
                              if ((selectedCarrier?.id || 0) > 0) {
                                axios.post(props.serverUrl + "/getDriversByCarrierId",
                                  {
                                    carrier_id: selectedCarrier.id,
                                  }
                                ).then(async (res) => {
                                  if (res.data.result === "OK") {
                                    if (res.data.count > 0) {
                                      await setDriverItems([
                                        ...[
                                          {
                                            first_name: "Clear",
                                            id: null,
                                          },
                                        ],
                                        ...res.data.drivers.map(
                                          (item, index) => {
                                            item.selected =
                                              (selectedCarrierDriver?.id ||
                                                0) === 0
                                                ? index === 0
                                                : item.id ===
                                                selectedCarrierDriver.id;

                                            item.name =
                                              item.first_name +
                                              (item.last_name.trim() === ""
                                                ? ""
                                                : " " + item.last_name);
                                            return item;
                                          }
                                        ),
                                      ]);
                                    } else {
                                      await setDriverItems([
                                        ...[
                                          {
                                            first_name: "Clear",
                                            id: null,
                                          },
                                        ],
                                      ]);
                                    }

                                    refDriverPopupItems.current.map(
                                      (r, i) => {
                                        if (
                                          r &&
                                          r.classList.contains("selected")
                                        ) {
                                          r.scrollIntoView({
                                            behavior: "auto",
                                            block: "center",
                                            inline: "nearest",
                                          });
                                        }
                                        return true;
                                      }
                                    );
                                  }
                                }).catch(async (e) => {
                                  console.log(
                                    "error getting carrier drivers",
                                    e
                                  );
                                });
                              }

                              refDriverName.current.focus();
                            }, 0);
                          }
                        }}
                      />
                    )}
                  </div>

                  {driverTransition(
                    (style, item) =>
                      item && (
                        <animated.div
                          className="mochi-contextual-container"
                          id="mochi-contextual-container-driver-name"
                          style={{
                            ...style,
                            left: "-50%",
                            display: "block",
                          }}
                          ref={refDriverDropDown}
                        >
                          <div className="mochi-contextual-popup vertical below" style={{ height: 150 }}>
                            <div className="mochi-contextual-popup-content">
                              <div className="mochi-contextual-popup-wrapper">
                                {driverItems.map((item, index) => {
                                  const mochiItemClasses = classnames({
                                    "mochi-item": true,
                                    selected: item.selected,
                                  });

                                  const searchValue =
                                    (selectedCarrierDriver?.first_name || "") +
                                    ((
                                      selectedCarrierDriver?.last_name || ""
                                    ).trim() === ""
                                      ? ""
                                      : " " + selectedCarrierDriver?.last_name);

                                  return (
                                    <div
                                      key={index}
                                      className={mochiItemClasses}
                                      id={item.id}
                                      onClick={() => {
                                        if (item.id === null) {
                                          setSelectedCarrierDriver({
                                            name: "",
                                          });

                                          axios.post(props.serverUrl + "/saveOrder",
                                            {
                                              ...selectedOrder,
                                              carrier_driver_id: null,
                                            }
                                          ).then((res) => {
                                            if (res.data.result === "OK") {
                                              setSelectedOrder({
                                                ...res.data.order,
                                              });
                                              props.setSelectedOrder({
                                                ...res.data.order,
                                                component_id:
                                                  props.componentId,
                                              });
                                            } else {
                                              console.log(res.data.result);
                                            }

                                            setIsSavingOrder(false);
                                          }).catch((e) => {
                                            console.log(
                                              "error saving order",
                                              e
                                            );
                                            setIsSavingOrder(false);
                                          });

                                          refDriverName.current.focus();
                                        } else {
                                          setSelectedCarrierDriver(item);

                                          setSelectedOrder({
                                            ...selectedOrder,
                                            equipment: item.equipment,
                                            equipment_id: item.equipment_id
                                          })

                                          validateCarrierDriverForSaving({
                                            keyCode: 9,
                                          });

                                          refDriverPhone.current.inputElement.focus();
                                        }

                                        setDriverItems([]);
                                      }}
                                      ref={(ref) =>
                                        refDriverPopupItems.current.push(ref)
                                      }>
                                      {searchValue === undefined ? (
                                        (item?.first_name || "") +
                                        ((item?.last_name || "") === ""
                                          ? ""
                                          : " " + item.last_name)
                                      ) : (
                                        <Highlighter
                                          highlightClassName="mochi-item-highlight-text"
                                          searchWords={[
                                            selectedCarrierDriver?.first_name ||
                                            "",
                                            selectedCarrierDriver?.last_name ||
                                            "",
                                          ]}
                                          autoEscape={true}
                                          textToHighlight={
                                            (item?.first_name || "") +
                                            ((item?.last_name || "") === ""
                                              ? ""
                                              : " " + item.last_name)
                                          }
                                        />
                                      )}
                                      {item.selected && (
                                        <FontAwesomeIcon
                                          className="dropdown-selected"
                                          icon={faCaretRight}
                                        />
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </animated.div>
                      )
                  )}
                </div>

                <div className="form-h-sep"></div>
                <div className="input-box-container grow">
                  <MaskedInput
                    tabIndex={58 + props.tabTimes}
                    ref={refDriverPhone}
                    mask={[/[0-9]/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/,]}
                    guide={true}
                    type="text"
                    placeholder="Driver Phone"
                    onKeyDown={validateCarrierDriverForSaving}
                    onInput={(e) => {
                      setSelectedCarrierDriver({
                        ...selectedCarrierDriver,
                        phone: e.target.value,
                      });
                    }}
                    onChange={(e) => {
                      setSelectedCarrierDriver({
                        ...selectedCarrierDriver,
                        phone: e.target.value,
                      });
                    }}
                    value={selectedCarrierDriver.phone || ""}
                  />
                </div>
                <div className="form-h-sep"></div>
                <div className="input-box-container" style={{
                  maxWidth: "5.8rem",
                  minWidth: "5.8rem",
                }}                >
                  <input
                    tabIndex={59 + props.tabTimes}
                    type="text"
                    placeholder="Unit Number"
                    onKeyDown={validateCarrierDriverForSaving}
                    onInput={(e) => {
                      setSelectedCarrierDriver({
                        ...selectedCarrierDriver,
                        truck: e.target.value,
                      });
                    }}
                    onChange={(e) => {
                      setSelectedCarrierDriver({
                        ...selectedCarrierDriver,
                        truck: e.target.value,
                      });
                    }}
                    value={selectedCarrierDriver.truck || ""}
                  />
                </div>
                <div className="form-h-sep"></div>
                <div
                  className="input-box-container"
                  style={{
                    maxWidth: "5.8rem",
                    minWidth: "5.8rem",
                  }}
                >
                  <input
                    tabIndex={60 + props.tabTimes}
                    type="text"
                    placeholder="Trailer Number"
                    onKeyDown={(e) => {
                      e.preventDefault();
                      validateCarrierInfoForSaving({ keyCode: 9 });

                      if ((selectedOrder?.id || 0) === 0) {
                        // window.alert('You must create or load an order first!');
                        return;
                      }

                      if ((selectedOrder?.load_type_id || 0) === 0) {
                        // window.alert('You must select a load type first!');
                        return;
                      }

                      let panel = {
                        panelName: `${props.panelName}-rating`,
                        component: (
                          <RatingScreen
                            panelName={`${props.panelName}-rating`}
                            title="Rating Screen"
                            tabTimes={34000 + props.tabTimes}
                            componentId={moment().format("x")}
                            origin={props.origin}
                            selectedOrder={selectedOrder}
                          />
                        ),
                      };

                      props.openPanel(panel, props.origin);
                    }}
                    onInput={(e) => {
                      setSelectedCarrierDriver({
                        ...selectedCarrierDriver,
                        trailer: e.target.value,
                      });
                    }}
                    onChange={(e) => {
                      setSelectedCarrierDriver({
                        ...selectedCarrierDriver,
                        trailer: e.target.value,
                      });
                    }}
                    value={selectedCarrierDriver.trailer || ""}
                  />
                </div>
              </div>
              <div className="form-v-sep"></div>
              <div
                className="form-row"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  flexGrow: 1,
                  alignItems: "flex-end",
                }}
              >
                <div
                  className="mochi-button"
                  style={{ fontSize: "1rem" }}
                  onClick={() => {
                    if ((selectedOrder?.id || 0) === 0) {
                      window.alert("You must create or load an order first!");
                      return;
                    }

                    let panel = {
                      panelName: `${props.panelName}-rate-conf`,
                      component: (
                        <RateConf
                          title="Rate Conf"
                          tabTimes={41000 + props.tabTimes}
                          panelName={`${props.panelName}-rate-conf`}
                          origin={props.origin}
                          componentId={moment().format("x")}
                          selectedOrder={selectedOrder}
                        />
                      ),
                    };

                    props.openPanel(panel, props.origin);
                  }}
                >
                  <div className="mochi-button-decorator mochi-button-decorator-left">
                    (
                  </div>
                  <div className="mochi-button-base">Rate Confirmation</div>
                  <div className="mochi-button-decorator mochi-button-decorator-right">
                    )
                  </div>
                </div>
                <div
                  className="mochi-button"
                  style={{ fontSize: "1rem" }}
                  onClick={() => {
                    if ((selectedOrder?.id || 0) === 0) {
                      window.alert("You must create or load an order first!");
                      return;
                    }

                    if ((selectedOrder?.load_type_id || 0) === 0) {
                      window.alert("You must select a load type first!");
                      return;
                    }

                    let panel = {
                      panelName: `${props.panelName}-rating`,
                      component: (
                        <RatingScreen
                          panelName={`${props.panelName}-rating`}
                          title="Rating Screen"
                          tabTimes={34000 + props.tabTimes}
                          componentId={moment().format("x")}
                          origin={props.origin}
                          selectedOrder={selectedOrder}
                        />
                      ),
                    };

                    props.openPanel(panel, props.origin);
                  }}
                >
                  <div className="mochi-button-decorator mochi-button-decorator-left">
                    (
                  </div>
                  <div className="mochi-button-base">Adjust Rate</div>
                  <div className="mochi-button-decorator mochi-button-decorator-right">
                    )
                  </div>
                </div>
                <div className="mochi-button" style={{ fontSize: "1rem" }} onClick={(e) => {
                  if ((selectedOrder?.id || 0) === 0) {
                    window.alert("You must create or load an order first!");
                    return;
                  }

                  if ((selectedOrder?.carrier?.id || 0) === 0) {
                    window.alert("You must select a carrier first!");
                    return;
                  }

                  setShowingChangeCarrier(true);
                }}>
                  <div className="mochi-button-decorator mochi-button-decorator-left">
                    (
                  </div>
                  <div className="mochi-button-base">Change Carrier</div>
                  <div className="mochi-button-decorator mochi-button-decorator-right">
                    )
                  </div>
                </div>
                <div
                  className="mochi-button"
                  style={{ fontSize: "1rem" }}
                  onClick={() => {
                    if ((selectedOrder?.order_number || 0) === 0) {
                      window.alert("You must select or create an order first!");
                      return;
                    }

                    setSelectedNoteForDriver({ id: 0 });
                  }}
                >
                  <div className="mochi-button-decorator mochi-button-decorator-left">
                    (
                  </div>
                  <div className="mochi-button-base">Notes for Driver</div>
                  <div className="mochi-button-decorator mochi-button-decorator-right">
                    )
                  </div>
                </div>
              </div>
            </div>

            <div
              className="form-borderless-box"
              style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
            >
              <div
                className="form-row"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 10,
                }}
              >
                <div className="input-toggle-container">
                  <input
                    type="checkbox"
                    id="cbox-dispatch-hazmat-btn"
                    onChange={async (e) => {
                      await setSelectedOrder({
                        ...selectedOrder,
                        haz_mat: e.target.checked ? 1 : 0,
                      });

                      validateOrderForSaving({ keyCode: 9 });
                    }}
                    checked={(selectedOrder?.haz_mat || 0) === 1}
                  />
                  <label htmlFor="cbox-dispatch-hazmat-btn">
                    <div className="label-text">HazMat</div>
                    <div className="input-toggle-btn"></div>
                  </label>
                </div>
                <div className="input-toggle-container">
                  <input
                    type="checkbox"
                    id="cbox-dispatch-expedited-btn"
                    onChange={async (e) => {
                      await setSelectedOrder({
                        ...selectedOrder,
                        expedited: e.target.checked ? 1 : 0,
                      });

                      validateOrderForSaving({ keyCode: 9 });
                    }}
                    checked={(selectedOrder?.expedited || 0) === 1}
                  />
                  <label htmlFor="cbox-dispatch-expedited-btn">
                    <div className="label-text">Expedited</div>
                    <div className="input-toggle-btn"></div>
                  </label>
                </div>
              </div>
              <div
                className="form-row"
                style={{ flexGrow: 1, display: "flex" }}
              >
                <div className="form-bordered-box">
                  <div className="form-header">
                    <div className="top-border top-border-left"></div>
                    <div className="form-title">
                      Notes for Carrier on Rate Conf
                    </div>
                    <div className="top-border top-border-middle"></div>
                    <div className="form-buttons">
                      <div
                        className="mochi-button"
                        onClick={() => {
                          if ((selectedOrder?.order_number || 0) === 0) {
                            window.alert(
                              "You must select or create an order first!"
                            );
                            return;
                          }

                          setSelectedNoteForCarrier({ id: 0 });
                        }}
                      >
                        <div className="mochi-button-decorator mochi-button-decorator-left">
                          (
                        </div>
                        <div className="mochi-button-base">Add note</div>
                        <div className="mochi-button-decorator mochi-button-decorator-right">
                          )
                        </div>
                      </div>
                    </div>
                    <div className="top-border top-border-right"></div>
                  </div>

                  <div className="notes-for-carrier-container">
                    <div className="notes-for-carrier-wrapper">
                      {(selectedOrder?.notes_for_carrier || []).map(
                        (note, index) => {
                          return (
                            <div
                              className="notes-for-carrier-item"
                              key={index}
                              onClick={() => setSelectedNoteForCarrier(note)}
                            >
                              {note.text}
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="fields-container-col"
          style={{
            display: "flex",
            flexDirection: "column",
            width: "10%",
            justifyContent: "space-between",
            alignItems: "flex-end",
            padding: "2px 0 10px 0",
          }}
        >
          <div
            className="mochi-button"
            onClick={() => {
              if ((selectedOrder?.id || 0) === 0) {
                window.alert("You must create or load an order first!");
                return;
              }

              let panel = {
                panelName: `${props.panelName}-rate-conf`,
                component: (
                  <RateConf
                    title="Rate Conf"
                    tabTimes={41000 + props.tabTimes}
                    panelName={`${props.panelName}-rate-conf`}
                    origin={props.origin}
                    componentId={moment().format("x")}
                    selectedOrder={selectedOrder}
                  />
                ),
              };

              props.openPanel(panel, props.origin);
            }}
          >
            <div className="mochi-button-decorator mochi-button-decorator-left">
              (
            </div>
            <div className="mochi-button-base">Rate Conf</div>
            <div className="mochi-button-decorator mochi-button-decorator-right">
              )
            </div>
          </div>
          <div
            className="mochi-button"
            onClick={() => {
              if ((selectedOrder?.id || 0) === 0) {
                window.alert("You must create or load an order first!");
                return;
              }

              let panel = {
                panelName: `${props.panelName}-order`,
                component: (
                  <Order
                    title="Order"
                    tabTimes={37000 + props.tabTimes}
                    panelName={`${props.panelName}-order`}
                    origin={props.origin}
                    componentId={moment().format("x")}
                    selectedOrder={selectedOrder}
                  />
                ),
              };

              props.openPanel(panel, props.origin);
            }}
          >
            <div className="mochi-button-decorator mochi-button-decorator-left">
              (
            </div>
            <div className="mochi-button-base">Print Order</div>
            <div className="mochi-button-decorator mochi-button-decorator-right">
              )
            </div>
          </div>
          <div
            className="mochi-button"
            onClick={() => {
              if ((selectedOrder?.id || 0) === 0) {
                window.alert("You must create or load an order first!");
                return;
              }

              let panel = {
                panelName: `${props.panelName}-bol`,
                component: (
                  <Bol
                    title="Bol"
                    tabTimes={40000 + props.tabTimes}
                    panelName={`${props.panelName}-bol`}
                    origin={props.origin}
                    componentId={moment().format("x")}
                    selectedOrder={selectedOrder}
                  />
                ),
              };

              props.openPanel(panel, props.origin);
            }}
          >
            <div className="mochi-button-decorator mochi-button-decorator-left">
              (
            </div>
            <div className="mochi-button-base">Print BOL</div>
            <div className="mochi-button-decorator mochi-button-decorator-right">
              )
            </div>
          </div>
          <div
            className={classnames({
              "mochi-button": true,
              disabled: false,
            })}
            onClick={() => {
              if ((selectedOrder?.id || 0) === 0) {
                window.alert("You must create or load an order first!");
                return;
              }

              let panel = {
                panelName: `${props.panelName}-documents`,
                component: (
                  <Documents
                    title="Documents"
                    tabTimes={90000 + props.tabTimes}
                    panelName={`${props.panelName}-documents`}
                    origin={props.origin}
                    suborigin={"order"}
                    openPanel={props.openPanel}
                    closePanel={props.closePanel}
                    componentId={moment().format("x")}
                    selectedOwner={{ ...selectedOrder }}
                    selectedOwnerDocument={{
                      id: 0,
                      user_id: Math.floor(Math.random() * (15 - 1)) + 1,
                      date_entered: moment().format("MM/DD/YYYY"),
                    }}
                    savingDocumentUrl="/saveOrderDocument"
                    deletingDocumentUrl="/deleteOrderDocument"
                    savingDocumentNoteUrl="/saveOrderDocumentNote"
                    serverDocumentsFolder="/order-documents/"
                  />
                ),
              };

              props.openPanel(panel, props.origin);
            }}
          >
            <div className="mochi-button-decorator mochi-button-decorator-left">
              (
            </div>
            <div className="mochi-button-base">Documents</div>
            <div className="mochi-button-decorator mochi-button-decorator-right">
              )
            </div>
          </div>
          <div
            className="mochi-button"
            onClick={async () => {
              let panel = {
                panelName: `${props.panelName}-load-board`,
                component: (
                  <LoadBoard
                    pageName={"Load Board"}
                    title={"Load Board"}
                    panelName={"load-board"}
                    tabTimes={4000 + props.tabTimes}
                    screenFocused={props.loadBoardScreenFocused}
                    componentId={moment().format("x")}
                    isOnPanel={true}
                    origin={props.origin}
                    openPanel={props.openPanel}
                    closePanel={props.closePanel}
                  />
                ),
              };

              props.openPanel(panel, props.origin);
            }}
          >
            <div className="mochi-button-decorator mochi-button-decorator-left">
              (
            </div>
            <div className="mochi-button-base">Load Board</div>
            <div className="mochi-button-decorator mochi-button-decorator-right">
              )
            </div>
          </div>
          <div
            className="mochi-button"
            onClick={() => {
              if ((selectedOrder?.id || 0) === 0) {
                window.alert("You must create or load an order first!");
                return;
              }

              if ((selectedOrder?.load_type_id || 0) === 0) {
                window.alert("You must select a load type first!");
                return;
              }

              let panel = {
                panelName: `${props.panelName}-rating`,
                component: (
                  <RatingScreen
                    panelName={`${props.panelName}-rating`}
                    title="Rating Screen"
                    tabTimes={34000 + props.tabTimes}
                    componentId={moment().format("x")}
                    origin={props.origin}
                    selectedOrder={selectedOrder}
                  />
                ),
              };

              props.openPanel(panel, props.origin);
            }}
          >
            <div className="mochi-button-decorator mochi-button-decorator-left">
              (
            </div>
            <div className="mochi-button-base">Rate Load</div>
            <div className="mochi-button-decorator mochi-button-decorator-right">
              )
            </div>
          </div>
        </div>
      </div>

      <div className="fields-container-row" style={{
        display: "flex",
        alignSelf: "flex-start",
        minWidth: "70%",
        maxWidth: "100%",
        alignItems: "center",
      }}>

        <div className="fields-container-row routing" style={{
          display: "flex",
          alignSelf: "flex-start",
          minWidth: "70%",
          maxWidth: "69%",
          alignItems: "center",
        }}>
          <div className="pickups-container" style={{ display: "flex", flexDirection: "row" }}>
            <div className="swiper-pickup-prev-btn">
              <span className="fas fa-chevron-left"></span>
            </div>

            <Swiper
              slidesPerView={5}
              navigation={{
                prevEl: ".swiper-pickup-prev-btn",
                nextEl: ".swiper-pickup-next-btn",
              }}
            >
              {[
                ...getPickupsOnRouting(),
                ...(selectedOrder?.pickups || []).filter(
                  (p) =>
                    (selectedOrder?.routing || []).find(
                      (r) => r.pickup_id === p.id
                    ) === undefined
                ),
              ].map((pickup, index) => {
                if (pickup === undefined) {
                  return "";
                } else {
                  let fulDateTime1 =
                    (pickup.pu_date1 || "") + " " + (pickup.pu_time1 || "");
                  let fulDateTime2 =
                    (pickup.pu_date2 || "") + " " + (pickup.pu_time2 || "");
                  let puDateTime = undefined;
                  let statusClass = "active";
                  let curDateTime = currentSystemDateTime;

                  if (
                    moment(fulDateTime2, "MM/DD/YYYY HHmm").format(
                      "MM/DD/YYYY HHmm"
                    ) === fulDateTime2
                  ) {
                    puDateTime = moment(fulDateTime2, "MM/DD/YYYY HHmm");
                  } else if (
                    moment(fulDateTime1, "MM/DD/YYYY HHmm").format(
                      "MM/DD/YYYY HHmm"
                    ) === fulDateTime1
                  ) {
                    puDateTime = moment(fulDateTime1, "MM/DD/YYYY HHmm");
                  }

                  if (puDateTime !== undefined) {
                    let pastHour = puDateTime.clone().subtract(1, "hours");

                    if (curDateTime < pastHour) {
                      statusClass = "active";
                    } else if (
                      curDateTime >= pastHour &&
                      curDateTime <= puDateTime
                    ) {
                      statusClass = "warning";
                    } else {
                      statusClass = "expired";
                    }

                    if ((selectedOrder?.events || []).length > 0) {
                      selectedOrder.events.map((item) => {
                        if (
                          (item.event_type?.name || "").toLowerCase() ===
                          "loaded" &&
                          item.shipper_id === pickup.customer_id
                        ) {
                          curDateTime = moment(
                            item.event_date + " " + item.event_time,
                            "MM/DD/YYYY HHmm"
                          );

                          if (curDateTime <= puDateTime) {
                            statusClass = "active";
                          } else {
                            statusClass = "expired";
                          }
                        }
                        return true;
                      });
                    }
                  }

                  let classes = classnames({
                    "order-pickup": true,
                    selected: selectedShipperCustomer?.pickup_id === pickup.id,
                    active: statusClass === "active",
                    warning: statusClass === "warning",
                    expired: statusClass === "expired",
                    unsaved: pickup.id === 0,
                  });

                  return (
                    <SwiperSlide
                      className={classes}
                      key={index}
                      onClick={() => {
                        setSelectedShipperCustomer({
                          ...pickup.customer,
                          pickup_id: pickup.id,
                          pu_date1: pickup.pu_date1,
                          pu_date2: pickup.pu_date2,
                          pu_time1: pickup.pu_time1,
                          pu_time2: pickup.pu_time2,
                          bol_numbers: pickup.bol_numbers,
                          po_numbers: pickup.po_numbers,
                          ref_numbers: pickup.ref_numbers,
                          seal_number: pickup.seal_number,
                          special_instructions: pickup.special_instructions,
                          type: pickup.type,
                        });

                        setSelectedShipperCustomerContact(
                          (pickup.customer?.contacts || []).find(
                            (c) => c.is_primary === 1
                          ) || {}
                        );

                        refShipperCompanyCode.current.focus();
                      }}
                    >
                      <div>PU {index + 1}</div>
                      <div
                        className="pu-remove-btn"
                        title="Remove this pickup"
                        onClick={async (e) => {
                          e.stopPropagation();

                          let selected_order = JSON.parse(
                            JSON.stringify(selectedOrder)
                          );

                          selected_order.pickups = (
                            selected_order?.pickups || []
                          ).filter((pu, i) => {
                            return pu.id !== pickup.id;
                          });

                          await setSelectedOrder(selected_order);

                          if (selected_order.pickups.length > 0) {
                            await setSelectedShipperCustomer({
                              ...(selected_order.pickups[0].customer || {}),
                              ...selected_order.pickups[0],
                              customer: {},
                              pickup_id: selected_order.pickups[0].id,
                            });

                            await setSelectedShipperCustomerContact(
                              (
                                selected_order.pickups[0].customer?.contacts || []
                              ).find((c) => c.is_primary === 1) || {}
                            );
                          } else {
                            await setSelectedShipperCustomer({});
                            await setSelectedShipperCustomerContact({});
                          }

                          await axios
                            .post(props.serverUrl + "/removeOrderPickup", {
                              id: pickup.id,
                              order_id: selected_order?.id || 0,
                            })
                            .then((res) => {
                              if (res.data.result === "OK") {
                                selected_order = res.data.order;

                                // validar routing
                                // 1. VALIDAR PICKUPS AND DELIVERIES = 1
                                if (
                                  (selected_order?.pickups || []).length > 0 &&
                                  selected_order.deliveries.length > 0
                                ) {
                                  if (
                                    selected_order.pickups.length === 1 &&
                                    selected_order.deliveries.length === 1
                                  ) {
                                    let routing = [
                                      {
                                        order_id: selected_order?.id || 0,
                                        pickup_id: selected_order.pickups[0].id,
                                        delivery_id: null,
                                        type: "pickup",
                                      },
                                      {
                                        order_id: selected_order?.id || 0,
                                        pickup_id: null,
                                        delivery_id:
                                          selected_order.deliveries[0].id,
                                        type: "delivery",
                                      },
                                    ];

                                    axios
                                      .post(
                                        props.serverUrl + "/saveOrderRouting",
                                        {
                                          order_id: selected_order?.id || 0,
                                          routing: routing,
                                        }
                                      )
                                      .then((res) => {
                                        if (res.data.result === "OK") {
                                          selected_order = res.data.order;
                                          setSelectedOrder(selected_order);

                                          setMileageLoaderVisible(true);

                                          let params = {
                                            mode: "fastest;car;traffic:disabled",
                                            routeAttributes: "summary",
                                          };

                                          let waypointCount = 0;

                                          selected_order.routing.map(
                                            (item, i) => {
                                              if (item.type === "pickup") {
                                                selected_order.pickups.map(
                                                  (p, i) => {
                                                    if (p.id === item.pickup_id) {
                                                      if (
                                                        (p.customer?.zip_data ||
                                                          "") !== ""
                                                      ) {
                                                        params[
                                                          "waypoint" +
                                                          waypointCount
                                                        ] =
                                                          "geo!" +
                                                          p.customer.zip_data.latitude.toString() +
                                                          "," +
                                                          p.customer.zip_data.longitude.toString();
                                                        waypointCount += 1;
                                                      }
                                                    }
                                                    return false;
                                                  }
                                                );
                                              } else {
                                                selected_order.deliveries.map(
                                                  (d, i) => {
                                                    if (
                                                      d.id === item.delivery_id
                                                    ) {
                                                      if (
                                                        (d.customer?.zip_data ||
                                                          "") !== ""
                                                      ) {
                                                        params[
                                                          "waypoint" +
                                                          waypointCount
                                                        ] =
                                                          "geo!" +
                                                          d.customer.zip_data.latitude.toString() +
                                                          "," +
                                                          d.customer.zip_data.longitude.toString();
                                                        waypointCount += 1;
                                                      }
                                                    }
                                                    return false;
                                                  }
                                                );
                                              }

                                              return true;
                                            }
                                          );

                                          routingService.calculateRoute(
                                            params,
                                            (result) => {
                                              let miles =
                                                result.response.route[0].summary
                                                  .distance || 0;

                                              selected_order.miles = miles;

                                              setSelectedOrder(selected_order);
                                              setMileageLoaderVisible(false);

                                              axios
                                                .post(
                                                  props.serverUrl + "/saveOrder",
                                                  selected_order
                                                )
                                                .then(async (res) => {
                                                  if (res.data.result === "OK") {
                                                    setSelectedOrder({
                                                      ...selected_order,
                                                      order_customer_ratings:
                                                        res.data.order
                                                          .order_customer_ratings,
                                                      order_carrier_ratings:
                                                        res.data.order
                                                          .order_carrier_ratings,
                                                    });

                                                    props.setSelectedOrder({
                                                      ...selected_order,
                                                      order_customer_ratings:
                                                        res.data.order
                                                          .order_customer_ratings,
                                                      order_carrier_ratings:
                                                        res.data.order
                                                          .order_carrier_ratings,
                                                      component_id:
                                                        props.componentId,
                                                    });
                                                  }
                                                })
                                                .catch((e) => {
                                                  console.log(
                                                    "error on saving order miles",
                                                    e
                                                  );
                                                  setMileageLoaderVisible(false);
                                                });
                                            },
                                            (error) => {
                                              console.log(
                                                "error getting mileage",
                                                error
                                              );
                                              selected_order.miles = 0;

                                              setSelectedOrder(selected_order);
                                              setMileageLoaderVisible(false);

                                              axios
                                                .post(
                                                  props.serverUrl + "/saveOrder",
                                                  selected_order
                                                )
                                                .then(async (res) => {
                                                  if (res.data.result === "OK") {
                                                    setSelectedOrder({
                                                      ...selected_order,
                                                      order_customer_ratings:
                                                        res.data.order
                                                          .order_customer_ratings,
                                                      order_carrier_ratings:
                                                        res.data.order
                                                          .order_carrier_ratings,
                                                    });

                                                    props.setSelectedOrder({
                                                      ...selected_order,
                                                      order_customer_ratings:
                                                        res.data.order
                                                          .order_customer_ratings,
                                                      order_carrier_ratings:
                                                        res.data.order
                                                          .order_carrier_ratings,
                                                      component_id:
                                                        props.componentId,
                                                    });
                                                  }
                                                })
                                                .catch((e) => {
                                                  console.log(
                                                    "error on saving order miles",
                                                    e
                                                  );
                                                  setMileageLoaderVisible(false);
                                                });
                                            }
                                          );
                                        } else {
                                          console.log(res.data.result);

                                          selected_order.miles = 0;
                                          setSelectedOrder(selected_order);
                                          setMileageLoaderVisible(false);

                                          axios
                                            .post(
                                              props.serverUrl + "/saveOrder",
                                              selected_order
                                            )
                                            .then(async (res) => {
                                              if (res.data.result === "OK") {
                                                setSelectedOrder({
                                                  ...selected_order,
                                                  order_customer_ratings:
                                                    res.data.order
                                                      .order_customer_ratings,
                                                  order_carrier_ratings:
                                                    res.data.order
                                                      .order_carrier_ratings,
                                                });

                                                props.setSelectedOrder({
                                                  ...selected_order,
                                                  order_customer_ratings:
                                                    res.data.order
                                                      .order_customer_ratings,
                                                  order_carrier_ratings:
                                                    res.data.order
                                                      .order_carrier_ratings,
                                                  component_id: props.componentId,
                                                });
                                              }
                                            })
                                            .catch((e) => {
                                              console.log(
                                                "error on saving order miles",
                                                e
                                              );
                                              setMileageLoaderVisible(false);
                                            });
                                        }
                                      })
                                      .catch((e) => {
                                        console.log(
                                          "error saving order miles",
                                          e
                                        );
                                        setMileageLoaderVisible(false);
                                      });
                                  } else {
                                    if (selected_order.routing.length >= 2) {
                                      setMileageLoaderVisible(true);

                                      let params = {
                                        mode: "fastest;car;traffic:disabled",
                                        routeAttributes: "summary",
                                      };

                                      let waypointCount = 0;

                                      selected_order.routing.map((item, i) => {
                                        if (item.type === "pickup") {
                                          selected_order.pickups.map((p, i) => {
                                            if (p.id === item.pickup_id) {
                                              if (
                                                (p.customer?.zip_data || "") !==
                                                ""
                                              ) {
                                                params[
                                                  "waypoint" + waypointCount
                                                ] =
                                                  "geo!" +
                                                  p.customer.zip_data.latitude.toString() +
                                                  "," +
                                                  p.customer.zip_data.longitude.toString();
                                                waypointCount += 1;
                                              }
                                            }
                                            return false;
                                          });
                                        } else {
                                          selected_order.deliveries.map(
                                            (d, i) => {
                                              if (d.id === item.delivery_id) {
                                                if (
                                                  (d.customer?.zip_data || "") !==
                                                  ""
                                                ) {
                                                  params[
                                                    "waypoint" + waypointCount
                                                  ] =
                                                    "geo!" +
                                                    d.customer.zip_data.latitude.toString() +
                                                    "," +
                                                    d.customer.zip_data.longitude.toString();
                                                  waypointCount += 1;
                                                }
                                              }
                                              return false;
                                            }
                                          );
                                        }

                                        return true;
                                      });

                                      routingService.calculateRoute(
                                        params,
                                        (result) => {
                                          let miles =
                                            result.response.route[0].summary
                                              .distance || 0;
                                          selected_order.miles = miles;

                                          setSelectedOrder(selected_order);
                                          setMileageLoaderVisible(false);

                                          axios
                                            .post(
                                              props.serverUrl + "/saveOrder",
                                              selected_order
                                            )
                                            .then(async (res) => {
                                              if (res.data.result === "OK") {
                                                setSelectedOrder({
                                                  ...selected_order,
                                                  order_customer_ratings:
                                                    res.data.order
                                                      .order_customer_ratings,
                                                  order_carrier_ratings:
                                                    res.data.order
                                                      .order_carrier_ratings,
                                                });

                                                props.setSelectedOrder({
                                                  ...selected_order,
                                                  order_customer_ratings:
                                                    res.data.order
                                                      .order_customer_ratings,
                                                  order_carrier_ratings:
                                                    res.data.order
                                                      .order_carrier_ratings,
                                                  component_id: props.componentId,
                                                });
                                              }
                                            })
                                            .catch((e) => {
                                              setMileageLoaderVisible(false);
                                              console.log(
                                                "error on saving order miles",
                                                e
                                              );
                                            });
                                        },
                                        (error) => {
                                          console.log(
                                            "error getting mileage",
                                            error
                                          );
                                          selected_order.miles = 0;
                                          setSelectedOrder(selected_order);
                                          setMileageLoaderVisible(false);

                                          axios
                                            .post(
                                              props.serverUrl + "/saveOrder",
                                              selected_order
                                            )
                                            .then(async (res) => {
                                              if (res.data.result === "OK") {
                                                setSelectedOrder({
                                                  ...selected_order,
                                                  order_customer_ratings:
                                                    res.data.order
                                                      .order_customer_ratings,
                                                  order_carrier_ratings:
                                                    res.data.order
                                                      .order_carrier_ratings,
                                                });

                                                props.setSelectedOrder({
                                                  ...selected_order,
                                                  order_customer_ratings:
                                                    res.data.order
                                                      .order_customer_ratings,
                                                  order_carrier_ratings:
                                                    res.data.order
                                                      .order_carrier_ratings,
                                                  component_id: props.componentId,
                                                });
                                              }
                                            })
                                            .catch((e) => {
                                              setMileageLoaderVisible(false);
                                              console.log(
                                                "error on saving order miles",
                                                e
                                              );
                                            });
                                        }
                                      );
                                    } else {
                                      selected_order.miles = 0;
                                      setSelectedOrder(selected_order);
                                      setMileageLoaderVisible(false);

                                      axios
                                        .post(
                                          props.serverUrl + "/saveOrder",
                                          selected_order
                                        )
                                        .then(async (res) => {
                                          if (res.data.result === "OK") {
                                            setSelectedOrder({
                                              ...selected_order,
                                              order_customer_ratings:
                                                res.data.order
                                                  .order_customer_ratings,
                                              order_carrier_ratings:
                                                res.data.order
                                                  .order_carrier_ratings,
                                            });

                                            props.setSelectedOrder({
                                              ...selected_order,
                                              order_customer_ratings:
                                                res.data.order
                                                  .order_customer_ratings,
                                              order_carrier_ratings:
                                                res.data.order
                                                  .order_carrier_ratings,
                                              component_id: props.componentId,
                                            });
                                          }
                                        })
                                        .catch((e) => {
                                          setMileageLoaderVisible(false);
                                          console.log(
                                            "error on saving order miles",
                                            e
                                          );
                                        });
                                    }
                                  }
                                } else {
                                  // GUARDAR ORDEN CON MILES = 0;
                                  selected_order.miles = 0;
                                  setSelectedOrder(selected_order);
                                  setMileageLoaderVisible(false);

                                  axios
                                    .post(
                                      props.serverUrl + "/saveOrder",
                                      selected_order
                                    )
                                    .then(async (res) => {
                                      if (res.data.result === "OK") {
                                        setSelectedOrder({
                                          ...selected_order,
                                          order_customer_ratings:
                                            res.data.order.order_customer_ratings,
                                          order_carrier_ratings:
                                            res.data.order.order_carrier_ratings,
                                        });

                                        props.setSelectedOrder({
                                          ...selected_order,
                                          order_customer_ratings:
                                            res.data.order.order_customer_ratings,
                                          order_carrier_ratings:
                                            res.data.order.order_carrier_ratings,
                                          component_id: props.componentId,
                                        });
                                      }
                                    })
                                    .catch((e) => {
                                      setMileageLoaderVisible(false);
                                      console.log(
                                        "error on saving order miles",
                                        e
                                      );
                                    });
                                }
                              } else {
                                console.log(res.data);
                                setMileageLoaderVisible(false);
                              }
                            })
                            .catch((e) => {
                              setMileageLoaderVisible(false);
                              console.log("error on removing order pickup", e);
                            });
                        }}
                      >
                        <span className="fas fa-times"></span>
                      </div>
                    </SwiperSlide>
                  );
                }
              })}

              {(selectedOrder?.pickups || []).find((p) => p.id === 0) ===
                undefined && (
                  <SwiperSlide
                    className="order-pickup adding"
                    title="Add new pickup"
                    onClick={() => {
                      // if ((selectedOrder?.id || 0) === 0) {
                      //     window.alert('You must create or load an order first!');
                      //     setSelectedShipperCustomer({});
                      //     setSelectedShipperCustomerContact({});
                      //     return;
                      // }

                      let pickups = selectedOrder?.pickups || [];
                      pickups.push({ id: 0 });
                      setSelectedShipperCustomer({ id: 0, pickup_id: 0 });
                      setSelectedShipperCustomerContact({});
                      setSelectedOrder({ ...selectedOrder, pickups: pickups });

                      refShipperCompanyCode.current.focus();
                    }}
                  >
                    <div>
                      <span className="fas fa-plus"></span>
                    </div>
                  </SwiperSlide>
                )}
            </Swiper>

            <div className="swiper-pickup-next-btn">
              <span className="fas fa-chevron-right"></span>
            </div>
          </div>

          <div className="form-h-sep"></div>
          <div
            className="mochi-button"
            onClick={() => {
              if ((selectedOrder?.id || 0) === 0) {
                window.alert("You must create or load an order first!");
                return;
              }

              let panel = {
                panelName: `${props.panelName}-routing`,
                component: (
                  <Routing
                    panelName={`${props.panelName}-routing`}
                    title="Routing"
                    tabTimes={39000 + props.tabTimes}
                    origin={props.origin}
                    openPanel={props.openPanel}
                    closePanel={props.closePanel}
                    componentId={moment().format("x")}
                    selectedOrder={selectedOrder}
                  />
                ),
              };

              props.openPanel(panel, props.origin);
            }}
          >
            <div className="mochi-button-decorator mochi-button-decorator-left">
              (
            </div>
            <div className="mochi-button-base">Routing</div>
            <div className="mochi-button-decorator mochi-button-decorator-right">
              )
            </div>
          </div>
          <div className="form-h-sep"></div>
          <div
            className="deliveries-container"
            style={{ display: "flex", flexDirection: "row" }}
          >
            <div className="swiper-delivery-prev-btn">
              <span className="fas fa-chevron-left"></span>
            </div>

            <Swiper
              slidesPerView={5}
              navigation={{
                prevEl: ".swiper-delivery-prev-btn",
                nextEl: ".swiper-delivery-next-btn",
              }}
            >
              {[
                ...getDeliveriesOnRouting(),
                ...(selectedOrder?.deliveries || []).filter(
                  (d) =>
                    (selectedOrder?.routing || []).find(
                      (r) => r.delivery_id === d.id
                    ) === undefined
                ),
              ].map((delivery, index) => {
                if (delivery === undefined) {
                  return "";
                } else {
                  let fulDateTime1 =
                    (delivery.delivery_date1 || "") +
                    " " +
                    (delivery.delivery_time1 || "");
                  let fulDateTime2 =
                    (delivery.delivery_date2 || "") +
                    " " +
                    (delivery.delivery_time2 || "");
                  let deliveryDateTime = undefined;
                  let statusClass = "active";
                  let curDateTime = currentSystemDateTime;

                  if (
                    moment(fulDateTime2, "MM/DD/YYYY HHmm").format(
                      "MM/DD/YYYY HHmm"
                    ) === fulDateTime2
                  ) {
                    deliveryDateTime = moment(fulDateTime2, "MM/DD/YYYY HHmm");
                  } else if (
                    moment(fulDateTime1, "MM/DD/YYYY HHmm").format(
                      "MM/DD/YYYY HHmm"
                    ) === fulDateTime1
                  ) {
                    deliveryDateTime = moment(fulDateTime1, "MM/DD/YYYY HHmm");
                  }

                  if (deliveryDateTime !== undefined) {
                    let pastHour = deliveryDateTime.clone().subtract(1, "hours");

                    if (curDateTime < pastHour) {
                      statusClass = "active";
                    } else if (
                      curDateTime >= pastHour &&
                      curDateTime <= deliveryDateTime
                    ) {
                      statusClass = "warning";
                    } else {
                      statusClass = "expired";
                    }

                    if ((selectedOrder?.events || []).length > 0) {
                      selectedOrder.events.map((item) => {
                        if (
                          (item.event_type?.name || "").toLowerCase() ===
                          "delivered" &&
                          item.consignee_id === delivery.customer_id
                        ) {
                          curDateTime = moment(
                            item.event_date + " " + item.event_time,
                            "MM/DD/YYYY HHmm"
                          );

                          if (curDateTime <= deliveryDateTime) {
                            statusClass = "active";
                          } else {
                            statusClass = "expired";
                          }
                        }
                        return true;
                      });
                    }
                  }

                  let classes = classnames({
                    "order-delivery": true,
                    selected:
                      selectedConsigneeCustomer?.delivery_id === delivery.id,
                    active: statusClass === "active",
                    warning: statusClass === "warning",
                    expired: statusClass === "expired",
                    unsaved: delivery.id === 0,
                  });

                  return (
                    <SwiperSlide
                      className={classes}
                      key={index}
                      onClick={() => {
                        setSelectedConsigneeCustomer({
                          ...delivery.customer,
                          delivery_id: delivery.id,
                          delivery_date1: delivery.delivery_date1,
                          delivery_date2: delivery.delivery_date2,
                          delivery_time1: delivery.delivery_time1,
                          delivery_time2: delivery.delivery_time2,
                          special_instructions: delivery.special_instructions,
                          type: delivery.type,
                        });

                        setSelectedConsigneeCustomerContact(
                          (delivery.customer?.contacts || []).find(
                            (c) => c.is_primary === 1
                          ) || {}
                        );

                        refConsigneeCompanyCode.current.focus();
                      }}
                    >
                      <div>Delivery {index + 1}</div>
                      <div
                        className="delivery-remove-btn"
                        title="Remove this delivery"
                        onClick={async (e) => {
                          e.stopPropagation();

                          let selected_order = JSON.parse(
                            JSON.stringify(selectedOrder)
                          );

                          selected_order.deliveries = (
                            selected_order?.deliveries || []
                          ).filter((del, i) => {
                            return del.id !== delivery.id;
                          });

                          await setSelectedOrder(selected_order);

                          if (selected_order.deliveries.length > 0) {
                            await setSelectedConsigneeCustomer({
                              ...(selected_order.deliveries[0].customer || {}),
                              ...selected_order.deliveries[0],
                              customer: {},
                              delivery_id: selected_order.deliveries[0].id,
                            });

                            await setSelectedConsigneeCustomerContact(
                              (
                                selected_order.deliveries[0].customer?.contacts ||
                                []
                              ).find((c) => c.is_primary === 1) || {}
                            );
                          } else {
                            await setSelectedConsigneeCustomer({});
                            await setSelectedConsigneeCustomerContact({});
                          }

                          await axios
                            .post(props.serverUrl + "/removeOrderDelivery", {
                              id: delivery.id,
                              order_id: selected_order?.id || 0,
                            })
                            .then((res) => {
                              if (res.data.result === "OK") {
                                selected_order = res.data.order;

                                // validar routing
                                // 1. VALIDAR PICKUPS AND DELIVERIES = 1
                                if (
                                  (selected_order?.pickups || []).length > 0 &&
                                  selected_order.deliveries.length > 0
                                ) {
                                  if (
                                    selected_order.pickups.length === 1 &&
                                    selected_order.deliveries.length === 1
                                  ) {
                                    let routing = [
                                      {
                                        order_id: selected_order?.id || 0,
                                        pickup_id: selected_order.pickups[0].id,
                                        delivery_id: null,
                                        type: "pickup",
                                      },
                                      {
                                        order_id: selected_order?.id || 0,
                                        pickup_id: null,
                                        delivery_id:
                                          selected_order.deliveries[0].id,
                                        type: "delivery",
                                      },
                                    ];

                                    axios
                                      .post(
                                        props.serverUrl + "/saveOrderRouting",
                                        {
                                          order_id: selected_order?.id || 0,
                                          routing: routing,
                                        }
                                      )
                                      .then((res) => {
                                        if (res.data.result === "OK") {
                                          selected_order = res.data.order;
                                          setSelectedOrder(selected_order);

                                          setMileageLoaderVisible(true);

                                          let params = {
                                            mode: "fastest;car;traffic:disabled",
                                            routeAttributes: "summary",
                                          };

                                          let waypointCount = 0;

                                          selected_order.routing.map(
                                            (item, i) => {
                                              if (item.type === "pickup") {
                                                selected_order.pickups.map(
                                                  (p, i) => {
                                                    if (p.id === item.pickup_id) {
                                                      if (
                                                        (p.customer?.zip_data ||
                                                          "") !== ""
                                                      ) {
                                                        params[
                                                          "waypoint" +
                                                          waypointCount
                                                        ] =
                                                          "geo!" +
                                                          p.customer.zip_data.latitude.toString() +
                                                          "," +
                                                          p.customer.zip_data.longitude.toString();
                                                        waypointCount += 1;
                                                      }
                                                    }
                                                    return false;
                                                  }
                                                );
                                              } else {
                                                selected_order.deliveries.map(
                                                  (d, i) => {
                                                    if (
                                                      d.id === item.delivery_id
                                                    ) {
                                                      if (
                                                        (d.customer?.zip_data ||
                                                          "") !== ""
                                                      ) {
                                                        params[
                                                          "waypoint" +
                                                          waypointCount
                                                        ] =
                                                          "geo!" +
                                                          d.customer.zip_data.latitude.toString() +
                                                          "," +
                                                          d.customer.zip_data.longitude.toString();
                                                        waypointCount += 1;
                                                      }
                                                    }
                                                    return false;
                                                  }
                                                );
                                              }

                                              return true;
                                            }
                                          );

                                          routingService.calculateRoute(
                                            params,
                                            (result) => {
                                              let miles =
                                                result.response.route[0].summary
                                                  .distance || 0;

                                              selected_order.miles = miles;

                                              setSelectedOrder(selected_order);
                                              setMileageLoaderVisible(false);

                                              axios
                                                .post(
                                                  props.serverUrl + "/saveOrder",
                                                  selected_order
                                                )
                                                .then(async (res) => {
                                                  if (res.data.result === "OK") {
                                                    setSelectedOrder({
                                                      ...selected_order,
                                                      order_customer_ratings:
                                                        res.data.order
                                                          .order_customer_ratings,
                                                      order_carrier_ratings:
                                                        res.data.order
                                                          .order_carrier_ratings,
                                                    });

                                                    props.setSelectedOrder({
                                                      ...selected_order,
                                                      order_customer_ratings:
                                                        res.data.order
                                                          .order_customer_ratings,
                                                      order_carrier_ratings:
                                                        res.data.order
                                                          .order_carrier_ratings,
                                                      component_id:
                                                        props.componentId,
                                                    });
                                                  }
                                                })
                                                .catch((e) => {
                                                  console.log(
                                                    "error on saving order miles",
                                                    e
                                                  );
                                                  setMileageLoaderVisible(false);
                                                });
                                            },
                                            (error) => {
                                              console.log(
                                                "error getting mileage",
                                                error
                                              );
                                              selected_order.miles = 0;

                                              setSelectedOrder(selected_order);
                                              setMileageLoaderVisible(false);

                                              axios
                                                .post(
                                                  props.serverUrl + "/saveOrder",
                                                  selected_order
                                                )
                                                .then(async (res) => {
                                                  if (res.data.result === "OK") {
                                                    setSelectedOrder({
                                                      ...selected_order,
                                                      order_customer_ratings:
                                                        res.data.order
                                                          .order_customer_ratings,
                                                      order_carrier_ratings:
                                                        res.data.order
                                                          .order_carrier_ratings,
                                                    });

                                                    props.setSelectedOrder({
                                                      ...selected_order,
                                                      order_customer_ratings:
                                                        res.data.order
                                                          .order_customer_ratings,
                                                      order_carrier_ratings:
                                                        res.data.order
                                                          .order_carrier_ratings,
                                                      component_id:
                                                        props.componentId,
                                                    });
                                                  }
                                                })
                                                .catch((e) => {
                                                  console.log(
                                                    "error on saving order miles",
                                                    e
                                                  );
                                                  setMileageLoaderVisible(false);
                                                });
                                            }
                                          );
                                        } else {
                                          console.log(res.data.result);

                                          selected_order.miles = 0;
                                          setSelectedOrder(selected_order);
                                          setMileageLoaderVisible(false);

                                          axios
                                            .post(
                                              props.serverUrl + "/saveOrder",
                                              selected_order
                                            )
                                            .then(async (res) => {
                                              if (res.data.result === "OK") {
                                                setSelectedOrder({
                                                  ...selected_order,
                                                  order_customer_ratings:
                                                    res.data.order
                                                      .order_customer_ratings,
                                                  order_carrier_ratings:
                                                    res.data.order
                                                      .order_carrier_ratings,
                                                });

                                                props.setSelectedOrder({
                                                  ...selected_order,
                                                  order_customer_ratings:
                                                    res.data.order
                                                      .order_customer_ratings,
                                                  order_carrier_ratings:
                                                    res.data.order
                                                      .order_carrier_ratings,
                                                  component_id: props.componentId,
                                                });
                                              }
                                            })
                                            .catch((e) => {
                                              console.log(
                                                "error on saving order miles",
                                                e
                                              );
                                              setMileageLoaderVisible(false);
                                            });
                                        }
                                      })
                                      .catch((e) => {
                                        setMileageLoaderVisible(false);
                                        console.log(
                                          "error saving order miles",
                                          e
                                        );
                                      });
                                  } else {
                                    if (selected_order.routing.length >= 2) {
                                      setMileageLoaderVisible(true);

                                      let params = {
                                        mode: "fastest;car;traffic:disabled",
                                        routeAttributes: "summary",
                                      };

                                      let waypointCount = 0;

                                      selected_order.routing.map((item, i) => {
                                        if (item.type === "pickup") {
                                          selected_order.pickups.map((p, i) => {
                                            if (p.id === item.pickup_id) {
                                              if (
                                                (p.customer?.zip_data || "") !==
                                                ""
                                              ) {
                                                params[
                                                  "waypoint" + waypointCount
                                                ] =
                                                  "geo!" +
                                                  p.customer.zip_data.latitude.toString() +
                                                  "," +
                                                  p.customer.zip_data.longitude.toString();
                                                waypointCount += 1;
                                              }
                                            }
                                            return false;
                                          });
                                        } else {
                                          selected_order.deliveries.map(
                                            (d, i) => {
                                              if (d.id === item.delivery_id) {
                                                if (
                                                  (d.customer?.zip_data || "") !==
                                                  ""
                                                ) {
                                                  params[
                                                    "waypoint" + waypointCount
                                                  ] =
                                                    "geo!" +
                                                    d.customer.zip_data.latitude.toString() +
                                                    "," +
                                                    d.customer.zip_data.longitude.toString();
                                                  waypointCount += 1;
                                                }
                                              }
                                              return false;
                                            }
                                          );
                                        }

                                        return true;
                                      });

                                      routingService.calculateRoute(
                                        params,
                                        (result) => {
                                          let miles =
                                            result.response.route[0].summary
                                              .distance || 0;
                                          selected_order.miles = miles;

                                          setSelectedOrder(selected_order);
                                          setMileageLoaderVisible(false);

                                          axios
                                            .post(
                                              props.serverUrl + "/saveOrder",
                                              selected_order
                                            )
                                            .then(async (res) => {
                                              if (res.data.result === "OK") {
                                                setSelectedOrder({
                                                  ...selected_order,
                                                  order_customer_ratings:
                                                    res.data.order
                                                      .order_customer_ratings,
                                                  order_carrier_ratings:
                                                    res.data.order
                                                      .order_carrier_ratings,
                                                });

                                                props.setSelectedOrder({
                                                  ...selected_order,
                                                  order_customer_ratings:
                                                    res.data.order
                                                      .order_customer_ratings,
                                                  order_carrier_ratings:
                                                    res.data.order
                                                      .order_carrier_ratings,
                                                  component_id: props.componentId,
                                                });
                                              }
                                            })
                                            .catch((e) => {
                                              console.log(
                                                "error on saving order miles",
                                                e
                                              );
                                              setMileageLoaderVisible(false);
                                            });
                                        },
                                        (error) => {
                                          console.log(
                                            "error getting mileage",
                                            error
                                          );
                                          selected_order.miles = 0;
                                          setSelectedOrder(selected_order);
                                          setMileageLoaderVisible(false);

                                          axios
                                            .post(
                                              props.serverUrl + "/saveOrder",
                                              selected_order
                                            )
                                            .then(async (res) => {
                                              if (res.data.result === "OK") {
                                                setSelectedOrder({
                                                  ...selected_order,
                                                  order_customer_ratings:
                                                    res.data.order
                                                      .order_customer_ratings,
                                                  order_carrier_ratings:
                                                    res.data.order
                                                      .order_carrier_ratings,
                                                });

                                                props.setSelectedOrder({
                                                  ...selected_order,
                                                  order_customer_ratings:
                                                    res.data.order
                                                      .order_customer_ratings,
                                                  order_carrier_ratings:
                                                    res.data.order
                                                      .order_carrier_ratings,
                                                  component_id: props.componentId,
                                                });
                                              }
                                            })
                                            .catch((e) => {
                                              console.log(
                                                "error on saving order miles",
                                                e
                                              );
                                              setMileageLoaderVisible(false);
                                            });
                                        }
                                      );
                                    } else {
                                      selected_order.miles = 0;
                                      setSelectedOrder(selected_order);
                                      setMileageLoaderVisible(false);

                                      axios
                                        .post(
                                          props.serverUrl + "/saveOrder",
                                          selected_order
                                        )
                                        .then(async (res) => {
                                          if (res.data.result === "OK") {
                                            props.setSelectedOrder({
                                              ...selected_order,
                                              order_customer_ratings:
                                                res.data.order
                                                  .order_customer_ratings,
                                              order_carrier_ratings:
                                                res.data.order
                                                  .order_carrier_ratings,
                                              component_id: props.componentId,
                                            });
                                          }
                                        })
                                        .catch((e) => {
                                          console.log(
                                            "error on saving order miles",
                                            e
                                          );
                                          setMileageLoaderVisible(false);
                                        });
                                    }
                                  }
                                } else {
                                  // GUARDAR ORDEN CON MILES = 0;
                                  selected_order.miles = 0;
                                  setSelectedOrder(selected_order);
                                  setMileageLoaderVisible(false);

                                  axios
                                    .post(
                                      props.serverUrl + "/saveOrder",
                                      selected_order
                                    )
                                    .then(async (res) => {
                                      if (res.data.result === "OK") {
                                        props.setSelectedOrder({
                                          ...selected_order,
                                          order_customer_ratings:
                                            res.data.order.order_customer_ratings,
                                          order_carrier_ratings:
                                            res.data.order.order_carrier_ratings,
                                          component_id: props.componentId,
                                        });
                                      }
                                    })
                                    .catch((e) => {
                                      console.log(
                                        "error on saving order miles",
                                        e
                                      );
                                      setMileageLoaderVisible(false);
                                    });
                                }
                              } else {
                                console.log(res.data);
                              }
                            })
                            .catch((e) => {
                              setMileageLoaderVisible(false);
                              console.log("error on removing order delivery", e);
                            });
                        }}
                      >
                        <span className="fas fa-times"></span>
                      </div>
                    </SwiperSlide>
                  );
                }
              })}

              {(selectedOrder?.deliveries || []).find((d) => d.id === 0) ===
                undefined && (
                  <SwiperSlide
                    className="order-delivery adding"
                    title="Add new delivery"
                    onClick={() => {
                      if ((selectedOrder?.id || 0) === 0) {
                        window.alert("You must create or load an order first!");
                        setSelectedConsigneeCustomer({});
                        setSelectedConsigneeCustomerContact({});
                        return;
                      }

                      let deliveries = selectedOrder?.deliveries || [];
                      deliveries.push({ id: 0 });
                      setSelectedConsigneeCustomer({ id: 0, delivery_id: 0 });
                      setSelectedConsigneeCustomerContact({});
                      setSelectedOrder({
                        ...selectedOrder,
                        deliveries: deliveries,
                      });

                      refConsigneeCompanyCode.current.focus();
                    }}
                  >
                    <div>
                      <span className="fas fa-plus"></span>
                    </div>
                  </SwiperSlide>
                )}
            </Swiper>

            <div className="swiper-delivery-next-btn">
              <span className="fas fa-chevron-right"></span>
            </div>
          </div>
        </div>

        {
          (selectedOrder?.order_invoiced || 0) === 1 &&
          <div className="order-invoiced-btn" onClick={() => {
            let panel = {
              panelName: `${props.panelName}-invoice`,
              component: <Invoice
                pageName={'Invoice'}
                title={'Invoice'}
                panelName={'invoice'}
                tabTimes={5000 + props.tabTimes}
                screenFocused={props.invoiceScreenFocused}
                componentId={moment().format('x')}
                isOnPanel={true}
                origin={props.origin}
                openPanel={props.openPanel}
                closePanel={props.closePanel}
                order_id={(selectedOrder?.id || 0)}
              />
            }

            props.openPanel(panel, props.origin);
          }}>Invoiced</div>
        }

      </div>

      <div className="fields-container-row" style={{ marginTop: 10 }}>
        <div
          className="fields-container-col"
          style={{
            minWidth: "91%",
            maxWidth: "91%",
            display: "flex",
            flexDirection: "column",
            marginRight: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              marginBottom: 10,
              flexGrow: 1,
              flexBasis: "100%",
            }}
          >
            <div
              className="form-bordered-box"
              style={{
                minWidth: "38%",
                maxWidth: "38%",
                marginRight: 10,
                height: "9rem",
                position: "relative",
              }}
            >
              <div className="form-header">
                <div className="top-border top-border-left"></div>
                <div className="form-title">Shipper</div>
                <div className="top-border top-border-middle"></div>
                <div className="form-buttons">
                  <div className="mochi-button" onClick={shipperCompanySearch}>
                    <div className="mochi-button-decorator mochi-button-decorator-left">
                      (
                    </div>
                    <div className="mochi-button-base">Search</div>
                    <div className="mochi-button-decorator mochi-button-decorator-right">
                      )
                    </div>
                  </div>

                  <div
                    className="mochi-button"
                    onClick={() => {
                      if ((selectedShipperCustomer.id || 0) === 0) {
                        window.alert("You must select a customer first!");
                        return;
                      }

                      let panel = {
                        panelName: `${props.panelName}-customer`,
                        component: (
                          <Customers
                            pageName={"Customer"}
                            title={"Shipper Company"}
                            panelName={`${props.panelName}-customer`}
                            tabTimes={3000 + props.tabTimes}
                            componentId={moment().format("x")}
                            isOnPanel={true}
                            origin={props.origin}
                            openPanel={props.openPanel}
                            closePanel={props.closePanel}
                            customer_id={selectedShipperCustomer.id}
                          />
                        ),
                      };

                      props.openPanel(panel, props.origin);
                    }}
                  >
                    <div className="mochi-button-decorator mochi-button-decorator-left">
                      (
                    </div>
                    <div className="mochi-button-base">Company info</div>
                    <div className="mochi-button-decorator mochi-button-decorator-right">
                      )
                    </div>
                  </div>
                  {isShowingShipperSecondPage && (
                    <div
                      className="mochi-button"
                      onClick={() => {
                        setIsShowingShipperSecondPage(false);
                      }}
                    >
                      <div className="mochi-button-decorator mochi-button-decorator-left">
                        (
                      </div>
                      <div className="mochi-button-base">1st Page</div>
                      <div className="mochi-button-decorator mochi-button-decorator-right">
                        )
                      </div>
                    </div>
                  )}
                  {!isShowingShipperSecondPage && (
                    <div
                      className="mochi-button"
                      onClick={() => {
                        setIsShowingShipperSecondPage(true);
                      }}
                    >
                      <div className="mochi-button-decorator mochi-button-decorator-left">
                        (
                      </div>
                      <div className="mochi-button-base">2nd Page</div>
                      <div className="mochi-button-decorator mochi-button-decorator-right">
                        )
                      </div>
                    </div>
                  )}
                </div>
                <div className="top-border top-border-right"></div>
              </div>

              <div
                className="form-wrapper"
                style={{ overflowX: "hidden", overflowY: "visible" }}
              >
                <div className="form-row">
                  <div className="input-box-container input-code">
                    <input
                      tabIndex={16 + props.tabTimes}
                      type="text"
                      placeholder="Code"
                      maxLength="8"
                      ref={refShipperCompanyCode}
                      onKeyDown={getShipperCompanyByCode}
                      onInput={(e) => {
                        if ((selectedShipperCustomer?.id || 0) === 0) {
                          if (
                            (selectedOrder?.pickups || []).find(
                              (p) => p.id === 0
                            ) === undefined
                          ) {
                            setSelectedOrder({
                              ...selectedOrder,
                              pickups: [
                                ...(selectedOrder?.pickups || []),
                                {
                                  id: 0,
                                  customer: {
                                    id: 0,
                                    code: e.target.value.toUpperCase(),
                                  },
                                },
                              ],
                            });
                          } else {
                            setSelectedOrder({
                              ...selectedOrder,
                              pickups: (selectedOrder?.pickups || []).map(
                                (p, i) => {
                                  if (p.id === 0) {
                                    p.customer = {
                                      ...p.customer,
                                      code: e.target.value.toUpperCase(),
                                    };
                                  }
                                  return p;
                                }
                              ),
                            });
                          }

                          setSelectedShipperCustomer({
                            ...selectedShipperCustomer,
                            code: e.target.value.toUpperCase(),
                            code_number: 0,
                          });
                        } else {
                          setSelectedOrder({
                            ...selectedOrder,
                            pickups: (selectedOrder?.pickups || []).map(
                              (p, i) => {
                                if (p.id === selectedShipperCustomer?.id) {
                                  p.customer = {
                                    ...p.customer,
                                    code: e.target.value.toUpperCase(),
                                  };
                                }
                                return p;
                              }
                            ),
                          });

                          setSelectedShipperCustomer({
                            ...selectedShipperCustomer,
                            code: e.target.value.toUpperCase(),
                            code_number: 0,
                          });
                        }
                      }}
                      onChange={(e) => {
                        if ((selectedShipperCustomer?.id || 0) === 0) {
                          if (
                            (selectedOrder?.pickups || []).find(
                              (p) => p.id === 0
                            ) === undefined
                          ) {
                            setSelectedOrder({
                              ...selectedOrder,
                              pickups: [
                                ...(selectedOrder?.pickups || []),
                                {
                                  id: 0,
                                  customer: {
                                    id: 0,
                                    code: e.target.value.toUpperCase(),
                                  },
                                },
                              ],
                            });
                          } else {
                            setSelectedOrder({
                              ...selectedOrder,
                              pickups: (selectedOrder?.pickups || []).map(
                                (p, i) => {
                                  if (p.id === 0) {
                                    p.customer = {
                                      ...p.customer,
                                      code: e.target.value.toUpperCase(),
                                    };
                                  }
                                  return p;
                                }
                              ),
                            });
                          }

                          setSelectedShipperCustomer({
                            ...selectedShipperCustomer,
                            code: e.target.value.toUpperCase(),
                            code_number: 0,
                          });
                        } else {
                          setSelectedOrder({
                            ...selectedOrder,
                            pickups: (selectedOrder?.pickups || []).map(
                              (p, i) => {
                                if (p.id === selectedShipperCustomer?.id) {
                                  p.customer = {
                                    ...p.customer,
                                    code: e.target.value.toUpperCase(),
                                  };
                                }
                                return p;
                              }
                            ),
                          });

                          setSelectedShipperCustomer({
                            ...selectedShipperCustomer,
                            code: e.target.value.toUpperCase(),
                            code_number: 0,
                          });
                        }
                      }}
                      value={
                        (selectedShipperCustomer.code_number || 0) === 0
                          ? selectedShipperCustomer.code || ""
                          : selectedShipperCustomer.code +
                          selectedShipperCustomer.code_number
                      }
                    />
                  </div>
                  <div className="form-h-sep"></div>
                  <div className="input-box-container grow">
                    <input
                      tabIndex={17 + props.tabTimes}
                      type="text"
                      placeholder="Name"
                      // onKeyDown={validateShipperCompanyInfoForSaving}
                      onInput={(e) => {
                        if ((selectedShipperCustomer?.id || 0) === 0) {
                          if (
                            (selectedOrder?.pickups || []).find(
                              (p) => p.id === 0
                            ) === undefined
                          ) {
                            setSelectedOrder({
                              ...selectedOrder,
                              pickups: [
                                ...(selectedOrder?.pickups || []),
                                {
                                  id: 0,
                                  customer: {
                                    id: 0,
                                    name: e.target.value,
                                  },
                                },
                              ],
                            });
                          } else {
                            setSelectedOrder({
                              ...selectedOrder,
                              pickups: (selectedOrder?.pickups || []).map(
                                (p, i) => {
                                  if (p.id === 0) {
                                    p.customer = {
                                      ...p.customer,
                                      name: e.target.value,
                                    };
                                  }
                                  return p;
                                }
                              ),
                            });
                          }

                          setSelectedShipperCustomer({
                            ...selectedShipperCustomer,
                            id: 0,
                            name: e.target.value,
                          });
                        } else {
                          setSelectedOrder({
                            ...selectedOrder,
                            pickups: (selectedOrder?.pickups || []).map(
                              (p, i) => {
                                if (p.id === selectedShipperCustomer?.id) {
                                  p.customer = {
                                    ...p.customer,
                                    name: e.target.value,
                                  };
                                }
                                return p;
                              }
                            ),
                          });

                          setSelectedShipperCustomer({
                            ...selectedShipperCustomer,
                            name: e.target.value,
                          });
                        }
                      }}
                      onChange={(e) => {
                        if ((selectedShipperCustomer?.id || 0) === 0) {
                          if (
                            (selectedOrder?.pickups || []).find(
                              (p) => p.id === 0
                            ) === undefined
                          ) {
                            setSelectedOrder({
                              ...selectedOrder,
                              pickups: [
                                ...(selectedOrder?.pickups || []),
                                {
                                  id: 0,
                                  customer: {
                                    id: 0,
                                    name: e.target.value,
                                  },
                                },
                              ],
                            });
                          } else {
                            setSelectedOrder({
                              ...selectedOrder,
                              pickups: (selectedOrder?.pickups || []).map(
                                (p, i) => {
                                  if (p.id === 0) {
                                    p.customer = {
                                      ...p.customer,
                                      name: e.target.value,
                                    };
                                  }
                                  return p;
                                }
                              ),
                            });
                          }

                          setSelectedShipperCustomer({
                            ...selectedShipperCustomer,
                            id: 0,
                            name: e.target.value,
                          });
                        } else {
                          setSelectedOrder({
                            ...selectedOrder,
                            pickups: (selectedOrder?.pickups || []).map(
                              (p, i) => {
                                if (p.id === selectedShipperCustomer.id) {
                                  p.customer = {
                                    ...p.customer,
                                    name: e.target.value,
                                  };
                                }
                                return p;
                              }
                            ),
                          });

                          setSelectedShipperCustomer({
                            ...selectedShipperCustomer,
                            name: e.target.value,
                          });
                        }
                      }}
                      value={selectedShipperCustomer?.name || ""}
                    />
                  </div>
                </div>

                {shipperFirstPageTransition(
                  (style, item) =>
                    item && (
                      <animated.div
                        className="form-page first-page shipper-first-page"
                        style={{
                          ...style,
                        }}
                      >
                        <div className="form-row">
                          <div className="input-box-container grow">
                            <input
                              tabIndex={18 + props.tabTimes}
                              type="text"
                              placeholder="Address 1"
                              // onKeyDown={validateShipperCompanyInfoForSaving}
                              onInput={(e) => {
                                if ((selectedShipperCustomer?.id || 0) === 0) {
                                  if (
                                    (selectedOrder?.pickups || []).find(
                                      (p) => p.id === 0
                                    ) === undefined
                                  ) {
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      pickups: [
                                        ...(selectedOrder?.pickups || []),
                                        {
                                          id: 0,
                                          customer: {
                                            id: 0,
                                            address1: e.target.value,
                                          },
                                        },
                                      ],
                                    });
                                  } else {
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      pickups: (
                                        selectedOrder?.pickups || []
                                      ).map((p, i) => {
                                        if (p.id === 0) {
                                          p.customer = {
                                            ...p.customer,
                                            address1: e.target.value,
                                          };
                                        }
                                        return p;
                                      }),
                                    });
                                  }

                                  setSelectedShipperCustomer({
                                    ...selectedShipperCustomer,
                                    id: 0,
                                    address1: e.target.value,
                                  });
                                } else {
                                  setSelectedOrder({
                                    ...selectedOrder,
                                    pickups: (selectedOrder?.pickups || []).map(
                                      (p, i) => {
                                        if (
                                          p.id === selectedShipperCustomer?.id
                                        ) {
                                          p.customer = {
                                            ...p.customer,
                                            address1: e.target.value,
                                          };
                                        }
                                        return p;
                                      }
                                    ),
                                  });

                                  setSelectedShipperCustomer({
                                    ...selectedShipperCustomer,
                                    address1: e.target.value,
                                  });
                                }
                              }}
                              onChange={(e) => {
                                if ((selectedShipperCustomer?.id || 0) === 0) {
                                  if (
                                    (selectedOrder?.pickups || []).find(
                                      (p) => p.id === 0
                                    ) === undefined
                                  ) {
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      pickups: [
                                        ...(selectedOrder?.pickups || []),
                                        {
                                          id: 0,
                                          customer: {
                                            id: 0,
                                            address1: e.target.value,
                                          },
                                        },
                                      ],
                                    });
                                  } else {
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      pickups: (
                                        selectedOrder?.pickups || []
                                      ).map((p, i) => {
                                        if (p.id === 0) {
                                          p.customer = {
                                            ...p.customer,
                                            address1: e.target.value,
                                          };
                                        }
                                        return p;
                                      }),
                                    });
                                  }

                                  setSelectedShipperCustomer({
                                    ...selectedShipperCustomer,
                                    id: 0,
                                    address1: e.target.value,
                                  });
                                } else {
                                  setSelectedOrder({
                                    ...selectedOrder,
                                    pickups: (selectedOrder?.pickups || []).map(
                                      (p, i) => {
                                        if (p.id === 0) {
                                          p.customer = {
                                            ...p.customer,
                                            address1: e.target.value,
                                          };
                                        }
                                        return p;
                                      }
                                    ),
                                  });

                                  setSelectedShipperCustomer({
                                    ...selectedShipperCustomer,
                                    address1: e.target.value,
                                  });
                                }
                              }}
                              value={selectedShipperCustomer?.address1 || ""}
                            />
                          </div>
                        </div>

                        <div className="form-row">
                          <div className="input-box-container grow">
                            <input
                              tabIndex={19 + props.tabTimes}
                              type="text"
                              placeholder="Address 2"
                              // onKeyDown={validateShipperCompanyInfoForSaving}
                              onInput={(e) => {
                                if ((selectedShipperCustomer?.id || 0) === 0) {
                                  if (
                                    (selectedOrder?.pickups || []).find(
                                      (p) => p.id === 0
                                    ) === undefined
                                  ) {
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      pickups: [
                                        ...(selectedOrder?.pickups || []),
                                        {
                                          id: 0,
                                          customer: {
                                            id: 0,
                                            address2: e.target.value,
                                          },
                                        },
                                      ],
                                    });
                                  } else {
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      pickups: (
                                        selectedOrder?.pickups || []
                                      ).map((p, i) => {
                                        if (p.id === 0) {
                                          p.customer = {
                                            ...p.customer,
                                            address2: e.target.value,
                                          };
                                        }
                                        return p;
                                      }),
                                    });
                                  }

                                  setSelectedShipperCustomer({
                                    ...selectedShipperCustomer,
                                    id: 0,
                                    address2: e.target.value,
                                  });
                                } else {
                                  setSelectedOrder({
                                    ...selectedOrder,
                                    pickups: (selectedOrder?.pickups || []).map(
                                      (p, i) => {
                                        if (p.id === 0) {
                                          p.customer = {
                                            ...p.customer,
                                            address2: e.target.value,
                                          };
                                        }
                                        return p;
                                      }
                                    ),
                                  });

                                  setSelectedShipperCustomer({
                                    ...selectedShipperCustomer,
                                    address2: e.target.value,
                                  });
                                }
                              }}
                              onChange={(e) => {
                                if ((selectedShipperCustomer?.id || 0) === 0) {
                                  if (
                                    (selectedOrder?.pickups || []).find(
                                      (p) => p.id === 0
                                    ) === undefined
                                  ) {
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      pickups: [
                                        ...(selectedOrder?.pickups || []),
                                        {
                                          id: 0,
                                          customer: {
                                            id: 0,
                                            address2: e.target.value,
                                          },
                                        },
                                      ],
                                    });
                                  } else {
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      pickups: (
                                        selectedOrder?.pickups || []
                                      ).map((p, i) => {
                                        if (p.id === 0) {
                                          p.customer = {
                                            ...p.customer,
                                            address2: e.target.value,
                                          };
                                        }
                                        return p;
                                      }),
                                    });
                                  }

                                  setSelectedShipperCustomer({
                                    ...selectedShipperCustomer,
                                    id: 0,
                                    address2: e.target.value,
                                  });
                                } else {
                                  setSelectedOrder({
                                    ...selectedOrder,
                                    pickups: (selectedOrder?.pickups || []).map(
                                      (p, i) => {
                                        if (p.id === 0) {
                                          p.customer = {
                                            ...p.customer,
                                            address2: e.target.value,
                                          };
                                        }
                                        return p;
                                      }
                                    ),
                                  });

                                  setSelectedShipperCustomer({
                                    ...selectedShipperCustomer,
                                    address2: e.target.value,
                                  });
                                }
                              }}
                              value={selectedShipperCustomer?.address2 || ""}
                            />
                          </div>
                        </div>

                        <div className="form-row">
                          <div className="input-box-container grow">
                            <input
                              tabIndex={20 + props.tabTimes}
                              type="text"
                              placeholder="City"
                              // onKeyDown={validateShipperCompanyInfoForSaving}
                              onInput={(e) => {
                                if ((selectedShipperCustomer?.id || 0) === 0) {
                                  if (
                                    (selectedOrder?.pickups || []).find(
                                      (p) => p.id === 0
                                    ) === undefined
                                  ) {
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      pickups: [
                                        ...(selectedOrder?.pickups || []),
                                        {
                                          id: 0,
                                          customer: {
                                            id: 0,
                                            city: e.target.value,
                                          },
                                        },
                                      ],
                                    });
                                  } else {
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      pickups: (
                                        selectedOrder?.pickups || []
                                      ).map((p, i) => {
                                        if (p.id === 0) {
                                          p.customer = {
                                            ...p.customer,
                                            city: e.target.value,
                                          };
                                        }
                                        return p;
                                      }),
                                    });
                                  }

                                  setSelectedShipperCustomer({
                                    ...selectedShipperCustomer,
                                    id: 0,
                                    city: e.target.value,
                                  });
                                } else {
                                  setSelectedOrder({
                                    ...selectedOrder,
                                    pickups: (selectedOrder?.pickups || []).map(
                                      (p, i) => {
                                        if (p.id === 0) {
                                          p.customer = {
                                            ...p.customer,
                                            city: e.target.value,
                                          };
                                        }
                                        return p;
                                      }
                                    ),
                                  });

                                  setSelectedShipperCustomer({
                                    ...selectedShipperCustomer,
                                    city: e.target.value,
                                  });
                                }
                              }}
                              onChange={(e) => {
                                if ((selectedShipperCustomer?.id || 0) === 0) {
                                  if (
                                    (selectedOrder?.pickups || []).find(
                                      (p) => p.id === 0
                                    ) === undefined
                                  ) {
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      pickups: [
                                        ...(selectedOrder?.pickups || []),
                                        {
                                          id: 0,
                                          customer: {
                                            id: 0,
                                            city: e.target.value,
                                          },
                                        },
                                      ],
                                    });
                                  } else {
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      pickups: (
                                        selectedOrder?.pickups || []
                                      ).map((p, i) => {
                                        if (p.id === 0) {
                                          p.customer = {
                                            ...p.customer,
                                            city: e.target.value,
                                          };
                                        }
                                        return p;
                                      }),
                                    });
                                  }

                                  setSelectedShipperCustomer({
                                    ...selectedShipperCustomer,
                                    id: 0,
                                    city: e.target.value,
                                  });
                                } else {
                                  setSelectedOrder({
                                    ...selectedOrder,
                                    pickups: (selectedOrder?.pickups || []).map(
                                      (p, i) => {
                                        if (p.id === 0) {
                                          p.customer = {
                                            ...p.customer,
                                            city: e.target.value,
                                          };
                                        }
                                        return p;
                                      }
                                    ),
                                  });

                                  setSelectedShipperCustomer({
                                    ...selectedShipperCustomer,
                                    city: e.target.value,
                                  });
                                }
                              }}
                              value={selectedShipperCustomer?.city || ""}
                            />
                          </div>
                          <div className="form-h-sep"></div>
                          <div className="input-box-container input-state">
                            <input
                              tabIndex={21 + props.tabTimes}
                              type="text"
                              placeholder="State"
                              maxLength="2"
                              // onKeyDown={validateShipperCompanyInfoForSaving}
                              onInput={(e) => {
                                if ((selectedShipperCustomer?.id || 0) === 0) {
                                  if (
                                    (selectedOrder?.pickups || []).find(
                                      (p) => p.id === 0
                                    ) === undefined
                                  ) {
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      pickups: [
                                        ...(selectedOrder?.pickups || []),
                                        {
                                          id: 0,
                                          customer: {
                                            id: 0,
                                            state: e.target.value.toUpperCase(),
                                          },
                                        },
                                      ],
                                    });
                                  } else {
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      pickups: (
                                        selectedOrder?.pickups || []
                                      ).map((p, i) => {
                                        if (p.id === 0) {
                                          p.customer = {
                                            ...p.customer,
                                            state: e.target.value.toUpperCase(),
                                          };
                                        }
                                        return p;
                                      }),
                                    });
                                  }

                                  setSelectedShipperCustomer({
                                    ...selectedShipperCustomer,
                                    id: 0,
                                    state: e.target.value.toUpperCase(),
                                  });
                                } else {
                                  setSelectedOrder({
                                    ...selectedOrder,
                                    pickups: (selectedOrder?.pickups || []).map(
                                      (p, i) => {
                                        if (p.id === 0) {
                                          p.customer = {
                                            ...p.customer,
                                            state: e.target.value.toUpperCase(),
                                          };
                                        }
                                        return p;
                                      }
                                    ),
                                  });

                                  setSelectedShipperCustomer({
                                    ...selectedShipperCustomer,
                                    state: e.target.value.toUpperCase(),
                                  });
                                }
                              }}
                              onChange={(e) => {
                                if ((selectedShipperCustomer?.id || 0) === 0) {
                                  if (
                                    (selectedOrder?.pickups || []).find(
                                      (p) => p.id === 0
                                    ) === undefined
                                  ) {
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      pickups: [
                                        ...(selectedOrder?.pickups || []),
                                        {
                                          id: 0,
                                          customer: {
                                            id: 0,
                                            state: e.target.value.toUpperCase(),
                                          },
                                        },
                                      ],
                                    });
                                  } else {
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      pickups: (
                                        selectedOrder?.pickups || []
                                      ).map((p, i) => {
                                        if (p.id === 0) {
                                          p.customer = {
                                            ...p.customer,
                                            state: e.target.value.toUpperCase(),
                                          };
                                        }
                                        return p;
                                      }),
                                    });
                                  }

                                  setSelectedShipperCustomer({
                                    ...selectedShipperCustomer,
                                    id: 0,
                                    state: e.target.value.toUpperCase(),
                                  });
                                } else {
                                  setSelectedOrder({
                                    ...selectedOrder,
                                    pickups: (selectedOrder?.pickups || []).map(
                                      (p, i) => {
                                        if (p.id === 0) {
                                          p.customer = {
                                            ...p.customer,
                                            state: e.target.value.toUpperCase(),
                                          };
                                        }
                                        return p;
                                      }
                                    ),
                                  });

                                  setSelectedShipperCustomer({
                                    ...selectedShipperCustomer,
                                    state: e.target.value.toUpperCase(),
                                  });
                                }
                              }}
                              value={selectedShipperCustomer?.state || ""}
                            />
                          </div>
                          <div className="form-h-sep"></div>
                          <div className="input-box-container input-zip-code">
                            <input
                              tabIndex={22 + props.tabTimes}
                              type="text"
                              placeholder="Postal Code"
                              onKeyDown={validateShipperCompanyInfoForSaving}
                              onInput={(e) => {
                                if ((selectedShipperCustomer?.id || 0) === 0) {
                                  if (
                                    (selectedOrder?.pickups || []).find(
                                      (p) => p.id === 0
                                    ) === undefined
                                  ) {
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      pickups: [
                                        ...(selectedOrder?.pickups || []),
                                        {
                                          id: 0,
                                          customer: {
                                            id: 0,
                                            zip: e.target.value,
                                          },
                                        },
                                      ],
                                    });
                                  } else {
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      pickups: (
                                        selectedOrder?.pickups || []
                                      ).map((p, i) => {
                                        if (p.id === 0) {
                                          p.customer = {
                                            ...p.customer,
                                            zip: e.target.value,
                                          };
                                        }
                                        return p;
                                      }),
                                    });
                                  }

                                  setSelectedShipperCustomer({
                                    ...selectedShipperCustomer,
                                    id: 0,
                                    zip: e.target.value,
                                  });
                                } else {
                                  setSelectedOrder({
                                    ...selectedOrder,
                                    pickups: (selectedOrder?.pickups || []).map(
                                      (p, i) => {
                                        if (p.id === 0) {
                                          p.customer = {
                                            ...p.customer,
                                            zip: e.target.value,
                                          };
                                        }
                                        return p;
                                      }
                                    ),
                                  });

                                  setSelectedShipperCustomer({
                                    ...selectedShipperCustomer,
                                    zip: e.target.value,
                                  });
                                }
                              }}
                              onChange={(e) => {
                                if ((selectedShipperCustomer?.id || 0) === 0) {
                                  if (
                                    (selectedOrder?.pickups || []).find(
                                      (p) => p.id === 0
                                    ) === undefined
                                  ) {
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      pickups: [
                                        ...(selectedOrder?.pickups || []),
                                        {
                                          id: 0,
                                          customer: {
                                            id: 0,
                                            zip: e.target.value,
                                          },
                                        },
                                      ],
                                    });
                                  } else {
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      pickups: (
                                        selectedOrder?.pickups || []
                                      ).map((p, i) => {
                                        if (p.id === 0) {
                                          p.customer = {
                                            ...p.customer,
                                            zip: e.target.value,
                                          };
                                        }
                                        return p;
                                      }),
                                    });
                                  }

                                  setSelectedShipperCustomer({
                                    ...selectedShipperCustomer,
                                    id: 0,
                                    zip: e.target.value,
                                  });
                                } else {
                                  setSelectedOrder({
                                    ...selectedOrder,
                                    pickups: (selectedOrder?.pickups || []).map(
                                      (p, i) => {
                                        if (p.id === 0) {
                                          p.customer = {
                                            ...p.customer,
                                            zip: e.target.value,
                                          };
                                        }
                                        return p;
                                      }
                                    ),
                                  });

                                  setSelectedShipperCustomer({
                                    ...selectedShipperCustomer,
                                    zip: e.target.value,
                                  });
                                }
                              }}
                              value={selectedShipperCustomer?.zip || ""}
                            />
                          </div>
                        </div>

                        <div className="form-row">
                          <div className="input-box-container grow">
                            <input
                              tabIndex={23 + props.tabTimes}
                              type="text"
                              placeholder="Contact Name"
                              // onKeyDown={validateShipperCompanyContactForSaving}
                              onChange={(e) => {
                                if ((selectedShipperCustomer?.id || 0) === 0) {
                                  if (
                                    (selectedOrder?.pickups || []).find(
                                      (p) => p.id === 0
                                    ) === undefined
                                  ) {
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      pickups: [
                                        ...(selectedOrder?.pickups || []),
                                        {
                                          id: 0,
                                          customer: {
                                            contact_name: e.target.value,
                                          },
                                        },
                                      ],
                                    });
                                  } else {
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      pickups: (
                                        selectedOrder?.pickups || []
                                      ).map((p, i) => {
                                        if (p.id === 0) {
                                          p.customer = {
                                            ...p.customer,
                                            contact_name: e.target.value,
                                          };
                                        }
                                        return p;
                                      }),
                                    });
                                  }

                                  setSelectedShipperCustomer({
                                    ...selectedShipperCustomer,
                                    contact_name: e.target.value,
                                  });
                                } else {
                                  if (
                                    (selectedShipperCustomer?.contacts || [])
                                      .length === 0
                                  ) {
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      pickups: (
                                        selectedOrder?.pickups || []
                                      ).map((p, i) => {
                                        if (p.id === 0) {
                                          p.customer = {
                                            ...p.customer,
                                            contact_name: e.target.value,
                                          };
                                        }
                                        return p;
                                      }),
                                    });

                                    setSelectedShipperCustomer({
                                      ...selectedShipperCustomer,
                                      contact_name: e.target.value,
                                    });
                                  }
                                }
                              }}
                              onInput={(e) => {
                                if ((selectedShipperCustomer?.id || 0) === 0) {
                                  if (
                                    (selectedOrder?.pickups || []).find(
                                      (p) => p.id === 0
                                    ) === undefined
                                  ) {
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      pickups: [
                                        ...(selectedOrder?.pickups || []),
                                        {
                                          id: 0,
                                          customer: {
                                            contact_name: e.target.value,
                                          },
                                        },
                                      ],
                                    });
                                  } else {
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      pickups: (
                                        selectedOrder?.pickups || []
                                      ).map((p, i) => {
                                        if (p.id === 0) {
                                          p.customer = {
                                            ...p.customer,
                                            contact_name: e.target.value,
                                          };
                                        }
                                        return p;
                                      }),
                                    });
                                  }

                                  setSelectedShipperCustomer({
                                    ...selectedShipperCustomer,
                                    contact_name: e.target.value,
                                  });
                                } else {
                                  if (
                                    (selectedShipperCustomer?.contacts || [])
                                      .length === 0
                                  ) {
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      pickups: (
                                        selectedOrder?.pickups || []
                                      ).map((p, i) => {
                                        if (p.id === 0) {
                                          p.customer = {
                                            ...p.customer,
                                            contact_name: e.target.value,
                                          };
                                        }
                                        return p;
                                      }),
                                    });

                                    setSelectedShipperCustomer({
                                      ...selectedShipperCustomer,
                                      contact_name: e.target.value,
                                    });
                                  }
                                }
                              }}
                              value={
                                (selectedShipperCustomer?.contacts || []).find(
                                  (c) => c.is_primary === 1
                                ) === undefined
                                  ? selectedShipperCustomer?.contact_name || ""
                                  : selectedShipperCustomer?.contacts.find(
                                    (c) => c.is_primary === 1
                                  ).first_name +
                                  " " +
                                  selectedShipperCustomer?.contacts.find(
                                    (c) => c.is_primary === 1
                                  ).last_name
                              }
                            />
                          </div>
                          <div className="form-h-sep"></div>
                          <div
                            className="input-box-container input-phone"
                            style={{ position: "relative" }}
                          >
                            <MaskedInput
                              tabIndex={24 + props.tabTimes}
                              mask={[
                                /[0-9]/,
                                /\d/,
                                /\d/,
                                "-",
                                /\d/,
                                /\d/,
                                /\d/,
                                "-",
                                /\d/,
                                /\d/,
                                /\d/,
                                /\d/,
                              ]}
                              guide={true}
                              type="text"
                              placeholder="Contact Phone"
                              // onKeyDown={validateShipperCompanyContactForSaving}
                              onInput={(e) => {
                                if ((selectedShipperCustomer?.id || 0) === 0) {
                                  if (
                                    (selectedOrder?.pickups || []).find(
                                      (p) => p.id === 0
                                    ) === undefined
                                  ) {
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      pickups: [
                                        ...(selectedOrder?.pickups || []),
                                        {
                                          id: 0,
                                          customer: {
                                            contact_phone: e.target.value,
                                          },
                                        },
                                      ],
                                    });
                                  } else {
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      pickups: (
                                        selectedOrder?.pickups || []
                                      ).map((p, i) => {
                                        if (p.id === 0) {
                                          p.customer = {
                                            ...p.customer,
                                            contact_phone: e.target.value,
                                          };
                                        }
                                        return p;
                                      }),
                                    });
                                  }

                                  setSelectedShipperCustomer({
                                    ...selectedShipperCustomer,
                                    contact_phone: e.target.value,
                                  });
                                } else {
                                  if (
                                    (selectedShipperCustomer?.contacts || [])
                                      .length === 0
                                  ) {
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      pickups: (
                                        selectedOrder?.pickups || []
                                      ).map((p, i) => {
                                        if (p.id === 0) {
                                          p.customer = {
                                            ...p.customer,
                                            contact_phone: e.target.value,
                                          };
                                        }
                                        return p;
                                      }),
                                    });

                                    setSelectedShipperCustomer({
                                      ...selectedShipperCustomer,
                                      contact_phone: e.target.value,
                                    });
                                  }
                                }
                              }}
                              onChange={(e) => {
                                if ((selectedShipperCustomer?.id || 0) === 0) {
                                  if (
                                    (selectedOrder?.pickups || []).find(
                                      (p) => p.id === 0
                                    ) === undefined
                                  ) {
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      pickups: [
                                        ...(selectedOrder?.pickups || []),
                                        {
                                          id: 0,
                                          customer: {
                                            contact_phone: e.target.value,
                                          },
                                        },
                                      ],
                                    });
                                  } else {
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      pickups: (
                                        selectedOrder?.pickups || []
                                      ).map((p, i) => {
                                        if (p.id === 0) {
                                          p.customer = {
                                            ...p.customer,
                                            contact_phone: e.target.value,
                                          };
                                        }
                                        return p;
                                      }),
                                    });
                                  }

                                  setSelectedShipperCustomer({
                                    ...selectedShipperCustomer,
                                    contact_phone: e.target.value,
                                  });
                                } else {
                                  if (
                                    (selectedShipperCustomer?.contacts || [])
                                      .length === 0
                                  ) {
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      pickups: (
                                        selectedOrder?.pickups || []
                                      ).map((p, i) => {
                                        if (p.id === 0) {
                                          p.customer = {
                                            ...p.customer,
                                            contact_phone: e.target.value,
                                          };
                                        }
                                        return p;
                                      }),
                                    });

                                    setSelectedShipperCustomer({
                                      ...selectedShipperCustomer,
                                      contact_phone: e.target.value,
                                    });
                                  }
                                }
                              }}
                              value={
                                (selectedShipperCustomer?.contacts || []).find(
                                  (c) => c.is_primary === 1
                                ) === undefined
                                  ? selectedShipperCustomer?.contact_phone || ""
                                  : selectedShipperCustomer?.contacts.find(
                                    (c) => c.is_primary === 1
                                  ).primary_phone === "work"
                                    ? selectedShipperCustomer?.contacts.find(
                                      (c) => c.is_primary === 1
                                    ).phone_work
                                    : selectedShipperCustomer?.contacts.find(
                                      (c) => c.is_primary === 1
                                    ).primary_phone === "fax"
                                      ? selectedShipperCustomer?.contacts.find(
                                        (c) => c.is_primary === 1
                                      ).phone_work_fax
                                      : selectedShipperCustomer?.contacts.find(
                                        (c) => c.is_primary === 1
                                      ).primary_phone === "mobile"
                                        ? selectedShipperCustomer?.contacts.find(
                                          (c) => c.is_primary === 1
                                        ).phone_mobile
                                        : selectedShipperCustomer?.contacts.find(
                                          (c) => c.is_primary === 1
                                        ).primary_phone === "direct"
                                          ? selectedShipperCustomer?.contacts.find(
                                            (c) => c.is_primary === 1
                                          ).phone_direct
                                          : selectedShipperCustomer?.contacts.find(
                                            (c) => c.is_primary === 1
                                          ).primary_phone === "other"
                                            ? selectedShipperCustomer?.contacts.find(
                                              (c) => c.is_primary === 1
                                            ).phone_other
                                            : ""
                              }
                            />

                            {(selectedShipperCustomer?.contacts || []).find(
                              (c) => c.is_primary === 1
                            ) !== undefined && (
                                <div
                                  className={classnames({
                                    "selected-customer-contact-primary-phone": true,
                                    pushed: false,
                                  })}
                                >
                                  {
                                    selectedShipperCustomer?.contacts.find(
                                      (c) => c.is_primary === 1
                                    ).primary_phone
                                  }
                                </div>
                              )}
                          </div>
                          <div className="form-h-sep"></div>
                          <div className="input-box-container input-phone-ext">
                            <input
                              tabIndex={25 + props.tabTimes}
                              type="text"
                              placeholder="Ext"
                              onKeyDown={validateShipperCompanyContactForSaving}
                              onInput={(e) => {
                                if ((selectedShipperCustomer?.id || 0) === 0) {
                                  if (
                                    (selectedOrder?.pickups || []).find(
                                      (p) => p.id === 0
                                    ) === undefined
                                  ) {
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      pickups: [
                                        ...(selectedOrder?.pickups || []),
                                        {
                                          id: 0,
                                          customer: {
                                            ext: e.target.value,
                                          },
                                        },
                                      ],
                                    });
                                  } else {
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      pickups: (
                                        selectedOrder?.pickups || []
                                      ).map((p, i) => {
                                        if (p.id === 0) {
                                          p.customer = {
                                            ...p.customer,
                                            ext: e.target.value,
                                          };
                                        }
                                        return p;
                                      }),
                                    });
                                  }

                                  setSelectedShipperCustomer({
                                    ...selectedShipperCustomer,
                                    ext: e.target.value,
                                  });
                                } else {
                                  if (
                                    (selectedShipperCustomer?.contacts || [])
                                      .length === 0
                                  ) {
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      pickups: (
                                        selectedOrder?.pickups || []
                                      ).map((p, i) => {
                                        if (p.id === 0) {
                                          p.customer = {
                                            ...p.customer,
                                            ext: e.target.value,
                                          };
                                        }
                                        return p;
                                      }),
                                    });

                                    setSelectedShipperCustomer({
                                      ...selectedShipperCustomer,
                                      ext: e.target.value,
                                    });
                                  }
                                }
                              }}
                              onChange={(e) => {
                                if ((selectedShipperCustomer?.id || 0) === 0) {
                                  if (
                                    (selectedOrder?.pickups || []).find(
                                      (p) => p.id === 0
                                    ) === undefined
                                  ) {
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      pickups: [
                                        ...(selectedOrder?.pickups || []),
                                        {
                                          id: 0,
                                          customer: {
                                            ext: e.target.value,
                                          },
                                        },
                                      ],
                                    });
                                  } else {
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      pickups: (
                                        selectedOrder?.pickups || []
                                      ).map((p, i) => {
                                        if (p.id === 0) {
                                          p.customer = {
                                            ...p.customer,
                                            ext: e.target.value,
                                          };
                                        }
                                        return p;
                                      }),
                                    });
                                  }

                                  setSelectedShipperCustomer({
                                    ...selectedShipperCustomer,
                                    ext: e.target.value,
                                  });
                                } else {
                                  if (
                                    (selectedShipperCustomer?.contacts || [])
                                      .length === 0
                                  ) {
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      pickups: (
                                        selectedOrder?.pickups || []
                                      ).map((p, i) => {
                                        if (p.id === 0) {
                                          p.customer = {
                                            ...p.customer,
                                            ext: e.target.value,
                                          };
                                        }
                                        return p;
                                      }),
                                    });

                                    setSelectedShipperCustomer({
                                      ...selectedShipperCustomer,
                                      ext: e.target.value,
                                    });
                                  }
                                }
                              }}
                              value={
                                (selectedShipperCustomer?.contacts || []).find(
                                  (c) => c.is_primary === 1
                                ) === undefined
                                  ? selectedShipperCustomer?.ext || ""
                                  : selectedShipperCustomer?.contacts.find(
                                    (c) => c.is_primary === 1
                                  ).phone_ext
                              }
                            />
                          </div>
                        </div>
                      </animated.div>
                    )
                )}

                {shipperSecondPageTransition(
                  (style, item) =>
                    item && (
                      <animated.div
                        className="form-page second-page shipper-second-page"
                        style={{
                          ...style,
                        }}
                      >
                        <div
                          className="form-row"
                          style={{ alignItems: "center" }}
                        >
                          <div
                            className="select-box-container"
                            style={{ flexGrow: 1, position: "relative" }}
                          >
                            <div className="select-box-wrapper">
                              <MaskedInput
                                tabIndex={26 + props.tabTimes}
                                ref={refPickupDate1}
                                mask={[
                                  /[0-9]/,
                                  /\d/,
                                  "/",
                                  /\d/,
                                  /\d/,
                                  "/",
                                  /\d/,
                                  /\d/,
                                  /\d/,
                                  /\d/,
                                ]}
                                guide={false}
                                type="text"
                                placeholder="PU Date 1"
                                autoFocus={true}
                                onKeyDown={async (e) => {
                                  e.stopPropagation();
                                  let key = e.keyCode || e.which;
                                  await setPuDate1KeyCode(key);

                                  let puDate1 =
                                    e.target.value.trim() === ""
                                      ? moment()
                                      : moment(
                                        getFormattedDates(
                                          selectedShipperCustomer?.pu_date1 ||
                                          ""
                                        ),
                                        "MM/DD/YYYY"
                                      );
                                  await setPreSelectedPickupDate1(puDate1);

                                  if (key === 13) {
                                    if (isPickupDate1CalendarShown) {
                                      await setSelectedShipperCustomer({
                                        ...selectedShipperCustomer,
                                        pu_date1: preSelectedPickupDate1
                                          .clone()
                                          .format("MM/DD/YYYY"),
                                        pu_date2: preSelectedPickupDate1
                                          .clone()
                                          .format("MM/DD/YYYY"),
                                      });

                                      await setSelectedOrder({
                                        ...selectedOrder,
                                        pickups: (
                                          selectedOrder?.pickups || []
                                        ).map((pu, i) => {
                                          if (
                                            pu.id ===
                                            (selectedShipperCustomer?.pickup_id ||
                                              0)
                                          ) {
                                            pu.pu_date1 = preSelectedPickupDate1
                                              .clone()
                                              .format("MM/DD/YYYY");
                                            pu.pu_date2 = preSelectedPickupDate1
                                              .clone()
                                              .format("MM/DD/YYYY");
                                            setIsSavingPickupId(-1);
                                            setIsSavingPickupId(pu.id);
                                          }
                                          return pu;
                                        }),
                                      });

                                      await setIsPickupDate1CalendarShown(
                                        false
                                      );
                                      await setIsPickupDate2CalendarShown(
                                        false
                                      );
                                      await setIsDeliveryDate1CalendarShown(
                                        false
                                      );
                                      await setIsDeliveryDate2CalendarShown(
                                        false
                                      );

                                      refPickupTime1.current.focus();
                                    }
                                  }

                                  if (key >= 37 && key <= 40) {
                                    if (isPickupDate1CalendarShown) {
                                      e.preventDefault();

                                      if (key === 37) {
                                        // left - minus 1
                                        setPreSelectedPickupDate1(
                                          preSelectedPickupDate1
                                            .clone()
                                            .subtract(1, "day")
                                        );
                                      }

                                      if (key === 38) {
                                        // up - minus 7
                                        setPreSelectedPickupDate1(
                                          preSelectedPickupDate1
                                            .clone()
                                            .subtract(7, "day")
                                        );
                                      }

                                      if (key === 39) {
                                        // right - plus 1
                                        setPreSelectedPickupDate1(
                                          preSelectedPickupDate1
                                            .clone()
                                            .add(1, "day")
                                        );
                                      }

                                      if (key === 40) {
                                        // down - plus 7
                                        setPreSelectedPickupDate1(
                                          preSelectedPickupDate1
                                            .clone()
                                            .add(7, "day")
                                        );
                                      }

                                      await setSelectedOrder({
                                        ...selectedOrder,
                                        pickups: (
                                          selectedOrder?.pickups || []
                                        ).map((pu, i) => {
                                          if (
                                            pu.id ===
                                            (selectedShipperCustomer?.pickup_id ||
                                              0)
                                          ) {
                                            pu.pu_date1 = preSelectedPickupDate1
                                              .clone()
                                              .format("MM/DD/YYYY");
                                          }
                                          return pu;
                                        }),
                                      });
                                      // await validateOrderForSaving({ keyCode: 9 });
                                    } else {
                                      if (key === 38 || key === 40) {
                                        setIsPickupDate1CalendarShown(true);
                                      }
                                    }
                                  }
                                }}
                                onBlur={async (e) => {
                                  if (puDate1KeyCode === 9) {
                                    let formatted = getFormattedDates(
                                      e.target.value
                                    );

                                    await setSelectedShipperCustomer({
                                      ...selectedShipperCustomer,
                                      pu_date1: formatted,
                                      pu_date2: formatted,
                                    });

                                    let pickups = (
                                      selectedOrder?.pickups || []
                                    ).map((pu, i) => {
                                      if (
                                        pu.id ===
                                        (selectedShipperCustomer?.pickup_id ||
                                          0)
                                      ) {
                                        pu.pu_date1 = formatted;
                                        pu.pu_date2 = formatted;
                                        setIsSavingPickupId(-1);
                                        setIsSavingPickupId(pu.id);
                                      }
                                      return pu;
                                    });

                                    await setSelectedOrder({
                                      ...selectedOrder,
                                      pickups: pickups,
                                    });

                                    // await setIsPickupDate1CalendarShown(false);
                                    // await setIsPickupDate2CalendarShown(false);
                                    // await setIsDeliveryDate1CalendarShown(false);
                                    // await setIsDeliveryDate2CalendarShown(false);
                                  }
                                }}
                                onInput={(e) => {
                                  setSelectedShipperCustomer({
                                    ...selectedShipperCustomer,
                                    pu_date1: e.target.value,
                                  });

                                  setSelectedOrder({
                                    ...selectedOrder,
                                    pickups: (selectedOrder?.pickups || []).map(
                                      (pu, i) => {
                                        if (
                                          pu.id ===
                                          (selectedShipperCustomer?.pickup_id ||
                                            0)
                                        ) {
                                          pu.pu_date1 = e.target.value;
                                        }
                                        return pu;
                                      }
                                    ),
                                  });
                                }}
                                onChange={(e) => {
                                  setSelectedShipperCustomer({
                                    ...selectedShipperCustomer,
                                    pu_date1: e.target.value,
                                  });

                                  setSelectedOrder({
                                    ...selectedOrder,
                                    pickups: (selectedOrder?.pickups || []).map(
                                      (pu, i) => {
                                        if (
                                          pu.id ===
                                          (selectedShipperCustomer?.pickup_id ||
                                            0)
                                        ) {
                                          pu.pu_date1 = e.target.value;
                                        }
                                        return pu;
                                      }
                                    ),
                                  });
                                }}
                                value={selectedShipperCustomer?.pu_date1 || ""}
                              />

                              <FontAwesomeIcon
                                className="dropdown-button calendar"
                                icon={faCalendarAlt}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsPickupDate2CalendarShown(false);
                                  setIsDeliveryDate1CalendarShown(false);
                                  setIsDeliveryDate2CalendarShown(false);

                                  if (
                                    moment(
                                      (
                                        selectedShipperCustomer?.pu_date1 || ""
                                      ).trim(),
                                      "MM/DD/YYYY"
                                    ).format("MM/DD/YYYY") ===
                                    (
                                      selectedShipperCustomer?.pu_date1 || ""
                                    ).trim()
                                  ) {
                                    setPreSelectedPickupDate1(
                                      moment(
                                        selectedShipperCustomer?.pu_date1,
                                        "MM/DD/YYYY"
                                      )
                                    );
                                  } else {
                                    setPreSelectedPickupDate1(moment());
                                  }

                                  window.setTimeout(async () => {
                                    await setIsPickupDate1CalendarShown(true);
                                    refPickupDate1.current.inputElement.focus();
                                  }, 0);
                                }}
                              />
                            </div>
                            {puDate1Transition(
                              (style, item) =>
                                item && (
                                  <animated.div
                                    className="mochi-contextual-container"
                                    id="mochi-contextual-container-pickup-date1"
                                    style={{
                                      ...style,
                                      left: "0%",
                                      display: "block",
                                    }}
                                    ref={refPickupDate1CalendarDropDown}
                                  >
                                    <div
                                      className="mochi-contextual-popup vertical below right"
                                      style={{ height: 275 }}
                                    >
                                      <div className="mochi-contextual-popup-content">
                                        <div className="mochi-contextual-popup-wrapper">
                                          <Calendar
                                            value={
                                              moment(
                                                (
                                                  selectedShipperCustomer?.pu_date1 ||
                                                  ""
                                                ).trim(),
                                                "MM/DD/YYYY"
                                              ).format("MM/DD/YYYY") ===
                                                (
                                                  selectedShipperCustomer?.pu_date1 ||
                                                  ""
                                                ).trim()
                                                ? moment(
                                                  selectedShipperCustomer?.pu_date1,
                                                  "MM/DD/YYYY"
                                                )
                                                : moment()
                                            }
                                            onChange={(day) => {
                                              setSelectedShipperCustomer(
                                                (selectedShipperCustomer) => {
                                                  return {
                                                    ...selectedShipperCustomer,
                                                    pu_date1:
                                                      day.format("MM/DD/YYYY"),
                                                    pu_date2:
                                                      day.format("MM/DD/YYYY"),
                                                  };
                                                }
                                              );

                                              setSelectedOrder(
                                                (selectedOrder) => {
                                                  return {
                                                    ...selectedOrder,
                                                    pickups: (
                                                      selectedOrder?.pickups ||
                                                      []
                                                    ).map((pu, i) => {
                                                      if (
                                                        pu.id ===
                                                        (selectedShipperCustomer?.pickup_id ||
                                                          0)
                                                      ) {
                                                        pu.pu_date1 =
                                                          preSelectedPickupDate1
                                                            .clone()
                                                            .format(
                                                              "MM/DD/YYYY"
                                                            );
                                                        pu.pu_date2 =
                                                          preSelectedPickupDate1
                                                            .clone()
                                                            .format(
                                                              "MM/DD/YYYY"
                                                            );
                                                        setIsSavingPickupId(-1);
                                                        setIsSavingPickupId(
                                                          pu.id
                                                        );
                                                      }
                                                      return pu;
                                                    }),
                                                  };
                                                }
                                              );

                                              setIsPickupDate1CalendarShown(
                                                false
                                              );
                                              setIsPickupDate2CalendarShown(
                                                false
                                              );
                                              setIsDeliveryDate1CalendarShown(
                                                false
                                              );
                                              setIsDeliveryDate2CalendarShown(
                                                false
                                              );

                                              refPickupTime1.current.focus();
                                            }}
                                            closeCalendar={() => {
                                              setIsPickupDate1CalendarShown(
                                                false
                                              );
                                            }}
                                            preDay={preSelectedPickupDate1}
                                            onChangePreDay={(preDay) => {
                                              setPreSelectedPickupDate1(preDay);
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </animated.div>
                                )
                            )}
                          </div>
                          <div className="form-h-sep"></div>
                          <div className="input-box-container grow">
                            <input
                              tabIndex={27 + props.tabTimes}
                              type="text"
                              placeholder="PU Time 1"
                              maxLength={4}
                              ref={refPickupTime1}
                              onKeyDown={(e) => {
                                e.stopPropagation();
                                setPuTime1KeyCode(e.keyCode || e.which);
                              }}
                              onBlur={async (e) => {
                                if (puTime1KeyCode === 9) {
                                  let formatted = getFormattedHours(
                                    e.target.value
                                  );

                                  await setSelectedShipperCustomer({
                                    ...selectedShipperCustomer,
                                    pu_time1: formatted,
                                  });

                                  let pickups = (
                                    selectedOrder?.pickups || []
                                  ).map((pu, i) => {
                                    if (
                                      pu.id ===
                                      (selectedShipperCustomer?.pickup_id || 0)
                                    ) {
                                      pu.pu_time1 = formatted;
                                      setIsSavingPickupId(-1);
                                      setIsSavingPickupId(pu.id);
                                    }
                                    return pu;
                                  });

                                  await setSelectedOrder({
                                    ...selectedOrder,
                                    pickups: pickups,
                                  });
                                }
                              }}
                              onInput={(e) => {
                                setSelectedShipperCustomer({
                                  ...selectedShipperCustomer,
                                  pu_time1: e.target.value,
                                });

                                setSelectedOrder({
                                  ...selectedOrder,
                                  pickups: (selectedOrder?.pickups || []).map(
                                    (pu, i) => {
                                      if (
                                        pu.id ===
                                        (selectedShipperCustomer?.pickup_id ||
                                          0)
                                      ) {
                                        pu.pu_time1 = e.target.value;
                                      }
                                      return pu;
                                    }
                                  ),
                                });
                              }}
                              onChange={(e) => {
                                setSelectedShipperCustomer({
                                  ...selectedShipperCustomer,
                                  pu_time1: e.target.value,
                                });

                                setSelectedOrder({
                                  ...selectedOrder,
                                  pickups: (selectedOrder?.pickups || []).map(
                                    (pu, i) => {
                                      if (
                                        pu.id ===
                                        (selectedShipperCustomer?.pickup_id ||
                                          0)
                                      ) {
                                        pu.pu_time1 = e.target.value;
                                      }
                                      return pu;
                                    }
                                  ),
                                });
                              }}
                              value={selectedShipperCustomer?.pu_time1 || ""}
                            />
                          </div>
                          <div
                            style={{
                              minWidth: "1.8rem",
                              fontSize: "1rem",
                              textAlign: "center",
                            }}
                          >
                            To
                          </div>
                          <div
                            className="select-box-container"
                            style={{ flexGrow: 1, position: "relative" }}
                          >
                            <div className="select-box-wrapper">
                              <MaskedInput
                                tabIndex={28 + props.tabTimes}
                                ref={refPickupDate2}
                                mask={[
                                  /[0-9]/,
                                  /\d/,
                                  "/",
                                  /\d/,
                                  /\d/,
                                  "/",
                                  /\d/,
                                  /\d/,
                                  /\d/,
                                  /\d/,
                                ]}
                                guide={false}
                                type="text"
                                placeholder="PU Date 2"
                                onKeyDown={async (e) => {
                                  e.stopPropagation();
                                  let key = e.keyCode || e.which;
                                  await setPuDate2KeyCode(key);

                                  let puDate2 =
                                    e.target.value.trim() === ""
                                      ? moment()
                                      : moment(
                                        getFormattedDates(
                                          selectedShipperCustomer?.pu_date2 ||
                                          ""
                                        ),
                                        "MM/DD/YYYY"
                                      );
                                  await setPreSelectedPickupDate2(puDate2);

                                  if (key === 13) {
                                    if (isPickupDate2CalendarShown) {
                                      await setSelectedShipperCustomer({
                                        ...selectedShipperCustomer,
                                        pu_date2: preSelectedPickupDate2
                                          .clone()
                                          .format("MM/DD/YYYY"),
                                      });

                                      await setSelectedOrder({
                                        ...selectedOrder,
                                        pickups: (
                                          selectedOrder?.pickups || []
                                        ).map((pu, i) => {
                                          if (
                                            pu.id ===
                                            (selectedShipperCustomer?.pickup_id ||
                                              0)
                                          ) {
                                            pu.pu_date2 = preSelectedPickupDate2
                                              .clone()
                                              .format("MM/DD/YYYY");
                                            setIsSavingPickupId(-1);
                                            setIsSavingPickupId(pu.id);
                                          }
                                          return pu;
                                        }),
                                      });

                                      await setIsPickupDate1CalendarShown(
                                        false
                                      );
                                      await setIsPickupDate2CalendarShown(
                                        false
                                      );
                                      await setIsDeliveryDate1CalendarShown(
                                        false
                                      );
                                      await setIsDeliveryDate2CalendarShown(
                                        false
                                      );

                                      refPickupTime2.current.focus();
                                    }
                                  }

                                  if (key >= 37 && key <= 40) {
                                    if (isPickupDate2CalendarShown) {
                                      e.preventDefault();

                                      if (key === 37) {
                                        // left - minus 1
                                        setPreSelectedPickupDate2(
                                          preSelectedPickupDate2
                                            .clone()
                                            .subtract(1, "day")
                                        );
                                      }

                                      if (key === 38) {
                                        // up - minus 7
                                        setPreSelectedPickupDate2(
                                          preSelectedPickupDate2
                                            .clone()
                                            .subtract(7, "day")
                                        );
                                      }

                                      if (key === 39) {
                                        // right - plus 1
                                        setPreSelectedPickupDate2(
                                          preSelectedPickupDate2
                                            .clone()
                                            .add(1, "day")
                                        );
                                      }

                                      if (key === 40) {
                                        // down - plus 7
                                        setPreSelectedPickupDate2(
                                          preSelectedPickupDate2
                                            .clone()
                                            .add(7, "day")
                                        );
                                      }

                                      await setSelectedOrder({
                                        ...selectedOrder,
                                        pickups: (
                                          selectedOrder?.pickups || []
                                        ).map((pu, i) => {
                                          if (
                                            pu.id ===
                                            (selectedShipperCustomer?.pickup_id ||
                                              0)
                                          ) {
                                            pu.pu_date2 = preSelectedPickupDate2
                                              .clone()
                                              .format("MM/DD/YYYY");
                                          }
                                          return pu;
                                        }),
                                      });
                                    } else {
                                      if (key === 38 || key === 40) {
                                        setIsPickupDate2CalendarShown(true);
                                      }
                                    }
                                  }
                                }}
                                onBlur={async (e) => {
                                  if (puDate2KeyCode === 9) {
                                    let formatted = getFormattedDates(
                                      e.target.value
                                    );

                                    await setSelectedShipperCustomer({
                                      ...selectedShipperCustomer,
                                      pu_date2: formatted,
                                    });

                                    let pickups = (
                                      selectedOrder?.pickups || []
                                    ).map((pu, i) => {
                                      if (
                                        pu.id ===
                                        (selectedShipperCustomer?.pickup_id ||
                                          0)
                                      ) {
                                        pu.pu_date2 = formatted;
                                        setIsSavingPickupId(-1);
                                        setIsSavingPickupId(pu.id);
                                      }
                                      return pu;
                                    });

                                    await setSelectedOrder({
                                      ...selectedOrder,
                                      pickups: pickups,
                                    });

                                    // await setIsPickupDate1CalendarShown(false);
                                    // await setIsPickupDate2CalendarShown(false);
                                    // await setIsDeliveryDate1CalendarShown(false);
                                    // await setIsDeliveryDate2CalendarShown(false);
                                  }
                                }}
                                onInput={(e) => {
                                  setSelectedShipperCustomer({
                                    ...selectedShipperCustomer,
                                    pu_date2: e.target.value,
                                  });

                                  setSelectedOrder({
                                    ...selectedOrder,
                                    pickups: (selectedOrder?.pickups || []).map(
                                      (pu, i) => {
                                        if (
                                          pu.id ===
                                          (selectedShipperCustomer?.pickup_id ||
                                            0)
                                        ) {
                                          pu.pu_date2 = e.target.value;
                                        }
                                        return pu;
                                      }
                                    ),
                                  });
                                }}
                                onChange={(e) => {
                                  setSelectedShipperCustomer({
                                    ...selectedShipperCustomer,
                                    pu_date2: e.target.value,
                                  });

                                  setSelectedOrder({
                                    ...selectedOrder,
                                    pickups: (selectedOrder?.pickups || []).map(
                                      (pu, i) => {
                                        if (
                                          pu.id ===
                                          (selectedShipperCustomer?.pickup_id ||
                                            0)
                                        ) {
                                          pu.pu_date2 = e.target.value;
                                        }
                                        return pu;
                                      }
                                    ),
                                  });
                                }}
                                value={selectedShipperCustomer?.pu_date2 || ""}
                              />
                              <FontAwesomeIcon
                                className="dropdown-button calendar"
                                icon={faCalendarAlt}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsPickupDate1CalendarShown(false);
                                  setIsDeliveryDate1CalendarShown(false);
                                  setIsDeliveryDate2CalendarShown(false);

                                  if (
                                    moment(
                                      (
                                        selectedShipperCustomer?.pu_date2 || ""
                                      ).trim(),
                                      "MM/DD/YYYY"
                                    ).format("MM/DD/YYYY") ===
                                    (
                                      selectedShipperCustomer?.pu_date2 || ""
                                    ).trim()
                                  ) {
                                    setPreSelectedPickupDate2(
                                      moment(
                                        selectedShipperCustomer?.pu_date2,
                                        "MM/DD/YYYY"
                                      )
                                    );
                                  } else {
                                    setPreSelectedPickupDate2(moment());
                                  }

                                  window.setTimeout(async () => {
                                    await setIsPickupDate2CalendarShown(true);
                                    refPickupDate2.current.inputElement.focus();
                                  }, 0);
                                }}
                              />
                            </div>
                            {puDate2Transition(
                              (style, item) =>
                                item && (
                                  <animated.div
                                    className="mochi-contextual-container"
                                    id="mochi-contextual-container-pickup-date2"
                                    style={{
                                      ...style,
                                      left: "0%",
                                      display: "block",
                                    }}
                                    ref={refPickupDate2CalendarDropDown}
                                  >
                                    <div
                                      className="mochi-contextual-popup vertical below right"
                                      style={{ height: 275 }}
                                    >
                                      <div className="mochi-contextual-popup-content">
                                        <div className="mochi-contextual-popup-wrapper">
                                          <Calendar
                                            value={
                                              moment(
                                                (
                                                  selectedShipperCustomer?.pu_date2 ||
                                                  ""
                                                ).trim(),
                                                "MM/DD/YYYY"
                                              ).format("MM/DD/YYYY") ===
                                                (
                                                  selectedShipperCustomer?.pu_date2 ||
                                                  ""
                                                ).trim()
                                                ? moment(
                                                  selectedShipperCustomer?.pu_date2,
                                                  "MM/DD/YYYY"
                                                )
                                                : moment()
                                            }
                                            onChange={(day) => {
                                              setSelectedShipperCustomer(
                                                (selectedShipperCustomer) => {
                                                  return {
                                                    ...selectedShipperCustomer,
                                                    pu_date2:
                                                      day.format("MM/DD/YYYY"),
                                                  };
                                                }
                                              );

                                              setSelectedOrder(
                                                (selectedOrder) => {
                                                  return {
                                                    ...selectedOrder,
                                                    pickups: (
                                                      selectedOrder?.pickups ||
                                                      []
                                                    ).map((pu, i) => {
                                                      if (
                                                        pu.id ===
                                                        (selectedShipperCustomer?.pickup_id ||
                                                          0)
                                                      ) {
                                                        pu.pu_date2 =
                                                          preSelectedPickupDate1
                                                            .clone()
                                                            .format(
                                                              "MM/DD/YYYY"
                                                            );
                                                        setIsSavingPickupId(-1);
                                                        setIsSavingPickupId(
                                                          pu.id
                                                        );
                                                      }
                                                      return pu;
                                                    }),
                                                  };
                                                }
                                              );

                                              setIsPickupDate1CalendarShown(
                                                false
                                              );
                                              setIsPickupDate2CalendarShown(
                                                false
                                              );
                                              setIsDeliveryDate1CalendarShown(
                                                false
                                              );
                                              setIsDeliveryDate2CalendarShown(
                                                false
                                              );

                                              refPickupTime2.current.focus();
                                            }}
                                            closeCalendar={() => {
                                              setIsPickupDate2CalendarShown(
                                                false
                                              );
                                            }}
                                            preDay={preSelectedPickupDate2}
                                            onChangePreDay={(preDay) => {
                                              setPreSelectedPickupDate2(preDay);
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </animated.div>
                                )
                            )}
                          </div>
                          <div className="form-h-sep"></div>
                          <div className="input-box-container grow">
                            <input
                              tabIndex={29 + props.tabTimes}
                              type="text"
                              placeholder="PU Time 2"
                              maxLength={4}
                              ref={refPickupTime2}
                              onKeyDown={(e) => {
                                e.stopPropagation();
                                setPuTime2KeyCode(e.keyCode || e.which);
                              }}
                              onBlur={async (e) => {
                                if (puTime2KeyCode === 9) {
                                  let formatted = getFormattedHours(
                                    e.target.value
                                  );

                                  await setSelectedShipperCustomer({
                                    ...selectedShipperCustomer,
                                    pu_time2: formatted,
                                  });

                                  let pickups = (
                                    selectedOrder?.pickups || []
                                  ).map((pu, i) => {
                                    if (
                                      pu.id ===
                                      (selectedShipperCustomer?.pickup_id || 0)
                                    ) {
                                      pu.pu_time2 = formatted;
                                      setIsSavingPickupId(-1);
                                      setIsSavingPickupId(pu.id);
                                    }
                                    return pu;
                                  });

                                  await setSelectedOrder({
                                    ...selectedOrder,
                                    pickups: pickups,
                                  });
                                }
                              }}
                              onInput={(e) => {
                                setSelectedShipperCustomer({
                                  ...selectedShipperCustomer,
                                  pu_time2: e.target.value,
                                });

                                setSelectedOrder({
                                  ...selectedOrder,
                                  pickups: (selectedOrder?.pickups || []).map(
                                    (pu, i) => {
                                      if (
                                        pu.id ===
                                        (selectedShipperCustomer?.pickup_id ||
                                          0)
                                      ) {
                                        pu.pu_time2 = e.target.value;
                                      }
                                      return pu;
                                    }
                                  ),
                                });
                              }}
                              onChange={(e) => {
                                setSelectedShipperCustomer({
                                  ...selectedShipperCustomer,
                                  pu_time2: e.target.value,
                                });

                                setSelectedOrder({
                                  ...selectedOrder,
                                  pickups: (selectedOrder?.pickups || []).map(
                                    (pu, i) => {
                                      if (
                                        pu.id ===
                                        (selectedShipperCustomer?.pickup_id ||
                                          0)
                                      ) {
                                        pu.pu_time2 = e.target.value;
                                      }
                                      return pu;
                                    }
                                  ),
                                });
                              }}
                              value={selectedShipperCustomer?.pu_time2 || ""}
                            />
                          </div>
                        </div>

                        <div
                          className="form-row"
                          style={{ alignItems: "center" }}
                        >
                          <div
                            className="input-box-container grow"
                            style={{ flexGrow: 1, flexBasis: "100%" }}
                          >
                            {(selectedShipperCustomer?.bol_numbers || "")
                              .split(" ")
                              .map((item, index) => {
                                if (item.trim() !== "") {
                                  return (
                                    <div
                                      key={index}
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        fontSize: "0.7rem",
                                        backgroundColor: "rgba(0,0,0,0.2)",
                                        padding: "2px 10px",
                                        borderRadius: "10px",
                                        marginRight: "2px",
                                        cursor: "default",
                                      }}
                                      title={item}
                                    >
                                      <span
                                        className="fas fa-trash-alt"
                                        style={{
                                          marginRight: "5px",
                                          cursor: "pointer",
                                        }}
                                        onClick={() => {
                                          setSelectedShipperCustomer({
                                            ...selectedShipperCustomer,
                                            bol_numbers: (
                                              selectedShipperCustomer?.bol_numbers ||
                                              ""
                                            )
                                              .replace(item, "")
                                              .trim(),
                                          });

                                          setSelectedOrder({
                                            ...selectedOrder,
                                            pickups: (
                                              selectedOrder?.pickups || []
                                            ).map((pu, i) => {
                                              if (
                                                pu.id ===
                                                (selectedShipperCustomer?.pickup_id ||
                                                  0)
                                              ) {
                                                pu.bol_numbers = (
                                                  selectedShipperCustomer?.bol_numbers ||
                                                  ""
                                                )
                                                  .replace(item, "")
                                                  .trim();
                                              }
                                              return pu;
                                            }),
                                          });

                                          setIsSavingPickupId(
                                            selectedShipperCustomer?.pickup_id ||
                                            0
                                          );
                                        }}
                                      ></span>

                                      <span
                                        className="automatic-email-inputted"
                                        style={{ whiteSpace: "nowrap" }}
                                      >
                                        {item}
                                      </span>
                                    </div>
                                  );
                                } else {
                                  return false;
                                }
                              })}

                            <input
                              tabIndex={30 + props.tabTimes}
                              type="text"
                              placeholder="BOL Numbers"
                              ref={refBolNumbers}
                              onKeyDown={bolNumbersOnKeydown}
                              onInput={(e) => {
                                setShipperBolNumber(e.target.value);
                              }}
                              onChange={(e) => {
                                setShipperBolNumber(e.target.value);
                              }}
                              value={shipperBolNumber || ""}
                            />
                          </div>
                          <div
                            style={{
                              minWidth: "1.8rem",
                              fontSize: "1rem",
                              textAlign: "center",
                            }}
                          ></div>
                          <div
                            className="input-box-container grow"
                            style={{ flexGrow: 1, flexBasis: "100%" }}
                          >
                            {(selectedShipperCustomer?.po_numbers || "")
                              .split(" ")
                              .map((item, index) => {
                                if (item.trim() !== "") {
                                  return (
                                    <div
                                      key={index}
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        fontSize: "0.7rem",
                                        backgroundColor: "rgba(0,0,0,0.2)",
                                        padding: "2px 10px",
                                        borderRadius: "10px",
                                        marginRight: "2px",
                                        cursor: "default",
                                      }}
                                      title={item}
                                    >
                                      <span
                                        className="fas fa-trash-alt"
                                        style={{
                                          marginRight: "5px",
                                          cursor: "pointer",
                                        }}
                                        onClick={() => {
                                          setSelectedShipperCustomer({
                                            ...selectedShipperCustomer,
                                            po_numbers: (
                                              selectedShipperCustomer?.po_numbers ||
                                              ""
                                            )
                                              .replace(item, "")
                                              .trim(),
                                          });

                                          setSelectedOrder({
                                            ...selectedOrder,
                                            pickups: (
                                              selectedOrder?.pickups || []
                                            ).map((pu, i) => {
                                              if (
                                                pu.id ===
                                                (selectedShipperCustomer?.pickup_id ||
                                                  0)
                                              ) {
                                                pu.po_numbers = (
                                                  selectedShipperCustomer?.po_numbers ||
                                                  ""
                                                )
                                                  .replace(item, "")
                                                  .trim();
                                              }
                                              return pu;
                                            }),
                                          });

                                          setIsSavingPickupId(
                                            selectedShipperCustomer?.pickup_id ||
                                            0
                                          );
                                        }}
                                      ></span>

                                      <span
                                        className="automatic-email-inputted"
                                        style={{ whiteSpace: "nowrap" }}
                                      >
                                        {item}
                                      </span>
                                    </div>
                                  );
                                } else {
                                  return false;
                                }
                              })}
                            <input
                              tabIndex={31 + props.tabTimes}
                              type="text"
                              placeholder="PO Numbers"
                              ref={refPoNumbers}
                              onKeyDown={poNumbersOnKeydown}
                              onInput={(e) => {
                                setShipperPoNumber(e.target.value);
                              }}
                              onChange={(e) => {
                                setShipperPoNumber(e.target.value);
                              }}
                              value={shipperPoNumber || ""}
                            />
                          </div>
                        </div>

                        <div
                          className="form-row"
                          style={{ alignItems: "center" }}
                        >
                          <div
                            className="input-box-container grow"
                            style={{ flexGrow: 1, flexBasis: "100%" }}
                          >
                            {(selectedShipperCustomer?.ref_numbers || "")
                              .split(" ")
                              .map((item, index) => {
                                if (item.trim() !== "") {
                                  return (
                                    <div
                                      key={index}
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        fontSize: "0.7rem",
                                        backgroundColor: "rgba(0,0,0,0.2)",
                                        padding: "2px 10px",
                                        borderRadius: "10px",
                                        marginRight: "2px",
                                        cursor: "default",
                                      }}
                                      title={item}
                                    >
                                      <span
                                        className="fas fa-trash-alt"
                                        style={{
                                          marginRight: "5px",
                                          cursor: "pointer",
                                        }}
                                        onClick={() => {
                                          setSelectedShipperCustomer({
                                            ...selectedShipperCustomer,
                                            ref_numbers: (
                                              selectedShipperCustomer?.ref_numbers ||
                                              ""
                                            )
                                              .replace(item, "")
                                              .trim(),
                                          });

                                          setSelectedOrder({
                                            ...selectedOrder,
                                            pickups: (
                                              selectedOrder?.pickups || []
                                            ).map((pu, i) => {
                                              if (
                                                pu.id ===
                                                selectedShipperCustomer.pickup_id
                                              ) {
                                                pu.ref_numbers = (
                                                  selectedShipperCustomer?.ref_numbers ||
                                                  ""
                                                )
                                                  .replace(item, "")
                                                  .trim();
                                              }
                                              return pu;
                                            }),
                                          });

                                          setIsSavingPickupId(
                                            selectedShipperCustomer?.pickup_id ||
                                            0
                                          );
                                        }}
                                      ></span>

                                      <span
                                        className="automatic-email-inputted"
                                        style={{ whiteSpace: "nowrap" }}
                                      >
                                        {item}
                                      </span>
                                    </div>
                                  );
                                } else {
                                  return false;
                                }
                              })}
                            <input
                              tabIndex={32 + props.tabTimes}
                              type="text"
                              placeholder="REF Numbers"
                              ref={refRefNumbers}
                              onKeyDown={refNumbersOnKeydown}
                              onInput={(e) => {
                                setShipperRefNumber(e.target.value);
                              }}
                              onChange={(e) => {
                                setShipperRefNumber(e.target.value);
                              }}
                              value={shipperRefNumber || ""}
                            />
                          </div>
                          <div
                            style={{
                              minWidth: "1.8rem",
                              fontSize: "1rem",
                              textAlign: "center",
                            }}
                          ></div>
                          <div
                            className="input-box-container grow"
                            style={{ flexGrow: 1, flexBasis: "100%" }}
                          >
                            <input
                              tabIndex={33 + props.tabTimes}
                              type="text"
                              placeholder="SEAL Number"
                              onKeyDown={(e) => {
                                let key = e.keyCode || e.which;

                                if (key === 9) {
                                  setIsSavingPickupId(
                                    selectedShipperCustomer?.pickup_id || 0
                                  );
                                }
                              }}
                              onInput={(e) => {
                                setSelectedOrder({
                                  ...selectedOrder,
                                  pickups: (selectedOrder?.pickups || []).map(
                                    (pu, i) => {
                                      if (
                                        pu.id ===
                                        (selectedShipperCustomer?.pickup_id ||
                                          0)
                                      ) {
                                        pu.seal_number = e.target.value;
                                      }
                                      return pu;
                                    }
                                  ),
                                });

                                setSelectedShipperCustomer({
                                  ...selectedShipperCustomer,
                                  seal_number: e.target.value,
                                });
                              }}
                              onChange={(e) => {
                                setSelectedOrder({
                                  ...selectedOrder,
                                  pickups: (selectedOrder?.pickups || []).map(
                                    (pu, i) => {
                                      if (
                                        pu.id ===
                                        (selectedShipperCustomer?.pickup_id ||
                                          0)
                                      ) {
                                        pu.seal_number = e.target.value;
                                      }
                                      return pu;
                                    }
                                  ),
                                });

                                setSelectedShipperCustomer({
                                  ...selectedShipperCustomer,
                                  seal_number: e.target.value,
                                });
                              }}
                              value={selectedShipperCustomer?.seal_number || ""}
                            />
                          </div>
                        </div>

                        <div
                          className="form-row"
                          style={{ alignItems: "center" }}
                        >
                          <div className="input-box-container grow">
                            <input
                              tabIndex={34 + props.tabTimes}
                              type="text"
                              placeholder="Special Instructions"
                              onKeyDown={(e) => {
                                let key = e.keyCode || e.which;

                                if (key === 9) {
                                  e.preventDefault();
                                  setIsSavingPickupId(
                                    selectedShipperCustomer?.pickup_id || 0
                                  );
                                  goToTabindex(
                                    (35 + props.tabTimes).toString()
                                  );
                                  setIsShowingShipperSecondPage(false);
                                }
                              }}
                              onInput={(e) => {
                                setSelectedOrder({
                                  ...selectedOrder,
                                  pickups: (selectedOrder?.pickups || []).map(
                                    (pu, i) => {
                                      if (
                                        pu.id ===
                                        (selectedShipperCustomer?.pickup_id ||
                                          0)
                                      ) {
                                        pu.special_instructions =
                                          e.target.value;
                                      }
                                      return pu;
                                    }
                                  ),
                                });

                                setSelectedShipperCustomer({
                                  ...selectedShipperCustomer,
                                  special_instructions: e.target.value,
                                });
                              }}
                              onChange={(e) => {
                                setSelectedOrder({
                                  ...selectedOrder,
                                  pickups: (selectedOrder?.pickups || []).map(
                                    (pu, i) => {
                                      if (
                                        pu.id ===
                                        (selectedShipperCustomer?.pickup_id ||
                                          0)
                                      ) {
                                        pu.special_instructions =
                                          e.target.value;
                                      }
                                      return pu;
                                    }
                                  ),
                                });

                                setSelectedShipperCustomer({
                                  ...selectedShipperCustomer,
                                  special_instructions: e.target.value,
                                });
                              }}
                              value={
                                selectedShipperCustomer?.special_instructions ||
                                ""
                              }
                            />
                          </div>
                        </div>
                      </animated.div>
                    )
                )}
              </div>
            </div>

            <div
              className="form-bordered-box"
              style={{
                minWidth: "38%",
                maxWidth: "38%",
                marginRight: 10,
                height: "9rem",
                position: "relative",
              }}
            >
              <div className="form-header">
                <div className="top-border top-border-left"></div>
                <div className="form-title">Consignee</div>
                <div className="top-border top-border-middle"></div>
                <div className="form-buttons">
                  <div
                    className="mochi-button"
                    onClick={consigneeCompanySearch}
                  >
                    <div className="mochi-button-decorator mochi-button-decorator-left">
                      (
                    </div>
                    <div className="mochi-button-base">Search</div>
                    <div className="mochi-button-decorator mochi-button-decorator-right">
                      )
                    </div>
                  </div>
                  <div
                    className="mochi-button"
                    onClick={() => {
                      if ((selectedConsigneeCustomer.id || 0) === 0) {
                        window.alert("You must select a customer first!");
                        return;
                      }

                      let panel = {
                        panelName: `${props.panelName}-customer`,
                        component: (
                          <Customers
                            pageName={"Customer"}
                            title={"Consignee Company"}
                            panelName={`${props.panelName}-customer`}
                            tabTimes={4000 + props.tabTimes}
                            componentId={moment().format("x")}
                            isOnPanel={true}
                            origin={props.origin}
                            openPanel={props.openPanel}
                            closePanel={props.closePanel}
                            customer_id={selectedConsigneeCustomer.id}
                          />
                        ),
                      };

                      props.openPanel(panel, props.origin);
                    }}
                  >
                    <div className="mochi-button-decorator mochi-button-decorator-left">
                      (
                    </div>
                    <div className="mochi-button-base">Company info</div>
                    <div className="mochi-button-decorator mochi-button-decorator-right">
                      )
                    </div>
                  </div>
                  {isShowingConsigneeSecondPage && (
                    <div
                      className="mochi-button"
                      onClick={() => {
                        setIsShowingConsigneeSecondPage(false);
                      }}
                    >
                      <div className="mochi-button-decorator mochi-button-decorator-left">
                        (
                      </div>
                      <div className="mochi-button-base">1st Page</div>
                      <div className="mochi-button-decorator mochi-button-decorator-right">
                        )
                      </div>
                    </div>
                  )}
                  {!isShowingConsigneeSecondPage && (
                    <div
                      className="mochi-button"
                      onClick={() => {
                        setIsShowingConsigneeSecondPage(true);
                      }}
                    >
                      <div className="mochi-button-decorator mochi-button-decorator-left">
                        (
                      </div>
                      <div className="mochi-button-base">2nd Page</div>
                      <div className="mochi-button-decorator mochi-button-decorator-right">
                        )
                      </div>
                    </div>
                  )}
                </div>
                <div className="top-border top-border-right"></div>
              </div>

              <div className="form-wrapper">
                <div className="form-row">
                  <div className="input-box-container input-code">
                    <input
                      tabIndex={35 + props.tabTimes}
                      type="text"
                      placeholder="Code"
                      maxLength="8"
                      ref={refConsigneeCompanyCode}
                      onKeyDown={getConsigneeCompanyByCode}
                      onInput={(e) => {
                        if ((selectedConsigneeCustomer?.id || 0) === 0) {
                          if (
                            (selectedOrder?.deliveries || []).find(
                              (p) => p.id === 0
                            ) === undefined
                          ) {
                            setSelectedOrder({
                              ...selectedOrder,
                              deliveries: [
                                ...(selectedOrder?.deliveries || []),
                                {
                                  id: 0,
                                  customer: {
                                    id: 0,
                                    code: e.target.value.toUpperCase(),
                                  },
                                },
                              ],
                            });
                          } else {
                            setSelectedOrder({
                              ...selectedOrder,
                              deliveries: (selectedOrder?.deliveries || []).map(
                                (p, i) => {
                                  if (p.id === 0) {
                                    p.customer = {
                                      ...p.customer,
                                      code: e.target.value.toUpperCase(),
                                    };
                                  }
                                  return p;
                                }
                              ),
                            });
                          }

                          setSelectedConsigneeCustomer({
                            ...selectedConsigneeCustomer,
                            code: e.target.value.toUpperCase(),
                            code_number: 0,
                          });
                        } else {
                          setSelectedOrder({
                            ...selectedOrder,
                            deliveries: (selectedOrder?.deliveries || []).map(
                              (p, i) => {
                                if (p.id === selectedConsigneeCustomer?.id) {
                                  p.customer = {
                                    ...p.customer,
                                    code: e.target.value.toUpperCase(),
                                  };
                                }
                                return p;
                              }
                            ),
                          });

                          setSelectedConsigneeCustomer({
                            ...selectedConsigneeCustomer,
                            code: e.target.value.toUpperCase(),
                            code_number: 0,
                          });
                        }
                      }}
                      onChange={(e) => {
                        if ((selectedConsigneeCustomer?.id || 0) === 0) {
                          if (
                            (selectedOrder?.deliveries || []).find(
                              (p) => p.id === 0
                            ) === undefined
                          ) {
                            setSelectedOrder({
                              ...selectedOrder,
                              deliveries: [
                                ...(selectedOrder?.deliveries || []),
                                {
                                  id: 0,
                                  customer: {
                                    id: 0,
                                    code: e.target.value.toUpperCase(),
                                  },
                                },
                              ],
                            });
                          } else {
                            setSelectedOrder({
                              ...selectedOrder,
                              deliveries: (selectedOrder?.deliveries || []).map(
                                (p, i) => {
                                  if (p.id === 0) {
                                    p.customer = {
                                      ...p.customer,
                                      code: e.target.value.toUpperCase(),
                                    };
                                  }
                                  return p;
                                }
                              ),
                            });
                          }

                          setSelectedConsigneeCustomer({
                            ...selectedConsigneeCustomer,
                            code: e.target.value.toUpperCase(),
                            code_number: 0,
                          });
                        } else {
                          setSelectedOrder({
                            ...selectedOrder,
                            deliveries: (selectedOrder?.deliveries || []).map(
                              (p, i) => {
                                if (p.id === selectedConsigneeCustomer?.id) {
                                  p.customer = {
                                    ...p.customer,
                                    code: e.target.value.toUpperCase(),
                                  };
                                }
                                return p;
                              }
                            ),
                          });

                          setSelectedConsigneeCustomer({
                            ...selectedConsigneeCustomer,
                            code: e.target.value.toUpperCase(),
                            code_number: 0,
                          });
                        }
                      }}
                      value={
                        (selectedConsigneeCustomer.code_number || 0) === 0
                          ? selectedConsigneeCustomer.code || ""
                          : selectedConsigneeCustomer.code +
                          selectedConsigneeCustomer.code_number
                      }
                    />
                  </div>
                  <div className="form-h-sep"></div>
                  <div className="input-box-container grow">
                    <input
                      tabIndex={36 + props.tabTimes}
                      type="text"
                      placeholder="Name"
                      // onKeyDown={validateConsigneeCompanyInfoForSaving}
                      onInput={(e) => {
                        if ((selectedConsigneeCustomer?.id || 0) === 0) {
                          if (
                            (selectedOrder?.deliveries || []).find(
                              (p) => p.id === 0
                            ) === undefined
                          ) {
                            setSelectedOrder({
                              ...selectedOrder,
                              deliveries: [
                                ...(selectedOrder?.deliveries || []),
                                {
                                  id: 0,
                                  customer: {
                                    id: 0,
                                    name: e.target.value,
                                  },
                                },
                              ],
                            });
                          } else {
                            setSelectedOrder({
                              ...selectedOrder,
                              deliveries: (selectedOrder?.deliveries || []).map(
                                (p, i) => {
                                  if (p.id === 0) {
                                    p.customer = {
                                      ...p.customer,
                                      name: e.target.value,
                                    };
                                  }
                                  return p;
                                }
                              ),
                            });
                          }

                          setSelectedConsigneeCustomer({
                            ...selectedConsigneeCustomer,
                            id: 0,
                            name: e.target.value,
                          });
                        } else {
                          setSelectedOrder({
                            ...selectedOrder,
                            deliveries: (selectedOrder?.deliveries || []).map(
                              (p, i) => {
                                if (p.id === selectedConsigneeCustomer?.id) {
                                  p.customer = {
                                    ...p.customer,
                                    name: e.target.value,
                                  };
                                }
                                return p;
                              }
                            ),
                          });

                          setSelectedConsigneeCustomer({
                            ...selectedConsigneeCustomer,
                            name: e.target.value,
                          });
                        }
                      }}
                      onChange={(e) => {
                        if ((selectedConsigneeCustomer?.id || 0) === 0) {
                          if (
                            (selectedOrder?.deliveries || []).find(
                              (p) => p.id === 0
                            ) === undefined
                          ) {
                            setSelectedOrder({
                              ...selectedOrder,
                              deliveries: [
                                ...(selectedOrder?.deliveries || []),
                                {
                                  id: 0,
                                  customer: {
                                    id: 0,
                                    name: e.target.value,
                                  },
                                },
                              ],
                            });
                          } else {
                            setSelectedOrder({
                              ...selectedOrder,
                              deliveries: (selectedOrder?.deliveries || []).map(
                                (p, i) => {
                                  if (p.id === 0) {
                                    p.customer = {
                                      ...p.customer,
                                      name: e.target.value,
                                    };
                                  }
                                  return p;
                                }
                              ),
                            });
                          }

                          setSelectedConsigneeCustomer({
                            ...selectedConsigneeCustomer,
                            id: 0,
                            name: e.target.value,
                          });
                        } else {
                          setSelectedOrder({
                            ...selectedOrder,
                            deliveries: (selectedOrder?.deliveries || []).map(
                              (p, i) => {
                                if (p.id === selectedConsigneeCustomer.id) {
                                  p.customer = {
                                    ...p.customer,
                                    name: e.target.value,
                                  };
                                }
                                return p;
                              }
                            ),
                          });

                          setSelectedConsigneeCustomer({
                            ...selectedConsigneeCustomer,
                            name: e.target.value,
                          });
                        }
                      }}
                      value={selectedConsigneeCustomer?.name || ""}
                    />
                  </div>
                </div>

                {consigneeFirstPageTransition(
                  (style, item) =>
                    item && (
                      <animated.div
                        className="form-page first-page consignee-first-page"
                        style={{
                          ...style,
                        }}
                      >
                        <div className="form-row">
                          <div className="input-box-container grow">
                            <input
                              tabIndex={37 + props.tabTimes}
                              type="text"
                              placeholder="Address 1"
                              // onKeyDown={validateConsigneeCompanyInfoForSaving}
                              onInput={(e) => {
                                if (
                                  (selectedConsigneeCustomer?.id || 0) === 0
                                ) {
                                  if (
                                    (selectedOrder?.deliveries || []).find(
                                      (p) => p.id === 0
                                    ) === undefined
                                  ) {
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      deliveries: [
                                        ...(selectedOrder?.deliveries || []),
                                        {
                                          id: 0,
                                          customer: {
                                            id: 0,
                                            address1: e.target.value,
                                          },
                                        },
                                      ],
                                    });
                                  } else {
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      deliveries: (
                                        selectedOrder?.deliveries || []
                                      ).map((p, i) => {
                                        if (p.id === 0) {
                                          p.customer = {
                                            ...p.customer,
                                            address1: e.target.value,
                                          };
                                        }
                                        return p;
                                      }),
                                    });
                                  }

                                  setSelectedConsigneeCustomer({
                                    ...selectedConsigneeCustomer,
                                    id: 0,
                                    address1: e.target.value,
                                  });
                                } else {
                                  setSelectedOrder({
                                    ...selectedOrder,
                                    deliveries: (
                                      selectedOrder?.deliveries || []
                                    ).map((p, i) => {
                                      if (
                                        p.id === selectedConsigneeCustomer?.id
                                      ) {
                                        p.customer = {
                                          ...p.customer,
                                          address1: e.target.value,
                                        };
                                      }
                                      return p;
                                    }),
                                  });

                                  setSelectedConsigneeCustomer({
                                    ...selectedConsigneeCustomer,
                                    address1: e.target.value,
                                  });
                                }
                              }}
                              onChange={(e) => {
                                if (
                                  (selectedConsigneeCustomer?.id || 0) === 0
                                ) {
                                  if (
                                    (selectedOrder?.deliveries || []).find(
                                      (p) => p.id === 0
                                    ) === undefined
                                  ) {
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      deliveries: [
                                        ...(selectedOrder?.deliveries || []),
                                        {
                                          id: 0,
                                          customer: {
                                            id: 0,
                                            address1: e.target.value,
                                          },
                                        },
                                      ],
                                    });
                                  } else {
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      deliveries: (
                                        selectedOrder?.deliveries || []
                                      ).map((p, i) => {
                                        if (p.id === 0) {
                                          p.customer = {
                                            ...p.customer,
                                            address1: e.target.value,
                                          };
                                        }
                                        return p;
                                      }),
                                    });
                                  }

                                  setSelectedConsigneeCustomer({
                                    ...selectedConsigneeCustomer,
                                    id: 0,
                                    address1: e.target.value,
                                  });
                                } else {
                                  setSelectedOrder({
                                    ...selectedOrder,
                                    deliveries: (
                                      selectedOrder?.deliveries || []
                                    ).map((p, i) => {
                                      if (p.id === 0) {
                                        p.customer = {
                                          ...p.customer,
                                          address1: e.target.value,
                                        };
                                      }
                                      return p;
                                    }),
                                  });

                                  setSelectedConsigneeCustomer({
                                    ...selectedConsigneeCustomer,
                                    address1: e.target.value,
                                  });
                                }
                              }}
                              value={selectedConsigneeCustomer?.address1 || ""}
                            />
                          </div>
                        </div>

                        <div className="form-row">
                          <div className="input-box-container grow">
                            <input
                              tabIndex={38 + props.tabTimes}
                              type="text"
                              placeholder="Address 2"
                              // onKeyDown={validateConsigneeCompanyInfoForSaving}
                              onInput={(e) => {
                                if (
                                  (selectedConsigneeCustomer?.id || 0) === 0
                                ) {
                                  if (
                                    (selectedOrder?.deliveries || []).find(
                                      (p) => p.id === 0
                                    ) === undefined
                                  ) {
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      deliveries: [
                                        ...(selectedOrder?.deliveries || []),
                                        {
                                          id: 0,
                                          customer: {
                                            id: 0,
                                            address2: e.target.value,
                                          },
                                        },
                                      ],
                                    });
                                  } else {
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      deliveries: (
                                        selectedOrder?.deliveries || []
                                      ).map((p, i) => {
                                        if (p.id === 0) {
                                          p.customer = {
                                            ...p.customer,
                                            address2: e.target.value,
                                          };
                                        }
                                        return p;
                                      }),
                                    });
                                  }

                                  setSelectedConsigneeCustomer({
                                    ...selectedConsigneeCustomer,
                                    id: 0,
                                    address2: e.target.value,
                                  });
                                } else {
                                  setSelectedOrder({
                                    ...selectedOrder,
                                    deliveries: (
                                      selectedOrder?.deliveries || []
                                    ).map((p, i) => {
                                      if (
                                        p.id === selectedConsigneeCustomer?.id
                                      ) {
                                        p.customer = {
                                          ...p.customer,
                                          address2: e.target.value,
                                        };
                                      }
                                      return p;
                                    }),
                                  });

                                  setSelectedConsigneeCustomer({
                                    ...selectedConsigneeCustomer,
                                    address2: e.target.value,
                                  });
                                }
                              }}
                              onChange={(e) => {
                                if (
                                  (selectedConsigneeCustomer?.id || 0) === 0
                                ) {
                                  if (
                                    (selectedOrder?.deliveries || []).find(
                                      (p) => p.id === 0
                                    ) === undefined
                                  ) {
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      deliveries: [
                                        ...(selectedOrder?.deliveries || []),
                                        {
                                          id: 0,
                                          customer: {
                                            id: 0,
                                            address2: e.target.value,
                                          },
                                        },
                                      ],
                                    });
                                  } else {
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      deliveries: (
                                        selectedOrder?.deliveries || []
                                      ).map((p, i) => {
                                        if (p.id === 0) {
                                          p.customer = {
                                            ...p.customer,
                                            address2: e.target.value,
                                          };
                                        }
                                        return p;
                                      }),
                                    });
                                  }

                                  setSelectedConsigneeCustomer({
                                    ...selectedConsigneeCustomer,
                                    id: 0,
                                    address2: e.target.value,
                                  });
                                } else {
                                  setSelectedOrder({
                                    ...selectedOrder,
                                    deliveries: (
                                      selectedOrder?.deliveries || []
                                    ).map((p, i) => {
                                      if (p.id === 0) {
                                        p.customer = {
                                          ...p.customer,
                                          address2: e.target.value,
                                        };
                                      }
                                      return p;
                                    }),
                                  });

                                  setSelectedConsigneeCustomer({
                                    ...selectedConsigneeCustomer,
                                    address2: e.target.value,
                                  });
                                }
                              }}
                              value={selectedConsigneeCustomer?.address2 || ""}
                            />
                          </div>
                        </div>

                        <div className="form-row">
                          <div className="input-box-container grow">
                            <input
                              tabIndex={39 + props.tabTimes}
                              type="text"
                              placeholder="City"
                              // onKeyDown={validateConsigneeCompanyInfoForSaving}
                              onInput={(e) => {
                                if (
                                  (selectedConsigneeCustomer?.id || 0) === 0
                                ) {
                                  if (
                                    (selectedOrder?.deliveries || []).find(
                                      (p) => p.id === 0
                                    ) === undefined
                                  ) {
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      deliveries: [
                                        ...(selectedOrder?.deliveries || []),
                                        {
                                          id: 0,
                                          customer: {
                                            id: 0,
                                            city: e.target.value,
                                          },
                                        },
                                      ],
                                    });
                                  } else {
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      deliveries: (
                                        selectedOrder?.deliveries || []
                                      ).map((p, i) => {
                                        if (p.id === 0) {
                                          p.customer = {
                                            ...p.customer,
                                            city: e.target.value,
                                          };
                                        }
                                        return p;
                                      }),
                                    });
                                  }

                                  setSelectedConsigneeCustomer({
                                    ...selectedConsigneeCustomer,
                                    id: 0,
                                    city: e.target.value,
                                  });
                                } else {
                                  setSelectedOrder({
                                    ...selectedOrder,
                                    deliveries: (
                                      selectedOrder?.deliveries || []
                                    ).map((p, i) => {
                                      if (p.id === 0) {
                                        p.customer = {
                                          ...p.customer,
                                          city: e.target.value,
                                        };
                                      }
                                      return p;
                                    }),
                                  });

                                  setSelectedConsigneeCustomer({
                                    ...selectedConsigneeCustomer,
                                    city: e.target.value,
                                  });
                                }
                              }}
                              onChange={(e) => {
                                if (
                                  (selectedConsigneeCustomer?.id || 0) === 0
                                ) {
                                  if (
                                    (selectedOrder?.deliveries || []).find(
                                      (p) => p.id === 0
                                    ) === undefined
                                  ) {
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      deliveries: [
                                        ...(selectedOrder?.deliveries || []),
                                        {
                                          id: 0,
                                          customer: {
                                            id: 0,
                                            city: e.target.value,
                                          },
                                        },
                                      ],
                                    });
                                  } else {
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      deliveries: (
                                        selectedOrder?.deliveries || []
                                      ).map((p, i) => {
                                        if (p.id === 0) {
                                          p.customer = {
                                            ...p.customer,
                                            city: e.target.value,
                                          };
                                        }
                                        return p;
                                      }),
                                    });
                                  }

                                  setSelectedConsigneeCustomer({
                                    ...selectedConsigneeCustomer,
                                    id: 0,
                                    city: e.target.value,
                                  });
                                } else {
                                  setSelectedOrder({
                                    ...selectedOrder,
                                    deliveries: (
                                      selectedOrder?.deliveries || []
                                    ).map((p, i) => {
                                      if (p.id === 0) {
                                        p.customer = {
                                          ...p.customer,
                                          city: e.target.value,
                                        };
                                      }
                                      return p;
                                    }),
                                  });

                                  setSelectedConsigneeCustomer({
                                    ...selectedConsigneeCustomer,
                                    city: e.target.value,
                                  });
                                }
                              }}
                              value={selectedConsigneeCustomer?.city || ""}
                            />
                          </div>
                          <div className="form-h-sep"></div>
                          <div className="input-box-container input-state">
                            <input
                              tabIndex={40 + props.tabTimes}
                              type="text"
                              placeholder="State"
                              maxLength="2"
                              // onKeyDown={validateConsigneeCompanyInfoForSaving}
                              onInput={(e) => {
                                if (
                                  (selectedConsigneeCustomer?.id || 0) === 0
                                ) {
                                  if (
                                    (selectedOrder?.deliveries || []).find(
                                      (p) => p.id === 0
                                    ) === undefined
                                  ) {
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      deliveries: [
                                        ...(selectedOrder?.deliveries || []),
                                        {
                                          id: 0,
                                          customer: {
                                            id: 0,
                                            state: e.target.value.toUpperCase(),
                                          },
                                        },
                                      ],
                                    });
                                  } else {
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      deliveries: (
                                        selectedOrder?.deliveries || []
                                      ).map((p, i) => {
                                        if (p.id === 0) {
                                          p.customer = {
                                            ...p.customer,
                                            state: e.target.value.toUpperCase(),
                                          };
                                        }
                                        return p;
                                      }),
                                    });
                                  }

                                  setSelectedConsigneeCustomer({
                                    ...selectedConsigneeCustomer,
                                    id: 0,
                                    state: e.target.value.toUpperCase(),
                                  });
                                } else {
                                  setSelectedOrder({
                                    ...selectedOrder,
                                    deliveries: (
                                      selectedOrder?.deliveries || []
                                    ).map((p, i) => {
                                      if (p.id === 0) {
                                        p.customer = {
                                          ...p.customer,
                                          state: e.target.value.toUpperCase(),
                                        };
                                      }
                                      return p;
                                    }),
                                  });

                                  setSelectedConsigneeCustomer({
                                    ...selectedConsigneeCustomer,
                                    state: e.target.value.toUpperCase(),
                                  });
                                }
                              }}
                              onChange={(e) => {
                                if (
                                  (selectedConsigneeCustomer?.id || 0) === 0
                                ) {
                                  if (
                                    (selectedOrder?.deliveries || []).find(
                                      (p) => p.id === 0
                                    ) === undefined
                                  ) {
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      deliveries: [
                                        ...(selectedOrder?.deliveries || []),
                                        {
                                          id: 0,
                                          customer: {
                                            id: 0,
                                            state: e.target.value.toUpperCase(),
                                          },
                                        },
                                      ],
                                    });
                                  } else {
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      deliveries: (
                                        selectedOrder?.deliveries || []
                                      ).map((p, i) => {
                                        if (p.id === 0) {
                                          p.customer = {
                                            ...p.customer,
                                            state: e.target.value.toUpperCase(),
                                          };
                                        }
                                        return p;
                                      }),
                                    });
                                  }

                                  setSelectedConsigneeCustomer({
                                    ...selectedConsigneeCustomer,
                                    id: 0,
                                    state: e.target.value.toUpperCase(),
                                  });
                                } else {
                                  setSelectedOrder({
                                    ...selectedOrder,
                                    deliveries: (
                                      selectedOrder?.deliveries || []
                                    ).map((p, i) => {
                                      if (p.id === 0) {
                                        p.customer = {
                                          ...p.customer,
                                          state: e.target.value.toUpperCase(),
                                        };
                                      }
                                      return p;
                                    }),
                                  });

                                  setSelectedConsigneeCustomer({
                                    ...selectedConsigneeCustomer,
                                    state: e.target.value.toUpperCase(),
                                  });
                                }
                              }}
                              value={selectedConsigneeCustomer?.state || ""}
                            />
                          </div>
                          <div className="form-h-sep"></div>
                          <div className="input-box-container input-zip-code">
                            <input
                              tabIndex={41 + props.tabTimes}
                              type="text"
                              placeholder="Postal Code"
                              onKeyDown={validateConsigneeCompanyInfoForSaving}
                              onInput={(e) => {
                                if (
                                  (selectedConsigneeCustomer?.id || 0) === 0
                                ) {
                                  if (
                                    (selectedOrder?.deliveries || []).find(
                                      (p) => p.id === 0
                                    ) === undefined
                                  ) {
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      deliveries: [
                                        ...(selectedOrder?.deliveries || []),
                                        {
                                          id: 0,
                                          customer: {
                                            id: 0,
                                            zip: e.target.value,
                                          },
                                        },
                                      ],
                                    });
                                  } else {
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      deliveries: (
                                        selectedOrder?.deliveries || []
                                      ).map((p, i) => {
                                        if (p.id === 0) {
                                          p.customer = {
                                            ...p.customer,
                                            zip: e.target.value,
                                          };
                                        }
                                        return p;
                                      }),
                                    });
                                  }

                                  setSelectedConsigneeCustomer({
                                    ...selectedConsigneeCustomer,
                                    id: 0,
                                    zip: e.target.value,
                                  });
                                } else {
                                  setSelectedOrder({
                                    ...selectedOrder,
                                    deliveries: (
                                      selectedOrder?.deliveries || []
                                    ).map((p, i) => {
                                      if (p.id === 0) {
                                        p.customer = {
                                          ...p.customer,
                                          zip: e.target.value,
                                        };
                                      }
                                      return p;
                                    }),
                                  });

                                  setSelectedConsigneeCustomer({
                                    ...selectedConsigneeCustomer,
                                    zip: e.target.value,
                                  });
                                }
                              }}
                              onChange={(e) => {
                                if (
                                  (selectedConsigneeCustomer?.id || 0) === 0
                                ) {
                                  if (
                                    (selectedOrder?.deliveries || []).find(
                                      (p) => p.id === 0
                                    ) === undefined
                                  ) {
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      deliveries: [
                                        ...(selectedOrder?.deliveries || []),
                                        {
                                          id: 0,
                                          customer: {
                                            id: 0,
                                            zip: e.target.value,
                                          },
                                        },
                                      ],
                                    });
                                  } else {
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      deliveries: (
                                        selectedOrder?.deliveries || []
                                      ).map((p, i) => {
                                        if (p.id === 0) {
                                          p.customer = {
                                            ...p.customer,
                                            zip: e.target.value,
                                          };
                                        }
                                        return p;
                                      }),
                                    });
                                  }

                                  setSelectedConsigneeCustomer({
                                    ...selectedConsigneeCustomer,
                                    id: 0,
                                    zip: e.target.value,
                                  });
                                } else {
                                  setSelectedOrder({
                                    ...selectedOrder,
                                    deliveries: (
                                      selectedOrder?.deliveries || []
                                    ).map((p, i) => {
                                      if (p.id === 0) {
                                        p.customer = {
                                          ...p.customer,
                                          zip: e.target.value,
                                        };
                                      }
                                      return p;
                                    }),
                                  });

                                  setSelectedConsigneeCustomer({
                                    ...selectedConsigneeCustomer,
                                    zip: e.target.value,
                                  });
                                }
                              }}
                              value={selectedConsigneeCustomer?.zip || ""}
                            />
                          </div>
                        </div>

                        <div className="form-row">
                          <div className="input-box-container grow">
                            <input
                              tabIndex={42 + props.tabTimes}
                              type="text"
                              placeholder="Contact Name"
                              // onKeyDown={validateConsigneeCompanyContactForSaving}
                              onChange={(e) => {
                                if (
                                  (selectedConsigneeCustomer?.id || 0) === 0
                                ) {
                                  if (
                                    (selectedOrder?.deliveries || []).find(
                                      (p) => p.id === 0
                                    ) === undefined
                                  ) {
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      deliveries: [
                                        ...(selectedOrder?.deliveries || []),
                                        {
                                          id: 0,
                                          customer: {
                                            contact_name: e.target.value,
                                          },
                                        },
                                      ],
                                    });
                                  } else {
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      deliveries: (
                                        selectedOrder?.deliveries || []
                                      ).map((p, i) => {
                                        if (p.id === 0) {
                                          p.customer = {
                                            ...p.customer,
                                            contact_name: e.target.value,
                                          };
                                        }
                                        return p;
                                      }),
                                    });
                                  }

                                  setSelectedConsigneeCustomer({
                                    ...selectedConsigneeCustomer,
                                    contact_name: e.target.value,
                                  });
                                } else {
                                  if (
                                    (selectedConsigneeCustomer?.contacts || [])
                                      .length === 0
                                  ) {
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      deliveries: (
                                        selectedOrder?.deliveries || []
                                      ).map((p, i) => {
                                        if (p.id === 0) {
                                          p.customer = {
                                            ...p.customer,
                                            contact_name: e.target.value,
                                          };
                                        }
                                        return p;
                                      }),
                                    });

                                    setSelectedConsigneeCustomer({
                                      ...selectedConsigneeCustomer,
                                      contact_name: e.target.value,
                                    });
                                  }
                                }
                              }}
                              onInput={(e) => {
                                if (
                                  (selectedConsigneeCustomer?.id || 0) === 0
                                ) {
                                  if (
                                    (selectedOrder?.deliveries || []).find(
                                      (p) => p.id === 0
                                    ) === undefined
                                  ) {
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      deliveries: [
                                        ...(selectedOrder?.deliveries || []),
                                        {
                                          id: 0,
                                          customer: {
                                            contact_name: e.target.value,
                                          },
                                        },
                                      ],
                                    });
                                  } else {
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      deliveries: (
                                        selectedOrder?.deliveries || []
                                      ).map((p, i) => {
                                        if (p.id === 0) {
                                          p.customer = {
                                            ...p.customer,
                                            contact_name: e.target.value,
                                          };
                                        }
                                        return p;
                                      }),
                                    });
                                  }

                                  setSelectedConsigneeCustomer({
                                    ...selectedConsigneeCustomer,
                                    contact_name: e.target.value,
                                  });
                                } else {
                                  if (
                                    (selectedConsigneeCustomer?.contacts || [])
                                      .length === 0
                                  ) {
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      deliveries: (
                                        selectedOrder?.deliveries || []
                                      ).map((p, i) => {
                                        if (p.id === 0) {
                                          p.customer = {
                                            ...p.customer,
                                            contact_name: e.target.value,
                                          };
                                        }
                                        return p;
                                      }),
                                    });

                                    setSelectedConsigneeCustomer({
                                      ...selectedConsigneeCustomer,
                                      contact_name: e.target.value,
                                    });
                                  }
                                }
                              }}
                              value={
                                (
                                  selectedConsigneeCustomer?.contacts || []
                                ).find((c) => c.is_primary === 1) === undefined
                                  ? selectedConsigneeCustomer?.contact_name ||
                                  ""
                                  : selectedConsigneeCustomer?.contacts.find(
                                    (c) => c.is_primary === 1
                                  ).first_name +
                                  " " +
                                  selectedConsigneeCustomer?.contacts.find(
                                    (c) => c.is_primary === 1
                                  ).last_name
                              }
                            />
                          </div>
                          <div className="form-h-sep"></div>
                          <div
                            className="input-box-container input-phone"
                            style={{ position: "relative" }}
                          >
                            <MaskedInput
                              tabIndex={43 + props.tabTimes}
                              mask={[
                                /[0-9]/,
                                /\d/,
                                /\d/,
                                "-",
                                /\d/,
                                /\d/,
                                /\d/,
                                "-",
                                /\d/,
                                /\d/,
                                /\d/,
                                /\d/,
                              ]}
                              guide={true}
                              type="text"
                              placeholder="Contact Phone"
                              // onKeyDown={validateConsigneeCompanyContactForSaving}
                              onInput={(e) => {
                                if (
                                  (selectedConsigneeCustomer?.id || 0) === 0
                                ) {
                                  if (
                                    (selectedOrder?.deliveries || []).find(
                                      (p) => p.id === 0
                                    ) === undefined
                                  ) {
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      deliveries: [
                                        ...(selectedOrder?.deliveries || []),
                                        {
                                          id: 0,
                                          customer: {
                                            contact_phone: e.target.value,
                                          },
                                        },
                                      ],
                                    });
                                  } else {
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      deliveries: (
                                        selectedOrder?.deliveries || []
                                      ).map((p, i) => {
                                        if (p.id === 0) {
                                          p.customer = {
                                            ...p.customer,
                                            contact_phone: e.target.value,
                                          };
                                        }
                                        return p;
                                      }),
                                    });
                                  }

                                  setSelectedConsigneeCustomer({
                                    ...selectedConsigneeCustomer,
                                    contact_phone: e.target.value,
                                  });
                                } else {
                                  if (
                                    (selectedConsigneeCustomer?.contacts || [])
                                      .length === 0
                                  ) {
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      pickups: (
                                        selectedOrder?.pickups || []
                                      ).map((p, i) => {
                                        if (p.id === 0) {
                                          p.customer = {
                                            ...p.customer,
                                            contact_phone: e.target.value,
                                          };
                                        }
                                        return p;
                                      }),
                                    });

                                    setSelectedConsigneeCustomer({
                                      ...selectedConsigneeCustomer,
                                      contact_phone: e.target.value,
                                    });
                                  }
                                }
                              }}
                              onChange={(e) => {
                                if (
                                  (selectedConsigneeCustomer?.id || 0) === 0
                                ) {
                                  if (
                                    (selectedOrder?.deliveries || []).find(
                                      (p) => p.id === 0
                                    ) === undefined
                                  ) {
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      deliveries: [
                                        ...(selectedOrder?.deliveries || []),
                                        {
                                          id: 0,
                                          customer: {
                                            contact_phone: e.target.value,
                                          },
                                        },
                                      ],
                                    });
                                  } else {
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      deliveries: (
                                        selectedOrder?.deliveries || []
                                      ).map((p, i) => {
                                        if (p.id === 0) {
                                          p.customer = {
                                            ...p.customer,
                                            contact_phone: e.target.value,
                                          };
                                        }
                                        return p;
                                      }),
                                    });
                                  }

                                  setSelectedConsigneeCustomer({
                                    ...selectedConsigneeCustomer,
                                    contact_phone: e.target.value,
                                  });
                                } else {
                                  if (
                                    (selectedConsigneeCustomer?.contacts || [])
                                      .length === 0
                                  ) {
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      pickups: (
                                        selectedOrder?.deliveries || []
                                      ).map((p, i) => {
                                        if (p.id === 0) {
                                          p.customer = {
                                            ...p.customer,
                                            contact_phone: e.target.value,
                                          };
                                        }
                                        return p;
                                      }),
                                    });

                                    setSelectedConsigneeCustomer({
                                      ...selectedConsigneeCustomer,
                                      contact_phone: e.target.value,
                                    });
                                  }
                                }
                              }}
                              value={
                                (
                                  selectedConsigneeCustomer?.contacts || []
                                ).find((c) => c.is_primary === 1) === undefined
                                  ? selectedConsigneeCustomer?.contact_phone ||
                                  ""
                                  : selectedConsigneeCustomer?.contacts.find(
                                    (c) => c.is_primary === 1
                                  ).primary_phone === "work"
                                    ? selectedConsigneeCustomer?.contacts.find(
                                      (c) => c.is_primary === 1
                                    ).phone_work
                                    : selectedConsigneeCustomer?.contacts.find(
                                      (c) => c.is_primary === 1
                                    ).primary_phone === "fax"
                                      ? selectedConsigneeCustomer?.contacts.find(
                                        (c) => c.is_primary === 1
                                      ).phone_work_fax
                                      : selectedConsigneeCustomer?.contacts.find(
                                        (c) => c.is_primary === 1
                                      ).primary_phone === "mobile"
                                        ? selectedConsigneeCustomer?.contacts.find(
                                          (c) => c.is_primary === 1
                                        ).phone_mobile
                                        : selectedConsigneeCustomer?.contacts.find(
                                          (c) => c.is_primary === 1
                                        ).primary_phone === "direct"
                                          ? selectedConsigneeCustomer?.contacts.find(
                                            (c) => c.is_primary === 1
                                          ).phone_direct
                                          : selectedConsigneeCustomer?.contacts.find(
                                            (c) => c.is_primary === 1
                                          ).primary_phone === "other"
                                            ? selectedConsigneeCustomer?.contacts.find(
                                              (c) => c.is_primary === 1
                                            ).phone_other
                                            : ""
                              }
                            />

                            {(selectedConsigneeCustomer?.contacts || []).find(
                              (c) => c.is_primary === 1
                            ) !== undefined && (
                                <div
                                  className={classnames({
                                    "selected-customer-contact-primary-phone": true,
                                    pushed: false,
                                  })}
                                >
                                  {
                                    selectedConsigneeCustomer?.contacts.find(
                                      (c) => c.is_primary === 1
                                    ).primary_phone
                                  }
                                </div>
                              )}
                          </div>
                          <div className="form-h-sep"></div>
                          <div className="input-box-container input-phone-ext">
                            <input
                              tabIndex={44 + props.tabTimes}
                              type="text"
                              placeholder="Ext"
                              onKeyDown={
                                validateConsigneeCompanyContactForSaving
                              }
                              onInput={(e) => {
                                if (
                                  (selectedConsigneeCustomer?.id || 0) === 0
                                ) {
                                  if (
                                    (selectedOrder?.deliveries || []).find(
                                      (p) => p.id === 0
                                    ) === undefined
                                  ) {
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      deliveries: [
                                        ...(selectedOrder?.deliveries || []),
                                        {
                                          id: 0,
                                          customer: {
                                            ext: e.target.value,
                                          },
                                        },
                                      ],
                                    });
                                  } else {
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      deliveries: (
                                        selectedOrder?.deliveries || []
                                      ).map((p, i) => {
                                        if (p.id === 0) {
                                          p.customer = {
                                            ...p.customer,
                                            ext: e.target.value,
                                          };
                                        }
                                        return p;
                                      }),
                                    });
                                  }

                                  setSelectedConsigneeCustomer({
                                    ...selectedConsigneeCustomer,
                                    ext: e.target.value,
                                  });
                                } else {
                                  if (
                                    (selectedConsigneeCustomer?.contacts || [])
                                      .length === 0
                                  ) {
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      deliveries: (
                                        selectedOrder?.deliveries || []
                                      ).map((p, i) => {
                                        if (p.id === 0) {
                                          p.customer = {
                                            ...p.customer,
                                            ext: e.target.value,
                                          };
                                        }
                                        return p;
                                      }),
                                    });

                                    setSelectedConsigneeCustomer({
                                      ...selectedConsigneeCustomer,
                                      ext: e.target.value,
                                    });
                                  }
                                }
                              }}
                              onChange={(e) => {
                                if (
                                  (selectedConsigneeCustomer?.id || 0) === 0
                                ) {
                                  if (
                                    (selectedOrder?.deliveries || []).find(
                                      (p) => p.id === 0
                                    ) === undefined
                                  ) {
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      deliveries: [
                                        ...(selectedOrder?.deliveries || []),
                                        {
                                          id: 0,
                                          customer: {
                                            ext: e.target.value,
                                          },
                                        },
                                      ],
                                    });
                                  } else {
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      deliveries: (
                                        selectedOrder?.deliveries || []
                                      ).map((p, i) => {
                                        if (p.id === 0) {
                                          p.customer = {
                                            ...p.customer,
                                            ext: e.target.value,
                                          };
                                        }
                                        return p;
                                      }),
                                    });
                                  }

                                  setSelectedConsigneeCustomer({
                                    ...selectedConsigneeCustomer,
                                    ext: e.target.value,
                                  });
                                } else {
                                  if (
                                    (selectedConsigneeCustomer?.contacts || [])
                                      .length === 0
                                  ) {
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      deliveries: (
                                        selectedOrder?.deliveries || []
                                      ).map((p, i) => {
                                        if (p.id === 0) {
                                          p.customer = {
                                            ...p.customer,
                                            ext: e.target.value,
                                          };
                                        }
                                        return p;
                                      }),
                                    });

                                    setSelectedConsigneeCustomer({
                                      ...selectedConsigneeCustomer,
                                      ext: e.target.value,
                                    });
                                  }
                                }
                              }}
                              value={
                                (
                                  selectedConsigneeCustomer?.contacts || []
                                ).find((c) => c.is_primary === 1) === undefined
                                  ? selectedConsigneeCustomer?.ext || ""
                                  : selectedConsigneeCustomer?.contacts.find(
                                    (c) => c.is_primary === 1
                                  ).phone_ext
                              }
                            />
                          </div>
                        </div>
                      </animated.div>
                    )
                )}

                {consigneeSecondPageTransition(
                  (style, item) =>
                    item && (
                      <animated.div
                        className="form-page second-page consignee-second-page"
                        style={{
                          ...style,
                        }}
                      >
                        <div
                          className="form-row"
                          style={{ alignItems: "center" }}
                        >
                          <div
                            className="select-box-container"
                            style={{ flexGrow: 1, position: "relative" }}
                          >
                            <div className="select-box-wrapper">
                              <MaskedInput
                                tabIndex={46 + props.tabTimes}
                                ref={refDeliveryDate1}
                                mask={[
                                  /[0-9]/,
                                  /\d/,
                                  "/",
                                  /\d/,
                                  /\d/,
                                  "/",
                                  /\d/,
                                  /\d/,
                                  /\d/,
                                  /\d/,
                                ]}
                                guide={false}
                                type="text"
                                placeholder="Delivery Date 1"
                                autoFocus={true}
                                onKeyDown={async (e) => {
                                  e.stopPropagation();
                                  let key = e.keyCode || e.which;
                                  await setDeliveryDate1KeyCode(key);

                                  let deliveryDate1 =
                                    e.target.value.trim() === ""
                                      ? moment()
                                      : moment(
                                        getFormattedDates(
                                          selectedConsigneeCustomer?.delivery_date1 ||
                                          ""
                                        ),
                                        "MM/DD/YYYY"
                                      );
                                  await setPreSelectedDeliveryDate1(
                                    deliveryDate1
                                  );

                                  if (key === 13) {
                                    if (isDeliveryDate1CalendarShown) {
                                      await setSelectedConsigneeCustomer({
                                        ...selectedConsigneeCustomer,
                                        delivery_date1: preSelectedDeliveryDate1
                                          .clone()
                                          .format("MM/DD/YYYY"),
                                        delivery_date2: preSelectedDeliveryDate1
                                          .clone()
                                          .format("MM/DD/YYYY"),
                                      });

                                      await setSelectedOrder({
                                        ...selectedOrder,
                                        deliveries: (
                                          selectedOrder?.deliveries || []
                                        ).map((delivery, i) => {
                                          if (
                                            delivery.id ===
                                            (selectedConsigneeCustomer?.delivery_id ||
                                              0)
                                          ) {
                                            delivery.delivery_date1 =
                                              preSelectedDeliveryDate1
                                                .clone()
                                                .format("MM/DD/YYYY");
                                            delivery.delivery_date2 =
                                              preSelectedDeliveryDate1
                                                .clone()
                                                .format("MM/DD/YYYY");
                                            setIsSavingDeliveryId(-1);
                                            setIsSavingDeliveryId(delivery.id);
                                          }
                                          return delivery;
                                        }),
                                      });

                                      await setIsPickupDate1CalendarShown(
                                        false
                                      );
                                      await setIsPickupDate2CalendarShown(
                                        false
                                      );
                                      await setIsDeliveryDate1CalendarShown(
                                        false
                                      );
                                      await setIsDeliveryDate2CalendarShown(
                                        false
                                      );

                                      refDeliveryTime1.current.focus();
                                    }
                                  }

                                  if (key >= 37 && key <= 40) {
                                    if (isDeliveryDate1CalendarShown) {
                                      e.preventDefault();

                                      if (key === 37) {
                                        // left - minus 1
                                        setPreSelectedDeliveryDate1(
                                          preSelectedDeliveryDate1
                                            .clone()
                                            .subtract(1, "day")
                                        );
                                      }

                                      if (key === 38) {
                                        // up - minus 7
                                        setPreSelectedDeliveryDate1(
                                          preSelectedDeliveryDate1
                                            .clone()
                                            .subtract(7, "day")
                                        );
                                      }

                                      if (key === 39) {
                                        // right - plus 1
                                        setPreSelectedDeliveryDate1(
                                          preSelectedDeliveryDate1
                                            .clone()
                                            .add(1, "day")
                                        );
                                      }

                                      if (key === 40) {
                                        // down - plus 7
                                        setPreSelectedDeliveryDate1(
                                          preSelectedDeliveryDate1
                                            .clone()
                                            .add(7, "day")
                                        );
                                      }

                                      await setSelectedOrder({
                                        ...selectedOrder,
                                        deliveries: (
                                          selectedOrder?.deliveries || []
                                        ).map((delivery, i) => {
                                          if (
                                            delivery.id ===
                                            (selectedConsigneeCustomer?.delivery_id ||
                                              0)
                                          ) {
                                            delivery.delivery_date1 =
                                              preSelectedDeliveryDate1
                                                .clone()
                                                .format("MM/DD/YYYY");
                                          }
                                          return delivery;
                                        }),
                                      });
                                      // await validateOrderForSaving({ keyCode: 9 });
                                    } else {
                                      if (key === 38 || key === 40) {
                                        setIsDeliveryDate1CalendarShown(true);
                                      }
                                    }
                                  }
                                }}
                                onBlur={async (e) => {
                                  if (deliveryDate1KeyCode === 9) {
                                    let formatted = getFormattedDates(
                                      e.target.value
                                    );

                                    await setSelectedConsigneeCustomer({
                                      ...selectedConsigneeCustomer,
                                      delivery_date1: formatted,
                                      delivery_date2: formatted,
                                    });

                                    let deliveries = (
                                      selectedOrder?.deliveries || []
                                    ).map((delivery, i) => {
                                      if (
                                        delivery.id ===
                                        (selectedConsigneeCustomer?.delivery_id ||
                                          0)
                                      ) {
                                        delivery.delivery_date1 = formatted;
                                        delivery.delivery_date2 = formatted;
                                        setIsSavingDeliveryId(-1);
                                        setIsSavingDeliveryId(delivery.id);
                                      }
                                      return delivery;
                                    });

                                    await setSelectedOrder({
                                      ...selectedOrder,
                                      deliveries: deliveries,
                                    });
                                  }
                                }}
                                onInput={(e) => {
                                  setSelectedConsigneeCustomer({
                                    ...selectedConsigneeCustomer,
                                    delivery_date1: e.target.value,
                                  });

                                  setSelectedOrder({
                                    ...selectedOrder,
                                    deliveries: (
                                      selectedOrder?.deliveries || []
                                    ).map((delivery, i) => {
                                      if (
                                        delivery.id ===
                                        (selectedConsigneeCustomer?.delivery_id ||
                                          0)
                                      ) {
                                        delivery.delivery_date1 =
                                          e.target.value;
                                      }
                                      return delivery;
                                    }),
                                  });
                                }}
                                onChange={(e) => {
                                  setSelectedConsigneeCustomer({
                                    ...selectedConsigneeCustomer,
                                    delivery_date1: e.target.value,
                                  });

                                  setSelectedOrder({
                                    ...selectedOrder,
                                    deliveries: (
                                      selectedOrder?.deliveries || []
                                    ).map((delivery, i) => {
                                      if (
                                        delivery.id ===
                                        (selectedConsigneeCustomer?.delivery_id ||
                                          0)
                                      ) {
                                        delivery.delivery_date1 =
                                          e.target.value;
                                      }
                                      return delivery;
                                    }),
                                  });
                                }}
                                value={
                                  selectedConsigneeCustomer?.delivery_date1 ||
                                  ""
                                }
                              />

                              <FontAwesomeIcon
                                className="dropdown-button calendar"
                                icon={faCalendarAlt}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsDeliveryDate2CalendarShown(false);
                                  setIsPickupDate1CalendarShown(false);
                                  setIsPickupDate2CalendarShown(false);

                                  if (
                                    moment(
                                      (
                                        selectedConsigneeCustomer?.delivery_date1 ||
                                        ""
                                      ).trim(),
                                      "MM/DD/YYYY"
                                    ).format("MM/DD/YYYY") ===
                                    (
                                      selectedConsigneeCustomer?.delivery_date1 ||
                                      ""
                                    ).trim()
                                  ) {
                                    setPreSelectedDeliveryDate1(
                                      moment(
                                        selectedConsigneeCustomer?.delivery_date1,
                                        "MM/DD/YYYY"
                                      )
                                    );
                                  } else {
                                    setPreSelectedDeliveryDate1(moment());
                                  }

                                  window.setTimeout(async () => {
                                    await setIsDeliveryDate1CalendarShown(true);
                                    refDeliveryDate1.current.inputElement.focus();
                                  }, 0);
                                }}
                              />
                            </div>
                            {deliveryDate1Transition(
                              (style, item) =>
                                item && (
                                  <animated.div
                                    className="mochi-contextual-container"
                                    id="mochi-contextual-container-delivery-date1"
                                    style={{
                                      ...style,
                                      left: "0%",
                                      display: "block",
                                    }}
                                    ref={refDeliveryDate1CalendarDropDown}
                                  >
                                    <div
                                      className="mochi-contextual-popup vertical below right"
                                      style={{ height: 275 }}
                                    >
                                      <div className="mochi-contextual-popup-content">
                                        <div className="mochi-contextual-popup-wrapper">
                                          <Calendar
                                            value={
                                              moment(
                                                (
                                                  selectedConsigneeCustomer?.delivery_date1 ||
                                                  ""
                                                ).trim(),
                                                "MM/DD/YYYY"
                                              ).format("MM/DD/YYYY") ===
                                                (
                                                  selectedConsigneeCustomer?.delivery_date1 ||
                                                  ""
                                                ).trim()
                                                ? moment(
                                                  selectedConsigneeCustomer?.delivery_date1,
                                                  "MM/DD/YYYY"
                                                )
                                                : moment()
                                            }
                                            onChange={(day) => {
                                              setSelectedConsigneeCustomer(
                                                (selectedConsigneeCustomer) => {
                                                  return {
                                                    ...selectedConsigneeCustomer,
                                                    delivery_date1:
                                                      day.format("MM/DD/YYYY"),
                                                    delivery_date2:
                                                      day.format("MM/DD/YYYY"),
                                                  };
                                                }
                                              );

                                              setSelectedOrder(
                                                (selectedOrder) => {
                                                  return {
                                                    ...selectedOrder,
                                                    deliveries: (
                                                      selectedOrder?.deliveries ||
                                                      []
                                                    ).map((delivery, i) => {
                                                      if (
                                                        delivery.id ===
                                                        (selectedConsigneeCustomer?.delivery_id ||
                                                          0)
                                                      ) {
                                                        delivery.delivery_date1 =
                                                          preSelectedDeliveryDate1
                                                            .clone()
                                                            .format(
                                                              "MM/DD/YYYY"
                                                            );
                                                        delivery.delivery_date2 =
                                                          preSelectedDeliveryDate1
                                                            .clone()
                                                            .format(
                                                              "MM/DD/YYYY"
                                                            );
                                                        setIsSavingDeliveryId(
                                                          -1
                                                        );
                                                        setIsSavingDeliveryId(
                                                          delivery.id
                                                        );
                                                      }
                                                      return delivery;
                                                    }),
                                                  };
                                                }
                                              );

                                              setIsPickupDate1CalendarShown(
                                                false
                                              );
                                              setIsPickupDate2CalendarShown(
                                                false
                                              );
                                              setIsDeliveryDate1CalendarShown(
                                                false
                                              );
                                              setIsDeliveryDate2CalendarShown(
                                                false
                                              );

                                              refDeliveryTime1.current.focus();
                                            }}
                                            closeCalendar={() => {
                                              setIsDeliveryDate1CalendarShown(
                                                false
                                              );
                                            }}
                                            preDay={preSelectedDeliveryDate1}
                                            onChangePreDay={(preDay) => {
                                              setPreSelectedDeliveryDate1(
                                                preDay
                                              );
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </animated.div>
                                )
                            )}
                          </div>
                          <div className="form-h-sep"></div>
                          <div className="input-box-container grow">
                            <input
                              tabIndex={46 + props.tabTimes}
                              type="text"
                              placeholder="Delivery Time 1"
                              maxLength={4}
                              ref={refDeliveryTime1}
                              onKeyDown={(e) => {
                                e.stopPropagation();
                                setDeliveryTime1KeyCode(e.keyCode || e.which);
                              }}
                              onBlur={async (e) => {
                                if (deliveryTime1KeyCode === 9) {
                                  let formatted = getFormattedHours(
                                    e.target.value
                                  );

                                  await setSelectedConsigneeCustomer({
                                    ...selectedConsigneeCustomer,
                                    delivery_time1: formatted,
                                  });

                                  let deliveries = (
                                    selectedOrder?.deliveries || []
                                  ).map((delivery, i) => {
                                    if (
                                      delivery.id ===
                                      (selectedConsigneeCustomer?.delivery_id ||
                                        0)
                                    ) {
                                      delivery.delivery_time1 = formatted;
                                      setIsSavingDeliveryId(-1);
                                      setIsSavingDeliveryId(delivery.id);
                                    }
                                    return delivery;
                                  });

                                  await setSelectedOrder({
                                    ...selectedOrder,
                                    deliveries: deliveries,
                                  });
                                }
                              }}
                              onInput={(e) => {
                                setSelectedConsigneeCustomer({
                                  ...selectedConsigneeCustomer,
                                  delivery_time1: e.target.value,
                                });

                                setSelectedOrder({
                                  ...selectedOrder,
                                  deliveries: (
                                    selectedOrder?.deliveries || []
                                  ).map((delivery, i) => {
                                    if (
                                      delivery.id ===
                                      (selectedConsigneeCustomer?.delivery_id ||
                                        0)
                                    ) {
                                      delivery.delivery_time1 = e.target.value;
                                    }
                                    return delivery;
                                  }),
                                });
                              }}
                              onChange={(e) => {
                                setSelectedConsigneeCustomer({
                                  ...selectedConsigneeCustomer,
                                  delivery_time1: e.target.value,
                                });

                                setSelectedOrder({
                                  ...selectedOrder,
                                  deliveries: (
                                    selectedOrder?.deliveries || []
                                  ).map((delivery, i) => {
                                    if (
                                      delivery.id ===
                                      (selectedConsigneeCustomer?.delivery_id ||
                                        0)
                                    ) {
                                      delivery.delivery_time1 = e.target.value;
                                    }
                                    return delivery;
                                  }),
                                });
                              }}
                              value={
                                selectedConsigneeCustomer?.delivery_time1 || ""
                              }
                            />
                          </div>
                          <div
                            style={{
                              minWidth: "1.8rem",
                              fontSize: "1rem",
                              textAlign: "center",
                            }}
                          >
                            To
                          </div>
                          <div
                            className="select-box-container"
                            style={{ flexGrow: 1, position: "relative" }}
                          >
                            <div className="select-box-wrapper">
                              <MaskedInput
                                tabIndex={47 + props.tabTimes}
                                ref={refDeliveryDate2}
                                mask={[
                                  /[0-9]/,
                                  /\d/,
                                  "/",
                                  /\d/,
                                  /\d/,
                                  "/",
                                  /\d/,
                                  /\d/,
                                  /\d/,
                                  /\d/,
                                ]}
                                guide={false}
                                type="text"
                                placeholder="Delivery Date 2"
                                onKeyDown={async (e) => {
                                  e.stopPropagation();
                                  let key = e.keyCode || e.which;
                                  await setDeliveryDate2KeyCode(key);

                                  let deliveryDate2 =
                                    e.target.value.trim() === ""
                                      ? moment()
                                      : moment(
                                        getFormattedDates(
                                          selectedConsigneeCustomer?.delivery_date2 ||
                                          ""
                                        ),
                                        "MM/DD/YYYY"
                                      );
                                  await setPreSelectedDeliveryDate1(
                                    deliveryDate2
                                  );

                                  if (key === 13) {
                                    if (isDeliveryDate2CalendarShown) {
                                      await setSelectedConsigneeCustomer({
                                        ...selectedConsigneeCustomer,
                                        delivery_date2: preSelectedDeliveryDate2
                                          .clone()
                                          .format("MM/DD/YYYY"),
                                      });

                                      await setSelectedOrder({
                                        ...selectedOrder,
                                        deliveries: (
                                          selectedOrder?.deliveries || []
                                        ).map((delivery, i) => {
                                          if (
                                            delivery.id ===
                                            (selectedConsigneeCustomer?.delivery_id ||
                                              0)
                                          ) {
                                            delivery.delivery_date2 =
                                              preSelectedDeliveryDate2
                                                .clone()
                                                .format("MM/DD/YYYY");
                                            setIsSavingDeliveryId(-1);
                                            setIsSavingDeliveryId(delivery.id);
                                          }
                                          return delivery;
                                        }),
                                      });

                                      await setIsPickupDate1CalendarShown(
                                        false
                                      );
                                      await setIsPickupDate2CalendarShown(
                                        false
                                      );
                                      await setIsDeliveryDate1CalendarShown(
                                        false
                                      );
                                      await setIsDeliveryDate2CalendarShown(
                                        false
                                      );

                                      refDeliveryTime2.current.focus();
                                    }
                                  }

                                  if (key >= 37 && key <= 40) {
                                    if (isDeliveryDate2CalendarShown) {
                                      e.preventDefault();

                                      if (key === 37) {
                                        // left - minus 1
                                        setPreSelectedDeliveryDate2(
                                          preSelectedDeliveryDate2
                                            .clone()
                                            .subtract(1, "day")
                                        );
                                      }

                                      if (key === 38) {
                                        // up - minus 7
                                        setPreSelectedDeliveryDate2(
                                          preSelectedDeliveryDate2
                                            .clone()
                                            .subtract(7, "day")
                                        );
                                      }

                                      if (key === 39) {
                                        // right - plus 1
                                        setPreSelectedDeliveryDate2(
                                          preSelectedDeliveryDate2
                                            .clone()
                                            .add(1, "day")
                                        );
                                      }

                                      if (key === 40) {
                                        // down - plus 7
                                        setPreSelectedDeliveryDate2(
                                          preSelectedDeliveryDate2
                                            .clone()
                                            .add(7, "day")
                                        );
                                      }

                                      await setSelectedOrder({
                                        ...selectedOrder,
                                        deliveries: (
                                          selectedOrder?.deliveries || []
                                        ).map((delivery, i) => {
                                          if (
                                            delivery.id ===
                                            (selectedConsigneeCustomer?.delivery_id ||
                                              0)
                                          ) {
                                            delivery.delivery_date2 =
                                              preSelectedDeliveryDate2
                                                .clone()
                                                .format("MM/DD/YYYY");
                                          }
                                          return delivery;
                                        }),
                                      });
                                      // await validateOrderForSaving({ keyCode: 9 });
                                    } else {
                                      if (key === 38 || key === 40) {
                                        setIsDeliveryDate2CalendarShown(true);
                                      }
                                    }
                                  }
                                }}
                                onBlur={async (e) => {
                                  if (deliveryDate1KeyCode === 9) {
                                    let formatted = getFormattedDates(
                                      e.target.value
                                    );

                                    await setSelectedConsigneeCustomer({
                                      ...selectedConsigneeCustomer,
                                      delivery_date2: formatted,
                                    });

                                    let deliveries = (
                                      selectedOrder?.deliveries || []
                                    ).map((delivery, i) => {
                                      if (
                                        delivery.id ===
                                        (selectedConsigneeCustomer?.delivery_id ||
                                          0)
                                      ) {
                                        delivery.delivery_date2 = formatted;
                                        setIsSavingDeliveryId(-1);
                                        setIsSavingDeliveryId(delivery.id);
                                      }
                                      return delivery;
                                    });

                                    await setSelectedOrder({
                                      ...selectedOrder,
                                      deliveries: deliveries,
                                    });
                                  }
                                }}
                                onInput={(e) => {
                                  setSelectedConsigneeCustomer({
                                    ...selectedConsigneeCustomer,
                                    delivery_date2: e.target.value,
                                  });

                                  setSelectedOrder({
                                    ...selectedOrder,
                                    deliveries: (
                                      selectedOrder?.deliveries || []
                                    ).map((delivery, i) => {
                                      if (
                                        delivery.id ===
                                        (selectedConsigneeCustomer?.delivery_id ||
                                          0)
                                      ) {
                                        delivery.delivery_date2 =
                                          e.target.value;
                                      }
                                      return delivery;
                                    }),
                                  });
                                }}
                                onChange={(e) => {
                                  setSelectedConsigneeCustomer({
                                    ...selectedConsigneeCustomer,
                                    delivery_date2: e.target.value,
                                  });

                                  setSelectedOrder({
                                    ...selectedOrder,
                                    deliveries: (
                                      selectedOrder?.deliveries || []
                                    ).map((delivery, i) => {
                                      if (
                                        delivery.id ===
                                        (selectedConsigneeCustomer?.delivery_id ||
                                          0)
                                      ) {
                                        delivery.delivery_date2 =
                                          e.target.value;
                                      }
                                      return delivery;
                                    }),
                                  });
                                }}
                                value={
                                  selectedConsigneeCustomer?.delivery_date2 ||
                                  ""
                                }
                              />

                              <FontAwesomeIcon
                                className="dropdown-button calendar"
                                icon={faCalendarAlt}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsDeliveryDate1CalendarShown(false);
                                  setIsPickupDate1CalendarShown(false);
                                  setIsPickupDate2CalendarShown(false);

                                  if (
                                    moment(
                                      (
                                        selectedConsigneeCustomer?.delivery_date2 ||
                                        ""
                                      ).trim(),
                                      "MM/DD/YYYY"
                                    ).format("MM/DD/YYYY") ===
                                    (
                                      selectedConsigneeCustomer?.delivery_date2 ||
                                      ""
                                    ).trim()
                                  ) {
                                    setPreSelectedDeliveryDate2(
                                      moment(
                                        selectedConsigneeCustomer?.delivery_date2,
                                        "MM/DD/YYYY"
                                      )
                                    );
                                  } else {
                                    setPreSelectedDeliveryDate2(moment());
                                  }

                                  window.setTimeout(async () => {
                                    await setIsDeliveryDate2CalendarShown(true);
                                    refDeliveryDate2.current.inputElement.focus();
                                  }, 0);
                                }}
                              />
                            </div>
                            {deliveryDate2Transition(
                              (style, item) =>
                                item && (
                                  <animated.div
                                    className="mochi-contextual-container"
                                    id="mochi-contextual-container-delivery-date2"
                                    style={{
                                      ...style,
                                      left: "0%",
                                      display: "block",
                                    }}
                                    ref={refDeliveryDate2CalendarDropDown}
                                  >
                                    <div
                                      className="mochi-contextual-popup vertical below right"
                                      style={{ height: 275 }}
                                    >
                                      <div className="mochi-contextual-popup-content">
                                        <div className="mochi-contextual-popup-wrapper">
                                          <Calendar
                                            value={
                                              moment(
                                                (
                                                  selectedConsigneeCustomer?.delivery_date2 ||
                                                  ""
                                                ).trim(),
                                                "MM/DD/YYYY"
                                              ).format("MM/DD/YYYY") ===
                                                (
                                                  selectedConsigneeCustomer?.delivery_date2 ||
                                                  ""
                                                ).trim()
                                                ? moment(
                                                  selectedConsigneeCustomer?.delivery_date2,
                                                  "MM/DD/YYYY"
                                                )
                                                : moment()
                                            }
                                            onChange={(day) => {
                                              setSelectedConsigneeCustomer(
                                                (selectedConsigneeCustomer) => {
                                                  return {
                                                    ...selectedConsigneeCustomer,
                                                    delivery_date2:
                                                      day.format("MM/DD/YYYY"),
                                                  };
                                                }
                                              );

                                              setSelectedOrder(
                                                (selectedOrder) => {
                                                  return {
                                                    ...selectedOrder,
                                                    deliveries: (
                                                      selectedOrder?.deliveries ||
                                                      []
                                                    ).map((delivery, i) => {
                                                      if (
                                                        delivery.id ===
                                                        (selectedConsigneeCustomer?.delivery_id ||
                                                          0)
                                                      ) {
                                                        delivery.delivery_date2 =
                                                          preSelectedDeliveryDate1
                                                            .clone()
                                                            .format(
                                                              "MM/DD/YYYY"
                                                            );
                                                        setIsSavingDeliveryId(
                                                          -1
                                                        );
                                                        setIsSavingDeliveryId(
                                                          delivery.id
                                                        );
                                                      }
                                                      return delivery;
                                                    }),
                                                  };
                                                }
                                              );

                                              setIsPickupDate1CalendarShown(
                                                false
                                              );
                                              setIsPickupDate2CalendarShown(
                                                false
                                              );
                                              setIsDeliveryDate1CalendarShown(
                                                false
                                              );
                                              setIsDeliveryDate2CalendarShown(
                                                false
                                              );

                                              refDeliveryTime2.current.focus();
                                            }}
                                            closeCalendar={() => {
                                              setIsDeliveryDate2CalendarShown(
                                                false
                                              );
                                            }}
                                            preDay={preSelectedDeliveryDate2}
                                            onChangePreDay={(preDay) => {
                                              setPreSelectedDeliveryDate2(
                                                preDay
                                              );
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </animated.div>
                                )
                            )}
                          </div>
                          <div className="form-h-sep"></div>
                          <div className="input-box-container grow">
                            <input
                              tabIndex={48 + props.tabTimes}
                              type="text"
                              placeholder="Delivery Time 2"
                              maxLength={4}
                              ref={refDeliveryTime2}
                              onKeyDown={(e) => {
                                e.stopPropagation();
                                setDeliveryTime2KeyCode(e.keyCode || e.which);
                              }}
                              onBlur={async (e) => {
                                if (deliveryTime2KeyCode === 9) {
                                  let formatted = getFormattedHours(
                                    e.target.value
                                  );

                                  await setSelectedConsigneeCustomer({
                                    ...selectedConsigneeCustomer,
                                    delivery_time2: formatted,
                                  });

                                  let deliveries = (
                                    selectedOrder?.deliveries || []
                                  ).map((delivery, i) => {
                                    if (
                                      delivery.id ===
                                      (selectedConsigneeCustomer?.delivery_id ||
                                        0)
                                    ) {
                                      delivery.delivery_time2 = formatted;
                                      setIsSavingDeliveryId(-1);
                                      setIsSavingDeliveryId(delivery.id);
                                    }
                                    return delivery;
                                  });

                                  await setSelectedOrder({
                                    ...selectedOrder,
                                    deliveries: deliveries,
                                  });
                                }
                              }}
                              onInput={(e) => {
                                setSelectedConsigneeCustomer({
                                  ...selectedConsigneeCustomer,
                                  delivery_time2: e.target.value,
                                });

                                setSelectedOrder({
                                  ...selectedOrder,
                                  deliveries: (
                                    selectedOrder?.deliveries || []
                                  ).map((delivery, i) => {
                                    if (
                                      delivery.id ===
                                      (selectedConsigneeCustomer?.delivery_id ||
                                        0)
                                    ) {
                                      delivery.delivery_time2 = e.target.value;
                                    }
                                    return delivery;
                                  }),
                                });
                              }}
                              onChange={(e) => {
                                setSelectedConsigneeCustomer({
                                  ...selectedConsigneeCustomer,
                                  delivery_time2: e.target.value,
                                });

                                setSelectedOrder({
                                  ...selectedOrder,
                                  deliveries: (
                                    selectedOrder?.deliveries || []
                                  ).map((delivery, i) => {
                                    if (
                                      delivery.id ===
                                      (selectedConsigneeCustomer?.delivery_id ||
                                        0)
                                    ) {
                                      delivery.delivery_time2 = e.target.value;
                                    }
                                    return delivery;
                                  }),
                                });
                              }}
                              value={
                                selectedConsigneeCustomer?.delivery_time2 || ""
                              }
                            />
                          </div>
                        </div>

                        <div className="form-row" style={{ flexGrow: 1 }}>
                          <div
                            className="input-box-container grow"
                            style={{
                              maxHeight: "initial",
                              minHeight: "initial",
                            }}
                          >
                            <textarea
                              tabIndex={49 + props.tabTimes}
                              placeholder="Special Instructions"
                              style={{
                                resize: "none",
                                flexGrow: 1,
                                border: 0,
                                width: "100%",
                                height: "100%",
                              }}
                              onKeyDown={(e) => {
                                let key = e.keyCode || e.which;

                                if (key === 9) {
                                  e.preventDefault();
                                  setIsSavingDeliveryId(
                                    selectedConsigneeCustomer?.delivery_id || 0
                                  );
                                  goToTabindex(
                                    (50 + props.tabTimes).toString()
                                  );
                                  setIsShowingConsigneeSecondPage(false);
                                }
                              }}
                              onInput={(e) => {
                                setSelectedOrder({
                                  ...selectedOrder,
                                  deliveries: (
                                    selectedOrder?.deliveries || []
                                  ).map((delivery, i) => {
                                    if (
                                      delivery.id ===
                                      (selectedConsigneeCustomer?.delivery_id ||
                                        0)
                                    ) {
                                      delivery.special_instructions =
                                        e.target.value;
                                    }
                                    return delivery;
                                  }),
                                });

                                setSelectedConsigneeCustomer({
                                  ...selectedConsigneeCustomer,
                                  special_instructions: e.target.value,
                                });
                              }}
                              onChange={(e) => {
                                setSelectedOrder({
                                  ...selectedOrder,
                                  deliveries: (
                                    selectedOrder?.deliveries || []
                                  ).map((delivery, i) => {
                                    if (
                                      delivery.id ===
                                      (selectedConsigneeCustomer?.delivery_id ||
                                        0)
                                    ) {
                                      delivery.special_instructions =
                                        e.target.value;
                                    }
                                    return delivery;
                                  }),
                                });

                                setSelectedConsigneeCustomer({
                                  ...selectedConsigneeCustomer,
                                  special_instructions: e.target.value,
                                });
                              }}
                              value={
                                selectedConsigneeCustomer?.special_instructions ||
                                ""
                              }
                            ></textarea>
                          </div>
                        </div>
                      </animated.div>
                    )
                )}
              </div>
            </div>

            <div
              className="form-borderless-box"
              style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
            >
              <div
                className="form-row"
                style={{ flexGrow: 1, display: "flex" }}
              >
                <div className="form-bordered-box">
                  <div className="form-header">
                    <div className="top-border top-border-left"></div>
                    <div className="form-title">Internal Notes</div>
                    <div className="top-border top-border-middle"></div>
                    <div className="form-buttons">
                      <div
                        className="mochi-button"
                        onClick={() => {
                          if ((selectedOrder?.order_number || 0) === 0) {
                            window.alert(
                              "You must select or create an order first!"
                            );
                            return;
                          }
                          setSelectedInternalNote({ id: 0 });
                        }}
                      >
                        <div className="mochi-button-decorator mochi-button-decorator-left">
                          (
                        </div>
                        <div className="mochi-button-base">Add note</div>
                        <div className="mochi-button-decorator mochi-button-decorator-right">
                          )
                        </div>
                      </div>
                    </div>
                    <div className="top-border top-border-right"></div>
                  </div>

                  <div className="internal-notes-container">
                    <div className="internal-notes-wrapper">
                      {(selectedOrder?.internal_notes || []).map(
                        (note, index) => {
                          return (
                            <div
                              className="internal-notes-item"
                              key={index}
                              onClick={() => setSelectedInternalNote(note)}
                            >
                              {note.text}
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="fields-container-col"
          style={{
            display: "flex",
            flexDirection: "column",
            width: "10%",
            padding: "0 0 10px 0",
          }}
        >
          <div
            className="form-bordered-box"
            style={{ flexGrow: 1, justifyContent: "space-evenly" }}
          >
            <div className="form-header">
              <div className="top-border top-border-left"></div>
              <div className="form-title">Commisions</div>
              <div className="top-border top-border-middle"></div>
              <div className="top-border top-border-right"></div>
            </div>

            <div className="input-box-container grow">
              <input type="text" placeholder="Agent Code" readOnly={true} />
            </div>
            <div className="input-box-container grow">
              <input
                type="text"
                placeholder="Agent Commision"
                readOnly={true}
              />
            </div>
            <div className="input-box-container grow">
              <input type="text" placeholder="Salesman Code" readOnly={true} />
            </div>
            <div className="input-box-container grow">
              <input
                type="text"
                placeholder="Salesman Commission"
                readOnly={true}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="fields-container-row" style={{ marginBottom: 10 }}>
        <div
          style={{
            minWidth: "70%",
            maxWidth: "70%",
            display: "flex",
            alignItems: "center",
            marginRight: 10,
          }}
        >
          <div
            className="select-box-container"
            style={{ width: "10rem", position: "relative" }}
          >
            <div className="select-box-wrapper">
              <input
                tabIndex={71 + props.tabTimes}
                type="text"
                placeholder="Event"
                ref={refDispatchEvents}
                onKeyDown={(e) => {
                  let key = e.keyCode || e.which;

                  switch (key) {
                    case 37:
                    case 38: // arrow left | arrow up
                      e.preventDefault();

                      if ((selectedOrder?.id || 0) === 0) {
                        // window.alert('You must create or load an order first!');
                        return;
                      }

                      if (dispatchEventItems.length > 0) {
                        if (showDispatchEventSecondPageItems) {
                          let selectedIndex =
                            dispatchEventSecondPageItems.findIndex(
                              (item) => item.selected
                            );

                          if (selectedIndex === -1) {
                            setDispatchEventSecondPageItems(
                              dispatchEventSecondPageItems.map(
                                (item, index) => {
                                  item.selected = index === 0;
                                  return item;
                                }
                              )
                            );
                          } else {
                            setDispatchEventSecondPageItems(
                              dispatchEventSecondPageItems.map(
                                (item, index) => {
                                  if (selectedIndex === 0) {
                                    item.selected =
                                      index ===
                                      dispatchEventSecondPageItems.length - 1;
                                  } else {
                                    item.selected = index === selectedIndex - 1;
                                  }
                                  return item;
                                }
                              )
                            );
                          }

                          refDispatchEventSecondPagePopupItems.current.map(
                            (r, i) => {
                              if (r && r.classList.contains("selected")) {
                                r.scrollIntoView({
                                  behavior: "auto",
                                  block: "center",
                                  inline: "nearest",
                                });
                              }
                              return true;
                            }
                          );
                        } else {
                          let selectedIndex = dispatchEventItems.findIndex(
                            (item) => item.selected
                          );

                          if (selectedIndex === -1) {
                            setDispatchEventItems(
                              dispatchEventItems.map((item, index) => {
                                item.selected = index === 0;
                                return item;
                              })
                            );
                          } else {
                            setDispatchEventItems(
                              dispatchEventItems.map((item, index) => {
                                if (selectedIndex === 0) {
                                  item.selected =
                                    index === dispatchEventItems.length - 1;
                                } else {
                                  item.selected = index === selectedIndex - 1;
                                }
                                return item;
                              })
                            );
                          }

                          refDispatchEventPopupItems.current.map((r, i) => {
                            if (r && r.classList.contains("selected")) {
                              r.scrollIntoView({
                                behavior: "auto",
                                block: "center",
                                inline: "nearest",
                              });
                            }
                            return true;
                          });
                        }
                      } else {
                        axios
                          .post(props.serverUrl + "/getEventTypes")
                          .then((res) => {
                            if (res.data.result === "OK") {
                              setDispatchEventItems(
                                res.data.event_types.map((item, index) => {
                                  item.selected =
                                    (dispatchEvent?.id || 0) === 0
                                      ? index === 0
                                      : item.id === dispatchEvent.id;
                                  return item;
                                })
                              );

                              refDispatchEventPopupItems.current.map((r, i) => {
                                if (r && r.classList.contains("selected")) {
                                  r.scrollIntoView({
                                    behavior: "auto",
                                    block: "center",
                                    inline: "nearest",
                                  });
                                }
                                return true;
                              });
                            }
                          })
                          .catch((e) => {
                            console.log("error getting event types", e);
                          });
                      }
                      break;

                    case 39:
                    case 40: // arrow right | arrow down
                      e.preventDefault();

                      if ((selectedOrder?.id || 0) === 0) {
                        // window.alert('You must create or load an order first!');
                        return;
                      }

                      if (dispatchEventItems.length > 0) {
                        if (showDispatchEventSecondPageItems) {
                          let selectedIndex =
                            dispatchEventSecondPageItems.findIndex(
                              (item) => item.selected
                            );

                          if (selectedIndex === -1) {
                            setDispatchEventSecondPageItems(
                              dispatchEventSecondPageItems.map(
                                (item, index) => {
                                  item.selected = index === 0;
                                  return item;
                                }
                              )
                            );
                          } else {
                            setDispatchEventSecondPageItems(
                              dispatchEventSecondPageItems.map(
                                (item, index) => {
                                  if (
                                    selectedIndex ===
                                    dispatchEventSecondPageItems.length - 1
                                  ) {
                                    item.selected = index === 0;
                                  } else {
                                    item.selected = index === selectedIndex + 1;
                                  }
                                  return item;
                                }
                              )
                            );
                          }

                          refDispatchEventSecondPagePopupItems.current.map(
                            (r, i) => {
                              if (r && r.classList.contains("selected")) {
                                r.scrollIntoView({
                                  behavior: "auto",
                                  block: "center",
                                  inline: "nearest",
                                });
                              }
                              return true;
                            }
                          );
                        } else {
                          let selectedIndex = dispatchEventItems.findIndex(
                            (item) => item.selected
                          );

                          if (selectedIndex === -1) {
                            setDispatchEventItems(
                              dispatchEventItems.map((item, index) => {
                                item.selected = index === 0;
                                return item;
                              })
                            );
                          } else {
                            setDispatchEventItems(
                              dispatchEventItems.map((item, index) => {
                                if (
                                  selectedIndex ===
                                  dispatchEventItems.length - 1
                                ) {
                                  item.selected = index === 0;
                                } else {
                                  item.selected = index === selectedIndex + 1;
                                }
                                return item;
                              })
                            );
                          }

                          refDispatchEventPopupItems.current.map((r, i) => {
                            if (r && r.classList.contains("selected")) {
                              r.scrollIntoView({
                                behavior: "auto",
                                block: "center",
                                inline: "nearest",
                              });
                            }
                            return true;
                          });
                        }
                      } else {
                        axios
                          .post(props.serverUrl + "/getEventTypes")
                          .then((res) => {
                            if (res.data.result === "OK") {
                              setDispatchEventItems(
                                res.data.event_types.map((item, index) => {
                                  item.selected =
                                    (dispatchEvent?.id || 0) === 0
                                      ? index === 0
                                      : item.id === dispatchEvent.id;
                                  return item;
                                })
                              );

                              refDispatchEventPopupItems.current.map((r, i) => {
                                if (r && r.classList.contains("selected")) {
                                  r.scrollIntoView({
                                    behavior: "auto",
                                    block: "center",
                                    inline: "nearest",
                                  });
                                }
                                return true;
                              });
                            }
                          })
                          .catch((e) => {
                            console.log("error getting event types", e);
                          });
                      }
                      break;

                    case 27: // escape
                      e.preventDefault();
                      if (showDispatchEventSecondPageItems) {
                        setShowDispatchEventSecondPageItems(false);
                      } else {
                        setDispatchEventItems([]);
                      }

                      // refDispatchEvents.current.focus();
                      break;

                    case 13: // enter
                      if (
                        dispatchEventItems.length > 0 &&
                        dispatchEventItems.findIndex((item) => item.selected) >
                        -1
                      ) {
                        if (showDispatchEventSecondPageItems) {
                          let item = dispatchEventSecondPageItems.find(
                            (el) => el.selected
                          );

                          if (item !== undefined) {
                            let eventItem = dispatchEventItems.find(
                              (el) => el.selected
                            );

                            setSelectedOrderEvent(item);

                            setDispatchEvent(eventItem);
                            setDispatchEventLocation(
                              item.customer.city + ", " + item.customer.state
                            );

                            if (
                              (eventItem?.name || "").toLowerCase() ===
                              "arrived"
                            ) {
                              setDispatchEventNotes(
                                "Arrived at " +
                                item.customer.code +
                                (item.customer.code_number === 0
                                  ? ""
                                  : item.customer.code_number) +
                                " - " +
                                item.customer.name
                              );
                            }

                            if (
                              (eventItem?.name || "").toLowerCase() === "loaded"
                            ) {
                              setDispatchEventNotes(
                                "Loaded at Shipper " +
                                item.customer.code +
                                (item.customer.code_number === 0
                                  ? ""
                                  : item.customer.code_number) +
                                " - " +
                                item.customer.name
                              );
                            }

                            if (
                              (eventItem?.name || "").toLowerCase() ===
                              "delivered"
                            ) {
                              setDispatchEventNotes(
                                "Delivered at Consignee " +
                                item.customer.code +
                                (item.customer.code_number === 0
                                  ? ""
                                  : item.customer.code_number) +
                                " - " +
                                item.customer.name
                              );
                            }

                            window.setTimeout(() => {
                              setShowDispatchEventSecondPageItems(false);
                              setDispatchEventItems([]);
                              goToTabindex((74 + props.tabTimes).toString());
                            }, 0);
                          }
                        } else {
                          let item =
                            dispatchEventItems[
                            dispatchEventItems.findIndex(
                              (item) => item.selected
                            )
                            ];

                          if ((item?.name || "").toLowerCase() === "arrived") {
                            if (
                              (selectedOrder?.pickups || []).length > 0 ||
                              (selectedOrder?.deliveries || []).length > 0
                            ) {
                              setDispatchEventItems(
                                dispatchEventItems.map((item, index) => {
                                  item.selected =
                                    (item?.name || "").toLowerCase() ===
                                    "arrived";
                                  return item;
                                })
                              );

                              let arriveIndex = -1;
                              let departureIndex = -1;

                              for (
                                let i = 0;
                                i < (selectedOrder?.events || []).length;
                                i++
                              ) {
                                let event = (selectedOrder?.events || [])[i];

                                if (
                                  (
                                    event.event_type?.name || ""
                                  ).toLowerCase() === "arrived"
                                ) {
                                  arriveIndex = i;
                                  break;
                                }
                              }

                              for (
                                let i = 0;
                                i < (selectedOrder?.events || []).length;
                                i++
                              ) {
                                let event = (selectedOrder?.events || [])[i];

                                if (
                                  (
                                    event.event_type?.name || ""
                                  ).toLowerCase() === "departed"
                                ) {
                                  departureIndex = i;
                                  break;
                                }
                              }

                              if (
                                (arriveIndex === -1 && departureIndex === -1) ||
                                (departureIndex > -1 &&
                                  departureIndex < arriveIndex)
                              ) {
                                let items = [
                                  ...(selectedOrder?.pickups || []).filter(
                                    (pu) => {
                                      return (
                                        selectedOrder?.events.find(
                                          (el) =>
                                            (
                                              el.event_type?.name || ""
                                            ).toLowerCase() === "arrived" &&
                                            el.shipper_id ===
                                            (pu.customer?.id || 0)
                                        ) === undefined
                                      );
                                    }
                                  ),
                                  ...(selectedOrder?.deliveries || []).filter(
                                    (delivery) => {
                                      return (
                                        selectedOrder?.events.find(
                                          (el) =>
                                            (
                                              el.event_type?.name || ""
                                            ).toLowerCase() === "arrived" &&
                                            el.consignee_id ===
                                            (delivery?.customer.id || 0)
                                        ) === undefined
                                      );
                                    }
                                  ),
                                ];

                                if (items.length > 0) {
                                  if (items.length === 1) {
                                    setDispatchEvent(item);
                                    setDispatchEventLocation(
                                      items[0].customer.city +
                                      ", " +
                                      items[0].customer.state
                                    );
                                    setDispatchEventNotes(
                                      "Arrived at " +
                                      items[0].customer.code +
                                      (items[0].customer.code_number === 0
                                        ? ""
                                        : items[0].customer.code_number) +
                                      " - " +
                                      items[0].customer.name
                                    );
                                    setSelectedOrderEvent(items[0]);

                                    window.setTimeout(() => {
                                      setDispatchEventItems([]);
                                      setDispatchEventSecondPageItems([]);
                                      setShowDispatchEventSecondPageItems(
                                        false
                                      );
                                      goToTabindex((74 + props.tabTimes).toString());
                                    }, 0);
                                  } else {
                                    items = items.map((x, i) => {
                                      x.selected = i === 0;
                                      return x;
                                    });
                                  }
                                } else {
                                  window.alert(
                                    "No shippers or consignees available!"
                                  );
                                  refDispatchEvents.current.focus();
                                  return;
                                }

                                window.setTimeout(async () => {
                                  setDispatchEventSecondPageItems(items);
                                  setShowDispatchEventSecondPageItems(true);
                                }, 0);
                              } else {
                                window.alert(
                                  "You must enter a 'departed' event for the last 'arrived' event first!"
                                );
                                refDispatchEvents.current.focus();
                                return;
                              }
                            } else {
                              window.alert(
                                "No shippers or consignees available!"
                              );
                              refDispatchEvents.current.focus();
                              return;
                            }
                          } else if (item.type === "departed") {
                            setDispatchEventItems(
                              dispatchEventItems.map((item, index) => {
                                item.selected =
                                  (item?.name || "").toLowerCase() ===
                                  "arrived";
                                return item;
                              })
                            );

                            let arriveIndex = -1;
                            let departureIndex = -1;
                            let arrived_customer = {};

                            for (
                              let i = 0;
                              i < (selectedOrder?.events || []).length;
                              i++
                            ) {
                              let event = (selectedOrder?.events || [])[i];

                              if (
                                (event.event_type?.name || "").toLowerCase() ===
                                "arrived"
                              ) {
                                arrived_customer = {
                                  ...event.arrived_customer,
                                };
                                arriveIndex = i;
                                break;
                              }
                            }

                            for (
                              let i = 0;
                              i < (selectedOrder?.events || []).length;
                              i++
                            ) {
                              let event = (selectedOrder?.events || [])[i];

                              if (
                                (event.event_type?.name || "").toLowerCase() ===
                                "departed"
                              ) {
                                departureIndex = i;
                                break;
                              }
                            }

                            if (
                              (arriveIndex === -1 && departureIndex === -1) ||
                              (departureIndex > -1 &&
                                departureIndex < arriveIndex)
                            ) {
                              window.alert(
                                "You must enter an 'arrived' event first!"
                              );
                              refDispatchEvents.current.focus();
                              return;
                            } else {
                              setDispatchEvent(item);
                              setDispatchEventLocation(
                                arrived_customer.city +
                                ", " +
                                arrived_customer.state
                              );
                              setDispatchEventNotes(
                                "Departed at " +
                                arrived_customer.code +
                                (arrived_customer.code_number === 0
                                  ? ""
                                  : arrived_customer.code_number) +
                                " - " +
                                arrived_customer.name
                              );
                              setSelectedOrderEvent(arrived_customer);

                              window.setTimeout(() => {
                                setDispatchEventItems([]);
                                setDispatchEventSecondPageItems([]);
                                setShowDispatchEventSecondPageItems(false);
                                goToTabindex((74 + props.tabTimes).toString());
                              }, 0);
                            }
                          } else if (
                            (item?.name || "").toLowerCase() === "loaded"
                          ) {
                            if (
                              (selectedOrder?.pickups || []).length > 0 ||
                              (selectedOrder?.deliveries || []).length > 0
                            ) {
                              setDispatchEventItems(
                                dispatchEventItems.map((item, index) => {
                                  item.selected =
                                    (item?.name || "").toLowerCase() ===
                                    "loaded";
                                  return item;
                                })
                              );

                              let items = [
                                ...(selectedOrder?.pickups || []).filter(
                                  (pu) => {
                                    return (
                                      selectedOrder?.events.find(
                                        (el) =>
                                          (
                                            el.event_type?.name || ""
                                          ).toLowerCase() === "loaded" &&
                                          el.shipper_id === pu.customer.id
                                      ) === undefined
                                    );
                                  }
                                ),
                              ];

                              if (items.length > 0) {
                                if (items.length === 1) {
                                  setDispatchEvent(item);
                                  setDispatchEventLocation(
                                    items[0].customer.city +
                                    ", " +
                                    items[0].customer.state
                                  );
                                  setDispatchEventNotes(
                                    "Loaded at Shipper " +
                                    items[0].customer.code +
                                    (items[0].customer.code_number === 0
                                      ? ""
                                      : items[0].customer.code_number) +
                                    " - " +
                                    items[0].customer.name
                                  );
                                  setSelectedOrderEvent(items[0]);

                                  window.setTimeout(() => {
                                    setDispatchEventItems([]);
                                    setDispatchEventSecondPageItems([]);
                                    setShowDispatchEventSecondPageItems(false);
                                    goToTabindex((74 + props.tabTimes).toString());
                                  }, 0);
                                } else {
                                  items = items.map((x, i) => {
                                    x.selected = i === 0;
                                    return x;
                                  });
                                }
                              } else {
                                window.alert("No shippers available!");
                                refDispatchEvents.current.focus();
                                return;
                              }

                              window.setTimeout(async () => {
                                setDispatchEventSecondPageItems(items);
                                setShowDispatchEventSecondPageItems(true);
                              }, 0);
                            } else {
                              window.alert("No shippers available!");
                              refDispatchEvents.current.focus();
                              return;
                            }
                          } else if (
                            (item?.name || "").toLowerCase() === "delivered"
                          ) {
                            if ((selectedOrder?.deliveries || []).length > 0) {
                              setDispatchEventItems(
                                dispatchEventItems.map((item, index) => {
                                  item.selected =
                                    (item?.name || "").toLowerCase() ===
                                    "delivered";
                                  return item;
                                })
                              );

                              let items = [
                                ...(selectedOrder?.deliveries || []).filter(
                                  (delivery) => {
                                    return (
                                      selectedOrder?.events.find(
                                        (el) =>
                                          (
                                            el.event_type?.name || ""
                                          ).toLowerCase() === "delivered" &&
                                          el.consignee_id ===
                                          delivery.customer.id
                                      ) === undefined
                                    );
                                  }
                                ),
                              ];

                              if (items.length > 0) {
                                if (items.length === 1) {
                                  setDispatchEvent(item);
                                  setDispatchEventLocation(
                                    items[0].customer.city +
                                    ", " +
                                    items[0].customer.state
                                  );
                                  setDispatchEventNotes(
                                    "Delivered at Consignee " +
                                    items[0].customer.code +
                                    (items[0].customer.code_number === 0
                                      ? ""
                                      : items[0].customer.code_number) +
                                    " - " +
                                    items[0].customer.name
                                  );
                                  setSelectedOrderEvent(items[0]);

                                  window.setTimeout(() => {
                                    setDispatchEventItems([]);
                                    setDispatchEventSecondPageItems([]);
                                    setShowDispatchEventSecondPageItems(false);
                                    goToTabindex((74 + props.tabTimes).toString());
                                  }, 0);
                                } else {
                                  items = items.map((x, i) => {
                                    x.selected = i === 0;
                                    return x;
                                  });
                                }
                              } else {
                                window.alert("No consignees available!");
                                refDispatchEvents.current.focus();
                                return;
                              }

                              window.setTimeout(async () => {
                                setDispatchEventSecondPageItems(items);
                                setShowDispatchEventSecondPageItems(true);
                              }, 0);
                            } else {
                              window.alert("No consignees available!");
                              refDispatchEvents.current.focus();
                              return;
                            }
                          } else {
                            setDispatchEvent(item);
                            setDispatchEventLocation("");
                            setDispatchEventNotes("");
                            setDispatchEventItems([]);
                            goToTabindex((72 + props.tabTimes).toString());
                          }
                        }
                      }
                      break;

                    case 9: // tab
                      if (
                        dispatchEventItems.length > 0 ||
                        showDispatchEventSecondPageItems
                      ) {
                        e.preventDefault();
                        if (
                          dispatchEventItems.length > 0 &&
                          dispatchEventItems.findIndex(
                            (item) => item.selected
                          ) > -1
                        ) {
                          if (showDispatchEventSecondPageItems) {
                            let item = dispatchEventSecondPageItems.find(
                              (el) => el.selected
                            );

                            if (item !== undefined) {
                              let eventItem = dispatchEventItems.find(
                                (el) => el.selected
                              );

                              setSelectedOrderEvent(item);

                              setDispatchEvent(eventItem);
                              setDispatchEventLocation(
                                item.customer.city + ", " + item.customer.state
                              );

                              if (
                                (eventItem?.name || "").toLowerCase() ===
                                "arrived"
                              ) {
                                setDispatchEventNotes(
                                  "Arrived at " +
                                  item.customer.code +
                                  (item.customer.code_number === 0
                                    ? ""
                                    : item.customer.code_number) +
                                  " - " +
                                  item.customer.name
                                );
                              }

                              if (
                                (eventItem?.name || "").toLowerCase() ===
                                "loaded"
                              ) {
                                setDispatchEventNotes(
                                  "Loaded at Shipper " +
                                  item.customer.code +
                                  (item.customer.code_number === 0
                                    ? ""
                                    : item.customer.code_number) +
                                  " - " +
                                  item.customer.name
                                );
                              }

                              if (
                                (eventItem?.name || "").toLowerCase() ===
                                "delivered"
                              ) {
                                setDispatchEventNotes(
                                  "Delivered at Consignee " +
                                  item.customer.code +
                                  (item.customer.code_number === 0
                                    ? ""
                                    : item.customer.code_number) +
                                  " - " +
                                  item.customer.name
                                );
                              }

                              window.setTimeout(() => {
                                setShowDispatchEventSecondPageItems(false);
                                setDispatchEventItems([]);
                                goToTabindex((74 + props.tabTimes).toString());
                              }, 0);
                            }
                          } else {
                            let item =
                              dispatchEventItems[
                              dispatchEventItems.findIndex(
                                (item) => item.selected
                              )
                              ];

                            if (
                              (item?.name || "").toLowerCase() === "arrived"
                            ) {
                              if (
                                (selectedOrder?.pickups || []).length > 0 ||
                                (selectedOrder?.deliveries || []).length > 0
                              ) {
                                setDispatchEventItems(
                                  dispatchEventItems.map((item, index) => {
                                    item.selected =
                                      (item?.name || "").toLowerCase() ===
                                      "arrived";
                                    return item;
                                  })
                                );

                                let arriveIndex = -1;
                                let departureIndex = -1;

                                for (
                                  let i = 0;
                                  i < (selectedOrder?.events || []).length;
                                  i++
                                ) {
                                  let event = (selectedOrder?.events || [])[i];

                                  if (
                                    (
                                      event.event_type?.name || ""
                                    ).toLowerCase() === "arrived"
                                  ) {
                                    arriveIndex = i;
                                    break;
                                  }
                                }

                                for (
                                  let i = 0;
                                  i < (selectedOrder?.events || []).length;
                                  i++
                                ) {
                                  let event = (selectedOrder?.events || [])[i];

                                  if (
                                    (
                                      event.event_type?.name || ""
                                    ).toLowerCase() === "departed"
                                  ) {
                                    departureIndex = i;
                                    break;
                                  }
                                }

                                if (
                                  (arriveIndex === -1 &&
                                    departureIndex === -1) ||
                                  (departureIndex > -1 &&
                                    departureIndex < arriveIndex)
                                ) {
                                  let items = [
                                    ...(selectedOrder?.pickups || []).filter(
                                      (pu) => {
                                        return (
                                          selectedOrder?.events.find(
                                            (el) =>
                                              (
                                                el.event_type?.name || ""
                                              ).toLowerCase() === "arrived" &&
                                              el.shipper_id ===
                                              (pu.customer?.id || 0)
                                          ) === undefined
                                        );
                                      }
                                    ),
                                    ...(selectedOrder?.deliveries || []).filter(
                                      (delivery) => {
                                        return (
                                          selectedOrder?.events.find(
                                            (el) =>
                                              (
                                                el.event_type?.name || ""
                                              ).toLowerCase() === "arrived" &&
                                              el.consignee_id ===
                                              (delivery?.customer.id || 0)
                                          ) === undefined
                                        );
                                      }
                                    ),
                                  ];

                                  if (items.length > 0) {
                                    if (items.length === 1) {
                                      setDispatchEvent(item);
                                      setDispatchEventLocation(
                                        items[0].customer.city +
                                        ", " +
                                        items[0].customer.state
                                      );
                                      setDispatchEventNotes(
                                        "Arrived at " +
                                        items[0].customer.code +
                                        (items[0].customer.code_number === 0
                                          ? ""
                                          : items[0].customer.code_number) +
                                        " - " +
                                        items[0].customer.name
                                      );
                                      setSelectedOrderEvent(items[0]);

                                      window.setTimeout(() => {
                                        setDispatchEventItems([]);
                                        setDispatchEventSecondPageItems([]);
                                        setShowDispatchEventSecondPageItems(
                                          false
                                        );
                                        goToTabindex((74 + props.tabTimes).toString());
                                      }, 0);
                                    } else {
                                      items = items.map((x, i) => {
                                        x.selected = i === 0;
                                        return x;
                                      });
                                    }
                                  } else {
                                    window.alert(
                                      "No shippers or consignees available!"
                                    );
                                    refDispatchEvents.current.focus();
                                    return;
                                  }

                                  window.setTimeout(async () => {
                                    setDispatchEventSecondPageItems(items);
                                    setShowDispatchEventSecondPageItems(true);
                                  }, 0);
                                } else {
                                  window.alert(
                                    "You must enter a 'departed' event for the last 'arrived' event first!"
                                  );
                                  refDispatchEvents.current.focus();
                                  return;
                                }
                              } else {
                                window.alert(
                                  "No shippers or consignees available!"
                                );
                                refDispatchEvents.current.focus();
                                return;
                              }
                            } else if (item.type === "departed") {
                              setDispatchEventItems(
                                dispatchEventItems.map((item, index) => {
                                  item.selected =
                                    (item?.name || "").toLowerCase() ===
                                    "arrived";
                                  return item;
                                })
                              );

                              let arriveIndex = -1;
                              let departureIndex = -1;
                              let arrived_customer = {};

                              for (
                                let i = 0;
                                i < (selectedOrder?.events || []).length;
                                i++
                              ) {
                                let event = (selectedOrder?.events || [])[i];

                                if (
                                  (
                                    event.event_type?.name || ""
                                  ).toLowerCase() === "arrived"
                                ) {
                                  arrived_customer = {
                                    ...event.arrived_customer,
                                  };
                                  arriveIndex = i;
                                  break;
                                }
                              }

                              for (
                                let i = 0;
                                i < (selectedOrder?.events || []).length;
                                i++
                              ) {
                                let event = (selectedOrder?.events || [])[i];

                                if (
                                  (
                                    event.event_type?.name || ""
                                  ).toLowerCase() === "departed"
                                ) {
                                  departureIndex = i;
                                  break;
                                }
                              }

                              if (
                                (arriveIndex === -1 && departureIndex === -1) ||
                                (departureIndex > -1 &&
                                  departureIndex < arriveIndex)
                              ) {
                                window.alert(
                                  "You must enter an 'arrived' event first!"
                                );
                                refDispatchEvents.current.focus();
                                return;
                              } else {
                                setDispatchEvent(item);
                                setDispatchEventLocation(
                                  arrived_customer.city +
                                  ", " +
                                  arrived_customer.state
                                );
                                setDispatchEventNotes(
                                  "Departed at " +
                                  arrived_customer.code +
                                  (arrived_customer.code_number === 0
                                    ? ""
                                    : arrived_customer.code_number) +
                                  " - " +
                                  arrived_customer.name
                                );
                                setSelectedOrderEvent(arrived_customer);

                                window.setTimeout(() => {
                                  setDispatchEventItems([]);
                                  setDispatchEventSecondPageItems([]);
                                  setShowDispatchEventSecondPageItems(false);
                                  goToTabindex((74 + props.tabTimes).toString());
                                }, 0);
                              }
                            } else if (
                              (item?.name || "").toLowerCase() === "loaded"
                            ) {
                              if (
                                (selectedOrder?.pickups || []).length > 0 ||
                                (selectedOrder?.deliveries || []).length > 0
                              ) {
                                setDispatchEventItems(
                                  dispatchEventItems.map((item, index) => {
                                    item.selected =
                                      (item?.name || "").toLowerCase() ===
                                      "loaded";
                                    return item;
                                  })
                                );

                                let items = [
                                  ...(selectedOrder?.pickups || []).filter(
                                    (pu) => {
                                      return (
                                        selectedOrder?.events.find(
                                          (el) =>
                                            (
                                              el.event_type?.name || ""
                                            ).toLowerCase() === "loaded" &&
                                            el.shipper_id === pu.customer.id
                                        ) === undefined
                                      );
                                    }
                                  ),
                                ];

                                if (items.length > 0) {
                                  if (items.length === 1) {
                                    setDispatchEvent(item);
                                    setDispatchEventLocation(
                                      items[0].customer.city +
                                      ", " +
                                      items[0].customer.state
                                    );
                                    setDispatchEventNotes(
                                      "Loaded at Shipper " +
                                      items[0].customer.code +
                                      (items[0].customer.code_number === 0
                                        ? ""
                                        : items[0].customer.code_number) +
                                      " - " +
                                      items[0].customer.name
                                    );
                                    setSelectedOrderEvent(items[0]);

                                    window.setTimeout(() => {
                                      setDispatchEventItems([]);
                                      setDispatchEventSecondPageItems([]);
                                      setShowDispatchEventSecondPageItems(
                                        false
                                      );
                                      goToTabindex((74 + props.tabTimes).toString());
                                    }, 0);
                                  } else {
                                    items = items.map((x, i) => {
                                      x.selected = i === 0;
                                      return x;
                                    });
                                  }
                                } else {
                                  window.alert("No shippers available!");
                                  refDispatchEvents.current.focus();
                                  return;
                                }

                                window.setTimeout(async () => {
                                  setDispatchEventSecondPageItems(items);
                                  setShowDispatchEventSecondPageItems(true);
                                }, 0);
                              } else {
                                window.alert("No shippers available!");
                                refDispatchEvents.current.focus();
                                return;
                              }
                            } else if (
                              (item?.name || "").toLowerCase() === "delivered"
                            ) {
                              if (
                                (selectedOrder?.deliveries || []).length > 0
                              ) {
                                setDispatchEventItems(
                                  dispatchEventItems.map((item, index) => {
                                    item.selected =
                                      (item?.name || "").toLowerCase() ===
                                      "delivered";
                                    return item;
                                  })
                                );

                                let items = [
                                  ...(selectedOrder?.deliveries || []).filter(
                                    (delivery) => {
                                      return (
                                        selectedOrder?.events.find(
                                          (el) =>
                                            (
                                              el.event_type?.name || ""
                                            ).toLowerCase() === "delivered" &&
                                            el.consignee_id ===
                                            delivery.customer.id
                                        ) === undefined
                                      );
                                    }
                                  ),
                                ];

                                if (items.length > 0) {
                                  if (items.length === 1) {
                                    setDispatchEvent(item);
                                    setDispatchEventLocation(
                                      items[0].customer.city +
                                      ", " +
                                      items[0].customer.state
                                    );
                                    setDispatchEventNotes(
                                      "Delivered at Consignee " +
                                      items[0].customer.code +
                                      (items[0].customer.code_number === 0
                                        ? ""
                                        : items[0].customer.code_number) +
                                      " - " +
                                      items[0].customer.name
                                    );
                                    setSelectedOrderEvent(items[0]);

                                    window.setTimeout(() => {
                                      setDispatchEventItems([]);
                                      setDispatchEventSecondPageItems([]);
                                      setShowDispatchEventSecondPageItems(
                                        false
                                      );
                                      goToTabindex((74 + props.tabTimes).toString());
                                    }, 0);
                                  } else {
                                    items = items.map((x, i) => {
                                      x.selected = i === 0;
                                      return x;
                                    });
                                  }
                                } else {
                                  window.alert("No consignees available!");
                                  refDispatchEvents.current.focus();
                                  return;
                                }

                                window.setTimeout(async () => {
                                  setDispatchEventSecondPageItems(items);
                                  setShowDispatchEventSecondPageItems(true);
                                }, 0);
                              } else {
                                window.alert("No consignees available!");
                                refDispatchEvents.current.focus();
                                return;
                              }
                            } else {
                              setDispatchEvent(item);
                              setDispatchEventLocation("");
                              setDispatchEventNotes("");
                              setDispatchEventItems([]);
                              goToTabindex((72 + props.tabTimes).toString());
                            }
                          }
                        }
                      }
                      break;
                    default:
                      break;
                  }
                }}
                onBlur={(e) => {
                  if ((dispatchEvent?.id || 0) === 0) {
                    setDispatchEvent({});
                  }
                }}
                onInput={(e) => {
                  if (!showDispatchEventSecondPageItems) {
                    setDispatchEvent({
                      ...dispatchEvent,
                      name: e.target.value,
                      id: 0,
                    });

                    if (e.target.value.trim() === "") {
                      setDispatchEventItems([]);
                    } else {
                      axios
                        .post(props.serverUrl + "/getEventTypes", {
                          name: e.target.value.trim(),
                        })
                        .then((res) => {
                          if (res.data.result === "OK") {
                            setDispatchEventItems(
                              res.data.event_types.map((item, index) => {
                                item.selected =
                                  (dispatchEvent?.id || 0) === 0
                                    ? index === 0
                                    : item.id === dispatchEvent.id;
                                return item;
                              })
                            );

                            refDispatchEventPopupItems.current.map((r, i) => {
                              if (r && r.classList.contains("selected")) {
                                r.scrollIntoView({
                                  behavior: "auto",
                                  block: "center",
                                  inline: "nearest",
                                });
                              }
                              return true;
                            });
                          }
                        })
                        .catch((e) => {
                          console.log("error getting event types", e);
                        });
                    }
                  }
                }}
                onChange={(e) => {
                  if (!showDispatchEventSecondPageItems) {
                    setDispatchEvent({
                      ...dispatchEvent,
                      name: e.target.value,
                      id: 0,
                    });
                  }
                }}
                value={(dispatchEvent.name || "").toUpperCase()}
              />

              <FontAwesomeIcon
                className="dropdown-button"
                icon={faCaretDown}
                onClick={async () => {
                  if (dispatchEventItems.length > 0) {
                    setDispatchEventItems([]);
                  } else {
                    if ((selectedOrder?.id || 0) === 0) {
                      window.alert("You must create or load an order first!");
                      return;
                    }

                    axios
                      .post(props.serverUrl + "/getEventTypes", {
                        name: dispatchEvent?.name || "",
                      })
                      .then((res) => {
                        if (res.data.result === "OK") {
                          setDispatchEventItems(
                            res.data.event_types.map((item, index) => {
                              item.selected =
                                (dispatchEvent?.id || 0) === 0
                                  ? index === 0
                                  : item.id === dispatchEvent.id;
                              return item;
                            })
                          );

                          refDispatchEventPopupItems.current.map((r, i) => {
                            if (r && r.classList.contains("selected")) {
                              r.scrollIntoView({
                                behavior: "auto",
                                block: "center",
                                inline: "nearest",
                              });
                            }
                            return true;
                          });
                        }
                      })
                      .catch((e) => {
                        console.log("error getting event types", e);
                      });
                  }

                  refDispatchEvents.current.focus();
                }}
              />
            </div>

            {eventTransition(
              (style, item) =>
                item && (
                  <animated.div
                    className="mochi-contextual-container"
                    id="mochi-contextual-container-dispatch-event"
                    style={{
                      ...style,
                      left: "0",
                      display: "block",
                    }}
                    ref={refDispatchEventDropDown}
                  >
                    <div
                      className="mochi-contextual-popup vertical below right"
                      style={{ height: 150 }}
                    >
                      <div className="mochi-contextual-popup-content">
                        <div className="mochi-contextual-popup-wrapper multipage">
                          <div
                            className="mochi-contextual-popup-slider"
                            style={{
                              transform: `translateX(${showDispatchEventSecondPageItems ? "-50%" : "0"
                                })`,
                            }}
                          >
                            <div className="first-page">
                              <div className="page-wrapper">
                                {dispatchEventItems.map((item, index) => {
                                  const mochiItemClasses = classnames({
                                    "mochi-item": true,
                                    selected: item.selected,
                                    hidden: item.hidden,
                                  });

                                  const searchValue =
                                    (dispatchEvent?.id || 0) === 0 &&
                                      (dispatchEvent?.name || "") !== ""
                                      ? dispatchEvent?.name
                                      : undefined;

                                  return (
                                    <div
                                      key={index}
                                      className={mochiItemClasses}
                                      id={item.id}
                                      onMouseOver={() => {
                                        setDispatchEventItems(
                                          dispatchEventItems.map((i, index) => {
                                            i.selected = i.id === item.id;
                                            return i;
                                          })
                                        );
                                      }}
                                      onClick={() => {
                                        if (
                                          (item?.name || "").toLowerCase() ===
                                          "arrived"
                                        ) {
                                          if (
                                            (selectedOrder?.pickups || [])
                                              .length > 0 ||
                                            (selectedOrder?.deliveries || [])
                                              .length > 0
                                          ) {
                                            setDispatchEventItems(
                                              dispatchEventItems.map(
                                                (item, index) => {
                                                  item.selected =
                                                    (
                                                      item?.name || ""
                                                    ).toLowerCase() ===
                                                    "arrived";
                                                  return item;
                                                }
                                              )
                                            );

                                            let arriveIndex = -1;
                                            let departureIndex = -1;

                                            for (
                                              let i = 0;
                                              i <
                                              (selectedOrder?.events || [])
                                                .length;
                                              i++
                                            ) {
                                              let event =
                                                (selectedOrder?.events || [])[
                                                i
                                                ];

                                              if (
                                                (
                                                  event.event_type?.name || ""
                                                ).toLowerCase() === "arrived"
                                              ) {
                                                arriveIndex = i;
                                                break;
                                              }
                                            }

                                            for (
                                              let i = 0;
                                              i <
                                              (selectedOrder?.events || [])
                                                .length;
                                              i++
                                            ) {
                                              let event =
                                                (selectedOrder?.events || [])[
                                                i
                                                ];

                                              if (
                                                (
                                                  event.event_type?.name || ""
                                                ).toLowerCase() === "departed"
                                              ) {
                                                departureIndex = i;
                                                break;
                                              }
                                            }

                                            if (
                                              (arriveIndex === -1 &&
                                                departureIndex === -1) ||
                                              (departureIndex > -1 &&
                                                departureIndex < arriveIndex)
                                            ) {
                                              let items = [
                                                ...(
                                                  selectedOrder?.pickups || []
                                                ).filter((pu) => {
                                                  return (
                                                    selectedOrder?.events.find(
                                                      (el) =>
                                                        (
                                                          el.event_type?.name ||
                                                          ""
                                                        ).toLowerCase() ===
                                                        "arrived" &&
                                                        el.shipper_id ===
                                                        (pu.customer?.id || 0)
                                                    ) === undefined
                                                  );
                                                }),
                                                ...(
                                                  selectedOrder?.deliveries ||
                                                  []
                                                ).filter((delivery) => {
                                                  return (
                                                    selectedOrder?.events.find(
                                                      (el) =>
                                                        (
                                                          el.event_type?.name ||
                                                          ""
                                                        ).toLowerCase() ===
                                                        "arrived" &&
                                                        el.consignee_id ===
                                                        (delivery?.id || 0)
                                                    ) === undefined
                                                  );
                                                }),
                                              ];

                                              if (items.length > 0) {
                                                if (items.length === 1) {
                                                  setDispatchEvent(item);
                                                  setDispatchEventLocation(
                                                    items[0].customer.city +
                                                    ", " +
                                                    items[0].customer.state
                                                  );
                                                  setDispatchEventNotes(
                                                    "Arrived at " +
                                                    items[0].customer.code +
                                                    (items[0].customer
                                                      .code_number === 0
                                                      ? ""
                                                      : items[0].customer
                                                        .code_number) +
                                                    " - " +
                                                    items[0].customer.name
                                                  );
                                                  setSelectedOrderEvent(
                                                    items[0]
                                                  );

                                                  window.setTimeout(() => {
                                                    setDispatchEventItems([]);
                                                    setDispatchEventSecondPageItems(
                                                      []
                                                    );
                                                    setShowDispatchEventSecondPageItems(
                                                      false
                                                    );
                                                    goToTabindex((74 + props.tabTimes).toString());
                                                  }, 0);
                                                } else {
                                                  items = items.map((x, i) => {
                                                    x.selected = i === 0;
                                                    return x;
                                                  });
                                                }
                                              } else {
                                                window.alert(
                                                  "No shippers or consignees available!"
                                                );
                                                refDispatchEvents.current.focus();
                                                return;
                                              }

                                              window.setTimeout(() => {
                                                setDispatchEventSecondPageItems(
                                                  items
                                                );
                                                setShowDispatchEventSecondPageItems(
                                                  true
                                                );
                                              }, 0);
                                            } else {
                                              window.alert(
                                                "You must enter a 'departed' event for the last 'arrived' event first!"
                                              );
                                              refDispatchEvents.current.focus();
                                              return;
                                            }
                                          } else {
                                            window.alert(
                                              "No shippers or consignees available!"
                                            );
                                            refDispatchEvents.current.focus();
                                            return;
                                          }
                                        } else if (
                                          (item?.name || "").toLowerCase() ===
                                          "departed"
                                        ) {
                                          setDispatchEventItems(
                                            dispatchEventItems.map(
                                              (item, index) => {
                                                item.selected =
                                                  (
                                                    item?.name || ""
                                                  ).toLowerCase() === "arrived";
                                                return item;
                                              }
                                            )
                                          );

                                          let arriveIndex = -1;
                                          let departureIndex = -1;
                                          let arrived_customer = {};

                                          for (
                                            let i = 0;
                                            i <
                                            (selectedOrder?.events || [])
                                              .length;
                                            i++
                                          ) {
                                            let event =
                                              (selectedOrder?.events || [])[i];

                                            if (
                                              (
                                                event.event_type?.name || ""
                                              ).toLowerCase() === "arrived"
                                            ) {
                                              arrived_customer = {
                                                ...event.arrived_customer,
                                              };
                                              arriveIndex = i;
                                              break;
                                            }
                                          }

                                          for (
                                            let i = 0;
                                            i <
                                            (selectedOrder?.events || [])
                                              .length;
                                            i++
                                          ) {
                                            let event =
                                              (selectedOrder?.events || [])[i];

                                            if (
                                              (
                                                event.event_type?.name || ""
                                              ).toLowerCase() === "departed"
                                            ) {
                                              departureIndex = i;
                                              break;
                                            }
                                          }

                                          if (
                                            (arriveIndex === -1 &&
                                              departureIndex === -1) ||
                                            (departureIndex > -1 &&
                                              departureIndex < arriveIndex)
                                          ) {
                                            window.alert(
                                              "You must enter an 'arrived' event first!"
                                            );
                                            refDispatchEvents.current.focus();
                                            return;
                                          } else {
                                            setDispatchEvent(item);
                                            setDispatchEventLocation(
                                              arrived_customer.city +
                                              ", " +
                                              arrived_customer.state
                                            );
                                            setDispatchEventNotes(
                                              "Departed at " +
                                              arrived_customer.code +
                                              (arrived_customer.code_number ===
                                                0
                                                ? ""
                                                : arrived_customer.code_number) +
                                              " - " +
                                              arrived_customer.name
                                            );
                                            setSelectedOrderEvent(
                                              arrived_customer
                                            );

                                            window.setTimeout(() => {
                                              setDispatchEventItems([]);
                                              setDispatchEventSecondPageItems(
                                                []
                                              );
                                              setShowDispatchEventSecondPageItems(
                                                false
                                              );
                                              goToTabindex((74 + props.tabTimes).toString());
                                            }, 0);
                                          }
                                        } else if (
                                          (item?.name || "").toLowerCase() ===
                                          "loaded"
                                        ) {
                                          if (
                                            (selectedOrder?.pickups || [])
                                              .length > 0 ||
                                            (selectedOrder?.deliveries || [])
                                              .length > 0
                                          ) {
                                            setDispatchEventItems(
                                              dispatchEventItems.map(
                                                (item, index) => {
                                                  item.selected =
                                                    (
                                                      item?.name || ""
                                                    ).toLowerCase() ===
                                                    "loaded";
                                                  return item;
                                                }
                                              )
                                            );

                                            let items = [
                                              ...(
                                                selectedOrder?.pickups || []
                                              ).filter((pu) => {
                                                return (
                                                  selectedOrder?.events.find(
                                                    (el) =>
                                                      (
                                                        el.event_type?.name ||
                                                        ""
                                                      ).toLowerCase() ===
                                                      "loaded" &&
                                                      el.shipper_id ===
                                                      (pu.customer?.id || 0)
                                                  ) === undefined
                                                );
                                              }),
                                            ];

                                            if (items.length > 0) {
                                              if (items.length === 1) {
                                                setDispatchEvent(item);
                                                setDispatchEventLocation(
                                                  items[0].customer.city +
                                                  ", " +
                                                  items[0].customer.state
                                                );
                                                setDispatchEventNotes(
                                                  "Loaded at Shipper " +
                                                  items[0].customer.code +
                                                  (items[0].customer
                                                    .code_number === 0
                                                    ? ""
                                                    : items[0].customer
                                                      .code_number) +
                                                  " - " +
                                                  items[0].customer.name
                                                );
                                                setSelectedOrderEvent(items[0]);

                                                window.setTimeout(() => {
                                                  setDispatchEventItems([]);
                                                  setDispatchEventSecondPageItems(
                                                    []
                                                  );
                                                  setShowDispatchEventSecondPageItems(
                                                    false
                                                  );
                                                  goToTabindex((74 + props.tabTimes).toString());
                                                }, 0);
                                              } else {
                                                items = items.map((x, i) => {
                                                  x.selected = i === 0;
                                                  return x;
                                                });
                                              }
                                            } else {
                                              window.alert(
                                                "No shippers available!"
                                              );
                                              refDispatchEvents.current.focus();
                                              return;
                                            }

                                            window.setTimeout(() => {
                                              setDispatchEventSecondPageItems(
                                                items
                                              );
                                              setShowDispatchEventSecondPageItems(
                                                true
                                              );
                                            }, 0);
                                          } else {
                                            window.alert(
                                              "No shippers available!"
                                            );
                                            refDispatchEvents.current.focus();
                                            return;
                                          }
                                        } else if (
                                          (item?.name || "").toLowerCase() ===
                                          "delivered"
                                        ) {
                                          if (
                                            (selectedOrder?.deliveries || [])
                                              .length > 0
                                          ) {
                                            setDispatchEventItems(
                                              dispatchEventItems.map(
                                                (item, index) => {
                                                  item.selected =
                                                    (
                                                      item?.name || ""
                                                    ).toLowerCase() ===
                                                    "delivered";
                                                  return item;
                                                }
                                              )
                                            );

                                            let items = [
                                              ...(
                                                selectedOrder?.deliveries || []
                                              ).filter((delivery) => {
                                                return (
                                                  selectedOrder?.events.find(
                                                    (el) =>
                                                      (
                                                        el.event_type?.name ||
                                                        ""
                                                      ).toLowerCase() ===
                                                      "delivered" &&
                                                      el.consignee_id ===
                                                      (delivery.customer
                                                        ?.id || 0)
                                                  ) === undefined
                                                );
                                              }),
                                            ];

                                            if (items.length > 0) {
                                              if (items.length === 1) {
                                                setDispatchEvent(item);
                                                setDispatchEventLocation(
                                                  items[0].customer.city +
                                                  ", " +
                                                  items[0].customer.state
                                                );
                                                setDispatchEventNotes(
                                                  "Delivered at Consignee " +
                                                  items[0].customer.code +
                                                  (items[0].customer
                                                    .code_number === 0
                                                    ? ""
                                                    : items[0].customer
                                                      .code_number) +
                                                  " - " +
                                                  items[0].customer.name
                                                );
                                                setSelectedOrderEvent(items[0]);

                                                window.setTimeout(() => {
                                                  setDispatchEventItems([]);
                                                  setDispatchEventSecondPageItems(
                                                    []
                                                  );
                                                  setShowDispatchEventSecondPageItems(
                                                    false
                                                  );
                                                  goToTabindex((74 + props.tabTimes).toString());
                                                }, 0);
                                              } else {
                                                items = items.map((x, i) => {
                                                  x.selected = i === 0;
                                                  return x;
                                                });
                                              }
                                            } else {
                                              window.alert(
                                                "No consignees available!"
                                              );
                                              refDispatchEvents.current.focus();
                                              return;
                                            }

                                            window.setTimeout(() => {
                                              setDispatchEventSecondPageItems(
                                                items
                                              );
                                              setShowDispatchEventSecondPageItems(
                                                true
                                              );
                                            }, 0);
                                          } else {
                                            window.alert(
                                              "No consignees available!"
                                            );
                                            refDispatchEvents.current.focus();
                                            return;
                                          }
                                        } else {
                                          setDispatchEvent(item);
                                          setDispatchEventLocation("");
                                          setDispatchEventNotes("");
                                          setDispatchEventItems([]);
                                          goToTabindex((72 + props.tabTimes).toString());
                                        }
                                      }}
                                      ref={(ref) =>
                                        refDispatchEventPopupItems.current.push(
                                          ref
                                        )
                                      }
                                    >
                                      {searchValue === undefined ? (
                                        item.name
                                      ) : (
                                        <Highlighter
                                          highlightClassName="mochi-item-highlight-text"
                                          searchWords={[searchValue]}
                                          autoEscape={true}
                                          textToHighlight={item.name}
                                        />
                                      )}
                                      {item.selected && (
                                        <FontAwesomeIcon
                                          className="dropdown-selected"
                                          icon={faCaretRight}
                                        />
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                            <div className="second-page">
                              <div className="page-wrapper">
                                {dispatchEventSecondPageItems.map(
                                  (item, index) => {
                                    console.log(item);
                                    const mochiItemClasses = classnames({
                                      "mochi-item": true,
                                      selected: item.selected,
                                    });

                                    return (
                                      <div
                                        key={index}
                                        className={mochiItemClasses}
                                        id={item.id}
                                        onClick={() => {
                                          let eventItem =
                                            dispatchEventItems.find(
                                              (el) => el.selected
                                            );

                                          setSelectedOrderEvent(item);

                                          setDispatchEvent(eventItem);
                                          setDispatchEventLocation(
                                            item.customer.city +
                                            ", " +
                                            item.customer.state
                                          );

                                          if (
                                            (
                                              eventItem?.name || ""
                                            ).toLowerCase() === "arrived"
                                          ) {
                                            setDispatchEventNotes(
                                              "Arrived at " +
                                              item.customer.code +
                                              (item.customer.code_number === 0
                                                ? ""
                                                : item.customer.code_number) +
                                              " - " +
                                              item.customer.name
                                            );
                                          }

                                          if (
                                            (
                                              eventItem?.name || ""
                                            ).toLowerCase() === "loaded"
                                          ) {
                                            setDispatchEventNotes(
                                              "Loaded at Shipper " +
                                              item.customer.code +
                                              (item.customer.code_number === 0
                                                ? ""
                                                : item.customer.code_number) +
                                              " - " +
                                              item.customer.name
                                            );
                                          }

                                          if (
                                            (
                                              eventItem?.name || ""
                                            ).toLowerCase() === "delivered"
                                          ) {
                                            setDispatchEventNotes(
                                              "Delivered at Consignee " +
                                              item.customer.code +
                                              (item.customer.code_number === 0
                                                ? ""
                                                : item.customer.code_number) +
                                              " - " +
                                              item.customer.name
                                            );
                                          }

                                          window.setTimeout(() => {
                                            setShowDispatchEventSecondPageItems(
                                              false
                                            );
                                            setDispatchEventItems([]);
                                            goToTabindex((74 + props.tabTimes).toString());
                                          }, 0);
                                        }}
                                        onMouseOver={() => {
                                          setDispatchEventSecondPageItems(
                                            dispatchEventSecondPageItems.map(
                                              (i, index) => {
                                                i.selected = i.id === item.id;
                                                return i;
                                              }
                                            )
                                          );
                                        }}
                                        ref={(ref) =>
                                          refDispatchEventSecondPagePopupItems.current.push(
                                            ref
                                          )
                                        }
                                      >
                                        <Highlighter
                                          highlightClassName="mochi-item-highlight-text"
                                          searchWords={[]}
                                          autoEscape={true}
                                          textToHighlight={
                                            item.customer.code +
                                            (item.customer.code_number === 0
                                              ? ""
                                              : item.customer.code_number) +
                                            " - " +
                                            item.customer.city +
                                            ", " +
                                            item.customer.state
                                          }
                                        />
                                        {item.selected && (
                                          <FontAwesomeIcon
                                            className="dropdown-selected"
                                            icon={faCaretRight}
                                          />
                                        )}
                                      </div>
                                    );
                                  }
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </animated.div>
                )
            )}
          </div>
          <div className="form-h-sep"></div>
          <div className="input-box-container" style={{ width: "10rem" }}>
            <input
              tabIndex={72 + props.tabTimes}
              type="text"
              placeholder="Event Location"
              onInput={(e) => {
                if (
                  (dispatchEvent?.type || "") !== "arrived" &&
                  (dispatchEvent?.type || "") !== "departed" &&
                  (dispatchEvent?.type || "") !== "loaded" &&
                  (dispatchEvent?.type || "") !== "delivered"
                )
                  setDispatchEventLocation(e.target.value);
              }}
              onChange={(e) => {
                if (
                  (dispatchEvent?.type || "") !== "arrived" &&
                  (dispatchEvent?.type || "") !== "departed" &&
                  (dispatchEvent?.type || "") !== "loaded" &&
                  (dispatchEvent?.type || "") !== "delivered"
                )
                  setDispatchEventLocation(e.target.value);
              }}
              value={dispatchEventLocation || ""}
            />
          </div>
          <div className="form-h-sep"></div>
          <div className="input-box-container grow">
            <input
              tabIndex={73 + props.tabTimes}
              type="text"
              placeholder="Event Notes"
              onKeyDown={(e) => {
                let key = e.keyCode || e.which;

                if (key === 9) {
                }
              }}
              onInput={(e) => {
                if (
                  (dispatchEvent?.type || "") !== "arrived" &&
                  (dispatchEvent?.type || "") !== "departed" &&
                  (dispatchEvent?.type || "") !== "loaded" &&
                  (dispatchEvent?.type || "") !== "delivered"
                )
                  setDispatchEventNotes(e.target.value);
              }}
              onChange={(e) => {
                if (
                  (dispatchEvent?.type || "") !== "arrived" &&
                  (dispatchEvent?.type || "") !== "departed" &&
                  (dispatchEvent?.type || "") !== "loaded" &&
                  (dispatchEvent?.type || "") !== "delivered"
                )
                  setDispatchEventNotes(e.target.value);
              }}
              value={dispatchEventNotes || ""}
            />
          </div>
          <div className="form-h-sep"></div>
          <div className="select-box-container" style={{ width: "8rem" }}>
            <div className="select-box-wrapper">
              <MaskedInput
                tabIndex={74 + props.tabTimes}
                mask={[
                  /[0-9]/,
                  /\d/,
                  "/",
                  /\d/,
                  /\d/,
                  "/",
                  /\d/,
                  /\d/,
                  /\d/,
                  /\d/,
                ]}
                guide={false}
                type="text"
                placeholder="Event Date"
                onKeyDown={async (e) => {
                  let key = e.keyCode || e.which;

                  if (key >= 37 && key <= 40) {
                    let event_date =
                      e.target.value.trim() === ""
                        ? moment()
                        : moment(
                          getFormattedDates(dispatchEventDate || ""),
                          "MM/DD/YYYY"
                        );
                    await setPreSelectedDispatchEventDate(event_date);

                    if (isDispatchEventDateCalendarShown) {
                      e.preventDefault();

                      if (key === 37) {
                        // left - minus 1
                        setPreSelectedDispatchEventDate(
                          preSelectedDispatchEventDate
                            .clone()
                            .subtract(1, "day")
                        );
                      }

                      if (key === 38) {
                        // up - minus 7
                        setPreSelectedDispatchEventDate(
                          preSelectedDispatchEventDate
                            .clone()
                            .subtract(7, "day")
                        );
                      }

                      if (key === 39) {
                        // right - plus 1
                        setPreSelectedDispatchEventDate(
                          preSelectedDispatchEventDate.clone().add(1, "day")
                        );
                      }

                      if (key === 40) {
                        // down - plus 7
                        setPreSelectedDispatchEventDate(
                          preSelectedDispatchEventDate.clone().add(7, "day")
                        );
                      }
                    } else {
                      await setIsDispatchEventDateCalendarShown(true);
                    }
                  }

                  if (key === 13) {
                    let event_date =
                      e.target.value.trim() === ""
                        ? moment()
                        : moment(
                          getFormattedDates(dispatchEventDate || ""),
                          "MM/DD/YYYY"
                        );
                    await setPreSelectedDispatchEventDate(event_date);

                    if (isDispatchEventDateCalendarShown) {
                      event_date = preSelectedDispatchEventDate
                        .clone()
                        .format("MM/DD/YYYY");

                      await setDispatchEventDate(event_date);

                      await setIsDispatchEventDateCalendarShown(false);
                    }
                  }

                  if (key === 9) {
                    let event_date =
                      e.target.value.trim() === ""
                        ? moment()
                        : moment(
                          getFormattedDates(dispatchEventDate || ""),
                          "MM/DD/YYYY"
                        );
                    await setPreSelectedDispatchEventDate(event_date);

                    if (isDispatchEventDateCalendarShown) {
                      event_date = preSelectedDispatchEventDate
                        .clone()
                        .format("MM/DD/YYYY");

                      await setDispatchEventDate(event_date);

                      await setIsDispatchEventDateCalendarShown(false);
                    }
                  }
                }}
                onBlur={(e) => {
                  setDispatchEventDate(getFormattedDates(dispatchEventDate));
                }}
                onInput={(e) => {
                  setDispatchEventDate(e.target.value);
                }}
                onChange={(e) => {
                  setDispatchEventDate(e.target.value);
                }}
                value={dispatchEventDate || ""}
                ref={refEventDate}
              />

              <FontAwesomeIcon
                className="dropdown-button calendar"
                icon={faCalendarAlt}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDispatchEventDateCalendarShown(true);

                  if (
                    moment(
                      (dispatchEventDate || "").trim(),
                      "MM/DD/YYYY"
                    ).format("MM/DD/YYYY") === (dispatchEventDate || "").trim()
                  ) {
                    setPreSelectedDispatchEventDate(
                      moment(dispatchEventDate, "MM/DD/YYYY")
                    );
                  } else {
                    setPreSelectedDispatchEventDate(moment());
                  }

                  refEventDate.current.inputElement.focus();
                }}
              />
            </div>
            {dateEventTransition(
              (style, item) =>
                item && (
                  <animated.div
                    className="mochi-contextual-container"
                    id="mochi-contextual-container-dispatch-event-date"
                    style={{
                      ...style,
                      left: "-100px",
                      display: "block",
                    }}
                    ref={refDispatchEventDateCalendarDropDown}
                  >
                    <div
                      className="mochi-contextual-popup vertical below"
                      style={{ height: 275 }}
                    >
                      <div className="mochi-contextual-popup-content">
                        <div className="mochi-contextual-popup-wrapper">
                          <Calendar
                            value={
                              moment(
                                (dispatchEventDate || "").trim(),
                                "MM/DD/YYYY"
                              ).format("MM/DD/YYYY") ===
                                (dispatchEventDate || "").trim()
                                ? moment(dispatchEventDate, "MM/DD/YYYY")
                                : moment()
                            }
                            onChange={(day) => {
                              setDispatchEventDate(day.format("MM/DD/YYYY"));
                            }}
                            closeCalendar={() => {
                              setIsDispatchEventDateCalendarShown(false);
                            }}
                            preDay={preSelectedDispatchEventDate}
                            onChangePreDay={(preDay) => {
                              setPreSelectedDispatchEventDate(preDay);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </animated.div>
                )
            )}
          </div>
          <div className="form-h-sep"></div>
          <div className="input-box-container" style={{ width: "6rem" }}>
            <input
              tabIndex={75 + props.tabTimes}
              type="text"
              placeholder="Event Time"
              ref={refEventTime}
              onKeyDown={async (e) => {
                let key = e.keyCode || e.which;

                e.stopPropagation();

                if (key === 9) {
                  e.preventDefault();

                  let formatted = getFormattedHours(e.target.value);
                  console.log(e.target.value, formatted);
                  await setDispatchEventTime(formatted);

                  if ((dispatchEvent?.name || "") === "") {
                    goToTabindex((1 + props.tabTimes).toString());
                  } else {
                    if ((selectedOrder?.id || 0) === 0) {
                      goToTabindex((1 + props.tabTimes).toString());
                      return;
                    }

                    let event_parameters = {
                      order_id: selectedOrder.id,
                      time: moment().format("HHmm"),
                      event_time: formatted,
                      date: moment().format("MM/DD/YYYY"),
                      event_date: dispatchEventDate,
                      user_id: selectedOrder.ae_number,
                      event_location: dispatchEventLocation,
                      event_notes: dispatchEventNotes,
                      event_type_id: dispatchEvent.id,
                    };

                    if (dispatchEvent.id === 1) {
                      event_parameters.arrived_customer_id =
                        selectedOrderEvent.customer.id;
                      event_parameters.shipper_id =
                        (selectedOrderEvent.customer.type || "") === "pickup"
                          ? selectedOrderEvent.customer.id
                          : null;
                      event_parameters.consignee_id =
                        (selectedOrderEvent.customer.type || "") === "delivery"
                          ? selectedOrderEvent.customer.id
                          : null;
                    } else if (dispatchEvent.id === 7) {
                      event_parameters.departed_customer_id =
                        selectedOrderEvent.id;
                    } else if (dispatchEvent.id === 9) {
                      event_parameters.shipper_id =
                        selectedOrderEvent.customer.id;
                    } else if (dispatchEvent.id === 6) {
                      event_parameters.consignee_id =
                        selectedOrderEvent.customer.id;
                    } else {
                      if (event_parameters.event_notes.trim() === "") {
                        window.alert("You must include some notes!");
                        refEventTime.current.focus();
                        return;
                      }

                      if (event_parameters.event_date.trim() === "") {
                        window.alert("You must include the event date!");
                        refEventTime.current.focus();
                        return;
                      }

                      if (event_parameters.event_time.trim() === "") {
                        window.alert("You must include the event time!");
                        refEventTime.current.focus();
                        return;
                      }
                    }

                    if (window.confirm("Save this event?")) {
                      e.preventDefault();
                      axios
                        .post(
                          props.serverUrl + "/saveOrderEvent",
                          event_parameters
                        )
                        .then(async (res) => {
                          if (res.data.result === "OK") {
                            await setSelectedOrder({
                              ...selectedOrder,
                              events: res.data.order_events,
                            });

                            setDispatchEvent({});
                            setDispatchEventLocation("");
                            setDispatchEventNotes("");
                            setDispatchEventDate("");
                            setDispatchEventTime("");

                            setDispatchEventItems([]);
                            setShowDispatchEventSecondPageItems(false);
                            setDispatchEventSecondPageItems([]);

                            refDispatchEvents.current.focus();
                          } else if (res.data.result === "ORDER ID NOT VALID") {
                            window.alert("The order number is not valid!");
                            refEventTime.current.focus();
                          }
                        })
                        .catch((e) => {
                          console.log("error saving order event", e);
                        });
                    } else {
                      e.preventDefault();

                      setDispatchEventItems([]);
                      setShowDispatchEventSecondPageItems(false);
                      setDispatchEventSecondPageItems([]);

                      refEventTime.current.focus();
                    }
                  }
                }
              }}
              onInput={(e) => {
                setDispatchEventTime(e.target.value);
              }}
              onChange={(e) => {
                setDispatchEventTime(e.target.value);
              }}
              value={dispatchEventTime || ""}
            />
          </div>
          <div className="form-h-sep"></div>
          <div
            style={{
              borderRight: "solid 1px rgba(0,0,0,0.5)",
              width: 1,
              height: "100%",
              marginLeft: 8,
            }}
          ></div>
        </div>

        <div
          style={{
            flexGrow: 1,
            display: "grid",
            gridTemplateColumns:
              ".8fr 0.1fr 1.3fr 0.1fr 1.3fr 0.1fr 1.3fr 0.1fr .9fr",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: "0.7rem",
                textDecoration: "underline",
                fontWeight: "bold",
                whiteSpace: "nowrap",
                textAlign: "center",
                marginBottom: 1,
              }}
            >
              Miles
            </div>
            <div
              style={{
                fontSize: "0.7rem",
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexGrow: 1,
              }}
            >
              {mileageLoaderVisible ? (
                <div
                  className="loading-container"
                  style={{ right: "initial", left: "50%" }}
                >
                  <Loader
                    type="ThreeDots"
                    color="#333738"
                    height={20}
                    width={20}
                    visible={mileageLoaderVisible}
                  />
                </div>
              ) : (
                ((selectedOrder?.miles || 0) / 1609.34).toFixed(0)
              )}
            </div>
          </div>
          <div
            style={{
              fontSize: "0.8rem",
              display: "flex",
              alignItems: "center",
              color: "rgba(0,0,0,0.5)",
            }}
          >
            |
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: "0.7rem",
                textDecoration: "underline",
                fontWeight: "bold",
                textAlign: "center",
                whiteSpace: "nowrap",
                marginBottom: 1,
              }}
            >
              Customer Charges
            </div>
            <div
              style={{
                fontSize: "0.7rem",
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexGrow: 1,
              }}
            >
              <NumberFormat
                className={classnames({
                  "negative-number":
                    Number(
                      (
                        (selectedOrder?.order_customer_ratings || []).reduce(
                          (a, b) => {
                            return {
                              total_charges:
                                Number(a.total_charges) +
                                Number(b.total_charges),
                            };
                          },
                          { total_charges: "" }
                        )?.total_charges || ""
                      )
                        .toString()
                        .replace(",", "")
                    ) < 0,
                })}
                style={{ fontSize: "0.7rem", textAlign: "center" }}
                value={new Intl.NumberFormat("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(
                  Number(
                    (
                      (selectedOrder?.order_customer_ratings || []).reduce(
                        (a, b) => {
                          return {
                            total_charges:
                              Number(a.total_charges) + Number(b.total_charges),
                          };
                        },
                        { total_charges: "" }
                      )?.total_charges || ""
                    )
                      .toString()
                      .replace(",", "")
                  )
                )}
                thousandsGroupStyle="thousand"
                thousandSeparator={true}
                decimalScale={2}
                fixedDecimalScale={true}
                prefix={"$ "}
                type="text"
                onValueChange={(values) => { }}
                displayType={"text"}
                readOnly={true}
              />
            </div>
          </div>
          <div
            style={{
              fontSize: "0.8rem",
              display: "flex",
              alignItems: "center",
              color: "rgba(0,0,0,0.5)",
            }}
          >
            |
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: "0.7rem",
                textDecoration: "underline",
                fontWeight: "bold",
                textAlign: "center",
                whiteSpace: "nowrap",
                marginBottom: 1,
              }}
            >
              Carrier Costs
            </div>
            <div
              style={{
                fontSize: "0.7rem",
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexGrow: 1,
              }}
            >
              <NumberFormat
                className={classnames({
                  "negative-number":
                    Number(
                      (
                        (selectedOrder?.order_carrier_ratings || []).reduce(
                          (a, b) => {
                            return {
                              total_charges:
                                Number(a.total_charges) +
                                Number(b.total_charges),
                            };
                          },
                          { total_charges: "" }
                        )?.total_charges || ""
                      )
                        .toString()
                        .replace(",", "")
                    ) < 0,
                })}
                style={{ fontSize: "0.7rem", textAlign: "center" }}
                value={new Intl.NumberFormat("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(
                  Number(
                    (
                      (selectedOrder?.order_carrier_ratings || []).reduce(
                        (a, b) => {
                          return {
                            total_charges:
                              Number(a.total_charges) + Number(b.total_charges),
                          };
                        },
                        { total_charges: "" }
                      )?.total_charges || ""
                    )
                      .toString()
                      .replace(",", "")
                  )
                )}
                thousandsGroupStyle="thousand"
                thousandSeparator={true}
                decimalScale={2}
                fixedDecimalScale={true}
                prefix={"$ "}
                type="text"
                onValueChange={(values) => { }}
                displayType={"text"}
                readOnly={true}
              />
            </div>
          </div>
          <div
            style={{
              fontSize: "0.8rem",
              display: "flex",
              alignItems: "center",
              color: "rgba(0,0,0,0.5)",
            }}
          >
            |
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: "0.7rem",
                textDecoration: "underline",
                fontWeight: "bold",
                textAlign: "center",
                whiteSpace: "nowrap",
                marginBottom: 1,
              }}
            >
              Profit
            </div>
            <div
              style={{
                fontSize: "0.7rem",
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexGrow: 1,
              }}
            >
              <NumberFormat
                className={classnames({
                  "negative-number":
                    Number(
                      (
                        (selectedOrder?.order_customer_ratings || []).reduce(
                          (a, b) => {
                            return {
                              total_charges:
                                Number(
                                  (a.total_charges || "")
                                    .toString()
                                    .replace(",", "")
                                ) +
                                Number(
                                  (b.total_charges || "")
                                    .toString()
                                    .replace(",", "")
                                ),
                            };
                          },
                          { total_charges: "" }
                        )?.total_charges || ""
                      )
                        .toString()
                        .replace(",", "")
                    ) -
                    Number(
                      (
                        (selectedOrder?.order_carrier_ratings || []).reduce(
                          (a, b) => {
                            return {
                              total_charges:
                                Number(
                                  (a.total_charges || "")
                                    .toString()
                                    .replace(",", "")
                                ) +
                                Number(
                                  (b.total_charges || "")
                                    .toString()
                                    .replace(",", "")
                                ),
                            };
                          },
                          { total_charges: "" }
                        )?.total_charges || ""
                      )
                        .toString()
                        .replace(",", "")
                    ) <
                    0,
                })}
                style={{ fontSize: "0.7rem", textAlign: "center" }}
                value={new Intl.NumberFormat("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(
                  Number(
                    (
                      (selectedOrder?.order_customer_ratings || []).reduce(
                        (a, b) => {
                          return {
                            total_charges:
                              Number(
                                (a.total_charges || "")
                                  .toString()
                                  .replace(",", "")
                              ) +
                              Number(
                                (b.total_charges || "")
                                  .toString()
                                  .replace(",", "")
                              ),
                          };
                        },
                        { total_charges: "" }
                      )?.total_charges || ""
                    )
                      .toString()
                      .replace(",", "")
                  ) -
                  Number(
                    (
                      (selectedOrder?.order_carrier_ratings || []).reduce(
                        (a, b) => {
                          return {
                            total_charges:
                              Number(
                                (a.total_charges || "")
                                  .toString()
                                  .replace(",", "")
                              ) +
                              Number(
                                (b.total_charges || "")
                                  .toString()
                                  .replace(",", "")
                              ),
                          };
                        },
                        { total_charges: "" }
                      )?.total_charges || ""
                    )
                      .toString()
                      .replace(",", "")
                  )
                )}
                thousandsGroupStyle="thousand"
                thousandSeparator={true}
                decimalScale={2}
                fixedDecimalScale={true}
                prefix={"$ "}
                type="text"
                onValueChange={(values) => { }}
                displayType={"text"}
                readOnly={true}
              />
            </div>
          </div>
          <div
            style={{
              fontSize: "0.8rem",
              display: "flex",
              alignItems: "center",
              color: "rgba(0,0,0,0.5)",
            }}
          >
            |
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: "0.7rem",
                textDecoration: "underline",
                fontWeight: "bold",
                textAlign: "center",
                whiteSpace: "nowrap",
                marginBottom: 1,
              }}
            >
              Percentage
            </div>
            <div
              style={{
                fontSize: "0.7rem",
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexGrow: 1,
              }}
            >
              <NumberFormat
                className={classnames({
                  "negative-number":
                    (Number(
                      (
                        (selectedOrder?.order_customer_ratings || []).reduce(
                          (a, b) => {
                            return {
                              total_charges:
                                Number(
                                  (a.total_charges || "")
                                    .toString()
                                    .replace(",", "")
                                ) +
                                Number(
                                  (b.total_charges || "")
                                    .toString()
                                    .replace(",", "")
                                ),
                            };
                          },
                          { total_charges: "" }
                        )?.total_charges || ""
                      )
                        .toString()
                        .replace(",", "")
                    ) > 0 ||
                      Number(
                        (
                          (selectedOrder?.order_carrier_ratings || []).reduce(
                            (a, b) => {
                              return {
                                total_charges:
                                  Number(
                                    (a.total_charges || "")
                                      .toString()
                                      .replace(",", "")
                                  ) +
                                  Number(
                                    (b.total_charges || "")
                                      .toString()
                                      .replace(",", "")
                                  ),
                              };
                            },
                            { total_charges: "" }
                          )?.total_charges || ""
                        )
                          .toString()
                          .replace(",", "")
                      ) > 0
                      ? ((Number(
                        (
                          (
                            selectedOrder?.order_customer_ratings || []
                          ).reduce(
                            (a, b) => {
                              return {
                                total_charges:
                                  Number(
                                    (a.total_charges || "")
                                      .toString()
                                      .replace(",", "")
                                  ) +
                                  Number(
                                    (b.total_charges || "")
                                      .toString()
                                      .replace(",", "")
                                  ),
                              };
                            },
                            { total_charges: "" }
                          )?.total_charges || ""
                        )
                          .toString()
                          .replace(",", "")
                      ) -
                        Number(
                          (
                            (
                              selectedOrder?.order_carrier_ratings || []
                            ).reduce(
                              (a, b) => {
                                return {
                                  total_charges:
                                    Number(
                                      (a.total_charges || "")
                                        .toString()
                                        .replace(",", "")
                                    ) +
                                    Number(
                                      (b.total_charges || "")
                                        .toString()
                                        .replace(",", "")
                                    ),
                                };
                              },
                              { total_charges: "" }
                            )?.total_charges || ""
                          )
                            .toString()
                            .replace(",", "")
                        )) *
                        100) /
                      (Number(
                        (
                          (
                            selectedOrder?.order_customer_ratings || []
                          ).reduce(
                            (a, b) => {
                              return {
                                total_charges:
                                  Number(
                                    (a.total_charges || "")
                                      .toString()
                                      .replace(",", "")
                                  ) +
                                  Number(
                                    (b.total_charges || "")
                                      .toString()
                                      .replace(",", "")
                                  ),
                              };
                            },
                            { total_charges: "" }
                          )?.total_charges || ""
                        )
                          .toString()
                          .replace(",", "")
                      ) > 0
                        ? Number(
                          (
                            (
                              selectedOrder?.order_customer_ratings || []
                            ).reduce(
                              (a, b) => {
                                return {
                                  total_charges:
                                    Number(
                                      (a.total_charges || "")
                                        .toString()
                                        .replace(",", "")
                                    ) +
                                    Number(
                                      (b.total_charges || "")
                                        .toString()
                                        .replace(",", "")
                                    ),
                                };
                              },
                              { total_charges: "" }
                            )?.total_charges || ""
                          )
                            .toString()
                            .replace(",", "")
                        )
                        : Number(
                          (
                            (
                              selectedOrder?.order_carrier_ratings || []
                            ).reduce(
                              (a, b) => {
                                return {
                                  total_charges:
                                    Number(
                                      (a.total_charges || "")
                                        .toString()
                                        .replace(",", "")
                                    ) +
                                    Number(
                                      (b.total_charges || "")
                                        .toString()
                                        .replace(",", "")
                                    ),
                                };
                              },
                              { total_charges: "" }
                            )?.total_charges || ""
                          )
                            .toString()
                            .replace(",", "")
                        ))
                      : 0) < 0,
                })}
                style={{ fontSize: "0.7rem", textAlign: "center" }}
                value={
                  Number(
                    (
                      (selectedOrder?.order_customer_ratings || []).reduce(
                        (a, b) => {
                          return {
                            total_charges:
                              Number(
                                (a.total_charges || "")
                                  .toString()
                                  .replace(",", "")
                              ) +
                              Number(
                                (b.total_charges || "")
                                  .toString()
                                  .replace(",", "")
                              ),
                          };
                        },
                        { total_charges: "" }
                      )?.total_charges || ""
                    )
                      .toString()
                      .replace(",", "")
                  ) > 0 ||
                    Number(
                      (
                        (selectedOrder?.order_carrier_ratings || []).reduce(
                          (a, b) => {
                            return {
                              total_charges:
                                Number(
                                  (a.total_charges || "")
                                    .toString()
                                    .replace(",", "")
                                ) +
                                Number(
                                  (b.total_charges || "")
                                    .toString()
                                    .replace(",", "")
                                ),
                            };
                          },
                          { total_charges: "" }
                        )?.total_charges || ""
                      )
                        .toString()
                        .replace(",", "")
                    ) > 0
                    ? ((Number(
                      (
                        (selectedOrder?.order_customer_ratings || []).reduce(
                          (a, b) => {
                            return {
                              total_charges:
                                Number(
                                  (a.total_charges || "")
                                    .toString()
                                    .replace(",", "")
                                ) +
                                Number(
                                  (b.total_charges || "")
                                    .toString()
                                    .replace(",", "")
                                ),
                            };
                          },
                          { total_charges: "" }
                        )?.total_charges || ""
                      )
                        .toString()
                        .replace(",", "")
                    ) -
                      Number(
                        (
                          (selectedOrder?.order_carrier_ratings || []).reduce(
                            (a, b) => {
                              return {
                                total_charges:
                                  Number(
                                    (a.total_charges || "")
                                      .toString()
                                      .replace(",", "")
                                  ) +
                                  Number(
                                    (b.total_charges || "")
                                      .toString()
                                      .replace(",", "")
                                  ),
                              };
                            },
                            { total_charges: "" }
                          )?.total_charges || ""
                        )
                          .toString()
                          .replace(",", "")
                      )) *
                      100) /
                    (Number(
                      (
                        (selectedOrder?.order_customer_ratings || []).reduce(
                          (a, b) => {
                            return {
                              total_charges:
                                Number(
                                  (a.total_charges || "")
                                    .toString()
                                    .replace(",", "")
                                ) +
                                Number(
                                  (b.total_charges || "")
                                    .toString()
                                    .replace(",", "")
                                ),
                            };
                          },
                          { total_charges: "" }
                        )?.total_charges || ""
                      )
                        .toString()
                        .replace(",", "")
                    ) > 0
                      ? Number(
                        (
                          (
                            selectedOrder?.order_customer_ratings || []
                          ).reduce(
                            (a, b) => {
                              return {
                                total_charges:
                                  Number(
                                    (a.total_charges || "")
                                      .toString()
                                      .replace(",", "")
                                  ) +
                                  Number(
                                    (b.total_charges || "")
                                      .toString()
                                      .replace(",", "")
                                  ),
                              };
                            },
                            { total_charges: "" }
                          )?.total_charges || ""
                        )
                          .toString()
                          .replace(",", "")
                      )
                      : Number(
                        (
                          (
                            selectedOrder?.order_carrier_ratings || []
                          ).reduce(
                            (a, b) => {
                              return {
                                total_charges:
                                  Number(
                                    (a.total_charges || "")
                                      .toString()
                                      .replace(",", "")
                                  ) +
                                  Number(
                                    (b.total_charges || "")
                                      .toString()
                                      .replace(",", "")
                                  ),
                              };
                            },
                            { total_charges: "" }
                          )?.total_charges || ""
                        )
                          .toString()
                          .replace(",", "")
                      ))
                    : 0
                }
                thousandsGroupStyle="thousand"
                thousandSeparator={true}
                decimalScale={2}
                fixedDecimalScale={true}
                prefix={""}
                suffix={"%"}
                type="text"
                displayType={"text"}
                readOnly={true}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="fields-container-row" style={{ flexGrow: 1 }}>
        <div className="form-bordered-box">
          <div className="form-header">
            <div className="top-border top-border-left"></div>
            <div className="form-title">Events</div>
            <div className="top-border top-border-middle"></div>
            <div className="form-buttons">
              <div
                className="mochi-button"
                onClick={() => {
                  if (
                    (selectedOrder?.id || 0) === 0 ||
                    selectedOrder.events.length === 0
                  ) {
                    window.alert("There is nothing to print!");
                    return;
                  }

                  let html = `<h2>Order Number: ${selectedOrder.order_number} - Events</h2></br></br>`;

                  html += `
                                    <div style="display:flex;align-items:center;font-size: 0.9rem;font-weight:bold;margin-bottom:10px;color: rgba(0,0,0,0.8)">
                                        <div style="min-width:15%;max-width:15%;text-decoration:underline">Date & Time</div>
                                        <div style="min-width:10%;max-width:10%;text-decoration:underline">User ID</div>
                                        <div style="min-width:15%;max-width:15%;text-decoration:underline">Event</div>
                                        <div style="min-width:20%;max-width:20%;text-decoration:underline">Location</div>
                                        <div style="min-width:40%;max-width:40%;text-decoration:underline">Notes</div>
                                        
                                    </div>
                                    `;

                  selectedOrder.events.map((item, index) => {
                    html += `
                                    <div style="padding: 5px 0;display:flex;align-items:center;font-size: 0.7rem;font-weight:normal;margin-bottom:15px;color: rgba(0,0,0,1); borderTop:1px solid rgba(0,0,0,0.1);border-bottom:1px solid rgba(0,0,0,0.1)">
                                        <div style="min-width:15%;max-width:15%;">${item.event_date
                      }@${item.event_time}</div>
                                        <div style="min-width:10%;max-width:10%;">${item.user_id
                      }</div>
                                        <div style="min-width:15%;max-width:15%;">${item.event_type.name.toUpperCase()}</div>
                                        <div style="min-width:20%;max-width:20%;">${item.event_location || ""
                      }</div>
                                        <div style="min-width:40%;max-width:40%;">${item.event_notes || ""
                      }</div> 
                                    </div>
                                    `;

                    return true;
                  });

                  printWindow(html);
                }}
              >
                <div className="mochi-button-decorator mochi-button-decorator-left">
                  (
                </div>
                <div className="mochi-button-base">Print</div>
                <div className="mochi-button-decorator mochi-button-decorator-right">
                  )
                </div>
              </div>
            </div>
            <div className="top-border top-border-right"></div>
          </div>

          <div className="order-events-container">
            {(selectedOrder?.events || []).length > 0 && (
              <div className="order-events-item">
                <div className="event-date">Date</div>
                <div className="event-time">Time</div>
                <div className="event-user-id">User ID</div>
                <div className="event-type">Event</div>
                <div className="event-location">Location</div>
                <div className="event-notes">Notes</div>
                <div className="event-date">Event Date</div>
                <div className="event-time">Event Time</div>
              </div>
            )}

            <div className="order-events-wrapper">
              {(selectedOrder?.events || []).map((item, index) => (
                <div className="order-events-item" key={index}>
                  <div className="event-date">{item.date}</div>
                  <div className="event-time">{item.time}</div>
                  <div className="event-user-id">{item.user_id}</div>
                  <div className="event-type">
                    {item.event_type.name.toUpperCase()}
                  </div>
                  <div className="event-location">{item.event_location}</div>
                  <div className="event-notes">{item.event_notes}</div>
                  <div className="event-date">{item.event_date}</div>
                  <div className="event-time">{item.event_time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {changeCarrierTransition(
        (style, item) =>
          item && (
            <animated.div
              className="change-carrier-main-container"
              style={{
                ...style,
                position: "absolute",
                width: "100%",
                height: "100%",
                top: 0,
                left: 0,
                backgroundColor: "rgba(0,0,0,0.3)",
              }}
            >
              <div
                className="change-carrier-wrapper"
                style={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ChangeCarrier
                  panelName={`${props.panelName}-change-carrier`}
                  tabTimes={props.tabTimes}
                  componentId={moment().format("x")}
                  openPanel={props.openPanel}
                  closePanel={props.closePanel}
                  origin={props.origin}
                  closeModal={() => {
                    setShowingChangeCarrier(false);
                  }}
                  updateCarrier={() => { }}
                  selectedOrder={selectedOrder}
                />
              </div>
            </animated.div>
          )
      )}

      {loadingTransition(
        (style, item) =>
          item && (
            <animated.div className="loading-container" style={style}>
              <div className="loading-container-wrapper">
                <Loader
                  type="Circles"
                  color="#009bdd"
                  height={40}
                  width={40}
                  visible={item}
                />
              </div>
            </animated.div>
          )
      )}

      {noteForDriverTransition(
        (style, item) =>
          item && (
            <animated.div style={{ ...style }}>
              <DispatchModal
                selectedData={selectedNoteForDriver}
                setSelectedData={setSelectedNoteForDriver}
                selectedParent={selectedOrder}
                setSelectedParent={(notes) => {
                  setSelectedOrder((selectedOrder) => {
                    return { ...selectedOrder, notes_for_driver: notes };
                  });
                }}
                savingDataUrl="/saveNotesForDriver"
                deletingDataUrl="/deleteNotesForDriver"
                type="note"
                isEditable={true}
                isDeletable={true}
                isAdding={selectedNoteForDriver?.id === 0}
              />
            </animated.div>
          )
      )}

      {noteForCarrierTransition(
        (style, item) =>
          item && (
            <animated.div style={{ ...style }}>
              <DispatchModal
                selectedData={selectedNoteForCarrier}
                setSelectedData={setSelectedNoteForCarrier}
                selectedParent={selectedOrder}
                setSelectedParent={(notes) => {
                  setSelectedOrder((selectedOrder) => {
                    return { ...selectedOrder, notes_for_carrier: notes };
                  });
                }}
                savingDataUrl="/saveNotesForCarrier"
                deletingDataUrl="/deleteNotesForCarrier"
                type="note"
                isEditable={true}
                isDeletable={true}
                isAdding={selectedNoteForCarrier?.id === 0}
              />
            </animated.div>
          )
      )}

      {internalNoteTransition(
        (style, item) =>
          item && (
            <animated.div style={{ ...style }}>
              <DispatchModal
                selectedData={selectedInternalNote}
                setSelectedData={setSelectedInternalNote}
                selectedParent={selectedOrder}
                setSelectedParent={(notes) => {
                  setSelectedOrder((selectedOrder) => {
                    return { ...selectedOrder, internal_notes: notes };
                  });
                }}
                savingDataUrl="/saveInternalNotes"
                deletingDataUrl=""
                type="note"
                isEditable={false}
                isDeletable={false}
                isAdding={selectedInternalNote?.id === 0}
              />
            </animated.div>
          )
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    scale: state.systemReducers.scale,
    serverUrl: state.systemReducers.serverUrl,
    companyOpenedPanels: state.companyReducers.companyOpenedPanels,
    adminOpenedPanels: state.adminReducers.adminOpenedPanels,
    dispatchOpenedPanels: state.dispatchReducers.dispatchOpenedPanels,
    customerOpenedPanels: state.customerReducers.customerOpenedPanels,
    adminCustomerOpenedPanels: state.customerReducers.adminCustomerOpenedPanels,
    adminCarrierOpenedPanels: state.carrierReducers.adminCarrierOpenedPanels,
    loadBoardOpenedPanels: state.loadBoardReducers.loadBoardOpenedPanels,
    invoiceOpenedPanels: state.invoiceReducers.invoiceOpenedPanels,

    selectedOrder: state.dispatchReducers.selected_order,
    selectedCustomer: state.customerReducers.selectedCustomer,
    selectedCustomerContact: state.customerReducers.selectedContact,
    selectedCarrier: state.carrierReducers.selectedCarrier,
    selectedCarrierContact: state.carrierReducers.selectedContact,
    selectedCarrierDriver: state.carrierReducers.selectedDriver,
    selectedCarrieInsurance: state.carrierReducers.selectedInsurance,
  };
};

export default connect(mapStateToProps, {
  setCompanyOpenedPanels,
  setDispatchOpenedPanels,
  setCustomerOpenedPanels,
  setCarrierOpenedPanels,
  setLoadBoardOpenedPanels,
  setInvoiceOpenedPanels,
  setAdminCustomerOpenedPanels,
  setAdminCarrierOpenedPanels,
  setSelectedOrder,
  setSelectedCustomer,
  setSelectedContact,
  setSelectedCarrier,
  setSelectedCarrierContact,
  setSelectedCarrierDriver,
  setSelectedCarrierInsurance,
})(Dispatch);
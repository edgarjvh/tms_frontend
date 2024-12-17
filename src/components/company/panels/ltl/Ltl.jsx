/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import './Ltl.css'
import { useTransition, animated, useSpring } from 'react-spring';
import { Modal } from './../../panels';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCaretDown,
  faCaretRight,
  faCalendarAlt,
  faPencilAlt,
  faCheck,
  faTrashAlt
} from '@fortawesome/free-solid-svg-icons';
import Loader from 'react-loader-spinner';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import axios from 'axios';
import { useDetectClickOutside } from "react-detect-click-outside";
import classnames from 'classnames';
import Highlighter from "react-highlight-words";
import MaskedInput from 'react-text-mask';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { useDebounce } from '../../../../hooks/useDebounce';

const Ltl = (props) => {
  const refLtlContainer = useRef()
  const refUnits = useRef()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedLtlUnit, setSelectedLtlUnit] = useState(null)
  const [ltlUnits, setLtlUnits] = useState([])
  const [accessorials, setAccessorials] = useState([])
  const [selectedAccessorial, setSelectedAccessorial] = useState(null)
  const [isSavingLtlUnit, setIsSavingLtlUnit] = useState(false)
  const [isSavingAccessorial, setIsSavingAccessorial] = useState(false)

  const [handlingUnitsInput, setHandlingUnitsInput] = useState('')
  const refHandlingUnits = useRef()
  const [handlingUnitsItems, setHandlingUnitsItems] = useState([]);
  const refHandlingUnitsPopupItems = useRef([]);
  const refHandlingUnitsDropDown = useDetectClickOutside({
    onTriggered: async () => {
      setHandlingUnitsItems([]);
    }
  });

  const refWeight = useRef()
  const [showWeightItems, setShowWeightItems] = useState(false)
  const [weightItems, setWeightItems] = useState([
    {
      id: 1,
      name: 'Pounds',
      value: 'lb',
      selected: false
    },
    {
      id: 2,
      name: 'Kilograms',
      value: 'kg',
      selected: false
    }
  ])
  const refWeightPopupItems = useRef([]);
  const refWeightDropDown = useDetectClickOutside({
    onTriggered: async () => {
      setShowWeightItems(false)
    }
  });

  const refDimensionUnits = useRef()
  const [showDimensionUnitsItems, setShowDimensionUnitsItems] = useState(false)
  const [dimensionUnitsItems, setDimensionUnitsItems] = useState([
    {
      id: 1,
      name: 'Feet ',
      value: 'ft',
      selected: false
    },
    {
      id: 2,
      name: 'Inches',
      value: 'in',
      selected: false
    },
    {
      id: 3,
      name: 'Centimeters',
      value: 'cm',
      selected: false
    },
    {
      id: 4,
      name: 'Meters',
      value: 'm',
      selected: false
    }
  ]);
  const refDimensionUnitsPopupItems = useRef([]);
  const refDimensionUnitsDropDown = useDetectClickOutside({
    onTriggered: async () => {
      setShowDimensionUnitsItems(false)
    }
  });

  const [unitClassesInput, setUnitClassesInput] = useState('')
  const refUnitClass = useRef()
  const [unitClassItems, setUnitClassItems] = useState([]);
  const refUnitClassPopupItems = useRef([]);
  const refUnitClassDropDown = useDetectClickOutside({
    onTriggered: async () => {
      setUnitClassItems([])
    }
  });

  const refHazmatName = useRef()

  const [hazmatPackagingInput, setHazmatPackagingInput] = useState('')
  const refHazmatPackaging = useRef()
  const [hazmatPackagingItems, setHazmatPackagingItems] = useState([]);
  const refHazmatPackagingPopupItems = useRef([]);
  const refHazmatPackagingDropDown = useDetectClickOutside({
    onTriggered: async () => {
      setHazmatPackagingItems([])
    }
  });

  const refHazmatGroup = useRef()
  const [showHazmatGroupItems, setShowHazmatGroupItems] = useState(false)
  const [hazmatGroupItems, setHazmatGroupItems] = useState([
    {
      id: 1,
      name: 'I',
      value: 'I',
      selected: false
    },
    {
      id: 2,
      name: 'II',
      value: 'II',
      selected: false
    },
    {
      id: 3,
      name: 'III',
      value: 'III',
      selected: false
    },
    {
      id: 4,
      name: 'N/A',
      value: 'N/A',
      selected: false
    }
  ]);
  const refHazmatGroupPopupItems = useRef([]);
  const refHazmatGroupDropDown = useDetectClickOutside({
    onTriggered: async () => {
      setShowHazmatGroupItems(false)
    }
  });

  const [hazmatClassesInput, setHazmatClassesInput] = useState('')
  const refHazmatClass = useRef()
  const [hazmatClassItems, setHazmatClassItems] = useState([]);
  const refHazmatClassPopupItems = useRef([]);
  const refHazmatClassDropDown = useDetectClickOutside({
    onTriggered: async () => {
      setHazmatClassItems([])
    }
  });

  const [accessorialsInput, setAccessorialsInput] = useState('')
  const refAccessorials = useRef()
  const [accessorialsItems, setAccessorialsItems] = useState([]);
  const refAccessorialsPopupItems = useRef([]);
  const refAccessorialsDropDown = useDetectClickOutside({
    onTriggered: async () => {
      setAccessorialsItems([]);
    }
  });

  const [emergencyContactInput, setEmergencyContactInput] = useState('')
  const refEmergencyContact = useRef()
  const [emergencyContactItems, setEmergencyContactItems] = useState([]);
  const refEmergencyContactPopupItems = useRef([]);
  const refEmergencyContactDropDown = useDetectClickOutside({
    onTriggered: async () => {
      setEmergencyContactItems([]);
    }
  });

  const refEmergencyPhone = useRef()

  const loadingTransition = useTransition(isSavingLtlUnit || isLoading, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    reverse: isSavingLtlUnit || isLoading,
  });

  const handlingUnitsTransition = useTransition(handlingUnitsItems.length > 0, {
    from: { opacity: 0, top: 'calc(100% + 7px)' },
    enter: { opacity: 1, top: 'calc(100% + 12px)' },
    leave: { opacity: 0, top: 'calc(100% + 7px)' },
    config: { duration: 100 },
    reverse: handlingUnitsItems.length > 0
  });

  const weightTransition = useTransition(showWeightItems, {
    from: { opacity: 0, top: 'calc(100% + 7px)' },
    enter: { opacity: 1, top: 'calc(100% + 12px)' },
    leave: { opacity: 0, top: 'calc(100% + 7px)' },
    config: { duration: 100 },
    reverse: showWeightItems
  });

  const dimensionUnitsTransition = useTransition(showDimensionUnitsItems, {
    from: { opacity: 0, top: 'calc(100% + 7px)' },
    enter: { opacity: 1, top: 'calc(100% + 12px)' },
    leave: { opacity: 0, top: 'calc(100% + 7px)' },
    config: { duration: 100 },
    reverse: showDimensionUnitsItems
  });

  const unitClassTransition = useTransition(unitClassItems.length > 0, {
    from: { opacity: 0, top: 'calc(100% + 7px)' },
    enter: { opacity: 1, top: 'calc(100% + 12px)' },
    leave: { opacity: 0, top: 'calc(100% + 7px)' },
    config: { duration: 100 },
    reverse: unitClassItems.length > 0
  });

  const hazmatPackagingTransition = useTransition(hazmatPackagingItems.length > 0, {
    from: { opacity: 0, top: 'calc(100% + 7px)' },
    enter: { opacity: 1, top: 'calc(100% + 12px)' },
    leave: { opacity: 0, top: 'calc(100% + 7px)' },
    config: { duration: 100 },
    reverse: hazmatPackagingItems.length > 0
  });

  const hazmatGroupTransition = useTransition(showHazmatGroupItems, {
    from: { opacity: 0, top: 'calc(100% + 7px)' },
    enter: { opacity: 1, top: 'calc(100% + 12px)' },
    leave: { opacity: 0, top: 'calc(100% + 7px)' },
    config: { duration: 100 },
    reverse: showHazmatGroupItems
  });

  const hazmatClassTransition = useTransition(hazmatClassItems.length > 0, {
    from: { opacity: 0, top: 'calc(100% + 7px)' },
    enter: { opacity: 1, top: 'calc(100% + 12px)' },
    leave: { opacity: 0, top: 'calc(100% + 7px)' },
    config: { duration: 100 },
    reverse: hazmatClassItems.length > 0
  });

  const accessorialsTransition = useTransition(accessorialsItems.length > 0, {
    from: { opacity: 0, top: 'calc(100% + 7px)' },
    enter: { opacity: 1, top: 'calc(100% + 12px)' },
    leave: { opacity: 0, top: 'calc(100% + 7px)' },
    config: { duration: 100 },
    reverse: accessorialsItems.length > 0
  });

  const emergencyContactTransition = useTransition(emergencyContactItems.length > 0, {
    from: { opacity: 0, top: 'calc(100% + 7px)' },
    enter: { opacity: 1, top: 'calc(100% + 12px)' },
    leave: { opacity: 0, top: 'calc(100% + 7px)' },
    config: { duration: 100 },
    reverse: emergencyContactItems.length > 0
  });

  const numberMask = createNumberMask({
    prefix: '',
    suffix: '',
    includeThousandsSeparator: true,
    thousandsSeparatorSymbol: ',',
    allowDecimal: true,
    decimalSymbol: '.',
    decimalLimit: 2,
    integerLimit: 15,
    allowNegative: true,
    allowLeadingZeroes: false,
  })

  useEffect(() => {
    setIsLoading(true)

    axios.post(props.serverUrl + '/getLtlUnitsAccessorialsByOrderId', {
      order_id: props.selectedOrderId
    }).then(res => {
      if (res.data.result === 'OK') {
        setLtlUnits(res.data.ltl_units)
        setAccessorials(res.data.accessorials)
      }
    }).catch(e => {
      console.log('error getting ltl units', e)
    }).finally(() => {
      setIsLoading(false)
    })
  }, [])

  useEffect(() => {
    if (refUnits.current) {
      refUnits.current.inputElement.focus({ preventScroll: true });
    }
  }, [refUnits.current])

  useEffect(() => {
    if ((selectedLtlUnit?.weight || '') !== '' &&
      (selectedLtlUnit?.weight_unit || '') !== '' &&
      (selectedLtlUnit?.length || '') !== '' &&
      (selectedLtlUnit?.width || '') !== '' &&
      (selectedLtlUnit?.height || '') !== '' &&
      (selectedLtlUnit?.dimension_unit || '') !== '') {

      const weight = parseFloat(selectedLtlUnit.weight.toString().replace(/,/g, ''));
      const length = parseFloat(selectedLtlUnit.length.toString().replace(/,/g, ''));
      const width = parseFloat(selectedLtlUnit.width.toString().replace(/,/g, ''));
      const height = parseFloat(selectedLtlUnit.height.toString().replace(/,/g, ''));

      if (isNaN(weight) || isNaN(length) || isNaN(width) || isNaN(height)) {
        console.error('Invalid input for weight or dimensions');
        return;
      }

      const weightInPounds = selectedLtlUnit.weight_unit === 'kg' ? weight * 2.20462 : weight;
      const lengthInFeet = selectedLtlUnit.dimension_unit === 'in' ? length / 12 : selectedLtlUnit.dimension_unit === 'cm' ? length / 30.48 : selectedLtlUnit.dimension_unit === 'm' ? length * 3.28084 : length;
      const widthInFeet = selectedLtlUnit.dimension_unit === 'in' ? width / 12 : selectedLtlUnit.dimension_unit === 'cm' ? width / 30.48 : selectedLtlUnit.dimension_unit === 'm' ? width * 3.28084 : width;
      const heightInFeet = selectedLtlUnit.dimension_unit === 'in' ? height / 12 : selectedLtlUnit.dimension_unit === 'cm' ? height / 30.48 : selectedLtlUnit.dimension_unit === 'm' ? height * 3.28084 : height;

      const volumeInCubicFeet = lengthInFeet * widthInFeet * heightInFeet;
      const density = weightInPounds / volumeInCubicFeet;

      let unitClass = '';

      if (density >= 50) {
        unitClass = '50';
      } else if (density >= 35 && density < 50) {
        unitClass = '55';
      } else if (density >= 30 && density < 35) {
        unitClass = '60';
      } else if (density >= 22.5 && density < 30) {
        unitClass = '65';
      } else if (density >= 15 && density < 22.5) {
        unitClass = '70';
      } else if (density >= 13.5 && density < 15) {
        unitClass = '77.5';
      } else if (density >= 12 && density < 13.5) {
        unitClass = '85';
      } else if (density >= 10.5 && density < 12) {
        unitClass = '92.5';
      } else if (density >= 9 && density < 10.5) {
        unitClass = '100';
      } else if (density >= 8 && density < 9) {
        unitClass = '110';
      } else if (density >= 7 && density < 8) {
        unitClass = '125';
      } else if (density >= 6 && density < 7) {
        unitClass = '150';
      } else if (density >= 5 && density < 6) {
        unitClass = '175';
      } else if (density >= 4 && density < 5) {
        unitClass = '200';
      } else if (density >= 3 && density < 4) {
        unitClass = '250';
      } else if (density >= 2 && density < 3) {
        unitClass = '300';
      } else if (density >= 1 && density < 2) {
        unitClass = '400';
      } else {
        unitClass = '500';
      }

      setSelectedLtlUnit(prev => ({
        ...prev,
        unit_class: {
          name: unitClass
        }
      }));
    }
  }, [
    selectedLtlUnit?.weight,
    selectedLtlUnit?.weight_unit,
    selectedLtlUnit?.length,
    selectedLtlUnit?.width,
    selectedLtlUnit?.height,
    selectedLtlUnit?.dimension_unit
  ])

  const handleClosing = (e) => {
    e.stopPropagation();

    if (selectedLtlUnit) {
      setSelectedLtlUnit(null);
      refUnits.current.inputElement.focus({ preventScroll: true });
    } else {
      props.onEscCallback();
    }
  }

  const validateLtlUnitForSaving = () => {
    if (!isSavingLtlUnit) {
      setIsSavingLtlUnit(true)
    }
  }

  useEffect(() => {
    if (isSavingLtlUnit) {
      if ((selectedLtlUnit?.units || '') === '' ||
        (selectedLtlUnit?.pieces || '') === '' ||
        !selectedLtlUnit?.handling_unit_id ||
        (selectedLtlUnit?.weight || '') === '' ||
        (selectedLtlUnit?.weight_unit || '') === '' ||
        (selectedLtlUnit?.length || '') === '' ||
        (selectedLtlUnit?.width || '') === '' ||
        (selectedLtlUnit?.height || '') === '' ||
        (selectedLtlUnit?.dimension_unit || '') === '' ||
        !selectedLtlUnit?.unit_class_id ||
        (selectedLtlUnit?.description || '') === '') {
        refUnits.current.inputElement.focus({ preventScroll: true });
        setIsSavingLtlUnit(false);
        return;
      }

      if ((selectedLtlUnit?.hazmat || 0) === 1) {
        if ((selectedLtlUnit?.hazmat_name || '') === '' ||
          !selectedLtlUnit?.hazmat_packaging_id ||
          (selectedLtlUnit?.hazmat_un_na || '') === '' ||
          (selectedLtlUnit?.hazmat_group || '') === '' ||
          !selectedLtlUnit?.hazmat_class_id ||
          (selectedLtlUnit?.emergency_contact || '') === '' ||
          (selectedLtlUnit?.emergency_phone || '') === '') {
          refHazmatName.current.focus();
          setIsSavingLtlUnit(false);
          return;
        }
      }

      setIsLoading(true)

      axios.post(props.serverUrl + '/saveLtlUnit', { ...selectedLtlUnit, order_id: props.selectedOrderId }).then(res => {
        if (res.data.result === 'OK') {
          if ((selectedLtlUnit?.id || 0) > 0) {
            setLtlUnits(ltlUnits.map(item => {
              if (item.id === selectedLtlUnit.id) {
                return selectedLtlUnit
              }
              return item;
            }))
          } else {
            setLtlUnits(prev => {
              return [
                ...prev,
                res.data.ltl_unit
              ]
            })
          }
        }
      }).catch(e => {
        console.log('error saving ltl unit', e)
      }).finally(() => {
        setIsLoading(false)
        setSelectedLtlUnit(null)
        setIsSavingLtlUnit(false)
        refUnits.current.inputElement.focus({ preventScroll: true });
      })
    }
  }, [isSavingLtlUnit])

  const deleteLtlUnit = (id) => {
    axios.post(props.serverUrl + '/deleteLtlUnit', { id }).then(res => {
      if (res.data.result === 'OK') {
        setLtlUnits(prev => {
          return prev.filter(item => item.id !== id)
        })
      }
    }).catch(e => {
      console.log('error deleting ltl unit', e)
    }).finally(() => {
      setSelectedLtlUnit(null)
      refUnits.current.inputElement.focus({ preventScroll: true });
    })
  }

  const handlingUnitsDebounceValue = useDebounce(handlingUnitsInput);
  const unitClassesDebounceValue = useDebounce(unitClassesInput);
  const hazmatPackagingDebounceValue = useDebounce(hazmatPackagingInput);
  const hazmatClassesDebounceValue = useDebounce(hazmatClassesInput);
  const accessorialsDebounceValue = useDebounce(accessorialsInput);
  const emergencyContactDebounceValue = useDebounce(emergencyContactInput);

  useEffect(() => {
    const getData = async () => {
      const response = await axios.post(`${props.serverUrl}/getHandlingUnits`, { name: handlingUnitsDebounceValue });
      if (response.data.result === 'OK') {
        setHandlingUnitsItems(response.data.handling_units.map((item, index) => ({
          ...item,
          selected: index === 0
        })));
      }
    }

    (handlingUnitsInput || '') !== '' ? getData() : setHandlingUnitsItems([])
  }, [handlingUnitsDebounceValue])

  useEffect(() => {
    const getData = async () => {
      const response = await axios.post(`${props.serverUrl}/getUnitClasses`, { name: unitClassesDebounceValue });
      if (response.data.result === 'OK') {
        setUnitClassItems(response.data.unit_classes.map((item, index) => ({
          ...item,
          selected: index === 0
        })));
      }
    }

    (unitClassesInput || '') !== '' ? getData() : setUnitClassItems([])
  }, [unitClassesDebounceValue])

  useEffect(() => {
    const getData = async () => {
      const response = await axios.post(`${props.serverUrl}/getHazmatPackagings`, { name: hazmatPackagingDebounceValue });
      if (response.data.result === 'OK') {
        setHazmatPackagingItems(response.data.hazmat_packagings.map((item, index) => ({
          ...item,
          selected: index === 0
        })));
      }
    }

    (hazmatPackagingInput || '') !== '' ? getData() : setHazmatPackagingItems([])
  }, [hazmatPackagingDebounceValue])

  useEffect(() => {
    const getData = async () => {
      const response = await axios.post(`${props.serverUrl}/getHazmatClasses`, { name: hazmatClassesDebounceValue });
      if (response.data.result === 'OK') {
        setHazmatClassItems(response.data.hazmat_classes.map((item, index) => ({
          ...item,
          selected: index === 0
        })));
      }
    }

    (hazmatClassesInput || '') !== '' ? getData() : setHazmatClassItems([])
  }, [hazmatClassesDebounceValue])

  useEffect(() => {
    const getData = async () => {
      const response = await axios.post(`${props.serverUrl}/getAccessorials`, { name: accessorialsDebounceValue });
      if (response.data.result === 'OK') {
        setAccessorialsItems(response.data.accessorials.map((item, index) => ({
          ...item,
          selected: index === 0
        })));
      }
    }

    (accessorialsInput || '') !== '' ? getData() : setAccessorialsItems([])
  }, [accessorialsDebounceValue])

  useEffect(() => {
    const getData = async () => {
      const response = await axios.post(`${props.serverUrl}/getEmergencyContacts`, { name: emergencyContactDebounceValue });
      if (response.data.result === 'OK') {
        setEmergencyContactItems(response.data.emergency_contacts.map((item, index) => ({
          ...item,
          selected: index === 0
        })));
      }
    }

    (emergencyContactInput || '') !== '' ? getData() : setEmergencyContactItems([])
  }, [emergencyContactDebounceValue])

  const deleteAccessorial = (id) => {
    setIsLoading(true)
    axios.post(props.serverUrl + '/deleteOrderAccessorial', { order_id: props.selectedOrderId, accessorial_id: id }).then(res => {
      if (res.data.result === 'OK') {
        setAccessorials(prev => {
          return prev.filter(item => item.id !== id)
        })
      }
    }).catch(e => {
      console.log('error deleting accessorial', e)
    }).finally(() => {
      setIsLoading(false)
      refAccessorials.current.focus({ preventScroll: true });
    })
  }



  const validateAccessorialForSaving = () => {
    if (!isSavingAccessorial) {
      setIsSavingAccessorial(true)
    }
  }

  useEffect(() => {
    if (isSavingAccessorial) {
      setIsLoading(true)

      axios.post(props.serverUrl + '/saveOrderAccessorials', { order_id: props.selectedOrderId, accessorials: [...(accessorials || []).map(item => item.id), selectedAccessorial.id] }).then(res => {
        if (res.data.result === 'OK') {
          setAccessorials(res.data.accessorials)
        }

      }).catch(e => {
        console.log('error saving accessorial', e)
      }).finally(() => {
        setIsLoading(false)
        setIsSavingAccessorial(false)
        setSelectedAccessorial(null)
        refAccessorials.current.focus({ preventScroll: true });
      })
    }
  }, [isSavingAccessorial])

  return (
    <div className="panel-content" tabIndex={0} ref={refLtlContainer} onKeyDown={(e) => {
      let key = e.keyCode || e.which;

      if (key === 27) {
        e.stopPropagation();
        handleClosing(e);
      }
    }}>
      <div className="drag-handler" onClick={e => e.stopPropagation()}></div>
      <div className="title">{props.title}</div>
      <div className="side-title">
        <div>{props.title}</div>
      </div>

      {
        loadingTransition((style, item) => item &&
          <animated.div className='loading-container' style={style}>
            <div className="loading-container-wrapper" style={{
              position: 'absolute',
              flexDirection: 'column'
            }}>
              <Loader type="Circles" color="#009bdd" height={40} width={40} visible={item} />
            </div>
          </animated.div>
        )
      }

      <div className="ltl-main-container">
        <div className="ltl-fields">
          <div className="form-bordered-box">
            <div className="form-header">
              <div className="top-border top-border-left"></div>
              <div className="form-title">LTL Units</div>
              <div className="top-border top-border-middle"></div>
              <div className="form-buttons">
                {
                  (selectedLtlUnit?.id || 0) > 0 &&
                  <div className="mochi-button" onClick={() => {
                    if (window.confirm('Are you sure you want to delete this LTL Unit?')) {
                      deleteLtlUnit(selectedLtlUnit.id);
                    }
                  }}>
                    <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                    <div className="mochi-button-base" style={{ color: 'darkred' }}>Delete</div>
                    <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                  </div>
                }
                <div className="mochi-button" onClick={() => {
                  setSelectedLtlUnit(null);
                  refUnits.current.inputElement.focus({ preventScroll: true });
                }}>
                  <div className="mochi-button-decorator mochi-button-decorator-left">(</div>
                  <div className="mochi-button-base">Clear</div>
                  <div className="mochi-button-decorator mochi-button-decorator-right">)</div>
                </div>
              </div>
              <div className="top-border top-border-right"></div>
            </div>
            <div className="form-wrapper">
              <div className="form-row">
                <div className="input-toggle-container" style={{ width: '6rem', maxWidth: '6rem' }} onClick={() => {
                  refUnits.current.inputElement.focus({ preventScroll: true });
                }}>
                  <input
                    type="checkbox"
                    id="cbox-ltl-hazmat-btn"

                    onChange={(e) => {
                      setSelectedLtlUnit(prev => {
                        return {
                          ...prev,
                          hazmat: e.target.checked ? 1 : 0
                        }
                      });
                    }}
                    checked={(selectedLtlUnit?.hazmat || 0) === 1}
                  />
                  <label htmlFor="cbox-ltl-hazmat-btn">
                    <div className="label-text">HazMat</div>
                    <div className="input-toggle-btn"></div>
                  </label>
                </div>

                <div className="input-box-container" style={{ width: '9rem', maxWidth: '9rem' }}>
                  <div style={{
                    fontSize: '0.7rem',
                    color: 'rgba(0,0,0,0.7)',
                    whiteSpace: 'nowrap'
                  }}>Units</div>
                  <MaskedInput
                    tabIndex={1 + props.tabTimes}
                    type="text"
                    ref={refUnits}
                    mask={numberMask}
                    guide={false}
                    maxLength={10}
                    style={{ textAlign: 'right', fontWeight: 'bold' }}
                    onInput={(e) => {
                      setSelectedLtlUnit(prev => {
                        return {
                          ...prev,
                          units: e.target.value
                        }
                      });
                    }}
                    onChange={(e) => {
                      setSelectedLtlUnit(prev => {
                        return {
                          ...prev,
                          units: e.target.value
                        }
                      });
                    }}
                    value={selectedLtlUnit?.units || ''}
                  />
                </div>

                <div className="input-box-container" style={{ width: '9rem', maxWidth: '9rem' }}>
                  <div style={{
                    fontSize: '0.7rem',
                    color: 'rgba(0,0,0,0.7)',
                    whiteSpace: 'nowrap'
                  }}>Pieces</div>
                  <MaskedInput
                    tabIndex={2 + props.tabTimes}
                    type="text"
                    style={{ textAlign: 'right', fontWeight: 'bold' }}
                    mask={numberMask}
                    guide={false}
                    maxLength={10}
                    onInput={(e) => {
                      setSelectedLtlUnit(prev => {
                        return {
                          ...prev,
                          pieces: e.target.value
                        }
                      });
                    }}
                    onChange={(e) => {
                      setSelectedLtlUnit(prev => {
                        return {
                          ...prev,
                          pieces: e.target.value
                        }
                      });
                    }}
                    value={selectedLtlUnit?.pieces || ''}
                  />
                </div>

                <div className="select-box-container" style={{ width: '9rem', maxWidth: '9rem' }}>
                  <div className="select-box-wrapper">
                    <div style={{
                      fontSize: '0.7rem',
                      color: 'rgba(0,0,0,0.7)',
                      whiteSpace: 'nowrap'
                    }}>Handling Units</div>
                    <input
                      tabIndex={3 + props.tabTimes}
                      ref={refHandlingUnits}
                      type="text"
                      style={{
                        textTransform: 'capitalize',
                        textAlign: 'right',
                        paddingRight: 16,
                      }}
                      value={selectedLtlUnit?.handling_unit?.name || ''}
                      onKeyDown={(e) => {
                        let key = e.keyCode || e.which;

                        if (key === 38) { // Arrow Up
                          e.preventDefault();
                          if (handlingUnitsItems.length > 0) {
                            let selectedIndex = handlingUnitsItems.findIndex(item => item.selected);

                            if (selectedIndex === -1) {
                              setHandlingUnitsItems(handlingUnitsItems.map((item, index) => {
                                item.selected = index === 0;
                                return item;
                              }))
                            } else {
                              setHandlingUnitsItems(handlingUnitsItems.map((item, index) => {
                                if (selectedIndex === 0) {
                                  item.selected = index === (handlingUnitsItems.length - 1);
                                } else {
                                  item.selected = index === (selectedIndex - 1);
                                }
                                return item;
                              }))
                            }

                            refHandlingUnitsPopupItems.current.map((r, i) => {
                              if (r && r.classList.contains('selected')) {
                                r.scrollIntoView({
                                  behavior: 'auto',
                                  block: 'center',
                                  inline: 'nearest'
                                })
                              }
                              return true;
                            });
                          } else {
                            axios.post(props.serverUrl + '/getHandlingUnits').then(res => {
                              if (res.data.result === 'OK') {
                                setHandlingUnitsItems(res.data.handling_units.map((item, index) => {
                                  item.selected = (selectedLtlUnit?.handling_unit?.name || '').toLowerCase() === item.name.toLowerCase();
                                  return item;
                                }))

                                refHandlingUnitsPopupItems.current.map((r, i) => {
                                  if (r && r.classList.contains('selected')) {
                                    r.scrollIntoView({
                                      behavior: 'auto',
                                      block: 'center',
                                      inline: 'nearest'
                                    })
                                  }
                                  return true;
                                });
                              }
                            }).catch(e => {
                              console.log('error getting handling units', e);
                            })
                          }
                        } else if (key === 40) { // Arrow Down
                          e.preventDefault();
                          if (handlingUnitsItems.length > 0) {
                            let selectedIndex = handlingUnitsItems.findIndex(item => item.selected);

                            if (selectedIndex === -1) {
                              setHandlingUnitsItems(handlingUnitsItems.map((item, index) => {
                                item.selected = index === 0;
                                return item;
                              }))
                            } else {
                              setHandlingUnitsItems(handlingUnitsItems.map((item, index) => {
                                if (selectedIndex === (handlingUnitsItems.length - 1)) {
                                  item.selected = index === 0;
                                } else {
                                  item.selected = index === (selectedIndex + 1);
                                }
                                return item;
                              }))
                            }

                            refHandlingUnitsPopupItems.current.map((r, i) => {
                              if (r && r.classList.contains('selected')) {
                                r.scrollIntoView({
                                  behavior: 'auto',
                                  block: 'center',
                                  inline: 'nearest'
                                })
                              }
                              return true;
                            });
                          } else {
                            axios.post(props.serverUrl + '/getHandlingUnits').then(res => {
                              if (res.data.result === 'OK') {
                                setHandlingUnitsItems(res.data.handling_units.map((item, index) => {
                                  item.selected = (selectedLtlUnit?.handling_unit?.name || '').toLowerCase() === item.name.toLowerCase();
                                  return item;
                                }))

                                refHandlingUnitsPopupItems.current.map((r, i) => {
                                  if (r && r.classList.contains('selected')) {
                                    r.scrollIntoView({
                                      behavior: 'auto',
                                      block: 'center',
                                      inline: 'nearest'
                                    })
                                  }
                                  return true;
                                });
                              }
                            }).catch(e => {
                              console.log('error getting handling units', e);
                            })
                          }
                        } else if (key === 27) { // Escape
                          if (handlingUnitsItems.length > 0) {
                            e.stopPropagation();
                            setHandlingUnitsItems([]);
                          } else {
                            handleClosing(e);
                          }

                        } else if (key === 13) { // Enter
                          if (handlingUnitsItems.length > 0 && handlingUnitsItems.findIndex(item => item.selected) > -1) {
                            setSelectedLtlUnit(prev => {
                              return {
                                ...prev,
                                handling_unit: handlingUnitsItems[handlingUnitsItems.findIndex(item => item.selected)],
                                handling_unit_id: handlingUnitsItems[handlingUnitsItems.findIndex(item => item.selected)].id
                              }
                            })

                            window.setTimeout(() => {
                              setHandlingUnitsItems([]);
                              refHandlingUnits.current.focus();
                            }, 0);
                          }
                        } else if (key === 9) { // Tab
                          if (handlingUnitsItems.length > 0) {
                            e.preventDefault();
                            setSelectedLtlUnit(prev => {
                              return {
                                ...prev,
                                handling_unit: handlingUnitsItems[handlingUnitsItems.findIndex(item => item.selected)],
                                handling_unit_id: handlingUnitsItems[handlingUnitsItems.findIndex(item => item.selected)].id
                              }
                            })

                            window.setTimeout(() => {
                              setHandlingUnitsItems([]);
                              refHandlingUnits.current.focus();
                            }, 0);
                          }
                        }
                      }}
                      onInput={(e) => {
                        setHandlingUnitsInput(e.target.value)
                      }}
                      onBlur={(e) => {
                        axios.post(props.serverUrl + '/getHandlingUnits').then(res => {
                          if (res.data.result === 'OK') {
                            const exist = res.data.handling_units.find(item => item.name.toLowerCase() === e.target.value.toLowerCase());

                            if (!exist) {
                              setSelectedLtlUnit(prev => {
                                return {
                                  ...prev,
                                  handling_unit: null,
                                  handling_unit_id: null
                                }
                              })
                            } else {
                              setSelectedLtlUnit(prev => {
                                return {
                                  ...prev,
                                  handling_unit: exist,
                                  handling_unit_id: exist.id
                                }
                              })
                            }
                          }
                        }).catch(e => {
                          console.log('error getting handling units', e);
                        })
                      }}
                      onChange={(e) => {
                        setSelectedLtlUnit(prev => {
                          return {
                            ...prev,
                            handling_unit: {
                              name: e.target.value
                            },
                            handling_unit_id: null
                          }
                        });
                      }}
                    />
                    <FontAwesomeIcon className="dropdown-button" icon={faCaretDown} onClick={() => {
                      if (handlingUnitsItems.length > 0) {
                        setHandlingUnitsItems([]);
                      } else {
                        axios.post(props.serverUrl + '/getHandlingUnits').then(res => {
                          if (res.data.result === 'OK') {
                            setHandlingUnitsItems(res.data.handling_units.map((item, index) => {
                              item.selected = (selectedLtlUnit?.handling_unit?.name || '').toLowerCase() === item.name.toLowerCase();
                              return item;
                            }))

                            window.setTimeout(() => {
                              refHandlingUnitsPopupItems.current.map((r, i) => {
                                if (r && r.classList.contains('selected')) {
                                  r.scrollIntoView({
                                    behavior: 'auto',
                                    block: 'center',
                                    inline: 'nearest'
                                  })
                                }
                                return true;
                              });
                            }, 0);
                          }
                        }).catch(e => {
                          console.log('error getting handling units', e);
                        });
                      }

                      refHandlingUnits.current.focus();
                    }} />
                  </div>
                  {
                    handlingUnitsTransition((style, item) => item && (
                      <animated.div
                        className="mochi-contextual-container"
                        id="mochi-contextual-container-handling-units"
                        style={{
                          ...style,
                          left: '0',
                          display: 'block'
                        }}
                        ref={refHandlingUnitsDropDown}
                      >
                        <div className="mochi-contextual-popup vertical below right"
                          style={{ height: 150 }}>
                          <div className="mochi-contextual-popup-content">
                            <div className="mochi-contextual-popup-wrapper">
                              {
                                handlingUnitsItems.map((item, index) => {
                                  const mochiItemClasses = classnames({
                                    'mochi-item': true,
                                    'selected': item.selected
                                  });

                                  const searchValue = (selectedLtlUnit?.handling_unit?.name || '') === '' && (selectedLtlUnit?.handling_unit?.name || '') !== ''
                                    ? selectedLtlUnit?.handling_unit?.name : undefined;

                                  return (
                                    <div
                                      key={index}
                                      className={mochiItemClasses}
                                      id={item.id}
                                      onClick={() => {
                                        setSelectedLtlUnit(prev => {
                                          return {
                                            ...prev,
                                            handling_unit: item,
                                            handling_unit_id: item.id
                                          }
                                        })

                                        window.setTimeout(() => {
                                          setHandlingUnitsItems([]);
                                          refHandlingUnits.current.focus();
                                        }, 0);
                                      }}
                                      ref={ref => refHandlingUnitsPopupItems.current.push(ref)}
                                    >
                                      {
                                        searchValue === undefined
                                          ? item.name
                                          : <Highlighter
                                            highlightClassName="mochi-item-highlight-text"
                                            searchWords={[searchValue]}
                                            autoEscape={true}
                                            textToHighlight={item.name}
                                          />
                                      }
                                      {
                                        item.selected &&
                                        <FontAwesomeIcon className="dropdown-selected"
                                          icon={faCaretRight} />
                                      }
                                    </div>
                                  )
                                })
                              }
                            </div>
                          </div>
                        </div>
                      </animated.div>
                    ))
                  }
                </div>

                <div className="select-box-container" style={{ width: '9rem', maxWidth: '9rem' }}>
                  <div className="select-box-wrapper">
                    <div style={{
                      fontSize: '0.7rem',
                      color: 'rgba(0,0,0,0.7)',
                      whiteSpace: 'nowrap'
                    }}>Weight</div>
                    <MaskedInput
                      tabIndex={4 + props.tabTimes}
                      ref={refWeight}
                      maxLength={10}
                      mask={numberMask}
                      style={{ textAlign: 'right', fontWeight: 'bold' }}
                      type="text"
                      guide={false}
                      value={selectedLtlUnit?.weight || ''}
                      onKeyDown={(e) => {
                        let key = e.keyCode || e.which;

                        if (key === 75) { // K
                          e.preventDefault();
                          setSelectedLtlUnit(prev => {
                            return {
                              ...prev,
                              weight_unit: 'kg'
                            }
                          })
                        } else if (key === 76) { // L
                          e.preventDefault();
                          setSelectedLtlUnit(prev => {
                            return {
                              ...prev,
                              weight_unit: 'lb'
                            }
                          })
                        } else if (key === 38) { // Arrow Up
                          e.preventDefault();
                          if (showWeightItems) {
                            let selectedIndex = weightItems.findIndex(item => item.selected);

                            if (selectedIndex === -1) {
                              setWeightItems(weightItems.map((item, index) => {
                                item.selected = index === 0;
                                return item;
                              }))
                            } else {
                              setWeightItems(weightItems.map((item, index) => {
                                if (selectedIndex === 0) {
                                  item.selected = index === (weightItems.length - 1);
                                } else {
                                  item.selected = index === (selectedIndex - 1);
                                }
                                return item;
                              }))
                            }
                          } else {
                            setWeightItems(weightItems.map((item, index) => {
                              item.selected = (selectedLtlUnit?.weight_unit || '') === item.value
                              return item;
                            }))

                            setShowWeightItems(true)
                          }

                          refWeightPopupItems.current.map((r, i) => {
                            if (r && r.classList.contains('selected')) {
                              r.scrollIntoView({
                                behavior: 'auto',
                                block: 'center',
                                inline: 'nearest'
                              })
                            }
                            return true;
                          });
                        } else if (key === 40) { // Arrow Down
                          e.preventDefault();
                          if (showWeightItems) {
                            let selectedIndex = weightItems.findIndex(item => item.selected);

                            if (selectedIndex === -1) {
                              setWeightItems(weightItems.map((item, index) => {
                                item.selected = index === 0;
                                return item;
                              }))
                            } else {
                              setWeightItems(weightItems.map((item, index) => {
                                if (selectedIndex === (weightItems.length - 1)) {
                                  item.selected = index === 0;
                                } else {
                                  item.selected = index === (selectedIndex + 1);
                                }
                                return item;
                              }))
                            }
                          } else {
                            setWeightItems(weightItems.map((item, index) => {
                              item.selected = (selectedLtlUnit?.weight_unit || '') === item.value
                              return item;
                            }))

                            setShowWeightItems(true)
                          }

                          refWeightPopupItems.current.map((r, i) => {
                            if (r && r.classList.contains('selected')) {
                              r.scrollIntoView({
                                behavior: 'auto',
                                block: 'center',
                                inline: 'nearest'
                              })
                            }
                            return true;
                          });
                        } else if (key === 27) { // Escape                          
                          if (showWeightItems) {
                            e.stopPropagation();
                            setShowWeightItems(false);
                          } else {
                            handleClosing(e);
                          }
                        } else if (key === 13) { // Enter
                          if (showWeightItems && weightItems.findIndex(item => item.selected) > -1) {
                            setSelectedLtlUnit(prev => {
                              return {
                                ...prev,
                                weight_unit: weightItems[weightItems.findIndex(item => item.selected)].value
                              }
                            })

                            window.setTimeout(() => {
                              setShowWeightItems(false);
                              refWeight.current.inputElement.focus();
                            }, 0);
                          }
                        } else if (key === 9) { // Tab
                          if (showWeightItems) {
                            e.preventDefault();
                            setSelectedLtlUnit(prev => {
                              return {
                                ...prev,
                                weight_unit: weightItems[weightItems.findIndex(item => item.selected)].value
                              }
                            })

                            window.setTimeout(() => {
                              setShowWeightItems(false);
                              refWeight.current.inputElement.focus();
                            }, 0);
                          }
                        }
                      }}
                      onKeyPress={(e) => {
                        if (e.key === '.') {
                          if (e.target.value.includes('.')) {
                            e.preventDefault();
                          }
                        }
                      }}
                      onBlur={(e) => {
                        if (e.target.value.includes('.')) {
                          setSelectedLtlUnit(prev => {
                            return {
                              ...prev,
                              weight: new Intl.NumberFormat('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                              }).format(Number(e.target.value.toString().replace(',', '')))
                            }
                          })
                        }
                      }}
                      onChange={(e) => {
                        setSelectedLtlUnit(prev => {
                          return {
                            ...prev,
                            weight: e.target.value
                          }
                        });
                      }}
                    />
                    <div style={{
                      // position: 'absolute',
                      // top: '50%',
                      // right: '18px',
                      // transform: 'translateY(-50%)',
                      fontSize: '0.75rem',
                      fontFamily: 'Mochi Med Oblique',
                      fontWeight: 'normal',
                      marginLeft: 5,
                      marginRight: 16
                    }}>{selectedLtlUnit?.weight_unit || ''}</div>
                    <FontAwesomeIcon className="dropdown-button" icon={faCaretDown} onClick={() => {
                      if (showWeightItems) {
                        setShowWeightItems(false);
                      } else {
                        setWeightItems(weightItems.map((item, index) => {
                          item.selected = (selectedLtlUnit?.weight_unit || '') === item.value;
                          return item;
                        }))

                        window.setTimeout(() => {
                          setShowWeightItems(true);

                          refWeightPopupItems.current.map((r, i) => {
                            if (r && r.classList.contains('selected')) {
                              r.scrollIntoView({
                                behavior: 'auto',
                                block: 'center',
                                inline: 'nearest'
                              })
                            }
                            return true;
                          });
                        }, 0);
                      }

                      refWeight.current.inputElement.focus();
                    }} />
                  </div>
                  {
                    weightTransition((style, item) => item && (
                      <animated.div
                        className="mochi-contextual-container"
                        id="mochi-contextual-container-pieces"
                        style={{
                          ...style,
                          left: '0',
                          display: 'block'
                        }}
                        ref={refWeightDropDown} weightTransition
                      >
                        <div className="mochi-contextual-popup vertical below right"
                          style={{ height: 150 }}>
                          <div className="mochi-contextual-popup-content">
                            <div className="mochi-contextual-popup-wrapper">
                              {
                                weightItems.map((item, index) => {
                                  const mochiItemClasses = classnames({
                                    'mochi-item': true,
                                    'selected': item.selected
                                  });

                                  const searchValue = (selectedLtlUnit?.weight || '') === '' && (selectedLtlUnit?.weight || '') !== ''
                                    ? selectedLtlUnit?.weight : undefined;

                                  return (
                                    <div
                                      key={index}
                                      className={mochiItemClasses}
                                      id={item.id}
                                      onClick={() => {
                                        setSelectedLtlUnit(prev => {
                                          return {
                                            ...prev,
                                            weight_unit: item.value
                                          }
                                        })

                                        window.setTimeout(() => {
                                          setShowWeightItems(false);
                                          refWeight.current.inputElement.focus();
                                        }, 0);
                                      }}
                                      ref={ref => refWeightPopupItems.current.push(ref)}
                                    >
                                      {
                                        searchValue === undefined
                                          ? <div>{item.name} <span style={{ fontWeight: 'bold' }}>({item.value})</span></div>
                                          : <Highlighter
                                            highlightClassName="mochi-item-highlight-text"
                                            searchWords={[searchValue]}
                                            autoEscape={true}
                                            textToHighlight={item.name}
                                          />
                                      }
                                      {
                                        item.selected &&
                                        <FontAwesomeIcon className="dropdown-selected"
                                          icon={faCaretRight} />
                                      }
                                    </div>
                                  )
                                })
                              }
                            </div>
                          </div>
                        </div>
                      </animated.div>
                    ))
                  }
                </div>

                <div className="input-box-container" style={{ width: '9rem', maxWidth: '9rem' }}>
                  <div style={{
                    fontSize: '0.7rem',
                    color: 'rgba(0,0,0,0.7)',
                    whiteSpace: 'nowrap'
                  }}>Length</div>
                  <MaskedInput
                    tabIndex={5 + props.tabTimes}
                    type="text"
                    style={{ textAlign: 'right', fontWeight: 'bold' }}
                    maxLength={10}
                    mask={numberMask}
                    guide={false}
                    onBlur={(e) => {
                      if (e.target.value.includes('.')) {
                        setSelectedLtlUnit(prev => {
                          return {
                            ...prev,
                            length: new Intl.NumberFormat('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            }).format(Number(e.target.value.toString().replace(',', '')))
                          }
                        })
                      }
                    }}
                    onInput={(e) => {
                      setSelectedLtlUnit(prev => {
                        return {
                          ...prev,
                          length: e.target.value
                        }
                      });
                    }}
                    onChange={(e) => {
                      setSelectedLtlUnit(prev => {
                        return {
                          ...prev,
                          length: e.target.value
                        }
                      });
                    }}
                    value={selectedLtlUnit?.length || ''}
                  />
                </div>

                <div className="input-box-container" style={{ width: '9rem', maxWidth: '9rem' }}>
                  <div style={{
                    fontSize: '0.7rem',
                    color: 'rgba(0,0,0,0.7)',
                    whiteSpace: 'nowrap'
                  }}>Width</div>
                  <MaskedInput
                    tabIndex={6 + props.tabTimes}
                    type="text"
                    style={{ textAlign: 'right', fontWeight: 'bold' }}
                    maxLength={10}
                    mask={numberMask}
                    guide={false}
                    onBlur={(e) => {
                      if (e.target.value.includes('.')) {
                        setSelectedLtlUnit(prev => {
                          return {
                            ...prev,
                            width: new Intl.NumberFormat('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            }).format(Number(e.target.value.toString().replace(',', '')))
                          }
                        })
                      }
                    }}
                    onInput={(e) => {
                      setSelectedLtlUnit(prev => {
                        return {
                          ...prev,
                          width: e.target.value
                        }
                      });
                    }}
                    onChange={(e) => {
                      setSelectedLtlUnit(prev => {
                        return {
                          ...prev,
                          width: e.target.value
                        }
                      });
                    }}
                    value={selectedLtlUnit?.width || ''}
                  />
                </div>

                <div className="input-box-container" style={{ width: '9rem', maxWidth: '9rem' }}>
                  <div style={{
                    fontSize: '0.7rem',
                    color: 'rgba(0,0,0,0.7)',
                    whiteSpace: 'nowrap'
                  }}>Height</div>
                  <MaskedInput
                    tabIndex={7 + props.tabTimes}
                    type="text"
                    style={{ textAlign: 'right', fontWeight: 'bold' }}
                    maxLength={10}
                    mask={numberMask}
                    guide={false}
                    onBlur={(e) => {
                      if (e.target.value.includes('.')) {
                        setSelectedLtlUnit(prev => {
                          return {
                            ...prev,
                            height: new Intl.NumberFormat('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            }).format(Number(e.target.value.toString().replace(',', '')))
                          }
                        })
                      }
                    }}
                    onInput={(e) => {
                      setSelectedLtlUnit(prev => {
                        return {
                          ...prev,
                          height: e.target.value
                        }
                      });
                    }}
                    onChange={(e) => {
                      setSelectedLtlUnit(prev => {
                        return {
                          ...prev,
                          height: e.target.value
                        }
                      });
                    }}
                    value={selectedLtlUnit?.height || ''}
                  />
                </div>

                <div className="select-box-container" style={{ width: '9rem', maxWidth: '9rem' }}>
                  <div className="select-box-wrapper">
                    <div style={{
                      fontSize: '0.7rem',
                      color: 'rgba(0,0,0,0.7)',
                      whiteSpace: 'nowrap'
                    }}>Dimensions</div>
                    <input
                      tabIndex={8 + props.tabTimes}
                      ref={refDimensionUnits}
                      type="text"
                      style={{
                        textTransform: 'lowercase',
                        paddingRight: 16,
                        textAlign: 'right'
                      }}
                      value={selectedLtlUnit?.dimension_unit || ''}
                      onKeyDown={(e) => {
                        let key = e.keyCode || e.which;

                        if (key === 67) { // C
                          e.preventDefault();
                          setSelectedLtlUnit(prev => {
                            return {
                              ...prev,
                              dimension_unit: 'cm'
                            }
                          })
                        } else if (key === 70) { // F
                          e.preventDefault();
                          setSelectedLtlUnit(prev => {
                            return {
                              ...prev,
                              dimension_unit: 'ft'
                            }
                          })
                        } else if (key === 73) { // I
                          e.preventDefault();
                          setSelectedLtlUnit(prev => {
                            return {
                              ...prev,
                              dimension_unit: 'in'
                            }
                          })
                        } else if (key === 77) { // M
                          e.preventDefault();
                          setSelectedLtlUnit(prev => {
                            return {
                              ...prev,
                              dimension_unit: 'm'
                            }
                          })
                        } else if (key === 38) { // Arrow Up
                          e.preventDefault();
                          if (showDimensionUnitsItems) {
                            let selectedIndex = dimensionUnitsItems.findIndex(item => item.selected);

                            if (selectedIndex === -1) {
                              setDimensionUnitsItems(dimensionUnitsItems.map((item, index) => {
                                item.selected = index === 0;
                                return item;
                              }))
                            } else {
                              setDimensionUnitsItems(dimensionUnitsItems.map((item, index) => {
                                if (selectedIndex === 0) {
                                  item.selected = index === (dimensionUnitsItems.length - 1);
                                } else {
                                  item.selected = index === (selectedIndex - 1);
                                }
                                return item;
                              }))
                            }
                          } else {
                            setDimensionUnitsItems(dimensionUnitsItems.map((item, index) => {
                              item.selected = (selectedLtlUnit?.dimension_unit || '').toLowerCase() === item.value.toLowerCase();
                              return item;
                            }))

                            setShowDimensionUnitsItems(true)
                          }

                          refDimensionUnitsPopupItems.current.map((r, i) => {
                            if (r && r.classList.contains('selected')) {
                              r.scrollIntoView({
                                behavior: 'auto',
                                block: 'center',
                                inline: 'nearest'
                              })
                            }
                            return true;
                          });
                        } else if (key === 40) { // Arrow Down
                          e.preventDefault();
                          if (showDimensionUnitsItems) {
                            let selectedIndex = dimensionUnitsItems.findIndex(item => item.selected);

                            if (selectedIndex === -1) {
                              setDimensionUnitsItems(dimensionUnitsItems.map((item, index) => {
                                item.selected = index === 0;
                                return item;
                              }))
                            } else {
                              setDimensionUnitsItems(dimensionUnitsItems.map((item, index) => {
                                if (selectedIndex === (dimensionUnitsItems.length - 1)) {
                                  item.selected = index === 0;
                                } else {
                                  item.selected = index === (selectedIndex + 1);
                                }
                                return item;
                              }))
                            }
                          } else {
                            setDimensionUnitsItems(dimensionUnitsItems.map((item, index) => {
                              item.selected = (selectedLtlUnit?.dimension_unit || '').toLowerCase() === item.value.toLowerCase();
                              return item;
                            }))

                            setShowDimensionUnitsItems(true)
                          }

                          refDimensionUnitsPopupItems.current.map((r, i) => {
                            if (r && r.classList.contains('selected')) {
                              r.scrollIntoView({
                                behavior: 'auto',
                                block: 'center',
                                inline: 'nearest'
                              })
                            }
                            return true;
                          });
                        } else if (key === 27) { // Escape
                          if (showDimensionUnitsItems) {
                            e.stopPropagation();
                            setShowDimensionUnitsItems(false);
                          } else {
                            handleClosing(e);
                          }
                        } else if (key === 13) { // Enter
                          if (showDimensionUnitsItems && dimensionUnitsItems.findIndex(item => item.selected) > -1) {
                            setSelectedLtlUnit(prev => {
                              return {
                                ...prev,
                                dimension_unit: dimensionUnitsItems[dimensionUnitsItems.findIndex(item => item.selected)].value
                              }
                            })

                            window.setTimeout(() => {
                              setShowDimensionUnitsItems(false);
                              refDimensionUnits.current.focus();
                            }, 0);
                          }
                        } else if (key === 9) { // Tab
                          if (showDimensionUnitsItems) {
                            e.preventDefault();
                            setSelectedLtlUnit(prev => {
                              return {
                                ...prev,
                                dimension_unit: dimensionUnitsItems[dimensionUnitsItems.findIndex(item => item.selected)].value
                              }
                            })

                            window.setTimeout(() => {
                              setShowDimensionUnitsItems(false);
                              refDimensionUnits.current.focus();
                            }, 0);
                          }
                        } else {
                          e.preventDefault();
                        }
                      }}
                      onBlur={(e) => {
                        const exist = dimensionUnitsItems.find(item => item.value.toLowerCase() === e.target.value.toLowerCase());

                        if (!exist) {
                          setSelectedLtlUnit(prev => {
                            return {
                              ...prev,
                              dimension_unit: ''
                            }
                          })
                        }
                      }}
                      onChange={(e) => {
                        setSelectedLtlUnit(prev => {
                          return {
                            ...prev,
                            dimension_unit: e.target.value
                          }
                        });
                      }}
                    />
                    <FontAwesomeIcon className="dropdown-button" icon={faCaretDown} onClick={() => {
                      if (showDimensionUnitsItems) {
                        setShowDimensionUnitsItems(false);
                      } else {
                        setDimensionUnitsItems(dimensionUnitsItems.map((item, index) => {
                          item.selected = (selectedLtlUnit?.dimension_unit || '').toLowerCase() === item.value.toLowerCase();
                          return item;
                        }))

                        window.setTimeout(() => {
                          setShowDimensionUnitsItems(true);

                          refDimensionUnitsPopupItems.current.map((r, i) => {
                            if (r && r.classList.contains('selected')) {
                              r.scrollIntoView({
                                behavior: 'auto',
                                block: 'center',
                                inline: 'nearest'
                              })
                            }
                            return true;
                          });
                        }, 0);
                      }

                      refDimensionUnits.current.focus();
                    }} />
                  </div>
                  {
                    dimensionUnitsTransition((style, item) => item && (
                      <animated.div
                        className="mochi-contextual-container"
                        id="mochi-contextual-container-dimension-units"
                        style={{
                          ...style,
                          left: '0',
                          display: 'block'
                        }}
                        ref={refDimensionUnitsDropDown}
                      >
                        <div className="mochi-contextual-popup vertical below right"
                          style={{ height: 150 }}>
                          <div className="mochi-contextual-popup-content">
                            <div className="mochi-contextual-popup-wrapper">
                              {
                                dimensionUnitsItems.map((item, index) => {
                                  const mochiItemClasses = classnames({
                                    'mochi-item': true,
                                    'selected': item.selected
                                  });

                                  const searchValue = (selectedLtlUnit?.dimension_unit || '') === '' && (selectedLtlUnit?.dimension_unit || '') !== ''
                                    ? selectedLtlUnit?.dimension_unit : undefined;

                                  return (
                                    <div
                                      key={index}
                                      className={mochiItemClasses}
                                      id={item.id}
                                      onClick={() => {
                                        setSelectedLtlUnit(prev => {
                                          return {
                                            ...prev,
                                            dimension_unit: item.value
                                          }
                                        })

                                        window.setTimeout(() => {
                                          setShowDimensionUnitsItems(false);
                                          refDimensionUnits.current.focus();
                                        }, 0);
                                      }}
                                      ref={ref => refDimensionUnitsPopupItems.current.push(ref)}
                                    >
                                      {
                                        searchValue === undefined
                                          ? <div>{item.name} <span style={{ fontWeight: 'bold' }}>({item.value})</span></div>
                                          : <Highlighter
                                            highlightClassName="mochi-item-highlight-text"
                                            searchWords={[searchValue]}
                                            autoEscape={true}
                                            textToHighlight={item.name}
                                          />
                                      }
                                      {
                                        item.selected &&
                                        <FontAwesomeIcon className="dropdown-selected"
                                          icon={faCaretRight} />
                                      }
                                    </div>
                                  )
                                })
                              }
                            </div>
                          </div>
                        </div>
                      </animated.div>
                    ))
                  }
                </div>

                <div className="select-box-container" style={{ width: '9rem', maxWidth: '9rem' }}>
                  <div className="select-box-wrapper">
                    <div style={{
                      fontSize: '0.7rem',
                      color: 'rgba(0,0,0,0.7)',
                      whiteSpace: 'nowrap'
                    }}>Class</div>
                    <MaskedInput
                      tabIndex={9 + props.tabTimes}
                      ref={refUnitClass}
                      type="text"
                      style={{
                        textTransform: 'lowercase',
                        paddingRight: 16,
                        textAlign: 'right',
                        fontWeight: 'bold'
                      }}
                      mask={numberMask}
                      guide={false}
                      maxLength={6}
                      value={selectedLtlUnit?.unit_class?.name || ''}
                      onKeyDown={(e) => {
                        let key = e.keyCode || e.which;

                        if (key === 38) { // Arrow Up
                          e.preventDefault();
                          if (unitClassItems.length > 0) {
                            let selectedIndex = unitClassItems.findIndex(item => item.selected);

                            if (selectedIndex === -1) {
                              setUnitClassItems(unitClassItems.map((item, index) => {
                                item.selected = index === 0;
                                return item;
                              }))
                            } else {
                              setUnitClassItems(unitClassItems.map((item, index) => {
                                if (selectedIndex === 0) {
                                  item.selected = index === (unitClassItems.length - 1);
                                } else {
                                  item.selected = index === (selectedIndex - 1);
                                }
                                return item;
                              }))
                            }

                            refUnitClassPopupItems.current.map((r, i) => {
                              if (r && r.classList.contains('selected')) {
                                r.scrollIntoView({
                                  behavior: 'auto',
                                  block: 'center',
                                  inline: 'nearest'
                                })
                              }
                              return true;
                            });
                          } else {
                            axios.post(props.serverUrl + '/getUnitClasses').then(res => {
                              if (res.data.result === 'OK') {
                                setUnitClassItems(res.data.unit_classes.map((item, index) => {
                                  item.selected = (selectedLtlUnit?.unit_class?.name || '').toLowerCase() === item.value.toLowerCase();
                                  return item;
                                }))

                                refUnitClassPopupItems.current.map((r, i) => {
                                  if (r && r.classList.contains('selected')) {
                                    r.scrollIntoView({
                                      behavior: 'auto',
                                      block: 'center',
                                      inline: 'nearest'
                                    })
                                  }
                                  return true;
                                });
                              }
                            }).catch(e => {
                              console.log('error getting unit classes', e);
                            })
                          }
                        } else if (key === 40) { // Arrow Down
                          e.preventDefault();
                          if (unitClassItems.length > 0) {
                            let selectedIndex = unitClassItems.findIndex(item => item.selected);

                            if (selectedIndex === -1) {
                              setUnitClassItems(unitClassItems.map((item, index) => {
                                item.selected = index === 0;
                                return item;
                              }))
                            } else {
                              setUnitClassItems(unitClassItems.map((item, index) => {
                                if (selectedIndex === (unitClassItems.length - 1)) {
                                  item.selected = index === 0;
                                } else {
                                  item.selected = index === (selectedIndex + 1);
                                }
                                return item;
                              }))
                            }

                            refUnitClassPopupItems.current.map((r, i) => {
                              if (r && r.classList.contains('selected')) {
                                r.scrollIntoView({
                                  behavior: 'auto',
                                  block: 'center',
                                  inline: 'nearest'
                                })
                              }
                              return true;
                            });
                          } else {
                            axios.post(props.serverUrl + '/getUnitClasses').then(res => {
                              if (res.data.result === 'OK') {
                                setUnitClassItems(res.data.unit_classes.map((item, index) => {
                                  item.selected = (selectedLtlUnit?.unit_class?.name || '').toLowerCase() === item.value.toLowerCase();
                                  return item;
                                }))

                                refUnitClassPopupItems.current.map((r, i) => {
                                  if (r && r.classList.contains('selected')) {
                                    r.scrollIntoView({
                                      behavior: 'auto',
                                      block: 'center',
                                      inline: 'nearest'
                                    })
                                  }
                                  return true;
                                });
                              }
                            }).catch(e => {
                              console.log('error getting unit classes', e);
                            })
                          }
                        } else if (key === 27) { // Escape
                          if (unitClassItems.length > 0) {
                            e.stopPropagation();
                            setUnitClassItems([]);
                          } else {
                            handleClosing(e);
                          }
                        } else if (key === 13) { // Enter
                          if (unitClassItems.length > 0 && unitClassItems.findIndex(item => item.selected) > -1) {
                            setSelectedLtlUnit(prev => {
                              return {
                                ...prev,
                                unit_class: unitClassItems[unitClassItems.findIndex(item => item.selected)],
                                unit_class_id: unitClassItems[unitClassItems.findIndex(item => item.selected)].id
                              }
                            })

                            window.setTimeout(() => {
                              setUnitClassItems([]);
                              refUnitClass.current.inputElement.focus();
                            }, 0);
                          }
                        } else if (key === 9) { // Tab
                          if (unitClassItems.length > 0) {
                            e.preventDefault();
                            setSelectedLtlUnit(prev => {
                              return {
                                ...prev,
                                unit_class: unitClassItems[unitClassItems.findIndex(item => item.selected)],
                                unit_class_id: unitClassItems[unitClassItems.findIndex(item => item.selected)].id
                              }
                            })

                            window.setTimeout(() => {
                              setUnitClassItems([]);
                              refUnitClass.current.inputElement.focus();
                            }, 0);
                          }
                        }
                      }}
                      onInput={(e) => {
                        setUnitClassesInput(e.target.value)
                      }}
                      onBlur={(e) => {
                        axios.post(props.serverUrl + '/getUnitClasses').then(res => {
                          if (res.data.result === 'OK') {
                            const exist = res.data.unit_classes.find(item => item.name.toLowerCase() === e.target.value.toLowerCase());

                            if (!exist) {
                              setSelectedLtlUnit(prev => {
                                return {
                                  ...prev,
                                  unit_class: null,
                                  unit_class_id: null
                                }
                              })
                            } else {
                              setSelectedLtlUnit(prev => {
                                return {
                                  ...prev,
                                  unit_class: exist,
                                  unit_class_id: exist.id
                                }
                              })
                            }
                          }
                        }).catch(e => {
                          console.log('error getting unit classes', e);
                        })
                      }}
                      onChange={(e) => {
                        setSelectedLtlUnit(prev => {
                          return {
                            ...prev,
                            unit_class: {
                              name: e.target.value
                            },
                            unit_class_id: null
                          }
                        });
                      }}
                    />
                    <FontAwesomeIcon className="dropdown-button" icon={faCaretDown} onClick={() => {
                      if (unitClassItems.length > 0) {
                        setUnitClassItems([]);
                      } else {
                        axios.post(props.serverUrl + '/getUnitClasses').then(res => {
                          if (res.data.result === 'OK') {
                            setUnitClassItems(res.data.unit_classes.map((item, index) => {
                              item.selected = (selectedLtlUnit?.unit_class?.name || '').toLowerCase() === item.name.toLowerCase();
                              return item;
                            }))

                            window.setTimeout(() => {
                              refUnitClassPopupItems.current.map((r, i) => {
                                if (r && r.classList.contains('selected')) {
                                  r.scrollIntoView({
                                    behavior: 'auto',
                                    block: 'center',
                                    inline: 'nearest'
                                  })
                                }
                                return true;
                              });
                            }, 0);
                          }
                        }).catch(e => {
                          console.log('error getting unit classes', e);
                        })
                      }

                      refUnitClass.current.inputElement.focus();
                    }} />
                  </div>
                  {
                    unitClassTransition((style, item) => item && (
                      <animated.div
                        className="mochi-contextual-container"
                        id="mochi-contextual-container-dimension-units"
                        style={{
                          ...style,
                          left: '0',
                          display: 'block'
                        }}
                        ref={refUnitClassDropDown}
                      >
                        <div className="mochi-contextual-popup vertical below right"
                          style={{ height: 150 }}>
                          <div className="mochi-contextual-popup-content">
                            <div className="mochi-contextual-popup-wrapper">
                              {
                                unitClassItems.map((item, index) => {
                                  const mochiItemClasses = classnames({
                                    'mochi-item': true,
                                    'selected': item.selected
                                  });

                                  const searchValue = (selectedLtlUnit?.unit_class?.name || '') === '' && (selectedLtlUnit?.unit_class?.name || '') !== ''
                                    ? selectedLtlUnit?.unit_class?.name : undefined;

                                  return (
                                    <div
                                      key={index}
                                      className={mochiItemClasses}
                                      id={item.id}
                                      onClick={() => {
                                        setSelectedLtlUnit(prev => {
                                          return {
                                            ...prev,
                                            unit_class: item,
                                            unit_class_id: item.id
                                          }
                                        })

                                        window.setTimeout(() => {
                                          setUnitClassItems([]);
                                          refUnitClass.current.inputElement.focus();
                                        }, 0);
                                      }}
                                      ref={ref => refUnitClassPopupItems.current.push(ref)}
                                    >
                                      {
                                        searchValue === undefined
                                          ? item.name
                                          : <Highlighter
                                            highlightClassName="mochi-item-highlight-text"
                                            searchWords={[searchValue]}
                                            autoEscape={true}
                                            textToHighlight={item.name}
                                          />
                                      }
                                      {
                                        item.selected &&
                                        <FontAwesomeIcon className="dropdown-selected"
                                          icon={faCaretRight} />
                                      }
                                    </div>
                                  )
                                })
                              }
                            </div>
                          </div>
                        </div>
                      </animated.div>
                    ))
                  }
                </div>

                <div className="input-box-container" style={{ width: '9rem', maxWidth: '9rem' }}>
                  <div style={{
                    fontSize: '0.7rem',
                    color: 'rgba(0,0,0,0.7)',
                    whiteSpace: 'nowrap'
                  }}>NMFC</div>
                  <input
                    tabIndex={10 + props.tabTimes}
                    type="text"
                    style={{ textAlign: 'right', fontWeight: 'bold' }}
                    onInput={(e) => {
                      setSelectedLtlUnit(prev => {
                        return {
                          ...prev,
                          nmfc: e.target.value
                        }
                      });
                    }}
                    onChange={(e) => {
                      setSelectedLtlUnit(prev => {
                        return {
                          ...prev,
                          nmfc: e.target.value
                        }
                      });
                    }}
                    value={selectedLtlUnit?.nmfc || ''}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="input-box-container" style={{ width: 'calc(96rem + 20px)', maxWidth: '100%' }}>
                  <div style={{
                    fontSize: '0.7rem',
                    color: 'rgba(0,0,0,0.7)',
                    whiteSpace: 'nowrap'
                  }}>Description</div>
                  <input
                    tabIndex={11 + props.tabTimes}
                    type="text"
                    style={{ textAlign: 'right', fontWeight: 'bold' }}
                    onKeyDown={(e) => {
                      let key = e.keyCode || e.which;

                      if (key === 9) {
                        if ((selectedLtlUnit?.hazmat || 0) === 0) {
                          e.preventDefault();
                          validateLtlUnitForSaving()
                        }
                      }
                    }}
                    onInput={(e) => {
                      setSelectedLtlUnit(prev => {
                        return {
                          ...prev,
                          description: e.target.value
                        }
                      });
                    }}
                    onChange={(e) => {
                      setSelectedLtlUnit(prev => {
                        return {
                          ...prev,
                          description: e.target.value
                        }
                      });
                    }}
                    value={selectedLtlUnit?.description || ''}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className={classnames({
                  'input-box-container': true,
                  'disabled': (selectedLtlUnit?.hazmat || 0) === 0
                })} style={{ flexGrow: 1 }}>
                  <div style={{
                    fontSize: '0.7rem',
                    color: 'rgba(0,0,0,0.7)',
                    whiteSpace: 'nowrap'
                  }}>HazMat Name</div>
                  <input
                    tabIndex={12 + props.tabTimes}
                    ref={refHazmatName}
                    type="text"
                    style={{ textAlign: 'right', fontWeight: 'bold' }}
                    onInput={(e) => {
                      setSelectedLtlUnit(prev => {
                        return {
                          ...prev,
                          hazmat_name: e.target.value
                        }
                      });
                    }}
                    onChange={(e) => {
                      setSelectedLtlUnit(prev => {
                        return {
                          ...prev,
                          hazmat_name: e.target.value
                        }
                      });
                    }}
                    value={selectedLtlUnit?.hazmat_name || ''}
                  />
                </div>

                <div className={classnames({
                  'select-box-container': true,
                  'disabled': (selectedLtlUnit?.hazmat || 0) === 0
                })} style={{ width: '9rem', minWidth: '9rem', maxWidth: '9rem' }}>
                  <div className="select-box-wrapper">
                    <div style={{
                      fontSize: '0.7rem',
                      color: 'rgba(0,0,0,0.7)',
                      whiteSpace: 'nowrap'
                    }}>HazMat Pkg</div>
                    <input
                      tabIndex={13 + props.tabTimes}
                      ref={refHazmatPackaging}
                      type="text"
                      style={{
                        textTransform: 'capitalize',
                        textAlign: 'right',
                        paddingRight: 16,
                      }}
                      value={selectedLtlUnit?.hazmat_packaging?.name || ''}
                      onKeyDown={(e) => {
                        let key = e.keyCode || e.which;

                        if (key === 38) { // Arrow Up
                          e.preventDefault();
                          if (hazmatPackagingItems.length > 0) {
                            let selectedIndex = hazmatPackagingItems.findIndex(item => item.selected);

                            if (selectedIndex === -1) {
                              setHazmatPackagingItems(hazmatPackagingItems.map((item, index) => {
                                item.selected = index === 0;
                                return item;
                              }))
                            } else {
                              setHazmatPackagingItems(hazmatPackagingItems.map((item, index) => {
                                if (selectedIndex === 0) {
                                  item.selected = index === (hazmatPackagingItems.length - 1);
                                } else {
                                  item.selected = index === (selectedIndex - 1);
                                }
                                return item;
                              }))
                            }

                            refHazmatPackagingPopupItems.current.map((r, i) => {
                              if (r && r.classList.contains('selected')) {
                                r.scrollIntoView({
                                  behavior: 'auto',
                                  block: 'center',
                                  inline: 'nearest'
                                })
                              }
                              return true;
                            });
                          } else {
                            axios.post(props.serverUrl + '/getHazmatPackagings').then(res => {
                              if (res.data.result === 'OK') {
                                setHazmatPackagingItems(res.data.hazmat_packagings.map((item, index) => {
                                  item.selected = (selectedLtlUnit?.hazmat_packaging?.name || '').toLowerCase() === item.name.toLowerCase();
                                  return item;
                                }))

                                refHazmatPackagingPopupItems.current.map((r, i) => {
                                  if (r && r.classList.contains('selected')) {
                                    r.scrollIntoView({
                                      behavior: 'auto',
                                      block: 'center',
                                      inline: 'nearest'
                                    })
                                  }
                                  return true;
                                });
                              }
                            }).catch(e => {
                              console.log('error getting hazmat packagings', e);
                            })
                          }
                        } else if (key === 40) { // Arrow Down
                          e.preventDefault();
                          if (hazmatPackagingItems.length > 0) {
                            let selectedIndex = hazmatPackagingItems.findIndex(item => item.selected);

                            if (selectedIndex === -1) {
                              setHazmatPackagingItems(hazmatPackagingItems.map((item, index) => {
                                item.selected = index === 0;
                                return item;
                              }))
                            } else {
                              setHazmatPackagingItems(hazmatPackagingItems.map((item, index) => {
                                if (selectedIndex === (hazmatPackagingItems.length - 1)) {
                                  item.selected = index === 0;
                                } else {
                                  item.selected = index === (selectedIndex + 1);
                                }
                                return item;
                              }))
                            }

                            refHazmatPackagingPopupItems.current.map((r, i) => {
                              if (r && r.classList.contains('selected')) {
                                r.scrollIntoView({
                                  behavior: 'auto',
                                  block: 'center',
                                  inline: 'nearest'
                                })
                              }
                              return true;
                            });
                          } else {
                            axios.post(props.serverUrl + '/getHazmatPackagings').then(res => {
                              if (res.data.result === 'OK') {
                                setHazmatPackagingItems(res.data.hazmat_packagings.map((item, index) => {
                                  item.selected = (selectedLtlUnit?.hazmat_packaging?.name || '').toLowerCase() === item.name.toLowerCase();
                                  return item;
                                }))

                                refHazmatPackagingPopupItems.current.map((r, i) => {
                                  if (r && r.classList.contains('selected')) {
                                    r.scrollIntoView({
                                      behavior: 'auto',
                                      block: 'center',
                                      inline: 'nearest'
                                    })
                                  }
                                  return true;
                                });
                              }
                            }).catch(e => {
                              console.log('error getting hazmat packagings', e);
                            })
                          }
                        } else if (key === 27) { // Escape
                          if (hazmatPackagingItems.length > 0) {
                            e.stopPropagation();
                            setHazmatPackagingItems([]);
                          } else {
                            handleClosing(e);
                          }

                        } else if (key === 13) { // Enter
                          if (hazmatPackagingItems.length > 0 && hazmatPackagingItems.findIndex(item => item.selected) > -1) {
                            setSelectedLtlUnit(prev => {
                              return {
                                ...prev,
                                hazmat_packaging: hazmatPackagingItems[hazmatPackagingItems.findIndex(item => item.selected)],
                                hazmat_packaging_id: hazmatPackagingItems[hazmatPackagingItems.findIndex(item => item.selected)].id
                              }
                            })

                            window.setTimeout(() => {
                              setHazmatPackagingItems([]);
                              refHazmatPackaging.current.focus();
                            }, 0);
                          }
                        } else if (key === 9) { // Tab
                          if (hazmatPackagingItems.length > 0) {
                            e.preventDefault();
                            setSelectedLtlUnit(prev => {
                              return {
                                ...prev,
                                hazmat_packaging: hazmatPackagingItems[hazmatPackagingItems.findIndex(item => item.selected)],
                                hazmat_packaging_id: hazmatPackagingItems[hazmatPackagingItems.findIndex(item => item.selected)].id
                              }
                            })

                            window.setTimeout(() => {
                              setHazmatPackagingItems([]);
                              refHazmatPackaging.current.focus();
                            }, 0);
                          }
                        }
                      }}
                      onInput={(e) => {
                        setHazmatPackagingInput(e.target.value)
                      }}
                      onBlur={(e) => {
                        axios.post(props.serverUrl + '/getHazmatPackagings').then(res => {
                          if (res.data.result === 'OK') {
                            const exist = res.data.hazmat_packagings.find(item => item.name.toLowerCase() === e.target.value.toLowerCase());

                            if (!exist) {
                              setSelectedLtlUnit(prev => {
                                return {
                                  ...prev,
                                  hazmat_packaging: null,
                                  hazmat_packaging_id: null
                                }
                              })
                            } else {
                              setSelectedLtlUnit(prev => {
                                return {
                                  ...prev,
                                  hazmat_packaging: exist,
                                  hazmat_packaging_id: exist.id
                                }
                              })
                            }
                          }
                        }).catch(e => {
                          console.log('error getting hazmat packagings', e);
                        })
                      }}
                      onChange={(e) => {
                        setSelectedLtlUnit(prev => {
                          return {
                            ...prev,
                            hazmat_packaging: {
                              name: e.target.value
                            },
                            hazmat_packaging_id: null
                          }
                        });
                      }}
                    />
                    <FontAwesomeIcon className="dropdown-button" icon={faCaretDown} onClick={() => {
                      if (hazmatPackagingItems.length > 0) {
                        setHazmatPackagingItems([]);
                      } else {
                        axios.post(props.serverUrl + '/getHazmatPackagings').then(res => {
                          if (res.data.result === 'OK') {
                            setHazmatPackagingItems(res.data.hazmat_packagings.map((item, index) => {
                              item.selected = (selectedLtlUnit?.hazmat_packaging?.name || '').toLowerCase() === item.name.toLowerCase();
                              return item;
                            }))

                            window.setTimeout(() => {
                              refHazmatPackagingPopupItems.current.map((r, i) => {
                                if (r && r.classList.contains('selected')) {
                                  r.scrollIntoView({
                                    behavior: 'auto',
                                    block: 'center',
                                    inline: 'nearest'
                                  })
                                }
                                return true;
                              });
                            }, 0);
                          }
                        }).catch(e => {
                          console.log('error getting hazmat packagings', e);
                        })
                      }

                      refHazmatPackaging.current.focus();
                    }} />
                  </div>
                  {
                    hazmatPackagingTransition((style, item) => item && (
                      <animated.div
                        className="mochi-contextual-container"
                        id="mochi-contextual-container-handling-units"
                        style={{
                          ...style,
                          left: '0',
                          display: 'block'
                        }}
                        ref={refHazmatPackagingDropDown}
                      >
                        <div className="mochi-contextual-popup vertical below right"
                          style={{ height: 150 }}>
                          <div className="mochi-contextual-popup-content">
                            <div className="mochi-contextual-popup-wrapper">
                              {
                                hazmatPackagingItems.map((item, index) => {
                                  const mochiItemClasses = classnames({
                                    'mochi-item': true,
                                    'selected': item.selected
                                  });

                                  const searchValue = (selectedLtlUnit?.hazmat_packaging?.name || '') === '' && (selectedLtlUnit?.hazmat_packaging?.name || '') !== ''
                                    ? selectedLtlUnit?.hazmat_packaging?.name : undefined;

                                  return (
                                    <div
                                      key={index}
                                      className={mochiItemClasses}
                                      id={item.id}
                                      onClick={() => {
                                        setSelectedLtlUnit(prev => {
                                          return {
                                            ...prev,
                                            hazmat_packaging: item,
                                            hazmat_packaging_id: item.id
                                          }
                                        })

                                        window.setTimeout(() => {
                                          setHazmatPackagingItems([]);
                                          refHazmatPackaging.current.focus();
                                        }, 0);
                                      }}
                                      ref={ref => refHazmatPackagingPopupItems.current.push(ref)}
                                    >
                                      {
                                        searchValue === undefined
                                          ? item.name
                                          : <Highlighter
                                            highlightClassName="mochi-item-highlight-text"
                                            searchWords={[searchValue]}
                                            autoEscape={true}
                                            textToHighlight={item.name}
                                          />
                                      }
                                      {
                                        item.selected &&
                                        <FontAwesomeIcon className="dropdown-selected"
                                          icon={faCaretRight} />
                                      }
                                    </div>
                                  )
                                })
                              }
                            </div>
                          </div>
                        </div>
                      </animated.div>
                    ))
                  }
                </div>

                <div className={classnames({
                  'input-box-container': true,
                  'disabled': (selectedLtlUnit?.hazmat || 0) === 0
                })} style={{ width: '9rem', minWidth: '9rem', maxWidth: '9rem' }}>
                  <div style={{
                    fontSize: '0.7rem',
                    color: 'rgba(0,0,0,0.7)',
                    whiteSpace: 'nowrap'
                  }}>HazMat UN/NA</div>
                  <input
                    tabIndex={14 + props.tabTimes}
                    type="text"
                    style={{ textAlign: 'right', fontWeight: 'bold' }}
                    onInput={(e) => {
                      setSelectedLtlUnit(prev => {
                        return {
                          ...prev,
                          hazmat_un_na: e.target.value
                        }
                      });
                    }}
                    onChange={(e) => {
                      setSelectedLtlUnit(prev => {
                        return {
                          ...prev,
                          hazmat_un_na: e.target.value
                        }
                      });
                    }}
                    value={selectedLtlUnit?.hazmat_un_na || ''}
                  />
                </div>

                <div className={classnames({
                  'select-box-container': true,
                  'disabled': (selectedLtlUnit?.hazmat || 0) === 0
                })} style={{ width: '9rem', minWidth: '9rem', maxWidth: '9rem' }}>
                  <div className="select-box-wrapper">
                    <div style={{
                      fontSize: '0.7rem',
                      color: 'rgba(0,0,0,0.7)',
                      whiteSpace: 'nowrap'
                    }}>HazMat Group</div>
                    <input
                      tabIndex={15 + props.tabTimes}
                      ref={refHazmatGroup}
                      type="text"
                      style={{
                        textTransform: 'capitalize',
                        textAlign: 'right',
                        paddingRight: 16,
                        fontWeight: 'bold'
                      }}
                      value={selectedLtlUnit?.hazmat_group || ''}
                      onKeyDown={(e) => {
                        let key = e.keyCode || e.which;

                        if (key === 49 || key === 97) { // 1
                          e.preventDefault();
                          setSelectedLtlUnit(prev => {
                            return {
                              ...prev,
                              hazmat_group: 'I'
                            }
                          })
                        } else if (key === 50 || key === 98) { // 2
                          e.preventDefault();
                          setSelectedLtlUnit(prev => {
                            return {
                              ...prev,
                              hazmat_group: 'II'
                            }
                          })
                        } else if (key === 51 || key === 99) { // 3
                          e.preventDefault();
                          setSelectedLtlUnit(prev => {
                            return {
                              ...prev,
                              hazmat_group: 'III'
                            }
                          })
                        } else if (key === 78) { // N
                          e.preventDefault();
                          setSelectedLtlUnit(prev => {
                            return {
                              ...prev,
                              hazmat_group: 'N/A'
                            }
                          })
                        } else if (key === 38) { // Arrow Up
                          e.preventDefault();
                          if (showHazmatGroupItems) {
                            let selectedIndex = hazmatGroupItems.findIndex(item => item.selected);

                            if (selectedIndex === -1) {
                              setHazmatGroupItems(hazmatGroupItems.map((item, index) => {
                                item.selected = index === 0;
                                return item;
                              }))
                            } else {
                              setHazmatGroupItems(hazmatGroupItems.map((item, index) => {
                                if (selectedIndex === 0) {
                                  item.selected = index === (hazmatGroupItems.length - 1);
                                } else {
                                  item.selected = index === (selectedIndex - 1);
                                }
                                return item;
                              }))
                            }
                          } else {
                            setHazmatGroupItems(hazmatGroupItems.map((item, index) => {
                              item.selected = (selectedLtlUnit?.hazmat_group || '').toLowerCase() === item.name.toLowerCase();
                              return item;
                            }))

                            setShowHazmatGroupItems(true)
                          }

                          refHazmatGroupPopupItems.current.map((r, i) => {
                            if (r && r.classList.contains('selected')) {
                              r.scrollIntoView({
                                behavior: 'auto',
                                block: 'center',
                                inline: 'nearest'
                              })
                            }
                            return true;
                          });
                        } else if (key === 40) { // Arrow Down
                          e.preventDefault();
                          if (showHazmatGroupItems) {
                            let selectedIndex = hazmatGroupItems.findIndex(item => item.selected);

                            if (selectedIndex === -1) {
                              setHazmatGroupItems(hazmatGroupItems.map((item, index) => {
                                item.selected = index === 0;
                                return item;
                              }))
                            } else {
                              setHazmatGroupItems(hazmatGroupItems.map((item, index) => {
                                if (selectedIndex === (hazmatGroupItems.length - 1)) {
                                  item.selected = index === 0;
                                } else {
                                  item.selected = index === (selectedIndex + 1);
                                }
                                return item;
                              }))
                            }
                          } else {
                            setHazmatGroupItems(hazmatGroupItems.map((item, index) => {
                              item.selected = (selectedLtlUnit?.hazmat_group || '').toLowerCase() === item.name.toLowerCase();
                              return item;
                            }))

                            setShowHazmatGroupItems(true)
                          }

                          refHazmatGroupPopupItems.current.map((r, i) => {
                            if (r && r.classList.contains('selected')) {
                              r.scrollIntoView({
                                behavior: 'auto',
                                block: 'center',
                                inline: 'nearest'
                              })
                            }
                            return true;
                          });
                        } else if (key === 27) { // Escape
                          if (showHazmatGroupItems) {
                            e.stopPropagation();
                            setShowHazmatGroupItems(false);
                          } else {
                            handleClosing(e);
                          }

                        } else if (key === 13) { // Enter
                          if (showHazmatGroupItems && hazmatGroupItems.findIndex(item => item.selected) > -1) {
                            setSelectedLtlUnit(prev => {
                              return {
                                ...prev,
                                hazmat_group: hazmatGroupItems[hazmatGroupItems.findIndex(item => item.selected)].name
                              }
                            })

                            window.setTimeout(() => {
                              setShowHazmatGroupItems(false);
                              refHazmatGroup.current.focus();
                            }, 0);
                          }
                        } else if (key === 9) { // Tab
                          if (showHazmatGroupItems) {
                            e.preventDefault();
                            setSelectedLtlUnit(prev => {
                              return {
                                ...prev,
                                hazmat_group: hazmatGroupItems[hazmatGroupItems.findIndex(item => item.selected)].name
                              }
                            })

                            window.setTimeout(() => {
                              setShowHazmatGroupItems(false);
                              refHazmatGroup.current.focus();
                            }, 0);
                          }
                        } else {
                          e.preventDefault();
                        }
                      }}
                      onBlur={(e) => {
                        const exist = hazmatGroupItems.find(item => item.name.toLowerCase() === e.target.value.toLowerCase());

                        if (!exist) {
                          setSelectedLtlUnit(prev => {
                            return {
                              ...prev,
                              hazmat_group: ''
                            }
                          })
                        }
                      }}
                      onChange={(e) => {
                        setSelectedLtlUnit(prev => {
                          return {
                            ...prev,
                            hazmat_group: e.target.value
                          }
                        });
                      }}
                    />
                    <FontAwesomeIcon className="dropdown-button" icon={faCaretDown} onClick={() => {
                      if (showHazmatGroupItems) {
                        setShowHazmatGroupItems(false);
                      } else {
                        setHazmatGroupItems(hazmatGroupItems.map((item, index) => {
                          item.selected = (selectedLtlUnit?.hazmat_group || '').toLowerCase() === item.name.toLowerCase();
                          return item;
                        }))

                        window.setTimeout(() => {
                          setShowHazmatGroupItems(true);

                          refHazmatGroupPopupItems.current.map((r, i) => {
                            if (r && r.classList.contains('selected')) {
                              r.scrollIntoView({
                                behavior: 'auto',
                                block: 'center',
                                inline: 'nearest'
                              })
                            }
                            return true;
                          });
                        }, 0);
                      }

                      refHazmatGroup.current.focus();
                    }} />
                  </div>
                  {
                    hazmatGroupTransition((style, item) => item && (
                      <animated.div
                        className="mochi-contextual-container"
                        id="mochi-contextual-container-handling-units"
                        style={{
                          ...style,
                          left: '0',
                          display: 'block'
                        }}
                        ref={refHazmatGroupDropDown}
                      >
                        <div className="mochi-contextual-popup vertical below right"
                          style={{ height: 150 }}>
                          <div className="mochi-contextual-popup-content">
                            <div className="mochi-contextual-popup-wrapper">
                              {
                                hazmatGroupItems.map((item, index) => {
                                  const mochiItemClasses = classnames({
                                    'mochi-item': true,
                                    'selected': item.selected
                                  });

                                  const searchValue = (selectedLtlUnit?.hazmat_group || '') === '' && (selectedLtlUnit?.hazmat_group || '') !== ''
                                    ? selectedLtlUnit?.hazmat_group : undefined;

                                  return (
                                    <div
                                      key={index}
                                      className={mochiItemClasses}
                                      id={item.id}
                                      onClick={() => {
                                        setSelectedLtlUnit(prev => {
                                          return {
                                            ...prev,
                                            hazmat_group: item.name
                                          }
                                        })

                                        window.setTimeout(() => {
                                          setShowHazmatGroupItems(false);
                                          refHazmatGroup.current.focus();
                                        }, 0);
                                      }}
                                      ref={ref => refHazmatGroupPopupItems.current.push(ref)}
                                    >
                                      {
                                        searchValue === undefined
                                          ? item.name
                                          : <Highlighter
                                            highlightClassName="mochi-item-highlight-text"
                                            searchWords={[searchValue]}
                                            autoEscape={true}
                                            textToHighlight={item.name}
                                          />
                                      }
                                      {
                                        item.selected &&
                                        <FontAwesomeIcon className="dropdown-selected"
                                          icon={faCaretRight} />
                                      }
                                    </div>
                                  )
                                })
                              }
                            </div>
                          </div>
                        </div>
                      </animated.div>
                    ))
                  }
                </div>

                <div className={classnames({
                  'select-box-container': true,
                  'disabled': (selectedLtlUnit?.hazmat || 0) === 0
                })} style={{ width: '9rem', minWidth: '9rem', maxWidth: '9rem' }}>
                  <div className="select-box-wrapper">
                    <div style={{
                      fontSize: '0.7rem',
                      color: 'rgba(0,0,0,0.7)',
                      whiteSpace: 'nowrap'
                    }}>HazMat Class</div>
                    <input
                      tabIndex={16 + props.tabTimes}
                      ref={refHazmatClass}
                      type="text"
                      style={{
                        textTransform: 'capitalize',
                        textAlign: 'right',
                        paddingRight: 16,
                        fontWeight: 'bold'
                      }}
                      value={selectedLtlUnit?.hazmat_class?.name || ''}
                      onKeyDown={(e) => {
                        let key = e.keyCode || e.which;

                        if (key === 38) { // Arrow Up
                          e.preventDefault();
                          if (hazmatClassItems.length > 0) {
                            let selectedIndex = hazmatClassItems.findIndex(item => item.selected);

                            if (selectedIndex === -1) {
                              setHazmatClassItems(hazmatClassItems.map((item, index) => {
                                item.selected = index === 0;
                                return item;
                              }))
                            } else {
                              setHazmatClassItems(hazmatClassItems.map((item, index) => {
                                if (selectedIndex === 0) {
                                  item.selected = index === (hazmatClassItems.length - 1);
                                } else {
                                  item.selected = index === (selectedIndex - 1);
                                }
                                return item;
                              }))
                            }

                            refHazmatClassPopupItems.current.map((r, i) => {
                              if (r && r.classList.contains('selected')) {
                                r.scrollIntoView({
                                  behavior: 'auto',
                                  block: 'center',
                                  inline: 'nearest'
                                })
                              }
                              return true;
                            });
                          } else {
                            axios.post(props.serverUrl + '/getHazmatClasses').then(res => {
                              if (res.data.result === 'OK') {
                                setHazmatClassItems(res.data.hazmat_classes.map((item, index) => {
                                  item.selected = (selectedLtlUnit?.hazmat_class?.name || '').toLowerCase() === item.name.toLowerCase();
                                  return item;
                                }))

                                refHazmatClassPopupItems.current.map((r, i) => {
                                  if (r && r.classList.contains('selected')) {
                                    r.scrollIntoView({
                                      behavior: 'auto',
                                      block: 'center',
                                      inline: 'nearest'
                                    })
                                  }
                                  return true;
                                });
                              }
                            }).catch(e => {
                              console.log('error getting hazmat classes', e);
                            })
                          }
                        } else if (key === 40) { // Arrow Down
                          e.preventDefault();
                          if (hazmatClassItems.length > 0) {
                            let selectedIndex = hazmatClassItems.findIndex(item => item.selected);

                            if (selectedIndex === -1) {
                              setHazmatClassItems(hazmatClassItems.map((item, index) => {
                                item.selected = index === 0;
                                return item;
                              }))
                            } else {
                              setHazmatClassItems(hazmatClassItems.map((item, index) => {
                                if (selectedIndex === (hazmatClassItems.length - 1)) {
                                  item.selected = index === 0;
                                } else {
                                  item.selected = index === (selectedIndex + 1);
                                }
                                return item;
                              }))
                            }

                            refHazmatClassPopupItems.current.map((r, i) => {
                              if (r && r.classList.contains('selected')) {
                                r.scrollIntoView({
                                  behavior: 'auto',
                                  block: 'center',
                                  inline: 'nearest'
                                })
                              }
                              return true;
                            });
                          } else {
                            axios.post(props.serverUrl + '/getHazmatClasses').then(res => {
                              if (res.data.result === 'OK') {
                                setHazmatClassItems(res.data.hazmat_classes.map((item, index) => {
                                  item.selected = (selectedLtlUnit?.hazmat_class?.name || '').toLowerCase() === item.name.toLowerCase();
                                  return item;
                                }))

                                refHazmatClassPopupItems.current.map((r, i) => {
                                  if (r && r.classList.contains('selected')) {
                                    r.scrollIntoView({
                                      behavior: 'auto',
                                      block: 'center',
                                      inline: 'nearest'
                                    })
                                  }
                                  return true;
                                });
                              }
                            }).catch(e => {
                              console.log('error getting hazmat classes', e);
                            })
                          }
                        } else if (key === 27) { // Escape
                          if (hazmatClassItems.length > 0) {
                            e.stopPropagation();
                            setHazmatClassItems([]);
                          } else {
                            handleClosing(e);
                          }

                        } else if (key === 13) { // Enter
                          if (hazmatClassItems.length > 0 && hazmatClassItems.findIndex(item => item.selected) > -1) {
                            setSelectedLtlUnit(prev => {
                              return {
                                ...prev,
                                hazmat_class: hazmatClassItems[hazmatClassItems.findIndex(item => item.selected)],
                                hazmat_class_id: hazmatClassItems[hazmatClassItems.findIndex(item => item.selected)].id
                              }
                            })

                            window.setTimeout(() => {
                              setHazmatClassItems([]);
                              refHazmatClass.current.focus();
                            }, 0);
                          }
                        } else if (key === 9) { // Tab
                          if (hazmatClassItems.length > 0) {
                            e.preventDefault();
                            setSelectedLtlUnit(prev => {
                              return {
                                ...prev,
                                hazmat_class: hazmatClassItems[hazmatClassItems.findIndex(item => item.selected)],
                                hazmat_class_id: hazmatClassItems[hazmatClassItems.findIndex(item => item.selected)].id
                              }
                            })

                            window.setTimeout(() => {
                              setHazmatClassItems([]);
                              refHazmatClass.current.focus();
                            }, 0);
                          }
                        }
                      }}
                      onInput={(e) => {
                        setHazmatClassesInput(e.target.value)
                      }}
                      onBlur={(e) => {
                        axios.post(props.serverUrl + '/getHazmatClasses').then(res => {
                          if (res.data.result === 'OK') {
                            const exist = res.data.hazmat_classes.find(item => item.name.toLowerCase() === e.target.value.toLowerCase());

                            if (!exist) {
                              setSelectedLtlUnit(prev => {
                                return {
                                  ...prev,
                                  hazmat_class: null,
                                  hazmat_class_id: null
                                }
                              })
                            } else {
                              setSelectedLtlUnit(prev => {
                                return {
                                  ...prev,
                                  hazmat_class: exist,
                                  hazmat_class_id: exist.id
                                }
                              })
                            }
                          }
                        }).catch(e => {
                          console.log('error getting hazmat classes', e);
                        })
                      }}
                      onChange={(e) => {
                        setSelectedLtlUnit(prev => {
                          return {
                            ...prev,
                            hazmat_class: {
                              name: e.target.value
                            },
                            hazmat_class_id: null
                          }
                        });
                      }}
                    />
                    <FontAwesomeIcon className="dropdown-button" icon={faCaretDown} onClick={() => {
                      if (hazmatClassItems.length > 0) {
                        setHazmatClassItems([]);
                      } else {
                        axios.post(props.serverUrl + '/getHazmatClasses').then(res => {
                          if (res.data.result === 'OK') {
                            setHazmatClassItems(res.data.hazmat_classes.map((item, index) => {
                              item.selected = (selectedLtlUnit?.hazmat_class?.name || '').toLowerCase() === item.name.toLowerCase();
                              return item;
                            }))

                            window.setTimeout(() => {
                              refHazmatClassPopupItems.current.map((r, i) => {
                                if (r && r.classList.contains('selected')) {
                                  r.scrollIntoView({
                                    behavior: 'auto',
                                    block: 'center',
                                    inline: 'nearest'
                                  })
                                }
                                return true;
                              });
                            }, 0);
                          }
                        }).catch(e => {
                          console.log('error getting hazmat classes', e);
                        })
                      }

                      refHazmatClass.current.focus();
                    }} />
                  </div>
                  {
                    hazmatClassTransition((style, item) => item && (
                      <animated.div
                        className="mochi-contextual-container"
                        id="mochi-contextual-container-handling-units"
                        style={{
                          ...style,
                          left: '0',
                          display: 'block'
                        }}
                        ref={refHazmatClassDropDown}
                      >
                        <div className="mochi-contextual-popup vertical below right"
                          style={{ height: 150 }}>
                          <div className="mochi-contextual-popup-content">
                            <div className="mochi-contextual-popup-wrapper">
                              {
                                hazmatClassItems.map((item, index) => {
                                  const mochiItemClasses = classnames({
                                    'mochi-item': true,
                                    'selected': item.selected
                                  });

                                  const searchValue = (selectedLtlUnit?.hazmat_class?.name || '') === '' && (selectedLtlUnit?.hazmat_class?.name || '') !== ''
                                    ? selectedLtlUnit?.hazmat_class?.name : undefined;

                                  return (
                                    <div
                                      key={index}
                                      className={mochiItemClasses}
                                      id={item.id}
                                      onClick={() => {
                                        setSelectedLtlUnit(prev => {
                                          return {
                                            ...prev,
                                            hazmat_class: item,
                                            hazmat_class_id: item.id
                                          }
                                        })

                                        window.setTimeout(() => {
                                          setHazmatClassItems([]);
                                          refHazmatClass.current.focus();
                                        }, 0);
                                      }}
                                      ref={ref => refHazmatClassPopupItems.current.push(ref)}
                                    >
                                      {
                                        searchValue === undefined
                                          ? item.name
                                          : <Highlighter
                                            highlightClassName="mochi-item-highlight-text"
                                            searchWords={[searchValue]}
                                            autoEscape={true}
                                            textToHighlight={item.name}
                                          />
                                      }
                                      {
                                        item.selected &&
                                        <FontAwesomeIcon className="dropdown-selected"
                                          icon={faCaretRight} />
                                      }
                                    </div>
                                  )
                                })
                              }
                            </div>
                          </div>
                        </div>
                      </animated.div>
                    ))
                  }
                </div>

                <div className={classnames({
                  'select-box-container': true,
                  'disabled': (selectedLtlUnit?.hazmat || 0) === 0
                })} style={{ width: '17rem', minWidth: '17rem', maxWidth: '17rem' }}>
                  <div className="select-box-wrapper">
                    <div style={{
                      fontSize: '0.7rem',
                      color: 'rgba(0,0,0,0.7)',
                      whiteSpace: 'nowrap'
                    }}>Emergency Contact</div>
                    <input
                      tabIndex={17 + props.tabTimes}
                      ref={refEmergencyContact}
                      type="text"
                      style={{
                        textTransform: 'capitalize',
                        textAlign: 'right'
                      }}
                      value={selectedLtlUnit?.emergency_contact || ''}
                      onKeyDown={(e) => {
                        let key = e.keyCode || e.which;

                        if (key === 38) { // Arrow Up
                          e.preventDefault();
                          if (emergencyContactItems.length > 0) {
                            let selectedIndex = emergencyContactItems.findIndex(item => item.selected);

                            if (selectedIndex === -1) {
                              setEmergencyContactItems(emergencyContactItems.map((item, index) => {
                                item.selected = index === 0;
                                return item;
                              }))
                            } else {
                              setEmergencyContactItems(emergencyContactItems.map((item, index) => {
                                if (selectedIndex === 0) {
                                  item.selected = index === (emergencyContactItems.length - 1);
                                } else {
                                  item.selected = index === (selectedIndex - 1);
                                }
                                return item;
                              }))
                            }

                            refEmergencyContactPopupItems.current.map((r, i) => {
                              if (r && r.classList.contains('selected')) {
                                r.scrollIntoView({
                                  behavior: 'auto',
                                  block: 'center',
                                  inline: 'nearest'
                                })
                              }
                              return true;
                            });
                          } else {
                            axios.post(props.serverUrl + '/getEmergencyContacts').then(res => {
                              if (res.data.result === 'OK') {
                                setEmergencyContactItems(res.data.emergency_contacts.map((item, index) => {
                                  item.selected = (selectedLtlUnit?.emergency_contact || '').toLowerCase() === item.emergency_contact.toLowerCase();
                                  return item;
                                }))

                                refEmergencyContactPopupItems.current.map((r, i) => {
                                  if (r && r.classList.contains('selected')) {
                                    r.scrollIntoView({
                                      behavior: 'auto',
                                      block: 'center',
                                      inline: 'nearest'
                                    })
                                  }
                                  return true;
                                });
                              }
                            }).catch(e => {
                              console.log('error getting emergency contacts', e);
                            })
                          }
                        } else if (key === 40) { // Arrow Down
                          e.preventDefault();
                          if (emergencyContactItems.length > 0) {
                            let selectedIndex = emergencyContactItems.findIndex(item => item.selected);

                            if (selectedIndex === -1) {
                              setEmergencyContactItems(emergencyContactItems.map((item, index) => {
                                item.selected = index === 0;
                                return item;
                              }))
                            } else {
                              setEmergencyContactItems(emergencyContactItems.map((item, index) => {
                                if (selectedIndex === (emergencyContactItems.length - 1)) {
                                  item.selected = index === 0;
                                } else {
                                  item.selected = index === (selectedIndex + 1);
                                }
                                return item;
                              }))
                            }

                            refEmergencyContactPopupItems.current.map((r, i) => {
                              if (r && r.classList.contains('selected')) {
                                r.scrollIntoView({
                                  behavior: 'auto',
                                  block: 'center',
                                  inline: 'nearest'
                                })
                              }
                              return true;
                            });
                          } else {
                            axios.post(props.serverUrl + '/getEmergencyContacts').then(res => {
                              if (res.data.result === 'OK') {
                                setEmergencyContactItems(res.data.emergency_contacts.map((item, index) => {
                                  item.selected = (selectedLtlUnit?.emergency_contact || '').toLowerCase() === item.emergency_contact.toLowerCase();
                                  return item;
                                }))

                                refEmergencyContactPopupItems.current.map((r, i) => {
                                  if (r && r.classList.contains('selected')) {
                                    r.scrollIntoView({
                                      behavior: 'auto',
                                      block: 'center',
                                      inline: 'nearest'
                                    })
                                  }
                                  return true;
                                });
                              }
                            }).catch(e => {
                              console.log('error getting emergency contacts', e);
                            })
                          }
                        } else if (key === 27) { // Escape
                          if (emergencyContactItems.length > 0) {
                            e.stopPropagation();
                            setEmergencyContactItems([]);
                          } else {
                            handleClosing(e);
                          }

                        } else if (key === 13) { // Enter
                          if (emergencyContactItems.length > 0 && emergencyContactItems.findIndex(item => item.selected) > -1) {
                            setSelectedLtlUnit(prev => {
                              return {
                                ...prev,
                                emergency_contact: emergencyContactItems[emergencyContactItems.findIndex(item => item.selected)].emergency_contact,
                                emergency_phone: emergencyContactItems[emergencyContactItems.findIndex(item => item.selected)].emergency_phone
                              }
                            })

                            window.setTimeout(() => {
                              setEmergencyContactItems([]);
                              refEmergencyPhone.current.inputElement.focus({ preventScroll: true });
                            }, 0);
                          }
                        } else if (key === 9) { // Tab
                          if (emergencyContactItems.length > 0) {
                            e.preventDefault();
                            setSelectedLtlUnit(prev => {
                              return {
                                ...prev,
                                emergency_contact: emergencyContactItems[emergencyContactItems.findIndex(item => item.selected)].emergency_contact,
                                emergency_phone: emergencyContactItems[emergencyContactItems.findIndex(item => item.selected)].emergency_phone
                              }
                            })

                            window.setTimeout(() => {
                              setEmergencyContactItems([]);
                              refEmergencyPhone.current.inputElement.focus({ preventScroll: true });
                            }, 0);
                          }
                        }
                      }}
                      onInput={(e) => {
                        setEmergencyContactInput(e.target.value)
                      }}
                      onChange={(e) => {
                        setSelectedLtlUnit(prev => {
                          return {
                            ...prev,
                            emergency_contact: e.target.value
                          }
                        });
                      }}
                    />
                  </div>
                  {
                    emergencyContactTransition((style, item) => item && (
                      <animated.div
                        className="mochi-contextual-container"
                        id="mochi-contextual-container-emergency-contacts"
                        style={{
                          ...style,
                          left: '0',
                          display: 'block'
                        }}
                        ref={refEmergencyContactDropDown}
                      >
                        <div className="mochi-contextual-popup vertical below right"
                          style={{ height: 150 }}>
                          <div className="mochi-contextual-popup-content">
                            <div className="mochi-contextual-popup-wrapper">
                              {
                                emergencyContactItems.map((item, index) => {
                                  const mochiItemClasses = classnames({
                                    'mochi-item': true,
                                    'selected': item.selected
                                  });

                                  const searchValue = (selectedLtlUnit?.emergency_contact || '') === '' && (selectedLtlUnit?.emergency_contact || '') !== ''
                                    ? selectedLtlUnit?.emergency_contact : undefined;

                                  return (
                                    <div
                                      key={index}
                                      className={mochiItemClasses}
                                      id={item.id}
                                      onClick={() => {
                                        setSelectedLtlUnit(prev => {
                                          return {
                                            ...prev,
                                            emergency_contact: item.emergency_contact,
                                            emergency_phone: item.emergency_phone
                                          }
                                        })

                                        window.setTimeout(() => {
                                          setEmergencyContactItems([]);
                                          refEmergencyPhone.current.inputElement.focus({ preventScroll: true });
                                        }, 0);
                                      }}
                                      ref={ref => refEmergencyContactPopupItems.current.push(ref)}
                                    >
                                      {
                                        searchValue === undefined
                                          ? <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                          }}>
                                            <span>{item.emergency_contact}</span>
                                            <span style={{ fontWeight: 'bold', color: 'initial' }}>({item.emergency_phone})</span>
                                          </div>
                                          : <Highlighter
                                            highlightClassName="mochi-item-highlight-text"
                                            searchWords={[searchValue]}
                                            autoEscape={true}
                                            textToHighlight={item.name}
                                          />
                                      }
                                      {
                                        item.selected &&
                                        <FontAwesomeIcon className="dropdown-selected"
                                          icon={faCaretRight} />
                                      }
                                    </div>
                                  )
                                })
                              }
                            </div>
                          </div>
                        </div>
                      </animated.div>
                    ))
                  }
                </div>

                <div className={classnames({
                  'input-box-container': true,
                  'disabled': (selectedLtlUnit?.hazmat || 0) === 0
                })} style={{ width: '9rem', maxWidth: '9rem', minWidth: '9rem' }}>
                  <div style={{
                    fontSize: '0.7rem',
                    color: 'rgba(0,0,0,0.7)',
                    whiteSpace: 'nowrap'
                  }}>Phone</div>
                  <MaskedInput
                    tabIndex={18 + props.tabTimes}
                    type="text"
                    ref={refEmergencyPhone}
                    style={{ textAlign: 'right', fontWeight: 'bold' }}
                    mask={[/[1-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                    guide={true}
                    onKeyDown={(e) => {
                      let key = e.keyCode || e.which;

                      if (key === 9) {
                        e.preventDefault();
                        validateLtlUnitForSaving();
                      }
                    }}
                    onInput={(e) => {
                      setSelectedLtlUnit(prev => {
                        return {
                          ...prev,
                          emergency_phone: e.target.value
                        }
                      });
                    }}
                    onChange={(e) => {
                      setSelectedLtlUnit(prev => {
                        return {
                          ...prev,
                          emergency_phone: e.target.value
                        }
                      });
                    }}
                    value={selectedLtlUnit?.emergency_phone || ''}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="form-bordered-box" style={{ flexGrow: 0 }}>
          <div className="form-header">
            <div className="top-border top-border-left"></div>
            <div className="form-title">Accessorials</div>
            <div className="top-border top-border-middle"></div>
            <div className="top-border top-border-right"></div>
          </div>
          <div className="form-wrapper">
            <div className="accessorial-container">
              {
                (accessorials || []).map((item, index) => {
                  return (
                    <div className="accessorial-item" key={index}>
                      <div className="accessorial-item-name">{item.name}</div>
                      <FontAwesomeIcon className="accessorial-delete-icon" icon={faTrashAlt} onClick={() => {
                        deleteAccessorial(item.id);
                      }} />
                    </div>
                  )
                })
              }

              <div className="select-box-container" style={{ width: '15rem', minWidth: '15rem', maxWidth: '15rem' }}>
                <div className="select-box-wrapper">
                  <input
                    tabIndex={19 + props.tabTimes}
                    placeholder='Add new accessorial'
                    ref={refAccessorials}
                    type="text"
                    style={{
                      textTransform: 'capitalize'
                    }}
                    value={selectedAccessorial?.name || ''}
                    onKeyDown={(e) => {
                      let key = e.keyCode || e.which;

                      if (key === 38) { // Arrow Up
                        e.preventDefault();
                        if (accessorialsItems.length > 0) {
                          let selectedIndex = accessorialsItems.findIndex(item => item.selected);

                          if (selectedIndex === -1) {
                            setAccessorialsItems(accessorialsItems.map((item, index) => {
                              item.selected = index === 0;
                              return item;
                            }))
                          } else {
                            setAccessorialsItems(accessorialsItems.map((item, index) => {
                              if (selectedIndex === 0) {
                                item.selected = index === (accessorialsItems.length - 1);
                              } else {
                                item.selected = index === (selectedIndex - 1);
                              }
                              return item;
                            }))
                          }

                          refAccessorialsPopupItems.current.map((r, i) => {
                            if (r && r.classList.contains('selected')) {
                              r.scrollIntoView({
                                behavior: 'auto',
                                block: 'center',
                                inline: 'nearest'
                              })
                            }
                            return true;
                          });
                        } else {
                          axios.post(props.serverUrl + '/getAccessorials').then(res => {
                            if (res.data.result === 'OK') {
                              setAccessorialsItems(res.data.accessorials.map((item, index) => {
                                item.selected = (selectedAccessorial?.name || '').toLowerCase() === item.name.toLowerCase();
                                return item;
                              }))

                              refAccessorialsPopupItems.current.map((r, i) => {
                                if (r && r.classList.contains('selected')) {
                                  r.scrollIntoView({
                                    behavior: 'auto',
                                    block: 'center',
                                    inline: 'nearest'
                                  })
                                }
                                return true;
                              });
                            }
                          }).catch(e => {
                            console.log('error getting accessorials', e);
                          })
                        }
                      } else if (key === 40) { // Arrow Down
                        e.preventDefault();
                        if (accessorialsItems.length > 0) {
                          let selectedIndex = accessorialsItems.findIndex(item => item.selected);

                          if (selectedIndex === -1) {
                            setAccessorialsItems(accessorialsItems.map((item, index) => {
                              item.selected = index === 0;
                              return item;
                            }))
                          } else {
                            setAccessorialsItems(accessorialsItems.map((item, index) => {
                              if (selectedIndex === (accessorialsItems.length - 1)) {
                                item.selected = index === 0;
                              } else {
                                item.selected = index === (selectedIndex + 1);
                              }
                              return item;
                            }))
                          }

                          refAccessorialsPopupItems.current.map((r, i) => {
                            if (r && r.classList.contains('selected')) {
                              r.scrollIntoView({
                                behavior: 'auto',
                                block: 'center',
                                inline: 'nearest'
                              })
                            }
                            return true;
                          });
                        } else {
                          axios.post(props.serverUrl + '/getAccessorials').then(res => {
                            if (res.data.result === 'OK') {
                              setAccessorialsItems(res.data.accessorials.map((item, index) => {
                                item.selected = (selectedAccessorial?.name || '').toLowerCase() === item.name.toLowerCase();
                                return item;
                              }))

                              refAccessorialsPopupItems.current.map((r, i) => {
                                if (r && r.classList.contains('selected')) {
                                  r.scrollIntoView({
                                    behavior: 'auto',
                                    block: 'center',
                                    inline: 'nearest'
                                  })
                                }
                                return true;
                              });
                            }
                          }).catch(e => {
                            console.log('error getting accessorials', e);
                          })
                        }
                      } else if (key === 27) { // Escape
                        if (accessorialsItems.length > 0) {
                          e.stopPropagation();
                          setAccessorialsItems([]);
                        } else {
                          handleClosing(e);
                        }

                      } else if (key === 13) { // Enter
                        if (accessorialsItems.length > 0 && accessorialsItems.findIndex(item => item.selected) > -1) {
                          setSelectedAccessorial(accessorialsItems.find(item => item.selected))

                          window.setTimeout(() => {
                            setAccessorialsItems([]);
                            refAccessorials.current.focus();
                          }, 0);
                        }
                      } else if (key === 9) { // Tab
                        if (accessorialsItems.length > 0) {
                          e.preventDefault();
                          setSelectedAccessorial(accessorialsItems.find(item => item.selected))

                          window.setTimeout(() => {
                            setAccessorialsItems([]);
                            refAccessorials.current.focus();
                          }, 0);
                        } else if ((selectedAccessorial?.id || 0) > 0) {
                          validateAccessorialForSaving();
                        } else {
                          refUnits.current.inputElement.focus({ preventScroll: true });
                        }
                      }
                    }}
                    onInput={(e) => {
                      setAccessorialsInput(e.target.value)
                    }}
                    onBlur={(e) => {
                      axios.post(props.serverUrl + '/getAccessorials').then(res => {
                        if (res.data.result === 'OK') {
                          const exist = res.data.accessorials.find(item => item.name.toLowerCase() === e.target.value.toLowerCase());

                          if (!exist) {
                            setSelectedAccessorial(null)
                          } else {
                            setSelectedAccessorial(exist)
                          }
                        }
                      }).catch(e => {
                        console.log('error getting accessorials', e);
                      })
                    }}
                    onChange={(e) => {
                      setSelectedAccessorial({
                        name: e.target.value
                      })
                    }}
                  />
                  <FontAwesomeIcon className="dropdown-button" icon={faCaretDown} onClick={() => {
                    if (accessorialsItems.length > 0) {
                      setAccessorialsItems([]);
                    } else {
                      axios.post(props.serverUrl + '/getAccessorials').then(res => {
                        if (res.data.result === 'OK') {
                          setAccessorialsItems(res.data.accessorials.map((item, index) => {
                            item.selected = (selectedAccessorial?.name || '').toLowerCase() === item.name.toLowerCase();
                            return item;
                          }))

                          window.setTimeout(() => {
                            refAccessorialsPopupItems.current.map((r, i) => {
                              if (r && r.classList.contains('selected')) {
                                r.scrollIntoView({
                                  behavior: 'auto',
                                  block: 'center',
                                  inline: 'nearest'
                                })
                              }
                              return true;
                            });
                          }, 0);
                        }
                      }).catch(e => {
                        console.log('error getting accessorials', e);
                      });
                    }

                    refAccessorials.current.focus();
                  }} />
                </div>
                {
                  accessorialsTransition((style, item) => item && (
                    <animated.div
                      className="mochi-contextual-container"
                      id="mochi-contextual-container-accessorials"
                      style={{
                        ...style,
                        left: '0',
                        display: 'block'
                      }}
                      ref={refAccessorialsDropDown}
                    >
                      <div className="mochi-contextual-popup vertical below right"
                        style={{ height: 150 }}>
                        <div className="mochi-contextual-popup-content">
                          <div className="mochi-contextual-popup-wrapper">
                            {
                              accessorialsItems.map((item, index) => {
                                const mochiItemClasses = classnames({
                                  'mochi-item': true,
                                  'selected': item.selected
                                });

                                const searchValue = (selectedAccessorial?.name || '') === '' && (selectedAccessorial?.name || '') !== ''
                                  ? selectedAccessorial?.name : undefined;

                                return (
                                  <div
                                    key={index}
                                    className={mochiItemClasses}
                                    id={item.id}
                                    onClick={() => {
                                      setSelectedAccessorial(item)

                                      window.setTimeout(() => {
                                        setAccessorialsItems([]);
                                        refAccessorials.current.focus();
                                      }, 0);
                                    }}
                                    ref={ref => refAccessorialsPopupItems.current.push(ref)}
                                  >
                                    {
                                      searchValue === undefined
                                        ? item.name
                                        : <Highlighter
                                          highlightClassName="mochi-item-highlight-text"
                                          searchWords={[searchValue]}
                                          autoEscape={true}
                                          textToHighlight={item.name}
                                        />
                                    }
                                    {
                                      item.selected &&
                                      <FontAwesomeIcon className="dropdown-selected"
                                        icon={faCaretRight} />
                                    }
                                  </div>
                                )
                              })
                            }
                          </div>
                        </div>
                      </div>
                    </animated.div>
                  ))
                }
              </div>
            </div>
          </div>
        </div>

        <div className="ltl-list">
          <div className="form-bordered-box">
            <div className="form-header">
              <div className="top-border top-border-left"></div>
              {/* <div className="form-title">Assesorials</div> */}
              <div className="top-border top-border-middle"></div>
              <div className="top-border top-border-right"></div>
            </div>
            <div className="form-wrapper" style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              top: '0',
              left: '0',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {
                (ltlUnits || []).map((item, index) => {
                  const itemClass = classnames({
                    'ltl-unit-item': true,
                    'selected': (selectedLtlUnit?.id || 0) === item.id
                  })
                  return (
                    <div className={itemClass} onClick={() => {
                      setSelectedLtlUnit(item);
                      refUnits.current.inputElement.focus({ preventScroll: true });
                    }} key={index}>
                      <div className="ltl-unit-info">
                        <div className='item-column units'>
                          <div className="item-label">Units</div>
                          <div className="item-data">{item?.units || ''}</div>
                        </div>

                        <div className='item-column pieces'>
                          <div className="item-label">Pieces</div>
                          <div className="item-data">{item?.pieces || ''}</div>
                        </div>

                        <div className='item-column handling-units'>
                          <div className="item-label">Handling Units</div>
                          <div className="item-data">{item?.handling_unit?.name || ''}</div>
                        </div>

                        <div className='item-column weight'>
                          <div className="item-label">Weight</div>
                          <div className="item-data"><span>{item?.weight || ''}</span> <span>{item?.weight_unit}</span></div>
                        </div>

                        <div className='item-column length'>
                          <div className="item-label">Length</div>
                          <div className="item-data"><span>{item?.length || ''}</span> <span>{item?.dimension_unit}</span></div>
                        </div>

                        <div className='item-column width'>
                          <div className="item-label">Width</div>
                          <div className="item-data"><span>{item?.width || ''}</span> <span>{item?.dimension_unit}</span></div>
                        </div>

                        <div className='item-column height'>
                          <div className="item-label">Height</div>
                          <div className="item-data"><span>{item?.height || ''}</span> <span>{item?.dimension_unit}</span></div>
                        </div>

                        <div className='item-column unit-class'>
                          <div className="item-label">Class</div>
                          <div className="item-data">{item?.unit_class?.name || ''}</div>
                        </div>

                        <div className='item-column nmfc'>
                          <div className="item-label">NMFC</div>
                          <div className="item-data">{item?.nmfc || ''}</div>
                        </div>

                        <div className='item-column description'>
                          <div className="item-label">Description</div>
                          <div className="item-data">{item?.description || ''}</div>
                        </div>
                      </div>
                      {
                        (item?.hazmat || 0) === 1 &&
                        <div className="ltl-unit-hazmat-title"><span>HazMat</span><FontAwesomeIcon className='hazmat-caret-down' icon={faCaretDown} /></div>
                      }
                      {
                        (item?.hazmat || 0) === 1 &&
                        <div className="ltl-unit-hazmat-info">
                          <div className='item-column hazmat-name'>
                            <div className="item-label">HazMat Name</div>
                            <div className="item-data">{item?.hazmat_name || ''}</div>
                          </div>

                          <div className='item-column hazmat-packaging'>
                            <div className="item-label">HazMat Packaging</div>
                            <div className="item-data">{item?.hazmat_packaging?.name || ''}</div>
                          </div>

                          <div className='item-column hazmat-un-na'>
                            <div className="item-label">HazMat UN/NA</div>
                            <div className="item-data">{item?.hazmat_un_na || ''}</div>
                          </div>

                          <div className='item-column hazmat-group'>
                            <div className="item-label">HazMat Group</div>
                            <div className="item-data">{item?.hazmat_group || ''}</div>
                          </div>

                          <div className='item-column hazmat-class'>
                            <div className="item-label">HazMat Class</div>
                            <div className="item-data">{item?.hazmat_class?.name || ''}</div>
                          </div>

                          <div className='item-column emergency-contact'>
                            <div className="item-label">Emergency Contact</div>
                            <div className="item-data">{item?.emergency_contact || ''}</div>
                          </div>

                          <div className='item-column hazmat-phone'>
                            <div className="item-label">Phone</div>
                            <div className="item-data">{item?.emergency_phone || ''}</div>
                          </div>
                        </div>
                      }
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    scale: state.systemReducers.scale,
    user: state.systemReducers.user,
    serverUrl: state.systemReducers.serverUrl,
  }
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Ltl)
import './App.css';
import { useEffect, useRef, useState } from 'react';


import CountryRegionFilter from './components/CountryRegionFilter';
import ExpressionTypeFilter from './components/ExpressionTypeFilter';
import DateRangeFilter from './components/DateRangeFilter';
import ToggleEnable from './components/ToggleEnable';
import Visualization from './components/visualization';
import FormPopup from './components/FormPopup';

const source2 = {
  Nepal:['Kathmandu', 'Ramechhap', 'Gorkha', 'Pokhara'],
  India:['Delhi', 'Mumbai', 'Kolkata', 'Chennai'],
  China:['Beijing', 'Shanghai', 'Shenzhen', 'Guangzhou'],
  'United States of America':['New York', 'Los Angeles', 'Chicago', 'Houston'],
}

const countryRegionData = JSON.parse(document.getElementById('country-region-data').innerHTML);

const source = countryRegionData;

// Helper function to get the CSRF token from the cookie
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + '=') {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}


function App() {
  const [regionInputs, setRegionInputs] = useState({});
  const [regionInputsUse, setRegionInputsUse] = useState('exclude');
  const [suggestions, setSuggestions] = useState([]);
  const [expressionTypeChoices, setExpressionTypeChoices] = useState([]);
  const [expressionTypeUse, setExpressionTypeUse] = useState('exclude');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [countryRegionEnabled, setCountryRegionEnabled] = useState(true);
  const [dateRangeEnabled, setDateRangeEnabled] = useState(true);
  const [expressionTypeEnabled, setExpressionTypeEnabled] = useState(true);

  const datasetNameRef = useRef();

  function initializeValues(){
    const countryRegionWidData = JSON.parse(document.getElementById('countryRegionWidData').innerHTML);
    if(countryRegionWidData==null){
      setCountryRegionEnabled(false);
    }
    else if(countryRegionWidData){
      setRegionInputs(countryRegionWidData['regionInputs']);
      setRegionInputsUse(countryRegionWidData['regionInputsUse']);
    } 
  
    const expressionTypeWidData = JSON.parse(document.getElementById('expressionWidData').innerHTML);
    if(expressionTypeWidData==null){
      setExpressionTypeEnabled(false);
    }
    else if(expressionTypeWidData){
      setExpressionTypeChoices(expressionTypeWidData['expressionTypeChoices']);
      setExpressionTypeUse(expressionTypeWidData['expressionTypeUse']);
    }
  
    const dateRangeWidData = JSON.parse(document.getElementById('dateRange').innerHTML);
    if(dateRangeWidData==null){
      setDateRangeEnabled(false);
    }
    else if(dateRangeWidData){
      if(dateRangeWidData[0]!=null){
        const startDate = new Date(dateRangeWidData[0]);
        startDate.setHours(0,0,0,0);
        setStartDate(startDate);
      }
      if(dateRangeWidData[1]!=null){
        const endDate = new Date(dateRangeWidData[1]);
        endDate.setHours(23,59,59,999);
        setEndDate(endDate);
      }
    }
  
    console.log('initializeValues: ',regionInputs, regionInputsUse, expressionTypeChoices, expressionTypeUse, startDate, endDate);
  };
  useEffect(()=>{
    initializeValues();
  },[]);
  

  const onKeyChange = event=>{
    const value = event.target.value;
    console.log(value);
    const region = value.split(',')[0];
    const country = value.split(',')[1];

    if(country){
      const suggestions = source[country].filter(item=>item.toLowerCase().includes(region.toLowerCase())).map(item=>`${item},${country}`);
      setSuggestions(suggestions);
    }
    else{
      const country_suggestions = Object.keys(source).filter(item=>item.toLowerCase().includes(region.toLowerCase()))
      const region_suggestions = Object.keys(source).map(country=>source[country].filter(item=>item.toLowerCase().includes(region.toLowerCase())).map(item=>`${item},${country}`)).flat();
      setSuggestions([...country_suggestions,...region_suggestions]);
    }
  }

  const onSuggestionClick = event=>{
    const value = event.target.innerHTML;
    const region = value.split(',')[0];
    const country = value.split(',')[1];
    console.log(value,' | ', region, country);
    if (!country){//this was a country suggestion
      setRegionInputs({...regionInputs, [region]:source[region]});
    }
    else if(!regionInputs[country]){//this is a new addition for the country
      setRegionInputs({...regionInputs, [country]:[region]});
    }
    else if(!regionInputs[country].includes(region)){
      setRegionInputs({...regionInputs, [country]:[...regionInputs[country], region]});
    }
  }

  const deleteItem = value=>{
    console.log('Delete Item', value );
    const region = value.split(',')[0];
    const country = value.split(',')[1];
    const newRegionInputs = {...regionInputs};
    if (!country){//this was a country suggestion
      delete newRegionInputs[region];
    }
    else{
      if(regionInputs[country].length===1){
        delete newRegionInputs[country];
      }
      else{
        newRegionInputs[country] = newRegionInputs[country].filter(item=>item!==region);
      }
    }
    // console.log('newRegionInputs',newRegionInputs);
    setRegionInputs(newRegionInputs);
  }

  const onExpressionTypeChoicesChange = value=>{
    console.log('onExpressionTypeChoicesChange', expressionTypeChoices);
    if(expressionTypeChoices.includes(value)){
      setExpressionTypeChoices(expressionTypeChoices.filter(item=>item!==value));
    }
    else{
      setExpressionTypeChoices([...expressionTypeChoices,value]);
    }
  }

  const createHiddenFormInput = (key, value)=>{
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = JSON.stringify(value);
    return input;
  }

  function submitWidData(create){
    const tz_info = Intl.DateTimeFormat().resolvedOptions().timeZone;
    console.log(tz_info)
    const widget_data = {countryRegionWidget:{regionInputs,regionInputsUse}, expressionTypeWidget:{expressionTypeChoices,expressionTypeUse}, dateRange:[startDate, endDate, tz_info]};
    const widget_flag = [countryRegionEnabled, expressionTypeEnabled, dateRangeEnabled];
    // Populate the form fields with JSON data
    const form = document.getElementById('widget-data-capture-form');
    Object.keys(widget_data).forEach((key,i) => {
      if(!widget_flag[i]) return;
      form.appendChild(createHiddenFormInput(key, widget_data[key]));
    });
    form.appendChild(createHiddenFormInput('tz_info', tz_info));

    if(create){
      // console.log(create)
      form.appendChild(createHiddenFormInput('createDataset', create));
    }
    // Submit the form
    form.submit();
  }

  const handleSubmitWidget=(event)=>{
    submitWidData();
  }

  const handleCreateDataset=(dName)=>{
    submitWidData(dName);
  }
  return (
    <>
    <div className="widget-App-container-brother">
      <div className="widget_App">
        <div className="widget_container-container">
          <div className={"widget_container countryRegion"+(countryRegionEnabled?'':' widget-disable')}>
            <CountryRegionFilter {...{suggestions,onKeyChange,onSuggestionClick,regionInputs,deleteItem}}
              {...{regionInputsUse,setRegionInputsUse}}
            />
          </div>
          <ToggleEnable enabled={countryRegionEnabled} setEnabled={setCountryRegionEnabled}
          />
        </div>
        <div className="widget_container-container">
          <div className={"widget_container expressionType"+(expressionTypeEnabled?'':' widget-disable')}>
            <ExpressionTypeFilter  expressionTypeChoices={expressionTypeChoices} onExpressionTypeChoicesChange={onExpressionTypeChoicesChange}
              {...{expressionTypeUse,setExpressionTypeUse}}
            />
          </div>
          <ToggleEnable enabled={expressionTypeEnabled} setEnabled={setExpressionTypeEnabled}/>
        </div>
        <div className="widget_container-container">
          <div className={"widget_container dateRange"+(dateRangeEnabled?'':' widget-disable')}>
            <DateRangeFilter {...{startDate, setStartDate, endDate, setEndDate}}/>
          </div>
          <ToggleEnable enabled={dateRangeEnabled} setEnabled={setDateRangeEnabled}/>
        </div>
      </div>
      <div className="widget-submit-container">
        <button className="widget-submit" onClick={handleSubmitWidget}>Filter</button>
        {/* <button className="widget-create" onClick={()=>handleSubmitWidget('create')}>Create this Dataset</button> */}
        <FormPopup label='Create this Dataset' ref={datasetNameRef} handleSubmit={handleCreateDataset}/>
      </div>
    </div>
    <Visualization />
    </>
  );
}

export default App;

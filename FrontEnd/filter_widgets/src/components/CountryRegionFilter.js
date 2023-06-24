import './CountryRegionFilter.css'


import Autosuggest from './Autosuggest';
import CountryRegionDisplay from './CountryRegionDisplay';
import BinaryToggle from './BInaryToggle';



function CountryRegionFilter(props){

    const {
        suggestions,onKeyChange,onSuggestionClick,regionInputs,deleteItem,
        regionInputsUse:selectedValue,setRegionInputsUse:setSelectedValue
    } = props;

    console.log('country region filter',selectedValue,props.regionInputsUse);

    // const handleSelection = event=>{
    //     const value = event.target.innerHTML;
    //     props.onCountryRegionChoicesChange(value);
    // }

    return (
        <div className='region-filter-widget'>
              <div className='region-filter-header-container'><div className='region-filter-header'>Country & Region Selector</div></div>
              <div style={{
                width:'100%', textAlign:'left',marginBottom:'0.2cm'
            }}><BinaryToggle selectedValue={selectedValue} setSelectedValue={setSelectedValue}/></div>

              <Autosuggest suggestions={suggestions} onKeyChange={onKeyChange} onSuggestionClick={onSuggestionClick}/>
              <CountryRegionDisplay regionInputs={regionInputs} deleteItem={deleteItem}/>
        </div>
    );
}

export default CountryRegionFilter;
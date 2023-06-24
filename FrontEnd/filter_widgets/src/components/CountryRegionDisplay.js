import './CountryRegionDisplay.css'

import { RiDeleteBinLine } from 'react-icons/ri';

import { useEffect,useState } from 'react';

const isObjectEmpty = (objectName) => {
    return (
      objectName &&
      Object.keys(objectName).length === 0 &&
      objectName.constructor === Object
    );
  };

function CountryRegionDisplay(props){
    
    const[countrySelected, setCountrySelected] = useState(null);
    // console.log("country-region-display");
    useEffect(()=>{
        if(countrySelected ===null){
            const countries = Object.keys(props.regionInputs);
            // console.log(props.regionInputs);
            if(countries.length>0)
                setCountrySelected(countries[0]);
        }
        // console.log(props.regionInputs);
        // console.log('useEffect',countrySelected)
    });
    // console.log('countrySelected',countrySelected)
    const handleCountrySelected = (event)=>{
        const index = event.target.id.split('-')[2];
        // console.log(index);
        if(index==='delete') {//delete button was clicked
            return; 
        }

        console.log('hehrerher',event.target,index)
        setCountrySelected(index);
    }

    const deleteRegion = (event)=>{
        console.log('deleteRegion',event.target);
        // const value = event.currentTarget.id.split('-')[3];
        // const region = value.split(',')[0];
        // const country = value.split(',')[1];
        if(props.regionInputs[countrySelected].length===1){
            setCountrySelected(null);
        }
        props.deleteItem(event.currentTarget.id.split('-')[3]+','+countrySelected);
    }
    const deleteCountry = (event)=>{
        setCountrySelected(null);
        console.log(event.target);
        props.deleteItem(event.currentTarget.id.split('-')[3]);
    }

    return(
        <div className='country-region-display'>
            <div className='country-list-container'>
            <div className='country-list-header'>Countries:</div>
                {!isObjectEmpty(props.regionInputs)&& Object.keys(props.regionInputs).map((country, index)=>{
                    return(
                        <div key={index} 
                            className={`country-item${(country===countrySelected)?' selected':''}`} 
                            id={`country-item-${country}`} 
                            onClick={handleCountrySelected}
                        >
                            {country}
                            <RiDeleteBinLine className='country-item-delete' onClick={deleteCountry} id={`country-item-delete-${country}`} />
                        </div>
                    )
                })}
            </div>
            <div className='region-list-container'>
                <div className='region-list-header'>Regions:</div>
                {!isObjectEmpty(props.regionInputs) && countrySelected? 
                    <table style={{}}><tbody>
                    {console.log(countrySelected, props.regionInputs)}
                        {props.regionInputs[countrySelected].map((region, index)=>{
                            return(
                                <tr key={index}><td>
                                <div key={index} className='region-item' id={`region-item-${index}`} >
                                    {region}
                                    <RiDeleteBinLine className='region-item-delete' onClick={deleteRegion} id={`region-item-delete-${region}`} />
                                </div>
                                </td></tr>
                            )
                        })}
                    </tbody>
                    </table>
                    :null
                }
            </div>


        </div>
    )
}

export default CountryRegionDisplay;

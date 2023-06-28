import './BinaryToggle.css'

import { Box, FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { styled } from '@mui/system';

const width_option = 4;//cm
const StyledFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
    width: `${width_option}cm`, // Fixed width for the labels
    padding: theme.spacing(1.5),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: '#f5f5f5',
    '&.Mui-focused': {
      backgroundColor: '#e0e0e0',
    },
    //set font size
    '& .MuiFormControlLabel-label': {
        fontSize: '0.3cm',
    },
  }));



function BinaryToggle(props){

    const {selectedValue,setSelectedValue} = props;

    let {labels, values} = props;
    if(!labels) labels = ['Include','Exclude'];
    if(!values) values = ['include','exclude'];

    const handleSelectedValueChange = (event) => {
        setSelectedValue(event.target.value);
    };
    const height=0.7;//cm
    // console.log('BinaryToggle',selectedValue);
    return (
        <>
            {selectedValue && <div className='custom-binary-toggle-container' style={{
                width: `${width_option*2.1}cm`,
            }}>
                <FormControl component="fieldset">
                    <RadioGroup
                        name="exclusiveChoices"
                        value={selectedValue}
                        onChange={handleSelectedValueChange}
                        style={{ display: 'flex' }}
                    >
                        <Box sx={{ display: 'flex' , height:`${height}cm`}}>

                        <StyledFormControlLabel
                            value={values[0]}//include
                            control={<Radio />}
                            label={labels[0]}//with them
                        />
                        <StyledFormControlLabel
                            value="exclude"
                            control={<Radio />}
                            label={labels[1]}
                        />
                        </Box>
                    </RadioGroup>
                </FormControl>
            </div>}
        </>
    );
}
export default BinaryToggle;
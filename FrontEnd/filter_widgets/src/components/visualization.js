import './visualization.css'

import React from 'react';
import { ResponsiveBar } from '@nivo/bar';
import {ResponsiveLine, Axis} from '@nivo/line'

const countryRegionStat = JSON.parse(document.getElementById('country-region-stat').innerHTML);
const expressionStat = JSON.parse(document.getElementById('expression-stat').innerHTML);
const dateRangeStat = JSON.parse(document.getElementById('dateRange-stat').innerHTML);

import VisPlaceholder from './vis_placeholder';

function Visualization({ data }) {
  // Transform the data into the format expected by ResponsiveBar
  
  return (<div style={{overflow:'auto'}}>
    <div className="visualization-container">
        <div >
                <div className="visualization-label">
                    <h4>Country Region Visualization</h4>
                </div>
                <div>
                  {getCountryRegionVisualization() || <VisPlaceholder label="Country Region Visualization"/>}
                </div>
        </div>
        <div >
              <div className="visualization-label">
                  <h4>Expression Type Visualization</h4>
              </div>
          {getExpressionTypeVisualization() || <VisPlaceholder label="Expression Type Visualization"/>}
        </div>
        <div >
          <div className="visualization-label">
            <h4>Date Range Visualization</h4>            
          </div>
          {getDateRangeVisualization() || <VisPlaceholder label="Date Range Visualization"/>}
        </div>
    </div>
    </div>
  );
}

export default Visualization;

function getCountryRegionVisualization(){
    if (!countryRegionStat) {
        return null;
      } 
      const numCountries = Object.keys(countryRegionStat).length;
      const allRegions = Object.values(countryRegionStat).flatMap((region_data) => Object.keys(region_data));
      const uniqueRegions = [...new Set(allRegions)];
    
      // Transform the data into the format expected by ResponsiveBar
      const transformedData = Object.entries(countryRegionStat).map(([country, regions_data]) => {
        const regionValues = uniqueRegions.map((region) => regions_data[region] || 0);
        const totalValue = regionValues.reduce((sum, value) => sum + value, 0);
        return {
          country,
          ...regions_data,
          total: totalValue,
        };
      });
    // console.log('CR transformedData', transformedData)
    if (transformedData.length === 0) return null;
       // Calculate the width of each bar
       const barWidth = 2.5; // Set the desired width of each bar in cm
       const tickValues = uniqueRegions.map((_, index) => index + 1);
      return (
            <div className="country-region-visualization-container" style={{width:`${numCountries*barWidth+2}cm`}}>
                <ResponsiveBar
                data={transformedData}
                keys={uniqueRegions}
                indexBy="country"
                margin={{ top: 50, right: 60, bottom: 80, left: 60 }}
                padding={0.3}
                valueScale={{ type: 'linear' }}
                indexScale={{ type: 'band', round: true }}
                colors={{ scheme: 'nivo' }}
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 30,
                    tickTextAnchor: 'middle', // Center the tick labels horizontally
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    tickValues,
                    legend: 'regions',
                    legendPosition: 'middle',
                    legendOffset: -40,
                    tickLabelComponent: ({ formattedValue, innerWidth, innerHeight, textAnchor, ...rest }) => (
                        <g transform={`translate(${innerWidth / 2}, 0)`} {...rest}>
                        <text
                            textAnchor={textAnchor}
                            dominantBaseline="middle"
                            style={{
                            fontSize: 12,
                            maxWidth: 100,
                            whiteSpace: 'pre-wrap',
                            }}
                        >
                            {formattedValue}
                        </text>
                        </g>
                    ),
                }}
                // Rest of the configuration options...
                />
            </div>
    );    
}

function getExpressionTypeVisualization(){

    if (!expressionStat) return null;

    const simple_num = expressionStat.simple;
    let allSections = Object.values(expressionStat).flatMap((section_data) => Object.keys(section_data));
    allSections.unshift('only')
    // console.log(allSections)
    const uniqueSections = [...new Set(allSections)];
    // console.log(uniqueSections,typeof uniqueSections)
    
    
    const expressionStat2 = {...expressionStat}
    //remove simple from expressionStat2
    delete expressionStat2.simple;
    // Transform the data into the format expected by ResponsiveBar
    let transformedData1 = Object.entries(expressionStat2).map(([ex_char, ex_char_connections]) => {
        const sectionValues = uniqueSections.map((ex_ch) => ex_char_connections[ex_ch] || 0);
        const totalValue = sectionValues.reduce((sum, value) => sum + value, 0);
        return {
            operator: ex_char,
            ...ex_char_connections,
            total: totalValue,
        };
    });
    transformedData1.unshift({operator:'simple',only:simple_num,total:simple_num})
    
    //delete all o keys in transformedData
    const transformedData = transformedData1.map((item) => {
        //delete all entries in item with 0 values
        Object.keys(item).forEach((key) => (item[key] === 0) && delete item[key]);
        return item;
    }).filter((item) => Object.keys(item).length > 1);
    // uniqueSections.delete('only')


    const numOperators = transformedData.length;
    // Calculate the width of each bar
    const barWidth = 2.5; // Set the desired width of each bar in cm
    const tickValues = uniqueSections.map((_, index) => index + 1);

    // console.log('eT transformedData',transformedData)
    if (transformedData.length === 0) return null;

    return <div className="expression-type-visualization-container" style={{width:`${numOperators*barWidth+2}cm`}}>
            <ResponsiveBar
            data={transformedData}
            keys={uniqueSections}
            indexBy="operator"
            margin={{ top: 50, right: 60, bottom: 80, left: 60 }}
            padding={0.3}
            valueScale={{ type: 'linear' }}
            indexScale={{ type: 'band', round: true }}
            colors={{ scheme: 'nivo' }}
            axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 30,
                tickTextAnchor: 'middle', // Center the tick labels horizontally
            }}
            axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                tickValues,
                legend: 'regions',
                legendPosition: 'middle',
                legendOffset: -40,
                tickLabelComponent: ({ formattedValue, innerWidth, innerHeight, textAnchor, ...rest }) => (
                    <g transform={`translate(${innerWidth / 2}, 0)`} {...rest}>
                    <text
                        textAnchor={textAnchor}
                        dominantBaseline="middle"
                        style={{
                        fontSize: 12,
                        maxWidth: 100,
                        whiteSpace: 'pre-wrap',
                        }}
                    >
                        {formattedValue}
                    </text>
                    </g>
                ),
            }}
            // Rest of the configuration options...
            />
        </div>
}

function getDateRangeVisualization(){

    if (!dateRangeStat) return null;

    const minYValue = Math.min(...Object.values(dateRangeStat));
    const transformedData = Object.entries(dateRangeStat).map(([date, count]) => ({
        x:(new Date(date)).toISOString().split('T')[0],
        y:count,
      }));

      // console.log('DT transformedData',transformedData)
      if (transformedData.length === 0) return null;
      
    const numDates = transformedData.length;
// Calculate the width of each bar
    const lineWidth = 2.5; // Set the desired width of each bar in cm
    // const tickValues = uniqueSections.map((_, index) => index + 1);
      return <div className="date-range-visualization-container" style={{width:`${numDates*lineWidth+2}cm`}}>
     <ResponsiveLine
    data={[{ id: 'count', data: transformedData }]}
    margin={{ top: 50, right: 60, bottom: 80, left: 60 }}
    xScale={{ type: 'point' }}
    yScale={{
      type: 'linear',
      min: '0',
      max: 'auto',
      stacked: false,
      reverse: false,
    }}
    axisBottom={{
      legend: 'Date',
      legendOffset: 36,
      legendPosition: 'middle',
    }}
    axisLeft={{
      legend: 'Count',
      legendOffset: -40,
      legendPosition: 'middle',
      tickValues: 5, // Set the desired tick values on the y-axis
    }}
    enableGridX={false}
    colors={{ scheme: 'category10' }}
    enablePoints={true}
    enableGridY={true}
    curve="linear"
    enableArea={true}
    areaOpacity={0.3}
    enableCrosshair={false}
    useMesh={true}
    // Customize other props as needed
    yFormat={value => Math.round(value)} // Format the y-axis labels as integers
    enableSlices="x"
    sliceTooltip={({ slice }) => (
      <div>
        <strong>{slice.points[0].data.x}</strong>
        <br />
        Count: {slice.points[0].data.y}
      </div>
    )}
    areaBaselineValue={0}

  />
        </div>;
}
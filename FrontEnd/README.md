# FrontEnds for User and Admin
## Steps to update frontends
 - Move to this directory in the terminal
 - Run npm run install-all to install all packages
 - Run npm run run-all to watch for changes to both filter_widgets and mathpad_page
 > > This will start monitoring of the respective codes and creation of updated bundled files. The bundled files are automatically placed in static folder of the django backend, so after a reload the changes will be visible in the site hosted by django. 

## mathpad_page
- User interface
- Use the mathpad for recognizing handdrawn expressions
- Submit corrected annotations for incorrect predictions
- View and Rate the Submissions and suggest corrections on other's submissions

## filter_widgets
- Admin interface
  -  filter_widgets/src
    - Dashboard Interface for filtering the collected annotations, viewing stats/graphs and creating a dataset  
  -  filter_widgets/src2
    - /App.js
      - View all created datasets    
    - /spec_dataset/App2.js
      - View a specific dataset, its description and stats/graphs 
  -  filter_widgets/src3
    - /App.js
      - Upload Model repos
      - View all Models 
    - /spec_model/App2.js
      - View specific Model
      - Create dataset for the Model
      - View created datasets
      - Train on any such dataset(click and select train)


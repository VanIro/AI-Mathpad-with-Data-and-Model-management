# FrontEnds for User and Admin
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

Run `npm run dev` in /filter_widgets and /mathpad_page to monitor and update the bundled file. The bundled file is automatically placed in static folder of the django backend, so after a reload the changes will be visible.

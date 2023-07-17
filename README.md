# AI-Mathpad-with-Data-and-Model-management

This project provides the ability to:
- use the interface to recognize handdrawn math expressions, :white_check_mark: 
- submit corrected annotations for mis-predictions,          :white_check_mark:   
- manage the collected data, i.e. filter and view stats,     :white_check_mark:
- upload model repos for training and finetuning,            ✅
- train models on collected data and  manage the models, and ✅
- easily serve a model of choice      🔲

## Features:
- Integration with MlFlow
- Fullstack (Django, React) project
  - Utilizing both django templates and React Components
- Use of multiple processes in backend for handling time consuming tasks without blocking the request-response cycle
- Use of Web worker in frontend for handling computation intensive task(directory compression) without making the browser unresopnsive



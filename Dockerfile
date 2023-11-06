# Backend and Frontend Build (prod)
FROM node:14 as frontend-builder

# Set the working directory for the frontend
WORKDIR /app/frontend

# Copy frontend dependencies definition
COPY ./FrontEnd/package*.json ./
COPY ./FrontEnd/filter_widgets/package*.json ./filter_widgets/
COPY ./FrontEnd/mathpad_page/package*.json ./mathpad_page/

RUN mkdir -p /app/backend/static

# Install frontend dependencies
RUN npm install

# Copy the frontend code
COPY ./FrontEnd .

#install all dependencies for subprojects
RUN npm run install-all
# Build the frontend
RUN npm run build-all

RUN sleep 5     

RUN ls /app/backend/static && sleep 20
RUN ls /app/frontend/mathpad_page && sleep 20

# backend (prod)
FROM python:3.10

# Set environment variables for Python
ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

RUN apt-get update && \
    apt-get install -y libgl1-mesa-glx


# Set the working directory in the container
WORKDIR /app/AIMathpad

# Install virtualenv
RUN pip install virtualenv

# Create a virtual environment named 'djangoLICTenv'
RUN python -m venv djangoLICTenv

# Activate the virtual environment
ENV PATH="/app/AIMathpad/backend/djangoLICTenv/bin:$PATH"

RUN pip install --upgrade pip 


# Copy only the requirements file first
COPY ./backend/requirements.txt /app/AIMathpad/backend/

WORKDIR /app/AIMathpad/backend

# Install any needed packages specified in requirements.txt
RUN pip install -r requirements.txt

# Copy the current directory contents into the container at /app
COPY ./backend /app/AIMathpad/backend

# Copy the built frontend from the frontend-builder stage
COPY --from=frontend-builder /app/backend/static /app/AIMathpad/backend/static

RUN python manage.py makemigrations
RUN python manage.py makemigrations aiMathpad
RUN python manage.py migrate

#Build 


# Expose port 8000 to the outside world
EXPOSE 8000

# Define the command to run on startup
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

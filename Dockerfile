# Backend and Frontend Build (prod)
FROM node:14 as frontend-builder

# Set the working directory for the frontend
WORKDIR /app/FrontEnd

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

ARG CACHEBUST=7
# Build the frontend
RUN npm run build-all
RUN /bin/bash
RUN ls /app/backend/static && sleep 14
RUN ls / && sleep 15
RUN ls && sleep 15

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
ENV PATH="/app/AIMathpad/djangoLICTenv/bin:$PATH"

# Copy only the requirements file first
COPY ./backend/requirements.txt /app/AIMathpad/backend/

WORKDIR /app/AIMathpad/backend

RUN pip install --upgrade pip 
# Install any needed packages specified in requirements.txt
RUN pip install -r requirements.txt

# Install GDAL dependencies
# RUN add-apt-repository ppa:ubuntugis/ppa && apt-get update 

RUN apt-get install -y \
        gdal-bin \
        libgdal-dev \
        python3-gdal \
    && rm -rf /var/lib/apt/lists/*

# If the INTERACTIVE_SHELL build argument is set, launch an interactive shell
# ARG INTERACTIVE_SHELL=true
# RUN if [ "$INTERACTIVE_SHELL" = "true" ]; then /bin/bash; fi

RUN ls /usr && sleep 22
RUN ls /usr/libx32 && sleep 21
RUN ls /usr/lib/x86_64-linux-gnu && sleep 20




# Copy the current directory contents into the container at /app
COPY ./backend /app/AIMathpad/backend

# Copy the built frontend from the frontend-builder stage
COPY --from=frontend-builder /app/backend/static /app/AIMathpad/backend/static

#Build 


# Expose port 8000 to the outside world
EXPOSE 8000
EXPOSE 5000

# Define the command to run on startup
# CMD ["python manage.py makemigrations"," && python manage.py makemigrations aiMathpad", " && python manage.py migrate","python", "manage.py", "runserver", "0.0.0.0:8000"]
# CMD ["python", "manage.py", "makemigrations", "aiMathpad", "&&", "python", "manage.py", "migrate", "&&", "python", "manage.py", "runserver", "0.0.0.0:8000"]
CMD python manage.py collectstatic --noinput && \
    python manage.py makemigrations aiMathpad && \
    python manage.py makemigrations dataAdmin && \
    python manage.py migrate && \
    python manage.py runserver 0.0.0.0:8000



#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys
import subprocess
import threading
from datetime import datetime

def read_output(process, log_file_path):
    with open(log_file_path, 'w', buffering=1) as file:
        for line in iter(process.stdout.readline, b''):
            decoded_line = line.decode().rstrip('\n')
            prefixed_line = '[MlFlow] ' + decoded_line
            print(prefixed_line)
            file.write(decoded_line + '\n')


def run_mlflow_ui(log_file_dir='mlflow_logs'):
    if not os.path.exists(log_file_dir):
        os.mkdir(log_file_dir)
    print('Starting MLFlow UI', end=' ')
    log_file_path = os.path.join(log_file_dir, f'mlflow_ui_{datetime.now().strftime("%Y%m%d%H%M%S")}.log')
    command = 'mlflow ui'
    process = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
    print('| PID:', process.pid)
    
    output_thread = threading.Thread(target=read_output, args=(process, log_file_path))
    output_thread.start()
    # process = subprocess.Popen(command, shell=True, stdout=file)
    # print('| PID:', process.pid)

def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend2.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    # Check if the runserver command is passed
    if len(sys.argv) > 1 and sys.argv[1] == 'runserver':
        # print(sys.argv, os.environ.get('RUN_MAIN'))
        if os.environ.get('RUN_MAIN') != 'true':
            run_mlflow_ui()
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()

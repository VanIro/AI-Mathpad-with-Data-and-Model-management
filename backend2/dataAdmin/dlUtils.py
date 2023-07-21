import subprocess

def create_dataset(dataset_path, repo_path, out_path):
    command = f'cd "{repo_path}" && python prepare_dataset.py --dataset "{dataset_path}" --repoPath "{repo_path}" --outPath "{out_path}"'
    print(command)
    result = subprocess.run(command, shell=True, capture_output=True, text=True)

    if result.returncode == 0:
        print("Prepare Dataset Command executed successfully.")
        print('-->\n',result.stdout)
        return 0
    else:
        print("Prepare Dataset Command execution failed. Error output:")
        print(result.stderr)
        print('-->\n',result.stdout)
        return 1
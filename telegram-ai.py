import os
import subprocess
from dotenv import load_dotenv

# Get the name of the .env file from an environment variable
env_config = os.getenv('ENV_CONFIG', 'default')
env_file_path = f"/srv/telegram-ai/env/.env.{env_config}"

# Load the specified .env file
if os.path.exists(env_file_path):
    print(f"Loading environment variables from {env_file_path}")
    load_dotenv(dotenv_path=env_file_path)
else:
    print(f"No environment configuration file found for {env_config}, using default settings")

# Start the Node.js application
subprocess.run(["npm", "start"])
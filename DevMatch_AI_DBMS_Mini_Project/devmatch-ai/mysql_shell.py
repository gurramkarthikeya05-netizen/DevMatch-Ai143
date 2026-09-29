"""Open an interactive MySQL client using the project's local .env connection."""

import os
import shutil
import subprocess
import sys
from pathlib import Path
from urllib.parse import unquote, urlparse

from dotenv import dotenv_values

project = Path(__file__).resolve().parent
database_url = dotenv_values(project / ".env").get("DATABASE_URL")
if not database_url:
    raise SystemExit("Set DATABASE_URL in the project's .env file first.")

connection = urlparse(database_url)
if connection.scheme != "mysql+pymysql":
    raise SystemExit("DATABASE_URL must use mysql+pymysql://.")

client = shutil.which("mysql")
if not client:
    portable_client = project.parents[1] / "mysql-local" / "mysql-8.4.11-winx64" / "bin" / "mysql.exe"
    if portable_client.is_file():
        client = str(portable_client)
if not client:
    raise SystemExit("MySQL command-line client not found. Install MySQL or add mysql.exe to PATH.")

environment = os.environ.copy()
environment["MYSQL_PWD"] = unquote(connection.password or "")
command = [
    client,
    "--host", connection.hostname or "127.0.0.1",
    "--port", str(connection.port or 3306),
    "--user", unquote(connection.username or ""),
    unquote(connection.path.lstrip("/")),
    *sys.argv[1:],
]
raise SystemExit(subprocess.run(command, env=environment, check=False).returncode)

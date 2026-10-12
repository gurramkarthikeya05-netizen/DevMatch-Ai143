"""Start the existing portable MySQL database before running local Flask."""

import os
import socket
import subprocess
import sys
import time
from pathlib import Path
from urllib.parse import unquote, urlparse

import pymysql
from dotenv import load_dotenv


PROJECT = Path(__file__).resolve().parent
MYSQL_ROOT = PROJECT.parents[1] / 'mysql-local'


def port_open(host, port):
    try:
        with socket.create_connection((host, port), timeout=1):
            return True
    except OSError:
        return False


def main():
    load_dotenv(PROJECT / '.env')
    url = urlparse(os.environ.get('DATABASE_URL', ''))
    if url.scheme != 'mysql+pymysql' or not url.hostname:
        raise RuntimeError('Set DATABASE_URL in .env to your MySQL connection URL.')
    host, port = url.hostname, url.port or 3306
    if not port_open(host, port):
        server = MYSQL_ROOT / 'mysql-8.4.11-winx64' / 'bin' / 'mysqld.exe'
        data = MYSQL_ROOT / 'data'
        if host not in ('127.0.0.1', 'localhost') or port != 3307:
            raise RuntimeError('Start the MySQL server configured in .env, then try again.')
        if not server.is_file() or not (data / 'ibdata1').is_file():
            raise RuntimeError('The existing portable MySQL installation or database is missing.')
        log_path = MYSQL_ROOT / 'startup.log'
        with log_path.open('ab') as log:
            process = subprocess.Popen(
                [str(server), '--no-defaults',
                 f'--basedir={server.parents[1].as_posix()}',
                 f'--datadir={data.as_posix()}', '--port=3307',
                 '--bind-address=127.0.0.1', '--mysqlx=OFF', '--console'],
                stdout=log, stderr=subprocess.STDOUT,
                creationflags=subprocess.CREATE_NO_WINDOW if os.name == 'nt' else 0,
            )
        print('Starting local MySQL...', flush=True)
        deadline = time.monotonic() + 30
        while not port_open(host, port):
            if process.poll() is not None or time.monotonic() >= deadline:
                raise RuntimeError(f'MySQL did not start. See {log_path}')
            time.sleep(0.5)
    # Check the saved account and database before launching the website.
    connection = pymysql.connect(
        host=host, port=port, user=unquote(url.username or ''),
        password=unquote(url.password or ''), database=unquote(url.path.lstrip('/')),
        connect_timeout=5,
    )
    connection.close()
    print(f'MySQL is ready on {host}:{port}.', flush=True)
    if '--check' in sys.argv:
        return 0
    if port_open('127.0.0.1', 5000):
        print('Port 5000 is already in use. If Flask is running, refresh http://127.0.0.1:5000.')
        return 0
    return subprocess.call(
        [sys.executable, '-m', 'flask', '--app', 'app', 'run', '--debug'], cwd=PROJECT,
    )


if __name__ == '__main__':
    try:
        raise SystemExit(main())
    except (RuntimeError, OSError, ValueError, pymysql.MySQLError) as error:
        print(f'Startup failed: {error}', file=sys.stderr)
        raise SystemExit(1)

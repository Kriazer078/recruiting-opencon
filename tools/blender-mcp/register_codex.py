"""Register only this MCP entry in the desktop user's known config file."""
from pathlib import Path
import shutil
import tomllib

target=Path('C:/Users/User.DESKTOP-T27SALG/.codex/config.toml')
backup=target.with_name('config.toml.pre-blender-20261005.bak')
current=target.read_bytes()
parsed=tomllib.loads(current.decode('utf-8-sig'))
if 'blender' not in parsed.get('mcp_servers', {}):
    if not backup.exists():
        shutil.copy2(target, backup)
    stanza='''

[mcp_servers.blender]
command = "C:/Users/User.DESKTOP-T27SALG/Downloads/project/Recruingsite/tools/blender-mcp/uvx.exe"
args = ["--cache-dir", "C:/Users/User.DESKTOP-T27SALG/Downloads/project/Recruingsite/tools/blender-mcp/cache", "--python", "C:/Users/User.DESKTOP-T27SALG/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe", "mcp-for-blender==2.1.3"]
enabled = true
startup_timeout_sec = 60

[mcp_servers.blender.env]
DISABLE_TELEMETRY = "true"
PYTHONUTF8 = "1"
BLENDER_MCP_SAFE_MODE = "1"
BLENDER_HOST = "127.0.0.1"
BLENDER_PORT = "9876"
'''
    tomllib.loads(current.decode('utf-8-sig') + stanza)
    with target.open('ab') as output:
        output.write(stanza.encode('utf-8'))
entry=tomllib.loads(target.read_text(encoding='utf-8-sig'))['mcp_servers']['blender']
print('REGISTERED_CONFIG=' + str(target))
print('BLENDER_ENABLED=' + str(entry.get('enabled', True)))

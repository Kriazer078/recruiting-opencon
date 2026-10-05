"""Fetch the official portable uv release and pin the MCP-for-Blender package."""
from pathlib import Path
from urllib.request import Request, urlopen
import hashlib
import json
import zipfile
import io

root = Path(__file__).resolve().parent
root.mkdir(parents=True, exist_ok=True)
headers = {'User-Agent': 'OpenConsulting-local-setup', 'Accept': 'application/vnd.github+json'}
def fetch(url):
    with urlopen(Request(url, headers=headers), timeout=60) as response:
        return response.read()

release = json.loads(fetch('https://api.github.com/repos/astral-sh/uv/releases/latest'))
asset = next(a for a in release['assets'] if a['name'] == 'uv-x86_64-pc-windows-msvc.zip')
archive = fetch(asset['browser_download_url'])
digest = hashlib.sha256(archive).hexdigest()
if asset.get('digest') and asset['digest'] != 'sha256:' + digest:
    raise RuntimeError('Portable uv release checksum mismatch')
with zipfile.ZipFile(io.BytesIO(archive)) as package:
    for member in package.infolist():
        name = Path(member.filename).name
        if name in ('uv.exe', 'uvx.exe'):
            (root / name).write_bytes(package.read(member))
metadata = json.loads(fetch('https://pypi.org/pypi/mcp-for-blender/json'))
version = metadata['info']['version']
manifest = {'uv_version':release['tag_name'],'uv_source':asset['browser_download_url'],
            'uv_sha256':digest,'package':'mcp-for-blender','version':version,
            'package_source':'https://pypi.org/project/mcp-for-blender/',
            'maintainer_source':'https://github.com/ahujasid/mcp-for-blender',
            'created':'2026-10-05'}
(root / 'install-manifest.json').write_text(json.dumps(manifest, indent=2), encoding='utf-8')
print(json.dumps(manifest, indent=2))

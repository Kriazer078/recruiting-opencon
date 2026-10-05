"""Confirm the requested MCP connection with a read-only scene query."""
import asyncio
import os
from pathlib import Path
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

root = Path(__file__).resolve().parent
python = 'C:/Users/User.DESKTOP-T27SALG/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe'

async def main():
    env = dict(os.environ, DISABLE_TELEMETRY='true', PYTHONUTF8='1',
               BLENDER_MCP_SAFE_MODE='1', BLENDER_HOST='127.0.0.1', BLENDER_PORT='9876')
    params = StdioServerParameters(command=str(root / 'uvx.exe'),
        args=['--cache-dir', str(root / 'cache'), '--python', python, 'mcp-for-blender==2.1.3'], env=env)
    async with stdio_client(params) as (read, write):
        async with ClientSession(read, write) as client:
            initialized = await client.initialize()
            listing = await client.list_tools()
            names = [tool.name for tool in listing.tools]
            if 'get_scene_info' not in names:
                raise RuntimeError('Expected scene info tool is absent')
            scene = await client.call_tool('get_scene_info', {'user_prompt':'Read-only connection check for the local Blender bridge.'})
            if scene.isError:
                raise RuntimeError(str(scene.content))
            print('MCP_SERVER=' + initialized.serverInfo.name)
            print('TOOL_COUNT=' + str(len(names)))
            print('READ_ONLY_SCENE_QUERY=OK')
            (root / 'connection-status.txt').write_text(
                '2026-10-05\nMCP initialized; list_tools succeeded; get_scene_info succeeded.\n'
                'Addon enabled in Blender 5.2.2. Port 127.0.0.1:9876.\n'
                'Codex registered. Restart Codex to load tools in a new app session.\n', encoding='utf-8')

asyncio.run(asyncio.wait_for(main(), timeout=35))

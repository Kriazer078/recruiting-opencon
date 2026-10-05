"""Enable only the requested Blender addon, preserving existing preferences."""
import bpy
import addon_utils
from pathlib import Path
import shutil

pref = Path(bpy.utils.user_resource('CONFIG')) / 'userpref.blend'
backup = pref.with_name('userpref.blend.pre-openconsulting-mcp-20261005.bak')
if pref.exists() and not backup.exists():
    shutil.copy2(pref, backup)
bpy.utils.refresh_script_paths()
addon_utils.modules(refresh=True)
module = addon_utils.enable('blender_mcp', default_set=True, persistent=True)
if module is None:
    raise RuntimeError('Could not enable blender_mcp')
bpy.ops.wm.save_userpref()
print('OPENCONSULTING_MCP_ADDON_ENABLED=' + str(addon_utils.check('blender_mcp')))


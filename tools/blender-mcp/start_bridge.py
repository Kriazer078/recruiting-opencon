"""Start the Blender side of the bridge on the loopback interface."""
import bpy
import blender_mcp

def start():
    existing = getattr(bpy.types, 'blendermcp_server', None)
    if existing and existing.running:
        return None
    server = blender_mcp.BlenderMCPServer(host='127.0.0.1', port=9876)
    server.start()
    bpy.types.blendermcp_server = server
    bpy.context.scene.blendermcp_server_running = True
    print('OPENCONSULTING_BLENDER_BRIDGE=127.0.0.1:9876')
    return None

bpy.app.timers.register(start, first_interval=1.0)

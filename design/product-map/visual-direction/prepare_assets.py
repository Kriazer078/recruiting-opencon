"""Copy existing brand assets and obtain fonts from Google Fonts' source repository."""
from pathlib import Path
from urllib.request import Request, urlopen
import json
import shutil
from fontTools.ttLib import TTFont

root = Path(__file__).resolve().parent
workspace = root.parents[2]
assets = root / 'assets'
assets.mkdir(exist_ok=True, parents=True)
shutil.copyfile(workspace / 'prototypes/assets/brand.png', assets / 'logo-white.png')
shutil.copyfile(workspace / 'presentation/notebooklm-kit/visuals/LOGO_BLACK.png', assets / 'logo-black.png')
headers={'User-Agent':'OpenConsulting-design-research','Accept':'application/vnd.github+json'}
def read(url):
    with urlopen(Request(url,headers=headers),timeout=45) as response:
        return response.read()

manifest=[]
for family, folder, output in [('Manrope','manrope','manrope.ttf'),('IBM Plex Sans','ibmplexsans','ibm-plex-sans.ttf')]:
    listing=json.loads(read('https://api.github.com/repos/google/fonts/contents/ofl/' + folder))
    font=next(v for v in listing if v['name'].endswith('.ttf') and 'Italic' not in v['name'])
    target=assets/output
    target.write_bytes(read(font['download_url']))
    licence=next(v for v in listing if v['name']=='OFL.txt')
    (assets/(folder+'-OFL.txt')).write_bytes(read(licence['download_url']))
    cmap=TTFont(target).getBestCmap()
    sample='ӘҒҚҢӨҰҮҺІәғқңөұүһіİıĞğŞşÇçÖöÜüЁёЫыЯя'
    missing=[ch for ch in sample if ord(ch) not in cmap]
    manifest.append({'family':family,'source':font['download_url'],'repository':'https://github.com/google/fonts/tree/main/ofl/'+folder,
                     'local':output,'sample':sample,'missing_characters':missing,'licence':'SIL Open Font License'})
(root/'ASSET_SOURCES.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(manifest,ensure_ascii=False,indent=2))

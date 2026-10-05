"""Download the user-requested, licensed real photograph for local design studies."""
from pathlib import Path
from urllib.request import urlopen, Request
import json

ROOT = Path(__file__).resolve().parent
photos = [{
    'file': 'service.jpg',
    'url': 'https://images.pexels.com/photos/4350080/pexels-photo-4350080.jpeg',
    'page': 'https://www.pexels.com/photo/calm-waitress-with-plate-serving-restaurant-guest-4350080/',
    'author': 'Ketut Subiyanto',
    'published': '2020-05-08',
    'licence': 'https://www.pexels.com/license/',
    'use': 'Stock photograph of restaurant service for layout discussion; not a partner or candidate.'
}, {
    'file': 'employee.jpg',
    'url': 'https://images.pexels.com/photos/3801426/pexels-photo-3801426.jpeg',
    'page': 'https://www.pexels.com/photo/cheerful-black-waitress-standing-at-counter-3801426/',
    'author': 'Andrea Piacquadio',
    'published': '2020-02-24',
    'licence': 'https://www.pexels.com/license/',
    'use': 'Real stock portrait for the static example of video-question UI; not an actual applicant or video.'
}]
for item in photos:
    destination = ROOT / 'assets' / item['file']
    destination.parent.mkdir(parents=True, exist_ok=True)
    if not destination.exists():
        with urlopen(Request(item['url'], headers={'User-Agent':'Mozilla/5.0'}), timeout=60) as response:
            destination.write_bytes(response.read())
    print(item['file'], destination.stat().st_size, 'bytes')
(ROOT/'PHOTO_SOURCES.json').write_text(json.dumps(photos, ensure_ascii=False, indent=2), encoding='utf-8')

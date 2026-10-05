from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from PIL import Image
import pypdfium2 as pdfium

root = Path(__file__).resolve().parent
pdfmetrics.registerFont(TTFont('Arial', 'C:/Windows/Fonts/arial.ttf'))
pdfmetrics.registerFont(TTFont('ArialBold', 'C:/Windows/Fonts/arialbd.ttf'))
items = [
 ('LOGO_BLACK.png', 'Логотип на светлом фоне', 'Açık arka plan için logo', 'Оригинальный логотип. Сохранять пропорции.', 'Orijinal logo. En-boy oranını koruyun.'),
 ('LOGO_WHITE.png', 'Логотип на тёмном фоне', 'Koyu arka plan için logo', 'Оригинальный логотип. Сохранять пропорции.', 'Orijinal logo. En-boy oranını koruyun.'),
 ('HOME_DESKTOP.png', 'Главная страница на компьютере', 'Bilgisayarda ana sayfa', 'Предварительный интерфейс.', 'Ön tasarım.'),
 ('HOME_MOBILE.png', 'Главная страница на телефоне', 'Telefonda ana sayfa', 'Предварительный интерфейс.', 'Ön tasarım.'),
 ('JOBS_DEMO.png', 'Пример вакансий', 'İş ilanı örnekleri', 'Компании, зарплаты и условия демонстрационные.', 'Şirketler, ücretler ve koşullar örnektir.'),
 ('EMPLOYER_DEMO.png', 'Пример откликов для работодателя', 'İşveren için başvuru örnekleri', 'Анкеты и сведения кандидатов демонстрационные.', 'Aday profilleri ve bilgileri örnektir.'),
 ('VIDEO_FORMAT_ILLUSTRATION.png', 'Иллюстрация видеоанкеты', 'Video profil formatı', 'Созданная иллюстрация. Это не реальный кандидат.', 'Oluşturulmuş bir görsel. Gerçek bir aday değildir.'),
 ('LAPTOP_ASSET.png', 'Визуал ноутбука для макета', 'Tasarım için dizüstü bilgisayar görseli', 'Вспомогательное созданное изображение, не экран продукта.', 'Oluşturulmuş yardımcı görsel, ürün ekranı değildir.'),
]
target = root / '04_VISUAL_MATERIALS.pdf'
c = canvas.Canvas(str(target), pagesize=(1200, 900))
c.setTitle('Open Consulting - Visual source materials for NotebookLM')
c.setAuthor('Open Consulting')
for name, ru, tr, ru_note, tr_note in items:
 dark = name == 'LOGO_WHITE.png'
 c.setFillColorRGB(*( (0.125, 0.133, 0.149) if dark else (1, 1, 1) ))
 c.rect(0, 0, 1200, 900, fill=1, stroke=0)
 c.setFillColorRGB(*( (1, 1, 1) if dark else (0.125, 0.133, 0.149) ))
 c.setFont('ArialBold', 25)
 c.drawString(48, 848, ru)
 c.setFont('Arial', 19)
 c.drawString(48, 817, tr)
 file = root / 'visuals' / name
 with Image.open(file) as im:
  iw, ih = im.size
 scale = min(1104 / iw, 686 / ih)
 w, h = iw * scale, ih * scale
 c.drawImage(str(file), (1200-w)/2, 110+(686-h)/2, width=w, height=h, mask='auto')
 c.setFont('Arial', 17)
 c.drawString(48, 66, ru_note)
 c.drawString(48, 40, tr_note)
 c.showPage()
c.save()
review = root / '.pdf-preview'
review.mkdir(exist_ok=True)
doc = pdfium.PdfDocument(str(target))
for i in range(len(doc)):
 doc[i].render(scale=1).to_pil().save(review / f'page-{i+1}.png')
assert len(doc) == 8
print(f'Created PDF with {len(doc)} pages: {target}')

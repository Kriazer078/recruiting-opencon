"""Preserve the provided DOCX and append its body, in order, to the canonical MD."""
from pathlib import Path
from hashlib import sha256
from shutil import copyfile
from docx import Document
from docx.oxml.ns import qn
from docx.text.paragraph import Paragraph
from docx.table import Table

ROOT = Path(__file__).resolve().parents[2]
SOURCE = Path('C:/Users/User.DESKTOP-T27SALG/Downloads/TZ_OpenConsulting_platforma_Turciya_v1.1.docx')
DEST = ROOT / 'docs/requirements/source'
TARGET = ROOT / 'TZ_OPEN_CONSULTING_V1_1.md'
MARKER = '<!-- DOCX_BODY_START -->'

DEST.mkdir(parents=True, exist_ok=True)
original = SOURCE.read_bytes()
original_hash = sha256(original).hexdigest()
copy = DEST / SOURCE.name
if SOURCE.resolve() == copy.resolve():
    raise ValueError('The source and destination must differ')
copyfile(SOURCE, copy)
doc = Document(copy)
blocks = []
expected = []
paragraph_count = 0
table_count = 0
row_count = 0

def cell_text(value):
    return value.replace('|', '\\|').replace('\n', '<br>')

for child in doc.element.body:
    if child.tag == qn('w:p'):
        p = Paragraph(child, doc)
        value = p.text.strip()
        if not value:
            continue
        expected.append(value)
        paragraph_count += 1
        style = p.style.name if p.style else ''
        if style.startswith('Heading'):
            try:
                level = min(6, int(style.split()[-1]) + 2)
            except ValueError:
                level = 3
            value = '#' * level + ' ' + value
        elif style == 'List Paragraph':
            value = '- ' + value
        blocks.append(value)
    elif child.tag == qn('w:tbl'):
        table = Table(child, doc)
        table_count += 1
        rows = []
        for row in table.rows:
            values = [cell.text.strip() for cell in row.cells]
            expected.extend(v for v in values if v)
            rows.append(values)
            row_count += 1
        if rows:
            lines = ['| ' + ' | '.join(cell_text(v) for v in rows[0]) + ' |']
            lines.append('| ' + ' | '.join('---' for _ in rows[0]) + ' |')
            lines.extend('| ' + ' | '.join(cell_text(v) for v in row) + ' |' for row in rows[1:])
            blocks.append('\n'.join(lines))

body = '\n\n'.join(blocks)
missing = [v for v in expected if cell_text(v) not in body and v not in body]
if missing:
    raise ValueError('Source text not preserved: ' + repr(missing))
existing = TARGET.read_text(encoding='utf-8')
if existing.count(MARKER) != 1:
    raise ValueError('Expected exactly one source marker')
TARGET.write_text(existing.split(MARKER)[0] + MARKER + '\n\n' + body + '\n\n<!-- DOCX_BODY_END -->\n', encoding='utf-8')
copy_hash = sha256(copy.read_bytes()).hexdigest()
if original_hash != copy_hash or sha256(SOURCE.read_bytes()).hexdigest() != original_hash:
    raise ValueError('Source preservation check failed')

metadata = f'''# Происхождение исходного ТЗ

- Дата переноса: 5 октября 2026 года.
- Исходный путь: `{SOURCE.as_posix()}`.
- Исходный документ: **OC-TZ-JOBS-001, версия 1.1 от 4 октября 2026 года**.
- Статус источника: **проект на утверждение заказчиком**.
- Копия в этой папке побайтно совпадает с исходником. Исходник не изменён.
- SHA-256 оригинала и копии: `{original_hash}`.
- Размер: {len(original):,} байт.
- Перенесено непустых абзацев: {paragraph_count}; таблиц: {table_count}; строк таблиц: {row_count}.
- Содержание перенесено в исходном порядке. Заголовки и таблицы адаптированы к Markdown; переносы внутри ячеек обозначены `<br>`.
- Полный перенос и аналитическая часть находятся в [основном файле требований](../../../TZ_OPEN_CONSULTING_V1_1.md).
- Комментарии, сноски и концевые сноски в DOCX не содержат дополнительного текста; вставок и удалений с отслеживанием изменений нет.
- Материалы конфиденциальны, для оценки и разработки. Не размещать исходник и этот разбор на публичном сайте.

Разбор в основном файле отдельно обозначает UX-предложения и вопросы для уточнения. Они не являются утверждёнными дополнениями к исходному ТЗ.
'''
(DEST / 'SOURCE.md').write_text(metadata, encoding='utf-8')
print(f'Preserved source: {copy}')
print(f'Markdown: {TARGET}')
print(f'Converted: {paragraph_count} paragraphs, {table_count} tables, {row_count} table rows')
print(f'Source SHA-256 unchanged: {original_hash}')

"""Validate the downloadable CV is a readable, well-formed two-page PDF."""
from pathlib import Path

import fitz

pdf = Path(__file__).resolve().parents[1] / "dist/hire/assets/Eugen_Skaromny_CV.pdf"
assert pdf.exists() and pdf.stat().st_size > 4000
document = fitz.open(pdf)
assert document.page_count == 2, f"Expected two pages, got {document.page_count}"
all_text = "\n".join(page.get_text("text") for page in document)
required = (
    "EUGEN SKAROMNY", "VODAFONE GROUP", "MEGAFON", "PINKMAN",
    "CREATIVEPEOPLE", "16M", "1M", "2.5x", "2015", "Product"
)
for token in required:
    assert token in all_text, f"Missing ATS-extractable term: {token}"
assert "SKOROMNY" not in all_text.upper()

output_dir = pdf.parents[3] / "artifacts/screenshots"
output_dir.mkdir(parents=True, exist_ok=True)
for index, page in enumerate(document):
    bounds = page.rect
    blocks = page.get_text("blocks")
    for block in blocks:
        left, top, right, bottom = block[:4]
        assert left >= 0 and top >= 0 and right <= bounds.width + 1 and bottom <= bounds.height + 1, \
            f"Text outside PDF page {index + 1}: {block}"
    page.get_pixmap(matrix=fitz.Matrix(1.4, 1.4), alpha=False).save(output_dir / f"cv-page-{index+1}.png")
    print(f"PASS CV page {index+1}: text selectable, bounds within page")
print(f"PASS two-page CV: {len(all_text)} extractable text characters")

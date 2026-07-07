import re

files = [
    "app/page.tsx",
    "app/destinations/page.tsx",
    "app/destinations/[slug]/page.tsx",
    "app/homestay/page.tsx",
    "app/homestay/[area]/page.tsx",
    "app/stay/[id]/page.tsx",
    "app/about/page.tsx",
    "app/contact/page.tsx",
]

pattern = re.compile(
    r'<span\s+style=\{\{.*?\}\}\s*>\s*GooNortheast\s*</span>',
    re.DOTALL
)

logo_img = '''<img
            src="/logo.png"
            alt="GoNortheast"
            style={{ height: "36px", width: "auto", display: "block" }}
          />'''

for fname in files:
    try:
        with open(fname) as f:
            content = f.read()
    except FileNotFoundError:
        print(f"SKIPPED (not found): {fname}")
        continue

    new_content, count = pattern.subn(logo_img, content, count=1)

    if count == 0:
        print(f"NO MATCH FOUND (check manually): {fname}")
        continue

    with open(fname, "w") as f:
        f.write(new_content)

    print(f"UPDATED: {fname}")

print("\nDone.")

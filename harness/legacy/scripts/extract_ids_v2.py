import re
import os

path = r'src\logic\items.js'
if not os.path.exists(path):
    # Try absolute if relative fails
    path = r'd:\github-repository\CyberPoker2077\src\logic\items.js'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Extract IDs inside ITEM_DATA
ids = re.findall(r"id:\s*'([^']+)'", content)

# Also find existing ones in ITEM_ID
# We need to be careful with the split
try:
    item_id_section = content.split('export const ITEM_ID = {')[1].split('}')[0]
    existing_ids = re.findall(r"(\w+):\s*'([^']+)'", item_id_section)
except:
    existing_ids = []

all_ids = set()
for id_val in ids:
    all_ids.add(id_val)
for _, id_val in existing_ids:
    all_ids.add(id_val)

sorted_ids = sorted(list(all_ids))

print("export const ITEM_ID = {")
for id_val in sorted_ids:
    # Key normalization: upper snake case, but handle special chars if any
    key = id_val.upper().replace('-', '_')
    print(f"  {key}: '{id_val}',")
print("}")

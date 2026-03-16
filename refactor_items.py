import re
import os

path = r'src\logic\items.js'
if not os.path.exists(path):
    path = r'd:\github-repository\CyberPoker2077\src\logic\items.js'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Extract IDs from ITEM_DATA to ensure they are in ITEM_ID
id_matches = re.findall(r"id:\s*'([^']+)'", content)
item_id_section_match = re.search(r"export const ITEM_ID = \{([\s\S]+?)\}", content)
if not item_id_section_match:
    print("Could not find ITEM_ID section")
    exit(1)

item_id_section = item_id_section_match.group(1)
existing_keys = re.findall(r"(\w+):", item_id_section)
existing_vals = re.findall(r":\s*'([^']+)'", item_id_section)
val_to_key = dict(zip(existing_vals, existing_keys))

# Add missing IDs to ITEM_ID if any (though I think I added them all)
missing_ids = [id_val for id_val in id_matches if id_val not in val_to_key]
if missing_ids:
    new_section = item_id_section
    for mid in missing_ids:
        key = mid.upper().replace('-', '_')
        if key not in existing_keys:
            new_section += f"  {key}: '{mid}',\n"
            val_to_key[mid] = key
    content = content.replace(item_id_section, new_section)

# 2. Replace id: '...' with id: ITEM_ID....
def replace_id(match):
    id_val = match.group(1)
    if id_val in val_to_key:
        return f"id: ITEM_ID.{val_to_key[id_val]}"
    return match.group(0)

# Replace only inside ITEM_DATA array to avoid accidental matches elsewhere
# Find the ITEM_DATA array
item_data_match = re.search(r"export const ITEM_DATA = \[([\s\S]+?)\];", content)
if item_data_match:
    original_data = item_data_match.group(1)
    # Use re.sub with a regex that looks specifically for id: 'value'
    # We use a non-greedy match to ensure we stay within the object
    updated_data = re.sub(r"id:\s*'([^']+)'", replace_id, original_data)
    content = content.replace(original_data, updated_data)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Update complete")

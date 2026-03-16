import re
import os

path = r'd:\github-repository\CyberPoker2077\src\logic\items.js'
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# 1. Parse ITEM_ID to get mapping
mapping = {}
in_item_id = False
for line in lines:
    if 'export const ITEM_ID = {' in line:
        in_item_id = True
        continue
    if in_item_id:
        if '}' in line and ':' not in line:
            in_item_id = False
            continue
        match = re.search(r'(\w+):\s*\'([^\']+)\'', line)
        if match:
            key, val = match.groups()
            mapping[val] = key

# 2. Add some missing ones if they were renamed
mapping['sad_eyes'] = 'SAD_EYES'
mapping['industrial_showdown_lose_refund'] = 'SAD_EYES'

# 3. Process lines in ITEM_DATA
in_item_data = False
new_lines = []
for line in lines:
    if 'export const ITEM_DATA = [' in line:
        in_item_data = True
        new_lines.append(line)
        continue
    if in_item_data:
        if '];' in line and 'id:' not in line:
            # We assume the last line of ITEM_DATA is ];
            # This is a bit risky but usually true
            # and we check if there is no id: on the same line
            in_item_data = False
            new_lines.append(line)
            continue
        
        # Replace id: '...'
        match = re.search(r"(id:\s*)'([^']+)'", line)
        if match:
            prefix, val = match.groups()
            if val in mapping:
                line = line.replace(f"'{val}'", f"ITEM_ID.{mapping[val]}")
        
    new_lines.append(line)

with open(path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print(f"Processed {len(new_lines)} lines. Mapping size: {len(mapping)}")

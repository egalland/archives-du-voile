#!/usr/bin/env python3
"""Build the web entry point, or an optional single offline file."""
from pathlib import Path
import argparse,base64,json,re
ROOT=Path(__file__).resolve().parents[1]
SRC=ROOT/'src'
parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('--standalone',action='store_true',help='Embed illustrations in dist/Archives_du_Voile.html')
args=parser.parse_args()
html=(SRC/'index.html').read_text()
html=re.sub(r'<link rel="stylesheet" href="(styles/[^\"]+)">',lambda m:'<style>'+(SRC/m[1]).read_text()+'</style>',html)
html=re.sub(r'<script([^>]*) src="(js/[^\"]+)"></script>',lambda m:'<script'+m[1]+'>'+(SRC/m[2]).read_text()+'</script>',html)
for path,mime in json.loads((SRC/'assets.json').read_text()).items():
    target='data:'+mime+';base64,'+base64.b64encode((SRC/path).read_bytes()).decode() if args.standalone else 'src/'+path
    html=html.replace(path,target)
output=ROOT/'dist'/'Archives_du_Voile.html' if args.standalone else ROOT/'index.html'
output.parent.mkdir(parents=True,exist_ok=True)
output.write_text(html)
print(f'Built {output.relative_to(ROOT)} ({output.stat().st_size:,} bytes)')

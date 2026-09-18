import re

with open('frontend/public/landing-pages/kage.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Hero heading
html = re.sub(r'<span class="mask-line"><span>Where stillness</span></span>\s*<span class="mask-line"><span>reveals the</span></span>\s*<span class="mask-line"><span>unseen\.</span></span>', 
'<span class="mask-line"><span>Government</span></span>\n      <span class="mask-line"><span>Schemes made</span></span>\n      <span class="mask-line"><span>accessible.</span></span>', html, flags=re.DOTALL)

# Hero sub
html = re.sub(r'Enter India through its quiet thresholds, where ritual,\s*craft, and memory shape the path\.', 'Enter Adhikar to discover the rights, schemes, and opportunities waiting for you.', html, flags=re.DOTALL)

with open('frontend/public/landing-pages/kage.html', 'w', encoding='utf-8') as f:
    f.write(html)

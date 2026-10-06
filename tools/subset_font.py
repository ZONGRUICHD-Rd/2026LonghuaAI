"""把站酷快乐体裁剪成网页里用到的字（几十 KB），避免依赖国内打不开的 Google Fonts。
用法：python3 tools/subset_font.py 字体目录/kuaile.ttf"""
import pathlib, sys, string
from fontTools import subset

root = pathlib.Path(__file__).resolve().parent.parent
text = ''.join(p.read_text(encoding='utf-8') for p in (root / 'web').glob('*.*') if p.suffix in ('.html', '.js', '.css'))
chars = set(text) | set(string.printable) | set('０１２３４５６７８９，。！？：；、…～“”（）')
out = root / 'web' / 'fonts' / 'kuaile.woff2'
out.parent.mkdir(exist_ok=True)
opts = subset.Options(); opts.flavor = 'woff2'; opts.layout_features = ['*']
font = subset.load_font(sys.argv[1], opts)
s = subset.Subsetter(opts); s.populate(text=''.join(sorted(chars))); s.subset(font)
subset.save_font(font, str(out), opts)
print(out, out.stat().st_size, 'bytes,', len(chars), 'chars')

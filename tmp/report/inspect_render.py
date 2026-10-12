from pathlib import Path
import pypdfium2 as pdfium
from PIL import Image, ImageDraw
import sys
root=Path(r'D:\DBMS_DevApp\tmp\report');f=root/(sys.argv[1] if len(sys.argv)>1 else 'final-1.pdf')
d=pdfium.PdfDocument(f);out=root/f.stem;out.mkdir(exist_ok=True)
imgs=[]
for i,page in enumerate(d):
 im=page.render(scale=1.45).to_pil().convert('RGB');im.save(out/f'page-{i+1}.png')
 text=page.get_textpage().get_text_range().replace('\r','')
 (out/f'page-{i+1}.txt').write_text(text,encoding='utf-8')
 print(i+1,repr(text[:100]),'END',repr(text[-90:]))
 im.thumbnail((260,380));imgs.append(im)
for start in range(0,len(imgs),9):
 sheet=Image.new('RGB',(780,1200),'#dddddd');dr=ImageDraw.Draw(sheet)
 for j,im in enumerate(imgs[start:start+9]):
  x=j%3*260;y=j//3*400;sheet.paste(im,(x,y));dr.text((x+10,y+380),str(start+j+1),fill='black')
 sheet.save(out/f'contact-{start//9+1}.png')

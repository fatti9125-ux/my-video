# Crop every face from the FINAL encoded 4K file (native res) into review grids <outdir>/fin/gNNN.png.
# usage: python3 final_face_audit.py <final.mp4> <outdir> <seconds-between-samples>   (run from the repo root)
import json,os,subprocess,sys,numpy as np
from PIL import Image
import scipy.ndimage as nd
SP=sys.argv[2]; F=json.load(open('src/VP/faces.json'))
# skin palette from each character's neutral sprite (face centre)
cols=[]
for c,d in F.items():
  if c.startswith('_') or '_rect' not in d: continue
  x,y,w,h=d['_rect']
  for k,v in d.items():
    if k.startswith('_') or 'sprite' not in v: continue
    a=np.array(Image.open('public/'+v['sprite']).convert('RGBA'))
    p=a[y+h//2:y+h//2+6, x+w//2-10:x+w//2+10].reshape(-1,4); p=p[p[:,3]>250][:,:3]
    if len(p): cols.append(np.median(p,0))
    break
cols=np.unique(np.round(np.array(cols)/4)*4,axis=0); print(len(cols),'skin colours')
W,H=3840,2160; step=float(sys.argv[3])
p=subprocess.Popen(['ffmpeg','-v','error','-i',sys.argv[1],'-vf',f'fps=1/{step}','-f','rawvideo','-pix_fmt','rgb24','-'],stdout=subprocess.PIPE)
crops=[];i=0
while True:
  b=p.stdout.read(W*H*3)
  if len(b)<W*H*3: break
  fr=np.frombuffer(b,np.uint8).reshape(H,W,3); t=(i+0.5)*step; i+=1
  sm=fr[::4,::4].astype(int); m=np.zeros(sm.shape[:2],bool)
  for c in cols: m|=(np.abs(sm-c).sum(2)<18)
  m=nd.binary_opening(m,iterations=1); lab,n=nd.label(m)
  for j,sl in enumerate(nd.find_objects(lab)):
    ys,xs=sl; hh=(ys.stop-ys.start)*4; ww=(xs.stop-xs.start)*4
    ar=(lab[sl]==j+1).sum()*16
    if ar<15000 or hh>1500 or ww>1500 or not (0.45<hh/ww<2.2) or ar/(hh*ww)<0.4: continue
    sub=sm[sl]; dk=(sub.sum(2)<150).mean()
    eh=sub[:,:].sum(2); 
    if dk<0.01: continue
    y0=max(0,ys.start*4-int(hh*.35)); y1=min(H,ys.stop*4+int(hh*.2)); x0=max(0,xs.start*4-int(ww*.25)); x1=min(W,xs.stop*4+int(ww*.25))
    cr=Image.fromarray(fr[y0:y1,x0:x1]); s=min(1.0,420/max(cr.size)); cr=cr.resize((int(cr.width*s),int(cr.height*s)),Image.LANCZOS)
    crops.append((t,cr))
print(len(crops),'crops')
from PIL import ImageDraw
per=12; os.makedirs(f'{SP}/fin', exist_ok=True)
for g in range(0,len(crops),per):
  G=Image.new('RGB',(4*430,3*450),'white'); d=ImageDraw.Draw(G)
  for k,(t,cr) in enumerate(crops[g:g+per]):
    X=(k%4)*430; Y=(k//4)*450; G.paste(cr,(X,Y+20)); d.text((X+2,Y+2),f'{int(t//60)}:{t%60:04.1f}',fill='red')
  G.save(f'{SP}/fin/g{g//per:03d}.png')

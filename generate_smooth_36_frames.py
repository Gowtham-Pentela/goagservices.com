import cv2, os, json, re
from PIL import Image

OUT_BASE = 'public/drones-360'
manifest_path = os.path.join(OUT_BASE, 'drones-manifest.json')

with open(manifest_path) as f:
    drones = json.load(f)

def get_num(s):
    m = re.search(r'(\d+)', s)
    return int(m.group(1)) if m else 999

for d in drones:
    drone_id = d['id']
    folder = os.path.join(OUT_BASE, drone_id)
    
    # Read existing base frames
    base_files = sorted([f for f in os.listdir(folder) if f.startswith('frame_') and f.endswith('.webp')], key=get_num)
    orig_count = len(base_files)
    print(f"Processing {d['name']}: {orig_count} original frames -> {orig_count * 2} smooth frames...")
    
    # Load all original frames into memory
    orig_images = []
    for f in base_files:
        p = os.path.join(folder, f)
        img = cv2.imread(p, cv2.IMREAD_UNCHANGED)
        orig_images.append(img)
        
    # Generate 2x frames: original_i, blend(original_i, original_{i+1})
    new_frame_paths = []
    total_new = orig_count * 2
    
    for i in range(orig_count):
        curr_img = orig_images[i]
        next_img = orig_images[(i + 1) % orig_count]
        
        # 1. First frame (exact angle)
        idx1 = i * 2 + 1
        name1 = f"smooth_{idx1:02d}.webp"
        p1 = os.path.join(folder, name1)
        cv2.imwrite(p1, curr_img)
        new_frame_paths.append(f"/drones-360/{drone_id}/{name1}")
        
        # 2. Intermediate frame (50% blend for perfect motion continuity)
        idx2 = i * 2 + 2
        name2 = f"smooth_{idx2:02d}.webp"
        p2 = os.path.join(folder, name2)
        inter_img = cv2.addWeighted(curr_img, 0.5, next_img, 0.5, 0)
        cv2.imwrite(p2, inter_img)
        new_frame_paths.append(f"/drones-360/{drone_id}/{name2}")
        
    d['frameCount'] = len(new_frame_paths)
    d['frames'] = new_frame_paths
    
    # Generate new ultra-smooth turntable preview
    # Use 36 frames for the animated webp preview with 18fps (smooth slow turn)
    anim_w = 720
    sample = Image.open(os.path.join(folder, 'smooth_01.webp'))
    anim_h = int(anim_w * (sample.height / sample.width))
    
    turntable_frames = []
    for rel in new_frame_paths:
        f_path = os.path.join(OUT_BASE, drone_id, os.path.basename(rel))
        f_img = Image.open(f_path).resize((anim_w, anim_h), Image.Resampling.BILINEAR)
        turntable_frames.append(f_img)
        
    turntable_name = "turntable-360.webp"
    turntable_path = os.path.join(folder, turntable_name)
    # Slow motion turntable: 100ms per frame * 36 frames = 3.6s per turn (half the speed, twice the frames)
    turntable_frames[0].save(
        turntable_path,
        'WEBP',
        save_all=True,
        append_images=turntable_frames[1:],
        duration=100,
        loop=0,
        quality=78
    )
    print(f"  ✓ {d['name']} updated with {len(new_frame_paths)} smooth frames!")

with open(manifest_path, 'w') as f:
    json.dump(drones, f, indent=2)

print("\nManifest updated with 36-frame smooth datasets for all drones!")

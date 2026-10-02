import os, sys, re, json
from PIL import Image

BASE_DIR = 'Images/ALL DRONES IMAGES,STEP&F3D FILES'
OUT_BASE = 'public/drones-360'
os.makedirs(OUT_BASE, exist_ok=True)

DRONE_CONFIGS = [
    {
        "id": "10x-sprayer",
        "folder": "10X SPREAYINR DRONE",
        "name": "Agrown-10X Sprayer",
        "series": "Hexacopter Workhorse",
        "tagline": "Precision Dual-Arm Micro-Atomization Agricultural Sprayer",
        "category": "Agriculture",
        "payloadType": "Sprayer",
        "specs": {
            "capacity": "10 Litres",
            "sprayWidth": "4 - 6 Metres",
            "efficiency": "1 Acre in 7 Minutes",
            "batteryCost": "₹20 / Acre",
            "maintenanceCost": "₹50 / Acre",
            "flightTime": "18 - 22 Mins",
            "rotorConfig": "Hexacopter (6 Rotors)"
        }
    },
    {
        "id": "10x-spreader",
        "folder": "10X SPREADER DRONE",
        "name": "Agrown-10X Spreader",
        "series": "Granular Delivery",
        "tagline": "High-Velocity Centrifugal Granule & Fertilizer Broadcaster",
        "category": "Agriculture",
        "payloadType": "Spreader",
        "specs": {
            "capacity": "12 Kg Granular Hopper",
            "spreadWidth": "5 - 7 Metres",
            "efficiency": "1 Acre in 5 Minutes",
            "flowRate": "1 - 8 kg/min Adjustable",
            "maintenanceCost": "₹45 / Acre",
            "flightTime": "16 - 20 Mins",
            "rotorConfig": "Hexacopter (6 Rotors)"
        }
    },
    {
        "id": "5x-sprayer",
        "folder": "5X SPREAYING DRONE",
        "name": "Agrown-5X Sprayer",
        "series": "Agile Quadcopter",
        "tagline": "Compact Rapid-Deployment Precision Spraying Drone",
        "category": "Agriculture",
        "payloadType": "Sprayer",
        "specs": {
            "capacity": "5 Litres",
            "sprayWidth": "3 - 4.5 Metres",
            "efficiency": "1 Acre in 10 Minutes",
            "batteryCost": "₹15 / Acre",
            "maintenanceCost": "₹35 / Acre",
            "flightTime": "15 - 18 Mins",
            "rotorConfig": "Quadcopter (4 Rotors)"
        }
    },
    {
        "id": "5x-spreader",
        "folder": "5X SPREADER DRONE",
        "name": "Agrown-5X Spreader",
        "series": "Agile Granular",
        "tagline": "Lightweight High-Uniformity Fertilizer & Seed Broadcaster",
        "category": "Agriculture",
        "payloadType": "Spreader",
        "specs": {
            "capacity": "6 Kg Hopper",
            "spreadWidth": "4 - 5.5 Metres",
            "efficiency": "1 Acre in 8 Minutes",
            "flowRate": "0.5 - 5 kg/min",
            "maintenanceCost": "₹35 / Acre",
            "flightTime": "14 - 17 Mins",
            "rotorConfig": "Quadcopter (4 Rotors)"
        }
    },
    {
        "id": "greaydon-base",
        "folder": "GREAYDON ONLY DRONE IMAGES",
        "name": "Greaydon Industrial Airframe",
        "series": "Modular Heavy-Lift",
        "tagline": "Multi-Utility Aerospace Carbon-Fiber Industrial Airframe",
        "category": "Industrial / Multi-Mission",
        "payloadType": "Modular Base",
        "specs": {
            "maxPayload": "25 - 30 Kg",
            "endurance": "Up to 35 Mins (Empty)",
            "airframe": "3K Twill Carbon Fiber + Aviation Aluminum",
            "windResistance": "Up to 12 m/s (Force 6)",
            "ipRating": "IP65 Weatherproof",
            "flightController": "Triple Redundant Industrial Autopilot",
            "rotorConfig": "Heavy Hexacopter"
        }
    },
    {
        "id": "greaydon-sprayer",
        "folder": "GREAYDON SPREAYING DRONE",
        "name": "Greaydon Heavy Sprayer",
        "series": "Enterprise High-Volume",
        "tagline": "Commercial Heavy-Capacity Multi-Nozzle Agricultural Sprayer",
        "category": "Agriculture / Industrial",
        "payloadType": "Sprayer",
        "specs": {
            "capacity": "20 - 25 Litres",
            "sprayWidth": "6 - 9 Metres",
            "efficiency": "1 Acre in 3.5 Minutes",
            "pumpPressure": "High-Pressure Quad Brushless Pumps",
            "coverage": "Up to 80 Acres / Day",
            "maintenanceCost": "₹50 / Acre",
            "rotorConfig": "Heavy Hexacopter"
        }
    },
    {
        "id": "greaydon-spreader",
        "folder": "GREAYDON SPEADER DRONE",
        "name": "Greaydon Heavy Spreader",
        "series": "Enterprise Broadcaster",
        "tagline": "Industrial-Scale Granular, Pellet & Seed Broadcaster",
        "category": "Agriculture / Industrial",
        "payloadType": "Spreader",
        "specs": {
            "capacity": "25 Kg Heavy-Duty Hopper",
            "spreadWidth": "7 - 11 Metres",
            "efficiency": "1 Acre in 3 Minutes",
            "flowControl": "Smart Weighing & Dynamic Flow Adjustment",
            "coverage": "Up to 100 Acres / Day",
            "rotorConfig": "Heavy Hexacopter"
        }
    }
]

def get_num(s):
    m = re.search(r'(\d+)', s)
    return int(m.group(1)) if m else 999

manifest_list = []

for cfg in DRONE_CONFIGS:
    src_folder = os.path.join(BASE_DIR, cfg['folder'])
    if not os.path.exists(src_folder):
        print(f"Skipping {cfg['folder']} (not found)")
        continue
    
    out_dir = os.path.join(OUT_BASE, cfg['id'])
    os.makedirs(out_dir, exist_ok=True)
    
    raw_files = sorted([f for f in os.listdir(src_folder) if f.endswith('.png')], key=get_num)
    print(f"\nProcessing {cfg['name']} ({len(raw_files)} frames)...")
    
    # 1. Compute global bbox
    min_x, min_y, max_x, max_y = 9999, 9999, 0, 0
    images = []
    for f in raw_files:
        im = Image.open(os.path.join(src_folder, f))
        bb = im.getbbox()
        if bb:
            min_x = min(min_x, bb[0])
            min_y = min(min_y, bb[1])
            max_x = max(max_x, bb[2])
            max_y = max(max_y, bb[3])
        images.append((f, im))
        
    cx = (min_x + max_x) / 2
    half_w = max(cx - min_x, max_x - cx) * 1.06
    cy = (min_y + max_y) / 2
    half_h = (max_y - min_y) * 0.55
    
    crop_x1 = max(0, int(cx - half_w))
    crop_x2 = min(9999, int(cx + half_w))
    crop_y1 = max(0, int(cy - half_h))
    crop_y2 = min(3770, int(cy + half_h))
    
    crop_w = crop_x2 - crop_x1
    crop_h = crop_y2 - crop_y1
    
    target_w = 1200
    target_h = int(target_w * (crop_h / crop_w))
    print(f"  Crop box: ({crop_x1}, {crop_y1}, {crop_x2}, {crop_y2}), output size: ({target_w}x{target_h})")
    
    processed_frames = []
    frame_paths = []
    
    for idx, (f, im) in enumerate(images):
        cropped = im.crop((crop_x1, crop_y1, crop_x2, crop_y2))
        resized = cropped.resize((target_w, target_h), Image.Resampling.LANCZOS)
        
        frame_name = f"frame_{(idx+1):02d}.webp"
        frame_path = os.path.join(out_dir, frame_name)
        resized.save(frame_path, 'WEBP', quality=88, method=6)
        
        rel_frame_path = f"/drones-360/{cfg['id']}/{frame_name}"
        frame_paths.append(rel_frame_path)
        processed_frames.append(resized)
        
    # Generate animated 360 turntable preview
    # Scale down slightly for snappy turntable preview (e.g. 800px wide)
    anim_w = 800
    anim_h = int(anim_w * (crop_h / crop_w))
    anim_frames = [f.resize((anim_w, anim_h), Image.Resampling.BILINEAR) for f in processed_frames]
    
    turntable_name = "turntable-360.webp"
    turntable_path = os.path.join(out_dir, turntable_name)
    anim_frames[0].save(
        turntable_path,
        'WEBP',
        save_all=True,
        append_images=anim_frames[1:],
        duration=130,
        loop=0,
        quality=80
    )
    
    # Save poster frame (first front-facing frame)
    poster_name = "poster.webp"
    poster_path = os.path.join(out_dir, poster_name)
    processed_frames[0].save(poster_path, 'WEBP', quality=90)
    
    cfg_copy = dict(cfg)
    cfg_copy['frameCount'] = len(frame_paths)
    cfg_copy['frames'] = frame_paths
    cfg_copy['poster'] = f"/drones-360/{cfg['id']}/{poster_name}"
    cfg_copy['turntable'] = f"/drones-360/{cfg['id']}/{turntable_name}"
    manifest_list.append(cfg_copy)
    print(f"  Finished {cfg['name']}: {len(frame_paths)} frames + turntable preview.")

manifest_path = os.path.join(OUT_BASE, 'drones-manifest.json')
with open(manifest_path, 'w') as mf:
    json.dump(manifest_list, mf, indent=2)

print(f"\nAll 3D drone images generated successfully! Manifest saved to {manifest_path}")

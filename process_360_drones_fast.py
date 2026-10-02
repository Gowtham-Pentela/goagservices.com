import os, sys, re, json
from PIL import Image
from concurrent.futures import ProcessPoolExecutor

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

# Known pre-calculated global bounding boxes (from task-1066)
PRECALC_BBOXES = {
    "10X SPREAYINR DRONE": (3157, 253, 6842, 3427),
    "10X SPREADER DRONE": (2431, 220, 7568, 3292),
    "5X SPREAYING DRONE": (2369, 145, 7630, 3417),
    "5X SPREADER DRONE": (2108, 123, 8036, 3506),
    "GREAYDON ONLY DRONE IMAGES": (1610, 152, 8389, 3390),
    "GREAYDON SPREAYING DRONE": (2687, 213, 7312, 3422),
    "GREAYDON SPEADER DRONE": (3069, 282, 6930, 3238),
}

def get_num(s):
    m = re.search(r'(\d+)', s)
    return int(m.group(1)) if m else 999

def process_single_frame(args):
    in_path, out_path, crop_box, target_size = args
    im = Image.open(in_path)
    cropped = im.crop(crop_box)
    resized = cropped.resize(target_size, Image.Resampling.BILINEAR)
    resized.save(out_path, 'WEBP', quality=85, method=3)
    return out_path

def main():
    manifest_list = []
    
    # Process each drone
    for cfg in DRONE_CONFIGS:
        folder_name = cfg['folder']
        src_folder = os.path.join(BASE_DIR, folder_name)
        if not os.path.exists(src_folder):
            continue
            
        out_dir = os.path.join(OUT_BASE, cfg['id'])
        os.makedirs(out_dir, exist_ok=True)
        
        raw_files = sorted([f for f in os.listdir(src_folder) if f.endswith('.png')], key=get_num)
        min_x, min_y, max_x, max_y = PRECALC_BBOXES.get(folder_name, (2000, 100, 8000, 3500))
        
        cx = (min_x + max_x) / 2
        half_w = max(cx - min_x, max_x - cx) * 1.05
        cy = (min_y + max_y) / 2
        half_h = (max_y - min_y) * 0.55
        
        crop_x1 = max(0, int(cx - half_w))
        crop_x2 = min(9999, int(cx + half_w))
        crop_y1 = max(0, int(cy - half_h))
        crop_y2 = min(3770, int(cy + half_h))
        
        crop_box = (crop_x1, crop_y1, crop_x2, crop_y2)
        crop_w = crop_x2 - crop_x1
        crop_h = crop_y2 - crop_y1
        
        target_w = 1200
        target_h = int(target_w * (crop_h / crop_w))
        target_size = (target_w, target_h)
        
        print(f"Preparing {cfg['name']} ({len(raw_files)} frames)...")
        tasks = []
        frame_rel_paths = []
        for idx, f in enumerate(raw_files):
            frame_name = f"frame_{(idx+1):02d}.webp"
            in_p = os.path.join(src_folder, f)
            out_p = os.path.join(out_dir, frame_name)
            tasks.append((in_p, out_p, crop_box, target_size))
            frame_rel_paths.append(f"/drones-360/{cfg['id']}/{frame_name}")
            
        # Run tasks in parallel pool
        with ProcessPoolExecutor(max_workers=6) as executor:
            list(executor.map(process_single_frame, tasks))
            
        # Create turntable webp and poster
        turntable_frames = []
        anim_w = 720
        anim_h = int(anim_w * (crop_h / crop_w))
        for rel in frame_rel_paths:
            full_p = os.path.join(OUT_BASE, cfg['id'], os.path.basename(rel))
            f_img = Image.open(full_p).resize((anim_w, anim_h), Image.Resampling.BILINEAR)
            turntable_frames.append(f_img)
            
        turntable_name = "turntable-360.webp"
        turntable_path = os.path.join(out_dir, turntable_name)
        turntable_frames[0].save(
            turntable_path,
            'WEBP',
            save_all=True,
            append_images=turntable_frames[1:],
            duration=120,
            loop=0,
            quality=78
        )
        
        poster_name = "poster.webp"
        poster_path = os.path.join(out_dir, poster_name)
        Image.open(os.path.join(out_dir, "frame_01.webp")).save(poster_path, 'WEBP', quality=90)
        
        cfg_copy = dict(cfg)
        cfg_copy['frameCount'] = len(frame_rel_paths)
        cfg_copy['frames'] = frame_rel_paths
        cfg_copy['poster'] = f"/drones-360/{cfg['id']}/{poster_name}"
        cfg_copy['turntable'] = f"/drones-360/{cfg['id']}/{turntable_name}"
        manifest_list.append(cfg_copy)
        print(f"  ✓ {cfg['name']} complete!")

    manifest_path = os.path.join(OUT_BASE, 'drones-manifest.json')
    with open(manifest_path, 'w') as mf:
        json.dump(manifest_list, mf, indent=2)
    print(f"\nAll done! Manifest created at {manifest_path}")

if __name__ == '__main__':
    main()

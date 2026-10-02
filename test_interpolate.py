import cv2, os, numpy as np

folder = 'public/drones-360/10x-sprayer'
f1 = cv2.imread(os.path.join(folder, 'frame_01.webp'), cv2.IMREAD_UNCHANGED)
f2 = cv2.imread(os.path.join(folder, 'frame_02.webp'), cv2.IMREAD_UNCHANGED)

# Create 3 in-between blends: 25%, 50%, 75%
b25 = cv2.addWeighted(f1, 0.75, f2, 0.25, 0)
b50 = cv2.addWeighted(f1, 0.50, f2, 0.50, 0)
b75 = cv2.addWeighted(f1, 0.25, f2, 0.75, 0)

os.makedirs('public/drones-360/test_smooth', exist_ok=True)
cv2.imwrite('public/drones-360/test_smooth/b00.webp', f1)
cv2.imwrite('public/drones-360/test_smooth/b25.webp', b25)
cv2.imwrite('public/drones-360/test_smooth/b50.webp', b50)
cv2.imwrite('public/drones-360/test_smooth/b75.webp', b75)
cv2.imwrite('public/drones-360/test_smooth/b100.webp', f2)
print("Saved 5 test frames")

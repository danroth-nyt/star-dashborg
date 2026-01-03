from PIL import Image, ImageOps
import os

def make_transparent(img, threshold=200):
    """
    Converts light/white pixels to transparent.
    threshold: 0-255. Higher means more colors become transparent.
    """
    img = img.convert("RGBA")
    datas = img.getdata()

    new_data = []
    for item in datas:
        # Calculate the average brightness of the pixel (R+G+B / 3)
        avg = sum(item[:3]) / 3
        
        # If the pixel is brighter than the threshold, make it transparent
        if avg > threshold:
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)

    img.putdata(new_data)
    return img

def center_icon(img, output_size=100):
    """
    Find the bounding box of non-transparent pixels and center the icon.
    """
    # Get bounding box of non-transparent content
    bbox = img.getbbox()
    if bbox is None:
        return img.resize((output_size, output_size), Image.Resampling.LANCZOS)
    
    # Crop to content
    cropped = img.crop(bbox)
    
    # Calculate size to fit within output while maintaining aspect ratio
    # Add a small margin (90% of output size for icon)
    max_size = int(output_size * 0.90)
    
    cw, ch = cropped.size
    scale = min(max_size / cw, max_size / ch)
    new_w = int(cw * scale)
    new_h = int(ch * scale)
    
    # Resize the cropped icon
    resized = cropped.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    # Create new transparent image and paste centered (with slight downward shift)
    result = Image.new("RGBA", (output_size, output_size), (255, 255, 255, 0))
    paste_x = (output_size - new_w) // 2
    paste_y = (output_size - new_h) // 2 + 8  # Shift down 8 pixels
    result.paste(resized, (paste_x, paste_y), resized)
    
    return result

# 1. Load your image
input_path = "boost_oracle_star_borg-1.png" 
img = Image.open(input_path)
width, height = img.size

print(f"Image size: {width}x{height}")

# 2. Grid Coordinates (Adjusted based on image analysis)
# Image is 1100x1700, grid starts after header and ends before footer
left_pct, top_pct = 0.088, 0.165
right_pct, bottom_pct = 0.910, 0.895  # Reduced to avoid black footer

left = width * left_pct
top = height * top_pct
right = width * right_pct
bottom = height * bottom_pct

grid_w = (right - left) / 4
grid_h = (bottom - top) / 5

print(f"Grid cell size: {grid_w:.1f}x{grid_h:.1f}")

os.makedirs("transparent_icons", exist_ok=True)

# 3. Process the icons
for row in range(5):
    for col in range(4):
        # Calculate crop - grab a generous area, we'll auto-center later
        # Just need to exclude the numbers at top and bottom
        side_pad = 8
        top_pad = 5     # Very minimal padding to capture tippy top of icons
        bottom_pad = 38  # Skip the next row's number
        
        x0 = left + (col * grid_w) + side_pad
        y0 = top + (row * grid_h) + top_pad
        x1 = left + ((col + 1) * grid_w) - side_pad
        y1 = top + ((row + 1) * grid_h) - bottom_pad
        
        # Crop
        icon = img.crop((x0, y0, x1, y1))
        
        # Remove background (threshold 210 works well for this image)
        icon = make_transparent(icon, threshold=210)
        
        # Auto-center the icon in 100x100 output
        icon = center_icon(icon, output_size=100)
        
        # Save
        index = (row * 4) + col + 1
        icon.save(f"transparent_icons/icon_{index:02d}.png")
        print(f"Saved icon_{index:02d}.png")

print("Done! Check the 'transparent_icons' folder.") 

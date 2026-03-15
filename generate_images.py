import os
from PIL import Image, ImageDraw, ImageFont

# Create directories
os.makedirs("properties", exist_ok=True)
os.makedirs("properties/thumbnails", exist_ok=True)
os.makedirs("properties/featured", exist_ok=True)
os.makedirs("testimonials", exist_ok=True)
os.makedirs("blog", exist_ok=True)

def get_perfect_font(draw, text, max_width, max_height, font_paths):
    """Find the perfect font size that fits nicely in the image"""
    # Start with a reasonable size
    starting_size = min(max_width, max_height) // 3
    
    for size in range(starting_size, 20, -5):  # Decrease until it fits
        for font_path in font_paths:
            try:
                font = ImageFont.truetype(font_path, size)
                # Get text size
                bbox = draw.textbbox((0, 0), text, font=font)
                text_width = bbox[2] - bbox[0]
                text_height = bbox[3] - bbox[1]
                
                # Check if text fits with some padding (80% of image)
                if text_width < max_width * 0.8 and text_height < max_height * 0.6:
                    return font, size
            except:
                continue
    
    # Fallback
    return ImageFont.load_default(), 20

def create_image(path, size, bg_color, text, is_testimonial=False):
    """Create image with perfectly centered, balanced text"""
    try:
        # Create new image
        img = Image.new('RGB', size, color=bg_color)
        draw = ImageDraw.Draw(img)
        
        # Font paths (Windows focus)
        font_paths = [
            "C:\\Windows\\Fonts\\Arial.ttf",
            "C:\\Windows\\Fonts\\arialbd.ttf",
            "C:\\Windows\\Fonts\\impact.ttf",
            "C:\\Windows\\Fonts\\segoeui.ttf",
            "C:\\Windows\\Fonts\\tahoma.ttf",
        ]
        
        # Adjust text for different image types
        if is_testimonial:
            # For testimonials, use just first 2-3 letters
            if len(text) > 6:
                display_text = text[:3].upper()
            else:
                display_text = text[:2].upper()
        else:
            # For others, keep as is but maybe shorten if too long
            if len(text) > 15:
                # Take first word or abbreviate
                words = text.split()
                if len(words) > 1:
                    display_text = words[0][:8].upper()
                else:
                    display_text = text[:10].upper()
            else:
                display_text = text.upper()
        
        # Get perfect font size
        font, font_size = get_perfect_font(draw, display_text, size[0], size[1], font_paths)
        
        # Get exact text size with chosen font
        bbox = draw.textbbox((0, 0), display_text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        
        # Calculate center position (perfectly centered)
        x = (size[0] - text_width) // 2
        y = (size[1] - text_height) // 2
        
        # Add a subtle shadow for depth
        shadow_offset = max(2, font_size // 20)
        draw.text((x + shadow_offset, y + shadow_offset), display_text, 
                 fill=(0, 0, 0, 128), font=font)
        
        # Draw main text
        draw.text((x, y), display_text, fill=(255, 255, 255), font=font)
        
        # Add a subtle border for small images
        if size[0] <= 200:
            draw.rectangle([0, 0, size[0]-1, size[1]-1], outline=(255,255,255, 50), width=1)
        
        # Save
        img.save(path, "JPEG", quality=95, optimize=True)
        print(f"✅ Created: {path} (font: {font_size}px, text: '{display_text}')")
        
    except Exception as e:
        print(f"❌ Error creating {path}: {e}")
        # Ultra simple fallback
        try:
            img = Image.new('RGB', size, color=bg_color)
            draw = ImageDraw.Draw(img)
            draw.rectangle([5, 5, size[0]-5, size[1]-5], outline=(255,255,255), width=2)
            img.save(path, "JPEG", quality=95)
            print(f"⚠️ Created fallback: {path}")
        except:
            pass

# Color definitions
colors = {
    'primary': (53, 80, 112),      # #355070 - Dark blue
    'secondary': (109, 89, 122),    # #6D597A - Purple
    'accent1': (181, 101, 118),     # #B56576 - Rose
    'accent2': (74, 111, 165),      # #4A6FA5 - Blue
    'testimonial': (229, 107, 111), # #E56B6F - Coral
    'blog': (41, 50, 65)            # #293241 - Dark blue-gray
}

print("🎨 Creating perfectly balanced images...")
print("=" * 50)

# Property images
print("\n🏠 Creating property images...")
create_image("properties/property-1.jpg", (1200, 800), colors['primary'], "Property 1")
create_image("properties/property-1-interior.jpg", (800, 600), colors['secondary'], "Interior")
create_image("properties/property-1-bedroom.jpg", (800, 600), colors['secondary'], "Bedroom")
create_image("properties/property-1-balcony.jpg", (800, 600), colors['accent1'], "Balcony")
create_image("properties/property-1-gym.jpg", (800, 600), colors['accent2'], "Gym")
create_image("properties/property-1-survey.jpg", (800, 600), colors['accent2'], "Survey")

create_image("properties/property-2.jpg", (1200, 800), colors['primary'], "Property 2")
create_image("properties/property-2-garden.jpg", (800, 600), colors['accent1'], "Garden")
create_image("properties/property-2-pool.jpg", (800, 600), colors['accent2'], "Pool")
create_image("properties/property-2-living.jpg", (800, 600), colors['secondary'], "Living Room")
create_image("properties/property-2-conference.jpg", (800, 600), colors['accent2'], "Conference")
create_image("properties/property-2-shopfront.jpg", (800, 600), colors['accent1'], "Shopfront")
create_image("properties/property-2-view.jpg", (800, 600), colors['accent1'], "View")

create_image("properties/property-3.jpg", (1200, 800), colors['primary'], "Property 3")
create_image("properties/property-3-office.jpg", (800, 600), colors['secondary'], "Office")
create_image("properties/property-3-aerial.jpg", (800, 600), colors['accent1'], "Aerial View")
create_image("properties/property-3-garden.jpg", (800, 600), colors['accent1'], "Garden")
create_image("properties/property-3-kitchen.jpg", (800, 600), colors['secondary'], "Kitchen")

# Testimonial images
print("\n👤 Creating testimonial images...")
testimonials = [
    ("abebe", "Abebe"), ("tigist", "Tigist"), ("dawit", "Dawit"), ("helen", "Helen"),
    ("solomon", "Solomon"), ("meron", "Meron"), ("yonas", "Yonas"), ("betelhem", "Betelhem"),
    ("tekle", "Tekle"), ("almaz", "Almaz"), ("henok", "Henok"), ("sara", "Sara"),
    ("getachew", "Getachew"), ("frehiwot", "Frehiwot"), ("mulugeta", "Mulugeta")
]
for filename, display_name in testimonials:
    create_image(f"testimonials/{filename}.jpg", (150, 150), 
                colors['testimonial'], display_name, is_testimonial=True)

# Blog images
print("\n📝 Creating blog images...")
blogs = [
    ("trends-2026", "Trends 2026"),
    ("first-time-buyer", "First Time Buyer"),
    ("investment-neighborhoods", "Investment Areas"),
    ("property-law", "Property Law"),
    ("home-staging", "Home Staging"),
    ("mortgage-guide", "Mortgage Guide"),
    ("landlord-guide", "Landlord Guide"),
    ("new-developments", "New Developments")
]
for filename, display_text in blogs:
    create_image(f"blog/{filename}.jpg", (800, 450), colors['blog'], display_text)

# Thumbnails
print("\n🖼️ Creating thumbnails...")
for i in range(1, 4):
    create_image(f"properties/thumbnails/property-{i}-thumb.jpg", (400, 300), 
                colors['primary'], f"Prop {i}")

# Featured
print("\n⭐ Creating featured images...")
for i in range(1, 4):
    create_image(f"properties/featured/featured-{i}.jpg", (600, 400), 
                colors['primary'], f"Featured {i}")

print("\n" + "=" * 50)
print("✅ All images created successfully!")
print("\n📁 Image sizes summary:")
print("   - Properties: 1200x800 (main), 800x600 (interior)")
print("   - Testimonials: 150x150 (square, 2-3 letters)")
print("   - Blog: 800x450 (16:9)")
print("   - Thumbnails: 400x300")
print("   - Featured: 600x400")
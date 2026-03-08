# Properties Feature - Architecture Plan

## Overview
This document outlines the complete structure for adding a Properties management system to the AFTAZA website. The system includes public property listings and an admin dashboard for property management.

## 1. Database Schema

### New Prisma Models

```prisma
// Company Model - Internal use only (not visible to public)
model Company {
  id        String     @id @default(cuid())
  name      String
  phone     String?
  email     String?
  properties Property[]
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
}

// Property Model
model Property {
  id          String          @id @default(cuid())
  title       String
  slug        String          @unique
  type        PropertyType   @default(HOUSE)
  status      PropertyStatus @default(FOR_SALE)
  price       Float
  location    String
  bedrooms    Int?
  bathrooms   Int?
  parking     Int?
  landSize    Float?
  description String?
  published   Boolean        @default(true)
  companyId   String?
  company     Company?       @relation(fields: [companyId], references: [id])
  images      PropertyImage[]
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt
}

// PropertyImage Model
model PropertyImage {
  id         String   @id @default(cuid())
  url        String
  position   Int      @default(0)
  propertyId String
  property   Property @relation(fields: [propertyId], references: [id], onDelete: Cascade)
  createdAt  DateTime @default(now())
}

enum PropertyType {
  HOUSE
  APARTMENT
  LAND
  VILLA
  COMMERCIAL
}

enum PropertyStatus {
  FOR_SALE
  SOLD
  RENTED
  PENDING
}
```

## 2. Navigation Structure

### Header Menu Addition
- Add `Properties` menu item to `NAV_LINKS` in `src/lib/constants.ts`
- Link: `/properties`
- Position: After "Intelligence", before "Case Studies"

### Mobile Menu Update
- Add Properties link to `filteredNavLinks` in `MobileMenu.tsx`

### Admin Sidebar Update
- Add new "Properties" section with sub-items:
  - Dashboard → `/admin/properties`
  - Add Property → `/admin/properties/add-property`
  - Manage Properties → `/admin/properties/manage-properties`
  - Companies → `/admin/properties/companies`

## 3. Public Pages

### Properties Listing Page
**Route:** `/properties`
- Page title: "Properties"
- Search bar with property title search
- Filter section:
  - Property type (House, Apartment, Land, Villa, Commercial)
  - Status (For Sale, Sold)
  - Price range
  - Bedrooms
- Grid of property cards (3 columns desktop, 2 tablet, 1 mobile)
- Pagination

### Property Card Component
- Property image (thumbnail)
- Property title
- Price (formatted with currency)
- Location
- Bedrooms / Bathrooms / Parking icons
- Status badge (For Sale / Sold)

### Property Detail Page
**Route:** `/properties/[slug]`
- Image gallery (main image + thumbnails)
- Property title
- Price
- Location
- Property specs (beds, baths, parking, land size)
- Description
- Map section (placeholder)
- Contact section
- **IMPORTANT:** Company name must NOT be visible to public users

## 4. Admin Pages

### Admin Properties Dashboard
**Route:** `/admin/properties`
- Statistics cards:
  - Total properties
  - Active listings (For Sale)
  - Sold properties
  - Pending listings
- Recently added properties table (5 items)
- Quick search

### Add Property Page
**Route:** `/admin/properties/add-property`
- Form fields:
  - Property title (text)
  - Property type (dropdown: House, Apartment, Land, Villa, Commercial)
  - Status (dropdown: For Sale, Sold, Rented, Pending)
  - Price (number)
  - Location (text)
  - Bedrooms (number)
  - Bathrooms (number)
  - Parking (number)
  - Land size (number)
  - Description (textarea)
  - Image uploads (multiple)
  - Company selection (dropdown - optional, for internal filtering)
- Preview section

### Manage Properties Page
**Route:** `/admin/properties/manage-properties`
- Search by property title
- Filter by:
  - Status
  - Property type
  - Company
- Table columns:
  - Title
  - Price
  - Status
  - Date Added
  - Actions (Edit / Delete)
- Edit redirects to add-property with ID param
- Delete with confirmation

### Companies Management Page
**Route:** `/admin/properties/companies`
- List all companies
- Add new company form:
  - Company name
  - Contact phone
  - Contact email
- Edit/Delete functionality
- Company used only for internal property filtering

## 5. API Routes

### Properties API
- `GET /api/properties` - List all published properties (public)
- `GET /api/properties/[id]` - Get single property (public)
- `POST /api/properties` - Create property (admin)
- `PATCH /api/properties/[id]` - Update property (admin)
- `DELETE /api/properties/[id]` - Delete property (admin)

### Companies API
- `GET /api/companies` - List all companies (admin)
- `POST /api/companies` - Create company (admin)
- `PATCH /api/companies/[id]` - Update company (admin)
- `DELETE /api/companies/[id]` - Delete company (admin)

### Property Images API
- `POST /api/properties/[id]/images` - Upload images for property
- `DELETE /api/properties/[id]/images/[imageId]` - Delete image

## 6. File Structure

```
src/
├── app/
│   ├── properties/
│   │   ├── page.tsx                    # Properties listing
│   │   └── [slug]/
│   │       └── page.tsx                # Property detail
│   └── admin/
│       └── properties/
│           ├── page.tsx                # Admin dashboard
│           ├── add-property/
│           │   └── page.tsx           # Add/Edit property
│           ├── manage-properties/
│           │   └── page.tsx           # Manage all properties
│           └── companies/
│               └── page.tsx           # Manage companies
├── components/
│   └── properties/
│       ├── PropertyCard.tsx
│       ├── PropertyGrid.tsx
│       ├── PropertyFilters.tsx
│       ├── PropertyGallery.tsx
│       └── PropertyForm.tsx
├── lib/
│   └── types/
│       └── property.ts                # Property types
└── app/api/
    ├── properties/
    │   ├── route.ts
    │   └── [id]/
    │       ├── route.ts
    │       └── images/
    │           └── [imageId]/
    │               └── route.ts
    └── companies/
        ├── route.ts
        └── [id]/
            └── route.ts
```

## 7. Key Implementation Notes

1. **Company Visibility**: The `companyId` field on Property is for internal admin use only. Public property pages must NOT display company information.

2. **Slug Generation**: Auto-generate slug from title if not provided, similar to existing blog post pattern.

3. **Image Handling**: Use existing Cloudinary upload infrastructure for property images.

4. **Admin Authentication**: Use existing NextAuth pattern for admin protection.

5. **Search & Filters**: Implement server-side filtering for better performance with large datasets.

6. **Simplicity**: Keep features minimal - no user accounts, no frontend property submission, only admin manages everything.

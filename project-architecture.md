# AFTAZA Web Application - Project Architecture

## Overview
AFTAZA is a Next.js-based real estate platform that provides structured transaction governance and commercialization systems for property developers, buyers, and investors in Ethiopia. The application combines modern web technologies with a robust backend to deliver a premium property discovery and engagement experience.

## Technology Stack

### Frontend
- **Framework**: Next.js 14.2.3 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Custom-built component library with Framer Motion for animations
- **Icons**: Lucide React
- **State Management**: React hooks and server-side data fetching

### Backend & Data
- **ORM**: Prisma with PostgreSQL (Supabase)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: NextAuth.js with custom credentials provider
- **File Storage**: Cloudinary integration
- **API Routes**: Next.js API routes for serverless functions

### DevOps & Infrastructure
- **Deployment**: Custom cPanel deployment script
- **Environment**: Environment variable configuration
- **Build**: Next.js optimized build with Prisma generation

## Project Structure

```
/
├── .next/                    # Next.js build output
├── public/                   # Static assets
│   ├── favicon.ico
│   ├── images/               # Property and marketing images
│   └── logos/                # Brand assets
├── prisma/                   # Database schema and migrations
│   ├── schema.prisma         # Prisma data model
│   └── seed.ts               # Database seeding script
├── src/
│   ├── app/                  # Next.js App Router (pages and layouts)
│   │   ├── (route-based folders for each route)
│   │   ├── api/              # API route handlers
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Homepage
│   │   └── ...               # Other route sections
│   ├── components/           # Reusable UI components
│   │   ├── layout/           # Layout components (Header, Footer, etc.)
│   │   ├── properties/       # Property-specific components
│   │   ├── sections/         # Page sections
│   │   └── ui/               # Primitive UI components (Button, etc.)
│   ├── lib/                  # Utility libraries and services
│   │   ├── properties/       # Property-related business logic
│   │   ├── supabase/         # Supabase integration
│   │   ├── utils.ts          # Utility functions (cn for class merging)
│   │   ├── constants.ts      # Site configuration and navigation
│   │   ├── auth.ts           # Authentication configuration
│   │   ├── prisma.ts         # Prisma client instance
│   │   └── ...               # Other utility modules
│   ├── middleware.ts         # Next.js middleware for auth protection
│   ├── types/                # TypeScript type definitions
│   └── data/                 # Static data and seed data
├── .env                      # Environment variables
├── .cpanel.yml               # Deployment configuration
├── next.config.js            # Next.js configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
└── project-architecture.md   # This document
```

## Data Model (Prisma Schema)

The application uses a relational database model with the following core entities:

### Account (Admin Users)
- Stores administrator and editor accounts
- Fields: id, name, email, passwordHash, role, createdAt, updatedAt
- Relations: properties (created properties)

### Property (Main Listing)
- Core property listings with rich metadata
- Fields: id, title, slug, price, location, propertyType, status, bedrooms, bathrooms, parking, area, description, featured, companyId, createdBy, timestamps
- Relations: company, creator, images, inquiries

### PropertyImage
- Property image management
- Fields: id, propertyId, imageUrl, isPrimary, sortOrder, createdAt
- Relations: property (cascade delete)

### Company
- Real estate companies that list properties
- Fields: id, name, phone, email, createdAt, updatedAt
- Relations: properties

### Testimonial
- Customer success stories
- Fields: id, name, title, quote, image, createdAt, updatedAt

### PropertyInquiry
- Lead capture from property inquiries
- Fields: id, propertyId, name, email, phone, message, createdAt
- Relations: property (optional)

### Legacy Models
- User and Post models maintained for backward compatibility

## Architecture Overview

### 1. Next.js App Router Implementation
- Uses Next.js 14 App Router for routing and layouts
- Server components by default for optimal performance
- Client components marked with `"use client"` directive where interactivity is needed
- Route groups organize functionality (admin, api, properties, services, etc.)

### 2. Data Fetching Strategy
- **Server-Side Data Fetching**: Data fetched in server components or route handlers
- **Caching**: React's `cache` function used for memoizing database queries
- **Fallback Strategy**: Supabase properties service implements triple-layer fallback:
  1. Prisma database (primary)
  2. Supabase direct query (secondary)
  3. Local seed data (tertiary fallback)

### 3. Authentication & Authorization
- Custom NextAuth.js implementation with CredentialsProvider
- Middleware protects `/admin` routes requiring admin role
- Session management with JWT strategy
- Role-based access control (admin/editor)

### 4. Styling & Design System
- Tailwind CSS with extensive custom configuration
- Custom color palette (brand colors including gold variants)
- Custom animations (fade-up, fade-in, pulse-ring, counter, shimmer)
- Responsive design with mobile-first approach
- Dark/light surface awareness in Header component

### 5. Component Architecture
- **Primitive UI**: Button, Badge, Card, etc. in `/components/ui`
- **Layout Components**: Header, Footer, MobileMenu, TopBar in `/components/layout`
- **Property Components**: PropertyCard, PropertyFilters, PropertyBrowser, etc.
- **Section Components**: Reusable page sections (Hero, CTA, Metrics, etc.)
- **Composition Pattern**: Components composed together to build pages

### 6. API Routes
- RESTful API endpoints under `/app/api/`
- Property, company, inquiry, testimonial, upload endpoints
- Dynamic route handling for individual resources
- Middleware integration for authentication where needed

### 7. State Management
- React hooks (useState, useEffect) for client-side state
- URL search params for filtering state (properties listings)
- Optimistic updates where appropriate
- Server state passed as props to client components

### 8. Image Optimization
- Next.js Image component for optimized property images
- Cloudinary integration for upload and transformation
- Responsive images with proper sizing and fallbacks
- Hero images and galleries with lazy loading

### 9. Forms & Validation
- Controlled components with React state
- Property inquiry forms with validation
- Server-side validation in API routes
- Error handling and user feedback

### 10. Performance Optimizations
- Code splitting via Next.js dynamic imports
- Image optimization and lazy loading
- Server-side rendering for SEO
- Client-side navigation with route prefetching
- Efficient database queries with proper indexing
- Caching strategies for frequently accessed data

## Key Features

### Property Discovery
- Browse listings with advanced filtering
- Split-screen property browser with preview panel
- Property cards with multiple variants (featured, list, mini)
- Saved searches and filtering persistence

### Property Management (Admin)
- CRUD operations for properties
- Image upload and management
- Featured property designation
- Company management
- Inquiry/lead management

### Transaction Systems
- Structured engagement pathways
- Buyback guarantee framework
- Investor structuring services
- Developer commercialization systems
- Media & market education

### Ecosystem & Intelligence
- Developer, buyer, investor, financier ecosystem pages
- Intelligence hub with methodology and insights
- Case studies and success stories
- Market analysis and trends

### Contact & Engagement
- Consultation booking system
- Multi-channel contact (phone, email, WhatsApp, Telegram)
- Floating contact CTA for persistent engagement
- Newsletter and follow-up systems

## Deployment & DevOps

### Environment Configuration
- Database URLs for Prisma and Supabase
- NextAuth secret and URL
- Cloudinary credentials for media storage
- Supabase client and service role keys

### Build Process
1. `prisma generate` - Generate Prisma client
2. `next build` - Optimize Next.js production build
3. Output stored in `.next/` directory

### Deployment (.cpanel.yml)
- Copies build output, public assets, and package files
- Installs production dependencies
- Runs Next.js build command
- Designed for cPanel/Shared hosting environments

### Environment Variables
- `.env.example` provides template
- `.env` contains actual secrets (not committed)
- Variables grouped by service (database, auth, cloudinary, supabase)

## Security Considerations

### Authentication
- Admin-only access to `/admin` routes
- Password hashing with bcrypt
- Session protection via NextAuth
- Environment variable secrets

### Data Protection
- Parameterized queries via Prisma ORM
- Input validation and sanitization
- CSRF protection via Next.js
- Secure headers implementation

### File Uploads
- Cloudinary integration with secure upload
- File type and size validation
- Public URL generation with transformations

## Future Enhancements

1. **Advanced Search**: Elasticsearch or similar for full-text search
2. **Analytics**: Integration with analytics platforms
3. **Multi-language**: i18n support for Amharic and other languages
4. **Payment Integration**: Secure payment processing for services
5. **Email Marketing**: Automated drip campaigns and newsletters
6. **Performance Monitoring**: Real-user monitoring and performance budgets
7. **Testing**: Comprehensive test suite (unit, integration, e2e)
8. **CI/CD**: Automated testing and deployment pipelines

## Conclusion

AFTAZA represents a modern, scalable real estate platform built with Next.js and TypeScript. The architecture emphasizes performance, maintainability, and user experience while providing robust transaction governance systems. The separation of concerns, modular component architecture, and strategic use of server-side rendering position the application for continued growth and feature expansion.

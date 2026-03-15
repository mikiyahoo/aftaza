const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkPropertiesSchema() {
  try {
    console.log('Checking properties table schema...');
    
    // Try to fetch a few properties to see the actual data
    const properties = await prisma.property.findMany({
      take: 5,
      orderBy: { created_at: 'desc' }
    });
    
    console.log('Sample properties:');
    properties.forEach((prop, index) => {
      console.log(`Property ${index + 1}:`);
      console.log(`  ID: ${prop.id} (type: ${typeof prop.id})`);
      console.log(`  Title: ${prop.title} (type: ${typeof prop.title})`);
      console.log(`  Price: ${prop.price} (type: ${typeof prop.price})`);
      console.log(`  Location: ${prop.location} (type: ${typeof prop.location})`);
      console.log(`  Property Type: ${prop.property_type} (type: ${typeof prop.property_type})`);
      console.log(`  Status: ${prop.status} (type: ${typeof prop.status})`);
      console.log(`  Bedrooms: ${prop.bedrooms} (type: ${typeof prop.bedrooms})`);
      console.log(`  Bathrooms: ${prop.bathrooms} (type: ${typeof prop.bathrooms})`);
      console.log(`  Parking: ${prop.parking} (type: ${typeof prop.parking})`);
      console.log(`  Area: ${prop.area} (type: ${typeof prop.area})`);
      console.log(`  Description: ${prop.description} (type: ${typeof prop.description})`);
      console.log(`  Featured: ${prop.featured} (type: ${typeof prop.featured})`);
      console.log(`  Company ID: ${prop.company_id} (type: ${typeof prop.company_id})`);
      console.log(`  Created By: ${prop.created_by} (type: ${typeof prop.created_by})`);
      console.log('---');
    });
    
  } catch (error) {
    console.error('Error checking properties schema:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkPropertiesSchema();
const { PrismaClient } = require('@prisma/client');

async function testCompaniesEndpoint() {
  try {
    console.log('Creating Prisma client...');
    const prisma = new PrismaClient({
      log: ['query', 'error', 'warn'],
      datasources: {
        db: {
          url: "postgresql://postgres.mckqexvurdicfmtrjkcc:Mikias%24Ki0915@aws-1-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=no-verify&connect_timeout=10"
        }
      }
    });
    
    console.log('Connecting to database...');
    await prisma.$connect();
    console.log('Connected to database');
    
    // Test the exact query from the API
    console.log('Testing companies query with _count...');
    const companies = await prisma.company.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { properties: true },
        },
      },
    });
    console.log('Success! Companies count:', companies.length);
    console.log('First company:', JSON.stringify(companies[0], null, 2));
    
    await prisma.$disconnect();
    console.log('Disconnected from database');
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

testCompaniesEndpoint();
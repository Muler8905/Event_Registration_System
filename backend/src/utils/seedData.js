const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const defaultEvents = [
  {
    title: "Tech Innovation Summit 2024",
    description: "Join industry leaders and innovators for a day of cutting-edge technology discussions, networking, and insights into the future of tech. Featuring keynote speakers from major tech companies, startup showcases, and hands-on workshops covering AI, blockchain, and emerging technologies.",
    location: "San Francisco Convention Center, CA",
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
    capacity: 500,
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop&crop=center"
  },
  {
    title: "Digital Marketing Masterclass",
    description: "Learn the latest digital marketing strategies from industry experts. This comprehensive workshop covers social media marketing, SEO, content creation, email marketing, and analytics. Perfect for marketers, entrepreneurs, and business owners looking to boost their online presence.",
    location: "New York Business Center, NY",
    date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    capacity: 150,
    imageUrl: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=600&fit=crop&crop=center"
  },
  {
    title: "Startup Pitch Competition",
    description: "Watch promising startups pitch their innovative ideas to a panel of experienced investors and entrepreneurs. Network with fellow entrepreneurs, learn from successful founders, and discover the next big thing in the startup ecosystem. Prizes worth $100,000 in total funding.",
    location: "Austin Tech Hub, TX",
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
    capacity: 300,
    imageUrl: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=600&fit=crop&crop=center"
  },
  {
    title: "AI & Machine Learning Conference",
    description: "Explore the latest developments in artificial intelligence and machine learning. Sessions cover deep learning, natural language processing, computer vision, and practical AI applications in business. Includes hands-on labs and networking opportunities with AI researchers and practitioners.",
    location: "Seattle Convention Center, WA",
    date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 3 weeks from now
    capacity: 400,
    imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop&crop=center"
  },
  {
    title: "Women in Tech Leadership Summit",
    description: "Empowering women in technology through leadership development, mentorship, and networking. Join successful female leaders in tech as they share their experiences, challenges, and strategies for career advancement. Includes panel discussions, workshops, and mentoring sessions.",
    location: "Chicago Business District, IL",
    date: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000), // 4 weeks from now
    capacity: 250,
    imageUrl: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&h=600&fit=crop&crop=center"
  },
  {
    title: "Blockchain & Cryptocurrency Forum",
    description: "Dive deep into blockchain technology and cryptocurrency trends. Learn about DeFi, NFTs, smart contracts, and the future of digital finance. Expert speakers from leading blockchain companies will share insights on investment strategies, regulatory updates, and emerging opportunities.",
    location: "Miami Beach Convention Center, FL",
    date: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000), // 5 weeks from now
    capacity: 350,
    imageUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=600&fit=crop&crop=center"
  },
  {
    title: "UX/UI Design Workshop",
    description: "Master the art of user experience and interface design. This intensive workshop covers design thinking, user research, prototyping, and usability testing. Perfect for designers, developers, and product managers looking to create better user experiences.",
    location: "Portland Design Center, OR",
    date: new Date(Date.now() + 42 * 24 * 60 * 60 * 1000), // 6 weeks from now
    capacity: 100,
    imageUrl: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&h=600&fit=crop&crop=center"
  },
  {
    title: "Cloud Computing & DevOps Summit",
    description: "Learn about cloud infrastructure, containerization, CI/CD pipelines, and modern DevOps practices. Sessions cover AWS, Azure, Google Cloud, Kubernetes, Docker, and automation tools. Includes hands-on labs and certification preparation workshops.",
    location: "Denver Tech Center, CO",
    date: new Date(Date.now() + 49 * 24 * 60 * 60 * 1000), // 7 weeks from now
    capacity: 200,
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop&crop=center"
  },
  {
    title: "Cybersecurity & Data Privacy Conference",
    description: "Stay ahead of cyber threats and learn about data protection strategies. Expert sessions on threat detection, incident response, compliance, and privacy regulations. Network with security professionals and learn about the latest security tools and techniques.",
    location: "Washington DC Convention Center, DC",
    date: new Date(Date.now() + 56 * 24 * 60 * 60 * 1000), // 8 weeks from now
    capacity: 300,
    imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=600&fit=crop&crop=center"
  },
  {
    title: "E-commerce & Online Business Expo",
    description: "Discover the latest trends in e-commerce, online marketing, and digital business strategies. Learn about dropshipping, affiliate marketing, social commerce, and customer acquisition. Perfect for entrepreneurs and business owners looking to grow their online presence.",
    location: "Las Vegas Convention Center, NV",
    date: new Date(Date.now() + 63 * 24 * 60 * 60 * 1000), // 9 weeks from now
    capacity: 450,
    imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop&crop=center"
  }
];

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Create admin user
    const adminEmail = 'admin@eventhub.com';
    const adminPassword = await bcrypt.hash('admin123', 12);

    let adminUser = await prisma.user.findUnique({
      where: { email: adminEmail }
    });

    if (!adminUser) {
      adminUser = await prisma.user.create({
        data: {
          name: 'EventHub Admin',
          email: adminEmail,
          password: adminPassword,
          role: 'ADMIN'
        }
      });
      console.log('✅ Admin user created');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    // Create demo user
    const demoEmail = 'demo@example.com';
    const demoPassword = await bcrypt.hash('demo123', 12);

    let demoUser = await prisma.user.findUnique({
      where: { email: demoEmail }
    });

    if (!demoUser) {
      demoUser = await prisma.user.create({
        data: {
          name: 'Demo User',
          email: demoEmail,
          password: demoPassword,
          role: 'USER'
        }
      });
      console.log('✅ Demo user created');
    } else {
      console.log('ℹ️  Demo user already exists');
    }

    // Check if events already exist
    const existingEventsCount = await prisma.event.count();
    
    if (existingEventsCount === 0) {
      // Create events
      for (const eventData of defaultEvents) {
        await prisma.event.create({
          data: {
            ...eventData,
            createdBy: adminUser.id
          }
        });
      }
      console.log(`✅ Created ${defaultEvents.length} default events`);
    } else {
      console.log(`ℹ️  ${existingEventsCount} events already exist, skipping event creation`);
    }

    // Create some sample registrations
    const events = await prisma.event.findMany({ take: 5 });
    
    for (const event of events) {
      const existingRegistration = await prisma.registration.findUnique({
        where: {
          userId_eventId: {
            userId: demoUser.id,
            eventId: event.id
          }
        }
      });

      if (!existingRegistration) {
        await prisma.registration.create({
          data: {
            userId: demoUser.id,
            eventId: event.id,
            status: 'CONFIRMED'
          }
        });
      }
    }
    console.log('✅ Created sample registrations');

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Default Accounts:');
    console.log(`Admin: ${adminEmail} / admin123`);
    console.log(`Demo User: ${demoEmail} / demo123`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

module.exports = { seedDatabase };

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
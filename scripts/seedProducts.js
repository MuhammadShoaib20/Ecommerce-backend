import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import User from '../models/User.js';

dotenv.config();

const sampleProducts = [
  {
    name: 'iPhone 15 Pro',
    description: 'Latest iPhone with A17 Pro chip, titanium design, and advanced camera system. Perfect for photography enthusiasts and power users.',
    price: 999,
    discountPrice: 899,
    category: 'Electronics',
    stock: 50,
    images: [{
      public_id: 'iphone15pro',
      url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop'
    }]
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Flagship Android phone with S Pen, 200MP camera, and Snapdragon 8 Gen 3 processor. Ultimate productivity and creativity device.',
    price: 1199,
    discountPrice: 1099,
    category: 'Electronics',
    stock: 30,
    images: [{
      public_id: 'galaxys24',
      url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop'
    }]
  },
  {
    name: 'MacBook Pro 16" M3',
    description: 'Powerful laptop for professionals. M3 chip, 16-inch Liquid Retina display, up to 22 hours battery life.',
    price: 2499,
    discountPrice: 2299,
    category: 'Laptops',
    stock: 25,
    images: [{
      public_id: 'macbookpro',
      url: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop'
    }]
  },
  {
    name: 'Dell XPS 15',
    description: 'Premium Windows laptop with Intel Core i9, 4K OLED display, and NVIDIA RTX graphics. Perfect for creators.',
    price: 1999,
    discountPrice: 1799,
    category: 'Laptops',
    stock: 20,
    images: [{
      public_id: 'dellxps',
      url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop'
    }]
  },
  {
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Industry-leading noise cancellation, 30-hour battery life, premium sound quality. Best wireless headphones.',
    price: 399,
    discountPrice: 349,
    category: 'Headphones',
    stock: 100,
    images: [{
      public_id: 'sonyheadphones',
      url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop'
    }]
  },
  {
    name: 'AirPods Pro 2',
    description: 'Active noise cancellation, spatial audio, adaptive transparency mode. Premium wireless earbuds.',
    price: 249,
    discountPrice: 229,
    category: 'Headphones',
    stock: 150,
    images: [{
      public_id: 'airpodspro',
      url: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=400&fit=crop'
    }]
  },
  {
    name: 'Canon EOS R6 Mark II',
    description: 'Professional mirrorless camera with 24MP sensor, 4K video, and advanced autofocus system.',
    price: 2499,
    discountPrice: 2299,
    category: 'Cameras',
    stock: 15,
    images: [{
      public_id: 'canoneos',
      url: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=400&fit=crop'
    }]
  },
  {
    name: 'Nikon D850',
    description: 'Full-frame DSLR camera with 45.7MP sensor, 4K video recording, and exceptional image quality.',
    price: 2999,
    discountPrice: 2799,
    category: 'Cameras',
    stock: 10,
    images: [{
      public_id: 'nikond850',
      url: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=400&fit=crop'
    }]
  },
  {
    name: 'Apple Watch Series 9',
    description: 'Latest smartwatch with S9 chip, always-on display, health tracking, and GPS.',
    price: 399,
    discountPrice: 349,
    category: 'Accessories',
    stock: 80,
    images: [{
      public_id: 'applewatch',
      url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop'
    }]
  },
  {
    name: 'Logitech MX Master 3S',
    description: 'Premium wireless mouse with precision tracking, ergonomic design, and multi-device connectivity.',
    price: 99,
    discountPrice: 79,
    category: 'Accessories',
    stock: 200,
    images: [{
      public_id: 'logitechmouse',
      url: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop'
    }]
  },
  {
    name: 'Mechanical Keyboard RGB',
    description: 'Gaming mechanical keyboard with RGB backlight, Cherry MX switches, and programmable keys.',
    price: 149,
    discountPrice: 129,
    category: 'Accessories',
    stock: 120,
    images: [{
      public_id: 'mechkeyboard',
      url: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=400&fit=crop'
    }]
  },
  {
    name: 'Wireless Charging Pad',
    description: 'Fast wireless charging pad compatible with all Qi-enabled devices. Sleek design.',
    price: 39,
    discountPrice: 29,
    category: 'Accessories',
    stock: 300,
    images: [{
      public_id: 'wirelesscharger',
      url: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400&h=400&fit=crop'
    }]
  },
  {
    name: 'Organic Coffee Beans',
    description: 'Premium organic coffee beans, single-origin, medium roast. Perfect for coffee enthusiasts.',
    price: 24,
    discountPrice: 19,
    category: 'Food',
    stock: 500,
    images: [{
      public_id: 'coffeebeans',
      url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop'
    }]
  },
  {
    name: 'The Complete Guide to React',
    description: 'Comprehensive book covering React fundamentals, hooks, and advanced patterns. Perfect for developers.',
    price: 49,
    discountPrice: 39,
    category: 'Books',
    stock: 200,
    images: [{
      public_id: 'reactbook',
      url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop'
    }]
  },
  {
    name: 'Nike Air Max 270',
    description: 'Comfortable running shoes with Air Max cushioning, breathable mesh upper, and modern design.',
    price: 150,
    discountPrice: 120,
    category: 'Clothes/Shoes',
    stock: 100,
    images: [{
      public_id: 'nikeshoes',
      url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop'
    }]
  },
  {
    name: 'Skincare Set',
    description: 'Complete skincare routine with cleanser, toner, serum, and moisturizer. Natural ingredients.',
    price: 89,
    discountPrice: 69,
    category: 'Beauty/Health',
    stock: 150,
    images: [{
      public_id: 'skincareset',
      url: 'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=400&h=400&fit=crop'
    }]
  },
  {
    name: 'Yoga Mat Premium',
    description: 'Non-slip yoga mat with extra cushioning, eco-friendly material, and carrying strap.',
    price: 45,
    discountPrice: 35,
    category: 'Sports',
    stock: 180,
    images: [{
      public_id: 'yogamat',
      url: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop'
    }]
  },
  {
    name: 'Camping Tent 4-Person',
    description: 'Spacious 4-person tent, waterproof, easy setup, perfect for outdoor adventures.',
    price: 199,
    discountPrice: 169,
    category: 'Outdoor',
    stock: 60,
    images: [{
      public_id: 'campingtent',
      url: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=400&h=400&fit=crop'
    }]
  },
  {
    name: 'Smart Home Hub',
    description: 'Central control for all your smart home devices. Voice control, app integration.',
    price: 129,
    discountPrice: 99,
    category: 'Home',
    stock: 90,
    images: [{
      public_id: 'smarthomehub',
      url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop'
    }]
  }
];

const seedProducts = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shophub';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Find or create an admin user
    let adminUser = await User.findOne({ email: 'admin@shophub.com' });
    if (!adminUser) {
      adminUser = await User.create({
        name: 'Admin User',
        email: 'admin@shophub.com',
        password: 'admin123',
        role: 'admin'
      });
      console.log('✅ Admin user created: admin@shophub.com / admin123');
    } else {
      console.log('✅ Admin user already exists');
    }

    // Clear existing products (optional - comment out if you want to keep existing)
    // await Product.deleteMany({});
    // console.log('✅ Cleared existing products');

    // Add sample products
    for (const productData of sampleProducts) {
      const existingProduct = await Product.findOne({ name: productData.name });
      if (!existingProduct) {
        await Product.create({
          ...productData,
          user: adminUser._id
        });
        console.log(`✅ Created product: ${productData.name}`);
      } else {
        console.log(`⏭️  Product already exists: ${productData.name}`);
      }
    }

    console.log('\n✅ Product seeding completed!');
    console.log(`📦 Total products: ${await Product.countDocuments()}`);
    console.log('\n🔑 Admin Login Credentials:');
    console.log('   Email: admin@shophub.com');
    console.log('   Password: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();

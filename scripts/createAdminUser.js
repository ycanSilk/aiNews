import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

async function createAdminUser() {
  try {
    // 连接到MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-news');
    console.log('Connected to MongoDB');

    // 获取数据库连接
    const db = mongoose.connection.db;
    
    // 检查是否已存在admin用户
    const existingAdmin = await db.collection('adminuser').findOne({ username: 'admin' });
    if (existingAdmin) {
      console.log('Admin user already exists. Deleting existing admin user...');
      await db.collection('adminuser').deleteOne({ username: 'admin' });
    }

    // 加密密码
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('admin123', saltRounds);

    // 创建新的管理员用户
    const adminUser = {
      username: 'admin',
      password: hashedPassword,
      email: 'admin@example.com',
      role: 'admin',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await db.collection('adminuser').insertOne(adminUser);
    console.log('Admin user created successfully!');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('Email: admin@example.com');
    console.log('Role: admin');

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// 运行脚本
createAdminUser();
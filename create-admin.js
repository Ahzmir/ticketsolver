db.users.insertOne({
  firstName: 'Admin',
  lastName: 'User',
  studentId: '10000000',
  password: 'admin123',
  role: 'admin',
  createdAt: new Date(),
  updatedAt: new Date()
})

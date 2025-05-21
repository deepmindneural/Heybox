import Database from 'better-sqlite3';
import * as bcrypt from 'bcryptjs';

// Crear una instancia de la base de datos SQLite en la memoria para desarrollo local
const db = new Database(':memory:');

// Interfaces para tipar los datos
export interface User {
  id?: number;
  email: string;
  name: string;
  role: string;
  profile_image?: string;
  created_at?: string;
}

export interface Restaurant {
  id?: number;
  name: string;
  description: string;
  category: string;
  address: string;
  city: string;
  logo: string;
  rating: number;
  delivery_time?: string;
  min_order?: number;
  delivery_fee?: number;
  created_at?: string;
}

export interface MenuItem {
  id?: number;
  restaurant_id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  is_available: boolean;
  created_at?: string;
}

export interface Order {
  id?: number;
  user_id: number;
  restaurant_id: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  total: number;
  address: string;
  payment_method: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface OrderItem {
  id?: number;
  order_id: number;
  menu_item_id: number;
  quantity: number;
  price: number;
  notes?: string;
}

// Inicialización de la base de datos
export const initializeDatabase = () => {
  // Crear tabla de usuarios
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT DEFAULT 'customer',
      profile_image TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Crear tabla de sesiones
  db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      token TEXT NOT NULL,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);

  // Crear tabla de restaurantes
  db.exec(`
    CREATE TABLE IF NOT EXISTS restaurants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      address TEXT NOT NULL,
      city TEXT NOT NULL,
      logo TEXT NOT NULL,
      rating REAL DEFAULT 0,
      delivery_time TEXT,
      min_order REAL,
      delivery_fee REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Crear tabla de elementos de menú
  db.exec(`
    CREATE TABLE IF NOT EXISTS menu_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      restaurant_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      price REAL NOT NULL,
      category TEXT NOT NULL,
      image TEXT,
      is_available BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (restaurant_id) REFERENCES restaurants (id)
    )
  `);

  // Crear tabla de pedidos
  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      restaurant_id INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      total REAL NOT NULL,
      address TEXT NOT NULL,
      payment_method TEXT NOT NULL,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id),
      FOREIGN KEY (restaurant_id) REFERENCES restaurants (id)
    )
  `);

  // Crear tabla de elementos de pedido
  db.exec(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      menu_item_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      notes TEXT,
      FOREIGN KEY (order_id) REFERENCES orders (id),
      FOREIGN KEY (menu_item_id) REFERENCES menu_items (id)
    )
  `);
  
  // Crear algunos usuarios de prueba
  const hashedPassword = bcrypt.hashSync('password123', 10);
  
  const users = [
    {
      email: 'admin@heybox.com',
      password: hashedPassword,
      name: 'Administrador',
      role: 'admin'
    },
    {
      email: 'cliente@ejemplo.com',
      password: hashedPassword,
      name: 'Cliente Ejemplo',
      role: 'customer'
    },
    {
      email: 'restaurant@heybox.com',
      password: hashedPassword,
      name: 'Restaurante Demo',
      role: 'restaurant'
    }
  ];

  // Verificar si los usuarios ya existen e insertarlos si no
  const checkUserStmt = db.prepare('SELECT id FROM users WHERE email = ?');
  const insertUserStmt = db.prepare(
    'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)'
  );

  users.forEach(user => {
    const existingUser = checkUserStmt.get(user.email);
    if (!existingUser) {
      insertUserStmt.run(user.email, user.password, user.name, user.role);
      console.log(`Usuario creado: ${user.email}`);
    }
  });

  // Crear restaurantes de muestra
  const sampleRestaurants = [
    {
      name: 'El Rincón del Sabor',
      description: 'Los mejores platos de la gastronomía colombiana con un toque moderno.',
      category: 'Comida colombiana',
      address: 'Calle 123 #45-67',
      city: 'Bogotá',
      logo: 'https://via.placeholder.com/300x200?text=El+Rincon+del+Sabor',
      rating: 4.8,
      delivery_time: '30-45 min',
      min_order: 20000,
      delivery_fee: 4000
    },
    {
      name: 'La Pizzería Italiana',
      description: 'Auténtica pizza italiana horneada en horno de leña.',
      category: 'Italiana',
      address: 'Carrera 78 #23-45',
      city: 'Bogotá',
      logo: 'https://via.placeholder.com/300x200?text=Pizzeria+Italiana',
      rating: 4.5,
      delivery_time: '35-50 min',
      min_order: 25000,
      delivery_fee: 5000
    },
    {
      name: 'Sushi Express',
      description: 'El mejor sushi de la ciudad con ingredientes frescos importados.',
      category: 'Japonesa',
      address: 'Av. 7 #90-21',
      city: 'Bogotá',
      logo: 'https://via.placeholder.com/300x200?text=Sushi+Express',
      rating: 4.7,
      delivery_time: '40-55 min',
      min_order: 35000,
      delivery_fee: 6000
    },
    {
      name: 'Burger Gourmet',
      description: 'Hamburguesas gourmet con ingredientes orgánicos y pan artesanal.',
      category: 'Hamburguesas',
      address: 'Calle 53 #12-57',
      city: 'Bogotá',
      logo: 'https://via.placeholder.com/300x200?text=Burger+Gourmet',
      rating: 4.6,
      delivery_time: '25-40 min',
      min_order: 28000,
      delivery_fee: 3500
    }
  ];
  
  // Insertar restaurantes
  const checkRestaurantStmt = db.prepare('SELECT id FROM restaurants WHERE name = ?');
  const insertRestaurantStmt = db.prepare(`
    INSERT INTO restaurants (name, description, category, address, city, logo, rating, delivery_time, min_order, delivery_fee)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  sampleRestaurants.forEach(restaurant => {
    const existingRestaurant = checkRestaurantStmt.get(restaurant.name);
    if (!existingRestaurant) {
      insertRestaurantStmt.run(
        restaurant.name,
        restaurant.description,
        restaurant.category,
        restaurant.address,
        restaurant.city,
        restaurant.logo,
        restaurant.rating,
        restaurant.delivery_time,
        restaurant.min_order,
        restaurant.delivery_fee
      );
      console.log(`Restaurante creado: ${restaurant.name}`);
    }
  });
  
  // Crear menú de muestra para el primer restaurante
  const rinconDelSabor = checkRestaurantStmt.get('El Rincón del Sabor');
  if (rinconDelSabor) {
    const menuItems = [
      {
        name: 'Bandeja Paisa',
        description: 'Plato tradicional colombiano con frijoles, arroz, carne molida, chicharrón, huevo y aguacate.',
        price: 32000,
        category: 'Platos Principales',
        image: 'https://via.placeholder.com/300x200?text=Bandeja+Paisa'
      },
      {
        name: 'Ajiaco Santafereño',
        description: 'Sopa tradicional bogotana con pollo, papas, mazorca y guascas.',
        price: 28000,
        category: 'Sopas',
        image: 'https://via.placeholder.com/300x200?text=Ajiaco'
      },
      {
        name: 'Arepa de Choclo',
        description: 'Arepa de maíz tierno con queso fundido.',
        price: 12000,
        category: 'Entradas',
        image: 'https://via.placeholder.com/300x200?text=Arepa+de+Choclo'
      }
    ];
    
    const insertMenuItemStmt = db.prepare(`
      INSERT INTO menu_items (restaurant_id, name, description, price, category, image, is_available)
      VALUES (?, ?, ?, ?, ?, ?, 1)
    `);
    
    menuItems.forEach(item => {
      insertMenuItemStmt.run(
        rinconDelSabor.id,
        item.name,
        item.description,
        item.price,
        item.category,
        item.image
      );
      console.log(`Menú creado: ${item.name} para ${rinconDelSabor.id}`);
    });
  }
  
  console.log('Base de datos SQLite inicializada correctamente');
};

// Métodos de acceso a la base de datos
export const dbService = {
  // Autenticación
  findUserByEmail: (email: string) => {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email);
  },

  validatePassword: (plainPassword: string, hashedPassword: string) => {
    return bcrypt.compareSync(plainPassword, hashedPassword);
  },

  createSession: (userId: number) => {
    const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // La sesión expira en 7 días
    
    const stmt = db.prepare(
      'INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)'
    );
    
    const result = stmt.run(userId, token, expiresAt.toISOString());
    
    return { 
      id: result.lastInsertRowid,
      token,
      expiresAt
    };
  },

  validateSession: (token: string) => {
    const stmt = db.prepare(`
      SELECT s.*, u.id as user_id, u.email, u.name, u.role 
      FROM sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.token = ? AND s.expires_at > datetime('now')
    `);
    
    return stmt.get(token);
  },

  deleteSession: (token: string) => {
    const stmt = db.prepare('DELETE FROM sessions WHERE token = ?');
    return stmt.run(token);
  },

  // Usuarios
  createUser: (userData: { email: string; password: string; name: string; role?: string }) => {
    const hashedPassword = bcrypt.hashSync(userData.password, 10);
    
    const stmt = db.prepare(
      'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)'
    );
    
    try {
      const result = stmt.run(
        userData.email, 
        hashedPassword, 
        userData.name, 
        userData.role || 'customer'
      );
      
      return { 
        id: result.lastInsertRowid, 
        email: userData.email, 
        name: userData.name, 
        role: userData.role || 'customer' 
      };
    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw new Error('No se pudo crear el usuario. El correo electrónico ya podría estar en uso.');
    }
  },

  getUserProfile: (userId: number) => {
    const stmt = db.prepare('SELECT id, email, name, role, profile_image, created_at FROM users WHERE id = ?');
    return stmt.get(userId);
  },

  updateUserProfile: (userId: number, data: { name?: string; profile_image?: string }) => {
    const fields = [];
    const values = [];
    
    if (data.name) {
      fields.push('name = ?');
      values.push(data.name);
    }
    
    if (data.profile_image) {
      fields.push('profile_image = ?');
      values.push(data.profile_image);
    }
    
    if (fields.length > 0) {
      fields.push('updated_at = CURRENT_TIMESTAMP');
      
      const stmt = db.prepare(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`);
      values.push(userId);
      
      return stmt.run(...values);
    }
    
    return { changes: 0 };
  },

  // Restaurantes
  getAllRestaurants: () => {
    const stmt = db.prepare(`
      SELECT * FROM restaurants 
      ORDER BY rating DESC
    `);
    return stmt.all();
  },

  getRestaurantsByCategory: (category: string) => {
    const stmt = db.prepare(`
      SELECT * FROM restaurants 
      WHERE category = ? 
      ORDER BY rating DESC
    `);
    return stmt.all(category);
  },

  searchRestaurants: (searchTerm: string) => {
    const stmt = db.prepare(`
      SELECT * FROM restaurants 
      WHERE name LIKE ? OR description LIKE ? OR category LIKE ? 
      ORDER BY rating DESC
    `);
    const term = `%${searchTerm}%`;
    return stmt.all(term, term, term);
  },

  getRestaurantById: (id: number) => {
    const stmt = db.prepare('SELECT * FROM restaurants WHERE id = ?');
    return stmt.get(id);
  },

  // Menú
  getMenuByRestaurantId: (restaurantId: number) => {
    const stmt = db.prepare(`
      SELECT * FROM menu_items 
      WHERE restaurant_id = ? AND is_available = 1 
      ORDER BY category, name
    `);
    return stmt.all(restaurantId);
  },

  getMenuItemById: (id: number) => {
    const stmt = db.prepare('SELECT * FROM menu_items WHERE id = ?');
    return stmt.get(id);
  },

  getMenuItemCategories: (restaurantId: number) => {
    const stmt = db.prepare(`
      SELECT DISTINCT category FROM menu_items 
      WHERE restaurant_id = ? 
      ORDER BY category
    `);
    return stmt.all(restaurantId);
  },

  // Pedidos
  createOrder: (orderData: {
    userId: number;
    restaurantId: number;
    total: number;
    address: string;
    paymentMethod: string;
    notes?: string;
    items: Array<{
      menuItemId: number;
      quantity: number;
      price: number;
      notes?: string;
    }>;
  }) => {
    // Iniciar transacción
    db.exec('BEGIN TRANSACTION');

    try {
      // Insertar orden
      const insertOrderStmt = db.prepare(`
        INSERT INTO orders (user_id, restaurant_id, status, total, address, payment_method, notes)
        VALUES (?, ?, 'pending', ?, ?, ?, ?)
      `);

      const orderResult = insertOrderStmt.run(
        orderData.userId,
        orderData.restaurantId,
        orderData.total,
        orderData.address,
        orderData.paymentMethod,
        orderData.notes || null
      );

      const orderId = orderResult.lastInsertRowid as number;

      // Insertar elementos del pedido
      const insertOrderItemStmt = db.prepare(`
        INSERT INTO order_items (order_id, menu_item_id, quantity, price, notes)
        VALUES (?, ?, ?, ?, ?)
      `);

      orderData.items.forEach(item => {
        insertOrderItemStmt.run(
          orderId,
          item.menuItemId,
          item.quantity,
          item.price,
          item.notes || null
        );
      });

      // Confirmar transacción
      db.exec('COMMIT');

      // Retornar pedido creado
      return {
        id: orderId,
        ...orderData,
        status: 'pending',
        created_at: new Date().toISOString()
      };
    } catch (error) {
      // Revertir transacción en caso de error
      db.exec('ROLLBACK');
      console.error('Error al crear pedido:', error);
      throw new Error('No se pudo crear el pedido');
    }
  },

  getOrdersByUserId: (userId: number) => {
    const stmt = db.prepare(`
      SELECT o.*, r.name as restaurant_name, r.logo as restaurant_logo
      FROM orders o
      JOIN restaurants r ON o.restaurant_id = r.id
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
    `);
    return stmt.all(userId);
  },

  getOrderById: (orderId: number) => {
    // Consultar la orden
    const orderStmt = db.prepare(`
      SELECT o.*, r.name as restaurant_name, r.logo as restaurant_logo, r.address as restaurant_address
      FROM orders o
      JOIN restaurants r ON o.restaurant_id = r.id
      WHERE o.id = ?
    `);
    
    const order = orderStmt.get(orderId);
    
    if (!order) return null;
    
    // Consultar los elementos de la orden
    const itemsStmt = db.prepare(`
      SELECT oi.*, mi.name, mi.description, mi.category, mi.image
      FROM order_items oi
      JOIN menu_items mi ON oi.menu_item_id = mi.id
      WHERE oi.order_id = ?
    `);
    
    const items = itemsStmt.all(orderId);
    
    return { ...order, items };
  },

  updateOrderStatus: (orderId: number, status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled') => {
    const stmt = db.prepare(`
      UPDATE orders SET 
        status = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    
    return stmt.run(status, orderId);
  },

  // Estadísticas para Dashboard
  getUserStats: (userId: number) => {
    // Total de pedidos
    const totalOrdersStmt = db.prepare('SELECT COUNT(*) as count FROM orders WHERE user_id = ?');
    const totalOrders = totalOrdersStmt.get(userId);
    
    // Pedidos recientes
    const recentOrdersStmt = db.prepare(`
      SELECT o.*, r.name as restaurant_name 
      FROM orders o
      JOIN restaurants r ON o.restaurant_id = r.id
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
      LIMIT 5
    `);
    const recentOrders = recentOrdersStmt.all(userId);
    
    // Restaurantes favoritos (más pedidos)
    const favRestaurantsStmt = db.prepare(`
      SELECT r.id, r.name, r.logo, r.rating, COUNT(o.id) as order_count
      FROM restaurants r
      JOIN orders o ON r.id = o.restaurant_id
      WHERE o.user_id = ?
      GROUP BY r.id
      ORDER BY order_count DESC
      LIMIT 3
    `);
    const favoriteRestaurants = favRestaurantsStmt.all(userId);
    
    // Total gastado
    const totalSpentStmt = db.prepare('SELECT SUM(total) as total FROM orders WHERE user_id = ?');
    const totalSpent = totalSpentStmt.get(userId);
    
    return {
      totalOrders: totalOrders?.count || 0,
      recentOrders,
      favoriteRestaurants,
      totalSpent: totalSpent?.total || 0
    };
  }
};

// Inicializar la base de datos al cargar el módulo
initializeDatabase();

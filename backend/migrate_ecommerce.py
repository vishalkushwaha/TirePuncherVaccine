import psycopg

def run_migration():
    conn = psycopg.connect('postgresql://postgres@127.0.0.1:5433/postgres')
    cur = conn.cursor()

    # 1. Customers Table
    cur.execute('''
    CREATE TABLE IF NOT EXISTS customers (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE,
        phone VARCHAR(20) UNIQUE NOT NULL,
        hashed_password VARCHAR(255),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    ''')

    # 2. Customer Addresses Table
    cur.execute('''
    CREATE TABLE IF NOT EXISTS customer_addresses (
        id SERIAL PRIMARY KEY,
        customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
        address_line VARCHAR(255) NOT NULL,
        city VARCHAR(100) NOT NULL,
        district VARCHAR(100),
        state VARCHAR(100) DEFAULT 'Rajasthan',
        pin_code VARCHAR(10) NOT NULL,
        is_default BOOLEAN DEFAULT FALSE
    );
    ''')

    # 3. Orders Table
    cur.execute('''
    CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        order_number VARCHAR(30) UNIQUE NOT NULL,
        customer_id INTEGER REFERENCES customers(id) ON DELETE SET NULL,
        customer_name VARCHAR(100) NOT NULL,
        customer_phone VARCHAR(20) NOT NULL,
        customer_email VARCHAR(100),
        shipping_address TEXT NOT NULL,
        city VARCHAR(100) NOT NULL,
        state VARCHAR(100) DEFAULT 'Rajasthan',
        pin_code VARCHAR(10) NOT NULL,
        subtotal FLOAT NOT NULL,
        discount_amount FLOAT DEFAULT 0,
        shipping_fee FLOAT DEFAULT 0,
        total_amount FLOAT NOT NULL,
        payment_method VARCHAR(30) DEFAULT 'COD',
        payment_status VARCHAR(30) DEFAULT 'Pending',
        order_status VARCHAR(30) DEFAULT 'New',
        tracking_number VARCHAR(100),
        shipping_partner VARCHAR(100),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    ''')

    # 4. Order Items Table
    cur.execute('''
    CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id),
        product_code VARCHAR(50) NOT NULL,
        product_name VARCHAR(100) NOT NULL,
        quantity INTEGER NOT NULL,
        unit_price FLOAT NOT NULL,
        total_price FLOAT NOT NULL
    );
    ''')

    # 5. Abandoned Carts Table
    cur.execute('''
    CREATE TABLE IF NOT EXISTS abandoned_carts (
        id SERIAL PRIMARY KEY,
        cart_session_id VARCHAR(100) UNIQUE NOT NULL,
        customer_name VARCHAR(100),
        phone VARCHAR(20),
        email VARCHAR(100),
        items_json TEXT NOT NULL,
        cart_value FLOAT NOT NULL,
        step_reached VARCHAR(50) DEFAULT 'Cart',
        status VARCHAR(30) DEFAULT 'Abandoned',
        recovery_notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    ''')

    # 6. Coupons Table
    cur.execute('''
    CREATE TABLE IF NOT EXISTS coupons (
        id SERIAL PRIMARY KEY,
        code VARCHAR(30) UNIQUE NOT NULL,
        discount_type VARCHAR(20) DEFAULT 'percentage',
        discount_value FLOAT NOT NULL,
        min_order_value FLOAT DEFAULT 0,
        max_discount FLOAT,
        is_active BOOLEAN DEFAULT TRUE,
        expires_at TIMESTAMP
    );
    ''')

    # 7. Audit Trail Logs Table
    cur.execute('''
    CREATE TABLE IF NOT EXISTS audit_logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        username VARCHAR(100),
        action VARCHAR(100) NOT NULL,
        details TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    ''')

    # 8. Alter Products Table
    cur.execute('ALTER TABLE products ADD COLUMN IF NOT EXISTS sku VARCHAR(50);')
    cur.execute('ALTER TABLE products ADD COLUMN IF NOT EXISTS stock_quantity INTEGER DEFAULT 500;')
    cur.execute('ALTER TABLE products ADD COLUMN IF NOT EXISTS low_stock_threshold INTEGER DEFAULT 20;')
    cur.execute('ALTER TABLE products ADD COLUMN IF NOT EXISTS allow_direct_purchase BOOLEAN DEFAULT TRUE;')
    cur.execute('ALTER TABLE products ADD COLUMN IF NOT EXISTS allow_quote BOOLEAN DEFAULT TRUE;')

    conn.commit()

    # Populate initial SKUs and stock if null
    cur.execute("UPDATE products SET sku = 'TPV-GULF-1L', stock_quantity = 350 WHERE code = 'gulf' AND (sku IS NULL OR stock_quantity IS NULL);")
    cur.execute("UPDATE products SET sku = 'TPV-ROCK-1L', stock_quantity = 500 WHERE code = 'rock' AND (sku IS NULL OR stock_quantity IS NULL);")
    cur.execute("UPDATE products SET sku = 'TPV-THOR-1L', stock_quantity = 420 WHERE code = 'thor' AND (sku IS NULL OR stock_quantity IS NULL);")

    # Seed default business settings in site_settings (Initial Default: Mode A - Quotation Only)
    default_business_settings = [
        ('business_mode', 'quotation', 'Active Business Mode: quotation, ecommerce, or hybrid'),
        ('ecommerce_enabled', 'false', 'Master E-commerce enablement flag'),
        ('allow_add_to_cart', 'false', 'Enable Add to Cart drawer & cart page'),
        ('allow_buy_now', 'false', 'Enable 1-click Buy Now checkout'),
        ('allow_guest_checkout', 'false', 'Allow checkout without customer registration'),
        ('allow_customer_registration', 'false', 'Enable customer account registration and login'),
        ('enable_cod', 'false', 'Enable Cash on Delivery payment option'),
        ('enable_online_payment', 'false', 'Enable online payment gateway (Cards, NetBanking, UPI)'),
        ('enable_coupons', 'false', 'Enable promo coupon code discounts at checkout'),
        ('enable_abandoned_cart_tracking', 'true', 'Track customer cart drop-offs for WhatsApp recovery'),
        ('enable_order_tracking', 'true', 'Enable live courier order status tracking'),
        ('enable_returns_refunds', 'false', 'Enable customer return and replacement requests'),
        ('free_shipping_threshold', '1999', 'Order subtotal threshold for Free Delivery across India'),
        ('default_shipping_fee', '99', 'Standard shipping fee when subtotal is below free threshold'),
        ('support_phone', '+91 74130 59364', 'Customer support and order inquiry helpline'),
        ('dispatch_warehouse', 'Rani Bazar, Industrial Area, Bikaner, Rajasthan', 'Central fulfillment and dispatch facility')
    ]

    for key, val, desc in default_business_settings:
        cur.execute(
            "INSERT INTO site_settings (key, value, description) VALUES (%s, %s, %s) "
            "ON CONFLICT (key) DO UPDATE SET description = EXCLUDED.description;",
            (key, val, desc)
        )

    # Seed starter promo coupons
    cur.execute("INSERT INTO coupons (code, discount_type, discount_value, min_order_value, max_discount, is_active) VALUES ('WELCOME10', 'percentage', 10, 500, 300, true) ON CONFLICT (code) DO NOTHING;")
    cur.execute("INSERT INTO coupons (code, discount_type, discount_value, min_order_value, max_discount, is_active) VALUES ('BIKANERFREESHIP', 'flat', 99, 999, 99, true) ON CONFLICT (code) DO NOTHING;")

    conn.commit()
    cur.close()
    conn.close()
    print("ALL E-COMMERCE DATABASE TABLES AND SETTINGS MIGRATED SUCCESSFULLY!")

if __name__ == '__main__':
    run_migration()


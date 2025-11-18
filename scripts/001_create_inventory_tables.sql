-- Create products table
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  category text not null,
  price numeric not null,
  image_url text,
  colors text[] default array[]::text[],
  sizes text[] default array[]::text[],
  in_stock boolean default true,
  sku text unique,
  rating numeric default 5,
  reviews_count integer default 0,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Create inventory table
create table if not exists public.inventory (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  size text not null,
  color text not null,
  quantity integer not null default 0,
  created_at timestamp default now(),
  updated_at timestamp default now(),
  unique(product_id, size, color)
);

-- Create orders table
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  status text default 'pending',
  total_amount numeric not null,
  shipping_address text,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Create order_items table
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id),
  quantity integer not null,
  price numeric not null,
  size text,
  color text,
  created_at timestamp default now()
);

-- Create indexes for better query performance
create index if not exists idx_products_category on public.products(category);
create index if not exists idx_inventory_product_id on public.inventory(product_id);
create index if not exists idx_orders_user_id on public.orders(user_id);
create index if not exists idx_order_items_order_id on public.order_items(order_id);

-- Insert sample products
insert into public.products (name, description, category, price, sku, image_url) values
  ('Signature Tracksuit', 'Premium cotton blend tracksuit with DBS signature branding', 'Tracksuits', 15000, 'DBS-TRACK-001', 'signature-tracksuit'),
  ('Premium Hoodie', '100% premium cotton hoodie with embroidered DBS logo', 'Hoodies', 8500, 'DBS-HOOD-002', 'premium-hoodie'),
  ('DBS T-Shirt', 'Classic t-shirt perfect for everyday wear', 'T-Shirts', 3500, 'DBS-TSHIRT-003', 'dbs-tshirt'),
  ('Cargo Pants', 'Stylish cargo pants with multiple pockets', 'Pants', 12000, 'DBS-CARGO-004', 'cargo-pants'),
  ('Classic Cap', 'Adjustable classic cap with embroidered DBS logo', 'Accessories', 2500, 'DBS-CAP-005', 'classic-cap'),
  ('Oversized Jacket', 'Premium oversized jacket for statement style', 'Jackets', 18000, 'DBS-JACKET-006', 'oversized-jacket'),
  ('Sport Shorts', 'Comfortable sport shorts with breathable fabric', 'Shorts', 5500, 'DBS-SHORTS-007', 'sport-shorts'),
  ('Beanie Set', 'Premium beanie in multiple colors', 'Accessories', 3000, 'DBS-BEANIE-008', 'beanie-set'),
  ('Premium Socks', 'High-quality socks with DBS branding', 'Accessories', 1500, 'DBS-SOCKS-009', 'premium-socks'),
  ('Athletic Leggings', 'High-waist leggings perfect for fitness and casual wear', 'Pants', 7500, 'DBS-LEGGINGS-010', 'athletic-leggings');

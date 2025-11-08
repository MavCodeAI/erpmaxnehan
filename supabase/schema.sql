-- ERPMAX Database Schema for Supabase
-- Run this in your Supabase SQL Editor

-- Accounts Table
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('Asset', 'Liability', 'Equity', 'Revenue', 'Expense')),
  account_type VARCHAR(50),
  opening_balance DECIMAL(15,2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'Active',
  is_posting_account BOOLEAN DEFAULT true,
  description TEXT,
  parent_code VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customers Table
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_type VARCHAR(20) DEFAULT 'Business',
  salutation VARCHAR(10),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  company_name VARCHAR(255),
  display_name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  work_phone VARCHAR(30),
  mobile_phone VARCHAR(30),
  currency VARCHAR(10) DEFAULT 'PKR',
  opening_balance DECIMAL(15,2) DEFAULT 0,
  payment_terms VARCHAR(100),
  tax_id VARCHAR(50),
  notes TEXT,
  language VARCHAR(10) DEFAULT 'en',
  enable_portal BOOLEAN DEFAULT false,
  billing_address JSONB,
  shipping_address JSONB,
  status VARCHAR(20) DEFAULT 'Active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vendors Table
CREATE TABLE vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salutation VARCHAR(10),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  company_name VARCHAR(255),
  display_name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  work_phone VARCHAR(30),
  mobile_phone VARCHAR(30),
  currency VARCHAR(10) DEFAULT 'PKR',
  payment_terms VARCHAR(100),
  tax_id VARCHAR(50),
  company_id VARCHAR(50),
  website VARCHAR(255),
  remarks TEXT,
  status VARCHAR(20) DEFAULT 'Active',
  billing_address JSONB,
  shipping_address JSONB,
  opening_balance DECIMAL(15,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Item Groups Table
CREATE TABLE item_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES item_groups(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inventory Items Table
CREATE TABLE inventory_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_type VARCHAR(20) DEFAULT 'Goods',
  name VARCHAR(255) NOT NULL,
  sku VARCHAR(50) UNIQUE NOT NULL,
  unit VARCHAR(50),
  selling_price DECIMAL(15,2),
  cost_price DECIMAL(15,2),
  opening_stock DECIMAL(15,2) DEFAULT 0,
  current_stock DECIMAL(15,2) DEFAULT 0,
  sales_description TEXT,
  purchase_description TEXT,
  item_group_id UUID REFERENCES item_groups(id),
  status VARCHAR(20) DEFAULT 'Active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invoices Table
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  due_date DATE NOT NULL,
  salesperson VARCHAR(100),
  subject VARCHAR(255),
  items JSONB NOT NULL,
  notes TEXT,
  terms_and_conditions TEXT,
  shipping_charges DECIMAL(15,2) DEFAULT 0,
  adjustment DECIMAL(15,2) DEFAULT 0,
  subtotal DECIMAL(15,2) NOT NULL,
  total_tax DECIMAL(15,2) DEFAULT 0,
  total DECIMAL(15,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'Draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Purchase Bills Table
CREATE TABLE purchase_bills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bill_number VARCHAR(50) UNIQUE NOT NULL,
  vendor_id UUID REFERENCES vendors(id) NOT NULL,
  vendor_name VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  due_date DATE NOT NULL,
  items JSONB NOT NULL,
  notes TEXT,
  terms_and_conditions TEXT,
  shipping_charges DECIMAL(15,2) DEFAULT 0,
  adjustment DECIMAL(15,2) DEFAULT 0,
  subtotal DECIMAL(15,2) NOT NULL,
  total_tax DECIMAL(15,2) DEFAULT 0,
  total DECIMAL(15,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'Draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_customers_display_name ON customers(display_name);
CREATE INDEX idx_vendors_display_name ON vendors(display_name);
CREATE INDEX idx_inventory_items_sku ON inventory_items(sku);
CREATE INDEX idx_invoices_customer_id ON invoices(customer_id);
CREATE INDEX idx_purchase_bills_vendor_id ON purchase_bills(vendor_id);
CREATE INDEX idx_invoices_date ON invoices(date);
CREATE INDEX idx_purchase_bills_date ON purchase_bills(date);

-- Enable RLS (Row Level Security)
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_bills ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public access (for demo purposes)
-- In production, you should restrict these to authenticated users
CREATE POLICY "Enable read access for all users" ON accounts FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON accounts FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON accounts FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON accounts FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON customers FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON customers FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON customers FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON vendors FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON vendors FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON vendors FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON vendors FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON item_groups FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON item_groups FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON item_groups FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON item_groups FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON inventory_items FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON inventory_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON inventory_items FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON inventory_items FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON invoices FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON invoices FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON invoices FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON invoices FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON purchase_bills FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON purchase_bills FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON purchase_bills FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON purchase_bills FOR DELETE USING (true);

-- Functions for auto-updating updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON vendors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_item_groups_updated_at BEFORE UPDATE ON item_groups FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inventory_items_updated_at BEFORE UPDATE ON inventory_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_purchase_bills_updated_at BEFORE UPDATE ON purchase_bills FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

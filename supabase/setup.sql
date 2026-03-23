-- =====================================================
-- BARBERPLUS - SETUP COMPLETO (executar no SQL Editor do Supabase)
-- Este script cria todas as tabelas, índices, funções e triggers
-- Ele usa DROP IF EXISTS para poder ser re-executado sem erros
-- =====================================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- ENUMS (criar apenas se não existem)
-- =====================================================

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('client', 'professional', 'manager', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE appointment_status AS ENUM ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'refunded', 'failed');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_method AS ENUM ('cash', 'credit_card', 'debit_card', 'pix', 'transfer', 'deposit');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE transaction_type AS ENUM ('income', 'expense', 'commission', 'deposit', 'refund');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE queue_status AS ENUM ('waiting', 'called', 'in_service', 'completed', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE day_of_week AS ENUM ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE automation_trigger AS ENUM ('appointment_created', 'appointment_reminder', 'appointment_confirmed', 'appointment_cancelled', 'review_request', 'birthday', 'loyalty_reward', 'welcome');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE subscription_plan AS ENUM ('free', 'basic', 'professional', 'enterprise');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- =====================================================
-- TABELAS
-- =====================================================

-- USERS
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255),
    full_name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    role user_role DEFAULT 'client',
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    push_token TEXT,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);

-- BARBERSHOPS
CREATE TABLE IF NOT EXISTS barbershops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    logo_url TEXT,
    cover_url TEXT,
    email VARCHAR(255),
    phone VARCHAR(20),
    whatsapp VARCHAR(20),
    website VARCHAR(255),
    address_street VARCHAR(255),
    address_number VARCHAR(20),
    address_complement VARCHAR(100),
    address_neighborhood VARCHAR(100),
    address_city VARCHAR(100),
    address_state VARCHAR(50),
    address_zip VARCHAR(20),
    address_country VARCHAR(50) DEFAULT 'Brasil',
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    subscription_plan subscription_plan DEFAULT 'free',
    subscription_expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    anti_fault_enabled BOOLEAN DEFAULT FALSE,
    anti_fault_deposit_amount DECIMAL(10, 2) DEFAULT 0,
    anti_fault_hours_limit INTEGER DEFAULT 24,
    queue_enabled BOOLEAN DEFAULT FALSE,
    queue_average_time INTEGER DEFAULT 30,
    whatsapp_bot_enabled BOOLEAN DEFAULT FALSE,
    whatsapp_instance_id VARCHAR(255),
    rating_average DECIMAL(2, 1) DEFAULT 0,
    rating_count INTEGER DEFAULT 0,
    total_appointments INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_barbershops_slug ON barbershops(slug);
CREATE INDEX IF NOT EXISTS idx_barbershops_owner ON barbershops(owner_id);
CREATE INDEX IF NOT EXISTS idx_barbershops_location ON barbershops(latitude, longitude);

-- BARBERSHOP_GALLERY
CREATE TABLE IF NOT EXISTS barbershop_gallery (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    barbershop_id UUID REFERENCES barbershops(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption VARCHAR(255),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gallery_barbershop ON barbershop_gallery(barbershop_id);

-- BARBERSHOP_AMENITIES
CREATE TABLE IF NOT EXISTS barbershop_amenities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    barbershop_id UUID REFERENCES barbershops(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_amenities_barbershop ON barbershop_amenities(barbershop_id);

-- PROFESSIONALS
CREATE TABLE IF NOT EXISTS professionals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    barbershop_id UUID REFERENCES barbershops(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    nickname VARCHAR(100),
    bio TEXT,
    avatar_url TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    accepts_online_booking BOOLEAN DEFAULT TRUE,
    commission_percentage DECIMAL(5, 2) DEFAULT 50.00,
    rating_average DECIMAL(2, 1) DEFAULT 0,
    rating_count INTEGER DEFAULT 0,
    total_appointments INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_professionals_barbershop ON professionals(barbershop_id);
CREATE INDEX IF NOT EXISTS idx_professionals_user ON professionals(user_id);

-- WORKING_HOURS
CREATE TABLE IF NOT EXISTS working_hours (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    barbershop_id UUID REFERENCES barbershops(id) ON DELETE CASCADE,
    professional_id UUID,
    day_of_week day_of_week NOT NULL,
    open_time TIME NOT NULL,
    close_time TIME NOT NULL,
    break_start TIME,
    break_end TIME,
    is_closed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_working_hours_barbershop ON working_hours(barbershop_id);
CREATE INDEX IF NOT EXISTS idx_working_hours_professional ON working_hours(professional_id);

-- SERVICES
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    barbershop_id UUID REFERENCES barbershops(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    image_url TEXT,
    price DECIMAL(10, 2) NOT NULL,
    promotional_price DECIMAL(10, 2),
    duration_minutes INTEGER NOT NULL DEFAULT 30,
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    requires_deposit BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_services_barbershop ON services(barbershop_id);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);

-- SERVICE_PROFESSIONALS
CREATE TABLE IF NOT EXISTS service_professionals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    professional_id UUID REFERENCES professionals(id) ON DELETE CASCADE,
    custom_price DECIMAL(10, 2),
    custom_duration INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(service_id, professional_id)
);

CREATE INDEX IF NOT EXISTS idx_service_professionals_service ON service_professionals(service_id);
CREATE INDEX IF NOT EXISTS idx_service_professionals_professional ON service_professionals(professional_id);

-- CLIENTS
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    barbershop_id UUID REFERENCES barbershops(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    avatar_url TEXT,
    birth_date DATE,
    notes TEXT,
    preferred_style TEXT,
    last_cut_photo_url TEXT,
    last_cut_notes TEXT,
    hair_type VARCHAR(50),
    beard_style VARCHAR(50),
    total_visits INTEGER DEFAULT 0,
    total_spent DECIMAL(10, 2) DEFAULT 0,
    last_visit TIMESTAMP WITH TIME ZONE,
    loyalty_points INTEGER DEFAULT 0,
    loyalty_stamps INTEGER DEFAULT 0,
    tags TEXT[],
    no_show_count INTEGER DEFAULT 0,
    is_blocked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, barbershop_id)
);

CREATE INDEX IF NOT EXISTS idx_clients_barbershop ON clients(barbershop_id);
CREATE INDEX IF NOT EXISTS idx_clients_user ON clients(user_id);
CREATE INDEX IF NOT EXISTS idx_clients_phone ON clients(phone);

-- CLIENT_HISTORY
CREATE TABLE IF NOT EXISTS client_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    appointment_id UUID,
    professional_id UUID REFERENCES professionals(id) ON DELETE SET NULL,
    services_performed TEXT[],
    style_description TEXT,
    photo_before_url TEXT,
    photo_after_url TEXT,
    professional_notes TEXT,
    products_used TEXT[],
    client_feedback TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_client_history_client ON client_history(client_id);

-- APPOINTMENTS
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    barbershop_id UUID REFERENCES barbershops(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    professional_id UUID REFERENCES professionals(id) ON DELETE SET NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status appointment_status DEFAULT 'pending',
    total_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    final_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    payment_status payment_status DEFAULT 'pending',
    payment_method payment_method,
    paid_at TIMESTAMP WITH TIME ZONE,
    deposit_amount DECIMAL(10, 2) DEFAULT 0,
    deposit_paid BOOLEAN DEFAULT FALSE,
    deposit_refunded BOOLEAN DEFAULT FALSE,
    client_notes TEXT,
    internal_notes TEXT,
    is_repeat_last_cut BOOLEAN DEFAULT FALSE,
    confirmed_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    cancelled_reason TEXT,
    completed_at TIMESTAMP WITH TIME ZONE,
    source VARCHAR(50) DEFAULT 'app',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_appointments_barbershop ON appointments(barbershop_id);
CREATE INDEX IF NOT EXISTS idx_appointments_client ON appointments(client_id);
CREATE INDEX IF NOT EXISTS idx_appointments_professional ON appointments(professional_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);

-- APPOINTMENT_SERVICES
CREATE TABLE IF NOT EXISTS appointment_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id) ON DELETE SET NULL,
    service_name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    duration_minutes INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_appointment_services_appointment ON appointment_services(appointment_id);

-- QUEUE
CREATE TABLE IF NOT EXISTS queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    barbershop_id UUID REFERENCES barbershops(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    professional_id UUID REFERENCES professionals(id) ON DELETE SET NULL,
    client_name VARCHAR(255),
    client_phone VARCHAR(20),
    position INTEGER NOT NULL,
    status queue_status DEFAULT 'waiting',
    services TEXT[],
    estimated_duration INTEGER DEFAULT 30,
    check_in_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    called_at TIMESTAMP WITH TIME ZONE,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_queue_barbershop ON queue(barbershop_id);
CREATE INDEX IF NOT EXISTS idx_queue_status ON queue(status);

-- TRANSACTIONS
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    barbershop_id UUID REFERENCES barbershops(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    professional_id UUID REFERENCES professionals(id) ON DELETE SET NULL,
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    type transaction_type NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    payment_method payment_method,
    reference_id VARCHAR(255),
    transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transactions_barbershop ON transactions(barbershop_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);

-- COMMISSIONS
CREATE TABLE IF NOT EXISTS commissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    barbershop_id UUID REFERENCES barbershops(id) ON DELETE CASCADE,
    professional_id UUID REFERENCES professionals(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    transaction_id UUID REFERENCES transactions(id) ON DELETE SET NULL,
    service_total DECIMAL(10, 2) NOT NULL,
    commission_percentage DECIMAL(5, 2) NOT NULL,
    commission_amount DECIMAL(10, 2) NOT NULL,
    is_paid BOOLEAN DEFAULT FALSE,
    paid_at TIMESTAMP WITH TIME ZONE,
    period_start DATE,
    period_end DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_commissions_barbershop ON commissions(barbershop_id);
CREATE INDEX IF NOT EXISTS idx_commissions_professional ON commissions(professional_id);

-- CASH_REGISTER
CREATE TABLE IF NOT EXISTS cash_register (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    barbershop_id UUID REFERENCES barbershops(id) ON DELETE CASCADE,
    professional_id UUID REFERENCES professionals(id) ON DELETE SET NULL,
    date DATE NOT NULL,
    opening_amount DECIMAL(10, 2) DEFAULT 0,
    closing_amount DECIMAL(10, 2),
    total_cash DECIMAL(10, 2) DEFAULT 0,
    total_card DECIMAL(10, 2) DEFAULT 0,
    total_pix DECIMAL(10, 2) DEFAULT 0,
    total_other DECIMAL(10, 2) DEFAULT 0,
    total_income DECIMAL(10, 2) DEFAULT 0,
    total_expense DECIMAL(10, 2) DEFAULT 0,
    is_open BOOLEAN DEFAULT TRUE,
    opened_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    closed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(barbershop_id, date)
);

CREATE INDEX IF NOT EXISTS idx_cash_register_barbershop ON cash_register(barbershop_id);
CREATE INDEX IF NOT EXISTS idx_cash_register_date ON cash_register(date);

-- REVIEWS
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    barbershop_id UUID REFERENCES barbershops(id) ON DELETE CASCADE,
    professional_id UUID REFERENCES professionals(id) ON DELETE SET NULL,
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    reply TEXT,
    replied_at TIMESTAMP WITH TIME ZONE,
    is_visible BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_barbershop ON reviews(barbershop_id);
CREATE INDEX IF NOT EXISTS idx_reviews_professional ON reviews(professional_id);

-- LOYALTY_PROGRAMS
CREATE TABLE IF NOT EXISTS loyalty_programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    barbershop_id UUID REFERENCES barbershops(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL DEFAULT 'Cartão Fidelidade',
    description TEXT,
    stamps_required INTEGER NOT NULL DEFAULT 10,
    reward_type VARCHAR(50) DEFAULT 'free_service',
    reward_value DECIMAL(10, 2),
    reward_service_id UUID REFERENCES services(id) ON DELETE SET NULL,
    reward_description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    stamps_expire_days INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_loyalty_programs_barbershop ON loyalty_programs(barbershop_id);

-- LOYALTY_CARDS
CREATE TABLE IF NOT EXISTS loyalty_cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_id UUID REFERENCES loyalty_programs(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    stamps_collected INTEGER DEFAULT 0,
    rewards_claimed INTEGER DEFAULT 0,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(program_id, client_id)
);

CREATE INDEX IF NOT EXISTS idx_loyalty_cards_program ON loyalty_cards(program_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_cards_client ON loyalty_cards(client_id);

-- LOYALTY_STAMPS
CREATE TABLE IF NOT EXISTS loyalty_stamps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    card_id UUID REFERENCES loyalty_cards(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_loyalty_stamps_card ON loyalty_stamps(card_id);

-- WHATSAPP_AUTOMATIONS
CREATE TABLE IF NOT EXISTS whatsapp_automations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    barbershop_id UUID REFERENCES barbershops(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    trigger_type automation_trigger NOT NULL,
    delay_minutes INTEGER DEFAULT 0,
    send_time TIME,
    message_template TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    total_sent INTEGER DEFAULT 0,
    last_sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_whatsapp_automations_barbershop ON whatsapp_automations(barbershop_id);

-- WHATSAPP_MESSAGES
CREATE TABLE IF NOT EXISTS whatsapp_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    barbershop_id UUID REFERENCES barbershops(id) ON DELETE CASCADE,
    automation_id UUID REFERENCES whatsapp_automations(id) ON DELETE SET NULL,
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    phone VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    read_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_barbershop ON whatsapp_messages(barbershop_id);

-- LINK_BIO
CREATE TABLE IF NOT EXISTS link_bio (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    barbershop_id UUID REFERENCES barbershops(id) ON DELETE CASCADE,
    custom_slug VARCHAR(100) UNIQUE,
    theme VARCHAR(50) DEFAULT 'dark',
    primary_color VARCHAR(20) DEFAULT '#F59E0B',
    background_type VARCHAR(20) DEFAULT 'solid',
    background_value TEXT,
    title VARCHAR(255),
    bio TEXT,
    avatar_url TEXT,
    instagram_url TEXT,
    facebook_url TEXT,
    tiktok_url TEXT,
    youtube_url TEXT,
    total_views INTEGER DEFAULT 0,
    total_clicks INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(barbershop_id)
);

CREATE INDEX IF NOT EXISTS idx_link_bio_slug ON link_bio(custom_slug);

-- LINK_BIO_LINKS
CREATE TABLE IF NOT EXISTS link_bio_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    link_bio_id UUID REFERENCES link_bio(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    icon VARCHAR(50),
    style VARCHAR(20) DEFAULT 'default',
    clicks INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_link_bio_links_bio ON link_bio_links(link_bio_id);

-- NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    barbershop_id UUID REFERENCES barbershops(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50),
    action_url TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_barbershop ON notifications(barbershop_id);

-- ANTI_FAULT_DEPOSITS
CREATE TABLE IF NOT EXISTS anti_fault_deposits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    barbershop_id UUID REFERENCES barbershops(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method payment_method,
    payment_reference VARCHAR(255),
    status VARCHAR(20) DEFAULT 'pending',
    paid_at TIMESTAMP WITH TIME ZONE,
    refunded_at TIMESTAMP WITH TIME ZONE,
    forfeited_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_deposits_barbershop ON anti_fault_deposits(barbershop_id);
CREATE INDEX IF NOT EXISTS idx_deposits_appointment ON anti_fault_deposits(appointment_id);

-- BLOCKED_TIMES
CREATE TABLE IF NOT EXISTS blocked_times (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    barbershop_id UUID REFERENCES barbershops(id) ON DELETE CASCADE,
    professional_id UUID REFERENCES professionals(id) ON DELETE CASCADE,
    start_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
    end_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
    reason VARCHAR(255),
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_rule TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blocked_times_barbershop ON blocked_times(barbershop_id);
CREATE INDEX IF NOT EXISTS idx_blocked_times_professional ON blocked_times(professional_id);

-- MARKETPLACE_CATEGORIES
CREATE TABLE IF NOT EXISTS marketplace_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    icon VARCHAR(50),
    image_url TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- BARBERSHOP_CATEGORIES
CREATE TABLE IF NOT EXISTS barbershop_categories (
    barbershop_id UUID REFERENCES barbershops(id) ON DELETE CASCADE,
    category_id UUID REFERENCES marketplace_categories(id) ON DELETE CASCADE,
    PRIMARY KEY (barbershop_id, category_id)
);

-- PROMOTIONS
CREATE TABLE IF NOT EXISTS promotions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    barbershop_id UUID REFERENCES barbershops(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT,
    discount_type VARCHAR(20) DEFAULT 'percentage',
    discount_value DECIMAL(10, 2) NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    min_value DECIMAL(10, 2),
    max_uses INTEGER,
    uses_count INTEGER DEFAULT 0,
    promo_code VARCHAR(50) UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_promotions_barbershop ON promotions(barbershop_id);

-- FAVORITES
CREATE TABLE IF NOT EXISTS favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    barbershop_id UUID REFERENCES barbershops(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, barbershop_id)
);

CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at (usando DROP IF EXISTS para ser idempotente)
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_barbershops_updated_at ON barbershops;
CREATE TRIGGER update_barbershops_updated_at BEFORE UPDATE ON barbershops FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_professionals_updated_at ON professionals;
CREATE TRIGGER update_professionals_updated_at BEFORE UPDATE ON professionals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_services_updated_at ON services;
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_clients_updated_at ON clients;
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_appointments_updated_at ON appointments;
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_reviews_updated_at ON reviews;
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_working_hours_updated_at ON working_hours;
CREATE TRIGGER update_working_hours_updated_at BEFORE UPDATE ON working_hours FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_loyalty_programs_updated_at ON loyalty_programs;
CREATE TRIGGER update_loyalty_programs_updated_at BEFORE UPDATE ON loyalty_programs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_loyalty_cards_updated_at ON loyalty_cards;
CREATE TRIGGER update_loyalty_cards_updated_at BEFORE UPDATE ON loyalty_cards FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_whatsapp_automations_updated_at ON whatsapp_automations;
CREATE TRIGGER update_whatsapp_automations_updated_at BEFORE UPDATE ON whatsapp_automations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_link_bio_updated_at ON link_bio;
CREATE TRIGGER update_link_bio_updated_at BEFORE UPDATE ON link_bio FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_cash_register_updated_at ON cash_register;
CREATE TRIGGER update_cash_register_updated_at BEFORE UPDATE ON cash_register FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Função para atualizar rating da barbearia
CREATE OR REPLACE FUNCTION update_barbershop_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE barbershops
    SET
        rating_average = (
            SELECT COALESCE(AVG(rating), 0)
            FROM reviews
            WHERE barbershop_id = COALESCE(NEW.barbershop_id, OLD.barbershop_id)
            AND is_visible = TRUE
        ),
        rating_count = (
            SELECT COUNT(*)
            FROM reviews
            WHERE barbershop_id = COALESCE(NEW.barbershop_id, OLD.barbershop_id)
            AND is_visible = TRUE
        )
    WHERE id = COALESCE(NEW.barbershop_id, OLD.barbershop_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_barbershop_rating_on_review ON reviews;
CREATE TRIGGER update_barbershop_rating_on_review
AFTER INSERT OR UPDATE OR DELETE ON reviews
FOR EACH ROW EXECUTE FUNCTION update_barbershop_rating();

-- Função para atualizar rating do profissional
CREATE OR REPLACE FUNCTION update_professional_rating()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.professional_id IS NOT NULL THEN
        UPDATE professionals
        SET
            rating_average = (
                SELECT COALESCE(AVG(rating), 0)
                FROM reviews
                WHERE professional_id = NEW.professional_id
                AND is_visible = TRUE
            ),
            rating_count = (
                SELECT COUNT(*)
                FROM reviews
                WHERE professional_id = NEW.professional_id
                AND is_visible = TRUE
            )
        WHERE id = NEW.professional_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_professional_rating_on_review ON reviews;
CREATE TRIGGER update_professional_rating_on_review
AFTER INSERT OR UPDATE ON reviews
FOR EACH ROW EXECUTE FUNCTION update_professional_rating();

-- Função para atualizar estatísticas do cliente
CREATE OR REPLACE FUNCTION update_client_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        UPDATE clients
        SET
            total_visits = total_visits + 1,
            total_spent = total_spent + NEW.final_price,
            last_visit = NOW()
        WHERE id = NEW.client_id;

        UPDATE barbershops
        SET total_appointments = total_appointments + 1
        WHERE id = NEW.barbershop_id;

        IF NEW.professional_id IS NOT NULL THEN
            UPDATE professionals
            SET total_appointments = total_appointments + 1
            WHERE id = NEW.professional_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_client_stats_on_appointment ON appointments;
CREATE TRIGGER update_client_stats_on_appointment
AFTER UPDATE ON appointments
FOR EACH ROW EXECUTE FUNCTION update_client_stats();

-- =====================================================
-- DESABILITAR RLS (usamos service_role key com JWT customizado)
-- O app usa JWT próprio, não o auth do Supabase
-- =====================================================

ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE barbershops DISABLE ROW LEVEL SECURITY;
ALTER TABLE professionals DISABLE ROW LEVEL SECURITY;
ALTER TABLE services DISABLE ROW LEVEL SECURITY;
ALTER TABLE clients DISABLE ROW LEVEL SECURITY;
ALTER TABLE appointments DISABLE ROW LEVEL SECURITY;
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE queue DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE commissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE cash_register DISABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_programs DISABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_cards DISABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_stamps DISABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_automations DISABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE link_bio DISABLE ROW LEVEL SECURITY;
ALTER TABLE link_bio_links DISABLE ROW LEVEL SECURITY;
ALTER TABLE barbershop_gallery DISABLE ROW LEVEL SECURITY;
ALTER TABLE barbershop_amenities DISABLE ROW LEVEL SECURITY;
ALTER TABLE working_hours DISABLE ROW LEVEL SECURITY;
ALTER TABLE service_professionals DISABLE ROW LEVEL SECURITY;
ALTER TABLE client_history DISABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_services DISABLE ROW LEVEL SECURITY;
ALTER TABLE anti_fault_deposits DISABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_times DISABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE barbershop_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE promotions DISABLE ROW LEVEL SECURITY;
ALTER TABLE favorites DISABLE ROW LEVEL SECURITY;

-- =====================================================
-- SEED DATA - Categorias do Marketplace
-- =====================================================

INSERT INTO marketplace_categories (name, slug, icon, sort_order) VALUES
('Barbearias', 'barbearias', 'lucide:scissors', 1),
('Salões Masculinos', 'saloes-masculinos', 'lucide:user', 2),
('Barber Shops Premium', 'premium', 'lucide:crown', 3),
('Especialistas em Barba', 'barba', 'lucide:sparkles', 4),
('Cortes Modernos', 'modernos', 'lucide:zap', 5),
('Tradicional', 'tradicional', 'lucide:clock', 6),
('Kids', 'kids', 'lucide:baby', 7),
('Express', 'express', 'lucide:timer', 8)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- VIEWS ÚTEIS
-- =====================================================

CREATE OR REPLACE VIEW v_today_appointments AS
SELECT
    a.*,
    c.name as client_name,
    c.phone as client_phone,
    p.name as professional_name,
    b.name as barbershop_name
FROM appointments a
LEFT JOIN clients c ON a.client_id = c.id
LEFT JOIN professionals p ON a.professional_id = p.id
LEFT JOIN barbershops b ON a.barbershop_id = b.id
WHERE a.date = CURRENT_DATE;

CREATE OR REPLACE VIEW v_daily_revenue AS
SELECT
    barbershop_id,
    transaction_date,
    SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
    SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expense,
    SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END) as net_revenue,
    COUNT(DISTINCT CASE WHEN type = 'income' THEN id END) as total_transactions
FROM transactions
GROUP BY barbershop_id, transaction_date;

-- =====================================================
-- SETUP COMPLETO! Todas as tabelas foram criadas.
-- =====================================================

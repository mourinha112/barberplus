-- =====================================================
-- BARBERPLUS - SCHEMA COMPLETO DO BANCO DE DADOS
-- Supabase PostgreSQL
-- =====================================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- ENUMS
-- =====================================================

CREATE TYPE user_role AS ENUM ('client', 'professional', 'manager', 'admin');
CREATE TYPE appointment_status AS ENUM ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'refunded', 'failed');
CREATE TYPE payment_method AS ENUM ('cash', 'credit_card', 'debit_card', 'pix', 'transfer', 'deposit');
CREATE TYPE transaction_type AS ENUM ('income', 'expense', 'commission', 'deposit', 'refund');
CREATE TYPE queue_status AS ENUM ('waiting', 'called', 'in_service', 'completed', 'cancelled');
CREATE TYPE day_of_week AS ENUM ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');
CREATE TYPE automation_trigger AS ENUM ('appointment_created', 'appointment_reminder', 'appointment_confirmed', 'appointment_cancelled', 'review_request', 'birthday', 'loyalty_reward', 'welcome');
CREATE TYPE subscription_plan AS ENUM ('free', 'basic', 'professional', 'enterprise');

-- =====================================================
-- TABELA: USERS (Usuários do sistema)
-- =====================================================

CREATE TABLE users (
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

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);

-- =====================================================
-- TABELA: BARBERSHOPS (Barbearias)
-- =====================================================

CREATE TABLE barbershops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Informações básicas
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    logo_url TEXT,
    cover_url TEXT,
    
    -- Contato
    email VARCHAR(255),
    phone VARCHAR(20),
    whatsapp VARCHAR(20),
    website VARCHAR(255),
    
    -- Endereço
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
    
    -- Configurações
    subscription_plan subscription_plan DEFAULT 'free',
    subscription_expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    
    -- Sistema Anti-Falta
    anti_fault_enabled BOOLEAN DEFAULT FALSE,
    anti_fault_deposit_amount DECIMAL(10, 2) DEFAULT 0,
    anti_fault_hours_limit INTEGER DEFAULT 24,
    
    -- Fila Virtual
    queue_enabled BOOLEAN DEFAULT FALSE,
    queue_average_time INTEGER DEFAULT 30,
    
    -- WhatsApp Bot
    whatsapp_bot_enabled BOOLEAN DEFAULT FALSE,
    whatsapp_instance_id VARCHAR(255),
    
    -- Estatísticas
    rating_average DECIMAL(2, 1) DEFAULT 0,
    rating_count INTEGER DEFAULT 0,
    total_appointments INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_barbershops_slug ON barbershops(slug);
CREATE INDEX idx_barbershops_owner ON barbershops(owner_id);
CREATE INDEX idx_barbershops_location ON barbershops(latitude, longitude);
CREATE INDEX idx_barbershops_featured ON barbershops(is_featured) WHERE is_featured = TRUE;

-- =====================================================
-- TABELA: BARBERSHOP_GALLERY (Galeria de fotos)
-- =====================================================

CREATE TABLE barbershop_gallery (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    barbershop_id UUID REFERENCES barbershops(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption VARCHAR(255),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_gallery_barbershop ON barbershop_gallery(barbershop_id);

-- =====================================================
-- TABELA: BARBERSHOP_AMENITIES (Comodidades)
-- =====================================================

CREATE TABLE barbershop_amenities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    barbershop_id UUID REFERENCES barbershops(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_amenities_barbershop ON barbershop_amenities(barbershop_id);

-- =====================================================
-- TABELA: WORKING_HOURS (Horários de funcionamento)
-- =====================================================

CREATE TABLE working_hours (
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

CREATE INDEX idx_working_hours_barbershop ON working_hours(barbershop_id);
CREATE INDEX idx_working_hours_professional ON working_hours(professional_id);

-- =====================================================
-- TABELA: PROFESSIONALS (Profissionais/Barbeiros)
-- =====================================================

CREATE TABLE professionals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    barbershop_id UUID REFERENCES barbershops(id) ON DELETE CASCADE,
    
    -- Informações
    name VARCHAR(255) NOT NULL,
    nickname VARCHAR(100),
    bio TEXT,
    avatar_url TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    
    -- Configurações
    is_active BOOLEAN DEFAULT TRUE,
    accepts_online_booking BOOLEAN DEFAULT TRUE,
    commission_percentage DECIMAL(5, 2) DEFAULT 50.00,
    
    -- Estatísticas
    rating_average DECIMAL(2, 1) DEFAULT 0,
    rating_count INTEGER DEFAULT 0,
    total_appointments INTEGER DEFAULT 0,
    
    -- Ordem de exibição
    sort_order INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_professionals_barbershop ON professionals(barbershop_id);
CREATE INDEX idx_professionals_user ON professionals(user_id);

-- =====================================================
-- TABELA: SERVICES (Serviços)
-- =====================================================

CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    barbershop_id UUID REFERENCES barbershops(id) ON DELETE CASCADE,
    
    -- Informações
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    image_url TEXT,
    
    -- Preço e duração
    price DECIMAL(10, 2) NOT NULL,
    promotional_price DECIMAL(10, 2),
    duration_minutes INTEGER NOT NULL DEFAULT 30,
    
    -- Configurações
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    requires_deposit BOOLEAN DEFAULT FALSE,
    
    -- Ordem
    sort_order INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_services_barbershop ON services(barbershop_id);
CREATE INDEX idx_services_category ON services(category);

-- =====================================================
-- TABELA: SERVICE_PROFESSIONALS (Serviços por Profissional)
-- =====================================================

CREATE TABLE service_professionals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    professional_id UUID REFERENCES professionals(id) ON DELETE CASCADE,
    custom_price DECIMAL(10, 2),
    custom_duration INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(service_id, professional_id)
);

CREATE INDEX idx_service_professionals_service ON service_professionals(service_id);
CREATE INDEX idx_service_professionals_professional ON service_professionals(professional_id);

-- =====================================================
-- TABELA: CLIENTS (Clientes da Barbearia)
-- =====================================================

CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    barbershop_id UUID REFERENCES barbershops(id) ON DELETE CASCADE,
    
    -- Informações básicas
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    avatar_url TEXT,
    
    -- Informações adicionais
    birth_date DATE,
    notes TEXT,
    
    -- Preferências de corte (IA)
    preferred_style TEXT,
    last_cut_photo_url TEXT,
    last_cut_notes TEXT,
    hair_type VARCHAR(50),
    beard_style VARCHAR(50),
    
    -- Estatísticas
    total_visits INTEGER DEFAULT 0,
    total_spent DECIMAL(10, 2) DEFAULT 0,
    last_visit TIMESTAMP WITH TIME ZONE,
    
    -- Fidelidade
    loyalty_points INTEGER DEFAULT 0,
    loyalty_stamps INTEGER DEFAULT 0,
    
    -- Tags
    tags TEXT[],
    
    -- Anti-Falta
    no_show_count INTEGER DEFAULT 0,
    is_blocked BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, barbershop_id)
);

CREATE INDEX idx_clients_barbershop ON clients(barbershop_id);
CREATE INDEX idx_clients_user ON clients(user_id);
CREATE INDEX idx_clients_phone ON clients(phone);

-- =====================================================
-- TABELA: CLIENT_HISTORY (Histórico de cortes - IA)
-- =====================================================

CREATE TABLE client_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    appointment_id UUID,
    professional_id UUID REFERENCES professionals(id) ON DELETE SET NULL,
    
    -- Detalhes do corte
    services_performed TEXT[],
    style_description TEXT,
    photo_before_url TEXT,
    photo_after_url TEXT,
    
    -- Notas do profissional
    professional_notes TEXT,
    products_used TEXT[],
    
    -- Satisfação
    client_feedback TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_client_history_client ON client_history(client_id);

-- =====================================================
-- TABELA: APPOINTMENTS (Agendamentos)
-- =====================================================

CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    barbershop_id UUID REFERENCES barbershops(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    professional_id UUID REFERENCES professionals(id) ON DELETE SET NULL,
    
    -- Data e hora
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    
    -- Status
    status appointment_status DEFAULT 'pending',
    
    -- Valores
    total_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    final_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    
    -- Pagamento
    payment_status payment_status DEFAULT 'pending',
    payment_method payment_method,
    paid_at TIMESTAMP WITH TIME ZONE,
    
    -- Anti-Falta
    deposit_amount DECIMAL(10, 2) DEFAULT 0,
    deposit_paid BOOLEAN DEFAULT FALSE,
    deposit_refunded BOOLEAN DEFAULT FALSE,
    
    -- Notas
    client_notes TEXT,
    internal_notes TEXT,
    
    -- Repeat Last Cut
    is_repeat_last_cut BOOLEAN DEFAULT FALSE,
    
    -- Controle
    confirmed_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    cancelled_reason TEXT,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Origem
    source VARCHAR(50) DEFAULT 'app',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_appointments_barbershop ON appointments(barbershop_id);
CREATE INDEX idx_appointments_client ON appointments(client_id);
CREATE INDEX idx_appointments_professional ON appointments(professional_id);
CREATE INDEX idx_appointments_date ON appointments(date);
CREATE INDEX idx_appointments_status ON appointments(status);

-- =====================================================
-- TABELA: APPOINTMENT_SERVICES (Serviços do Agendamento)
-- =====================================================

CREATE TABLE appointment_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id) ON DELETE SET NULL,
    service_name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    duration_minutes INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_appointment_services_appointment ON appointment_services(appointment_id);

-- =====================================================
-- TABELA: QUEUE (Fila Virtual)
-- =====================================================

CREATE TABLE queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    barbershop_id UUID REFERENCES barbershops(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    professional_id UUID REFERENCES professionals(id) ON DELETE SET NULL,
    
    -- Informações do cliente (caso não tenha cadastro)
    client_name VARCHAR(255),
    client_phone VARCHAR(20),
    
    -- Posição e status
    position INTEGER NOT NULL,
    status queue_status DEFAULT 'waiting',
    
    -- Serviços
    services TEXT[],
    estimated_duration INTEGER DEFAULT 30,
    
    -- Timestamps
    check_in_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    called_at TIMESTAMP WITH TIME ZONE,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_queue_barbershop ON queue(barbershop_id);
CREATE INDEX idx_queue_status ON queue(status);
CREATE INDEX idx_queue_date ON queue(check_in_at);

-- =====================================================
-- TABELA: TRANSACTIONS (Transações Financeiras)
-- =====================================================

CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    barbershop_id UUID REFERENCES barbershops(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    professional_id UUID REFERENCES professionals(id) ON DELETE SET NULL,
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    
    -- Tipo e valores
    type transaction_type NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    
    -- Descrição
    description TEXT,
    category VARCHAR(100),
    
    -- Pagamento
    payment_method payment_method,
    
    -- Referência
    reference_id VARCHAR(255),
    
    -- Data
    transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_transactions_barbershop ON transactions(barbershop_id);
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
CREATE INDEX idx_transactions_type ON transactions(type);

-- =====================================================
-- TABELA: COMMISSIONS (Comissões)
-- =====================================================

CREATE TABLE commissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    barbershop_id UUID REFERENCES barbershops(id) ON DELETE CASCADE,
    professional_id UUID REFERENCES professionals(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    transaction_id UUID REFERENCES transactions(id) ON DELETE SET NULL,
    
    -- Valores
    service_total DECIMAL(10, 2) NOT NULL,
    commission_percentage DECIMAL(5, 2) NOT NULL,
    commission_amount DECIMAL(10, 2) NOT NULL,
    
    -- Status
    is_paid BOOLEAN DEFAULT FALSE,
    paid_at TIMESTAMP WITH TIME ZONE,
    
    -- Período
    period_start DATE,
    period_end DATE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_commissions_barbershop ON commissions(barbershop_id);
CREATE INDEX idx_commissions_professional ON commissions(professional_id);
CREATE INDEX idx_commissions_paid ON commissions(is_paid);

-- =====================================================
-- TABELA: CASH_REGISTER (Caixa do Dia)
-- =====================================================

CREATE TABLE cash_register (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    barbershop_id UUID REFERENCES barbershops(id) ON DELETE CASCADE,
    professional_id UUID REFERENCES professionals(id) ON DELETE SET NULL,
    
    -- Data
    date DATE NOT NULL,
    
    -- Valores de abertura/fechamento
    opening_amount DECIMAL(10, 2) DEFAULT 0,
    closing_amount DECIMAL(10, 2),
    
    -- Totais calculados
    total_cash DECIMAL(10, 2) DEFAULT 0,
    total_card DECIMAL(10, 2) DEFAULT 0,
    total_pix DECIMAL(10, 2) DEFAULT 0,
    total_other DECIMAL(10, 2) DEFAULT 0,
    total_income DECIMAL(10, 2) DEFAULT 0,
    total_expense DECIMAL(10, 2) DEFAULT 0,
    
    -- Status
    is_open BOOLEAN DEFAULT TRUE,
    opened_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    closed_at TIMESTAMP WITH TIME ZONE,
    
    -- Notas
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(barbershop_id, date)
);

CREATE INDEX idx_cash_register_barbershop ON cash_register(barbershop_id);
CREATE INDEX idx_cash_register_date ON cash_register(date);

-- =====================================================
-- TABELA: REVIEWS (Avaliações)
-- =====================================================

CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    barbershop_id UUID REFERENCES barbershops(id) ON DELETE CASCADE,
    professional_id UUID REFERENCES professionals(id) ON DELETE SET NULL,
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    
    -- Avaliação
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    
    -- Resposta
    reply TEXT,
    replied_at TIMESTAMP WITH TIME ZONE,
    
    -- Controle
    is_visible BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_reviews_barbershop ON reviews(barbershop_id);
CREATE INDEX idx_reviews_professional ON reviews(professional_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- =====================================================
-- TABELA: LOYALTY_PROGRAMS (Programas de Fidelidade)
-- =====================================================

CREATE TABLE loyalty_programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    barbershop_id UUID REFERENCES barbershops(id) ON DELETE CASCADE,
    
    -- Configuração
    name VARCHAR(255) NOT NULL DEFAULT 'Cartão Fidelidade',
    description TEXT,
    
    -- Regras
    stamps_required INTEGER NOT NULL DEFAULT 10,
    reward_type VARCHAR(50) DEFAULT 'free_service',
    reward_value DECIMAL(10, 2),
    reward_service_id UUID REFERENCES services(id) ON DELETE SET NULL,
    reward_description TEXT,
    
    -- Validade
    is_active BOOLEAN DEFAULT TRUE,
    stamps_expire_days INTEGER,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_loyalty_programs_barbershop ON loyalty_programs(barbershop_id);

-- =====================================================
-- TABELA: LOYALTY_CARDS (Cartões de Fidelidade)
-- =====================================================

CREATE TABLE loyalty_cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_id UUID REFERENCES loyalty_programs(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    
    -- Progresso
    stamps_collected INTEGER DEFAULT 0,
    rewards_claimed INTEGER DEFAULT 0,
    
    -- Status
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(program_id, client_id)
);

CREATE INDEX idx_loyalty_cards_program ON loyalty_cards(program_id);
CREATE INDEX idx_loyalty_cards_client ON loyalty_cards(client_id);

-- =====================================================
-- TABELA: LOYALTY_STAMPS (Carimbos)
-- =====================================================

CREATE TABLE loyalty_stamps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    card_id UUID REFERENCES loyalty_cards(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    
    -- Info
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_loyalty_stamps_card ON loyalty_stamps(card_id);

-- =====================================================
-- TABELA: WHATSAPP_AUTOMATIONS (Automações WhatsApp)
-- =====================================================

CREATE TABLE whatsapp_automations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    barbershop_id UUID REFERENCES barbershops(id) ON DELETE CASCADE,
    
    -- Configuração
    name VARCHAR(255) NOT NULL,
    trigger_type automation_trigger NOT NULL,
    
    -- Timing
    delay_minutes INTEGER DEFAULT 0,
    send_time TIME,
    
    -- Mensagem
    message_template TEXT NOT NULL,
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Estatísticas
    total_sent INTEGER DEFAULT 0,
    last_sent_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_whatsapp_automations_barbershop ON whatsapp_automations(barbershop_id);
CREATE INDEX idx_whatsapp_automations_trigger ON whatsapp_automations(trigger_type);

-- =====================================================
-- TABELA: WHATSAPP_MESSAGES (Mensagens Enviadas)
-- =====================================================

CREATE TABLE whatsapp_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    barbershop_id UUID REFERENCES barbershops(id) ON DELETE CASCADE,
    automation_id UUID REFERENCES whatsapp_automations(id) ON DELETE SET NULL,
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    
    -- Destinatário
    phone VARCHAR(20) NOT NULL,
    
    -- Mensagem
    message TEXT NOT NULL,
    
    -- Status
    status VARCHAR(20) DEFAULT 'pending',
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    read_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_whatsapp_messages_barbershop ON whatsapp_messages(barbershop_id);
CREATE INDEX idx_whatsapp_messages_status ON whatsapp_messages(status);

-- =====================================================
-- TABELA: LINK_BIO (Configurações do Link Bio)
-- =====================================================

CREATE TABLE link_bio (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    barbershop_id UUID REFERENCES barbershops(id) ON DELETE CASCADE,
    
    -- URL personalizada
    custom_slug VARCHAR(100) UNIQUE,
    
    -- Aparência
    theme VARCHAR(50) DEFAULT 'dark',
    primary_color VARCHAR(20) DEFAULT '#F59E0B',
    background_type VARCHAR(20) DEFAULT 'solid',
    background_value TEXT,
    
    -- Informações
    title VARCHAR(255),
    bio TEXT,
    avatar_url TEXT,
    
    -- Redes sociais
    instagram_url TEXT,
    facebook_url TEXT,
    tiktok_url TEXT,
    youtube_url TEXT,
    
    -- Estatísticas
    total_views INTEGER DEFAULT 0,
    total_clicks INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(barbershop_id)
);

CREATE INDEX idx_link_bio_slug ON link_bio(custom_slug);

-- =====================================================
-- TABELA: LINK_BIO_LINKS (Links do Bio)
-- =====================================================

CREATE TABLE link_bio_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    link_bio_id UUID REFERENCES link_bio(id) ON DELETE CASCADE,
    
    -- Configuração
    title VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    icon VARCHAR(50),
    
    -- Aparência
    style VARCHAR(20) DEFAULT 'default',
    
    -- Estatísticas
    clicks INTEGER DEFAULT 0,
    
    -- Ordem
    sort_order INTEGER DEFAULT 0,
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_link_bio_links_bio ON link_bio_links(link_bio_id);

-- =====================================================
-- TABELA: NOTIFICATIONS (Notificações)
-- =====================================================

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    barbershop_id UUID REFERENCES barbershops(id) ON DELETE CASCADE,
    
    -- Conteúdo
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50),
    
    -- Link
    action_url TEXT,
    
    -- Status
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_barbershop ON notifications(barbershop_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);

-- =====================================================
-- TABELA: ANTI_FAULT_DEPOSITS (Depósitos Anti-Falta)
-- =====================================================

CREATE TABLE anti_fault_deposits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    barbershop_id UUID REFERENCES barbershops(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    
    -- Valores
    amount DECIMAL(10, 2) NOT NULL,
    
    -- Pagamento
    payment_method payment_method,
    payment_reference VARCHAR(255),
    
    -- Status
    status VARCHAR(20) DEFAULT 'pending',
    paid_at TIMESTAMP WITH TIME ZONE,
    refunded_at TIMESTAMP WITH TIME ZONE,
    forfeited_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_deposits_barbershop ON anti_fault_deposits(barbershop_id);
CREATE INDEX idx_deposits_appointment ON anti_fault_deposits(appointment_id);
CREATE INDEX idx_deposits_status ON anti_fault_deposits(status);

-- =====================================================
-- TABELA: BLOCKED_TIMES (Horários Bloqueados)
-- =====================================================

CREATE TABLE blocked_times (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    barbershop_id UUID REFERENCES barbershops(id) ON DELETE CASCADE,
    professional_id UUID REFERENCES professionals(id) ON DELETE CASCADE,
    
    -- Período
    start_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
    end_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Motivo
    reason VARCHAR(255),
    
    -- Recorrente
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_rule TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_blocked_times_barbershop ON blocked_times(barbershop_id);
CREATE INDEX idx_blocked_times_professional ON blocked_times(professional_id);

-- =====================================================
-- TABELA: MARKETPLACE_CATEGORIES (Categorias do Marketplace)
-- =====================================================

CREATE TABLE marketplace_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    icon VARCHAR(50),
    image_url TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELA: BARBERSHOP_CATEGORIES (Relação Barbearia-Categoria)
-- =====================================================

CREATE TABLE barbershop_categories (
    barbershop_id UUID REFERENCES barbershops(id) ON DELETE CASCADE,
    category_id UUID REFERENCES marketplace_categories(id) ON DELETE CASCADE,
    PRIMARY KEY (barbershop_id, category_id)
);

-- =====================================================
-- TABELA: PROMOTIONS (Promoções)
-- =====================================================

CREATE TABLE promotions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    barbershop_id UUID REFERENCES barbershops(id) ON DELETE CASCADE,
    
    -- Informações
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT,
    
    -- Desconto
    discount_type VARCHAR(20) DEFAULT 'percentage',
    discount_value DECIMAL(10, 2) NOT NULL,
    
    -- Período
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Condições
    min_value DECIMAL(10, 2),
    max_uses INTEGER,
    uses_count INTEGER DEFAULT 0,
    
    -- Código
    promo_code VARCHAR(50) UNIQUE,
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_promotions_barbershop ON promotions(barbershop_id);
CREATE INDEX idx_promotions_dates ON promotions(start_date, end_date);

-- =====================================================
-- TABELA: FAVORITES (Favoritos)
-- =====================================================

CREATE TABLE favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    barbershop_id UUID REFERENCES barbershops(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, barbershop_id)
);

CREATE INDEX idx_favorites_user ON favorites(user_id);

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

-- Triggers para updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_barbershops_updated_at BEFORE UPDATE ON barbershops FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_professionals_updated_at BEFORE UPDATE ON professionals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_working_hours_updated_at BEFORE UPDATE ON working_hours FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_loyalty_programs_updated_at BEFORE UPDATE ON loyalty_programs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_loyalty_cards_updated_at BEFORE UPDATE ON loyalty_cards FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_whatsapp_automations_updated_at BEFORE UPDATE ON whatsapp_automations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_link_bio_updated_at BEFORE UPDATE ON link_bio FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
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
        
        -- Incrementar total de agendamentos da barbearia
        UPDATE barbershops
        SET total_appointments = total_appointments + 1
        WHERE id = NEW.barbershop_id;
        
        -- Incrementar total de agendamentos do profissional
        IF NEW.professional_id IS NOT NULL THEN
            UPDATE professionals
            SET total_appointments = total_appointments + 1
            WHERE id = NEW.professional_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_client_stats_on_appointment
AFTER UPDATE ON appointments
FOR EACH ROW EXECUTE FUNCTION update_client_stats();

-- Função para gerar slug único
CREATE OR REPLACE FUNCTION generate_unique_slug(base_name TEXT, table_name TEXT)
RETURNS TEXT AS $$
DECLARE
    base_slug TEXT;
    final_slug TEXT;
    counter INTEGER := 0;
    slug_exists BOOLEAN;
BEGIN
    base_slug := LOWER(REGEXP_REPLACE(base_name, '[^a-zA-Z0-9]+', '-', 'g'));
    base_slug := TRIM(BOTH '-' FROM base_slug);
    final_slug := base_slug;
    
    LOOP
        EXECUTE format('SELECT EXISTS(SELECT 1 FROM %I WHERE slug = $1)', table_name)
        INTO slug_exists
        USING final_slug;
        
        EXIT WHEN NOT slug_exists;
        
        counter := counter + 1;
        final_slug := base_slug || '-' || counter;
    END LOOP;
    
    RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE barbershops ENABLE ROW LEVEL SECURITY;
ALTER TABLE professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (ajustar conforme necessidade)
CREATE POLICY "Users can view their own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own data" ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Anyone can view active barbershops" ON barbershops FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Owners can manage their barbershops" ON barbershops FOR ALL USING (auth.uid() = owner_id);

CREATE POLICY "Anyone can view active services" ON services FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Anyone can view active professionals" ON professionals FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Anyone can view visible reviews" ON reviews FOR SELECT USING (is_visible = TRUE);

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
('Express', 'express', 'lucide:timer', 8);

-- =====================================================
-- VIEWS ÚTEIS
-- =====================================================

-- View de agendamentos do dia
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

-- View de faturamento diário
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

-- View de ranking de profissionais
CREATE OR REPLACE VIEW v_professional_ranking AS
SELECT 
    p.id,
    p.name,
    p.avatar_url,
    p.barbershop_id,
    p.rating_average,
    p.total_appointments,
    COALESCE(SUM(CASE WHEN a.date >= CURRENT_DATE - INTERVAL '30 days' THEN a.final_price END), 0) as revenue_30d,
    COUNT(CASE WHEN a.date >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as appointments_30d
FROM professionals p
LEFT JOIN appointments a ON a.professional_id = p.id AND a.status = 'completed'
GROUP BY p.id;

-- =====================================================
-- FIM DO SCHEMA
-- =====================================================


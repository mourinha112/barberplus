# BarberPlus - Configuração do Supabase

## 📋 Instruções de Configuração

### 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) e crie uma conta
2. Crie um novo projeto
3. Anote as credenciais:
   - **Project URL**: `https://seu-projeto.supabase.co`
   - **Anon Key**: Encontre em Settings > API
   - **Service Key**: Encontre em Settings > API (MANTENHA SEGURO!)

### 2. Executar o Schema SQL

1. No painel do Supabase, vá em **SQL Editor**
2. Copie todo o conteúdo do arquivo `schema.sql`
3. Cole no editor SQL e execute

### 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Supabase
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua-anon-key
SUPABASE_SERVICE_KEY=sua-service-key

# JWT Secret (gere um seguro)
JWT_SECRET=sua-chave-super-secreta-minimo-32-caracteres

# App URL
NUXT_PUBLIC_APP_URL=http://localhost:3000

# WhatsApp Bot (opcional - Evolution API)
WHATSAPP_API_URL=http://localhost:8080
WHATSAPP_API_KEY=sua-api-key

# Pagamentos (opcional)
STRIPE_SECRET_KEY=sk_test_xxx
MERCADOPAGO_ACCESS_TOKEN=xxx
```

### 4. Storage (Upload de Imagens)

No Supabase:
1. Vá em **Storage**
2. Crie um bucket chamado `barberplus`
3. Configure as políticas de acesso:

```sql
-- Permitir upload autenticado
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'barberplus');

-- Permitir leitura pública
CREATE POLICY "Public can read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'barberplus');
```

## 🗄️ Estrutura do Banco

### Tabelas Principais

| Tabela | Descrição |
|--------|-----------|
| `users` | Usuários do sistema (clientes e gestores) |
| `barbershops` | Barbearias cadastradas |
| `professionals` | Profissionais/barbeiros |
| `services` | Serviços oferecidos |
| `clients` | Clientes das barbearias |
| `appointments` | Agendamentos |
| `transactions` | Transações financeiras |
| `commissions` | Comissões dos profissionais |
| `reviews` | Avaliações |
| `queue` | Fila virtual |
| `loyalty_programs` | Programas de fidelidade |
| `whatsapp_automations` | Automações do WhatsApp |
| `link_bio` | Configurações do Link Bio |

### Enums

- `user_role`: client, professional, manager, admin
- `appointment_status`: pending, confirmed, in_progress, completed, cancelled, no_show
- `payment_status`: pending, paid, refunded, failed
- `payment_method`: cash, credit_card, debit_card, pix, transfer, deposit
- `transaction_type`: income, expense, commission, deposit, refund
- `queue_status`: waiting, called, in_service, completed, cancelled
- `day_of_week`: monday-sunday
- `automation_trigger`: appointment_created, appointment_reminder, etc.
- `subscription_plan`: free, basic, professional, enterprise

## 🔐 Row Level Security (RLS)

O schema já inclui políticas básicas de RLS. Ajuste conforme necessário para seu caso de uso.

## 📊 Views

- `v_today_appointments`: Agendamentos do dia
- `v_daily_revenue`: Faturamento diário
- `v_professional_ranking`: Ranking de profissionais

## 🔄 Triggers

- Atualização automática de `updated_at`
- Cálculo automático de rating de barbearias e profissionais
- Atualização de estatísticas de clientes após agendamento

## 🚀 Deploy

Para produção, certifique-se de:

1. Usar HTTPS
2. Configurar CORS corretamente no Supabase
3. Habilitar RLS em todas as tabelas
4. Usar service_key apenas no servidor
5. Rotacionar JWT_SECRET periodicamente


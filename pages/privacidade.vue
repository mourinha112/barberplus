<template>
  <div class="min-h-screen">
    <div class="container-app py-6 max-w-3xl mx-auto">
      <!-- Header -->
      <div class="flex items-center gap-3 mb-8">
        <button @click="$router.back()" class="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 transition-colors">
          <Icon name="lucide:arrow-left" class="w-5 h-5 text-neutral-400" />
        </button>
        <h1 class="font-display text-2xl font-semibold text-white">Política de Privacidade</h1>
      </div>

      <div class="prose prose-invert prose-amber max-w-none">
        <p class="text-neutral-400 text-sm mb-6">Última atualização: 01 de janeiro de 2026</p>

        <div class="space-y-6 text-neutral-300 text-sm leading-relaxed">
          <section>
            <h2 class="text-lg font-semibold text-white mb-3">1. Informações que Coletamos</h2>
            <p>Coletamos as seguintes informações pessoais quando você utiliza o BarberPlus:</p>
            <ul class="list-disc list-inside space-y-1 mt-2 text-neutral-400">
              <li>Nome completo, email e número de telefone</li>
              <li>Informações de agendamentos e histórico de serviços</li>
              <li>Dados de localização (quando autorizado)</li>
              <li>Avaliações e comentários</li>
              <li>Preferências de serviços e profissionais</li>
            </ul>
          </section>

          <section>
            <h2 class="text-lg font-semibold text-white mb-3">2. Como Usamos suas Informações</h2>
            <p>Utilizamos suas informações para:</p>
            <ul class="list-disc list-inside space-y-1 mt-2 text-neutral-400">
              <li>Processar e gerenciar agendamentos</li>
              <li>Personalizar sua experiência na plataforma</li>
              <li>Enviar notificações sobre agendamentos</li>
              <li>Melhorar nossos serviços</li>
              <li>Comunicações de marketing (com seu consentimento)</li>
            </ul>
          </section>

          <section>
            <h2 class="text-lg font-semibold text-white mb-3">3. Compartilhamento de Dados</h2>
            <p>Compartilhamos suas informações apenas com as barbearias onde você realiza agendamentos, e com prestadores de serviços essenciais para o funcionamento da plataforma (processamento de pagamentos, envio de mensagens).</p>
          </section>

          <section>
            <h2 class="text-lg font-semibold text-white mb-3">4. Segurança dos Dados</h2>
            <p>Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações pessoais, incluindo criptografia de dados sensíveis e controle de acesso restrito.</p>
          </section>

          <section>
            <h2 class="text-lg font-semibold text-white mb-3">5. Seus Direitos (LGPD)</h2>
            <p>Conforme a Lei Geral de Proteção de Dados (LGPD), você tem direito a:</p>
            <ul class="list-disc list-inside space-y-1 mt-2 text-neutral-400">
              <li>Acessar seus dados pessoais</li>
              <li>Corrigir dados incompletos ou desatualizados</li>
              <li>Solicitar a exclusão de seus dados</li>
              <li>Revogar o consentimento para uso dos dados</li>
              <li>Solicitar a portabilidade dos dados</li>
            </ul>
          </section>

          <section>
            <h2 class="text-lg font-semibold text-white mb-3">6. Cookies</h2>
            <p>Utilizamos cookies e tecnologias similares para melhorar sua experiência, lembrar suas preferências e analisar o uso da plataforma.</p>
          </section>

          <section>
            <h2 class="text-lg font-semibold text-white mb-3">7. Retenção de Dados</h2>
            <p>Mantemos seus dados pelo tempo necessário para fornecer os serviços contratados ou conforme exigido por lei. Após a exclusão da conta, seus dados serão removidos em até 30 dias.</p>
          </section>

          <section>
            <h2 class="text-lg font-semibold text-white mb-3">8. Contato</h2>
            <p>Para exercer seus direitos ou tirar dúvidas sobre esta política, entre em contato através do email privacidade@barberplus.com.br.</p>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Política de Privacidade - BarberPlus'
})
</script>

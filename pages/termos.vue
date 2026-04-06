<template>
  <div class="min-h-screen">
    <div class="container-app py-6 max-w-3xl mx-auto">
      <!-- Header -->
      <div class="flex items-center gap-3 mb-8">
        <button @click="$router.back()" class="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 transition-colors">
          <Icon name="lucide:arrow-left" class="w-5 h-5 text-neutral-400" />
        </button>
        <h1 class="font-display text-2xl font-semibold text-white">Termos de Uso</h1>
      </div>

      <div class="prose prose-invert prose-amber max-w-none">
        <p class="text-neutral-400 text-sm mb-6">Última atualização: 01 de janeiro de 2026</p>

        <div class="space-y-6 text-neutral-300 text-sm leading-relaxed">
          <section>
            <h2 class="text-lg font-semibold text-white mb-3">1. Aceitação dos Termos</h2>
            <p>Ao acessar e utilizar a plataforma BarberPlus, você concorda com estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não deverá utilizar nossos serviços.</p>
          </section>

          <section>
            <h2 class="text-lg font-semibold text-white mb-3">2. Descrição do Serviço</h2>
            <p>O BarberPlus é uma plataforma de marketplace que conecta barbearias e clientes, oferecendo funcionalidades de agendamento online, gestão de negócios para barbearias, programa de fidelidade, e comunicação via WhatsApp.</p>
          </section>

          <section>
            <h2 class="text-lg font-semibold text-white mb-3">3. Cadastro e Conta</h2>
            <p>Para utilizar determinados serviços, é necessário criar uma conta fornecendo informações verdadeiras e completas. Você é responsável por manter a confidencialidade da sua senha e por todas as atividades que ocorram em sua conta.</p>
          </section>

          <section>
            <h2 class="text-lg font-semibold text-white mb-3">4. Uso da Plataforma</h2>
            <p>Os usuários se comprometem a utilizar a plataforma de forma ética e legal, não praticando atividades que possam prejudicar outros usuários, barbearias ou a plataforma em si.</p>
          </section>

          <section>
            <h2 class="text-lg font-semibold text-white mb-3">5. Agendamentos e Cancelamentos</h2>
            <p>Os agendamentos são feitos diretamente entre o cliente e a barbearia através da plataforma. Políticas de cancelamento, reagendamento e no-show são definidas por cada barbearia individualmente.</p>
          </section>

          <section>
            <h2 class="text-lg font-semibold text-white mb-3">6. Pagamentos</h2>
            <p>Os pagamentos pelos serviços são realizados diretamente entre o cliente e a barbearia. As assinaturas de planos para barbearias são processadas pela plataforma através de parceiros de pagamento.</p>
          </section>

          <section>
            <h2 class="text-lg font-semibold text-white mb-3">7. Propriedade Intelectual</h2>
            <p>Todo o conteúdo da plataforma, incluindo design, código, textos e imagens, são propriedade do BarberPlus e protegidos por leis de propriedade intelectual.</p>
          </section>

          <section>
            <h2 class="text-lg font-semibold text-white mb-3">8. Limitação de Responsabilidade</h2>
            <p>O BarberPlus não se responsabiliza por disputas entre clientes e barbearias, qualidade dos serviços prestados pelas barbearias, ou danos decorrentes do uso da plataforma.</p>
          </section>

          <section>
            <h2 class="text-lg font-semibold text-white mb-3">9. Modificações</h2>
            <p>Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações entram em vigor imediatamente após a publicação na plataforma.</p>
          </section>

          <section>
            <h2 class="text-lg font-semibold text-white mb-3">10. Contato</h2>
            <p>Para dúvidas sobre estes termos, entre em contato através do email suporte@barberplus.com.br.</p>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Termos de Uso - BarberPlus'
})
</script>

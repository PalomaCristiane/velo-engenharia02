/* ═══════════════════════════════════════════════════════════
   VELO ENGENHARIA — script.js
   Comportamentos: navegação · menu mobile · scroll reveal ·
   galeria filtro · agenda (dias/horários) · formulários ·
   back-to-top
═══════════════════════════════════════════════════════════ */

'use strict';

/* ─── Utilitários ────────────────────────────────────────── */

/**
 * Scroll suave até um seletor CSS, fechando o menu mobile se aberto.
 * @param {string} selector
 */
function scrollToSection(selector) {
  const el = document.querySelector(selector);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  closeMobileMenu();
}

// Exposta globalmente para uso nos atributos onclick do HTML
window.scrollToSection = scrollToSection;


/* ─── Header — efeito ao rolar ───────────────────────────── */

(function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  function updateHeader() {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();
})();


/* ─── Menu mobile ────────────────────────────────────────── */

const hamburger   = document.getElementById('hamburger');
const mobileMenu  = document.getElementById('mobile-menu');

function openMobileMenu() {
  hamburger.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  mobileMenu.classList.add('open');
  mobileMenu.removeAttribute('aria-hidden');
}

function closeMobileMenu() {
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  mobileMenu.classList.remove('open');
  mobileMenu.setAttribute('aria-hidden', 'true');
}

function toggleMobileMenu() {
  if (mobileMenu.classList.contains('open')) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
}

if (hamburger) {
  hamburger.addEventListener('click', toggleMobileMenu);
}

// Links do menu mobile e do footer — navegação com scroll suave
document.querySelectorAll('.mobile-nav-link, .footer-link').forEach(function (link) {
  link.addEventListener('click', function (e) {
    const target = this.getAttribute('data-target');
    if (target) {
      e.preventDefault();
      scrollToSection(target);
    }
  });
});

// Links do nav desktop — scroll suave
document.querySelectorAll('.nav-link').forEach(function (link) {
  link.addEventListener('click', function (e) {
    const target = this.getAttribute('data-target');
    if (target) {
      e.preventDefault();
      scrollToSection(target);
    }
  });
});

// Fecha menu ao clicar fora
document.addEventListener('click', function (e) {
  if (
    mobileMenu &&
    mobileMenu.classList.contains('open') &&
    !mobileMenu.contains(e.target) &&
    !hamburger.contains(e.target)
  ) {
    closeMobileMenu();
  }
});


/* ─── Scroll Reveal ──────────────────────────────────────── */

(function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  if (!targets.length) return;

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // Stagger delay baseado no índice do elemento dentro do grupo pai
          const siblings = Array.from(entry.target.parentElement.children).filter(
            function (el) { return el.classList.contains('reveal') || el.classList.contains('reveal-left') || el.classList.contains('reveal-right'); }
          );
          const idx = siblings.indexOf(entry.target);
          entry.target.style.transitionDelay = (idx * 80) + 'ms';
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  targets.forEach(function (el) { observer.observe(el); });
})();


/* ─── Back to top ────────────────────────────────────────── */

(function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', function () {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ─── Galeria — filtros ──────────────────────────────────── */

(function initGalleryFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards      = document.querySelectorAll('.gallery-card');

  if (!filterBtns.length) return;

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      // Atualiza botão ativo
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      this.classList.add('active');

      const filter = this.getAttribute('data-filter');

      cards.forEach(function (card) {
        const type = card.getAttribute('data-type');

        if (filter === 'todos' || type === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
})();

/* ─── Agenda ───────────────────────────────────────────── */

(function initAgendaForm() {

    const form = document.getElementById('agenda-form');
    const success = document.getElementById('agenda-success');

    if (!form) {
        console.error('Formulário agenda-form não encontrado.');
        return;
    }

    /* Seleção de horário */
    document.querySelectorAll('.time-btn').forEach(btn => {

        btn.addEventListener('click', function () {

            document.querySelectorAll('.time-btn')
                .forEach(item => item.classList.remove('selected'));

            this.classList.add('selected');

        });

    });

    /* Envio do formulário */
    form.addEventListener('submit', function(e) {

        e.preventDefault();

        const name = document.getElementById('agenda-name');
        const email = document.getElementById('agenda-email');
        const phone = document.getElementById('agenda-phone');
        const company = document.getElementById('agenda-company');
        const message = document.getElementById('agenda-message');
        const date = document.getElementById('agenda-date');

        const selectedTime =
            document.querySelector('.time-btn.selected');

        if (!name.value.trim()) {
            alert('Informe seu nome.');
            name.focus();
            return;
        }

        if (!email.value.trim()) {
            alert('Informe seu e-mail.');
            email.focus();
            return;
        }

        if (!phone.value.trim()) {
            alert('Informe seu telefone.');
            phone.focus();
            return;
        }

        if (!date.value) {
            alert('Selecione uma data.');
            date.focus();
            return;
        }

        if (!selectedTime) {
            alert('Selecione um horário.');
            return;
        }

        const texto = `
=================================

NOVO AGENDAMENTO

=================================

Nome: ${name.value}
Email: ${email.value}
Telefone: ${phone.value}
Empresa: ${company.value}

Data: ${date.value}
Horário: ${selectedTime.dataset.time}

Projeto:
${message.value}

=================================

Registro:
${new Date().toLocaleString('pt-BR')}

=================================
`;

        try {

            const arquivo = new Blob(
                [texto],
                {
                    type: 'text/plain;charset=utf-8'
                }
            );

            const link = document.createElement('a');

            link.href = URL.createObjectURL(arquivo);

            link.download =
                'agendamento-' +
                Date.now() +
                '.txt';

            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);

            URL.revokeObjectURL(link.href);

        } catch (erro) {

            console.error('Erro ao gerar TXT:', erro);

        }

        if (success) {

            form.hidden = true;
            success.hidden = false;

            success.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });

            setTimeout(function() {

                form.reset();

                document.querySelectorAll('.time-btn')
                    .forEach(btn =>
                        btn.classList.remove('selected')
                    );

                form.hidden = false;
                success.hidden = true;

            }, 5000);

        }

    });

})();


/* ─── Formulário — Orçamento ───────────────────────────── */

(function initOrcamentoForm() {

    const form = document.getElementById('orc-form');
    const success = document.getElementById('orc-success');

    if (!form) return;

    form.addEventListener('submit', function (e) {

        e.preventDefault();

        const name  = document.getElementById('o-name');
        const email = document.getElementById('o-email');
        const phone = document.getElementById('o-phone');
        const biz   = document.getElementById('o-biz');
        const type  = document.getElementById('o-type');
        const size  = document.getElementById('o-size');
        const desc  = document.getElementById('o-desc');

        if (!name || !email || !phone || !biz || !type || !size || !desc) {
            alert('Existem campos com ID incorreto no HTML.');
            return;
        }

        if (!name.value.trim()) {
            alert('Informe seu nome.');
            name.focus();
            return;
        }

        if (!email.value.trim() || !isValidEmail(email.value)) {
            alert('Informe um e-mail válido.');
            email.focus();
            return;
        }

        if (!phone.value.trim()) {
            alert('Informe seu telefone.');
            phone.focus();
            return;
        }

        if (!biz.value.trim()) {
            alert('Informe o nome do negócio.');
            biz.focus();
            return;
        }

        if (!type.value) {
            alert('Selecione o tipo de espaço.');
            type.focus();
            return;
        }

        if (!size.value) {
            alert('Selecione a metragem.');
            size.focus();
            return;
        }

        if (!desc.value.trim()) {
            alert('Descreva seu projeto.');
            desc.focus();
            return;
        }

        const texto = `
=================================
SOLICITAÇÃO DE ORÇAMENTO
=================================

Nome: ${name.value}
Email: ${email.value}
Telefone: ${phone.value}
Empresa: ${biz.value}

Tipo de Espaço: ${type.value}
Metragem: ${size.value}

Descrição do Projeto:
${desc.value}

=================================
Registro:
${new Date().toLocaleString('pt-BR')}
=================================
`;

        try {

            const blob = new Blob(
                [texto],
                { type: 'text/plain;charset=utf-8' }
            );

            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');

            a.href = url;

            a.download =
                'orcamento-' +
                Date.now() +
                '.txt';

            document.body.appendChild(a);

            a.click();

            document.body.removeChild(a);

            URL.revokeObjectURL(url);

        } catch (erro) {

            console.error(erro);

            alert(
                'O navegador bloqueou a criação do arquivo.'
            );

            return;
        }

        if (success) {

            form.hidden = true;

            success.hidden = false;

            success.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });

            setTimeout(function () {

                form.reset();

                form.hidden = false;

                success.hidden = true;

            }, 6000);

        } else {

            alert(
                'Orçamento enviado com sucesso e TXT gerado.'
            );

            form.reset();
        }

    });

})();

/* ─── Validação de E-mail ─────────────────────────────── */

function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

// ==========================================
// CHAT FLUTUANTE - VELO ENGENHARIA
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    const botaoChat = document.getElementById("chat-toggle");
    const janelaChat = document.getElementById("chat-box");
    const botaoFechar = document.getElementById("chat-close");

    const campoMensagem = document.getElementById("chat-input");
    const botaoEnviar = document.getElementById("send-message");

    const areaMensagens = document.getElementById("chat-messages");
    const opcoesRapidas = document.querySelectorAll(".quick-option");


    // ==========================================
    // VERIFICAR ELEMENTOS
    // ==========================================

    if (
        !botaoChat ||
        !janelaChat ||
        !campoMensagem ||
        !botaoEnviar ||
        !areaMensagens
    ) {

        console.log("Elementos do chat não encontrados.");
        return;

    }


    // ==========================================
    // ABRIR CHAT
    // ==========================================

    botaoChat.addEventListener("click", function () {

        janelaChat.classList.toggle("chat-open");

        if (janelaChat.classList.contains("chat-open")) {

            campoMensagem.focus();

        }

    });


    // ==========================================
    // FECHAR CHAT
    // ==========================================

    if (botaoFechar) {

        botaoFechar.addEventListener("click", function () {

            janelaChat.classList.remove("chat-open");

        });

    }


    // ==========================================
    // ADICIONAR MENSAGEM DO USUÁRIO
    // ==========================================

    function adicionarMensagemUsuario(mensagem) {

        const div = document.createElement("div");

        div.classList.add("user-message");

        div.textContent = mensagem;

        areaMensagens.appendChild(div);

        rolarParaBaixo();

    }


    // ==========================================
    // ADICIONAR MENSAGEM DO BOT
    // ==========================================

    function adicionarMensagemBot(mensagem) {

        const div = document.createElement("div");

        div.classList.add("bot-message");

        div.textContent = mensagem;

        areaMensagens.appendChild(div);

        rolarParaBaixo();

    }


    // ==========================================
    // INDICADOR "DIGITANDO..."
    // ==========================================

    function mostrarDigitando() {

        const div = document.createElement("div");

        div.id = "bot-typing";

        div.classList.add("bot-message");

        div.textContent = "Digitando...";

        areaMensagens.appendChild(div);

        rolarParaBaixo();

    }


    function removerDigitando() {

        const digitando = document.getElementById("bot-typing");

        if (digitando) {

            digitando.remove();

        }

    }


    // ==========================================
    // ROLAR CHAT PARA BAIXO
    // ==========================================

    function rolarParaBaixo() {

        areaMensagens.scrollTop = areaMensagens.scrollHeight;

    }


    // ==========================================
    // GERAR RESPOSTA AUTOMÁTICA
    // ==========================================

    function responderMensagem(mensagem) {

        const texto = mensagem.toLowerCase();


        // ORÇAMENTO
        if (
            texto.includes("orçamento") ||
            texto.includes("orcamento") ||
            texto.includes("preço") ||
            texto.includes("preco") ||
            texto.includes("valor")
        ) {

            return "Claro! 😊 Para solicitar um orçamento, acesse a seção Orçamento do nosso site. Nossa equipe poderá entender melhor seu projeto e entrar em contato com você.";


        }


        // SERVIÇOS
        if (
            texto.includes("serviço") ||
            texto.includes("servicos") ||
            texto.includes("serviços") ||
            texto.includes("fazem") ||
            texto.includes("trabalham")
        ) {

            return "A Velo Engenharia atua com projetos, construções, reformas e soluções de engenharia. 🏗️ Você pode conhecer todos os nossos serviços na seção Serviços.";


        }


        // PROJETOS / GALERIA
        if (
            texto.includes("projeto") ||
            texto.includes("projetos") ||
            texto.includes("obra") ||
            texto.includes("obras") ||
            texto.includes("galeria")
        ) {

            return "Temos diversos projetos e obras para apresentar. 🏢 Acesse a nossa Galeria para conhecer alguns dos trabalhos realizados pela Velo Engenharia.";


        }


        // CONTATO
        if (
            texto.includes("contato") ||
            texto.includes("telefone") ||
            texto.includes("email") ||
            texto.includes("e-mail") ||
            texto.includes("falar")
        ) {

            return "Será um prazer conversar com você! 📞 Acesse a seção Contato para encontrar nossos canais de atendimento.";


        }


        // AGENDA
        if (
            texto.includes("agenda") ||
            texto.includes("agendar") ||
            texto.includes("reunião") ||
            texto.includes("reuniao") ||
            texto.includes("visita")
        ) {

            return "Podemos agendar uma conversa para entender melhor o seu projeto. 📅 Acesse a seção Agenda para verificar as opções disponíveis.";


        }


        // SOBRE
        if (
            texto.includes("quem são") ||
            texto.includes("quem sao") ||
            texto.includes("empresa") ||
            texto.includes("velo")
        ) {

            return "A Velo Engenharia é uma empresa voltada para soluções em engenharia e construção, buscando unir qualidade, segurança, eficiência e sofisticação em cada projeto.";


        }


        // SAUDAÇÕES
        if (
            texto.includes("olá") ||
            texto.includes("ola") ||
            texto.includes("oi") ||
            texto.includes("bom dia") ||
            texto.includes("boa tarde") ||
            texto.includes("boa noite")
        ) {

            return "Olá! 👋 É um prazer atender você. Como posso ajudar?";


        }


        // AGRADECIMENTO
        if (
            texto.includes("obrigado") ||
            texto.includes("obrigada") ||
            texto.includes("valeu")
        ) {

            return "Nós que agradecemos pelo contato! 😊 A Velo Engenharia está à disposição para ajudar no seu projeto.";


        }


        // RESPOSTA PADRÃO
        return "Obrigado pela sua mensagem! 😊 Ainda estou aprendendo a responder essa solicitação. Você pode escolher uma das opções abaixo: Orçamento, Serviços, Projetos ou Contato.";

    }


    // ==========================================
    // ENVIAR MENSAGEM
    // ==========================================

    function enviarMensagem() {

        const mensagem = campoMensagem.value.trim();


        // Não envia mensagem vazia
        if (mensagem === "") {

            return;

        }


        // Mostra mensagem do usuário
        adicionarMensagemUsuario(mensagem);


        // Limpa campo
        campoMensagem.value = "";


        // Mostra "Digitando..."
        mostrarDigitando();


        // Resposta automática
        setTimeout(function () {

            removerDigitando();

            const resposta = responderMensagem(mensagem);

            adicionarMensagemBot(resposta);

        }, 800);

    }


    // ==========================================
    // BOTÃO ENVIAR
    // ==========================================

    botaoEnviar.addEventListener("click", function () {

        enviarMensagem();

    });


    // ==========================================
    // ENTER PARA ENVIAR
    // ==========================================

    campoMensagem.addEventListener("keydown", function (evento) {

        if (evento.key === "Enter") {

            evento.preventDefault();

            enviarMensagem();

        }

    });


    // ==========================================
    // OPÇÕES RÁPIDAS
    // ==========================================

    opcoesRapidas.forEach(function (botao) {

        botao.addEventListener("click", function () {

            const mensagem = botao.getAttribute("data-message");

            if (!mensagem) {

                return;

            }


            // Mostra pergunta do usuário
            adicionarMensagemUsuario(mensagem);


            // Resposta automática
            mostrarDigitando();


            setTimeout(function () {

                removerDigitando();

                const resposta = responderMensagem(mensagem);

                adicionarMensagemBot(resposta);

            }, 800);

        });

    });

});

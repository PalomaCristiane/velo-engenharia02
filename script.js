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

// ===== CHAT FLUTUANTE =====

document.addEventListener('DOMContentLoaded', function() {

    const botao = document.getElementById('chat-toggle');
    const janela = document.getElementById('chat-box');

    if (!botao || !janela) {
        console.log('Elemento do chat não encontrado');
        return;
    }

    botao.addEventListener('click', function() {

        if (janela.style.display === 'flex') {
            janela.style.display = 'none';
        } else {
            janela.style.display = 'flex';
        }

    });

});
/*
 * NovoBancodocComponents.js — Inicializadores do design system Bancodoc
 *
 * Expõe um namespace global `nb` com helpers que envolvem libs externas
 * (Select2, jQuery UI datepicker) já aplicando defaults Bancodoc: PT-BR,
 * largura 100%, placeholder padrão, etc.
 *
 * Dependências: jQuery (qualquer versão moderna), Select2 (para nb.select/multiselect),
 * jQuery UI datepicker (para nb.datepicker).
 *
 * Uso típico em uma página:
 *   nb.select('#ddlCliente');
 *   nb.multiselect('#lstFornecedores');
 *   nb.datepicker('#tbDataInicio');
 *   nb.modal.open('divModalConfirmacao');
 */
(function (global, $) {
    'use strict';

    var nb = global.nb || {};
    global.nb = nb;

    // ─────────────────────────────────────────────────────────────────
    // Tradução PT-BR para Select2 (inline — evita carregar arquivo i18n)
    // ─────────────────────────────────────────────────────────────────
    var select2PtBr = {
        errorLoading: function () {
            return 'Erro ao carregar resultados.';
        },
        inputTooLong: function (args) {
            var n = args.input.length - args.maximum;
            return 'Apague ' + n + ' caracter' + (n === 1 ? '' : 'es');
        },
        inputTooShort: function (args) {
            var n = args.minimum - args.input.length;
            return 'Digite mais ' + n + ' caracter' + (n === 1 ? '' : 'es');
        },
        loadingMore: function () {
            return 'Carregando mais resultados…';
        },
        maximumSelected: function (args) {
            var n = args.maximum;
            return 'Você pode selecionar apenas ' + n + ' ' + (n === 1 ? 'item' : 'itens');
        },
        noResults: function () {
            return 'Nenhum resultado encontrado';
        },
        searching: function () {
            return 'Buscando…';
        },
        removeAllItems: function () {
            return 'Remover todos';
        }
    };

    // ─────────────────────────────────────────────────────────────────
    // Placeholder padrão — lê do dicionário de traduções (DBResourceProvider).
    // Caso BuscarTraducao não esteja carregado ou a chave 'Selecione' não
    // tenha sido registrada via AdicionarTermo, devolve string vazia em
    // vez do erro "[Selecione] não traduzido".
    // Registrar no pageLoad da página:
    //   AdicionarTermo({ Sigla: 'Selecione', Valor: '<%= GetLocalResourceObject("Selecione") %>' });
    // ─────────────────────────────────────────────────────────────────
    function placeholderSelecione() {
        if (typeof BuscarTraducao !== 'function') return '';
        var t = BuscarTraducao('Selecione');
        return (t && t.indexOf('não traduzido') === -1) ? t : '';
    }

    // ─────────────────────────────────────────────────────────────────
    // Select2 — dropdown único com busca embutida
    // ─────────────────────────────────────────────────────────────────
    nb.select = function (selector, opts) {
        if (!$.fn.select2) {
            console.warn('nb.select: Select2 não está carregado.');
            return $(selector);
        }
        var defaults = {
            language: select2PtBr,
            width: '100%',
            allowClear: false,
            placeholder: placeholderSelecione()
        };
        return $(selector).select2($.extend({}, defaults, opts || {}));
    };

    // ─────────────────────────────────────────────────────────────────
    // Select2 — multi-select com busca embutida
    // Pre-requisito: <select multiple="multiple"> no ASPX.
    // ─────────────────────────────────────────────────────────────────
    nb.multiselect = function (selector, opts) {
        if (!$.fn.select2) {
            console.warn('nb.multiselect: Select2 não está carregado.');
            return $(selector);
        }
        var defaults = {
            language: select2PtBr,
            width: '100%',
            closeOnSelect: false,
            placeholder: placeholderSelecione()
        };
        return $(selector).select2($.extend({}, defaults, opts || {}));
    };

    // ─────────────────────────────────────────────────────────────────
    // jQuery UI Datepicker — PT-BR + tema Bancodoc (CSS no DesignSystem)
    // ─────────────────────────────────────────────────────────────────
    var datepickerPtBr = {
        dateFormat: 'dd/mm/yy',
        firstDay: 0,
        dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],
        dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'],
        dayNamesMin: ['D','S','T','Q','Q','S','S'],
        monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho',
                     'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
        monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun',
                          'Jul','Ago','Set','Out','Nov','Dez'],
        prevText: 'Anterior',
        nextText: 'Próximo',
        currentText: 'Hoje',
        closeText: 'Fechar'
    };

    nb.datepicker = function (selector, opts) {
        if (!$.fn.datepicker) {
            console.warn('nb.datepicker: jQuery UI datepicker não está carregado.');
            return $(selector);
        }
        return $(selector).datepicker($.extend({}, datepickerPtBr, opts || {}));
    };

    // ─────────────────────────────────────────────────────────────────
    // Modal — padrão .nb-modal-wrap / .nb-modal-box já em uso
    // ─────────────────────────────────────────────────────────────────
    nb.modal = {
        open: function (id) {
            var el = document.getElementById(id);
            if (el) el.style.display = 'flex';
        },
        close: function (id) {
            var el = document.getElementById(id);
            if (el) el.style.display = 'none';
        },
        // Fecha ao clicar no backdrop (fora do .nb-modal-box).
        // Chame uma vez no pageLoad da página para registrar todos os modais.
        wireBackdropClose: function () {
            $(document).off('click.nbModal').on('click.nbModal', '.nb-modal-wrap', function (e) {
                if (e.target === this) {
                    this.style.display = 'none';
                }
            });
        }
    };

    // ─────────────────────────────────────────────────────────────────
    // File upload — mostra nome do arquivo selecionado em um elemento
    // <div class="nb-file-upload">
    //   <asp:FileUpload runat="server" />
    //   <span class="nb-file-upload__name"></span>
    // </div>
    // Chame nb.wireFileUpload() uma vez para ativar em toda página.
    // ─────────────────────────────────────────────────────────────────
    nb.wireFileUpload = function (rootSelector) {
        var root = rootSelector ? $(rootSelector) : $(document);
        root.off('change.nbFile').on('change.nbFile', '.nb-file-upload input[type="file"]', function () {
            var name = this.files && this.files.length ? this.files[0].name : '';
            $(this).siblings('.nb-file-upload__name').text(name);
        });
    };

    // ─────────────────────────────────────────────────────────────────
    // Auto-init — varre o documento aplicando o componente correto a cada
    // elemento marcado com a classe nb-* ou atributo data-nb-* equivalente.
    // Chamado automaticamente pela Interno.Master via Sys.Application.add_load,
    // então rola em todo full e partial postback sem precisar de JS na página.
    //
    // Uso típico (declarativo) na ASPX:
    //   <asp:DropDownList CssClass="nb-select nb-select--search" ... />
    //   <asp:ListBox     CssClass="nb-select nb-multiselect" SelectionMode="Multiple" ... />
    //   <asp:TextBox     CssClass="nb-input nb-datepicker" ... />
    //
    // Nota: .nb-select sozinho aplica APENAS o estilo visual (combo simples).
    // Adicione .nb-select--search para ativar Select2 com busca embutida.
    //
    // Idempotente: pula elementos já inicializados (Select2 / jQuery UI marcam
    // com classes próprias que detectamos abaixo).
    // ─────────────────────────────────────────────────────────────────
    nb.autoInit = function (rootSelector) {
        var root = rootSelector ? $(rootSelector) : $(document);

        // Select2 single — classe .nb-select--search ou atributo [data-nb-select]
        root.find('select.nb-select--search, [data-nb-select]').each(function () {
            if (!$(this).hasClass('select2-hidden-accessible')) nb.select(this);
        });

        // Select2 multi — classe .nb-multiselect ou [data-nb-multiselect]
        root.find('select.nb-multiselect, [data-nb-multiselect]').each(function () {
            if (!$(this).hasClass('select2-hidden-accessible')) nb.multiselect(this);
        });

        // jQuery UI datepicker — classe .nb-datepicker ou [data-nb-datepicker]
        root.find('input.nb-datepicker, [data-nb-datepicker]').each(function () {
            if (!$(this).hasClass('hasDatepicker')) nb.datepicker(this);
        });

        nb.wireFileUpload(root);
        nb.modal.wireBackdropClose();
    };

})(window, jQuery);

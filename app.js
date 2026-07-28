/*
 * app.js — Pré-Cadastro de Pedidos (versão UX melhorada).
 * Mantém o design system NovoBancodoc + nbMock; corrige usabilidade,
 * contraste, a11y e consistência de linguagem.
 */
(function () {
    'use strict';

    if (typeof AdicionarTermo === 'function') {
        AdicionarTermo({ Sigla: 'Selecione', Valor: 'Selecione' });
    }

    /* Namespace próprio para não misturar dados com o protótipo original */
    nbMock.config({ minDelay: 400, maxDelay: 1100, prefix: 'nbmock_prepedidos_ux_' });

    nbMock.seed('clientes', [
        { id: 1, nome: 'Grupo CSN' },
        { id: 2, nome: 'Construtora Alfa Ltda' },
        { id: 3, nome: 'Mineração Beta S/A' }
    ]);

    nbMock.seed('fornecedores', [
        { id: 1, nome: 'Aços Vale Verde Ltda' },
        { id: 2, nome: 'Transportadora Rota Sul' },
        { id: 3, nome: 'Britagem Serra Azul' },
        { id: 4, nome: 'Cimento Forte Indústria' },
        { id: 5, nome: 'Locações Horizonte' },
        { id: 6, nome: 'Serviços Ápice Engenharia' }
    ]);

    nbMock.reset('pedidos', [
        { id: 1,  clienteId: 1, documento: '4500012345', fornecedorId: 1, unidade: 'Unidade Pedro Leopoldo', gestor: 'Carlos Andrade',  dataInclusao: '05/05/2026', status: 'Pendencia Cadastral' },
        { id: 2,  clienteId: 1, documento: '4500012346', fornecedorId: 2, unidade: 'Agregados Barueri',       gestor: 'Fernanda Lima',   dataInclusao: '06/05/2026', status: 'Regular' },
        { id: 3,  clienteId: 1, documento: '4500012347', fornecedorId: 3, unidade: 'Agregados Cajamar',       gestor: 'Rafael Souza',    dataInclusao: '07/05/2026', status: 'Pendencia Contratual' },
        { id: 4,  clienteId: 1, documento: '4500012351', fornecedorId: 4, unidade: 'Unidade Pedro Leopoldo', gestor: 'Carlos Andrade',  dataInclusao: '08/05/2026', status: 'Regular' },
        { id: 5,  clienteId: 1, documento: '4500012358', fornecedorId: 5, unidade: 'Agregados Barueri',       gestor: 'Juliana Prado',   dataInclusao: '11/05/2026', status: 'Pendencia Cadastral' },
        { id: 6,  clienteId: 1, documento: '4500012360', fornecedorId: 6, unidade: 'Agregados Cajamar',       gestor: 'Rafael Souza',    dataInclusao: '12/05/2026', status: 'Pendencia Contratual' },
        { id: 7,  clienteId: 1, documento: '4500012372', fornecedorId: 2, unidade: 'Unidade Pedro Leopoldo', gestor: 'Fernanda Lima',   dataInclusao: '13/05/2026', status: 'Regular' },
        { id: 8,  clienteId: 1, documento: '4500012385', fornecedorId: 1, unidade: 'Agregados Cajamar',       gestor: 'Juliana Prado',   dataInclusao: '14/05/2026', status: 'Pendencia Cadastral' },
        { id: 9,  clienteId: 1, documento: '4500012390', fornecedorId: 3, unidade: 'Agregados Barueri',       gestor: 'Carlos Andrade',  dataInclusao: '15/05/2026', status: 'Regular' },
        { id: 10, clienteId: 1, documento: '4500012404', fornecedorId: 4, unidade: 'Unidade Pedro Leopoldo', gestor: 'Marcos Oliveira', dataInclusao: '18/05/2026', status: 'Pendencia Contratual' },
        { id: 11, clienteId: 1, documento: '4500012417', fornecedorId: 5, unidade: 'Agregados Cajamar',       gestor: 'Rafael Souza',    dataInclusao: '19/05/2026', status: 'Regular' },
        { id: 12, clienteId: 1, documento: '4500012421', fornecedorId: 6, unidade: 'Agregados Barueri',       gestor: 'Patrícia Nunes',  dataInclusao: '20/05/2026', status: 'Pendencia Cadastral' },
        { id: 13, clienteId: 1, documento: '4500012438', fornecedorId: 2, unidade: 'Unidade Pedro Leopoldo', gestor: 'Fernanda Lima',   dataInclusao: '21/05/2026', status: 'Pendencia Contratual' },
        { id: 14, clienteId: 1, documento: '4500012445', fornecedorId: 1, unidade: 'Agregados Barueri',       gestor: 'Juliana Prado',   dataInclusao: '22/05/2026', status: 'Regular' },
        { id: 15, clienteId: 1, documento: '4500012456', fornecedorId: 3, unidade: 'Agregados Cajamar',       gestor: 'Carlos Andrade',  dataInclusao: '25/05/2026', status: 'Pendencia Cadastral' },
        { id: 16, clienteId: 2, documento: '7800045501', fornecedorId: 1, unidade: 'Agregados Barueri',       gestor: 'Marcos Oliveira', dataInclusao: '10/05/2026', status: 'Regular' },
        { id: 17, clienteId: 3, documento: '9900078820', fornecedorId: 3, unidade: 'Agregados Cajamar',       gestor: 'Patrícia Nunes',  dataInclusao: '21/05/2026', status: 'Regular' }
    ]);

    var CLIENTE_LOGADO_ID = 1;
    var perfil = 'demarco';
    var lastFocusEl = null;
    var pendingClassif = null; /* { id, val } aguardando confirmação */
    var filteredRows = [];
    var currentPage = 1;
    var pageSize = 10;
    var consultaAtiva = false;
    var sortKey = 'status';
    var sortDir = 'asc'; /* asc = mais crítico no topo */
    var filteredRows = [];
    var currentPage = 1;
    var pageSize = 10;
    var consultaAtiva = false;
    var sortKey = 'status';
    var sortDir = 'asc'; /* asc = mais crítico no topo */

    var COMPRADORES = ['Ana Martins', 'Bruno Costa', 'Camila Reis', 'Diego Alves', 'Eduarda Nunes', 'Felipe Ramos'];

    var PEND_CAD = {
        1:  ['fornecedor'],
        5:  ['unidadeNaoCadastrada', 'comprador'],
        8:  ['contraparte', 'gestor'],
        12: ['unidadeNaoAtrelada'],
        15: ['fornecedor', 'unidadeNaoCadastrada', 'gestor', 'comprador']
    };
    var PEND_LABEL = {
        fornecedor:           'Fornecedor não cadastrado',
        unidadeNaoCadastrada: 'Unidade não cadastrada',
        unidadeNaoAtrelada:   'Unidade não atrelada ao fornecedor',
        contraparte:          'Contraparte não cadastrado',
        gestor:               'Gestor do Contrato não cadastrado',
        comprador:            'Comprador não cadastrado'
    };
    var STATUS_LABEL = {
        'Pendencia Cadastral':  'Pendência Cadastral',
        'Pendencia Contratual': 'Pendência Contratual',
        'Regular':              'Regular'
    };

    function pendenciasDoPedido(p) {
        if (p.status !== 'Pendencia Cadastral') return [];
        return PEND_CAD[p.id] || ['fornecedor'];
    }

    function esc(v) {
        return String(v == null ? '' : v)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }
    /** Converte "Carlos Andrade" → "carlos.andrade@csn.com.br" */
    function nomeParaEmailCsn(nome) {
        var base = String(nome || '')
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .toLowerCase().trim()
            .replace(/[^a-z0-9\s.-]/g, '')
            .replace(/\s+/g, '.');
        return base ? base + '@csn.com.br' : '-';
    }
    function nomeFornecedor(id) {
        var f = nbMock.getSync('fornecedores', id);
        return f ? f.nome : '-';
    }
    function nomeCliente(id) {
        var c = nbMock.getSync('clientes', id);
        return c ? c.nome : '-';
    }
    function formatarData(br) {
        if (!br) return '-';
        var p = String(br).split(/[./]/);
        if (p.length !== 3) return br;
        var ano = p[2].length === 2 ? p[2] : p[2].slice(-2);
        return p[0] + '/' + p[1] + '/' + ano;
    }
    function badgeStatus(status) {
        var label = STATUS_LABEL[status] || status || '-';
        switch (status) {
            case 'Regular':
                return '<span class="nb-badge nb-badge--success">' + esc(label) + '</span>';
            case 'Pendencia Cadastral':
                return '<span class="nb-badge nb-badge--warning">' + esc(label) + '</span>';
            case 'Pendencia Contratual':
                return '<span class="nb-badge nb-badge--danger">' + esc(label) + '</span>';
            default:
                return '<span class="nb-badge nb-badge--muted">' + esc(label) + '</span>';
        }
    }
    function statusGeralFornecedor(pedidoStatus) {
        return pedidoStatus === 'Regular' ? 'APROVADO' : 'REGULAR';
    }
    function badgeStatusFornecedor(valor) {
        /* REGULAR usa a mesma cor do badge Regular da grid (success) */
        var cls = (valor === 'APROVADO' || valor === 'REGULAR')
            ? 'nb-badge--success'
            : 'nb-badge--muted';
        return '<span class="nb-badge ' + cls + '">' + esc(valor) + '</span>';
    }

    function preencherSelectClientes($sel) {
        var clientes = nbMock.listSync('clientes');
        $sel.find('option:not([value=""])').remove();
        clientes.forEach(function (c) {
            $sel.append('<option value="' + c.id + '">' + esc(c.nome) + '</option>');
        });
    }
    function preencherSelectFornecedores($sel) {
        var forns = nbMock.listSync('fornecedores');
        $sel.find('option:not([value=""])').remove();
        forns.forEach(function (f) {
            $sel.append('<option value="' + f.id + '">' + esc(f.nome) + '</option>');
        });
    }

    function buildDetalhe(p) {
        var nome = nomeFornecedor(p.fornecedorId);
        var codSap = { 'Unidade Pedro Leopoldo': 'SAP1001', 'Agregados Barueri': 'SAP2002', 'Agregados Cajamar': 'SAP3003' };
        var endereco = 'Av. das Indústrias, ' + (1000 + p.id) + ' - Galpão ' + p.fornecedorId +
                       ', Distrito Industrial, Contagem/MG, CEP 32010-0' + ('0' + p.id).slice(-2);
        return {
            id: p.id,
            numeroPedido: p.documento,
            dataInicioPedido: formatarData(p.dataInclusao),
            dataFimPedido: '31/12/26',
            status: p.status,
            pendencias: pendenciasDoPedido(p),
            fornecedor: {
                cnpj: '12.345.6' + ('0' + p.fornecedorId).slice(-2) + '/0001-' + ('0' + p.id).slice(-2),
                razaoSocial: nome,
                email: 'contato' + p.fornecedorId + '@fornecedor.com.br',
                telefone: '(31) 3333-' + (1000 + p.id),
                endereco: endereco,
                statusGeral: statusGeralFornecedor(p.status)
            },
            contratante: {
                emailContraparte: 'contraparte.grupocsn@csn.com.br',
                gestorContrato: p.gestor,
                comprador: COMPRADORES[(p.fornecedorId - 1) % COMPRADORES.length],
                unidades: [codSap[p.unidade] || 'SAP0000']
            }
        };
    }

    function row(label, val, pendente) {
        return '<li' + (pendente ? ' class="is-pend"' : '') + '>' +
            '<span class="det-label">' + esc(label) + '</span>' +
            '<span class="det-value">' + esc(val || '-') +
            (pendente ? '<span class="det-pend-tag">Pendente</span>' : '') +
            '</span></li>';
    }
    function rowHtml(label, htmlVal, pendente) {
        return '<li' + (pendente ? ' class="is-pend"' : '') + '>' +
            '<span class="det-label">' + esc(label) + '</span>' +
            '<span class="det-value">' + htmlVal +
            (pendente ? '<span class="det-pend-tag">Pendente</span>' : '') +
            '</span></li>';
    }

    function renderAlertPend(pend) {
        if (!pend.length) return '';
        var chips = pend.map(function (k) {
            return '<li>' + esc(PEND_LABEL[k] || k) + '</li>';
        }).join('');
        return '<div class="det-alert det-alert--danger" role="status">' +
            '<p class="det-alert-title">' + pend.length +
            (pend.length === 1 ? ' pendência cadastral' : ' pendências cadastrais') + '</p>' +
            '<ul class="det-alert-chips">' + chips + '</ul>' +
            '<p class="det-alert-note">Os campos afetados estão indicados abaixo.</p>' +
            '</div>';
    }

    function renderAlertClassif(id) {
        if (perfil === 'cliente') {
            return '<div class="det-alert det-alert--warn" role="region" aria-label="Classificação do pedido">' +
                '<p class="det-alert-title">Classificar pedido</p>' +
                '<p class="det-classif-prompt">Escolha uma opção para continuar:</p>' +
                '<div class="det-choice" role="radiogroup" aria-label="Tipo de classificação">' +
                    '<label class="det-choice-opt">' +
                        '<input type="radio" name="classif" value="Interno">' +
                        '<strong>Interno</strong>' +
                        '<span>Segue o fluxo Demarco</span>' +
                    '</label>' +
                    '<label class="det-choice-opt">' +
                        '<input type="radio" name="classif" value="Externo">' +
                        '<strong>Externo</strong>' +
                        '<span>Encaminha para tratativa externa</span>' +
                    '</label>' +
                '</div>' +
                '<div class="det-classif-actions">' +
                    '<button type="button" class="nb-btn is-disabled" id="btnClassificar" data-id="' + id +
                    '" disabled aria-disabled="true">Confirmar classificação</button>' +
                    '<p class="det-classif-hint" id="classifHint">Selecione Interno ou Externo</p>' +
                '</div>' +
                '</div>';
        }
        return '<div class="det-alert det-alert--warn" role="status">' +
            '<p class="det-alert-title">Aguardando classificação do Cliente</p>' +
            '<p class="det-alert-note" style="margin:0">A classificação deve ser realizada pelo perfil Cliente.</p>' +
            '</div>';
    }

    function renderDetalhe(d) {
        var f = d.fornecedor;
        var c = d.contratante;
        var pend = d.pendencias || [];
        function has(k) { return pend.indexOf(k) >= 0; }

        /* Se houver pendência de fornecedor, todos os campos da seção Fornecedor ficam pendentes */
        var fornPend = has('fornecedor');

        var unidadesBadges = (c.unidades || []).map(function (u) {
            return '<span class="nb-badge nb-badge--muted">' + esc(u) + '</span>';
        }).join(' ') || '-';

        var alertHtml = '';
        if (pend.length) alertHtml += renderAlertPend(pend);
        if (d.status === 'Pendencia Contratual') alertHtml += renderAlertClassif(d.id);

        var html =
            '<div class="det-meta">' +
                '<div class="det-meta-item">' +
                    '<span class="det-meta-label">Documento</span>' +
                    '<span class="det-meta-value">' + esc(d.numeroPedido) + '</span>' +
                '</div>' +
                '<div class="det-meta-item">' +
                    '<span class="det-meta-label">Início</span>' +
                    '<span class="det-meta-value">' + esc(d.dataInicioPedido) + '</span>' +
                '</div>' +
                '<div class="det-meta-item">' +
                    '<span class="det-meta-label">Fim</span>' +
                    '<span class="det-meta-value">' + esc(d.dataFimPedido) + '</span>' +
                '</div>' +
            '</div>' +
            alertHtml +
            '<div class="det-section">' +
                '<h3>Fornecedor</h3>' +
                '<ul class="det-rows">' +
                    row('CNPJ', f.cnpj, fornPend) +
                    row('Razão Social', f.razaoSocial, fornPend) +
                    row('E-mail', f.email, fornPend) +
                    row('Telefone', f.telefone, fornPend) +
                    row('Endereço', f.endereco, fornPend) +
                    rowHtml('Status Geral', badgeStatusFornecedor(f.statusGeral), fornPend) +
                '</ul>' +
            '</div>' +
            '<div class="det-section">' +
                '<h3>Dados Contratante</h3>' +
                '<ul class="det-rows">' +
                    row('E-mail Contraparte', c.emailContraparte, has('contraparte')) +
                    row('Gestor do Contrato',
                        has('gestor') ? nomeParaEmailCsn(c.gestorContrato) : c.gestorContrato,
                        has('gestor')) +
                    row('Comprador',
                        has('comprador') ? nomeParaEmailCsn(c.comprador) : c.comprador,
                        has('comprador')) +
                    rowHtml('Unidades', unidadesBadges,
                        has('unidadeNaoCadastrada') || has('unidadeNaoAtrelada')) +
                '</ul>' +
            '</div>';

        $('#detBody').html(html);
        $('#detStatus').html(badgeStatus(d.status));
    }

    function openModal(id) {
        if (typeof nb !== 'undefined' && nb.modal) nb.modal.open(id);
        else $('#' + id).css('display', 'flex');
    }
    function closeModal(id) {
        if (typeof nb !== 'undefined' && nb.modal) nb.modal.close(id);
        else $('#' + id).css('display', 'none');
    }

    async function abrirDetalhe(id) {
        lastFocusEl = document.activeElement;
        var p = await nbMock.get('pedidos', id);
        if (!p) return;
        var d = buildDetalhe(p);
        $('#detTitulo').text('Pedido ' + d.numeroPedido);
        renderDetalhe(d);
        openModal('divDetalhe');
        setTimeout(function () { $('#detBody').trigger('focus'); }, 50);
    }
    function fecharDetalhe() {
        closeModal('divDetalhe');
        if (lastFocusEl && typeof lastFocusEl.focus === 'function') {
            try { lastFocusEl.focus(); } catch (e) {}
        }
    }

    function abrirConfirmClassif(id, val) {
        pendingClassif = { id: id, val: val };
        var texto = val === 'Interno'
            ? 'Classificar como <strong>Interno</strong>? O status pode mudar para Regular ou Pendência Cadastral.'
            : 'Classificar como <strong>Externo</strong>? O status passará a Regular.';
        $('#confirmMsg').html(texto);
        openModal('divConfirmClassif');
        setTimeout(function () { $('#confirmOk').trigger('focus'); }, 50);
    }
    function fecharConfirm() {
        closeModal('divConfirmClassif');
        pendingClassif = null;
    }

    async function executarClassificacao(id, val) {
        if (val === 'Interno') {
            /* Determinístico: ímpar → Regular; par → Pendência Cadastral */
            var novo = (Number(id) % 2 === 1) ? 'Regular' : 'Pendencia Cadastral';
            await nbMock.update('pedidos', id, { status: novo });
            var msg = novo === 'Regular'
                ? 'Pedido classificado como Interno e regularizado.'
                : 'Pedido classificado como Interno. Agora está em Pendência Cadastral.';
            nbMock.toast('msgSucesso', msg);
        } else {
            await nbMock.update('pedidos', id, { status: 'Regular' });
            nbMock.toast('msgSucesso', 'Pedido classificado como Externo. Encaminhado para tratativa externa.');
        }
        fecharConfirm();
        fecharDetalhe();
        await filtrar();
    }

    function solicitarClassificar(id) {
        var val = $('input[name="classif"]:checked').val();
        if (!val) {
            nbMock.toast('msgAlerta', 'Selecione Interno ou Externo antes de confirmar.');
            $('input[name="classif"]').first().trigger('focus');
            return;
        }
        abrirConfirmClassif(id, val);
    }

    function lerFiltros() {
        return {
            cliente: perfil === 'cliente' ? String(CLIENTE_LOGADO_ID) : ($('#fltCliente').val() || ''),
            documento: ($('#fltDocumento').val() || '').trim().toLowerCase(),
            unidade: $('#fltUnidade').val() || '',
            fornecedor: $('#fltFornecedor').val() || '',
            status: $('#fltStatus').val() || ''
        };
    }

    function temFiltroSelecionado() {
        var f = lerFiltros();
        if (perfil === 'cliente') {
            return true; /* empresa já vem setada */
        }
        return !!(f.cliente || f.documento || f.unidade || f.fornecedor || f.status);
    }

    function atualizarBotaoFiltrar() {
        var ok = temFiltroSelecionado();
        $('#btnFiltrar').prop('disabled', !ok).attr('aria-disabled', ok ? 'false' : 'true');
    }

    function atualizarBotaoExportar() {
        var ok = consultaAtiva && filteredRows.length > 0;
        $('#btnExportar').prop('disabled', !ok).attr('aria-disabled', ok ? 'false' : 'true');
    }

    function limparResultados() {
        consultaAtiva = false;
        filteredRows = [];
        currentPage = 1;
        $('#gridBody').empty();
        $('#gridVazio').html(
            '<span class="nb-empty-state-icon" aria-hidden="true">⌀</span>' +
            '<strong>Nenhuma consulta realizada</strong><br />' +
            'Selecione os filtros desejados e clique em <strong>Filtrar</strong>.'
        ).show();
        $('#liveResultados').text('Nenhuma consulta realizada.');
        $('#pageRange').text('');
        $('#gridPager').empty().attr('hidden', true);
        $('#pagerTop').attr('hidden', true);
        $('#filtrosAtivos').empty();
        $('#statusSummary').empty().attr('hidden', true);
        atualizarBotaoExportar();
    }

    function renderFiltrosAtivos(f) {
        var chips = [];
        function add(key, label, valueText) {
            chips.push(
                '<span class="ux-filter-chip">' +
                    '<span>' + esc(label) + ': <strong>' + esc(valueText) + '</strong></span>' +
                    '<button type="button" data-clear="' + esc(key) + '" aria-label="Remover filtro ' + esc(label) + '">×</button>' +
                '</span>'
            );
        }
        if (f.cliente && perfil !== 'cliente') add('cliente', 'Cliente', nomeCliente(f.cliente));
        if (f.documento) add('documento', 'Documento', f.documento);
        if (f.unidade) add('unidade', 'Unidade', f.unidade);
        if (f.fornecedor) add('fornecedor', 'Fornecedor', nomeFornecedor(f.fornecedor));
        if (f.status) add('status', 'Status', STATUS_LABEL[f.status] || f.status);
        $('#filtrosAtivos').html(chips.join(''));
    }

    function totalPages() {
        return Math.max(1, Math.ceil(filteredRows.length / pageSize));
    }

    function pageWindow(total, page) {
        /* Estilo Relatório: até 10 números, reticências e Última à parte */
        var pages = [];
        if (total <= 10) {
            for (var i = 1; i <= total; i++) pages.push(i);
            return pages;
        }
        var windowSize = 10;
        var start = Math.max(1, Math.min(page - 4, total - windowSize + 1));
        var end = Math.min(total, start + windowSize - 1);
        for (var p = start; p <= end; p++) pages.push(p);
        return pages;
    }

    function formatTotal(n) {
        return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

    function renderPager() {
        var $top = $('#pagerTop');
        var $pager = $('#gridPager');
        var total = filteredRows.length;
        var pages = totalPages();

        if (!consultaAtiva) {
            $top.attr('hidden', true);
            $pager.empty().attr('hidden', true);
            $('#pageRange').text('');
            return;
        }

        $top.removeAttr('hidden');

        if (!total) {
            $('#pageRange').text('0-0 de 0');
            $pager.empty().attr('hidden', true);
            return;
        }

        if (currentPage > pages) currentPage = pages;

        var from = (currentPage - 1) * pageSize + 1;
        var to = Math.min(currentPage * pageSize, total);
        $('#pageRange').text(from + '-' + to + ' de ' + formatTotal(total));

        if (pages <= 1) {
            $pager.empty().attr('hidden', true);
            return;
        }

        var html = '';
        var win = pageWindow(pages, currentPage);
        var winStart = win[0];
        var winEnd = win[win.length - 1];

        if (winStart > 1) {
            html += '<a href="#" class="ux-pager-last" data-page="1" aria-label="Primeira página">« Primeira</a>';
            if (winStart > 2) {
                html += '<span class="ux-pager-ellipsis" aria-hidden="true">…</span>';
            }
        }

        win.forEach(function (item) {
            if (item === currentPage) {
                html += '<span aria-current="page">' + item + '</span>';
            } else {
                html += '<a href="#" data-page="' + item + '" aria-label="Ir para página ' + item + '">' + item + '</a>';
            }
        });

        if (winEnd < pages) {
            if (winEnd < pages - 1) {
                html += '<span class="ux-pager-ellipsis" aria-hidden="true">…</span>';
            }
            html += '<a href="#" class="ux-pager-last" data-page="' + pages + '" aria-label="Última página">Última »</a>';
        }

        $pager.html(html).removeAttr('hidden');
    }

    function prioridadeStatus(status) {
        /* Menor = mais crítico (topo na ordenação asc) */
        switch (status) {
            case 'Pendencia Contratual': return 0;
            case 'Pendencia Cadastral':  return 1;
            case 'Regular':              return 2;
            default:                     return 9;
        }
    }

    function valorOrdenacao(p, key) {
        switch (key) {
            case 'documento': return String(p.documento || '');
            case 'fornecedor': return nomeFornecedor(p.fornecedorId).toLowerCase();
            case 'unidade': return String(p.unidade || '').toLowerCase();
            case 'gestor': return String(p.gestor || '').toLowerCase();
            case 'status': return prioridadeStatus(p.status);
            case 'dataInclusao': {
                var parts = String(p.dataInclusao || '').split('/');
                if (parts.length !== 3) return 0;
                return (parseInt(parts[2], 10) * 10000) +
                    (parseInt(parts[1], 10) * 100) +
                    parseInt(parts[0], 10);
            }
            default: return '';
        }
    }

    function aplicarOrdenacao() {
        if (!sortKey || !filteredRows.length) {
            syncSortHeaders();
            return;
        }
        var dir = sortDir === 'desc' ? -1 : 1;
        var key = sortKey;
        filteredRows.sort(function (a, b) {
            var va = valorOrdenacao(a, key);
            var vb = valorOrdenacao(b, key);
            if (va < vb) return -1 * dir;
            if (va > vb) return 1 * dir;
            return (a.id - b.id) * dir;
        });
        syncSortHeaders();
    }

    function syncSortHeaders() {
        $('.nb-grid thead th.ux-sortable').each(function () {
            var $th = $(this);
            var key = $th.data('sort');
            $th.removeClass('is-sorted is-sorted-asc is-sorted-desc');
            if (sortKey && key === sortKey) {
                $th.addClass('is-sorted is-sorted-' + sortDir);
                $th.attr('aria-sort', sortDir === 'asc' ? 'ascending' : 'descending');
            } else {
                $th.attr('aria-sort', 'none');
            }
        });
    }

    function ordenarPor(key) {
        if (sortKey === key) {
            sortDir = sortDir === 'asc' ? 'desc' : 'asc';
        } else {
            sortKey = key;
            sortDir = 'asc';
        }
        currentPage = 1;
        aplicarOrdenacao();
        renderGridPage();
    }

    function renderGridPage() {
        aplicarOrdenacao();
        var $body = $('#gridBody').empty();
        var total = filteredRows.length;

        if (!total) {
            $('#gridVazio').html(
                '<span class="nb-empty-state-icon" aria-hidden="true">⌀</span>' +
                '<strong>Nenhum pedido encontrado</strong><br />' +
                'Ajuste ou limpe os filtros e tente novamente.'
            ).show();
            $('#liveResultados').text('0 pedidos na listagem.');
            renderPager();
            atualizarBotaoExportar();
            return;
        }

        $('#gridVazio').hide();
        var start = (currentPage - 1) * pageSize;
        var slice = filteredRows.slice(start, start + pageSize);

        slice.forEach(function (p) {
            var pend = pendenciasDoPedido(p);
            var pendHtml = pend.length
                ? '<span class="ux-pend-count" title="' + esc(pend.map(function (k) { return PEND_LABEL[k]; }).join('; ')) + '">' +
                      pend.length + (pend.length === 1 ? ' pendência' : ' pendências') +
                  '</span>'
                : '';
            $body.append(
                '<tr>' +
                    '<td style="text-align:center;white-space:nowrap">' +
                        '<button type="button" class="nb-grid-icon-btn nb-grid-icon-btn--edit btn-ver" data-id="' + p.id + '"' +
                        ' title="Visualizar pedido ' + esc(p.documento) + '"' +
                        ' aria-label="Visualizar pedido ' + esc(p.documento) + '">' +
                            '<span class="nb-icon nb-icon--edit" aria-hidden="true"></span>' +
                        '</button>' +
                    '</td>' +
                    '<td style="text-align:left">' +
                        '<button type="button" class="ux-doc-link btn-ver" data-id="' + p.id + '">' +
                            esc(p.documento || '-') +
                        '</button>' + pendHtml +
                    '</td>' +
                    '<td style="text-align:left">' + esc(nomeFornecedor(p.fornecedorId)) + '</td>' +
                    '<td style="text-align:left">' + esc(p.unidade || '-') + '</td>' +
                    '<td style="text-align:left">' + esc(p.gestor || '-') + '</td>' +
                    '<td style="text-align:center">' + esc(p.dataInclusao || '-') + '</td>' +
                    '<td style="text-align:center">' + badgeStatus(p.status) + '</td>' +
                '</tr>'
            );
        });

        var txt = total + (total === 1 ? ' pedido' : ' pedidos');
        $('#liveResultados').text(txt + ' na listagem. Página ' + currentPage + ' de ' + totalPages() + '.');
        renderPager();
        atualizarBotaoExportar();
    }

    async function filtrar() {
        var f = lerFiltros();
        renderFiltrosAtivos(f);
        consultaAtiva = true;

        filteredRows = await nbMock.list('pedidos', function (p) {
            if (f.cliente && String(p.clienteId) !== String(f.cliente)) return false;
            if (f.documento && String(p.documento).toLowerCase().indexOf(f.documento) === -1) return false;
            if (f.unidade && p.unidade !== f.unidade) return false;
            if (f.fornecedor && String(p.fornecedorId) !== String(f.fornecedor)) return false;
            if (f.status && p.status !== f.status) return false;
            return true;
        });
        currentPage = 1;
        renderGridPage();
        await atualizarResumoStatus();
        syncStatusChips(f.status);
    }

    function limparFiltro(key) {
        if (key === 'cliente' && perfil !== 'cliente') {
            $('#fltCliente').val('').trigger('change');
        } else if (key === 'documento') {
            $('#fltDocumento').val('');
        } else if (key === 'unidade') {
            $('#fltUnidade').val('').trigger('change');
        } else if (key === 'fornecedor') {
            $('#fltFornecedor').val('').trigger('change');
        } else if (key === 'status') {
            $('#fltStatus').val('').trigger('change');
        }
    }

    function limpar() {
        if (perfil !== 'cliente') {
            $('#fltCliente').val('').trigger('change');
        } else {
            $('#fltCliente').val(String(CLIENTE_LOGADO_ID)).trigger('change');
        }
        $('#fltDocumento').val('');
        $('#fltUnidade').val('').trigger('change');
        $('#fltFornecedor').val('').trigger('change');
        $('#fltStatus').val('').trigger('change');
    }

    function syncStatusChips(activeStatus) {
        $('#statusSummary .ux-chip-status').removeClass('is-active').attr('aria-pressed', 'false');
        var val = activeStatus || '';
        $('#statusSummary .ux-chip-status[data-status="' + val + '"]')
            .addClass('is-active').attr('aria-pressed', 'true');
    }

    async function atualizarResumoStatus() {
        if (!consultaAtiva) {
            $('#statusSummary').empty().attr('hidden', true);
            return;
        }

        /* Contagens com os mesmos filtros da consulta, exceto status */
        var f = lerFiltros();
        var base = await nbMock.list('pedidos', function (p) {
            if (f.cliente && String(p.clienteId) !== String(f.cliente)) return false;
            if (f.documento && String(p.documento).toLowerCase().indexOf(f.documento) === -1) return false;
            if (f.unidade && p.unidade !== f.unidade) return false;
            if (f.fornecedor && String(p.fornecedorId) !== String(f.fornecedor)) return false;
            return true;
        });

        var counts = {
            '': base.length,
            'Pendencia Cadastral': 0,
            'Pendencia Contratual': 0,
            'Regular': 0
        };
        base.forEach(function (p) {
            if (counts[p.status] != null) counts[p.status]++;
        });

        var ordem = [
            { key: '', label: 'Todos' },
            { key: 'Pendencia Contratual', label: 'Pend. Contratual' },
            { key: 'Pendencia Cadastral', label: 'Pend. Cadastral' },
            { key: 'Regular', label: 'Regular' }
        ];
        var html = ordem.map(function (o) {
            return '<button type="button" class="ux-chip-status" data-status="' + esc(o.key) + '"' +
                   ' aria-pressed="false">' +
                   '<span class="ux-chip-dot" aria-hidden="true"></span>' +
                   '<span>' + esc(o.label) + '</span>' +
                   '<span class="ux-chip-count">' + counts[o.key] + '</span>' +
                   '</button>';
        }).join('');
        $('#statusSummary').html(html).removeAttr('hidden');
        syncStatusChips(f.status);
    }

    function aplicarPerfil(novoPerfil) {
        perfil = novoPerfil;
        $('#perfilSwitch button').removeClass('active').attr('aria-selected', 'false')
            .filter('[data-perfil="' + perfil + '"]').addClass('active').attr('aria-selected', 'true');

        if (perfil === 'cliente') {
            $('#fltCliente').val(String(CLIENTE_LOGADO_ID)).trigger('change');
            $('#fltCliente').prop('disabled', true).trigger('change.select2');
            $('#campoCliente').addClass('is-locked');
            $('#perfilHint').text('Visão Cliente (Grupo CSN) — apenas pedidos da sua empresa. Filtro de Cliente bloqueado.');
            limpar();
            filtrar(); /* Cliente já vem com empresa setada — consulta automática */
            atualizarBotaoFiltrar();
        } else {
            $('#fltCliente').prop('disabled', false).trigger('change.select2');
            $('#campoCliente').removeClass('is-locked');
            if ($('#fltCliente').val() === String(CLIENTE_LOGADO_ID)) {
                $('#fltCliente').val('').trigger('change');
            }
            $('#perfilHint').text('Visão Demarco — use os filtros e clique em Filtrar para consultar.');
            limpar();
            limparResultados();
            atualizarBotaoFiltrar();
        }
    }

    $(function () {
        preencherSelectClientes($('#fltCliente'));
        preencherSelectFornecedores($('#fltFornecedor'));
        if (typeof nb !== 'undefined' && nb.autoInit) {
            try { nb.autoInit(); } catch (e) {}
        }
        /* Garante Select2 na largura total da coluna (evita width fixo residual) */
        $('#frmFiltros select.nb-select').each(function () {
            var $s = $(this);
            if ($s.hasClass('select2-hidden-accessible')) {
                $s.next('.select2-container').css('width', '100%');
            }
        });

        $('#frmFiltros').on('submit', function (e) {
            e.preventDefault();
            if (!temFiltroSelecionado()) return;
            filtrar();
        });
        $('#frmFiltros').on('input change', 'input, select', atualizarBotaoFiltrar);
        $('#fltCliente, #fltUnidade, #fltFornecedor, #fltStatus').on('change select2:select select2:clear', atualizarBotaoFiltrar);
        $('#btnLimpar').on('click', function () {
            limpar();
            if (perfil === 'cliente') {
                filtrar(); /* mantém a listagem do cliente logado */
            } else {
                limparResultados();
            }
            atualizarBotaoFiltrar();
            nbMock.toast('msgSucesso', 'Filtros limpos.');
        });
        $('#filtrosAtivos').on('click', 'button[data-clear]', function () {
            limparFiltro($(this).data('clear'));
            var f = lerFiltros();
            var semFiltroExtra = !f.documento && !f.unidade && !f.fornecedor && !f.status;
            if (perfil === 'demarco' && !f.cliente && semFiltroExtra) {
                limparResultados();
            } else {
                filtrar();
            }
            atualizarBotaoFiltrar();
        });
        $('#statusSummary').on('click', '.ux-chip-status', function () {
            var st = $(this).attr('data-status');
            $('#fltStatus').val(st).trigger('change');
            filtrar();
            atualizarBotaoFiltrar();
        });
        $('#btnExportar').on('click', function () {
            var n = filteredRows.length;
            if (!n) {
                nbMock.toast('msgAlerta', 'Não há pedidos na listagem para exportar.');
                return;
            }
            nbMock.simulate(function () {
                nbMock.toast('msgSucesso', 'Exportação de ' + n + ' pedido(s) concluída (protótipo).');
            });
        });
        $('#selPageSize').on('change', function () {
            pageSize = parseInt($(this).val(), 10) || 10;
            currentPage = 1;
            renderGridPage();
        });
        $('.nb-grid thead').on('click', 'th.ux-sortable .ux-sort-btn', function () {
            var key = $(this).closest('th').data('sort');
            if (key) ordenarPor(key);
        });
        $('#gridPager').on('click', 'a[data-page]', function (e) {
            e.preventDefault();
            if ($(this).attr('aria-disabled') === 'true') return;
            var page = parseInt($(this).attr('data-page'), 10);
            if (!page || page < 1 || page > totalPages()) return;
            currentPage = page;
            renderGridPage();
        });
        $('#perfilSwitch').on('click', 'button', function () {
            aplicarPerfil($(this).data('perfil'));
        });
        $('#gridBody').on('click', '.btn-ver', function () {
            abrirDetalhe($(this).data('id'));
        });
        $('#detBody').on('click', '#btnClassificar', function () {
            solicitarClassificar($(this).data('id'));
        });
        $('#detBody').on('change', 'input[name="classif"]', function () {
            var val = $(this).val();
            $('#detBody .det-choice-opt').removeClass('is-selected');
            $(this).closest('.det-choice-opt').addClass('is-selected');
            $('#btnClassificar').prop('disabled', false).attr('aria-disabled', 'false').removeClass('is-disabled');
            $('#classifHint').text(val === 'Interno' ? 'Selecionado: Interno' : 'Selecionado: Externo');
        });
        $('#btnGlossarioStatus').on('click', function () {
            openModal('divGlossarioStatus');
        });
        $('#glossarioFechar, #glossarioFechar2').on('click', function () {
            closeModal('divGlossarioStatus');
        });
        $('#detFechar, #detFechar2').on('click', fecharDetalhe);
        $('#confirmFechar, #confirmCancelar').on('click', fecharConfirm);
        $('#confirmOk').on('click', function () {
            if (!pendingClassif) return;
            executarClassificacao(pendingClassif.id, pendingClassif.val);
        });

        $(document).on('keydown', function (e) {
            if (e.key !== 'Escape') return;
            if ($('#divConfirmClassif').is(':visible')) {
                fecharConfirm();
                e.preventDefault();
            } else if ($('#divGlossarioStatus').is(':visible')) {
                closeModal('divGlossarioStatus');
                e.preventDefault();
            } else if ($('#divDetalhe').is(':visible')) {
                fecharDetalhe();
                e.preventDefault();
            }
        });

        aplicarPerfil('demarco');
    });

})();

/*
 * app.js ÔÇö Pr├®-Cadastro de Pedidos (PRD v1.5).
 * Perfis: Demarco ┬À Cliente (classifica) ┬À Exce├º├úo (bypass + arquivar).
 */
(function () {
    'use strict';

    if (typeof AdicionarTermo === 'function') {
        AdicionarTermo({ Sigla: 'Selecione', Valor: 'Selecione' });
    }

    nbMock.config({ minDelay: 350, maxDelay: 900, prefix: 'nbmock_prepedidos_ux_v15_' });

    var CSN_ID = 1;
    var CLIENTE_LOGADO_ID = CSN_ID;

    nbMock.seed('clientes', [
        { id: 1, nome: 'Grupo CSN', pendenciaContratual: true },
        { id: 2, nome: 'Cimento Nacional', pendenciaContratual: false },
        { id: 3, nome: 'CBMM', pendenciaContratual: false }
    ]);

    nbMock.seed('fornecedores', [
        { id: 1, nome: 'A├ºos Vale Verde Ltda' },
        { id: 2, nome: 'Transportadora Rota Sul' },
        { id: 3, nome: 'Britagem Serra Azul' },
        { id: 4, nome: 'Cimento Forte Ind├║stria' },
        { id: 5, nome: 'Loca├º├Áes Horizonte' },
        { id: 6, nome: 'Servi├ºos ├üpice Engenharia' }
    ]);

    function evt(quando, texto) {
        return { quando: quando, texto: texto };
    }

    nbMock.reset('pedidos', [
        { id: 1,  clienteId: 1, documento: '4500012345', fornecedorId: 1, unidade: 'Unidade Pedro Leopoldo', unidades: ['Unidade Pedro Leopoldo', 'Agregados Barueri'], subcontratadas: [], gestor: 'Carlos Andrade', dataInclusao: '05/05/2026', dataInicio: '10/05/2026', status: 'Pendencia Cadastral', classificacao: null, cadastroAtivo: false, arquivado: false, ignoredUnidades: [], ignoredSubs: [], tracking: [evt('05/05/2026 09:12', 'Entrada via API ÔÇö lote com pend├¬ncia cadastral (fornecedor).')] },
        { id: 2,  clienteId: 1, documento: '4500012346', fornecedorId: 2, unidade: 'Agregados Barueri', unidades: ['Agregados Barueri'], subcontratadas: [], gestor: 'Fernanda Lima', dataInclusao: '06/05/2026', dataInicio: '12/05/2026', status: 'Regular', classificacao: 'Interno', cadastroAtivo: true, arquivado: false, ignoredUnidades: [], ignoredSubs: [], tracking: [evt('06/05/2026 08:01', 'Entrada Regular.'), evt('06/05/2026 08:02', 'Cadastro ativo criado.')] },
        { id: 3,  clienteId: 1, documento: '4500012347', fornecedorId: 3, unidade: 'Agregados Cajamar', unidades: ['Agregados Cajamar', 'Unidade Pedro Leopoldo', 'Agregados Barueri'], subcontratadas: [{ cnpj: '11.222.333/0001-44', nome: 'Apoio Obras Sul' }], gestor: 'Rafael Souza', dataInclusao: '07/05/2026', dataInicio: '15/05/2026', status: 'Pendencia Contratual', classificacao: null, cadastroAtivo: false, arquivado: false, ignoredUnidades: [], ignoredSubs: [], tracking: [evt('07/05/2026 11:40', 'Entrada ÔÇö aguarda classifica├º├úo Interno/Externo (CSN).')] },
        { id: 4,  clienteId: 1, documento: '4500012351', fornecedorId: 4, unidade: 'Unidade Pedro Leopoldo', unidades: ['Unidade Pedro Leopoldo'], subcontratadas: [{ cnpj: '55.666.777/0001-88', nome: 'Guindastes Norte' }], gestor: 'Carlos Andrade', dataInclusao: '08/05/2026', dataInicio: '08/05/2026', status: 'Regular', classificacao: 'Interno', cadastroAtivo: true, arquivado: false, ignoredUnidades: [], ignoredSubs: [], tracking: [evt('08/05/2026 10:00', 'Entrada Regular ÔÇö cadastro ativo criado.')] },
        { id: 5,  clienteId: 1, documento: '4500012358', fornecedorId: 5, unidade: 'Agregados Barueri', unidades: ['Agregados Barueri', 'Agregados Cajamar', 'Unidade Pedro Leopoldo'], unidadesPendentes: ['Agregados Barueri', 'Agregados Cajamar'], subcontratadas: [{ cnpj: '99.888.777/0001-11', nome: 'Caldeiraria Leste' }], gestor: 'Juliana Prado', dataInclusao: '11/05/2026', dataInicio: '20/05/2026', status: 'Pendencia Cadastral', classificacao: 'Interno', cadastroAtivo: false, arquivado: false, ignoredUnidades: [], ignoredSubs: [], tracking: [evt('11/05/2026 14:22', 'Classificado Interno; permanece em pend├¬ncia cadastral.')] },
        { id: 6,  clienteId: 1, documento: '4500012360', fornecedorId: 6, unidade: 'Agregados Cajamar', unidades: ['Agregados Cajamar'], subcontratadas: [], gestor: 'Rafael Souza', dataInclusao: '12/05/2026', dataInicio: '01/06/2026', status: 'Pendencia Contratual', classificacao: 'Externo', cadastroAtivo: false, arquivado: false, ignoredUnidades: [], ignoredSubs: [], tracking: [evt('12/05/2026 09:00', 'Entrada.'), evt('13/05/2026 16:10', 'Classificado Externo ÔÇö nunca Regular; aguarda arquivar.')] },
        { id: 7,  clienteId: 1, documento: '4500012372', fornecedorId: 2, unidade: 'Unidade Pedro Leopoldo', unidades: ['Unidade Pedro Leopoldo', 'Agregados Cajamar'], subcontratadas: [], gestor: 'Fernanda Lima', dataInclusao: '13/05/2026', dataInicio: '18/05/2026', status: 'Regular', classificacao: 'Interno', cadastroAtivo: true, arquivado: false, ignoredUnidades: [], ignoredSubs: [], tracking: [evt('13/05/2026 08:30', 'Regular ÔÇö cadastro ativo criado.')] },
        { id: 8,  clienteId: 1, documento: '4500012385', fornecedorId: 1, unidade: 'Agregados Cajamar', unidades: ['Agregados Cajamar'], subcontratadas: [], gestor: 'Juliana Prado', dataInclusao: '14/05/2026', dataInicio: '25/05/2026', status: 'Pendencia Cadastral', classificacao: null, cadastroAtivo: false, arquivado: false, ignoredUnidades: [], ignoredSubs: [], tracking: [evt('14/05/2026 12:00', 'Entrada com pend├¬ncia de contraparte e gestor.')] },
        { id: 9,  clienteId: 1, documento: '4500012390', fornecedorId: 3, unidade: 'Agregados Barueri', unidades: ['Agregados Barueri', 'Unidade Pedro Leopoldo'], subcontratadas: [{ cnpj: '22.333.444/0001-55', nome: 'Montagem Beta' }, { cnpj: '33.444.555/0001-66', nome: 'El├®trica Gama' }], gestor: 'Carlos Andrade', dataInclusao: '15/05/2026', dataInicio: '22/05/2026', status: 'Regular', classificacao: 'Interno', cadastroAtivo: true, arquivado: false, ignoredUnidades: [], ignoredSubs: [], tracking: [evt('15/05/2026 09:15', 'Regular ÔÇö cadastro ativo.')] },
        { id: 10, clienteId: 1, documento: '4500012404', fornecedorId: 4, unidade: 'Unidade Pedro Leopoldo', unidades: ['Unidade Pedro Leopoldo'], subcontratadas: [], gestor: 'Marcos Oliveira', dataInclusao: '18/05/2026', dataInicio: '02/06/2026', status: 'Pendencia Contratual', classificacao: null, cadastroAtivo: false, arquivado: false, ignoredUnidades: [], ignoredSubs: [], tracking: [evt('18/05/2026 17:02', 'Entrada ÔÇö Pend├¬ncia Contratual.')] },
        { id: 11, clienteId: 1, documento: '4500012417', fornecedorId: 5, unidade: 'Agregados Cajamar', unidades: ['Agregados Cajamar', 'Agregados Barueri', 'Unidade Pedro Leopoldo'], subcontratadas: [], gestor: 'Rafael Souza', dataInclusao: '19/05/2026', dataInicio: '19/05/2026', status: 'Regular', classificacao: 'Interno', cadastroAtivo: true, arquivado: false, ignoredUnidades: [], ignoredSubs: [], tracking: [evt('19/05/2026 10:00', 'Regular ÔÇö cadastro ativo.')] },
        { id: 12, clienteId: 1, documento: '4500012421', fornecedorId: 6, unidade: 'Agregados Barueri', unidades: ['Agregados Barueri'], subcontratadas: [], gestor: 'Patr├¡cia Nunes', dataInclusao: '20/05/2026', dataInicio: '28/05/2026', status: 'Pendencia Cadastral', classificacao: 'Interno', cadastroAtivo: true, arquivado: false, ignoredUnidades: [], ignoredSubs: [], tracking: [evt('04/05/2026 09:00', 'Lote anterior Regular ÔÇö cadastro ativo criado.'), evt('20/05/2026 11:33', 'Reentrada irregular ÔÇö selo de vig├¬ncia; ativo intocado.')] },
        { id: 13, clienteId: 1, documento: '4500012438', fornecedorId: 2, unidade: 'Unidade Pedro Leopoldo', unidades: ['Unidade Pedro Leopoldo', 'Agregados Barueri'], subcontratadas: [{ cnpj: '77.111.222/0001-99', nome: 'Servi├ºos Delta' }], gestor: 'Fernanda Lima', dataInclusao: '21/05/2026', dataInicio: '05/06/2026', status: 'Pendencia Contratual', classificacao: null, cadastroAtivo: false, arquivado: false, ignoredUnidades: [], ignoredSubs: [], tracking: [evt('21/05/2026 08:44', 'Entrada ÔÇö Pend├¬ncia Contratual.')] },
        { id: 14, clienteId: 1, documento: '4500012445', fornecedorId: 1, unidade: 'Agregados Barueri', unidades: ['Agregados Barueri'], subcontratadas: [], gestor: 'Juliana Prado', dataInclusao: '22/05/2026', dataInicio: '01/06/2026', status: 'Regular', classificacao: 'Interno', cadastroAtivo: true, arquivado: false, ignoredUnidades: [], ignoredSubs: [], tracking: [evt('22/05/2026 13:10', 'Regular.')] },
        { id: 15, clienteId: 1, documento: '4500012456', fornecedorId: 3, unidade: 'Agregados Cajamar', unidades: ['Agregados Cajamar', 'Unidade Pedro Leopoldo', 'Agregados Barueri'], unidadesPendentes: ['Agregados Cajamar', 'Unidade Pedro Leopoldo'], subcontratadas: [{ cnpj: '88.999.000/0001-22', nome: 'Usinagem Omega' }, { cnpj: '12.120.120/0001-12', nome: 'Pintura Zeta' }], gestor: 'Carlos Andrade', dataInclusao: '25/05/2026', dataInicio: '10/06/2026', status: 'Pendencia Cadastral', classificacao: 'Interno', cadastroAtivo: false, arquivado: false, ignoredUnidades: [], ignoredSubs: [], tracking: [evt('25/05/2026 15:01', 'Interno com pend├¬ncias (fornecedor, unidades, subs, pessoas).')] },
        { id: 16, clienteId: 2, documento: '7800045501', fornecedorId: 1, unidade: 'Agregados Barueri', unidades: ['Agregados Barueri', 'Agregados Cajamar'], subcontratadas: [], gestor: 'Marcos Oliveira', dataInclusao: '10/05/2026', dataInicio: '15/05/2026', status: 'Regular', classificacao: null, cadastroAtivo: true, arquivado: false, ignoredUnidades: [], ignoredSubs: [], tracking: [evt('10/05/2026 09:00', 'Contrato CN ÔÇö flag PendenciaContratual desligada; entrou Regular.')] },
        { id: 17, clienteId: 3, documento: '9900078820', fornecedorId: 3, unidade: 'Agregados Cajamar', unidades: ['Agregados Cajamar'], subcontratadas: [], gestor: 'Patr├¡cia Nunes', dataInclusao: '21/05/2026', dataInicio: '30/05/2026', status: 'Pendencia Cadastral', classificacao: null, cadastroAtivo: false, arquivado: false, ignoredUnidades: [], ignoredSubs: [], tracking: [evt('21/05/2026 18:00', 'Contrato CBMM ÔÇö sem classifica├º├úo Interno/Externo; pend├¬ncia cadastral.')] },
        { id: 18, clienteId: 1, documento: '4500012500', fornecedorId: 2, unidade: 'Agregados Barueri', unidades: ['Agregados Barueri'], subcontratadas: [], gestor: 'Fernanda Lima', dataInclusao: '02/05/2026', dataInicio: '03/05/2026', status: 'Pendencia Contratual', classificacao: 'Externo', cadastroAtivo: false, arquivado: true, justificativaArquivo: 'Pedido de compra de material, fora do fluxo Demarco.', tracking: [evt('02/05/2026 10:00', 'Classificado Externo.'), evt('04/05/2026 11:20', 'Arquivado (exce├º├úo). Justificativa: Pedido de compra de material, fora do fluxo Demarco.')] }
    ]);

    var perfil = 'demarco';
    var lastFocusEl = null;
    var pendingClassif = null;
    var pendingBypass = null;
    var pendingArquivarId = null;
    var filteredRows = [];
    var currentPage = 1;
    var pageSize = 10;
    var consultaAtiva = false;
    var sortKey = 'dataInicio';
    var sortDir = 'asc';
    var chipDetalheAberto = null;

    var COMPRADORES = ['Ana Martins', 'Bruno Costa', 'Camila Reis', 'Diego Alves', 'Eduarda Nunes', 'Felipe Ramos'];

    var PEND_CAD = {
        1:  ['fornecedor'],
        5:  ['unidadeNaoCadastrada', 'comprador', 'subcontratadaNaoCadastrada'],
        8:  ['contraparte', 'gestorOutroCliente'],
        12: ['unidadeNaoAtrelada'],
        15: ['fornecedor', 'unidadeNaoCadastrada', 'gestorInativo', 'comprador', 'subcontratadaNaoAtrelada'],
        17: ['gestor']
    };

    var PEND_COPY = {
        fornecedor: {
            titulo: 'Fornecedor n├úo cadastrado',
            corpo: 'O CNPJ {cnpj} n├úo est├í cadastrado neste cliente. Todos os dados do fornecedor ficam pendentes at├® isso.',
            acao: 'Cadastre a empresa neste cliente. O pr├®-cadastro ser├í conferido de novo em seguida.'
        },
        unidadeNaoCadastrada: {
            titulo: 'Unidade n├úo cadastrada',
            corpo: 'O c├│digo {cod} n├úo corresponde a uma unidade deste cliente.',
            acao: 'Cadastre a unidade. Se N>1, perfil de exce├º├úo pode ignorar desde que reste ÔëÑ1 unidade.'
        },
        unidadeNaoAtrelada: {
            titulo: 'Unidade n├úo vinculada ao fornecedor',
            corpo: 'A unidade {nome} existe, mas o fornecedor n├úo est├í atrelado a ela.',
            acao: 'Fa├ºa o atrelamento. Mesma regra de ignorar se N>1.'
        },
        subcontratadaNaoCadastrada: {
            titulo: 'Subcontratada n├úo cadastrada',
            corpo: 'O CNPJ {cnpj} n├úo est├í cadastrado como empresa deste cliente.',
            acao: 'Cadastre a empresa ou ignore neste lote (perfil de exce├º├úo).'
        },
        subcontratadaNaoAtrelada: {
            titulo: 'Subcontratada sem v├¡nculo em todas as unidades',
            corpo: '{razao} existe, mas n├úo est├í vinculada a todas as unidades deste documento. Falta v├¡nculo em: {lista}.',
            acao: 'Fa├ºa o atrelamento ou ignore esta subcontratada neste lote.'
        },
        contraparte: {
            titulo: 'Contraparte n├úo cadastrado neste cliente',
            corpo: 'N├úo encontramos um usu├írio com o e-mail {valor} neste cliente.',
            acao: 'Cadastre o usu├írio neste cliente com esse e-mail.'
        },
        gestor: {
            titulo: 'Gestor do Contrato n├úo cadastrado neste cliente',
            corpo: 'N├úo encontramos um usu├írio com o e-mail {valor} neste cliente.',
            acao: 'Cadastre o usu├írio neste cliente com esse e-mail.'
        },
        gestorOutroCliente: {
            titulo: 'Gestor do Contrato n├úo pertence a este cliente',
            corpo: '{Nome} ({e-mail}) existe no Bancodoc em outro cliente. N├úo usamos esse cadastro aqui.',
            acao: 'Cadastre este e-mail como usu├írio neste cliente.'
        },
        gestorInativo: {
            titulo: 'Gestor do Contrato est├í inativo',
            corpo: '{Nome} ({e-mail}) est├í cadastrado, mas inativo.',
            acao: 'Reative o usu├írio ou envie outro e-mail na integra├º├úo.'
        },
        comprador: {
            titulo: 'Comprador n├úo cadastrado neste cliente',
            corpo: 'N├úo encontramos um usu├írio com o e-mail {valor} neste cliente.',
            acao: 'Cadastre o usu├írio neste cliente com esse e-mail.'
        }
    };

    var STATUS_LABEL = {
        'Pendencia Cadastral': 'Pend├¬ncia Cadastral',
        'Pendencia Contratual': 'Pend├¬ncia Contratual',
        'Regular': 'Regular'
    };

    var COD_SAP = {
        'Unidade Pedro Leopoldo': 'SAP1001',
        'Agregados Barueri': 'SAP2002',
        'Agregados Cajamar': 'SAP3003'
    };

    function clienteTemFlagContratual(clienteId) {
        var c = nbMock.getSync('clientes', clienteId);
        return !!(c && c.pendenciaContratual);
    }

    function perfilExcecao() { return perfil === 'excecao'; }
    function perfilClienteClassifica() { return perfil === 'cliente'; }
    function perfilRestritoEmpresa() { return perfil === 'cliente' || perfil === 'excecao'; }

    function unidadesPendentesAtivas(p) {
        var keys = PEND_CAD[p.id] || [];
        var temPend = keys.indexOf('unidadeNaoCadastrada') >= 0 || keys.indexOf('unidadeNaoAtrelada') >= 0;
        if (!temPend) return [];
        var base = (p.unidadesPendentes && p.unidadesPendentes.length)
            ? p.unidadesPendentes.slice()
            : unidadesOriginais(p);
        var ign = p.ignoredUnidades || [];
        return base.filter(function (u) { return ign.indexOf(u) < 0; });
    }
    function subsPendentesAtivas(p) {
        var keys = PEND_CAD[p.id] || [];
        var temPend = keys.indexOf('subcontratadaNaoCadastrada') >= 0 || keys.indexOf('subcontratadaNaoAtrelada') >= 0;
        if (!temPend) return [];
        var ign = p.ignoredSubs || [];
        return (p.subcontratadas || []).filter(function (s) { return ign.indexOf(s.cnpj) < 0; });
    }

    function pendenciasDoPedido(p) {
        if (p.status !== 'Pendencia Cadastral') return [];
        var list = (PEND_CAD[p.id] || ['fornecedor']).slice();
        if (!unidadesPendentesAtivas(p).length) {
            list = list.filter(function (k) {
                return k !== 'unidadeNaoCadastrada' && k !== 'unidadeNaoAtrelada';
            });
        }
        if (!subsPendentesAtivas(p).length) {
            list = list.filter(function (k) {
                return k !== 'subcontratadaNaoCadastrada' && k !== 'subcontratadaNaoAtrelada';
            });
        }
        return list;
    }

    function unidadesDoPedido(p) {
        var uns = (p.unidades && p.unidades.length) ? p.unidades.slice() : (p.unidade ? [p.unidade] : []);
        var ign = p.ignoredUnidades || [];
        return uns.filter(function (u) { return ign.indexOf(u) < 0; });
    }
    function unidadesOriginais(p) {
        return (p.unidades && p.unidades.length) ? p.unidades.slice() : (p.unidade ? [p.unidade] : []);
    }
    function subsDoPedido(p) {
        var list = (p.subcontratadas || []).slice();
        var ign = p.ignoredSubs || [];
        return list.filter(function (s) { return ign.indexOf(s.cnpj) < 0; });
    }

    function esc(v) {
        return String(v == null ? '' : v)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }
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
    function cnpjFornecedor(p) {
        return '12.345.6' + ('0' + p.fornecedorId).slice(-2) + '/0001-' + ('0' + p.id).slice(-2);
    }
    function dataToNum(br) {
        var parts = String(br || '').split('/');
        if (parts.length !== 3) return 0;
        return (parseInt(parts[2], 10) * 10000) + (parseInt(parts[1], 10) * 100) + parseInt(parts[0], 10);
    }
    function formatarData(br) {
        if (!br) return '-';
        var p = String(br).split(/[./]/);
        if (p.length !== 3) return br;
        var ano = p[2].length === 2 ? p[2] : p[2].slice(-2);
        return p[0] + '/' + p[1] + '/' + ano;
    }
    function badgeStatus(p) {
        if (p.arquivado) {
            return '<span class="nb-badge nb-badge--muted">Arquivado</span>';
        }
        if (p.classificacao === 'Externo' && p.status !== 'Regular') {
            return '<span class="nb-badge nb-badge--muted">Externo</span>';
        }
        var status = p.status;
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
        var cls = (valor === 'APROVADO' || valor === 'REGULAR') ? 'nb-badge--success' : 'nb-badge--muted';
        return '<span class="nb-badge ' + cls + '">' + esc(valor) + '</span>';
    }

    function interpolar(tpl, p, k) {
        var s = tpl || '';
        var sub = (subsDoPedido(p)[0] || {});
        var uns = unidadesDoPedido(p);
        return s
            .replace('{cnpj}', k && k.indexOf('sub') === 0 ? (sub.cnpj || 'ÔÇö') : cnpjFornecedor(p))
            .replace('{cod}', COD_SAP[uns[0]] || 'SAP0000')
            .replace('{nome}', uns[0] || 'ÔÇö')
            .replace('{razao}', sub.nome || sub.cnpj || 'ÔÇö')
            .replace('{lista}', uns.slice(1).join(', ') || uns[0] || 'ÔÇö')
            .replace('{valor}', nomeParaEmailCsn(p.gestor))
            .replace('{Nome}', p.gestor || 'ÔÇö')
            .replace('{e-mail}', nomeParaEmailCsn(p.gestor));
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
        $sel.find('option').filter(function () {
            var v = this.value;
            return v !== '' && v !== '__todos__';
        }).remove();
        forns.forEach(function (f) {
            $sel.append('<option value="' + f.id + '">' + esc(f.nome) + '</option>');
        });
    }

    function openModal(id) {
        if (typeof nb !== 'undefined' && nb.modal) nb.modal.open(id);
        else $('#' + id).css('display', 'flex');
    }
    function closeModal(id) {
        if (typeof nb !== 'undefined' && nb.modal) nb.modal.close(id);
        else $('#' + id).css('display', 'none');
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

    function renderChipCards(p, pend) {
        if (!pend.length) return '';
        return '<div class="det-alert det-alert--danger" role="status">' +
            '<p class="det-alert-title">' + pend.length +
            (pend.length === 1 ? ' pend├¬ncia cadastral' : ' pend├¬ncias cadastrais') + '</p>' +
            pend.map(function (k) {
                var cp = PEND_COPY[k] || { titulo: k, corpo: '', acao: '' };
                var aberto = chipDetalheAberto === k;
                return '<button type="button" class="ux-chip-card" data-chip="' + esc(k) + '">' +
                    '<strong>' + esc(cp.titulo) + '</strong>' +
                    (aberto
                        ? '<span>' + esc(interpolar(cp.corpo, p, k)) + '<br><em>' + esc(cp.acao) + '</em></span>'
                        : '<span>Clique para ver o dado recebido e o que fazer.</span>') +
                    '</button>';
            }).join('') +
            '<p class="det-alert-note">Os campos afetados est├úo indicados abaixo.</p>' +
            '</div>';
    }

    function renderAlertClassif(p) {
        if (p.classificacao === 'Externo') {
            var html = '<div class="det-alert det-alert--warn" role="status">' +
                '<p class="det-alert-title">Pedido externo</p>' +
                '<p class="det-alert-note" style="margin:0 0 .65rem">Este pedido n├úo segue o fluxo Demarco e n├úo fica Regular. Ele permanece aqui at├® ser arquivado.</p>';
            if (perfilExcecao() && !p.arquivado) {
                html += '<button type="button" class="nb-btn" id="btnArquivar" data-id="' + p.id + '">Arquivar pedido</button>';
            } else if (!perfilExcecao()) {
                html += '<p class="det-alert-note">Somente o perfil de exce├º├úo pode arquivar.</p>';
            }
            return html + '</div>';
        }
        if (p.status !== 'Pendencia Contratual') return '';
        if (!clienteTemFlagContratual(p.clienteId)) return '';
        if (perfilClienteClassifica()) {
            return '<div class="det-alert det-alert--warn" role="region" aria-label="Classifica├º├úo do pedido">' +
                '<p class="det-alert-title">Classificar pedido</p>' +
                '<p class="det-classif-prompt">Escolha uma op├º├úo para continuar:</p>' +
                '<div class="det-choice" role="radiogroup" aria-label="Tipo de classifica├º├úo">' +
                    '<label class="det-choice-opt">' +
                        '<input type="radio" name="classif" value="Interno">' +
                        '<strong>Interno</strong>' +
                        '<span>Segue o fluxo Demarco</span>' +
                    '</label>' +
                    '<label class="det-choice-opt">' +
                        '<input type="radio" name="classif" value="Externo">' +
                        '<strong>Externo</strong>' +
                        '<span>N├úo fica Regular; permanece at├® o perfil de exce├º├úo arquivar</span>' +
                    '</label>' +
                '</div>' +
                '<div class="det-classif-actions">' +
                    '<button type="button" class="nb-btn is-disabled" id="btnClassificar" data-id="' + p.id +
                    '" disabled aria-disabled="true">Confirmar classifica├º├úo</button>' +
                    '<p class="det-classif-hint" id="classifHint">Selecione Interno ou Externo</p>' +
                '</div></div>';
        }
        return '<div class="det-alert det-alert--warn" role="status">' +
            '<p class="det-alert-title">Aguardando classifica├º├úo do Cliente</p>' +
            '<p class="det-alert-note" style="margin:0">A classifica├º├úo Interno/Externo ├® do perfil Cliente (CSN). Demarco e exce├º├úo apenas visualizam.</p>' +
            '</div>';
    }

    function btnBypass(tipo, key, label) {
        if (!perfilExcecao()) return '';
        return ' <button type="button" class="nb-btn nb-btn--secondary btn-bypass" data-tipo="' + esc(tipo) +
            '" data-key="' + esc(key) + '" style="margin-left:.35rem;min-height:28px;padding:.15rem .5rem;font-size:.75rem">' +
            esc(label) + '</button>';
    }

    function renderDetalheFromPedido(p) {
        var nome = nomeFornecedor(p.fornecedorId);
        var uns = unidadesDoPedido(p);
        var orig = unidadesOriginais(p);
        var pend = pendenciasDoPedido(p);
        function has(k) { return pend.indexOf(k) >= 0; }
        var fornPend = has('fornecedor');
        var endereco = 'Av. das Ind├║strias, ' + (1000 + p.id) + ' - Galp├úo ' + p.fornecedorId +
            ', Distrito Industrial, Contagem/MG';
        var pendUns = unidadesPendentesAtivas(p);
        var ignUns = p.ignoredUnidades || [];
        /* Ignorar: s├│ em unidade PENDENTE e s├│ se restar ÔëÑ1 unidade no lote */
        var podeIgnorarMais = perfilExcecao() && uns.length > 1;

        var unidadesHtml = '<div class="det-section"><h3>Unidades</h3><ul class="det-rows">';
        if (!orig.length) {
            unidadesHtml += row('Unidade', '-', false);
        } else {
            orig.forEach(function (u) {
                var cod = (COD_SAP[u] || 'SAP0000') + ' ┬À ' + u;
                if (ignUns.indexOf(u) >= 0) {
                    unidadesHtml += row(u, 'Ignorada neste lote', false);
                    return;
                }
                var pendU = pendUns.indexOf(u) >= 0;
                var extra = (podeIgnorarMais && pendU)
                    ? btnBypass('unidade', u, 'Ignorar neste lote')
                    : '';
                unidadesHtml += rowHtml(u, esc(cod) + extra, pendU);
            });
        }
        unidadesHtml += '</ul></div>';

        var compradorEmail = nomeParaEmailCsn(COMPRADORES[(p.fornecedorId - 1) % COMPRADORES.length]);
        var gestorPend = has('gestor') || has('gestorOutroCliente') || has('gestorInativo');

        var subs = p.subcontratadas || [];
        var subsHtml = '';
        if (subs.length) {
            var vis = subsDoPedido(p);
            var pendSubs = subsPendentesAtivas(p);
            var pendSubCnpjs = pendSubs.map(function (s) { return s.cnpj; });
            subsHtml = '<div class="det-section"><h3>Subcontratadas</h3><ul class="det-rows">';
            vis.forEach(function (s) {
                var pendSub = pendSubCnpjs.indexOf(s.cnpj) >= 0;
                var extra = (perfilExcecao() && pendSub)
                    ? btnBypass('sub', s.cnpj, 'Ignorar neste lote')
                    : '';
                subsHtml += rowHtml(s.nome, esc(s.cnpj) + extra, pendSub);
            });
            (p.ignoredSubs || []).forEach(function (cnpj) {
                var s = subs.filter(function (x) { return x.cnpj === cnpj; })[0];
                subsHtml += row(s ? s.nome : cnpj, 'Ignorada neste lote', false);
            });
            subsHtml += '</ul></div>';
        }

        var track = (p.tracking || []).map(function (t) {
            return '<li><time>' + esc(t.quando) + '</time>' + esc(t.texto) + '</li>';
        }).join('');

        var html =
            '<div class="det-meta">' +
                '<div class="det-meta-item"><span class="det-meta-label">Documento</span>' +
                    '<span class="det-meta-value">' + esc(p.documento) +
                    (p.cadastroAtivo ? ' <span class="ux-selo-ativo" title="Pedido ativo">A</span>' : '') +
                    '</span></div>' +
                '<div class="det-meta-item"><span class="det-meta-label">In├¡cio</span>' +
                    '<span class="det-meta-value">' + esc(formatarData(p.dataInicio || p.dataInclusao)) + '</span></div>' +
                '<div class="det-meta-item"><span class="det-meta-label">Fim</span>' +
                    '<span class="det-meta-value">31/12/26</span></div>' +
            '</div>' +
            renderChipCards(p, pend) +
            renderAlertClassif(p) +
            '<div class="det-section"><h3>Fornecedor</h3><ul class="det-rows">' +
                row('CNPJ', cnpjFornecedor(p), fornPend) +
                row('Raz├úo Social', nome, fornPend) +
                row('E-mail', 'contato' + p.fornecedorId + '@fornecedor.com.br', fornPend) +
                row('Telefone', '(31) 3333-' + (1000 + p.id), fornPend) +
                row('Endere├ºo', endereco, fornPend) +
                rowHtml('Status Geral', badgeStatusFornecedor(statusGeralFornecedor(p.status)), fornPend) +
            '</ul></div>' +
            '<div class="det-section"><h3>Dados Contratante</h3><ul class="det-rows">' +
                row('E-mail Contraparte', 'contraparte.grupocsn@csn.com.br', has('contraparte')) +
                row('Gestor do Contrato', nomeParaEmailCsn(p.gestor), gestorPend) +
                row('Comprador', compradorEmail, has('comprador')) +
            '</ul></div>' +
            unidadesHtml +
            subsHtml +
            '<div class="det-section"><h3>Tracking do v├¡nculo</h3>' +
                '<ul class="ux-timeline">' + (track || '<li>Sem eventos</li>') + '</ul></div>';

        $('#detBody').html(html);
        $('#detStatus').html(badgeStatus(p));
    }

    async function abrirDetalhe(id) {
        lastFocusEl = document.activeElement;
        chipDetalheAberto = null;
        var p = await nbMock.get('pedidos', id);
        if (!p) return;
        $('#detTitulo').text('Pedido ' + p.documento);
        renderDetalheFromPedido(p);
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
            ? 'Classificar como <strong>Interno</strong>? O status pode ir para Regular ou Pend├¬ncia Cadastral.'
            : 'Classificar como <strong>Externo</strong>? O pedido <strong>n├úo</strong> fica Regular e permanece no pr├®-cadastro at├® o perfil de exce├º├úo arquivar.';
        $('#confirmMsg').html(texto);
        openModal('divConfirmClassif');
        setTimeout(function () { $('#confirmOk').trigger('focus'); }, 50);
    }
    function fecharConfirm() {
        closeModal('divConfirmClassif');
        pendingClassif = null;
    }

    function pushTrack(p, texto) {
        var t = p.tracking ? p.tracking.slice() : [];
        var now = new Date();
        var stamp = ('0' + now.getDate()).slice(-2) + '/' + ('0' + (now.getMonth() + 1)).slice(-2) +
            '/' + now.getFullYear() + ' ' + ('0' + now.getHours()).slice(-2) + ':' + ('0' + now.getMinutes()).slice(-2);
        t.push({ quando: stamp, texto: texto });
        return t;
    }

    async function executarClassificacao(id, val) {
        var p = nbMock.getSync('pedidos', id);
        if (val === 'Interno') {
            var novo = (PEND_CAD[id] && PEND_CAD[id].length) ? 'Pendencia Cadastral' : 'Regular';
            var patch = {
                status: novo,
                classificacao: 'Interno',
                cadastroAtivo: novo === 'Regular' ? true : !!p.cadastroAtivo,
                tracking: pushTrack(p, novo === 'Regular'
                    ? 'Classificado Interno ÔåÆ Regular; cadastro ativo criado/atualizado.'
                    : 'Classificado Interno; permanece em Pend├¬ncia Cadastral.')
            };
            await nbMock.update('pedidos', id, patch);
            nbMock.toast('msgSucesso', novo === 'Regular'
                ? 'Pedido classificado como Interno e regularizado.'
                : 'Pedido classificado como Interno. Agora est├í em Pend├¬ncia Cadastral.');
        } else {
            await nbMock.update('pedidos', id, {
                status: 'Pendencia Contratual',
                classificacao: 'Externo',
                tracking: pushTrack(p, 'Classificado Externo ÔÇö nunca Regular; permanece at├® arquivar.')
            });
            nbMock.toast('msgSucesso', 'Pedido classificado como Externo. N├úo fica Regular.');
        }
        fecharConfirm();
        fecharDetalhe();
        await filtrar();
    }

    function solicitarClassificar(id) {
        var val = $('input[name="classif"]:checked').val();
        if (!val) {
            nbMock.toast('msgAlerta', 'Selecione Interno ou Externo antes de confirmar.');
            return;
        }
        abrirConfirmClassif(id, val);
    }

    function abrirBypass(tipo, key, pedidoId) {
        var p = nbMock.getSync('pedidos', pedidoId);
        pendingBypass = { tipo: tipo, key: key, id: pedidoId };
        if (tipo === 'unidade') {
            var pendAtivas = unidadesPendentesAtivas(p);
            if (pendAtivas.indexOf(key) < 0) {
                nbMock.toast('msgAlerta', 'S├│ ├® poss├¡vel ignorar unidades pendentes.');
                pendingBypass = null;
                return;
            }
            var rest = unidadesDoPedido(p).filter(function (u) { return u !== key; });
            if (!rest.length) {
                nbMock.toast('msgAlerta', 'Deve restar ao menos 1 unidade no lote.');
                pendingBypass = null;
                return;
            }
            $('#bypassTitulo').text('Ignorar unidade neste lote');
            $('#bypassMsg').text('A unidade ' + key + ' n├úo entra no cadastro deste lote. As demais unidades pendentes permanecem at├® serem ignoradas individualmente. Precisa restar ÔëÑ 1 unidade.');
        } else {
            var pendSubs = subsPendentesAtivas(p).map(function (s) { return s.cnpj; });
            if (pendSubs.indexOf(key) < 0) {
                nbMock.toast('msgAlerta', 'S├│ ├® poss├¡vel ignorar subcontratadas pendentes.');
                pendingBypass = null;
                return;
            }
            $('#bypassTitulo').text('Ignorar subcontratada neste lote');
            $('#bypassMsg').text('A subcontratada ' + key + ' n├úo entra no cadastro deste lote. O pr├│ximo envio reavalia.');
        }
        $('#bypassJust').val('');
        openModal('divBypass');
    }

    async function confirmarBypass() {
        var just = ($('#bypassJust').val() || '').trim();
        if (!just) {
            nbMock.toast('msgAlerta', 'Justificativa obrigat├│ria.');
            return;
        }
        var b = pendingBypass;
        if (!b || !b.key) {
            nbMock.toast('msgAlerta', 'N├úo foi poss├¡vel identificar o item a ignorar.');
            return;
        }
        var p = nbMock.getSync('pedidos', b.id);
        var patch = {
            tracking: pushTrack(p, 'Bypass de ' + b.tipo + ' (' + b.key + '). Justificativa: ' + just)
        };
        if (b.tipo === 'unidade') {
            var jaIgnoradas = (p.ignoredUnidades || []).slice();
            if (jaIgnoradas.indexOf(b.key) < 0) jaIgnoradas.push(b.key);
            patch.ignoredUnidades = jaIgnoradas;
        } else {
            var jaIgnSubs = (p.ignoredSubs || []).slice();
            if (jaIgnSubs.indexOf(b.key) < 0) jaIgnSubs.push(b.key);
            patch.ignoredSubs = jaIgnSubs;
        }
        var merged = {};
        Object.keys(p).forEach(function (k) { merged[k] = p[k]; });
        Object.keys(patch).forEach(function (k) { merged[k] = patch[k]; });
        var nextPend = pendenciasDoPedido(merged);
        if (!nextPend.length && p.classificacao !== 'Externo') {
            patch.status = 'Regular';
            patch.cadastroAtivo = true;
            merged.status = patch.status;
            merged.cadastroAtivo = patch.cadastroAtivo;
            patch.tracking = pushTrack(merged, 'Sem pend├¬ncias restantes neste lote ÔåÆ Regular.');
        }
        await nbMock.update('pedidos', b.id, patch);
        closeModal('divBypass');
        pendingBypass = null;
        nbMock.toast('msgSucesso', 'Ignorado neste lote.');
        await filtrar();
        await abrirDetalhe(b.id);
    }

    async function confirmarArquivar() {
        var just = ($('#arquivarJust').val() || '').trim();
        if (!just) {
            nbMock.toast('msgAlerta', 'Justificativa obrigat├│ria.');
            return;
        }
        var id = pendingArquivarId;
        var p = nbMock.getSync('pedidos', id);
        await nbMock.update('pedidos', id, {
            arquivado: true,
            justificativaArquivo: just,
            tracking: pushTrack(p, 'Arquivado pelo perfil de exce├º├úo. Justificativa: ' + just)
        });
        closeModal('divArquivar');
        pendingArquivarId = null;
        fecharDetalhe();
        nbMock.toast('msgSucesso', 'Pedido arquivado (n├úo foi exclu├¡do).');
        await filtrar();
    }

    function lerFiltros() {
        function valFiltro($el) {
            var v = $el.val() || '';
            return v === '__todos__' ? '' : v;
        }
        return {
            cliente: perfilRestritoEmpresa() ? String(CLIENTE_LOGADO_ID) : ($('#fltCliente').val() || ''),
            documento: ($('#fltDocumento').val() || '').trim().toLowerCase(),
            unidade: valFiltro($('#fltUnidade')),
            fornecedor: valFiltro($('#fltFornecedor')),
            status: $('#fltStatus').val() || '',
            arquivados: $('#fltArquivados').prop('checked')
        };
    }

    function temFiltroSelecionado() {
        var f = lerFiltros();
        if (perfilRestritoEmpresa()) return true;
        return !!(f.cliente || f.documento || f.unidade || f.fornecedor || f.status || f.arquivados);
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
            '<span class="nb-empty-state-icon" aria-hidden="true">ÔîÇ</span>' +
            '<strong>Nenhuma consulta realizada</strong><br />' +
            'Selecione os filtros desejados e clique em <strong>Filtrar</strong>.'
        ).show();
        $('#liveResultados').text('Nenhuma consulta realizada.');
        $('#pageRange').text('');
        $('#gridPager').empty().attr('hidden', true);
        $('#pagerTop').attr('hidden', true);
        $('#statusSummary').empty().attr('hidden', true);
        atualizarBotaoExportar();
    }

    function totalPages() {
        return Math.max(1, Math.ceil(filteredRows.length / pageSize));
    }
    function pageWindow(total, page) {
        var pages = [];
        if (total <= 10) {
            for (var i = 1; i <= total; i++) pages.push(i);
            return pages;
        }
        var start = Math.max(1, Math.min(page - 4, total - 9));
        var end = Math.min(total, start + 9);
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
            html += '<a href="#" class="ux-pager-last" data-page="1" aria-label="Primeira p├ígina">┬½ Primeira</a>';
            if (winStart > 2) html += '<span class="ux-pager-ellipsis" aria-hidden="true">ÔÇª</span>';
        }
        win.forEach(function (item) {
            html += item === currentPage
                ? '<span aria-current="page">' + item + '</span>'
                : '<a href="#" data-page="' + item + '" aria-label="Ir para p├ígina ' + item + '">' + item + '</a>';
        });
        if (winEnd < pages) {
            if (winEnd < pages - 1) html += '<span class="ux-pager-ellipsis" aria-hidden="true">ÔÇª</span>';
            html += '<a href="#" class="ux-pager-last" data-page="' + pages + '" aria-label="├Ültima p├ígina">├Ültima ┬╗</a>';
        }
        $pager.html(html).removeAttr('hidden');
    }

    function prioridadeStatus(p) {
        if (p.arquivado) return 8;
        if (p.classificacao === 'Externo') return 0;
        switch (p.status) {
            case 'Pendencia Contratual': return 1;
            case 'Pendencia Cadastral': return 2;
            case 'Regular': return 3;
            default: return 9;
        }
    }

    function valorOrdenacao(p, key) {
        switch (key) {
            case 'documento': return String(p.documento || '');
            case 'fornecedor': return nomeFornecedor(p.fornecedorId).toLowerCase();
            case 'unidade': return String(p.unidade || '').toLowerCase();
            case 'subcontratadas': return String((p.subcontratadas || []).length);
            case 'gestor': return nomeParaEmailCsn(p.gestor).toLowerCase();
            case 'status': return prioridadeStatus(p);
            case 'dataInclusao': return dataToNum(p.dataInclusao);
            case 'dataInicio': return dataToNum(p.dataInicio || p.dataInclusao);
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
        if (sortKey === key) sortDir = sortDir === 'asc' ? 'desc' : 'asc';
        else {
            sortKey = key;
            sortDir = key === 'dataInicio' ? 'asc' : 'asc';
        }
        currentPage = 1;
        aplicarOrdenacao();
        renderGridPage();
    }

    function celulaSubs(p) {
        var list = p.subcontratadas || [];
        if (!list.length) {
            var tip = p.clienteId === CSN_ID
                ? 'Este pedido n├úo possui subcontratadas'
                : 'Este contrato n├úo possui subcontratadas';
            return '<span title="' + esc(tip) + '">ÔÇö</span>';
        }
        if (list.length === 1) return esc(list[0].nome || list[0].cnpj);
        return '<button type="button" class="nb-grid-icon-btn btn-subs" data-id="' + p.id + '"' +
            ' title="Ver ' + list.length + ' subcontratadas" aria-label="Ver ' + list.length + ' subcontratadas">' +
            '<span class="nb-icon nb-icon--view" aria-hidden="true"></span></button>';
    }

    function celulaUnidade(p) {
        var uns = unidadesOriginais(p);
        if (uns.length > 1) {
            return '<button type="button" class="nb-grid-icon-btn btn-unidades" data-id="' + p.id + '"' +
                ' title="Ver ' + uns.length + ' unidades" aria-label="Ver unidades">' +
                '<span class="nb-icon nb-icon--view" aria-hidden="true"></span></button>';
        }
        return esc(uns[0] || p.unidade || '-');
    }

    function renderGridPage() {
        aplicarOrdenacao();
        var $body = $('#gridBody').empty();
        var total = filteredRows.length;
        if (!total) {
            $('#gridVazio').html(
                '<span class="nb-empty-state-icon" aria-hidden="true">ÔîÇ</span>' +
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
                ? '<span class="ux-pend-count" title="' + esc(pend.map(function (k) {
                    return (PEND_COPY[k] || {}).titulo || k;
                }).join('; ')) + '">' +
                    pend.length + (pend.length === 1 ? ' pend├¬ncia' : ' pend├¬ncias') + '</span>'
                : '';
            var selo = p.cadastroAtivo && p.status !== 'Regular'
                ? '<span class="ux-selo-ativo" title="Pedido ativo">A</span>'
                : '';
            $body.append(
                '<tr' + (p.arquivado ? ' style="opacity:.65"' : '') + '>' +
                    '<td style="text-align:center;white-space:nowrap">' +
                        '<button type="button" class="nb-grid-icon-btn nb-grid-icon-btn--edit btn-ver" data-id="' + p.id + '"' +
                        ' title="Visualizar pedido ' + esc(p.documento) + '"' +
                        ' aria-label="Visualizar pedido ' + esc(p.documento) + '">' +
                            '<span class="nb-icon nb-icon--edit" aria-hidden="true"></span></button></td>' +
                    '<td style="text-align:left">' +
                        '<button type="button" class="ux-doc-link btn-ver" data-id="' + p.id + '">' +
                            esc(p.documento || '-') + '</button>' + selo + pendHtml + '</td>' +
                    '<td style="text-align:left">' + esc(nomeFornecedor(p.fornecedorId)) + '</td>' +
                    '<td style="text-align:left">' + celulaUnidade(p) + '</td>' +
                    '<td style="text-align:left">' + celulaSubs(p) + '</td>' +
                    '<td style="text-align:left">' + esc(nomeParaEmailCsn(p.gestor)) + '</td>' +
                    '<td style="text-align:center">' + esc(p.dataInclusao || '-') + '</td>' +
                    '<td style="text-align:center">' + esc(p.dataInicio || '-') + '</td>' +
                    '<td style="text-align:center">' + badgeStatus(p) + '</td>' +
                '</tr>'
            );
        });
        var txt = total + (total === 1 ? ' pedido' : ' pedidos');
        $('#liveResultados').text(txt + ' na listagem. P├ígina ' + currentPage + ' de ' + totalPages() + '.');
        renderPager();
        atualizarBotaoExportar();
    }

    function passaFiltroBase(p, f) {
        if (f.cliente && String(p.clienteId) !== String(f.cliente)) return false;
        if (f.documento && String(p.documento).toLowerCase().indexOf(f.documento) === -1) return false;
        if (f.unidade && unidadesOriginais(p).indexOf(f.unidade) === -1) return false;
        if (f.fornecedor && String(p.fornecedorId) !== String(f.fornecedor)) return false;
        if (!f.arquivados && p.arquivado) return false;
        return true;
    }

    async function filtrar() {
        var f = lerFiltros();
        consultaAtiva = true;
        filteredRows = await nbMock.list('pedidos', function (p) {
            if (!passaFiltroBase(p, f)) return false;
            if (f.status) {
                if (f.status === 'Pendencia Contratual') {
                    return p.status === 'Pendencia Contratual' || (p.classificacao === 'Externo' && !p.arquivado);
                }
                if (p.classificacao === 'Externo' && !p.arquivado) return false;
                return p.status === f.status;
            }
            return true;
        });
        currentPage = 1;
        renderGridPage();
        await atualizarResumoStatus();
        syncStatusChips(f.status);
    }

    function limpar() {
        if (!perfilRestritoEmpresa()) $('#fltCliente').val('').trigger('change');
        else $('#fltCliente').val(String(CLIENTE_LOGADO_ID)).trigger('change');
        $('#fltDocumento').val('');
        $('#fltUnidade').val('').trigger('change');
        $('#fltFornecedor').val('').trigger('change');
        $('#fltStatus').val('').trigger('change');
        $('#fltArquivados').prop('checked', false);
    }

    function syncStatusChips(activeStatus) {
        $('#statusSummary .ux-chip-status').removeClass('is-active').attr('aria-pressed', 'false');
        var val = activeStatus || '';
        $('#statusSummary .ux-chip-status[data-status="' + val + '"]').addClass('is-active').attr('aria-pressed', 'true');
    }

    async function atualizarResumoStatus() {
        if (!consultaAtiva) {
            $('#statusSummary').empty().attr('hidden', true);
            return;
        }
        var f = lerFiltros();
        var base = await nbMock.list('pedidos', function (p) { return passaFiltroBase(p, f); });
        var counts = { '': base.length, 'Pendencia Cadastral': 0, 'Pendencia Contratual': 0, 'Regular': 0 };
        base.forEach(function (p) {
            if (p.classificacao === 'Externo' && !p.arquivado) counts['Pendencia Contratual']++;
            else if (counts[p.status] != null) counts[p.status]++;
        });
        var ordem = [
            { key: '', label: 'Todos' },
            { key: 'Pendencia Contratual', label: 'Pend. Contratual' },
            { key: 'Pendencia Cadastral', label: 'Pend. Cadastral' },
            { key: 'Regular', label: 'Regular' }
        ];
        var html = ordem.map(function (o) {
            return '<button type="button" class="ux-chip-status" data-status="' + esc(o.key) + '" aria-pressed="false">' +
                '<span class="ux-chip-dot" aria-hidden="true"></span><span>' + esc(o.label) + '</span>' +
                '<span class="ux-chip-count">' + counts[o.key] + '</span></button>';
        }).join('');
        $('#statusSummary').html(html).removeAttr('hidden');
        syncStatusChips(f.status);
    }

    function abrirModalUnidades(p) {
        lastFocusEl = document.activeElement;
        var uns = unidadesOriginais(p);
        var items = uns.map(function (u) {
            return '<li><span>' + esc(u) + '</span>' +
                (COD_SAP[u] ? '<span class="nb-badge nb-badge--muted">' + esc(COD_SAP[u]) + '</span>' : '') + '</li>';
        }).join('');
        $('#unidadesTitulo').text('Unidades ÔÇö documento ' + (p.documento || ''));
        $('#unidadesBody').html(
            '<p style="margin:0 0 .75rem;font-size:.875rem;color:#4a4a4a">' +
                uns.length + (uns.length === 1 ? ' unidade vinculada' : ' unidades vinculadas') +
                ' a este documento.</p><ul class="ux-unidades-lista">' + items + '</ul>'
        );
        openModal('divUnidades');
    }
    function abrirModalSubs(p) {
        lastFocusEl = document.activeElement;
        var list = p.subcontratadas || [];
        var items = list.map(function (s) {
            return '<li><span>' + esc(s.nome) + '</span><span class="nb-badge nb-badge--muted">' + esc(s.cnpj) + '</span></li>';
        }).join('');
        $('#subsTitulo').text('Subcontratadas ÔÇö ' + (p.documento || ''));
        $('#subsBody').html('<ul class="ux-subs-lista">' + items + '</ul>');
        openModal('divSubs');
    }

    function aplicarPerfil(novoPerfil) {
        perfil = novoPerfil;
        $('#perfilSwitch button').removeClass('active').attr('aria-selected', 'false')
            .filter('[data-perfil="' + perfil + '"]').addClass('active').attr('aria-selected', 'true');

        if (perfilRestritoEmpresa()) {
            $('#fltCliente').val(String(CLIENTE_LOGADO_ID)).trigger('change');
            $('#fltCliente').prop('disabled', true).trigger('change.select2');
            $('#campoCliente').addClass('is-locked');
            if (perfil === 'cliente') {
                $('#perfilHint').text('Vis├úo Cliente (Grupo CSN) ÔÇö classifica Interno/Externo. Sem bypass e sem arquivar.');
            } else {
                $('#perfilHint').text('Vis├úo Exce├º├úo (CSN) ÔÇö pode ignorar unidade/sub neste lote e arquivar Externo. N├úo classifica Interno/Externo.');
            }
            limpar();
            filtrar();
            atualizarBotaoFiltrar();
        } else {
            $('#fltCliente').prop('disabled', false).trigger('change.select2');
            $('#campoCliente').removeClass('is-locked');
            if ($('#fltCliente').val() === String(CLIENTE_LOGADO_ID)) {
                $('#fltCliente').val('').trigger('change');
            }
            $('#perfilHint').text('Vis├úo Demarco ÔÇö todos os clientes. N├úo classifica nem arquiva; usa os filtros e Filtrar.');
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
        $('#frmFiltros select.nb-select').each(function () {
            var $s = $(this);
            if ($s.hasClass('select2-hidden-accessible')) $s.next('.select2-container').css('width', '100%');
        });

        $('#frmFiltros').on('submit', function (e) {
            e.preventDefault();
            if (!temFiltroSelecionado()) return;
            filtrar();
        });
        $('#frmFiltros').on('input change', 'input, select', atualizarBotaoFiltrar);
        $('#fltCliente, #fltUnidade, #fltFornecedor, #fltStatus').on('change select2:select select2:clear', atualizarBotaoFiltrar);
        $('#fltArquivados').on('change', atualizarBotaoFiltrar);
        $('#btnLimpar').on('click', function () {
            limpar();
            if (perfilRestritoEmpresa()) filtrar();
            else limparResultados();
            atualizarBotaoFiltrar();
            nbMock.toast('msgSucesso', 'Filtros limpos.');
        });
        $('#statusSummary').on('click', '.ux-chip-status', function () {
            $('#fltStatus').val($(this).attr('data-status')).trigger('change');
            filtrar();
            atualizarBotaoFiltrar();
        });
        $('#btnExportar').on('click', function () {
            var n = filteredRows.length;
            if (!n) {
                nbMock.toast('msgAlerta', 'N├úo h├í pedidos na listagem para exportar.');
                return;
            }
            nbMock.simulate(function () {
                nbMock.toast('msgSucesso', 'Exporta├º├úo de ' + n + ' pedido(s) conclu├¡da (prot├│tipo).');
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
        $('#gridBody').on('click', '.btn-unidades', function () {
            var id = $(this).data('id');
            var p = filteredRows.filter(function (r) { return r.id === id; })[0] || nbMock.getSync('pedidos', id);
            if (p) abrirModalUnidades(p);
        });
        $('#gridBody').on('click', '.btn-subs', function () {
            var id = $(this).data('id');
            var p = filteredRows.filter(function (r) { return r.id === id; })[0] || nbMock.getSync('pedidos', id);
            if (p) abrirModalSubs(p);
        });
        $('#detBody').on('click', '#btnClassificar', function () {
            solicitarClassificar($(this).data('id'));
        });
        $('#detBody').on('click', '.ux-chip-card', function () {
            var k = $(this).data('chip');
            chipDetalheAberto = chipDetalheAberto === k ? null : k;
            var id = parseInt($('#detTitulo').text().replace(/\D/g, ''), 10);
            var p = filteredRows.filter(function (r) { return String(r.documento) === String(id) || r.documento.indexOf(String(id)) >= 0; })[0];
            /* t├¡tulo ├® "Pedido 45000..." ÔÇö recupera pelo t├¡tulo */
            var doc = $('#detTitulo').text().replace(/^Pedido\s+/, '');
            p = nbMock.listSync('pedidos').filter(function (x) { return x.documento === doc; })[0];
            if (p) renderDetalheFromPedido(p);
        });
        $('#detBody').on('click', '#btnArquivar', function () {
            pendingArquivarId = $(this).data('id');
            $('#arquivarJust').val('');
            openModal('divArquivar');
        });
        $('#detBody').on('click', '.btn-bypass', function () {
            var doc = $('#detTitulo').text().replace(/^Pedido\s+/, '');
            var p = nbMock.listSync('pedidos').filter(function (x) { return x.documento === doc; })[0];
            if (!p) return;
            var tipo = $(this).attr('data-tipo');
            var key = $(this).attr('data-key');
            abrirBypass(tipo, key, p.id);
        });
        $('#detBody').on('change', 'input[name="classif"]', function () {
            var val = $(this).val();
            $('#detBody .det-choice-opt').removeClass('is-selected');
            $(this).closest('.det-choice-opt').addClass('is-selected');
            $('#btnClassificar').prop('disabled', false).attr('aria-disabled', 'false').removeClass('is-disabled');
            $('#classifHint').text(val === 'Interno' ? 'Selecionado: Interno' : 'Selecionado: Externo');
        });
        $('#btnGlossarioStatus').on('click', function () { openModal('divGlossarioStatus'); });
        $('#glossarioFechar, #glossarioFechar2').on('click', function () { closeModal('divGlossarioStatus'); });
        $('#unidadesFechar, #unidadesFechar2').on('click', function () { closeModal('divUnidades'); });
        $('#subsFechar, #subsFechar2').on('click', function () { closeModal('divSubs'); });
        $('#bypassFechar, #bypassCancelar').on('click', function () { closeModal('divBypass'); pendingBypass = null; });
        $('#bypassOk').on('click', confirmarBypass);
        $('#arquivarFechar, #arquivarCancelar').on('click', function () { closeModal('divArquivar'); pendingArquivarId = null; });
        $('#arquivarOk').on('click', confirmarArquivar);
        $('#detFechar, #detFechar2').on('click', fecharDetalhe);
        $('#confirmFechar, #confirmCancelar').on('click', fecharConfirm);
        $('#confirmOk').on('click', function () {
            if (!pendingClassif) return;
            executarClassificacao(pendingClassif.id, pendingClassif.val);
        });

        $(document).on('keydown', function (e) {
            if (e.key !== 'Escape') return;
            if ($('#divConfirmClassif').is(':visible')) { fecharConfirm(); e.preventDefault(); }
            else if ($('#divBypass').is(':visible')) { closeModal('divBypass'); e.preventDefault(); }
            else if ($('#divArquivar').is(':visible')) { closeModal('divArquivar'); e.preventDefault(); }
            else if ($('#divUnidades').is(':visible')) { closeModal('divUnidades'); e.preventDefault(); }
            else if ($('#divSubs').is(':visible')) { closeModal('divSubs'); e.preventDefault(); }
            else if ($('#divGlossarioStatus').is(':visible')) { closeModal('divGlossarioStatus'); e.preventDefault(); }
            else if ($('#divDetalhe').is(':visible')) { fecharDetalhe(); e.preventDefault(); }
        });

        aplicarPerfil('demarco');
    });
})();

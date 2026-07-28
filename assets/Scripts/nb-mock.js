/*
 * nb-mock.js — Motor de prototipagem do design system NovoBancodoc.
 *
 * Permite criar protótipos 100% estáticos (HTML + JS + CSS puro, sem servidor)
 * com a mesma aparência e comportamento do sistema real:
 *
 *   1. "Banco de dados" persistido em localStorage (tabelas = arrays de objetos).
 *   2. Latência de rede SIMULADA em toda operação (list/get/insert/update/remove),
 *      exibindo o overlay de loading OFICIAL do sistema (#divContainerWait /
 *      #divWait + carregando_novo.webp, estilizado por utils.css). Assim o
 *      protótipo "pisca" o loading como se estivesse chamando o backend.
 *   3. CRUD assíncrono baseado em Promises (use async/await no app.js).
 *
 * Dependências: jQuery e utils.css (para o overlay). utils.js é opcional
 * (usado por nbMock.toast para reaproveitar MensagemSpan).
 *
 * IMPORTANTE — este arquivo é EXCLUSIVO de protótipos. Nunca vai para o
 * projeto ASP.NET real (lá o backend é de verdade).
 *
 * Uso típico no app.js do protótipo:
 *
 *   nbMock.seed('fornecedores', [ {id:1, nome:'ACME', ativo:true}, ... ]);
 *
 *   async function carregar() {
 *     const linhas = await nbMock.list('fornecedores');   // mostra loading + latência
 *     renderGrid(linhas);
 *   }
 *   carregar();
 */
(function (global) {
    'use strict';

    var nbMock = {};
    global.nbMock = nbMock;

    // ─────────────────────────────────────────────────────────────────
    // Configuração (sobrescreva com nbMock.config({...}) antes de usar)
    // ─────────────────────────────────────────────────────────────────
    var CONFIG = {
        prefix: 'nbproto:',                                   // namespace no localStorage
        minDelay: 350,                                        // latência simulada mínima (ms)
        maxDelay: 900,                                        // latência simulada máxima (ms)
        loadingImg: 'assets/images/animado/carregando_novo.webp' // caminho relativo ao index.html
    };
    nbMock.config = function (o) {
        for (var k in (o || {})) { if (o.hasOwnProperty(k)) CONFIG[k] = o[k]; }
        return nbMock;
    };

    function randDelay() {
        return CONFIG.minDelay + Math.random() * (CONFIG.maxDelay - CONFIG.minDelay);
    }

    // Promise que resolve após `ms` (ou latência aleatória se ms == null)
    nbMock.wait = function (ms) {
        return new Promise(function (res) { setTimeout(res, ms == null ? randDelay() : ms); });
    };

    // ─────────────────────────────────────────────────────────────────
    // Overlay de loading — mesma estrutura/estilo do design system real.
    // Reaproveita as regras #divContainerWait / #divWait de utils.css, então
    // visualmente é IDÊNTICO ao loading do sistema (Carregar_novo).
    // ─────────────────────────────────────────────────────────────────
    nbMock.showLoading = function () {
        if (document.getElementById('divContainerWait')) return;
        var cont = document.createElement('div'); cont.id = 'divContainerWait';
        var dim = document.createElement('div'); dim.id = 'divWait';
        document.body.appendChild(cont);
        cont.appendChild(dim);
        var box = document.createElement('div');
        box.style.cssText = 'position:absolute;z-index:99999999;margin-top:-5%;' +
            'background:rgba(247,247,247,0.8);padding:14px;border-radius:50px;' +
            'box-shadow:0 0 30px 10px rgba(247,247,247,0.9),0 0 100px 50px rgba(247,247,247,0.9),0 20px 25px rgba(0,0,0,0.25);';
        box.innerHTML = '<img src="' + CONFIG.loadingImg + '" alt="Carregando..." ' +
            'style="border-width:0px;max-width:90px;display:block" ' +
            'onerror="this.replaceWith(Object.assign(document.createElement(\'span\'),{textContent:\'Aguarde...\',style:\'color:#cc0022;font-weight:bold\'}))">';
        dim.after(box);
    };
    nbMock.hideLoading = function () {
        var c = document.getElementById('divContainerWait');
        if (c) c.remove();
    };

    // Executa `fn` (sync ou que devolve valor) embrulhado em loading + latência.
    // Devolve Promise com o resultado de fn.
    nbMock.simulate = function (fn, ms) {
        nbMock.showLoading();
        return nbMock.wait(ms).then(function () {
            try { return (typeof fn === 'function') ? fn() : fn; }
            finally { nbMock.hideLoading(); }
        });
    };

    // ─────────────────────────────────────────────────────────────────
    // "Banco" em localStorage — cada tabela é um array de objetos com `id`.
    // ─────────────────────────────────────────────────────────────────
    function keyOf(table) { return CONFIG.prefix + table; }

    function readAll(table) {
        try { return JSON.parse(localStorage.getItem(keyOf(table))) || []; }
        catch (e) { return []; }
    }
    function writeAll(table, rows) {
        localStorage.setItem(keyOf(table), JSON.stringify(rows || []));
    }
    function nextId(rows) {
        return rows.reduce(function (m, r) { return Math.max(m, +r.id || 0); }, 0) + 1;
    }

    // Semeia a tabela SÓ se ainda não existir (preserva edições entre reloads).
    nbMock.seed = function (table, rows) {
        if (localStorage.getItem(keyOf(table)) == null) writeAll(table, rows || []);
        return nbMock;
    };
    // Força (re)escrita da tabela. Sem args limpa TODAS as tabelas do protótipo.
    nbMock.reset = function (table, rows) {
        if (table == null) {
            Object.keys(localStorage)
                .filter(function (k) { return k.indexOf(CONFIG.prefix) === 0; })
                .forEach(function (k) { localStorage.removeItem(k); });
        } else {
            writeAll(table, rows || []);
        }
        return nbMock;
    };

    // ─────────────────────────────────────────────────────────────────
    // CRUD ASSÍNCRONO (com loading + latência) — simula chamada ao backend.
    // Todos devolvem Promise → use `await` no app.js.
    // ─────────────────────────────────────────────────────────────────
    nbMock.list = function (table, filterFn) {
        return nbMock.simulate(function () {
            var rows = readAll(table);
            return (typeof filterFn === 'function') ? rows.filter(filterFn) : rows.slice();
        });
    };
    nbMock.get = function (table, id) {
        return nbMock.simulate(function () {
            return readAll(table).filter(function (r) { return String(r.id) === String(id); })[0] || null;
        });
    };
    nbMock.insert = function (table, obj) {
        return nbMock.simulate(function () {
            var rows = readAll(table);
            var novo = {}; for (var k in obj) { if (obj.hasOwnProperty(k)) novo[k] = obj[k]; }
            novo.id = nextId(rows);
            rows.push(novo);
            writeAll(table, rows);
            return novo;
        });
    };
    nbMock.update = function (table, id, patch) {
        return nbMock.simulate(function () {
            var found = null;
            var rows = readAll(table).map(function (r) {
                if (String(r.id) === String(id)) {
                    for (var k in patch) { if (patch.hasOwnProperty(k)) r[k] = patch[k]; }
                    found = r;
                }
                return r;
            });
            writeAll(table, rows);
            return found;
        });
    };
    nbMock.remove = function (table, id) {
        return nbMock.simulate(function () {
            var rows = readAll(table).filter(function (r) { return String(r.id) !== String(id); });
            writeAll(table, rows);
            return true;
        });
    };

    // ─────────────────────────────────────────────────────────────────
    // Leitura SÍNCRONA (sem loading) — para popular <select> no carregamento
    // inicial, lookups rápidos, etc.
    // ─────────────────────────────────────────────────────────────────
    nbMock.listSync = function (table, filterFn) {
        var rows = readAll(table);
        return (typeof filterFn === 'function') ? rows.filter(filterFn) : rows;
    };
    nbMock.getSync = function (table, id) {
        return readAll(table).filter(function (r) { return String(r.id) === String(id); })[0] || null;
    };

    // ─────────────────────────────────────────────────────────────────
    // Mensagens — reaproveita MensagemSpan/utils.js se presente (msgSucesso /
    // msgAlerta / msgErro), senão cai num alert simples.
    // ─────────────────────────────────────────────────────────────────
    nbMock.toast = function (tipo, msg) {
        if (typeof MensagemSpan === 'function') MensagemSpan(tipo, msg);
        else window.alert(msg);
    };

})(window);

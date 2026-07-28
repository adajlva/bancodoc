(function ($) {
    $.fn.ContaCaracteres =
        function () {
            $("textarea[MaxCaracteres]").bind("focus input keyup paste", function () {
                const limite = $(this).attr("MaxCaracteres");
                const nomeLabel = "lblTam11" + $(this).attr("id");
                const htmlLabel = "<br><span id='" + nomeLabel + "' class='item'>" + limite + " caracteres restantes.</span>";

                if (!$("span[id='" + nomeLabel + "']").length)
                    $(this).after(htmlLabel);
                const label = $("span[id='" + nomeLabel + "']");

                $(this).val($(this).val().replace("  ", " ").trimStart());
                const caracteresDigitados = $(this).val().length;
                const caracteresRestantes = limite - caracteresDigitados;
                if (caracteresRestantes < 0) {
                    $(this).val($(this).val().substring(0, limite));
                }

                label.text(caracteresRestantes.toString() + " caracteres restantes");
            });
        }
}(jQuery));


/* Mensagens de "Sucesso", "Alerta" ou "Erro", no topo da página */
/* Importar também o CSS utils */
/* Depende da importação do JQuery e jquery.ui.custom */
const arrayInterval = [];
function RemoverAlerta(index) {
    $("#divAlerta").stop(true).slideUp(300, function () {
        $(this).remove();
    });
    clearInterval(arrayInterval[index]);
}
function MensagemSpan(tipoMsg, Mensagem) {
    let elemento;
    if ($("#conteudo").length)
        elemento = $("#conteudo").contents().find("body");
    else
        elemento = $("form");
    if ($("#divAlerta").length)
        RemoverAlerta();
    const btn = "<button type='button' onclick='RemoverAlerta()' class='close' id='btnCloseAlert'><span aria-hidden='true'>×</span></button>";
    elemento.prepend("<div id='divAlerta' class='" + tipoMsg + "'><strong><div id='divAlertaTexto'>" + Mensagem + "</div></strong>" + btn + "</div>");
    $("#divAlerta").slideDown(400, function () { if (tipoMsg == "msgSucesso") { const i = arrayInterval.length; arrayInterval[i] = setInterval(function () { RemoverAlerta(i); }, 3000); } })
}



const Dicionario = [];

function BuscarTraducao(siglaTermo) {
    if (Dicionario.filter(function (x) { return x.sigla == siglaTermo })[0])
        return Dicionario.filter(function (x) { return x.sigla == siglaTermo })[0].valor;
    else
        return '[' + siglaTermo + '] não traduzido';
}

function AdicionarTermo(termo) {
    if (Dicionario.filter(function (x) { return x.sigla == termo.sigla }).length == 0)
        Dicionario.push({ sigla: termo.Sigla, valor: termo.Valor });
}

function CarregarDicionario(listaTermos) {
    $(listaTermos).each(function (index, item) {
        AdicionarTermo(item);
    });
}

function Carregar() {
    const divContainer = document.createElement("div");
    divContainer.id = "divContainerWait";
    const div = document.createElement("div");
    div.id = "divWait";
    $("body").append(divContainer);
    divContainer.append(div);
    $("#divWait").after("<div style='position:absolute;z-index:99999999;margin-top:-5%;background-color:white;padding:10px;border-radius:3px;box-shadow: 5px 5px 5px #888;'><strong><span style='color: #cc0022; font-size: medium;'>Aguarde...</span></strong>&nbsp;<img id='Image0' src='/images/loading.gif' style='border-width:0px;'></div>");
}

function RemoveCarregar() {
    if ($("#divContainerWait").length) {
        $("#divContainerWait").remove();
    }
}

let myTimeout;

function CarregarComCookie(nomeCookie, removerCookieCasoExistaAntes = true) {
    if (removerCookieCasoExistaAntes)
        document.cookie = nomeCookie + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';

    if (!$("#divContainerWait").length)
        Carregar();

    if (document.cookie.indexOf(nomeCookie) > -1) {
        document.cookie = nomeCookie + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        RemoveCarregar();
        clearTimeout(myTimeout);
        return;
    }

    myTimeout = setTimeout(function () {
        CarregarComCookie(nomeCookie, false);
    }, 1000);
}

function iniciarTour(idTour, idUsuario) {
    $.ajax({
        type: "Post",
        url: "../Outros/Tour.aspx/RecuperarTour",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: "{id:" + idTour + "}",
        success: function (data) {
            carregarTour(data.d, idUsuario, idTour);
            
        },
        error: function (err, x, erro) {
            MensagemSpan('msgErro', 'Desculpe! Ocorreu um erro<br>' + err.responseText);
        }
    });
}

function carregarTour(passos, idUsuario, idTour) {
    introJs().setOptions({
        nextLabel: 'Próximo',
        prevLabel: 'Anterior',
        doneLabel: 'Finalizar',
        steps: passos, tooltipClass: 'customTooltip', showProgress: true
    }).oncomplete(function () {
        finalizarTour(idTour, idUsuario);
    }).start();
    registrarInicioTour(idTour, idUsuario);
}

function finalizarTour(idTour, idUsuario) {
    $.ajax({
        type: "Post",
        url: "../Outros/Tour.aspx/FinalizarTour",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: "{idTour:" + idTour + ", idUsuario:" + idUsuario + "}",
        error: function (err, x, erro) {
            MensagemSpan('msgErro', 'Desculpe! Ocorreu um erro<br>' + err.responseText);
        }
    });
}

function registrarInicioTour(idTour, idUsuario) {
    $.ajax({
        type: "Post",
        url: "../Outros/Tour.aspx/IniciarTour",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: "{idTour:" + idTour + ", idUsuario:" + idUsuario + "}",
        error: function (err, x, erro) {
            MensagemSpan('msgErro', 'Desculpe! Ocorreu um erro<br>' + err.responseText);
        }
    });
}



// ---------------------------------------------------------------------------
// Carregar_novo — indicador de loading do design system NovoBancodoc.
// Chamado pela Interno.Master via PageRequestManager em cada postback parcial
// e por botões com classe .nb-load-on-click em full postback.
// ---------------------------------------------------------------------------
function Carregar_novo() {
    if (!$("#divContainerWait").length) {
        const divContainer = document.createElement("div");
        divContainer.id = "divContainerWait";
        const div = document.createElement("div");
        div.id = "divWait";
        $("body").append(divContainer);
        divContainer.append(div);
        $("#divWait").after("<div style='position:absolute; z-index:99999999; margin-top:-5%; background:rgba(247,247,247,0.8); padding:14px; border-radius:50px; box-shadow: 0 0 30px 10px rgba(247,247,247,0.9), 0 0 100px 50px rgba(247,247,247,0.9), 0 20px 25px rgba(0,0,0,0.25);'><img id='Image0' src='/images/animado/carregando_novo.webp' style='border-width:0px;'></div>");
    }
}

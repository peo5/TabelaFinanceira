function create(tag, parent=null, inner='') {
    let el = document.createElement(tag);
    if(inner!='')
        el.innerHTML = inner;
    if(parent)
        parent.appendChild(el);
    return el;
}

// funcoes <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

/* 

n > numero de prestações, 
i > taxa de juros, 
k > índice atual, 
dj > saldo devedor anterior, 
d0 > saldo devedor inicial

function modelHandler(n, i, k, dj, d0) {
    let pk = 0; // prestação
    let ak = 0; // amortização
    let jk = 0; // juros
    let dk = 0; // saldo devedor
    return {p: pk, a:ak, j:jk, d:dk};
}

*/

function normal(n, i, k, dj, d0) {
    let ak = d0/n; // amortização
    let jk = i * dj; // juros
    let dk = d0 * (n-k)/n; // saldo devedor
    let pk = ak + jk; // prestação
    return {p: pk, a:ak, j:jk, d:dk};
}

function sac(n, i, k, dj, d0) {
    let ak = d0/n; // amortização
    let jk = i * dj; // juros
    let dk = d0 * (n-k)/n; // saldo devedor
    let pk = ak + jk; // prestação
    return {p: pk, a:ak, j:jk, d:dk};
}

function price(n, i, k, dj, d0) {
    let jk = i * dj; // juros
    let dk = d0 * ( (1 - Math.pow(1+i, k-n)) / (1 - Math.pow(1+i, -n)) ); // saldo devedor
    let pk = d0 * ( i/( 1 - Math.pow( 1+i , -n ))); // prestação
    let ak = pk - jk; // amortização
    return {p: pk, a:ak, j:jk, d:dk};
}

// tabela <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

let formatObj = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
let ctitles = ['Período', 'Prestação', 'Amortização', 'Juros', 'Saldo Devedor'];

function realFormat(value) {
    return formatObj.format(value);
}

function criarPlanilha(title, n, i, d0, rfunction, parent=document.body) {

    let planilha = create('table');
    planilha.classList.add('planilha');

    if(title) 
        create('th', create('tr', planilha), title).colSpan = ctitles.length;

    let ctitlesTr = create('tr', planilha);
    for(let ctitle of ctitles)
        create('th', ctitlesTr, ctitle);

    let dj = d0;
    for(let k=0; k<=n; k++) {
        
        let tr=create('tr', planilha);
        let values = rfunction(n, i, k, dj, d0);
        
        create('td', tr, k + '');

        if(k==0) {
            for(let a=0; a<3; a++)
                create('td', tr, '-');
        }
        else {
            create('td', tr, realFormat(values.p));
            create('td', tr, realFormat(values.a));
            create('td', tr, realFormat(values.j));
        }

        if(k==n)
            create('td', tr, '-');
        else
            create('td', tr, realFormat(values.d));

        dj = values.d;
    }

    parent.appendChild(planilha);
}

let tableContainerEl = document.getElementById('table_container');

let periodoIn = document.getElementById('periodo');
let taxaIn = document.getElementById('taxa');
let dividaIn = document.getElementById('divida');

let normalBtn = document.getElementById('normal');
let sacBtn = document.getElementById('sac');
let priceBtn = document.getElementById('price');

let tableInfo = {
    title: 'SAC',
    periodo: 10,
    taxa: 5/100,
    divida: 50000,
    funcao: sac,
    funcaoBtn: sacBtn
}

function updateTable() {
    tableContainerEl.innerHTML = '';
    criarPlanilha(
        'Planilha Financeira - ' + tableInfo.title, 
        tableInfo.periodo, 
        tableInfo.taxa, 
        tableInfo.divida, 
        tableInfo.funcao, 
        tableContainerEl);
}

// inputs <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

function changePeriodo() {
    tableInfo.periodo = periodoIn.value;
}

function changeTaxa() {
    tableInfo.taxa = taxaIn.value/100;
}

function changeDivida() {
    tableInfo.divida = dividaIn.value;
}

periodoIn.addEventListener('input', () => { changePeriodo(); updateTable(); });
taxaIn.addEventListener('input', () => { changeTaxa(); updateTable(); });
dividaIn.addEventListener('input', () => { changeDivida(); updateTable(); });

// select function <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

function selectFunction(el) {
    tableInfo.funcaoBtn.classList.remove('selected');
    tableInfo.funcaoBtn = el;
    el.classList.add('selected');
}

normalBtn.addEventListener('click', (e) => {
    tableInfo.funcao = normal;
    tableInfo.title = 'Normal';
    selectFunction(e.target);
    updateTable();
});

sacBtn.addEventListener('click', (e) => {
    tableInfo.funcao = sac;
    tableInfo.title = 'SAC';
    selectFunction(e.target);
    updateTable();
});

priceBtn.addEventListener('click', (e) => {
    tableInfo.funcao = price;
    tableInfo.title = 'Price';
    selectFunction(e.target);
    updateTable();
});

// init <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

periodoIn.value = tableInfo.periodo;
taxaIn.value = tableInfo.taxa * 100;
dividaIn.value = tableInfo.divida;

updateTable();
/*
 * Cria um objeto ptable e o inicializa (caso a tabela exista)
 */
var ptable = function(table_id)
{
    // inicializa a variável tabela
    this.tabela=document.getElementById(table_id);

    // configura a tabela e os eventos caso a tabela exista E tenha cabeçalho E tenha corpo
    if (this.tabela && this.tabela.tHead && this.tabela.tBodies.length) {
	this.container=this.tabela.parentElement;
	this.fixado=false;

	// configura o esquema de paginação horizontal (para mobiles, apenas se a tabela tiver mais de 5 colunas)
	if (this.tabela.tHead.rows[0].cells.length > 5) {
	    this.h_pagina=0;
	    // cabeçalho
	    for (var x=5; x<this.tabela.tHead.rows[0].cells.length; x++) {
		this.tabela.tHead.rows[0].cells[x].classList.add('ptable-hide');
	    }

	    // corpo
	    for (var x=0; x<this.tabela.tBodies[0].rows.length; x++) {
		for (var y=5; y<this.tabela.tBodies[0].rows[x].cells.length; y++) {
		    this.tabela.tBodies[0].rows[x].cells[y].classList.add('ptable-hide');
		}
	    }
	} else this.h_pagina=null;
	
	// configura o tamanho das colunas de titulo
	for (var x=0; x<this.tabela.tBodies[0].rows[0].cells.length; x++) {
	    this.tabela.tHead.rows[0].cells[x].style.width=this.tabela.tBodies[0].rows[0].cells[x].offsetWidth+'px';
	    // fixa o tamanho até mesmo quando a célula é menor que o cabeçalho
	    this.tabela.tBodies[0].rows[0].cells[x].style.width=this.tabela.tBodies[0].rows[0].cells[x].offsetWidth+'px';
	}

	// adiciona o estilo relativo para a tabela
	this.tabela.style="position:relative";
	this.tabela.tHead.style.top='1px';

	// adiciona o evento do cursor
	var _ptable=this;
	this.container.addEventListener('scroll', function() {
	    /* Se o scroll rolar (para uma posição diferente do fixado) e a tabela ainda não foi fixado,
	       configura o posicionamento fixado. Se não, configura o valor padrão.
	    */
	    if (_ptable.container.scrollTop > _ptable.tabela.tHead.offsetHeight && !_ptable.fixado) {
		_ptable.fixado=true;
		_ptable.tabela.tHead.style.position='fixed';
	    } else if (_ptable.container.scrollTop == 0 && _ptable.fixado) {
		_ptable.fixado=false;
		_ptable.tabela.tHead.style.position='';
	    }
	});


    }
}

// trabalha com a paginação interna horizontal
ptable.prototype.h_pagInterna = function(p)
{
    // só processa esse método se a tabela possúi paginação
    if (this.h_pagina !== null) {
	var _pagina=this.h_pagina+p;
	/*
	  só processa esse método se a página requisitada for maior ou igual a primeira página (0)
	  e a página existir
	*/
	if (_pagina >= 0 && _pagina < (this.tabela.tHead.rows[0].cells.length/5)) {
	    // processa o cabeçalho
	    for (var x=_pagina*5, j=this.h_pagina*5; x<_pagina*5+5; x++, j++) {
		if (this.tabela.tHead.rows[0].cells[x])
		    this.tabela.tHead.rows[0].cells[x].classList.remove('ptable-hide'); // exibe as colunas da nova página
		if (this.tabela.tHead.rows[0].cells[j])
		    this.tabela.tHead.rows[0].cells[j].classList.add('ptable-hide'); // esconde as colunas da página antiga
	    }

	    // processa o corpo
	    for (var x=0; x<this.tabela.tBodies[0].rows.length; x++) {
		for (var y=_pagina*5, z=this.h_pagina*5; y<_pagina*5+5; y++, z++) {
		    if (this.tabela.tBodies[0].rows[x].cells[y])
			this.tabela.tBodies[0].rows[x].cells[y].classList.remove('ptable-hide'); // exibe as colunas da nova página
		      if (this.tabela.tBodies[0].rows[x].cells[z])
			this.tabela.tBodies[0].rows[x].cells[z].classList.add('ptable-hide'); // esconde as colunas da página antiga
		}
	    }

	    this.h_pagina=_pagina;
	}
    }
}

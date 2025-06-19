const vm = new Vue({
    el: "#app",
    data: {

        // Estoque 
        produtos: [],
        produto: false,
        produtoEdicao: false,
        produtoCadastro: false,
        endpoint_produtos: 'http://localhost:8080'

    },

    filters: {
        numeroPreco(valor) {
            return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
        }
    },

    methods: {

        // Estoque
        carregarEstoque() {
            fetch(`${this.endpoint_produtos}/produtos`)
                .then(response => response.json())
                .then(data => this.produtos = data);
        },

        deletarProduto(id) {
            fetch(`${this.endpoint_produtos}/produtos/${id}`, {
                method: 'DELETE'
            })
                .then(response => {
                    if (response.ok) {
                        this.produto = false;
                    } else {
                        alert('Erro ao deletar o produto.');
                    }
                })
                .catch(error => {
                    console.error('Erro na requisição DELETE:', error);
                    alert('Erro de conexão com o servidor.');
                });
        },

        ativarAvisoDelecao(produto) {
            this.produto = produto;
        },

        fecharModal(event) {
            if (event.target === event.currentTarget) {
                this.produto = false;
                this.produtoEdicao = false;
                this.produtoCadastro = false;
            }
        },

        abrirModalEdicaoProduto(produtoEdicao) {
            this.produtoEdicao = produtoEdicao;
        },

        editarProduto() {
            fetch(`${this.endpoint_produtos}/produtos/${this.produtoEdicao.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nome: this.produtoEdicao.nome,
                    descricao: this.produtoEdicao.descricao,
                    preco: this.produtoEdicao.preco,
                    quantidade: this.produtoEdicao.quantidade
                })
            })
                .then(response => {
                    if (response.ok) {
                        this.produtoEdicao = false;
                    } else {
                        alert('Erro ao atualizar o produto.');
                    }
                })
                .catch(error => {
                    console.error('Erro na requisição PUT:', error);
                    alert('Erro de conexão com o servidor.');
                });
        },

        exportarRelatorioEstoque() {
            fetch(`${this.endpoint_produtos}/produtos/download/excel`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Erro ao baixar o arquivo');
                    }
                    return response.blob();
                })
                .then(blob => {
                    const url = window.URL.createObjectURL(blob);

                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'relatorio.xlsx';
                    document.body.appendChild(a);
                    a.click();
                    a.remove();

                    window.URL.revokeObjectURL(url);
                })
                .catch(error => {
                    console.error('Erro no download:', error);
                });
        },

        cadastrarProduto(){
            fetch(`${this.endpoint_produtos}/produtos`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nome: this.produtoCadastro.nome,
                    descricao: this.produtoCadastro.descricao,
                    preco: this.produtoCadastro.preco,
                    quantidade: this.produtoCadastro.quantidade
                })
            })
                .then(response => {
                    if (response.ok) {
                        this.produtoCadastro = false;
                    } else {
                        alert('Erro ao cadastrar o produto.');
                    }
                })
                .catch(error => {
                    console.error('Erro na requisição POST:', error);
                    alert('Erro de conexão com o servidor.');
                });
        },

        abrirModalCadastroProduto() {
            this.produtoCadastro = {
                nome: '',
                descricao: '',
                preco: 0,
                quantidade: 0
            };
        },

    },

    created() {
        // Estoque
        this.carregarEstoque();
    },

    watch: {
        // Estoque
        produtos() {
            this.carregarEstoque();
        }
    },

    computed: {
        totalValorProdutos(){
            let sum = 0;

            this.produtos.forEach(element => {
                sum += element.preco * element.quantidade;
            });

            return sum;
        },

        totalQuantiaEstoque(){
            let sum = 0;

            this.produtos.forEach(element => {
                sum += element.quantidade;
            });

            return sum;
        }
    }
});
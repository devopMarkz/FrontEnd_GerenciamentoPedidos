const vm = new Vue({
    el: "#app",
    data: {

        // Estoque 
        produtos: [],
        produto: false,
        produtoEdicao: false


    },

    filters: {
        numeroPreco(valor) {
            return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
        }
    },

    methods: {

        // Estoque
        carregarEstoque() {
            fetch("http://localhost:8080/produtos")
                .then(response => response.json())
                .then(data => this.produtos = data);
        },

        deletarProduto(id) {
            fetch(`http://localhost:8080/produtos/${id}`, {
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
            }
        },

        abrirModalEdicaoProduto(produtoEdicao) {
            this.produtoEdicao = produtoEdicao;
        },

        editarProduto() {
            fetch(`http://localhost:8080/produtos/${this.produtoEdicao.id}`, {
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
        }

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
    }
});
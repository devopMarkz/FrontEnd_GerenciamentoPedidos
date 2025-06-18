const vm = new Vue({
    el: "#app",
    data: {
        
        // Estoque 
        produtos: [],
        produto: false        


    },

    filters: {
        numeroPreco(valor){
            return valor.toLocaleString("pt-BR", {style: "currency", currency: "BRL"});
        }
    },

    methods: {

        // Estoque
        carregarEstoque(){
            fetch("http://localhost:8080/produtos")
            .then(response => response.json())
            .then(data => this.produtos = data);
        },

        deletarProduto(id){
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

        ativarAvisoDelecao(produto){
            this.produto = produto;
        },

        fecharModal(event){
            if(event.target === event.currentTarget){
                this.produto = false;
            }
        }

    },

    created(){
        // Estoque
        this.carregarEstoque();
    },
    watch: {
        // Estoque
        produtos(){
            this.carregarEstoque();
        }
    }
});
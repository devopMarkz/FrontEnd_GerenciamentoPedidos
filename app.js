const vm = new Vue({
    el: "#app",
    data: {

        // Estoque 
        produtos: [],
        produto: false,
        produtoEdicao: false,
        produtoCadastro: false,
        endpoint_produtos: 'http://localhost:8080',

        // CLIENTES
        endpoint_clientes: 'http://localhost:8081',
        clientes: [],
        cliente: false,
        clienteCadastro: false,
        clienteEdicao: false,
        novoCliente: {
            nome: '',
            cpf: ''
        },

        // PEDIDOS
        endpoint_pedidos: 'http://localhost:8082',
        clienteId: '',
        itens: [
            { produtoId: '', quantidade: 1 }
        ],
        clientes: [],
        produtos: []

    },

    filters: {
        numeroPreco(valor) {
            return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
        }
    },

    methods: {

        irParaPaginaInicial() {
            window.location.href = 'http://127.0.0.7:5500/index.html';
        },

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
                this.cliente = false;
                this.clienteCadastro = false;
                this.clienteEdicao = false;
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
                    a.download = 'relatorio_produtos.xlsx';
                    document.body.appendChild(a);
                    a.click();
                    a.remove();

                    window.URL.revokeObjectURL(url);
                })
                .catch(error => {
                    console.error('Erro no download:', error);
                });
        },

        cadastrarProduto() {
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

        // CLIENTES
        abrirModalCadastroCliente() {
            this.clienteCadastro = {
                nome: '',
                cpf: ''
            };
        },

        cadastrarCliente() {
            fetch(`${this.endpoint_clientes}/clientes`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nome: this.clienteCadastro.nome,
                    cpf: this.clienteCadastro.cpf
                })
            });

            this.clienteCadastro = false;
        },

        carregarClientes() {
            fetch(`${this.endpoint_clientes}/clientes`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then(response => response.json())
                .then(data => this.clientes = data);
        },

        deletarCliente(id) {
            fetch(`${this.endpoint_clientes}/clientes/${id}`, {
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

            this.cliente = false;
        },

        editarCliente() {
            fetch(`${this.endpoint_clientes}/clientes/${this.clienteEdicao.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nome: this.clienteEdicao.nome,
                    descricao: this.clienteEdicao.cpf
                })
            })
                .then(response => {
                    if (response.ok) {
                        this.clienteEdicao = false;
                    } else {
                        alert('Erro ao atualizar o cliente.');
                    }
                })
                .catch(error => {
                    console.error('Erro na requisição PUT:', error);
                    alert('Erro de conexão com o servidor.');
                });

            console.log("PUT");

        },

        ativarAvisoDelecaoCliente(cliente) {
            this.cliente = cliente;
        },

        abrirModalEdicaoCliente(cliente) {
            this.clienteEdicao = cliente;
        },

        exportarRelatorioClientes() {
            fetch(`${this.endpoint_clientes}/clientes/download/excel`)
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
                    a.download = 'relatorio_clientes.xlsx';
                    document.body.appendChild(a);
                    a.click();
                    a.remove();

                    window.URL.revokeObjectURL(url);
                })
                .catch(error => {
                    console.error('Erro no download:', error);
                });
        },

        // PEDIDOS
        adicionarItem() {
            this.itens.push({ produtoId: '', quantidade: 1 });
        },
        async carregarDados() {
            const resClientes = await fetch('http://localhost:8081/clientes');
            this.clientes = await resClientes.json();

            const resProdutos = await fetch('http://localhost:8080/produtos');
            this.produtos = await resProdutos.json();
        },
        async enviarPedido() {
            const pedido = {
                clienteId: this.clienteId,
                itens: this.itens.map(i => ({
                    produtoId: i.produtoId,
                    quantidade: i.quantidade
                }))
            };

            const response = await fetch(`${this.endpoint_pedidos}/pedidos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pedido)
            });

            if (response.ok) {
                alert('Pedido criado com sucesso!');
                // Resetar
                this.clienteId = '';
                this.itens = [{ produtoId: '', quantidade: 1 }];
            } else {
                alert('Erro ao criar pedido');
            }
        }

    },

    created() {
        // Estoque
        this.carregarEstoque();

        // CLIENTES
        this.carregarClientes();

        // PEDIDOS
        this.carregarDados();
    },

    watch: {
        // Estoque
        produtos() {
            this.carregarEstoque();
        },

        // CLIENTES
        clientes() {
            this.carregarClientes();
        }
        
    },

    computed: {
        totalValorProdutos() {
            let sum = 0;

            this.produtos.forEach(element => {
                sum += element.preco * element.quantidade;
            });

            return sum;
        },

        totalQuantiaEstoque() {
            let sum = 0;

            this.produtos.forEach(element => {
                sum += element.quantidade;
            });

            return sum;
        }

        // CLIENTES

    }
});
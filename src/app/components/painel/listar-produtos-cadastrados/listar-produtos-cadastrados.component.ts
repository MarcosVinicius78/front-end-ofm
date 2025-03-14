import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, Message, MessageService } from 'primeng/api';
import { Produto } from 'src/app/models/produtos';
import { ProdutoService } from 'src/app/service/painel/produto.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { isPlatformBrowser } from '@angular/common';
import { environment } from 'src/environments/environment';
import { MensagemService } from 'src/app/service/painel/mensagem.service';
import { ImagemServiceService } from 'src/app/service/painel/imagem-service.service';
import { ConfigSiteService } from 'src/app/service/painel/config-site.service';

@Component({
  selector: 'app-listar-produtos-cadastrados',
  templateUrl: './listar-produtos-cadastrados.component.html',
  styleUrls: ['./listar-produtos-cadastrados.component.scss'],
  providers: [MessageService]
})
export class ListarProdutosCadastradosComponent implements OnInit {

  page = 0;
  size = 10;
  selectAllCheckbox = false;

  items: MenuItem[] | undefined;

  totalPage!: number

  number!: number

  produtos: Produto[] = [];
  produto!: Produto;

  apiUrl = environment.apiUrl;

  // produto!: Produtos;
  selectedProducts!: Produto;

  visible: boolean = false;

  openMenuId: number | null = null;

  linkCurto!: boolean
  linkSemDominio!: boolean

  estruturaCompartilhamento: string = "";

  constructor(
    private produtoService: ProdutoService,
    private route: Router,
    private messageService: MessageService,
    private clipboard: Clipboard,
    private mensagemService: MensagemService,
    @Inject(PLATFORM_ID) private platformId: Object,
    public imagemService: ImagemServiceService,
    private configSiteService: ConfigSiteService
  ) { }

  ngOnInit(): void {
    this.listarProdutos();

    this.statusLinkSemDominio()

    this.statusLinkCurto();

    this.items = [
      {
        label: 'Apagar',
        icon: 'pi pi-trash',
      },
      {
        label: 'Editar',
        icon: 'pi pi-fw pi-pencil',
      },
      {
        label: 'Promocao Encerrada',
        icon: 'pi pi-fw pi-user',
      },
    ];
  }

  statusLinkCurto() {
    this.configSiteService.statusLinkCurto().subscribe(res => {
      this.linkCurto = res;
    })
  }

  statusLinkSemDominio(){
    this.configSiteService.statusLinkSemDominioOmc().subscribe(res => {
      this.linkSemDominio = res;
    });
  }

  listarProdutos() {
    this.produtoService.listarProduto(this.page, this.size).subscribe(response => {
      this.produtos = this.produtos.concat(response.content)
      this.totalPage = response.totalPages
    });
  }

  changePage(page: any) {
    this.page = page.page
    this.produtoService.listarProduto(this.page, this.size).subscribe((response: any) => {
      this.produtos = response.content
    });
  }

  apagarProduto(id: number, urlImagem: string, imagemSocial: string) {
    this.produtoService.apagarProduto(id, urlImagem, imagemSocial).subscribe(response => {
      this.messageService.add({ severity: 'success', detail: 'Produto Apagado' });
      this.produtos = [];
      this.listarProdutos();
    }, err => {
      this.produtos = [];
      this.listarProdutos();
      this.messageService.add({ severity: 'error', detail: 'Erro ao Apagar' });
      console.log(err);
    });
  }

  apagarVariosProdutos() {

    console.log(this.selectedProducts)

    this.produtoService.apagarVariosProdutos(this.selectedProducts).subscribe(response => {
      this.produtos = [];
      this.messageService.add({ severity: 'success', detail: 'Produtos Apagados' });
      this.listarProdutos();
    }, err => {
      this.messageService.add({ severity: 'error', detail: 'Erro ao Apagar' });
    });
  }

  copiarParaAreaTransferenciaLink(link: string) {
    this.clipboard.copy(link);
  }

  gerarStory(preco: string, titulo: string, urlImagem: string, frete: string, cupom: string, link: string) {

    this.copiarParaAreaTransferenciaLink(link);

    this.produtoService.gerarStory(preco, titulo, urlImagem, frete, cupom).subscribe(response => {

      // const contentDisposition = response.headers.get('content-disposition');
      // const fileName = contentDisposition!.split(';')[1].split('=')[1].trim();

      if (isPlatformBrowser(this.platformId)) {
        // Cria um URL para a Blob response
        const url = window.URL.createObjectURL(response.body!);

        // Cria um link temporário e simula um clique para iniciar o download
        const link = document.createElement('a');
        link.href = url;
        link.download = titulo;
        document.body.appendChild(link);
        link.click();

        // Limpa o URL criado
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      }
    }, err => {
      this.messageService.add({ severity: 'error', detail: 'Erro ao Gerar Storie' });
    })
  }

  async copiarParaAreaTransferencia(produtos: Produto, valor: number) {
    let post = await this.montarEstruturaCompartilhamento(produtos, valor); // ✅ Aguarda a montagem da estrutura

    if (valor === 1) {
      this.clipboard.copy(post);
    } else {
      post = post.replace(/_/g, '__');
      post = post.replace(/\*/g, '**');
      this.clipboard.copy(post);
    }

    this.messageService.add({ severity: 'success', detail: 'POST COPIADO' });
  }

  enviarTelegram(mensagem: string, url: string) {

    const mensagemEnviar = {
      mensagem: mensagem,
      url: url
    }

    this.mensagemService.enviarTelegram(mensagemEnviar).subscribe(response => {
      this.messageService.add({ severity: 'success', detail: 'ENVIADO PARA O TELEGRAM' });
      this.visible =! this.visible;
    }, err => {
      this.messageService.add({ severity: 'success', detail: 'ERRO AO ENVIAR' });
      this.visible =! this.visible;
    });
  }

  baixarImagem(local: string, imagem: string) {

    this.imagemService.baixarImagem(imagem, local).subscribe(response => {
      if (isPlatformBrowser(this.platformId)) {
        // Cria um URL para a Blob response
        const url = window.URL.createObjectURL(response.body!);

        // Cria um link temporário e simula um clique para iniciar o download
        const link = document.createElement('a');
        link.href = url;
        link.download = "teste";
        document.body.appendChild(link);
        link.click();

        // Limpa o URL criado
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      }
    }, err => {
      this.messageService.add({ severity: 'error', detail: 'Erro ao Gerar Storie' });
    })
  }

  async montarEstruturaCompartilhamento(produto: Produto, site: number) {
    let estruturaCompartilhamento = "";

    const adicionarTexto = (texto: string) => (estruturaCompartilhamento += texto + "\n");

    const montarTitulo = () => {
      if (produto.copy) {
        adicionarTexto(`*${produto.copy}*\n`);
      } else if (site === 2 || site === 1) {
        adicionarTexto(`\u{1F4CC} ${produto.titulo?.substring(0, 60) ?? ''}...\n`);
      } else {
        adicionarTexto(`\u{1F4CC} ${produto.titulo ?? ''}\n`);
      }
    };

    const montarPreco = () => {
      if (produto.freteVariacoes && produto.freteVariacoes.includes("CUPOM")) {
        adicionarTexto(`*\u{1F525} ${produto.preco} (Frete Grátis)*`);
      } else if (produto.parcelado && produto.parcelado.toLowerCase().includes("sem juros")) {
        adicionarTexto(`*\u{1F525} ${produto.preco} (Parcelado)*`);
      } else {
        adicionarTexto(`*\u{1F449}A Partir de ${produto.preco}\u{1F525}*`);
      }
    };

    const montarCupom = () => {
      if (produto.cupom) {
        adicionarTexto(
          produto.cupom.length < 20
            ? `\u{1F39F} Use o Cupom: *${produto.cupom}*`
            : `_\u{1F5E3} ${produto.cupom}_`
        );
      }
    };

    const montarLink = async () => {
      if (!isPlatformBrowser(this.platformId)) return;

      const baseUrl = window.location.href.replace(/painel(\/listar-produtos)?/, '');


      if (this.linkSemDominio) {
        if(produto.nomeLoja?.toLowerCase().includes("mercado") || produto.nomeLoja?.toLowerCase().includes("amazon") || produto.nomeLoja?.toLowerCase().includes("shop")) {
          if(site !== 2) {
            this.baixarImagem(produto.imagemSocial!, "produtos-real")
          }
          adicionarTexto(`\n*\u{1F6D2} Confira Aqui:\u{1F447}*\n${produto.link}\n`);
        } else if(produto.nomeLoja?.toLowerCase().includes("magazine luiza")) {
          await mostrarLinkCurtoApp(baseUrl);
        }else{
          adicionarTexto(`\n*\u{1F6D2} Confira Aqui:\u{1F447}*\n${baseUrl}oferta/${produto.id}?r=1\n`);
        }
      } else if(this.linkCurto) {
        if (produto.nomeLoja?.toLowerCase().includes("magazine luiza")) {
          await mostrarLinkCurtoApp(baseUrl);
        }else {
          adicionarTexto(`\n*\u{1F6D2} Confira Aqui:\u{1F447}*\n${baseUrl}oferta/${produto.id}?r=1\n`);
        }
      } else {
        const baseUrl = window.location.href.replace(/painel(\/listar-produtos)?/, '');
        adicionarTexto(`\n*\u{1F6D2} Confira Aqui:\u{1F447}*\n${baseUrl}oferta/${produto.id}\n`);
      }


    };

    const mostrarLinkCurtoApp = async (baseUrl: string) => {
      return new Promise<void>((resolve) => {
        this.produtoService.pegarProduto(produto.id, 0).subscribe({
          next: (res) => {
            if (res.linkAppSe?.includes("onelink")) {
              adicionarTexto(`\n*\u{1F6D2} Confira no Site Magalu:\u{1F447}*\n${baseUrl}oferta/${produto.id}?r=1\n`);
              adicionarTexto(`*\u{1F6D2} Confira no App Magalu:\u{1F447}*\n${baseUrl}oferta/${produto.id}?r=2\n`);
            } else {
              adicionarTexto(`\n*\u{1F6D2} Confira Aqui:\u{1F447}*\n${baseUrl}oferta/${produto.id}?r=1\n`);
            }
            resolve(); // Libera a execução
          },
          error: () => resolve() // Mesmo com erro, libera a execução
        });
      });
    };



    const montarExtras = () => {
      if (produto.freteVariacoes && produto.freteVariacoes.includes("CUPOM")) {
        adicionarTexto(`\u{1F4E6} ${produto.freteVariacoes}\n`);
      }
      if (produto.mensagemAdicional) {
        adicionarTexto(`_${produto.mensagemAdicional}_`);
      }
    };

    montarTitulo();
    montarPreco();
    montarCupom();
    await montarLink();
    montarExtras();

    return estruturaCompartilhamento.trim();
  }

  toggleMenu(productId: number) {
    if (this.openMenuId === productId) {
      this.openMenuId = null;
    } else {
      this.openMenuId = productId;
    }
  }

  showDialog(produto: Produto) {
    this.produto = produto;
    this.visible = !this.visible;
  }
}

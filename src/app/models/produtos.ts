import { Loja } from "./loja";

export class Produtos {

  public id!: number
  public titulo!: string
  public preco!: string
  public parcelado!: string
  public descricao!: string
  public dataCriacao!: string;
  public freteVariacoes!: string;
  public mensagemAdicional!: string;
  public cupom!: string
  public link!: string
  public linkOfm!: string
  public imagem!: string
  public loja!: Loja
  public imagemSocial!: string
  public copy!: string;
  public promocaoEncerrada!: boolean;
  constructor() { }
}

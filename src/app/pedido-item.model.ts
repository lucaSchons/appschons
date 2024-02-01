export interface pedidoItem {
    items: {
      produto: {
        descricao_produto: string;
        valor_unitario_produto: number;
        quantity: number;
        ingredientes: string | null;
        imageUrl: string | null;
      }[];
      valor_total: number | null;
    },
    user: {
      name: string | null,
      phone: string | null,
    } 
  }
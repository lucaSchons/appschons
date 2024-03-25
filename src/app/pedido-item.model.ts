export interface pedidoItem {
    items: {
      produto: {
        descricao: string;
        valor: number;
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
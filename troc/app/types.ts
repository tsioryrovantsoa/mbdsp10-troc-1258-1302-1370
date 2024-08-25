// app/types.ts
export interface Image {
    image_id: number;
    imageUrl: string;
  }
  
  export interface Item {
    itemId: string;
    title: string;
    description: string|null;
    category: string; // Assurez-vous que la catégorie correspond à une valeur de votre enum
    status: string;   // Assurez-vous que le statut correspond à une valeur de votre enum
    createdAt: string;
    updatedAt: string;
    images: Image[];
  }

  export enum ItemCategory {
    Electronics = 'Electronics',
    Clothing = 'Clothing',
    HomeGoods = 'HomeGoods',
    // Ajoutez d'autres catégories selon vos besoins
  }
  
  export enum ItemStatus {
    Available = 'Available',
    Sold = 'Sold',
    Pending = 'Pending',
    // Ajoutez d'autres statuts selon vos besoins
  }
  
  
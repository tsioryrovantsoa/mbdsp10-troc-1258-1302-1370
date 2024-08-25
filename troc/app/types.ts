// app/types.ts
export interface Image {
    image_id: number;
    imageUrl: string;
  }
  
  export interface Item {
    itemId: number;
    title: string;
    description: string|null;
    category: string; // Assurez-vous que la catégorie correspond à une valeur de votre enum
    status: string;   // Assurez-vous que le statut correspond à une valeur de votre enum
    createdAt: string;
    updatedAt: string;
    images: Image[];
  }
  
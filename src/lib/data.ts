import { PlaceHolderImages } from './placeholder-images';

export interface Colleague {
  id: string;
  name: string;
  role: string;
  photoUrl: string;
  photoHint: string;
}

const colleaguesData = [
  { id: '1', name: 'Ana Pérez', role: 'Diseñadora UX/UI' },
  { id: '2', name: 'Carlos García', role: 'Desarrollador Backend' },
  { id: '3', name: 'Luisa Fernández', role: 'Gerente de Proyecto' },
  { id: '4', name: 'Jorge Martínez', role: 'Ingeniero de Datos' },
];

export const colleagues: Colleague[] = colleaguesData.map((colleague) => {
    const placeholder = PlaceHolderImages.find(p => p.id === `colleague-${colleague.id}`);

    if (!placeholder) {
        // In a real app, you might have a default placeholder
        throw new Error(`Placeholder image not found for colleague id: ${colleague.id}`);
    }
    
    return {
        id: colleague.id,
        name: colleague.name,
        role: colleague.role,
        photoUrl: placeholder.imageUrl,
        photoHint: placeholder.imageHint
    }
});

import { PlaceHolderImages } from './placeholder-images';

export interface Colleague {
  id: string;
  name: string;
  role: string;
  photoUrl: string | null;
  photoHint: string | null;
}

const colleaguesData = [
  { id: '1', name: 'Ana Pérez', role: 'Diseñadora UX/UI' },
  { id: '2', name: 'Carlos García', role: 'Desarrollador Backend' },
  { id: '3', name: 'Luisa Fernández', role: 'Gerente de Proyecto' },
  { id: '4', name: 'Jorge Martínez', role: 'Ingeniero de Datos' },
  { id: '5', name: 'Sofía Rodríguez', role: 'Analista de Negocios' },
  { id: '6', name: 'Miguel González', role: 'Especialista en Marketing' },
  { id: '7', name: 'Valentina Torres', role: 'Desarrolladora Frontend' },
  { id: '8', name: 'Diego Rojas', role: 'Administrador de Sistemas' },
  { id: '9', name: 'Camila Díaz', role: 'Soporte Técnico' },
  { id: '10', name: 'Mateo Castillo', role: 'Diseñador Gráfico' },
  { id: '11', name: 'Isabella Vargas', role: 'Analista de Calidad (QA)' },
  { id: '12', name: 'Sebastián Morales', role: 'Scrum Master' },
  { id: '13', name: 'Usuario sin Foto', role: 'Tester' },
];

export const colleagues: Colleague[] = colleaguesData.map((colleague) => {
    const placeholder = PlaceHolderImages.find(p => p.id === `colleague-${colleague.id}`);

    return {
        id: colleague.id,
        name: colleague.name,
        role: colleague.role,
        photoUrl: placeholder?.imageUrl || null,
        photoHint: placeholder?.imageHint || null
    }
});

import { PlaceHolderImages } from './placeholder-images';

export interface Colleague {
  id: string;
  name: string;
  department: string;
  photoUrl: string | null;
  photoHint: string | null;
}

const colleaguesData = [
  { id: '1', name: 'Ana Pérez', department: 'Diseñadora UX/UI' },
  { id: '2', name: 'Carlos García', department: 'Desarrollador Backend' },
  { id: '3', name: 'Luisa Fernández', department: 'Gerente de Proyecto' },
  { id: '4', name: 'Jorge Martínez', department: 'Ingeniero de Datos' },
  { id: '5', name: 'Sofía Rodríguez', department: 'Analista de Negocios' },
  { id: '6', name: 'Miguel González', department: 'Especialista en Marketing' },
  { id: '7', name: 'Valentina Torres', department: 'Desarrolladora Frontend' },
  { id: '8', name: 'Diego Rojas', department: 'Administrador de Sistemas' },
  { id: '9', name: 'Camila Díaz', department: 'Soporte Técnico' },
  { id: '10', name: 'Mateo Castillo', department: 'Diseñador Gráfico' },
  { id: '11', name: 'Isabella Vargas', department: 'Analista de Calidad (QA)' },
  { id: '12', name: 'Sebastián Morales', department: 'Scrum Master' },
  { id: '13', name: 'Usuario sin Foto', department: 'Tester' },
];

export const colleagues: Colleague[] = colleaguesData.map((colleague) => {
    const placeholder = PlaceHolderImages.find(p => p.id === `colleague-${colleague.id}`);

    return {
        id: colleague.id,
        name: colleague.name,
        department: colleague.department,
        photoUrl: placeholder?.imageUrl || null,
        photoHint: placeholder?.imageHint || null
    }
});

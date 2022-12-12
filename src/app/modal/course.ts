import { Timestamp } from '@angular/fire/firestore';

export class Course {
  courseId: number;
  lecturerId: number;
  categoryId: number;
  courseDescription: string;
  courseName: string;
  imageUrl: string;
  credit: number;
  lastVisit: string;
  enrolled: boolean;
}

export class EnrollData {
  courseId: number;
  progress: string;
  lastVisit: Timestamp;
}

export class LecturerData {
  lecturerId: number;
  lecturerName: string;
  lecturerImageUrl: string;
}

export class CourseData {
  courseId: number;
  lecturerId: number;
  categoryId: number;
  courseName: string;
  courseDescription: string;
  credit: number;
  imageUrl: string;
  tools: ToolData[];
  lessons: LessonData[];
}

export class ToolData {
  toolName: string;
  toolImgUrl: string;
}

export class LessonData {
  lessonId: number;
  order: number;
  title: string;
  materials: Material[];
}

export class Material {
  materialId: number;
  order: number;
  type: number;
  description: string;
  url: string;
  createdDate: Timestamp;
}

export class Assignment {
  courseId: number;
  courseName: string;
  assignmentId: number;
  title: string;
  description: string;
  order: number;
  startDate: Timestamp;
  dueDate: Timestamp;
  references: Reference[];
  points: number;
  status: boolean;
  submission: string;
  id: string;
}

export class Reference {
  docUrl: string;
  docName: string;
  type: number;
}

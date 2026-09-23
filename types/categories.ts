import * as fs from 'fs';
import * as path from 'path';

// Define the 20 official sessions/categories and their exact question numbers
export const CATEGORY_MAP: Record<string, number[]> = {
  "Aufgaben des Staates": [46, 47, 68, 148],
  "Bildung": [2, 244, 257, 260, 261, 268, 270],
  "Der Nationalsozialismus und seine Folgen": [96, 111, 149, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 170, 181, 206, 288],
  "Deutschland in Europa": [173, 221, 222, 223, 224, 225, 226, 227, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 295],
  "Föderalismus": [24, 25, 37, 39, 49, 64, 67, 91, 219],
  "Grundrechte": [1, 4, 7, 8, 9, 10, 12, 14, 15, 16, 17, 18, 19, 245, 251, 262, 267, 272, 274, 281, 291, 292],
  "Interkulturelles Zusammenleben": [277, 278, 289],
  "Kommune": [56, 69, 126, 131, 134, 243, 253, 256, 265, 279],
  "Migrationsgeschichte": [297, 298, 299, 300],
  "Parteien": [20, 41, 43, 73, 76, 78, 79],
  "Pflichten": [3, 53, 95, 263, 266, 280, 282, 283],
  "Recht und Alltag": [104, 132, 136, 137, 138, 139, 140, 141, 142, 146, 147, 150, 241, 242, 246, 247, 248, 249, 250, 252, 254, 255, 258, 259, 264, 269, 271, 273, 275, 276, 284, 286, 287, 290, 293, 296],
  "Religiöse Vielfalt": [59, 66, 118, 182, 294],
  "Sozialsystem": [35, 36, 45, 97, 99, 100, 101, 285],
  "Staatssymbole": [21, 29, 40, 212, 214, 216],
  "Verfassungsorgane": [13, 42, 44, 48, 55, 57, 58, 60, 65, 70, 71, 72, 74, 75, 77, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 98, 102, 143, 144],
  "Verfassungsprinzipien": [5, 6, 11, 22, 23, 26, 27, 28, 30, 31, 32, 33, 34, 38, 50, 51, 52, 54, 61, 63, 145, 171],
  "Wahlen und Beteiligung": [62, 92, 93, 94, 103, 105, 106, 107, 108, 109, 110, 112, 113, 114, 115, 116, 117, 119, 120, 121, 122, 123, 124, 125, 127, 128, 129, 130, 133, 135],
  "Wichtige Stationen nach 1945": [151, 165, 166, 167, 168, 169, 172, 174, 175, 176, 177, 178, 179, 180, 183, 184, 185, 186, 187, 188, 189, 190, 199, 202, 203, 207, 208, 209, 210, 211, 213, 217, 220],
  "Wiedervereinigung": [191, 192, 193, 194, 195, 196, 197, 198, 200, 201, 204, 205, 215, 218, 228]
};

// Map each question number to its category and session info
export const SESSIONS_LIST = [
  { id: 1, name: "Aufgaben des Staates", count: 4, questions: [46, 47, 68, 148] },
  { id: 2, name: "Bildung", count: 7, questions: [2, 244, 257, 260, 261, 268, 270] },
  { id: 3, name: "Der Nationalsozialismus und seine Folgen", count: 20, questions: [96, 111, 149, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 170, 181, 206, 288] },
  { id: 4, name: "Deutschland in Europa", count: 21, questions: [173, 221, 222, 223, 224, 225, 226, 227, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 295] },
  { id: 5, name: "Föderalismus", count: 9, questions: [24, 25, 37, 39, 49, 64, 67, 91, 219] },
  { id: 6, name: "Grundrechte", count: 22, questions: [1, 4, 7, 8, 9, 10, 12, 14, 15, 16, 17, 18, 19, 245, 251, 262, 267, 272, 274, 281, 291, 292] },
  { id: 7, name: "Interkulturelles Zusammenleben", count: 3, questions: [277, 278, 289] },
  { id: 8, name: "Kommune", count: 10, questions: [56, 69, 126, 131, 134, 243, 253, 256, 265, 279] },
  { id: 9, name: "Migrationsgeschichte", count: 4, questions: [297, 298, 299, 300] },
  { id: 10, name: "Parteien", count: 7, questions: [20, 41, 43, 73, 76, 78, 79] },
  { id: 11, name: "Pflichten", count: 8, questions: [3, 53, 95, 263, 266, 280, 282, 283] },
  { id: 12, name: "Recht und Alltag", count: 36, questions: [104, 132, 136, 137, 138, 139, 140, 141, 142, 146, 147, 150, 241, 242, 246, 247, 248, 249, 250, 252, 254, 255, 258, 259, 264, 269, 271, 273, 275, 276, 284, 286, 287, 290, 293, 296] },
  { id: 13, name: "Religiöse Vielfalt", count: 5, questions: [59, 66, 118, 182, 294] },
  { id: 14, name: "Sozialsystem", count: 8, questions: [35, 36, 45, 97, 99, 100, 101, 285] },
  { id: 15, name: "Staatssymbole", count: 6, questions: [21, 29, 40, 212, 214, 216] },
  { id: 16, name: "Verfassungsorgane", count: 30, questions: [13, 42, 44, 48, 55, 57, 58, 60, 65, 70, 71, 72, 74, 75, 77, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 98, 102, 143, 144] },
  { id: 17, name: "Verfassungsprinzipien", count: 22, questions: [5, 6, 11, 22, 23, 26, 27, 28, 30, 31, 32, 33, 34, 38, 50, 51, 52, 54, 61, 63, 145, 171] },
  { id: 18, name: "Wahlen und Beteiligung", count: 30, questions: [62, 92, 93, 94, 103, 105, 106, 107, 108, 109, 110, 112, 113, 114, 115, 116, 117, 119, 120, 121, 122, 123, 124, 125, 127, 128, 129, 130, 133, 135] },
  { id: 19, name: "Wichtige Stationen nach 1945", count: 33, questions: [151, 165, 166, 167, 168, 169, 172, 174, 175, 176, 177, 178, 179, 180, 183, 184, 185, 186, 187, 188, 189, 190, 199, 202, 203, 207, 208, 209, 210, 211, 213, 217, 220] },
  { id: 20, name: "Wiedervereinigung", count: 15, questions: [191, 192, 193, 194, 195, 196, 197, 198, 200, 201, 204, 205, 215, 218, 228] }
];

export function getCategoryForNum(num: number): { category: string; sessionId: number; sessionName: string } {
  for (const session of SESSIONS_LIST) {
    if (session.questions.includes(num)) {
      return {
        category: session.name,
        sessionId: session.id,
        sessionName: `Session ${session.id}: ${session.name}`
      };
    }
  }
  return { category: "Allgemein", sessionId: 0, sessionName: "General" };
}

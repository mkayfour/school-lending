export type Role = "STUDENT" | "STAFF" | "ADMIN";

export interface Equipment {
  id: number;
  name: string;
  category: string;
  condition: string;
  quantity: number;
  availableQuantity: number;
}

export type Status = "REQUESTED" | "APPROVED" | "REJECTED" | "RETURNED";

export interface BorrowRequest {
  id: number;
  userId: number;
  equipmentId: number;
  status: Status;
  borrowDate: string;
  returnDate: string;
  user?: { name: string; role: Role };
  equipment?: Equipment;
}

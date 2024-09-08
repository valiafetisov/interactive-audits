export interface Audit {
  id: string;
  title: string;
  data: string;
  createdAt: Date;
  attestedAt?: Date;
  attestationId?: string;
}

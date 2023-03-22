export interface INote {
  id: string;
  title: string;
  description: string;
  createdAt: number;
  tags: string[];
}

export interface ICreateNote {
  title: string;
  description: string;
  tags: string[];
}

export interface IUpdateNote {
  title?: string;
  description?: string;
  tags?: string[];
}

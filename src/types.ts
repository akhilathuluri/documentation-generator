export interface Repository {
  url: string;
  name: string;
  description: string;
  files: RepositoryFile[];
  readme?: string;
  language: string;
  stars: number;
  forks: number;
  issues: number;
  license?: string;
  lastUpdate: string;
}

export interface RepositoryFile {
  name: string;
  path: string;
  content: string;
  type: 'file' | 'directory';
}

export interface GeneratedDoc {
  content: string;
  repository: Repository;
}